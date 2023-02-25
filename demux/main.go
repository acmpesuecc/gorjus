package main

import (
	"fmt"
	"net/http"
)

func main() {

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
		// TODO Talk to the Comparator Service
		w.Write([]byte("compare"))
	})

	http.ListenAndServe(":8080", server)
	fmt.Println("Hello, world!")
}
