package model

import "time"

type FlightCart struct {
	UserID   uint
	FlightID uint
	ID       uint
	Quantity int
}

type RoomCart struct {
	UserID  uint
	RoomID  uint
	HotelID uint
}

type FlightUserCart struct {
	UserID          uint
	FlightID        uint
	FlightCode      string
	FlightName      string
	FlightDuration  int
	FlightPrice     int
	DestinationName string
	OriginName      string
	SeatAvailable   int
	Quantity        int
	DestinationDate time.Time
	ArrivalDate     time.Time
	ID              uint
}

type RoomUserCart struct {
	UserID        uint
	HotelID       uint
	RoomID        uint
	HotelName     string
	RoomName      string
	RoomPrice     int
	RoomCapacity  int
	AvailableDate time.Time
}

type RoomCartResponse struct {
	UserID        uint
	HotelID       uint
	RoomID        uint
	HotelName     string
	RoomName      string
	RoomPrice     int
	RoomCapacity  int
	AvailableDate time.Time
	RoomPicture   []string
}
