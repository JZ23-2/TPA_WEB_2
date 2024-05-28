package query

import (
	"net/http"
	"time"

	"github.com/JZ23-2/TPAWEB_TraveloHI/connection"
	"github.com/JZ23-2/TPAWEB_TraveloHI/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetFlight(ctx *gin.Context) {
	db := connection.GetDB()
	var flight []model.Flight
	db.Find(&flight)
	ctx.JSON(http.StatusOK, flight)
}

func GetOrigin(ctx *gin.Context) {
	db := connection.GetDB()
	var origin []model.Origin
	db.Find(&origin)
	ctx.JSON(http.StatusOK, origin)
}

func GetDestination(ctx *gin.Context) {
	db := connection.GetDB()
	var destination []model.Destination
	db.Find(&destination)
	ctx.JSON(http.StatusOK, destination)
}

func GetAllFlightDetail(ctx *gin.Context) {
	db := connection.GetDB()
	var flightDetails []model.FlightDetail

	db.Find(&flightDetails)

	var flightDetailResponses []model.FlightDetailResponse

	for _, flightDetail := range flightDetails {
		var flightTemp model.Flight
		db.Where("flight_id = ?", flightDetail.FlightID).First(&flightTemp)

		var originTemp model.Origin
		db.Where("origin_id = ?", flightDetail.OriginID).First(&originTemp)

		var destinationTemp model.Destination
		db.Where("destination_id = ?", flightDetail.DestinationID).First(&destinationTemp)

		response := model.FlightDetailResponse{
			ID:              flightDetail.ID,
			FlightID:        flightTemp.FlightID,
			FlightCode:      flightTemp.FlightCode,
			FlightName:      flightTemp.FlightName,
			OriginID:        originTemp.OriginID,
			OriginName:      originTemp.OriginName,
			DestinationID:   destinationTemp.DestinationID,
			DestinationName: destinationTemp.DestinationName,
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

func DeleteFlight(ctx *gin.Context) {
	db := connection.GetDB()

	id := ctx.Query("ID")

	var flight model.FlightDetail

	result := db.Where("id = ?", id).First(&flight)
	if result.Error != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Flight not found"})
		return
	}

	var seatDetail model.SeatDetail
	db.Where("id = ?", id).Delete(&seatDetail)

	db.Delete(&flight)
	ctx.String(http.StatusOK, "Flight Deleted")
}

func UpdateFlight(db *gorm.DB, ctx *gin.Context) {
	var input model.FlightDetail

	if err := ctx.Bind(&input); err != nil {
		ctx.String(http.StatusBadRequest, "Invalid Request!")
		return
	}

	var existingFlight model.FlightDetail
	if err := db.First(&existingFlight, input.ID).Error; err != nil {
		ctx.String(http.StatusNotFound, "Flight not found!")
		return
	}

	jakarta, err := time.LoadLocation("Asia/Jakarta")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set timezone"})
		return
	}

	dateTimeFormat := "2006-01-02 15:04:05"

	input.DestinationDate, err = time.ParseInLocation(dateTimeFormat, input.DestinationDate.Format(dateTimeFormat), jakarta)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse DestinationDate"})
		return
	}

	input.ArrivalDate, err = time.ParseInLocation(dateTimeFormat, input.ArrivalDate.Format(dateTimeFormat), jakarta)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse ArrivalDate"})
		return
	}

	existingFlight.FlightID = input.FlightID
	existingFlight.OriginID = input.OriginID
	existingFlight.DestinationID = input.DestinationID
	existingFlight.DestinationDate = input.DestinationDate
	existingFlight.ArrivalDate = input.ArrivalDate
	existingFlight.FlightDuration = input.FlightDuration
	existingFlight.SeatAvailable = input.SeatAvailable
	existingFlight.FlightPrice = input.FlightPrice
	existingFlight.Status = 1
	existingFlight.TransitStatus = input.TransitStatus

	db.Save(&existingFlight)
	ctx.String(http.StatusOK, "Flight Updated Successfully")

}

func GetFlightDetailByID(ctx *gin.Context) {
	db := connection.GetDB()
	id := ctx.Query("ID")
	var flightDetail model.FlightDetail
	result := db.Where("id = ?", id).First(&flightDetail)
	if result.Error != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Flight not found"})
		return
	}

	var flightTemp model.Flight
	db.Where("flight_id = ?", flightDetail.FlightID).First(&flightTemp)

	var originTemp model.Origin
	db.Where("origin_id = ?", flightDetail.OriginID).First(&originTemp)

	var destinationTemp model.Destination
	db.Where("destination_id = ?", flightDetail.DestinationID).First(&destinationTemp)

	response := model.FlightDetailResponse{
		ID:              flightDetail.ID,
		FlightID:        flightTemp.FlightID,
		FlightCode:      flightTemp.FlightCode,
		FlightName:      flightTemp.FlightName,
		OriginID:        originTemp.OriginID,
		OriginName:      originTemp.OriginName,
		DestinationID:   destinationTemp.DestinationID,
		DestinationName: destinationTemp.DestinationName,
		DestinationDate: flightDetail.DestinationDate,
		ArrivalDate:     flightDetail.ArrivalDate,
		FlightDuration:  flightDetail.FlightDuration,
		SeatAvailable:   flightDetail.SeatAvailable,
		FlightPrice:     flightDetail.FlightPrice,
		Status:          flightDetail.Status,
	}

	ctx.JSON(http.StatusOK, response)
}
