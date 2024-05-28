package query

import (
	"github.com/JZ23-2/TPAWEB_TraveloHI/model"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AddReview(db *gorm.DB, ctx *gin.Context) {
	var input model.ReviewInput

	if err := ctx.Bind(&input); err != nil {
		ctx.String(400, "Invalid Request!")
		return
	}

	if input.ReviewContent == "" {
		ctx.String(400, "Invalid Review Content!")
		return
	}

	review := model.Review{
		ReviewID:      uint(input.ReviewID),
		ReviewContent: input.ReviewContent,
	}

	db.Create(&review)

	reviewDetail := model.ReviewDetail{
		ReviewID:   review.ReviewID,
		HotelID:    uint(input.HotelID),
		UserID:     uint(input.UserID),
		ReviewDate: input.ReviewDate,
	}

	db.Create(&reviewDetail)

	ctx.JSON(200, gin.H{
		"message": "Review added successfully!",
	})

}

func AddRating(db *gorm.DB, ctx *gin.Context) {
	var input model.RatingInput

	if err := ctx.Bind(&input); err != nil {
		ctx.String(400, "Invalid Request!")
		return
	}

	if input.Cleanliness <= 0 || input.Cleanliness > 5 {
		ctx.String(400, "Invalid Cleanliness Rating!")
		return
	}

	if input.Service <= 0 || input.Service > 5 {
		ctx.String(400, "Invalid Service Rating!")
		return
	}

	if input.Comfort <= 0 || input.Comfort > 5 {
		ctx.String(400, "Invalid Comfort Rating!")
		return
	}

	if input.Location <= 0 || input.Location > 5 {
		ctx.String(400, "Invalid Location Rating!")
		return
	}

	rating := model.Rating{
		RatingID:    uint(input.RatingID),
		Cleanliness: input.Cleanliness,
		Service:     input.Service,
		Comfort:     input.Comfort,
		Location:    input.Location,
	}

	db.Create(&rating)

	ratingDetail := model.RatingDetail{
		RatingID: rating.RatingID,
		HotelID:  uint(input.HotelID),
		UserID:   uint(input.UserID),
	}

	db.Create(&ratingDetail)

	ctx.JSON(200, gin.H{
		"message": "Rating added successfully!",
	})
}

func GetRating(db *gorm.DB, ctx *gin.Context) {
	var rating []model.RatingInput

	db.Table("ratings").Select("ratings.rating_id, cleanliness, comfort, location, service, hotel_id, user_id").
		Joins("JOIN rating_details ON ratings.rating_id = rating_details.rating_id").
		Scan(&rating)

	ctx.JSON(200, rating)
}

func GetReview(db *gorm.DB, ctx *gin.Context) {
	var review []model.ReviewInput

	db.Table("reviews").Select("reviews.review_id, review_content, hotel_id, user_id, review_date").
		Joins("JOIN review_details ON reviews.review_id = review_details.review_id").
		Scan(&review)

	ctx.JSON(200, review)
}
