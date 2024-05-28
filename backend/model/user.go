package model

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	UserID           uint `gorm:"primaryKey;autoIncrement"`
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
}

type OTPUser struct {
	UserID        uint
	Email         string
	OTP           string
	AccountStatus int
}
