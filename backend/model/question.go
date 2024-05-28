package model

import (
	"time"
)

type Question struct {
	QuestionID uint `gorm:"primaryKey;autoIncrement"`
	Question   string
}

type QuestionDetail struct {
	QuestionID uint
	UserID     uint
	Answer     string
}

type RegisterUser struct {
	FirstName        string
	LastName         string
	Age              int
	Password         string
	Email            string
	Gender           string
	QuestionID       uint
	DateOfBirth      time.Time
	ProfiePicture    string
	SubscribeStatus  int
	Status           int
	Role             string
	AccountStatus    int
	CreditCardNumber string
	WalletAmount     uint
	UserID           uint
	Answer           string
}
