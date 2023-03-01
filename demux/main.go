package main

import (
	"fmt"
	"net/http"
	"time"

	"gorm.io/driver/sqlite" // Sqlite driver based on GGO
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	name     string
	email    string
	password string
}

type Question struct {
	number             int
	round              int
	reference_img      []byte
	accuracy_threshold float64
}

type RenderEvent struct {
	gorm.Model
	user                  User
	question              Question
	css_content           string
	rendered_output_image []byte
	rendered_time         time.Time
}

type CompareEvent struct {
	gorm.Model
	user                User
	question            Question
	render_event        RenderEvent
	accuracy_percentage float64
}

type LeaderboardRecord struct {
	gorm.Model
	question Question
	points   int
}

func main() {

	// github.com/mattn/go-sqlite3
	db, err := gorm.Open(sqlite.Open("gorm.db"), &gorm.Config{})
	if err != nil {
		panic("error " + err)
	}

	server := http.NewServeMux()

	server.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("pong"))
	})

	server.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("login"))
	})

	server.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("register"))
	})

	server.HandleFunc("/leaderboard", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("leaderboard"))
	})

	server.HandleFunc("/challenges", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("challenges"))
	})

	server.HandleFunc("/compare", func(w http.ResponseWriter, r *http.Request) {

		// Takes in:
		// [UserID: String, RefImage: Byte[], UserImge: Byte[]]
		// TODO look at taking in a reference image ID
		// Returns:
		// [accuracy: float]
		// Make a call to the comparator service here and proxy the response

		// TODO Talk to the Comparator Service
		w.Write([]byte("compare"))
	})

	server.HandleFunc("/render", func(w http.ResponseWriter, r *http.Request) {
		// Takes in:
		// [UserID: String, UserHTMLnCSS: String]
		// Returns:
		// [RenderedImge: Byte[]]

		// TODO Talk to the Comparator Service
		w.Write([]byte("render"))

	})

	http.ListenAndServe(":8080", server)
	fmt.Println("Hello, world!")
}
