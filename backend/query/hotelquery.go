package query

import (
	"fmt"
	"net/http"

	"github.com/JZ23-2/TPAWEB_TraveloHI/connection"
	"github.com/JZ23-2/TPAWEB_TraveloHI/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AddHotel(db *gorm.DB, ctx *gin.Context) {
	var input model.HotelDetailResponse

	if err := ctx.Bind(&input); err != nil {
		ctx.String(http.StatusBadRequest, "Invalid Request!")
		return
	}

	if input.HotelName == "" || input.HotelDescription == "" || input.HotelAddress == "" || len(input.HotelPicture) == 0 || len(input.FacilityName) == 0 {
		ctx.String(http.StatusBadRequest, "Invalid Request!")
		return
	}

	existHotelName := ValidateUniqueFlight(input.HotelName)
	if existHotelName == true {
		ctx.String(http.StatusBadRequest, "Hotel Name already exist!")
		return
	}

	hotel := model.Hotel{
		HotelName:        input.HotelName,
		HotelDescription: input.HotelDescription,
		HotelAddress:     input.HotelAddress,
	}

	db.Create(&hotel)

	for _, picture := range input.HotelPicture {
		hotelPicture := model.HotelDetail{
			HotelID:      hotel.HotelID,
			HotelPicture: picture,
		}
		db.Create(&hotelPicture)
	}

	for _, facility := range input.FacilityName {
		hotelFacility := model.HotelFacilityDetail{
			HotelID:         hotel.HotelID,
			HotelFacilityID: uint(facility),
		}
		db.Create(&hotelFacility)
	}

	ctx.String(http.StatusOK, "Success")

}

func GetHotelFacility(ctx *gin.Context) {
	db := connection.GetDB()
	var hotelFacility []model.HotelFacility
	db.Find(&hotelFacility)
	ctx.JSON(http.StatusOK, hotelFacility)
}

func GetAllHotelDetail(ctx *gin.Context) {
	db := connection.GetDB()
	var hotels []model.Hotel
	db.Find(&hotels)

	var hotelResponses []model.AllHotelDetail

	for _, hotel := range hotels {
		var hotelDetails []model.HotelDetail
		db.Where("hotel_id = ?", hotel.HotelID).Find(&hotelDetails)

		var hotelPicture []string
		for _, detail := range hotelDetails {
			hotelPicture = append(hotelPicture, detail.HotelPicture)
		}

		var hotelFacility []string
		var hotelFacilities []model.HotelFacilityDetail
		db.Where("hotel_id = ?", hotel.HotelID).Find(&hotelFacilities)

		for _, facility := range hotelFacilities {
			var hotelFacilityTemp model.HotelFacility
			db.Where("hotel_facility_id = ?", facility.HotelFacilityID).First(&hotelFacilityTemp)
			hotelFacility = append(hotelFacility, hotelFacilityTemp.FacilityName)
		}

		hotelResponse := model.AllHotelDetail{
			HotelID:          hotel.HotelID,
			HotelName:        hotel.HotelName,
			HotelDescription: hotel.HotelDescription,
			HotelAddress:     hotel.HotelAddress,
			HotelPicture:     hotelPicture,
			FacilityName:     hotelFacility,
		}

		hotelResponses = append(hotelResponses, hotelResponse)
	}

	ctx.JSON(http.StatusOK, hotelResponses)
}

func DeleteHotel(ctx *gin.Context) {
	db := connection.GetDB()
	id := ctx.Query("ID")

	fmt.Println(id)

	var hotelDetails []model.HotelDetail
	db.Where("hotel_id = ?", id).Find(&hotelDetails)
	for _, detail := range hotelDetails {
		db.Delete(&detail)
	}

	var hotelFacilities []model.HotelFacilityDetail
	db.Where("hotel_id = ?", id).Find(&hotelFacilities)
	for _, facility := range hotelFacilities {
		db.Where("hotel_facility_id = ?", facility.HotelFacilityID).Delete(&facility)
	}

	var hotel model.Hotel
	result := db.Where("hotel_id = ?", id).First(&hotel)
	if result.Error != nil {
		ctx.String(http.StatusBadRequest, "Invalid Request!")
		return
	}

	db.Where("hotel_id = ?", id).Delete(&model.HotelDetail{})

	db.Delete(&hotel)
	ctx.String(http.StatusOK, "Success")
}

