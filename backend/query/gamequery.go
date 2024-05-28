package query

import (
	"fmt"
	"net/http"

	"github.com/JZ23-2/TPAWEB_TraveloHI/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func WinGame(db *gorm.DB, ctx *gin.Context) {
	var user_id = ctx.Query("UserID")
	fmt.Println("Testtttt: ", user_id)

	var user model.User

	if err := db.Where("user_id = ?", 29).First(&user).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user.WalletAmount += 5000

	if err := db.Save(&user).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "User wallet amount updated successfully"})
}
