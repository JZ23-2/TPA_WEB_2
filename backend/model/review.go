package model

import (
	"time"

	"gorm.io/gorm"
)

type Review struct {
	ReviewID      uint `gorm:"primaryKey;autoIncrement"`
	ReviewContent string
}

type ReviewDetail struct {
	gorm.Model
	ReviewID   uint
	HotelID    uint
	UserID     uint
	ReviewDate time.Time
}

type ReviewInput struct {
	ReviewID      uint
	ReviewContent string
	HotelID       uint
	UserID        uint
	ReviewDate    time.Time
}
