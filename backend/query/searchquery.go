package query

import (
	"fmt"
	"net/http"

	"github.com/JZ23-2/TPAWEB_TraveloHI/connection"
	"github.com/JZ23-2/TPAWEB_TraveloHI/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetSearchResult(db *gorm.DB, c *gin.Context) {
	var input *model.SearchResult

	if err := c.Bind(&input); err != nil {
		c.String(400, "Invalid Request")
		return
	}

	search := model.Search{
		SearchKeyword: input.SearchKeyword,
	}

	if err := db.Create(&search).Error; err != nil {
		c.String(500, "Failed to store Search")
		return
	}

	searchDetail := model.SearchDetail{
		UserID:   input.UserID,
		SearchID: search.SearchID,
	}
	if err := db.Create(&searchDetail).Error; err != nil {
		c.String(500, "Failed to store Search Detail")
		return
	}
}

func GetRecommendationSearch(ctx *gin.Context) {
	db := connection.GetDB()
	var recommendationSearches []model.Search

	err := db.Limit(5).Find(&recommendationSearches).Error

	if err != nil {
		ctx.String(http.StatusInternalServerError, "Failed to get Recommendation Search")
		return
	}

	var response []gin.H
	for _, search := range recommendationSearches {
		response = append(response, gin.H{
			"searchKeyword": search.SearchKeyword,
		})
	}

	ctx.JSON(http.StatusOK, response)
}

func GetUserHistory(ctx *gin.Context) {
	user := ctx.Query("UserID")

	db := connection.GetDB()
	var userHistory []model.SearchDetail

	err := db.Order("id DESC").Limit(3).Find(&userHistory, "user_id = ?", user).Error
	if err != nil {
		ctx.String(http.StatusInternalServerError, "Failed to get User History")
		return
	}

	var keywords []gin.H
	for _, history := range userHistory {
		var search model.Search
		err := db.Select("search_keyword").Where("search_id = ?", history.SearchID).First(&search).Error
		if err != nil {
			ctx.String(http.StatusInternalServerError, "Failed to get Keyword for Search ID")
			return
		}
		keywords = append(keywords, gin.H{
			"searchKeyword": search.SearchKeyword,
		})
	}

	ctx.JSON(http.StatusOK, keywords)
}

func GetFlightFromSearch(db *gorm.DB, c *gin.Context) {

	originID := c.Query("OriginID")
	destID := c.Query("DestinationID")

	var flightDetail []model.FlightDetail

	db.Where("origin_id = ? AND destination_id = ? ", originID, destID).Find(&flightDetail)

	var flightDetailResponses []model.FlightDetailResponse

	for _, flightDetail := range flightDetail {
		var origin model.Origin
		var destination model.Destination
		var flight model.Flight
		db.Where("origin_id = ?", flightDetail.OriginID).Find(&origin)
		db.Where("destination_id = ?", flightDetail.DestinationID).Find(&destination)
		db.Where("flight_id = ?", flightDetail.FlightID).Find(&flight)

		response := model.FlightDetailResponse{
			ID:              flightDetail.ID,
			FlightID:        flight.FlightID,
			FlightCode:      flight.FlightCode,
			FlightName:      flight.FlightName,
			OriginID:        origin.OriginID,
			OriginName:      origin.OriginName,
			DestinationID:   destination.DestinationID,
			DestinationName: destination.DestinationName,
			DestinationDate: flightDetail.DestinationDate,
			ArrivalDate:     flightDetail.ArrivalDate,
			FlightDuration:  flightDetail.FlightDuration,
			SeatAvailable:   flightDetail.SeatAvailable,
			FlightPrice:     flightDetail.FlightPrice,
			Status:          flightDetail.Status,
			TransitStatus:   flightDetail.TransitStatus,
		}
		flightDetailResponses = append(flightDetailResponses, response)
	}

	c.JSON(200, flightDetailResponses)
}

func GetFlightSearchByName(db *gorm.DB, ctx *gin.Context) {
	var history []model.FlightHistory
	var flightName = ctx.Query("FlightName")
	result := db.Table("transaction_headers th").
		Select("th.user_id, th.status, td.flight_id, f.flight_code, f.flight_name, fd.flight_duration, fd.seat_available, td.quantity, fd.flight_price, d.destination_name, o.origin_name,fd.destination_date, fd.arrival_date").
		Joins("JOIN transaction_flight_details td ON th.transaction_id = td.transaction_id").
		Joins("JOIN flights f ON f.flight_id = td.flight_id").
		Joins("JOIN flight_details fd ON fd.flight_id = f.flight_id").
		Joins("JOIN destinations d ON d.destination_id = fd.destination_id").
		Joins("JOIN origins o ON o.origin_id = fd.origin_id").
		Where("f.flight_name ILIKE ?", "%"+flightName+"%").
		Scan(&history).Error

	if result != nil {
		ctx.JSON(400, gin.H{
			"message": "Failed to get transaction",
		})
		return
	}

	ctx.JSON(http.StatusOK, history)
}

func GetFlightSearchByCode(db *gorm.DB, ctx *gin.Context) {
	var history []model.FlightHistory
	var flightCode = ctx.Query("FlightCode")
	result := db.Table("transaction_headers th").
		Select("th.user_id, th.status, td.flight_id, f.flight_code, f.flight_name, fd.flight_duration, fd.seat_available, td.quantity, fd.flight_price, d.destination_name, o.origin_name,fd.destination_date, fd.arrival_date").
		Joins("JOIN transaction_flight_details td ON th.transaction_id = td.transaction_id").
		Joins("JOIN flights f ON f.flight_id = td.flight_id").
		Joins("JOIN flight_details fd ON fd.flight_id = f.flight_id").
		Joins("JOIN destinations d ON d.destination_id = fd.destination_id").
		Joins("JOIN origins o ON o.origin_id = fd.origin_id").
		Where("f.flight_code ILIKE ?", "%"+flightCode+"%").
		Scan(&history).Error

	if result != nil {
		ctx.JSON(400, gin.H{
			"message": "Failed to get transaction",
		})
		return
	}

	ctx.JSON(http.StatusOK, history)
}

