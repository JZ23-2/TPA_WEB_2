package query

import (
	"net/http"

	"github.com/JZ23-2/TPAWEB_TraveloHI/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetFlightHistory(ctx *gin.Context, db *gorm.DB) {
	var history []model.FlightHistory
	var user_id = ctx.Query("UserID")

	result := db.Table("transaction_headers th").
		Select("th.user_id, th.status, td.flight_id, f.flight_code, f.flight_name, fd.flight_duration, fd.seat_available, td.quantity, fd.flight_price, d.destination_name, o.origin_name,fd.destination_date, fd.arrival_date").
		Joins("JOIN transaction_flight_details td ON th.transaction_id = td.transaction_id").
		Joins("JOIN flights f ON f.flight_id = td.flight_id").
		Joins("JOIN flight_details fd ON fd.flight_id = f.flight_id").
		Joins("JOIN destinations d ON d.destination_id = fd.destination_id").
		Joins("JOIN origins o ON o.origin_id = fd.origin_id").
		Where("user_id = ?", user_id).
		Scan(&history).Error

	if result != nil {
		ctx.JSON(400, gin.H{
			"message": "Failed to get transaction",
		})
		return
	}

	ctx.JSON(http.StatusOK, history)
}

func GetRoomHistory(ctx *gin.Context, db *gorm.DB) {
	var history []model.RoomHistory
	var user_id = ctx.Query("UserID")

	result := db.Table("transaction_room_details td").
		Select("td.hotel_id, td.check_in_date, td.check_out_date, h.hotel_name, r.room_name, td.room_id, th.status, rd.room_price, rd.room_capacity").
		Joins("JOIN hotels h ON td.hotel_id = h.hotel_id").
		Joins("JOIN rooms r ON r.room_id = td.room_id").
		Joins("JOIN transaction_headers th ON th.transaction_id = td.transaction_id").
		Joins("JOIN room_details rd ON rd.room_id = td.room_id").
		Where("th.user_id = ?", user_id).
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
