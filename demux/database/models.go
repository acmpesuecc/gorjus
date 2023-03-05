package database

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	name     string
	email    string
	password string
}

type Question struct {
	gorm.Model
	number             int
	difficulty         int
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