func GetRoomSearchByName(ctx *gin.Context, db *gorm.DB) {
	var history []model.RoomHistory
	var hotelName = ctx.Query("HotelName")

	result := db.Table("transaction_room_details td").
		Select("td.hotel_id, td.check_in_date, td.check_out_date, h.hotel_name, r.room_name, td.room_id, th.status, rd.room_price, rd.room_capacity").
		Joins("JOIN hotels h ON td.hotel_id = h.hotel_id").
		Joins("JOIN rooms r ON r.room_id = td.room_id").
		Joins("JOIN transaction_headers th ON th.transaction_id = td.transaction_id").
		Joins("JOIN room_details rd ON rd.room_id = td.room_id").
		Where("h.hotel_name ILIKE ?", "%"+hotelName+"%").
		Scan(&history).Error

	if result != nil {
		ctx.JSON(400, gin.H{
			"message": "Failed to get transaction",
		})
		return
	}

	var historyResponse []model.RoomHistoryResponse
	for _, room := range history {
		var roomPicture []string
		var roomPictures []model.RoomPicture
		db.Where("room_id = ?", room.RoomID).Find(&roomPictures)
		for _, picture := range roomPictures {
			roomPicture = append(roomPicture, picture.RoomPicture)
		}

		historyDetail := model.RoomHistoryResponse{
			UserID:       room.UserID,
			HotelID:      room.HotelID,
			RoomID:       room.RoomID,
			HotelName:    room.HotelName,
			RoomName:     room.RoomName,
			RoomPrice:    room.RoomPrice,
			RoomCapacity: room.RoomCapacity,
			CheckInDate:  room.CheckInDate,
			CheckOutDate: room.CheckOutDate,
			Status:       room.Status,
			RoomPicture:  roomPicture,
		}

		historyResponse = append(historyResponse, historyDetail)
	}

	ctx.JSON(http.StatusOK, historyResponse)
}

func GetHotelByLocation(ctx *gin.Context) {
	db := connection.GetDB()
	location := ctx.Query("keyword")

	var hotelResponses []model.AllHotelDetail
	var hotels []model.Hotel
	db.Where("hotel_address ILIKE ?", "%"+location+"%").Find(&hotels)

	for _, hotel := range hotels {
		var hotelDetails []model.HotelDetail
		db.Where("hotel_id = ?", hotel.HotelID).Find(&hotelDetails)

		var hotelPicture []string
		for _, detail := range hotelDetails {
			hotelPicture = append(hotelPicture, detail.HotelPicture)
		}

		var hotelFacility []string
		var hotelFacilities []model.HotelFacilityDetail
		db.Where("hotel_id = ?", hotel.HotelID).Find(&hotelFacilities)

		for _, facility := range hotelFacilities {
			var hotelFacilityTemp model.HotelFacility
			db.Where("hotel_facility_id = ?", facility.HotelFacilityID).First(&hotelFacilityTemp)
			hotelFacility = append(hotelFacility, hotelFacilityTemp.FacilityName)
		}

		hotelResponse := model.AllHotelDetail{
			HotelID:          hotel.HotelID,
			HotelName:        hotel.HotelName,
			HotelDescription: hotel.HotelDescription,
			HotelAddress:     hotel.HotelAddress,
			HotelPicture:     hotelPicture,
			FacilityName:     hotelFacility,
		}

		hotelResponses = append(hotelResponses, hotelResponse)
	}
	ctx.JSON(http.StatusOK, hotelResponses)
}

func GetFlightFromLocation(db *gorm.DB, ctx *gin.Context) {
	location := ctx.Query("keyword")
	fmt.Println("flight",location)
	var locationName model.Origin
	db.Where("origin_name ILIKE ?", "%"+location+"%").Find(&locationName)

	locationID := locationName.OriginID

	var flightDetail []model.FlightDetail

	db.Where("origin_id = ? OR destination_id = ? ", locationID, locationID).Find(&flightDetail)

	var flightDetailResponses []model.FlightDetailResponse

	for _, flightDetail := range flightDetail {
		var origin model.Origin
		var destination model.Destination
		var flight model.Flight
		db.Where("origin_id = ?", flightDetail.OriginID).Find(&origin)
		db.Where("destination_id = ?", flightDetail.DestinationID).Find(&destination)
		db.Where("flight_id = ?", flightDetail.FlightID).Find(&flight)

		response := model.FlightDetailResponse{
			ID:              flightDetail.ID,
			FlightID:        flight.FlightID,
			FlightCode:      flight.FlightCode,
			FlightName:      flight.FlightName,
			OriginID:        origin.OriginID,
			OriginName:      origin.OriginName,
			DestinationID:   destination.DestinationID,
			DestinationName: destination.DestinationName,
			DestinationDate: flightDetail.DestinationDate,
			ArrivalDate:     flightDetail.ArrivalDate,
			FlightDuration:  flightDetail.FlightDuration,
			SeatAvailable:   flightDetail.SeatAvailable,
			FlightPrice:     flightDetail.FlightPrice,
			Status:          flightDetail.Status,
			TransitStatus:   flightDetail.TransitStatus,
		}
		flightDetailResponses = append(flightDetailResponses, response)
	}

	ctx.JSON(200, flightDetailResponses)
}
