package main

import (
	"net/http"

	"github.com/JZ23-2/TPAWEB_TraveloHI/connection"
	"github.com/JZ23-2/TPAWEB_TraveloHI/middlewares"
	"github.com/JZ23-2/TPAWEB_TraveloHI/query"
	"github.com/JZ23-2/TPAWEB_TraveloHI/seeder"
	_"github.com/JZ23-2/TPAWEB_TraveloHI/docs"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title           Swagger TPA JZ23-2
// @version         1.0
// @description     This is a sample server celler server.
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.url    http://www.swagger.io/support
// @contact.email  support@swagger.io

// @license.name  Apache 2.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

// @host      localhost:8080

// @externalDocs.description  OpenAPI
// @externalDocs.url          https://swagger.io/resources/open-api/

func main() {
	db := connection.GetDB()
	r := gin.Default()
	seeder.DestinationDetail(db)
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS, PUT,DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}
		c.Next()
	})

	r.Use(middlewares.AuthMiddleware())

	api := r.Group("/api")
	{
		question := api.Group("/question")
		{
			question.GET("/get-question", func(ctx *gin.Context) {
				query.GetQuestion(ctx)
			})
			question.POST("/check-answer", func(ctx *gin.Context) {
				query.GetAnswer(ctx)
			})
		}

		user := api.Group("/user")
		{
			user.POST("/register", func(ctx *gin.Context) {
				query.RegisterUser(db, ctx)
			})
			user.POST("/login", func(ctx *gin.Context) {
				query.LoginUser(db, ctx)
			})
			user.POST("/get-otp", func(ctx *gin.Context) {
				query.SendOTP(ctx)
			})
			user.POST("/login-otp", func(ctx *gin.Context) {
				query.LoginByOTP(db, ctx)
			})
			user.POST("/get-personal-question", func(ctx *gin.Context) {
				query.GetUserPersonalQuestion(db, ctx)
			})
			user.PUT("/update-user-password", func(ctx *gin.Context) {
				query.UpdateUserPassword(db, ctx)
			})
			user.GET("/get-user", func(ctx *gin.Context) {
				query.GetAllUser(ctx)
			})
			user.PUT("/ban-user", func(ctx *gin.Context) {
				query.BanUser(db, ctx)
			})
			user.GET("/get-user-by-id", func(ctx *gin.Context) {
				query.GetUser(ctx)
			})
			user.POST("/add-credit-card", func(ctx *gin.Context) {
				query.AddCreditCard(db, ctx)
			})
			user.PUT("/update-profile", func(ctx *gin.Context) {
				query.UpdateProfile(db, ctx)
			})
			user.POST("/flight-transaction", func(ctx *gin.Context) {
				query.FlightTransaction(db, ctx)
			})
			user.GET("/refetch-user", func(ctx *gin.Context) {
				query.RefecthUser(db, ctx)
			})
			user.POST("/room-transaction", func(ctx *gin.Context) {
				query.RoomTransaction(db, ctx)
			})
		}

		search := api.Group("/search")
		{
			search.POST("/get-search", func(ctx *gin.Context) {
				query.GetSearchResult(db, ctx)
			})
			search.GET("/get-recommendation-search", func(ctx *gin.Context) {
				query.GetRecommendationSearch(ctx)
			})
			search.GET("/get-user-history", func(ctx *gin.Context) {
				query.GetUserHistory(ctx)
			})
			search.GET("/get-flight-search", func(ctx *gin.Context) {
				query.GetFlightFromSearch(db, ctx)
			})
			search.GET("/get-flight-history-by-name", func(ctx *gin.Context) {
				query.GetFlightSearchByName(db, ctx)
			})
			search.GET("/get-room-history-by-name", func(ctx *gin.Context) {
				query.GetRoomSearchByName(ctx, db)
			})
			search.GET("/get-flight-history-by-code", func(ctx *gin.Context) {
				query.GetFlightSearchByCode(db, ctx)
			})
			search.GET("/get-flight-by-search", func(ctx *gin.Context) {
				query.GetFlightFromLocation(db, ctx)
			})
		}

		admin := api.Group("/admin")
		{
			admin.POST("/send-newsletter", func(ctx *gin.Context) {
				query.SendNewLetter(db, ctx)
			})
			admin.POST("/add-promo", func(ctx *gin.Context) {
				query.AddPromo(db, ctx)
			})
			admin.DELETE("/delete-promo", func(ctx *gin.Context) {
				query.DeletePromos(ctx)
			})
			admin.PUT("/update-promo", func(ctx *gin.Context) {
				query.UpdatePromo(db, ctx)
			})
			admin.POST("/add-flight", func(ctx *gin.Context) {
				query.AddFlight(db, ctx)
			})
			admin.DELETE("/delete-flight-detail", func(ctx *gin.Context) {
				query.DeleteFlight(ctx)
			})
			admin.PUT("/update-flight-detail", func(ctx *gin.Context) {
				query.UpdateFlight(db, ctx)
			})
			admin.DELETE("/delete-hotel", func(ctx *gin.Context) {
				query.DeleteHotel(ctx)
			})
			admin.PUT("/update-hotel", func(ctx *gin.Context) {
				query.UpdateHotel(db, ctx)
			})
			admin.POST("/add-room", func(ctx *gin.Context) {
				query.AddRoom(db, ctx)
			})
			admin.DELETE("/delete-room", func(ctx *gin.Context) {
				query.DeleteRoom(ctx)
			})
			admin.PUT("/update-room", func(ctx *gin.Context) {
				query.UpdateRoom(db, ctx)
			})
		}

		promo := api.Group("/promo")
		{
			promo.GET("/get-promo", func(ctx *gin.Context) {
				query.GetAllPromo(ctx)
			})
		}

		flight := api.Group("/flight")
		{
			flight.GET("/get-flight", func(ctx *gin.Context) {
				query.GetFlight(ctx)
			})
			flight.GET("/get-all-flight-detail", func(ctx *gin.Context) {
				query.GetAllFlightDetail(ctx)
			})
			flight.GET("/get-flight-detail", func(ctx *gin.Context) {
				query.GetFlightDetailByID(ctx)
			})
		}

		origin := api.Group("/origin")
		{
			origin.GET("/get-origin", func(ctx *gin.Context) {
				query.GetOrigin(ctx)
			})
		}

		destination := api.Group("/destination")
		{
			destination.GET("/get-destination", func(ctx *gin.Context) {
				query.GetDestination(ctx)
			})
		}

		hotel := api.Group("/hotel")
		{
			hotel.GET("/get-hotel-facility", func(ctx *gin.Context) {
				query.GetHotelFacility(ctx)
			})
			hotel.POST("/add-hotel", func(ctx *gin.Context) {
				query.AddHotel(db, ctx)
			})
			hotel.GET("/get-all-hotel-detail", func(ctx *gin.Context) {
				query.GetAllHotelDetail(ctx)
			})
			hotel.POST("get-hotel-by-name", func(ctx *gin.Context) {
				query.SearchHotelByName(ctx)
			})
			hotel.GET("get-hotel-by-id", func(ctx *gin.Context) {
				query.GetHotelByID(ctx)
			})
			hotel.GET("get-hotel-by-search", func(ctx *gin.Context) {
				query.GetHotelByLocation(ctx)
			})

		}
		room := api.Group("/room")
		{
			room.GET("/get-room-facility", func(ctx *gin.Context) {
				query.GetRoomFacility(ctx)
			})
			room.GET("/get-room", func(ctx *gin.Context) {
				query.GetRoom(ctx)
			})
			room.GET("/get-all-room-detail", func(ctx *gin.Context) {
				query.GetAllHotelRoom(ctx)
			})
			room.GET("get-room-by-id", func(ctx *gin.Context) {
				query.GetRoomByHotelID(ctx)
			})
			room.GET("get-room-detail-by-id", func(ctx *gin.Context) {
				query.GetRoomDetailByHotelID(ctx)
			})
		}

		seat := api.Group("/seat")
		{
			seat.GET("/get-flight-seat", func(ctx *gin.Context) {
				query.GetFlightSeat(ctx)
			})
		}

		cart := api.Group("/cart")
		{
			cart.POST("/add-flight-cart", func(ctx *gin.Context) {
				query.AddFlightCart(db, ctx)
			})
			cart.POST("/add-room-cart", func(ctx *gin.Context) {
				query.AddRoomCart(db, ctx)
			})
			cart.GET("/get-user-flight-cart", func(ctx *gin.Context) {
				query.GetUserFlightCart(db, ctx)
			})
			cart.GET("/get-user-room-cart", func(ctx *gin.Context) {
				query.GetUserRoomCart(db, ctx)
			})
			cart.POST("/room-cart-transaction", func(ctx *gin.Context) {
				query.RoomCartTransaction(db, ctx)
			})
			cart.POST("/flight-cart-transaction", func(ctx *gin.Context) {
				query.CartFlightTransaction(db, ctx)
			})
		}

		recommnedation := api.Group("/recommendation")
		{
			recommnedation.GET("/get-hotel-recommendation", func(ctx *gin.Context) {
				query.GetHotelRecommendation(db, ctx)
			})
			recommnedation.GET("/get-flight-recommendation", func(ctx *gin.Context) {
				query.GetFlightRecommendation(db, ctx)
			})
		}

		history := api.Group("/history")
		{
			history.GET("/get-flight-history", func(ctx *gin.Context) {
				query.GetFlightHistory(ctx, db)
			})
			history.GET("/get-room-history", func(ctx *gin.Context) {
				query.GetRoomHistory(ctx, db)
			})
		}

		review := api.Group("/review")
		{
			review.POST("/add-review", func(ctx *gin.Context) {
				query.AddReview(db, ctx)
			})
			review.GET("/get-review", func(ctx *gin.Context) {
				query.GetReview(db, ctx)
			})

		}

		rating := api.Group("/rating")
		{
			rating.POST("/add-rating", func(ctx *gin.Context) {
				query.AddRating(db, ctx)
			})
			rating.GET("/get-rating", func(ctx *gin.Context) {
				query.GetRating(db, ctx)
			})
		}

		game := api.Group("game")
		{
			game.GET("/win-game", func(ctx *gin.Context) {
				query.WinGame(db, ctx)
			})
		}
	}
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	r.Run(":8080")
}
