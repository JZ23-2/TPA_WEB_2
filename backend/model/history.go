package model

import "time"

type FlightHistory struct {
	UserID          uint
	FlightID        uint
	FlightCode      string
	FlightName      string
	FlightDuration  int
	FlightPrice     int
	DestinationName string
	OriginName      string
	SeatAvailable   int
	Status          int
	Quantity        int
	DestinationDate time.Time
	ArrivalDate     time.Time
}

type RoomHistory struct {
	UserID       uint
	HotelID      uint
	RoomID       uint
	HotelName    string
	RoomName     string
	RoomPrice    int
	RoomCapacity int
	CheckInDate  time.Time
	CheckOutDate time.Time
	Status       int
}

type RoomHistoryResponse struct {
	UserID       uint
	HotelID      uint
	RoomID       uint
	HotelName    string
	RoomName     string
	RoomPrice    int
	RoomCapacity int
	CheckInDate  time.Time
	CheckOutDate time.Time
	Status       int
	RoomPicture  []string
}
