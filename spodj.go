package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"

	"encoding/json"

	"github.com/zmb3/spotify"
)

const (
	redirectURI = "http://localhost:9090/callback"
	chars       = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	dateFormat  = "2006-01-02_03:04:05"
)

var (
	scope = []string{spotify.ScopeUserReadPrivate, spotify.ScopePlaylistModifyPrivate, spotify.ScopePlaylistReadPrivate}
	auth  = spotify.NewAuthenticator(redirectURI, scope...)
	ch    = make(chan *spotify.Client)
	state = randState(16)
)

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
	LiveLow    float64  `json:"liveLow"`
	LiveHigh   float64  `json:"liveHigh"`
	LoudLow    float64  `json:"loudLow"`
	LoudHigh   float64  `json:"loudHigh"`
	PopLow     int      `json:"popLow"`
	PopHigh    int      `json:"popHigh"`
	MoodLow    float64  `json:"moodLow"`
	MoodHigh   float64  `json:"moodHigh"`
	Genres     []string `json:"genres"`
}

func randState(n int) string {
	rand.Seed(time.Now().UnixNano())
	b := make([]byte, n)
	for i := range b {
		b[i] = chars[rand.Intn(len(chars))]
	}
	return string(b)
}

func main() {
	http.HandleFunc("/callback", completeAuth)
	http.HandleFunc("/api", doAPI)
	// http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	// 	log.Println("Got request for:", r.URL.String())
	// })
	http.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir("./frontend/"))))
	log.Fatal(http.ListenAndServe(":9090", nil))
}

// 	go http.ListenAndServe(":8080", nil)

// 	url := auth.AuthURL(state)
// 	open.Start(url)

// 	c := <-ch
// 	client := &Client{
// 		c,
// 	}

// 	tracks, err := client.getRecs()
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	plURL, err := client.createPlaylist(tracks)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	open.Start(plURL)
// }

func doAPI(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var a APIReq
	err := decoder.Decode(&a)
	if err != nil {
		http.Error(w, "Couldn't parse JSON", http.StatusInternalServerError)
		log.Fatal(err)
	}
	defer r.Body.Close()
	log.Printf("%#v\n", a)
	js, err := json.MarshalIndent(a, "", "\t")
	if err != nil {
		log.Printf("could not Marshal JSON %s\n", err)
	}
	log.Printf(string(js))

	url := auth.AuthURL(state)
	log.Printf("%s\n", url)
	http.Redirect(w, r, url, http.StatusFound)
	//open.Start(url)
	go func() {
		log.Println("waiting for channel")
		c := <-ch

		log.Println("received channel")
		client := &Client{
			c,
		}

		log.Println("getting reccomendations")
		tracks, err := client.getRecs(a)
		if err != nil {
			log.Fatalf("could not getRecs %s", err)
		}

		log.Println("creating playlist")
		plURL, err := client.createPlaylist(tracks)
		if err != nil {
			log.Fatalf("could not create playlist %s", err)
		}
		log.Printf("%s\n", plURL)
	}()
	//open.Start(plURL)
}

func completeAuth(w http.ResponseWriter, r *http.Request) {
	tok, err := auth.Token(state, r)
	if err != nil {
		http.Error(w, "Couldn't get token", http.StatusForbidden)
		log.Fatal(err)
	}
	if st := r.FormValue("state"); st != state {
		http.NotFound(w, r)
		log.Fatalf("State mismatch: %s != %s\n", st, state)
	}
	client := auth.NewClient(tok)
	//fmt.Fprintf(w, "<script>window.close();</script>")
	ch <- &client
}

// Client is a wrapped Spotify Client
type Client struct {
	*spotify.Client
}

// Playlist contains config and returned values
type Playlist struct {
	*spotify.Recommendations
	seeds spotify.Seeds
	attrs *spotify.TrackAttributes
	opts  *spotify.Options
}

func (client *Client) createPlaylist(pl *Playlist) (string, error) {
	user, err := client.CurrentUser()
	if err != nil {
		return "", fmt.Errorf("error getting user: %s", err)
	}
	t := time.Now()
	var genres string
	for _, genre := range pl.seeds.Genres {
		genres += "_" + genre
	}
	list, err := client.CreatePlaylistForUser(user.ID, t.Format(dateFormat)+genres, false)
	if err != nil {
		return "", fmt.Errorf("error creating playlist for user: %s", err)
	}
	tracks := pl.Tracks
	//log.Printf("playlist tracks: %d\n%v\n", len(tracks), tracks)
	if len(tracks) == 0 {
		return "", fmt.Errorf("No tracks returned")
	}
	ids := make([]spotify.ID, len(tracks))
	for n, track := range tracks {
		ids[n] = track.ID
	}
	_, err = client.AddTracksToPlaylist(user.ID, list.ID, ids...)
	if err != nil {
		return "", fmt.Errorf("error adding tracks to playlist: %s", err)
	}
	return list.ExternalURLs["spotify"], nil
}

func (client *Client) getRecs(r APIReq) (*Playlist, error) {
	seeds := spotify.Seeds{
		//Genres: []string{"hip-hop"},
		Genres: r.Genres,
	}
	attrs := spotify.NewTrackAttributes().
		MinTempo(r.BPMLow).
		MaxTempo(r.BPMHigh).
		// MinDanceability(r.DanceLow).
		// MaxDanceability(r.DanceHigh).
		// MinEnergy(r.NRGLow).
		// MaxEnergy(r.NRGHigh).
		// MinAcousticness(r.AcoustLow).
		// MaxAcousticness(r.AcoustHigh).
		// MinLiveness(r.LiveLow).
		// MaxLiveness(r.LiveHigh).
		// MinLoudness(r.LoudLow).
		// MaxLoudness(r.LoudHigh).
		MinPopularity(r.PopLow).
		MaxPopularity(r.PopHigh)
		// MinValence(r.MoodLow).
		// MaxValence(r.MoodHigh)
	country := "AU"
	limit := 10
	opts := &spotify.Options{
		Country: &country,
		Limit:   &limit,
	}
	recs, err := client.GetRecommendations(seeds, attrs, opts)
	if err != nil {
		return nil, err
	}
	pl := &Playlist{
		recs,
		seeds,
		attrs,
		opts,
	}
	return pl, nil
}
