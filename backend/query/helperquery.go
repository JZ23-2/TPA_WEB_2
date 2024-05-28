package query

import (
	"github.com/JZ23-2/TPAWEB_TraveloHI/connection"
	"github.com/JZ23-2/TPAWEB_TraveloHI/model"
)

func ValidateUniqueFlight(hotelName string) bool {
	db := connection.GetDB()
	var hotel *model.Hotel

	err := db.First(&hotel, "hotel_name = ?", hotelName).Error
	if err != nil {
		return false
	} else {
		return true
	}
}

func ValidateUniquePromo(promoName string) bool {
	db := connection.GetDB()
	var promo *model.Promo

	err := db.First(&promo, "promo_name = ?", promoName).Error
	if err != nil {
		return false
	} else {
		return true
	}
}
