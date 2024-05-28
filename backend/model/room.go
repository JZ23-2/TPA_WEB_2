package model

import (
	"time"
)

type Room struct {
	RoomID   uint `gorm:"primaryKey;autoIncrement"`
	RoomName string
}

type RoomFacility struct {
	RoomFacilityID uint `gorm:"primaryKey;autoIncrement"`
	FacilityName   string
}

type RoomPicture struct {
	RoomID      uint
	HotelID     uint
	RoomPicture string
}

type RoomFacilityDetail struct {
	RoomID         uint
	HotelID        uint
	RoomFacilityID uint
}

type RoomDetail struct {
	RoomID        uint
	HotelID       uint
	RoomPrice     int
	RoomCapacity  int
	AvailableDate time.Time
	Status        int
}

type RoomDetailResponse struct {
	RoomID        uint
	HotelID       uint
	RoomPrice     int
	RoomCapacity  int
	AvailableDate time.Time
	Status        int
	RoomPicture   []string
	FacilityName  []int
}

type AllRoomDetail struct {
	RoomID        uint
	HotelID       uint
	RoomName      string
	HotelName     string
	RoomPrice     int
	RoomCapacity  int
	AvailableDate time.Time
	Status        int
	RoomPicture   []string
	FacilityName  []string
}
