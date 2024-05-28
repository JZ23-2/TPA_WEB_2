package query

import (
	"fmt"
	"net/http"

	"github.com/JZ23-2/TPAWEB_TraveloHI/connection"
	"github.com/JZ23-2/TPAWEB_TraveloHI/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetRoomFacility(ctx *gin.Context) {
	db := connection.GetDB()
	var roomFacility []model.RoomFacility
	db.Find(&roomFacility)
	ctx.JSON(http.StatusOK, roomFacility)
}

func GetRoom(ctx *gin.Context) {
	db := connection.GetDB()
	var room []model.Room
	db.Find(&room)
	ctx.JSON(http.StatusOK, room)
}

func AddRoom(db *gorm.DB, ctx *gin.Context) {
	var input model.RoomDetailResponse

	if err := ctx.Bind(&input); err != nil {
		ctx.String(http.StatusBadRequest, "Invalid Request!")
		return
	}

	room := model.RoomDetail{
		RoomID:        uint(input.RoomID),
		HotelID:       uint(input.HotelID),
		RoomPrice:     input.RoomPrice,
		RoomCapacity:  input.RoomCapacity,
		AvailableDate: input.AvailableDate,
		Status:        0,
	}

	db.Create(&room)

	for _, picture := range input.RoomPicture {
		roomPicture := model.RoomPicture{
			RoomID:      room.RoomID,
			HotelID:     room.HotelID,
			RoomPicture: picture,
		}
		db.Create(&roomPicture)
	}

	for _, facility := range input.FacilityName {
		roomFacility := model.RoomFacilityDetail{
			RoomID:         room.RoomID,
			HotelID:        room.HotelID,
			RoomFacilityID: uint(facility),
		}
		db.Create(&roomFacility)
	}

	ctx.String(http.StatusOK, "Success")

}

func GetAllHotelRoom(ctx *gin.Context) {
	db := connection.GetDB()
	var roomDetail []model.RoomDetail
	db.Find(&roomDetail)

	var roomResponses []model.AllRoomDetail

	for _, room := range roomDetail {
		var hotelName model.Hotel
		db.Where("hotel_id = ?", room.HotelID).Find(&hotelName)

		var roomFacility []string
		var roomFacilities []model.RoomFacilityDetail
		db.Where("room_id = ?", room.RoomID).Find(&roomFacilities)
		for _, facility := range roomFacilities {
			var roomFacilityTemp model.RoomFacility
			db.Where("room_facility_id = ?", facility.RoomFacilityID).Find(&roomFacilityTemp)
			roomFacility = append(roomFacility, roomFacilityTemp.FacilityName)
		}

		var roomName model.Room
		db.Where("room_id = ?", room.RoomID).Find(&roomName)

		var roomPicture []string
		var roomPictures []model.RoomPicture
		db.Where("room_id = ?", room.RoomID).Find(&roomPictures)
		for _, picture := range roomPictures {
			roomPicture = append(roomPicture, picture.RoomPicture)
		}

		roomResponse := model.AllRoomDetail{
			RoomID:        room.RoomID,
			HotelID:       room.HotelID,
			RoomName:      roomName.RoomName,
			HotelName:     hotelName.HotelName,
			RoomPrice:     room.RoomPrice,
			RoomCapacity:  room.RoomCapacity,
			AvailableDate: room.AvailableDate,
			Status:        room.Status,
			RoomPicture:   roomPicture,
			FacilityName:  roomFacility,
		}

		roomResponses = append(roomResponses, roomResponse)
	}
	ctx.JSON(http.StatusOK, roomResponses)
}

func DeleteRoom(ctx *gin.Context) {
	db := connection.GetDB()
	id := ctx.Query("ID")
	hotelID := ctx.Query("HotelID")

	var roomFacilities []model.RoomFacilityDetail
	db.Where("room_id = ?", id).Find(&roomFacilities)
	for _, detail := range roomFacilities {
		db.Where("room_facility_id = ? AND room_id = ? AND hotel_id = ?", detail.RoomFacilityID, id, hotelID).Delete(&detail)
	}

	var roomPictures []model.RoomPicture
	db.Where("room_id = ?", id).Find(&roomPictures)
	for _, detail := range roomPictures {
		db.Where("room_picture = ? AND room_id = ? AND hotel_id = ? ", detail.RoomPicture, id, hotelID).Delete(&detail)
	}

	var room model.RoomDetail
	db.Where("room_id = ? AND hotel_id = ?", id, hotelID).Delete(&room)

	ctx.String(http.StatusOK, "Success")
}

