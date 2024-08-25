package database

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
	number             int
	difficulty         int
	hexcodes           string
	round              int
	reference_img      []byte
	accuracy_threshold float64
}

type RenderEvent struct {
	gorm.Model
	UserID                int
	User                  User
	QuestionID            int
	Question              Question
	Css_content           string
	Rendered_output_image []byte
	Rendered_time         time.Time
}

type CompareEvent struct {
	gorm.Model
	UserID              int
	User                User
	QuestionID          int
	Question            Question
	RenderEventID       int
	RenderEvent         RenderEvent
	Accuracy_percentage float64
}

type LeaderboardRecord struct {
	gorm.Model
	UserID     int
	User       User
	QuestionID int
	Question   Question
	Points     int
}

type Sessions struct {
	gorm.Model
	UserID int
	User   User
	Name   string
	Token  string
}
