package connection

import (
	"github.com/JZ23-2/TPAWEB_TraveloHI/model"
	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) {
	db.AutoMigrate(
		&model.Promo{},
		&model.Flight{},
		&model.Origin{},
		&model.Destination{},
		&model.Seat{},
		&model.RoomFacility{},
		&model.Room{},
		&model.HotelFacility{},
		&model.Hotel{},
		&model.Rating{},
		&model.Review{},
		&model.Search{},
		&model.CreditCard{},
		&model.Question{},
		&model.User{},
		&model.TransactionFlightDetail{},
		&model.TransactionRoomDetail{},
		&model.TransactionHeader{},
		&model.RoomCart{},
		&model.FlightCart{},
		&model.FlightDetail{},
		&model.RoomDetail{},
		&model.HotelFacilityDetail{},
		&model.RatingDetail{},
		&model.ReviewDetail{},
		&model.SearchDetail{},
		&model.QuestionDetail{},
		&model.SeatDetail{},
		&model.HotelDetail{},
		&model.RoomFacilityDetail{},
		&model.RoomPicture{},
		&model.DestinationDetail{},
	)
}
