package query

import (
	"fmt"
	"net/http"
	"regexp"
	"time"

	"github.com/JZ23-2/TPAWEB_TraveloHI/auth"
	"github.com/JZ23-2/TPAWEB_TraveloHI/connection"
	"github.com/JZ23-2/TPAWEB_TraveloHI/helper"
	"github.com/JZ23-2/TPAWEB_TraveloHI/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

var globalOTP string
var globalOTPTime time.Time

func RegisterUser(db *gorm.DB, c *gin.Context) {
	var input *model.RegisterUser

	if err := c.Bind(&input); err != nil {
		c.String(http.StatusBadRequest, "Invalid Request")
		return
	}

	if input.FirstName == "" {
		c.String(http.StatusConflict, "Please Fill The FirstName")
		return
	}

	if input.LastName == "" {
		c.String(http.StatusConflict, "Please Fill The LastName")
		return
	}

	if len(input.FirstName) < 5 || len(input.LastName) < 5 {
		c.String(http.StatusConflict, "Name must be at least 5 characters")
		return
	}

	nameRegex := regexp.MustCompile(`^[a-zA-Z\s]*$`)
	if !nameRegex.MatchString(input.FirstName) || !nameRegex.MatchString(input.LastName) {
		c.String(http.StatusConflict, "Name must be alphabet")
		return
	}

	passwordRegex := regexp.MustCompile(`^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$`)
	if !passwordRegex.MatchString(input.Password) {
		c.String(http.StatusConflict, "Password must be at least 8 characters, contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character")
		return
	}

	if input.Age == 0 {
		c.String(http.StatusConflict, "Please Fill The Age")
		return
	}

	if input.Password == "" {
		c.String(http.StatusConflict, "Please Fill The Password")
		return
	}

	if input.Email == "" {
		c.String(http.StatusConflict, "Please Fill The Email")
		return
	}

	if input.Gender == "" {
		c.String(http.StatusConflict, "Please Fill The Gender")
		return
	}

	if input.QuestionID == 0 {
		c.String(http.StatusConflict, "Please Fill The Personal Question")
		return
	}

	if input.ProfiePicture == "" {
		c.String(http.StatusConflict, "Please Choose The Profile Picture")
		return
	}

	isExistEmail := CheckExistEmail(input.Email)
	if isExistEmail == true {
		c.String(http.StatusConflict, "Choose Another Email")
		return
	}

	password := helper.HashPassword(input.Password)
	age := time.Now().Year() - input.DateOfBirth.Year()

	user := model.User{
		FirstName:        input.FirstName,
		LastName:         input.LastName,
		Age:              age,
		Password:         password,
		Email:            input.Email,
		Gender:           input.Gender,
		QuestionID:       input.QuestionID,
		DateOfBirth:      input.DateOfBirth,
		ProfiePicture:    input.ProfiePicture,
		SubscribeStatus:  input.SubscribeStatus,
		Status:           input.Status,
		Role:             input.Role,
		AccountStatus:    input.AccountStatus,
		CreditCardNumber: "",
		WalletAmount:     input.WalletAmount,
	}

	if err := db.Create(&user).Error; err != nil {
		c.String(http.StatusInternalServerError, "Failed to create User")
		return
	}

	helper.SendVerification(input.Email, "Thanks For Regitering in Travelohi, Enjoy :)")

	var createdUser *model.User
	db.Last(&createdUser)

	answer := helper.HashPassword(input.Answer)

	question := model.QuestionDetail{
		QuestionID: input.QuestionID,
		UserID:     createdUser.ID,
		Answer:     answer,
	}

	if err := db.Create(&question).Error; err != nil {
		c.String(http.StatusInternalServerError, "Failed to create User")
		return
	}

	c.String(http.StatusOK, "User Created")
}

func LoginUser(db *gorm.DB, c *gin.Context) {
	var input model.User
	if err := c.Bind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := UserGetByEmail(input.Email)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.String(http.StatusNotFound, "Email Not Found")
			return
		}
		c.String(http.StatusInternalServerError, "Email is not registered")
		return
	}

	if user.AccountStatus == 0 {
		c.String(http.StatusUnauthorized, "Account already suspended!")
		return
	}

	if err := helper.ComparePassword(user.Password, input.Password); err != nil {
		c.String(http.StatusUnauthorized, "Wrong Password")
		return
	}

	token, err := auth.GenerateJWT(int(user.UserID))
	if err != nil {
		c.String(http.StatusInternalServerError, "Invalid Token")
		return
	}

	response := gin.H{
		"userID":           user.UserID,
		"token":            token,
		"name":             user.FirstName + " " + user.LastName,
		"email":            user.Email,
		"role":             user.Role,
		"money":            user.WalletAmount,
		"picture":          user.ProfiePicture,
		"status":           user.Status,
		"creditCardNumber": user.CreditCardNumber,
	}

	c.JSON(http.StatusOK, response)
}

