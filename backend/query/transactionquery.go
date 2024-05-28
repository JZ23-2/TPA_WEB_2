package query

import (
	"fmt"

	"github.com/JZ23-2/TPAWEB_TraveloHI/connection"
	"github.com/JZ23-2/TPAWEB_TraveloHI/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func FlightTransaction(db *gorm.DB, ctx *gin.Context) {
	var input model.TransactionFlightDetailResponse
	if err := ctx.Bind(&input); err != nil {
		ctx.String(400, "Invalid Request")
		return
	}
	fmt.Print("user", input.UserID)
	fmt.Print("promo", input.PromoID)
	usePromoStatus := CheckUsedPromo(input.UserID, input.PromoID)
	if usePromoStatus == 1 {
		ctx.String(400, "Promo Already Used")
		return
	}

	if input.Quantity <= 0 {
		ctx.String(400, "Invalid Quantity")
		return
	}

	if input.LagguageStatus != 0 && input.LagguageStatus != 1 {
		ctx.String(400, "Invalid Lagguage Status")
		return
	}

	// if input.PromoID == 0 {
	// 	ctx.String(400, "Invalid Promo ID")
	// 	return
	// }

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
	ctx.String(200, "Success")
}

func RoomTransaction(db *gorm.DB, ctx *gin.Context) {
	var input model.TransactionRoomDetailResponse
	if err := ctx.Bind(&input); err != nil {
		ctx.String(400, "Invalid Request")
		return
	}

	usePromoStatus := CheckUsedPromo(input.UserID, input.PromoID)
	if usePromoStatus == 1 {
		ctx.String(400, "Promo Already Used")
		return
	}

	// if input.PromoID == 0 {
	// 	ctx.String(400, "Invalid Promo ID")
	// 	return
	// }

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
	ctx.String(200, "Success")
}

func CheckUsedPromo(userID uint, promoID uint) int {
	db := connection.GetDB()
	var used = -1
	var transactionHeader []model.TransactionHeader

	db.Where("user_id = ?", userID).Find(&transactionHeader)

	for _, transaction := range transactionHeader {
		if transaction.PromoID == promoID {
			used = 1
			break
		} else if transaction.PromoID == 0 {
			used = -1
			break
		} else {
			used = 0
		}
	}
	return used
}
