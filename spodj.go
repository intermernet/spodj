package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/rs/cors"
	"github.com/satori/go.uuid"
	"github.com/zmb3/spotify"
)

const (
	dateFormat = "2006-01-02_03:04:05"
)

var (
	port        int
	baseURI     string
	redirectURI string
	scope       = []string{spotify.ScopeUserReadPrivate, spotify.ScopePlaylistModifyPrivate, spotify.ScopePlaylistReadPrivate}
	auth        spotify.Authenticator
	clMap       = new(ClientMap)
)

func init() {
	flag.IntVar(&port, "port", 9090, "TCP/IP Port to listen on")
	flag.StringVar(&baseURI, "baseuri", "http://localhost", "Base URL to listen on")
	redirectURI = baseURI + "/callback"
	auth = spotify.NewAuthenticator(redirectURI, scope...)
	clMap.list = make(map[string]Client)
}

// Client is a wrapped Spotify Client
type Client struct {
	a     *APIReq
	state string
	*spotify.Client
}

type ClientMap struct {
	sync.RWMutex
	list map[string]Client
}

func (cm *ClientMap) Set(s string, c Client) {
	cm.Lock()
	defer cm.Unlock()
	cm.list[s] = c
}

func (cm *ClientMap) Get(s string) Client {
	cm.Lock()
	defer cm.Unlock()
	return cm.list[s]
}

func (cm *ClientMap) Delete(s string) {
	cm.Lock()
	defer cm.Unlock()
	delete(cm.list, s)
}

// APIReq contains the playlist parameters
type APIReq struct {
	Name       string   `json:"name"`
	BPMLow     float64  `json:"bpmLow"`
	BPMHigh    float64  `json:"bpmHigh"`
	DanceLow   float64  `json:"danceLow"`
	DanceHigh  float64  `json:"danceHigh"`
	NRGLow     float64  `json:"nrgLow"`
	NRGHigh    float64  `json:"nrgHigh"`
	AcoustLow  float64  `json:"acoustLow"`
	AcoustHigh float64  `json:"acoustHigh"`
	PopLow     int      `json:"popLow"`
	PopHigh    int      `json:"popHigh"`
	MoodLow    float64  `json:"moodLow"`
	MoodHigh   float64  `json:"moodHigh"`
	Genres     []string `json:"genres"`
}

func main() {
	flag.Parse()
	p := strconv.Itoa(port)
	mux := http.NewServeMux()
	c := cors.New(cors.Options{
		AllowedOrigins: []string{baseURI},
	})
	mux.HandleFunc("/callback", completeAuth)
	mux.HandleFunc("/api", doAPI)
	mux.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir("./frontend/"))))
	handler := c.Handler(mux)
	log.Fatal(http.ListenAndServe(":"+p, handler))
}

func doAPI(w http.ResponseWriter, r *http.Request) {
	c := Client{
		a:     &APIReq{},
		state: uuid.NewV4().String(),
	}
	defer r.Body.Close()
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(c.a)
	if err != nil {
		http.Error(w, "could not decode JSON", http.StatusInternalServerError)
		log.Printf("could not decode JSON. %s", err)
	}
	url := auth.AuthURL(c.state)
	clMap.Set(c.state, c)
	w.Write([]byte("{\"url\":\"" + url + "\"}"))
}

func completeAuth(w http.ResponseWriter, r *http.Request) {
	c := clMap.Get(r.FormValue("state"))
	tok, err := auth.Token(c.state, r)
	if err != nil {
		http.Error(w, "could not get token", http.StatusInternalServerError)
		log.Printf("could not get token %s\n", err)
	}
	if st := r.FormValue("state"); st != c.state {
		http.NotFound(w, r)
		log.Fatalf("state mismatch: %s != %s\n", st, c.state)
	}
	cl := auth.NewClient(tok)
	c = Client{
		c.a,
		c.state,
		&cl,
	}
	pl, err := c.getRecs(c.a)
	if err != nil {
		http.Error(w, "could not get recommendations", http.StatusInternalServerError)
		log.Fatalf("could not get recommendations %s", err)
	}
	plURL, err := c.createPlaylist(pl, c.a.Name)
	if err != nil {
		http.Error(w, "could not create playlist", http.StatusInternalServerError)
		log.Printf("could not create playlist %s", err)
	}
	log.Printf("%s\n", plURL)
	clMap.Delete(c.state)
	http.Redirect(w, r, baseURI, http.StatusFound)
}

// Playlist contains config and returned values
type Playlist struct {
	*spotify.Recommendations
	seeds spotify.Seeds
}

func (c Client) createPlaylist(pl *Playlist, name string) (string, error) {
	user, err := c.CurrentUser()
	if err != nil {
		return "", fmt.Errorf("error getting user: %s", err)
	}
	if name == "" {
		var genres string
		for _, genre := range pl.seeds.Genres {
			genres += "_" + genre
		}
		t := time.Now()
		name = t.Format(dateFormat) + genres
	}
	list, err := c.CreatePlaylistForUser(user.ID, name, false)
	if err != nil {
		return "", fmt.Errorf("error creating playlist for user: %s", err)
	}
	tracks := pl.Tracks
	if len(tracks) == 0 {
		return "", fmt.Errorf("No tracks returned")
	}
	ids := make([]spotify.ID, len(tracks))
	for n, track := range tracks {
		ids[n] = track.ID
	}
	_, err = c.AddTracksToPlaylist(user.ID, list.ID, ids...)
	if err != nil {
		return "", fmt.Errorf("error adding tracks to playlist: %s", err)
	}
	return list.ExternalURLs["spotify"], nil
}

func (c Client) getRecs(r *APIReq) (*Playlist, error) {
	seeds := spotify.Seeds{
		Genres: r.Genres,
	}
	attrs := spotify.NewTrackAttributes().
		MinTempo(r.BPMLow).
		MaxTempo(r.BPMHigh).
		MinDanceability(r.DanceLow).
		MaxDanceability(r.DanceHigh).
		MinEnergy(r.NRGLow).
		MaxEnergy(r.NRGHigh).
		MinAcousticness(r.AcoustLow).
		MaxAcousticness(r.AcoustHigh).
		MinPopularity(r.PopLow).
		MaxPopularity(r.PopHigh).
		MinValence(r.MoodLow).
		MaxValence(r.MoodHigh)
	country := "AU"
	limit := 10
	opts := &spotify.Options{
		Country: &country,
		Limit:   &limit,
	}
	recs, err := c.GetRecommendations(seeds, attrs, opts)
	if err != nil {
		return nil, err
	}
	pl := &Playlist{
		recs,
		seeds,
	}
	return pl, nil
}
