package model

import (
	"time"
)

type Flight struct {
	FlightID   uint `gorm:"primaryKey;autoIncrement"`
	FlightCode string
	FlightName string
}

type Origin struct {
	OriginID   uint `gorm:"primaryKey;autoIncrement"`
	OriginName string
}

type Destination struct {
	DestinationID   uint `gorm:"primaryKey;autoIncrement"`
	DestinationName string
}

type DestinationDetail struct {
	DestinationID      uint
	DestinationPicture string
}

type Seat struct {
	SeatID    uint `gorm:"primaryKey;autoIncrement"`
	SeatClass string
}

type SeatDetail struct {
	SeatID     uint
	FlightID   uint
	ID         uint
	UserID     uint
	SeatStatus int
}

type SeatResponse struct {
	SeatID     uint
	FlightID   uint
	SeatClass  string
	ID         uint
	UserID     uint
	SeatStatus int
}

type FlightDetail struct {
	ID              uint `gorm:"primaryKey;autoIncrement"`
	FlightID        uint
	OriginID        uint
	DestinationID   uint
	DestinationDate time.Time
	ArrivalDate     time.Time
	FlightDuration  int
	SeatAvailable   int
	FlightPrice     int
	Status          int
	TransitStatus   int
}

type FlightAddDetail struct {
	ID              uint
	FlightID        uint
	OriginID        uint
	DestinationID   uint
	DestinationDate time.Time
	ArrivalDate     time.Time
	FlightDuration  int
	SeatAvailable   int
	FlightPrice     int
	Status          int
	TransitStatus   int
	SeatID          uint
	SeatClass       string
	UserID          uint
	SeatStatus      int
}

type FlightDetailResponse struct {
	ID              uint
	FlightID        uint
	FlightCode      string
	FlightName      string
	OriginID        uint
	OriginName      string
	DestinationID   uint
	DestinationName string
	DestinationDate time.Time
	ArrivalDate     time.Time
	FlightDuration  int
	SeatAvailable   int
	FlightPrice     int
	Status          int
	TransitStatus   int
}
