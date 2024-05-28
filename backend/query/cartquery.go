package query

import (
	"fmt"
	"net/http"

	"github.com/JZ23-2/TPAWEB_TraveloHI/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// AddFlightCart creates a flight Cart
// @Summary Create Flight Cart
// @Description Create a new Flight Cart
// @Accept json
// @Produce json
// @Param promo body model.FlightCart true "Flight Cart details"
// @Success 201 {object} model.FlightCart
// @Router /api/cart/add-flight-cart [post]
func AddFlightCart(db *gorm.DB, ctx *gin.Context) {
	var input model.FlightCart

	if err := ctx.Bind(&input); err != nil {
		ctx.String(http.StatusBadRequest, "Invalid Request!")
		return
	}

	model := model.FlightCart{
		UserID:   input.UserID,
		FlightID: input.FlightID,
		ID:       input.ID,
		Quantity: input.Quantity,
	}

	if err := db.Create(&model).Error; err != nil {
		ctx.String(http.StatusInternalServerError, "Failed to add cart!")
		return
	}

	ctx.String(http.StatusOK, "Add cart successfully!")
}

func AddRoomCart(db *gorm.DB, ctx *gin.Context) {
	var input model.RoomCart

	if err := ctx.Bind(&input); err != nil {
		ctx.String(http.StatusBadRequest, "Invalid Request!")
		return
	}

	model := model.RoomCart{
		UserID:  input.UserID,
		RoomID:  input.RoomID,
		HotelID: input.HotelID,
	}

	if err := db.Create(&model).Error; err != nil {
		ctx.String(http.StatusInternalServerError, "Failed to add cart!")
		return
	}

	ctx.String(http.StatusOK, "Add cart successfully!")
}

func GetUserFlightCart(db *gorm.DB, ctx *gin.Context) {
	var cart []model.FlightUserCart
	var user_id = ctx.Query("UserID")

	result := db.Table("flight_carts fc").
		Select("fd.id,fc.user_id, fc.flight_id, f.flight_code, f.flight_name, fd.flight_duration, fd.flight_price, d.destination_name, o.origin_name, fd.seat_available, fc.quantity, fd.destination_date, fd.arrival_date").
		Joins("JOIN flights f ON fc.flight_id = f.flight_id").
		Joins("JOIN users u ON u.user_id = fc.user_id").
		Joins("JOIN flight_details fd ON fd.flight_id = f.flight_id").
		Joins("JOIN destinations d ON d.destination_id = fd.destination_id").
		Joins("JOIN origins o ON o.origin_id = fd.origin_id").
		Where("u.user_id = ?", user_id).
		Scan(&cart).Error

	if result != nil {
		ctx.JSON(400, gin.H{
			"message": "Failed to get cart",
		})
		return
	}

	ctx.JSON(http.StatusOK, cart)
}

func GetUserRoomCart(db *gorm.DB, ctx *gin.Context) {
	var cart []model.RoomUserCart
	var user_id = ctx.Query("UserID")

	result := db.Table("room_carts rc").
		Select("u.user_id, h.hotel_id, r.room_id, h.hotel_name, r.room_name, rd.room_price, rd.room_capacity, rd.available_date").
		Joins("JOIN users u ON rc.user_id = u.user_id").
		Joins("JOIN hotels h ON h.hotel_id = rc.hotel_id").
		Joins("JOIN rooms r ON r.room_id = rc.room_id").
		Joins("JOIN room_details rd ON rd.room_id = rc.room_id").
		Where("u.user_id = ?", user_id).
		Scan(&cart).Error

	if result != nil {
		ctx.JSON(400, gin.H{
			"message": "Failed to get cart",
		})
		return
	}

	var roomResponse []model.RoomCartResponse
	for _, room := range cart {
		var roomPicture []string
		var roomPictures []model.RoomPicture
		db.Where("room_id = ?", room.RoomID).Find(&roomPictures)
		for _, picture := range roomPictures {
			roomPicture = append(roomPicture, picture.RoomPicture)
		}

		roomDetail := model.RoomCartResponse{
			UserID:        room.UserID,
			HotelID:       room.HotelID,
			RoomID:        room.RoomID,
			HotelName:     room.HotelName,
			RoomName:      room.RoomName,
			RoomPrice:     room.RoomPrice,
			RoomCapacity:  room.RoomCapacity,
			AvailableDate: room.AvailableDate,
			RoomPicture:   roomPicture,
		}
		roomResponse = append(roomResponse, roomDetail)
	}

	ctx.JSON(http.StatusOK, roomResponse)

}

func RoomCartTransaction(db *gorm.DB, ctx *gin.Context) {
	var input model.TransactionRoomDetailResponse
	if err := ctx.Bind(&input); err != nil {
		ctx.String(400, "Invalid Request")
		return
	}

	promoUsed := CheckUsedPromo(input.UserID, input.PromoID)
	if promoUsed == 1 {
		ctx.String(400, "Promo already used")
		return
	}

	var user model.User
	db.Where("user_id = ?", input.UserID).Find(&user)

	user.WalletAmount = input.WalletAmount

	if err := db.Save(&user).Error; err != nil {
		ctx.String(500, "Failed to update User Wallet Amount")
		return
	}

	transactionHeader := model.TransactionHeader{
		UserID:          input.UserID,
		TransactionDate: input.TransactionDate,
		PromoID:         input.PromoID,
		LagguageStatus:  0,
		Status:          1,
	}

	if err := db.Create(&transactionHeader).Error; err != nil {
		ctx.String(500, "Failed to create Transaction Header")
		return
	}

	transactionID := transactionHeader.TransactionID

	TransactionRoomDetail := model.TransactionRoomDetail{
		TransactionID: transactionID,
		RoomID:        input.RoomID,
		HotelID:       input.HotelID,
		CheckInDate:   input.CheckInDate,
		CheckOutDate:  input.CheckOutDate,
	}

	if err := db.Create(&TransactionRoomDetail).Error; err != nil {
		ctx.String(500, "Failed to create Transaction Room Detail")
		return
	}

	db.Where("user_id = ? AND room_id = ? AND hotel_id = ?", input.UserID, input.RoomID, input.HotelID).Delete(&model.RoomCart{})
	ctx.String(200, "Success")
}

func CartFlightTransaction(db *gorm.DB, ctx *gin.Context) {
	var input model.TransactionFlightDetailResponse
	if err := ctx.Bind(&input); err != nil {
		ctx.String(400, "Invalid Request")
		return
	}
	fmt.Print("user", input.UserID)
	fmt.Print("promo", input.PromoID)
	promoUsed := CheckUsedPromo(input.UserID, input.PromoID)
	fmt.Println("Promooo Code", promoUsed)
	if promoUsed == 1 {
		ctx.String(400, "Promo already used")
		return
	}
	var user model.User
	db.Where("user_id = ?", input.UserID).Find(&user)

	user.WalletAmount = input.WalletAmount

	if err := db.Save(&user).Error; err != nil {
		ctx.String(500, "Failed to update User Wallet Amount")
		return
	}

	for _, seatID := range input.SeatID {
		fmt.Print(seatID)
		updateResult := db.Model(&model.SeatDetail{}).Where("seat_id = ? AND id = ?", seatID, input.ID).
			Updates(map[string]interface{}{"seat_status": 1, "user_id": input.UserID})

		if updateResult.Error != nil {
			ctx.String(500, "Failed to update Seat Detail")
			return
		}
	}

	transactionHeader := model.TransactionHeader{
		UserID:          input.UserID,
		TransactionDate: input.TransactionDate,
		PromoID:         input.PromoID,
		LagguageStatus:  input.LagguageStatus,
		Status:          1,
	}

	if err := db.Create(&transactionHeader).Error; err != nil {
		ctx.String(500, "Failed to create Transaction Header")
		return
	}

	transactionID := transactionHeader.TransactionID

	TransactionFlightDetail := model.TransactionFlightDetail{
		TransactionID: transactionID,
		FlightID:      input.FlightID,
		ID:            input.ID,
		Quantity:      input.Quantity,
	}

	if err := db.Create(&TransactionFlightDetail).Error; err != nil {
		ctx.String(500, "Failed to create Transaction Flight Detail")
		return
	}

	db.Where("user_id = ? AND flight_id = ? AND id = ?", input.UserID, input.FlightID, input.ID).Delete(&model.FlightCart{})

	ctx.String(200, "Success")
}
