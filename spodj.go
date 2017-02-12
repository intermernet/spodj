package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/skratchdot/open-golang/open"
	"github.com/zmb3/spotify"
)

const (
	redirectURI = "http://localhost:8080/callback"
	chars       = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	dateFormat  = "2006-01-02_03:04:05"
)

var (
	scope = []string{spotify.ScopeUserReadPrivate, spotify.ScopePlaylistModifyPrivate, spotify.ScopePlaylistReadPrivate}
	auth  = spotify.NewAuthenticator(redirectURI, scope...)
	ch    = make(chan *spotify.Client)
	state = randState(16)
)

func randState(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = chars[rand.Intn(len(chars))]
	}
	return string(b)
}

func main() {
	http.HandleFunc("/callback", completeAuth)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		log.Println("Got request for:", r.URL.String())
	})
	go http.ListenAndServe(":8080", nil)

	url := auth.AuthURL(state)
	open.Start(url)

	c := <-ch
	client := &Client{
		c,
	}

	tracks, err := client.getRecs()
	if err != nil {
		log.Fatal(err)
	}
	plURL, err := client.createPlaylist(tracks)
	if err != nil {
		log.Fatal(err)
	}
	open.Start(plURL)
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
	fmt.Fprintf(w, "<script>window.close();</script>")
	ch <- &client
}

type Client struct {
	*spotify.Client
}

type Playlist struct {
	*spotify.Recommendations
	seeds spotify.Seeds
	attrs *spotify.TrackAttributes
	opts  *spotify.Options
}

func (client *Client) createPlaylist(pl *Playlist) (string, error) {
	user, err := client.CurrentUser()
	if err != nil {
		return "", err
	}
	t := time.Now()
	var genres string
	for _, genre := range pl.seeds.Genres {
		genres += "_" + genre
	}
	list, err := client.CreatePlaylistForUser(user.ID, t.Format(dateFormat)+genres, false)
	if err != nil {
		return "", err
	}
	tracks := pl.Tracks
	ids := make([]spotify.ID, len(tracks))
	for n, track := range tracks {
		ids[n] = track.ID
	}
	_, err = client.AddTracksToPlaylist(user.ID, list.ID, ids...)
	if err != nil {
		return "", err
	}
	return list.ExternalURLs["spotify"], nil
}

func (client *Client) getRecs() (*Playlist, error) {
	seeds := spotify.Seeds{
		Genres: []string{"hip-hop"},
	}
	attrs := spotify.NewTrackAttributes().
		TargetTempo(110.0)
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
