package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/rs/cors"
	"github.com/satori/go.uuid"
	"github.com/zmb3/spotify"
)

const (
	dateFormat = "2006-01-02_03:04:05"
)

var (
	port        = ":9090"
	baseURI     = "http://localhost" + port
	redirectURI = baseURI + "/callback"
	scope       = []string{spotify.ScopeUserReadPrivate, spotify.ScopePlaylistModifyPrivate, spotify.ScopePlaylistReadPrivate}
	auth        = spotify.NewAuthenticator(redirectURI, scope...)
)

// Client is a wrapped Spotify Client
type Client struct {
	a     *APIReq
	state uuid.UUID
	*spotify.Client
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
	mux := http.NewServeMux()
	c := cors.New(cors.Options{
		AllowedOrigins: []string{baseURI},
	})
	client := &Client{
		a:     &APIReq{},
		state: uuid.NewV4(),
	}
	mux.HandleFunc("/callback", client.completeAuth)
	mux.HandleFunc("/api", client.doAPI)
	mux.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir("./frontend/"))))
	handler := c.Handler(mux)
	log.Fatal(http.ListenAndServe(port, handler))
}

func (c *Client) doAPI(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(c.a)
	if err != nil {
		http.Error(w, "could not decode JSON", http.StatusInternalServerError)
		log.Printf("could not decode JSON. %s", err)
	}
	js, err := json.MarshalIndent(c.a, "", "\t")
	if err != nil {
		http.Error(w, "could not marshal JSON", http.StatusInternalServerError)
		log.Printf("could not marshal JSON %s\n", err)
	}
	log.Printf(string(js))
	url := auth.AuthURL(c.state.String())
	log.Printf("%s\n", url)
	log.Println("redirecting...")
	w.Write([]byte("{\"url\":\"" + url + "\"}"))
}

func (c *Client) completeAuth(w http.ResponseWriter, r *http.Request) {
	log.Println("getting token...")
	tok, err := auth.Token(c.state.String(), r)
	if err != nil {
		http.Error(w, "could not get token", http.StatusInternalServerError)
		log.Printf("could not get token %s\n", err)
	}
	if st := r.FormValue("state"); st != c.state.String() {
		http.NotFound(w, r)
		log.Fatalf("state mismatch: %s != %s\n", st, c.state)
	}
	log.Println("authorizing token...")
	cl := auth.NewClient(tok)
	c = &Client{
		c.a,
		c.state,
		&cl,
	}
	log.Println("getting recommendations")
	pl, err := c.getRecs(c.a)
	if err != nil {
		http.Error(w, "could not get recommendations", http.StatusInternalServerError)
		log.Fatalf("could not get recommendations %s", err)
	}
	log.Println("creating playlist")
	plURL, err := c.createPlaylist(pl, c.a.Name)
	if err != nil {
		http.Error(w, "could not create playlist", http.StatusInternalServerError)
		log.Printf("could not create playlist %s", err)
	}
	log.Printf("%s\n", plURL)
	http.Redirect(w, r, baseURI, http.StatusFound)
}

// Playlist contains config and returned values
type Playlist struct {
	*spotify.Recommendations
	seeds spotify.Seeds
}

func (c *Client) createPlaylist(pl *Playlist, name string) (string, error) {
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

func (c *Client) getRecs(r *APIReq) (*Playlist, error) {
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
