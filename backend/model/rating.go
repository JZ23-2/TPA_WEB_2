package model

type Rating struct {
	RatingID    uint `gorm:"primaryKey;autoIncrement"`
	Cleanliness int
	Comfort     int
	Location    int
	Service     int
}

type RatingDetail struct {
	RatingID uint
	HotelID  uint
	UserID   uint
}

type RatingInput struct {
	RatingID    uint
	Cleanliness int
	Comfort     int
	Location    int
	Service     int
	HotelID     uint
	UserID      uint
}