func SendOTP(c *gin.Context) {
	db := connection.GetDB()
	var input model.OTPUser
	if errs := c.Bind(&input); errs != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": errs.Error()})
		return
	}

	var user model.User
	error := db.Where("email = ?", input.Email).First(&user)
	if error.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Email Not Found"})
		return
	}

	if user.AccountStatus == 0 {
		c.String(http.StatusUnauthorized, "Account already suspended!")
		return

	}

	otp, getOTPTime, err := helper.GenerateOTP(input.Email)
	if err != nil {
		c.String(http.StatusInternalServerError, "Failed to generate OTP")
		return
	}

	globalOTP = otp
	globalOTPTime = getOTPTime
	fmt.Println(globalOTPTime)
	helper.SendVerification(input.Email, "Here is your OTP (expired 30 seconds): "+otp)
	c.JSON(http.StatusOK, gin.H{"message": "OTP Sent"})
}

func LoginByOTP(db *gorm.DB, c *gin.Context) {
	var input model.OTPUser
	if err := c.Bind(&input); err != nil {
		c.String(http.StatusBadRequest, "Invalid Request")
		return
	}

	isOTPValid := helper.VerifyOTP(globalOTP, input.OTP)
	if isOTPValid == false {
		c.String(http.StatusBadRequest, "Invalid OTP")
		return
	}

	expirationTime := globalOTPTime.Add(30 * time.Second)
	fmt.Println(expirationTime)
	if time.Now().After(expirationTime) {
		c.String(http.StatusBadRequest, "OTP has expired")
		return
	}

	user, err := UserGetByEmail(input.Email)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Email Not Found"})
			return
		}
		c.String(http.StatusInternalServerError, "Email is not registered")
		return
	}

	if user.AccountStatus == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Account already suspended!"})
		return
	}

	token, err := auth.GenerateJWT(int(user.UserID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := gin.H{
		"userID": user.UserID,
		"token":  token,
		"name":   user.FirstName + " " + user.LastName,
		"email":  user.Email,
		"role":   user.Role,
		"status": user.Status,
	}

	c.JSON(http.StatusOK, response)
}

func GetUserPersonalQuestion(db *gorm.DB, c *gin.Context) {
	var input model.OTPUser
	if err := c.Bind(&input); err != nil {
		c.String(http.StatusBadRequest, "Invalid Request")
		return
	}

	user, err := UserGetByEmail(input.Email)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.String(http.StatusNotFound, "Invalid Email")
			return
		}
		c.String(http.StatusInternalServerError, "Email is not registered")
		return
	}

	question, err := GetUserQuestion(user.QuestionID)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.String(http.StatusNotFound, "Invalid Question")
			return
		}
		c.String(http.StatusInternalServerError, "Question is not registered")
		return
	}

	response := gin.H{
		"questionID": question.QuestionID,
		"question":   question.Question,
		"userID":     user.UserID,
	}

	c.JSON(http.StatusOK, response)
}

func UpdateUserPassword(db *gorm.DB, ctx *gin.Context) {
	var input model.User

	if err := ctx.Bind(&input); err != nil {
		ctx.String(http.StatusBadRequest, "Invalid Request!")
		return
	}

	var existingUser model.User

	passwordRegex := regexp.MustCompile(`^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$`)
	if !passwordRegex.MatchString(input.Password) {
		ctx.String(http.StatusConflict, "Password must be at least 8 characters, contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character")
		return
	}

	if err := db.First(&existingUser, input.UserID).Error; err != nil {
		ctx.String(http.StatusNotFound, "User not found!")
		return
	}

	newPassword := helper.HashPassword(input.Password)
	existingUser.Password = newPassword

	db.Save(&existingUser)
	ctx.String(http.StatusOK, "Password Updated!")
}