func UpdateHotel(db *gorm.DB, ctx *gin.Context) {
	var input model.HotelDetailResponse

	if err := ctx.Bind(&input); err != nil {
		ctx.String(http.StatusBadRequest, "Invalid Request!")
		return
	}

	var hotel model.Hotel
	db.Where("hotel_id = ?", input.HotelID).First(&hotel)

	hotel.HotelName = input.HotelName
	hotel.HotelDescription = input.HotelDescription
	hotel.HotelAddress = input.HotelAddress

	db.Save(&hotel)

	var hotelDetails []model.HotelDetail
	db.Where("hotel_id = ?", input.HotelID).Find(&hotelDetails)
	for _, detail := range hotelDetails {
		db.Where("hotel_id = ?", detail.HotelID).Delete(&detail)
	}

	for _, picture := range input.HotelPicture {
		hotelPicture := model.HotelDetail{
			HotelID:      hotel.HotelID,
			HotelPicture: picture,
		}
		db.Create(&hotelPicture)
	}
	var hotelFacilities []model.HotelFacilityDetail
	db.Where("hotel_id = ?", input.HotelID).Find(&hotelFacilities)
	for _, facility := range hotelFacilities {
		db.Where("hotel_id = ?", facility.HotelID).Delete(&facility)
	}

	for _, facility := range input.FacilityName {
		hotelFacility := model.HotelFacilityDetail{
			HotelID:         hotel.HotelID,
			HotelFacilityID: uint(facility),
		}
		db.Create(&hotelFacility)
	}

	ctx.String(http.StatusOK, "Success")
}

func SearchHotelByName(ctx *gin.Context) {
	db := connection.GetDB()
	var input model.Hotel
	if err := ctx.Bind(&input); err != nil {
		ctx.String(http.StatusBadRequest, "Invalid Request!")
		return
	}

	var hotelResponses []model.AllHotelDetail
	var hotels []model.Hotel
	db.Where("hotel_id = ?", input.HotelID).Find(&hotels)

	for _, hotel := range hotels {
		var hotelDetails []model.HotelDetail
		db.Where("hotel_id = ?", hotel.HotelID).Find(&hotelDetails)

		var hotelPicture []string
		for _, detail := range hotelDetails {
			hotelPicture = append(hotelPicture, detail.HotelPicture)
		}

		var hotelFacility []string
		var hotelFacilities []model.HotelFacilityDetail
		db.Where("hotel_id = ?", hotel.HotelID).Find(&hotelFacilities)

		for _, facility := range hotelFacilities {
			var hotelFacilityTemp model.HotelFacility
			db.Where("hotel_facility_id = ?", facility.HotelFacilityID).First(&hotelFacilityTemp)
			hotelFacility = append(hotelFacility, hotelFacilityTemp.FacilityName)
		}

		hotelResponse := model.AllHotelDetail{
			HotelID:          hotel.HotelID,
			HotelName:        hotel.HotelName,
			HotelDescription: hotel.HotelDescription,
			HotelAddress:     hotel.HotelAddress,
			HotelPicture:     hotelPicture,
			FacilityName:     hotelFacility,
		}

		hotelResponses = append(hotelResponses, hotelResponse)
	}
	ctx.JSON(http.StatusOK, hotelResponses)
}

func GetHotelByID(ctx *gin.Context) {
	db := connection.GetDB()
	var hotels []model.Hotel
	id := ctx.Query("HotelID")
	db.Where("hotel_id = ?", id).Find(&hotels)

	var hotelResponses []model.AllHotelDetail

	for _, hotel := range hotels {
		var hotelDetails []model.HotelDetail
		db.Where("hotel_id = ?", hotel.HotelID).Find(&hotelDetails)

		var hotelPicture []string
		for _, detail := range hotelDetails {
			hotelPicture = append(hotelPicture, detail.HotelPicture)
		}

		var hotelFacility []string
		var hotelFacilities []model.HotelFacilityDetail
		db.Where("hotel_id = ?", hotel.HotelID).Find(&hotelFacilities)

		for _, facility := range hotelFacilities {
			var hotelFacilityTemp model.HotelFacility
			db.Where("hotel_facility_id = ?", facility.HotelFacilityID).First(&hotelFacilityTemp)
			hotelFacility = append(hotelFacility, hotelFacilityTemp.FacilityName)
		}

		hotelResponse := model.AllHotelDetail{
			HotelID:          hotel.HotelID,
			HotelName:        hotel.HotelName,
			HotelDescription: hotel.HotelDescription,
			HotelAddress:     hotel.HotelAddress,
			HotelPicture:     hotelPicture,
			FacilityName:     hotelFacility,
		}

		hotelResponses = append(hotelResponses, hotelResponse)
	}

	ctx.JSON(http.StatusOK, hotelResponses)
}
