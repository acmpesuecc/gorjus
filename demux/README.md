# Demux

Demux is the frontend service used to talk to comparator and store information such as leaderboard. It is written in Go.

## Build and Run Instructions (Dockerfile)

```
$ docker build -t gorjus-demux .
$ docker run -p 8080:8080 gorjus-demux:latest
```
