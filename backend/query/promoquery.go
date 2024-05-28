package query

import (
	"net/http"

	"github.com/JZ23-2/TPAWEB_TraveloHI/connection"
	"github.com/JZ23-2/TPAWEB_TraveloHI/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AddPromo(db *gorm.DB, c *gin.Context) {
	var input *model.Promo

	if err := c.Bind(&input); err != nil {
		c.String(400, "Invalid Request")
		return
	}

	if input.PromoCode == "" || input.PromoName == "" || input.PromoDescription == "" || input.PromoBenefit == 0 || input.PromoPicture == "" {
		c.String(400, "Invalid Request")
		return
	}

	existPromo := ValidateUniquePromo(input.PromoName)
	if existPromo == true {
		c.String(400, "Promo Name already exist!")
		return
	}

	promo := model.Promo{
		PromoCode:        input.PromoCode,
		PromoName:        input.PromoName,
		PromoDescription: input.PromoDescription,
		PromoBenefit:     input.PromoBenefit,
		PromoPicture:     input.PromoPicture,
	}

	if err := db.Create(&promo).Error; err != nil {
		c.String(500, "Failed to create Promo")
		return
	}

	c.String(http.StatusOK, "Success")
}

func GetAllPromo(ctx *gin.Context) {
	db := connection.GetDB()
	var promo []model.Promo
	db.Find(&promo)
	ctx.JSON(http.StatusOK, promo)
}

// DeletePromos deletes a promo by PromoID
// @Summary Delete Promo
// @Description Delete a promo by PromoID
// @Produce json
// @Param PromoID query string true "Promo ID"
// @Success 200 {string} string "Promo Deleted
// @Router /api/admin/delete-promo [delete]
func DeletePromos(ctx *gin.Context) {
	db := connection.GetDB()

	promoID := ctx.Query("PromoID")

	var promo model.Promo

	result := db.Where("promo_id = ?", promoID).First(&promo)
	if result.Error != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Promo not found"})
		return
	}

	db.Delete(&promo)
	ctx.String(http.StatusOK, "Promo Deleted")
}

// UpdatePromo Update Promo
// @Summary Update Existing Promo
// @Description Update Existing Promo
// @Accept json
// @Produce json
// @Param promo body model.Promo true "Update Promo"
// @Success 201 {object} model.Promo
// @Router /api/admin/update-promo [put]
func UpdatePromo(db *gorm.DB, ctx *gin.Context) {
	var input model.Promo

	if err := ctx.Bind(&input); err != nil {
		ctx.String(http.StatusBadRequest, "Invalid Request!")
		return
	}

	var existingPromo model.Promo
	if err := db.First(&existingPromo, input.PromoID).Error; err != nil {
		ctx.String(http.StatusNotFound, "Promo not found!")
		return
	}

	existingPromo.PromoCode = input.PromoCode
	existingPromo.PromoName = input.PromoName
	existingPromo.PromoDescription = input.PromoDescription
	existingPromo.PromoBenefit = input.PromoBenefit
	existingPromo.PromoPicture = input.PromoPicture

	db.Save(&existingPromo)
	ctx.String(http.StatusOK, "Promo Updated!")
}
