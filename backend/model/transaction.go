package model

import (
	"time"
)

type TransactionHeader struct {
	TransactionID   uint `gorm:"primaryKey;autoIncrement"`
	UserID          uint
	TransactionDate time.Time
	PromoID         uint
	LagguageStatus  int
	Status          int
}

type TransactionFlightDetail struct {
	TransactionID uint
	FlightID      uint
	ID            uint
	Quantity      int
}

type TransactionRoomDetail struct {
	TransactionID uint
	RoomID        uint
	HotelID       uint
	CheckInDate   time.Time
	CheckOutDate  time.Time
}

type TransactionRoomDetailResponse struct {
	TransactionID   uint
	RoomID          uint
	HotelID         uint
	CheckInDate     time.Time
	CheckOutDate    time.Time
	UserID          uint
	TransactionDate time.Time
	PromoID         uint
	WalletAmount    uint
}

type TransactionFlightDetailResponse struct {
	TransactionID   uint
	FlightID        uint
	ID              uint
	Quantity        int
	UserID          uint
	TransactionDate time.Time
	PromoID         uint
	LagguageStatus  int
	Status          int
	SeatID          []uint
	WalletAmount    uint
}

type HotelRecommendation struct {
	HotelID          uint
	HotelName        string
	HotelDescription string
	HotelAddress     string
	Count            int
}

type HotelRecommendationResponse struct {
	HotelID          uint
	HotelName        string
	HotelDescription string
	HotelAddress     string
	HotelPicture     []string
	Count            int
}

type FlightRecommendation struct {
	FlightName         string  `gorm:"column:flight_name"`
	FamousCountry      int     `gorm:"column:famous_country"`
	TotalBooked        int     `gorm:"column:total_booked"`
	AveragePrice       float64 `gorm:"column:average_price"`
	DestinationName    string  `gorm:"column:destination_name"`
	DestinationPicture string  `gorm:"column:destination_picture"`
}