func UpdateRoom(db *gorm.DB, ctx *gin.Context) {
	var input model.RoomDetailResponse
	if err := ctx.Bind(&input); err != nil {
		ctx.String(http.StatusBadRequest, "Invalid Request!")
		return
	}

	fmt.Println(input.HotelID)
	fmt.Println(input.RoomID)

	err := db.Model(&model.RoomDetail{}).
		Where("room_id = ? AND hotel_id = ?", input.RoomID, input.HotelID).
		Updates(map[string]interface{}{
			"room_price":     input.RoomPrice,
			"room_capacity":  input.RoomCapacity,
			"available_date": input.AvailableDate,
		}).Error

	if err != nil {
		ctx.String(http.StatusInternalServerError, "Error updating room details")
		return
	}

	var roomFacilities []model.RoomFacilityDetail
	db.Where("room_id = ? AND hotel_id = ?", input.RoomID, input.HotelID).Find(&roomFacilities)
	for _, facility := range roomFacilities {
		db.Where("room_facility_id = ? AND room_id = ? AND hotel_id = ?", facility.RoomFacilityID, input.RoomID, input.HotelID).Delete(&facility)
	}

	for _, facility := range input.FacilityName {
		roomFacility := model.RoomFacilityDetail{
			RoomID:         input.RoomID,
			HotelID:        input.HotelID,
			RoomFacilityID: uint(facility),
		}
		db.Create(&roomFacility)
	}

	var roomPictures []model.RoomPicture
	db.Where("room_id = ? AND hotel_id = ?", input.RoomID, input.HotelID).Find(&roomPictures)
	for _, picture := range roomPictures {
		db.Where("room_picture = ? AND room_id = ? AND hotel_id = ?", picture.RoomPicture, input.RoomID, input.HotelID).Delete(&picture)
	}

	for _, picture := range input.RoomPicture {
		roomPicture := model.RoomPicture{
			RoomID:      input.RoomID,
			HotelID:     input.HotelID,
			RoomPicture: picture,
		}
		db.Create(&roomPicture)
	}

	ctx.String(http.StatusOK, "Success")
}

func GetRoomDetailByHotelID(ctx *gin.Context) {
	db := connection.GetDB()
	roomID := ctx.Query("roomID")
	hotelID := ctx.Query("hotelID")
	var room []model.RoomDetail
	db.Where("room_id = ? AND hotel_id = ?", roomID,hotelID).Find(&room)

	var roomResponses []model.AllRoomDetail

	for _, room := range room {
		var hotelName model.Hotel
		db.Where("hotel_id = ?", room.HotelID).Find(&hotelName)

		var roomFacility []string
		var roomFacilities []model.RoomFacilityDetail
		db.Where("room_id = ?", room.RoomID).Find(&roomFacilities)
		for _, facility := range roomFacilities {
			var facilityName model.RoomFacility
			db.Where("room_facility_id = ?", facility.RoomFacilityID).Find(&facilityName)
			roomFacility = append(roomFacility, facilityName.FacilityName)
		}

		var roomName model.Room
		db.Where("room_id = ?", room.RoomID).Find(&roomName)

		var roomPicture []string
		var roomPictures []model.RoomPicture
		db.Where("room_id = ?", room.RoomID).Find(&roomPictures)
		for _, picture := range roomPictures {
			roomPicture = append(roomPicture, picture.RoomPicture)
		}

		roomResponse := model.AllRoomDetail{
			RoomID:        room.RoomID,
			HotelID:       room.HotelID,
			RoomName:      roomName.RoomName,
			HotelName:     hotelName.HotelName,
			RoomPrice:     room.RoomPrice,
			RoomCapacity:  room.RoomCapacity,
			AvailableDate: room.AvailableDate,
			Status:        room.Status,
			RoomPicture:   roomPicture,
			FacilityName:  roomFacility,
		}

		roomResponses = append(roomResponses, roomResponse)
	}

	ctx.JSON(http.StatusOK, roomResponses)
}
