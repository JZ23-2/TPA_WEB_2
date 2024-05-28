package query

import (
	"fmt"
	"net/http"
	"time"

	"github.com/JZ23-2/TPAWEB_TraveloHI/helper"
	"github.com/JZ23-2/TPAWEB_TraveloHI/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SendNewLetter(db *gorm.DB, ctx *gin.Context) {
	var user []model.User
	var input model.NewLetter

	if err := ctx.Bind(&input); err != nil {
		ctx.String(http.StatusBadRequest, "Invalid Request!")
		return
	}

	if err := db.Where("subscribe_status = ? AND account_status = ?", 1, 1).Find(&user).Error; err != nil {
		ctx.String(http.StatusNotFound, "User not found!")
		return
	}

	for _, user := range user {
		emailContent := input.NewLetterContent
		helper.SendVerification(user.Email, emailContent)
	}

	ctx.String(http.StatusOK, "Send Sucessfully")
}

func AddFlight(db *gorm.DB, ctx *gin.Context) {
	var input model.FlightAddDetail

	if err := ctx.Bind(&input); err != nil {
		ctx.String(http.StatusBadRequest, "Invalid Request!")
		return
	}

	if input.FlightID == 0 || input.OriginID == 0 || input.DestinationID == 0 || input.DestinationDate.IsZero() || input.ArrivalDate.IsZero() || input.FlightDuration == 0 || input.SeatAvailable == 0 || input.FlightPrice == 0 {
		ctx.String(http.StatusBadRequest, "Invalid Request!")
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

	flightDetail := model.FlightDetail{
		FlightID:        input.FlightID,
		OriginID:        input.OriginID,
		DestinationID:   input.DestinationID,
		DestinationDate: input.DestinationDate,
		ArrivalDate:     input.ArrivalDate,
		FlightDuration:  input.FlightDuration,
		SeatAvailable:   input.SeatAvailable,
		FlightPrice:     input.FlightPrice,
		Status:          1,
	}

	if err := db.Create(&flightDetail).Error; err != nil {
		ctx.String(http.StatusInternalServerError, "Failed to add flight!")
		return
	}

	seatAvailable := flightDetail.SeatAvailable
	flightID := flightDetail.FlightID
	ID := flightDetail.ID

	var seats []model.Seat
	err = db.Limit(seatAvailable).Find(&seats).Error
	if err != nil {
		ctx.String(http.StatusInternalServerError, "Failed to get seat!")
		return
	}

	for _, seat := range seats {
		fmt.Println(seat.SeatID)
		seatDetail := model.SeatDetail{
			SeatID:     seat.SeatID,
			FlightID:   flightID,
			ID:         ID,
			UserID:     0,
			SeatStatus: 0,
		}

		if err := db.Create(&seatDetail).Error; err != nil {
			ctx.String(http.StatusInternalServerError, "Failed to add seat!")
			return
		}
	}

	ctx.String(http.StatusOK, "Flight added successfully!")
}
