package query

import (
	"github.com/JZ23-2/TPAWEB_TraveloHI/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetHotelRecommendation(db *gorm.DB, ctx *gin.Context) {
	var recommendation []model.HotelRecommendation

	result := db.Table("transaction_room_details td").
		Joins("JOIN hotels h ON td.hotel_id = h.hotel_id").
		Select("h.hotel_id, COUNT(h.hotel_id) as count, h.hotel_name, h.hotel_address, h.hotel_description").
		Group("h.hotel_id, h.hotel_name, h.hotel_address, h.hotel_description").
		Order("count desc").
		Limit(5).
		Scan(&recommendation)

	if result.Error != nil {
		ctx.JSON(500, gin.H{"error": result.Error.Error()})
		return
	}

	var recommendationResponse []model.HotelRecommendationResponse
	for _, hotel := range recommendation {
		var hotelDetail []model.HotelDetail
		db.Where("hotel_id = ?", hotel.HotelID).Find(&hotelDetail)

		var hotelPicture []string
		for _, detail := range hotelDetail {
			hotelPicture = append(hotelPicture, detail.HotelPicture)
		}

		hotelResponse := model.HotelRecommendationResponse{
			HotelID:          hotel.HotelID,
			HotelName:        hotel.HotelName,
			HotelDescription: hotel.HotelDescription,
			HotelAddress:     hotel.HotelAddress,
			HotelPicture:     hotelPicture,
			Count:            hotel.Count,
		}

		recommendationResponse = append(recommendationResponse, hotelResponse)
	}

	ctx.JSON(200, recommendationResponse)
}

func GetFlightRecommendation(db *gorm.DB, ctx *gin.Context) {
	var recommendation []model.FlightRecommendation

	result := db.Table("transaction_flight_details td").
		Select("f.flight_name, COUNT(DISTINCT fd.destination_id) AS famous_country, COUNT(DISTINCT td.transaction_id) AS total_booked, AVG(fd.flight_price) AS average_price, d.destination_name, dd.destination_picture").
		Joins("JOIN flights f ON td.flight_id = f.flight_id").
		Joins("JOIN flight_details fd ON fd.id = td.id").
		Joins("JOIN destinations d ON fd.destination_id = d.destination_id").
		Joins("JOIN destination_details dd ON dd.destination_id = d.destination_id").
		Group("f.flight_name, d.destination_name, dd.destination_picture").
		Order("famous_country DESC").
		Limit(5).
		Scan(&recommendation)

	if result.Error != nil {
		ctx.JSON(500, gin.H{"error": result.Error.Error()})
		return
	}

	ctx.JSON(200, recommendation)
}