func UserGetByEmail(email string) (*model.User, error) {
	db := connection.GetDB()
	var user model.User
	if err := db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func CheckExistEmail(email string) bool {
	db := connection.GetDB()

	var model *model.User

	err := db.First(&model, "email = ?", email).Error
	if err != nil {
		return false
	} else {
		return true
	}
}

func GetUserQuestion(questionID uint) (*model.Question, error) {
	db := connection.GetDB()
	var question model.Question
	if err := db.Where("question_id = ?", questionID).First(&question).Error; err != nil {
		return nil, err
	}
	return &question, nil
}

// ListUser
//
//	@Summary      List Users
//	@Description  get users
//	@Tags         user
//	@Accept       json
//	@Produce      json
//	@Success      200  {array}   model.Question
//	@Router       /api/user/get-user [get]
func GetAllUser(ctx *gin.Context) {
	db := connection.GetDB()
	var user []model.User
	db.Find(&user)
	ctx.JSON(http.StatusOK, user)
}

func BanUser(db *gorm.DB, ctx *gin.Context) {
	var input model.User

	if err := ctx.Bind(&input); err != nil {
		ctx.String(http.StatusBadRequest, "Invalid Request!")
		return
	}

	var existingUser model.User

	if err := db.First(&existingUser, input.UserID).Error; err != nil {
		ctx.String(http.StatusNotFound, "User not found!")
		return
	}

	existingUser.AccountStatus = 0
	db.Save(&existingUser)
	ctx.String(http.StatusOK, "User Banned!")
}

func GetUser(ctx *gin.Context) {
	db := connection.GetDB()
	var user model.User
	userID := ctx.Query("id")
	db.First(&user, userID)
	ctx.JSON(http.StatusOK, user)
}

func UpdateProfile(db *gorm.DB, ctx *gin.Context) {
	var input model.User

	if err := ctx.Bind(&input); err != nil {
		ctx.String(http.StatusBadRequest, "Invalid Request!")
		return
	}

	if input.FirstName == "" {
		ctx.String(http.StatusConflict, "Please Fill The FirstName")
		return
	}

	if input.LastName == "" {
		ctx.String(http.StatusConflict, "Please Fill The LastName")
		return
	}

	if len(input.FirstName) < 5 || len(input.LastName) < 5 {
		ctx.String(http.StatusConflict, "Name must be at least 5 characters")
		return
	}

	nameRegex := regexp.MustCompile(`^[a-zA-Z\s]*$`)
	if !nameRegex.MatchString(input.FirstName) || !nameRegex.MatchString(input.LastName) {
		ctx.String(http.StatusConflict, "Name must be alphabet")
		return
	}

	if input.Email == "" {
		ctx.String(http.StatusConflict, "Please Fill The Email")
		return
	}

	var existingUser model.User

	if err := db.First(&existingUser, input.UserID).Error; err != nil {
		ctx.String(http.StatusNotFound, "User not found!")
		return
	}

	existingUser.FirstName = input.FirstName
	existingUser.LastName = input.LastName
	existingUser.Email = input.Email
	existingUser.SubscribeStatus = input.SubscribeStatus
	existingUser.ProfiePicture = input.ProfiePicture

	db.Save(&existingUser)
}

func RefecthUser(db *gorm.DB, ctx *gin.Context) {
	var model *model.User

	userID := ctx.Query("ID")

	err := db.First(&model, userID).Error
	if err != nil {
		ctx.String(http.StatusNotFound, "User not found!")
		return
	}

	token, err := auth.GenerateJWT(int(model.UserID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := gin.H{
		"userID":           model.UserID,
		"token":            token,
		"name":             model.FirstName + " " + model.LastName,
		"email":            model.Email,
		"role":             model.Role,
		"money":            model.WalletAmount,
		"picture":          model.ProfiePicture,
		"status":           model.Status,
		"creditCardNumber": model.CreditCardNumber,
	}

	ctx.JSON(http.StatusOK, response)
}

func GetRoomByHotelID(ctx *gin.Context) {
	db := connection.GetDB()
	hotelID := ctx.Query("hotelID")
	var room []model.RoomDetail
	db.Where("hotel_id = ?", hotelID).Find(&room)

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
