package model

type Hotel struct {
	HotelID          uint `gorm:"primaryKey;autoIncrement"`
	HotelName        string
	HotelDescription string
	HotelAddress     string
}

type HotelFacility struct {
	HotelFacilityID uint `gorm:"primaryKey;autoIncrement"`
	FacilityName    string
}

type HotelFacilityDetail struct {
	HotelID         uint
	HotelFacilityID uint
}

type HotelDetail struct {
	HotelID      uint
	HotelPicture string
}

type HotelDetailResponse struct {
	HotelID          uint
	HotelName        string
	HotelDescription string
	HotelAddress     string
	HotelPicture     []string
	FacilityName     []int
}

type AllHotelDetail struct {
	HotelID          uint
	HotelName        string
	HotelDescription string
	HotelAddress     string
	HotelPicture     []string
	FacilityName     []string
}
