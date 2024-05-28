package query

import (
	"fmt"

	"github.com/JZ23-2/TPAWEB_TraveloHI/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AddCreditCard(db *gorm.DB, ctx *gin.Context) {
	var input *model.RegistCreditCard

	if err := ctx.Bind(&input); err != nil {
		ctx.String(400, "Invalid Request")
		return
	}

	if input.CreditCardNumber == "" {
		ctx.String(400, "Invalid Credit Card Number")
		return
	}

	fmt.Println(input.UserID)

	creditCard := model.CreditCard{
		CreditCardNumber: input.CreditCardNumber,
		Status:           1,
	}

	if err := db.Create(&creditCard).Error; err != nil {
		ctx.String(500, "Failed to create Credit Card")
		return
	}

	var user *model.User
	db.Where("user_id = ?", input.UserID).First(&user)

	user.CreditCardNumber = input.CreditCardNumber

	if err := db.Save(&user).Error; err != nil {
		ctx.String(500, "Failed to Update User")
		return
	}

}
