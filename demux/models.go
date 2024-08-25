package main

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string
	Email    string
	Password string
}

type Question struct {
	gorm.Model
	Number             int
	Difficulty         int
	Round              int
	Reference_img_path string
	Accuracy_threshold float64
}

type RenderEvent struct {
	gorm.Model
	User                  User
	Question              Question
	Css_content           string
	Rendered_output_image []byte
	Rendered_time         time.Time
}

type CompareEvent struct {
	gorm.Model
	User                User
	Question            Question
	Render_event        RenderEvent
	Accuracy_percentage float64
}

type LeaderboardRecord struct {
	gorm.Model
	User     User
	Question Question
	Points   int
}
