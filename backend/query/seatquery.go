package query

import (
	"net/http"

	"github.com/JZ23-2/TPAWEB_TraveloHI/connection"
	"github.com/JZ23-2/TPAWEB_TraveloHI/model"
	"github.com/gin-gonic/gin"
)

func GetFlightSeat(ctx *gin.Context) {
	db := connection.GetDB()
	var flight model.FlightDetail
	ID := ctx.Query("ID")

	db.Where("id = ?", ID).Find(&flight)

	var seat []model.SeatDetail

	err := db.Order("seat_id").Limit(flight.SeatAvailable).Where("flight_id = ?", flight.FlightID).Find(&seat).Error
	if err != nil {
		ctx.String(http.StatusInternalServerError, "Failed to get seat!")
		return
	}

	var seatResponse []model.SeatResponse

	for _, seat := range seat {
		var seatName model.Seat
		db.Where("seat_id = ?", seat.SeatID).Find(&seatName)

		response := model.SeatResponse{
			SeatID:     seatName.SeatID,
			SeatClass:  seatName.SeatClass,
			SeatStatus: seat.SeatStatus,
			FlightID:   seat.FlightID,
		}
		seatResponse = append(seatResponse, response)

	}

	ctx.JSON(http.StatusOK, seatResponse)
}
