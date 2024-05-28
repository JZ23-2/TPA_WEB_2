package seeder

import (
	"math/rand"
	"time"

	"github.com/JZ23-2/TPAWEB_TraveloHI/model"
	"gorm.io/gorm"
)

func Seed(db *gorm.DB) {
	questions := []model.Question{
		{Question: "What is your favorite childhood pet's name?"},
		{Question: "In which city were you born?"},
		{Question: "What is the name of your favorite book or movie?"},
		{Question: "What is the name of the elementary school you attended?"},
		{Question: "What is the model of your first car?"},
	}
	db.Create(questions)
}

func FlightSeeder(db *gorm.DB) {
	flight := []model.Flight{
		{FlightCode: "AA123", FlightName: "American Airlines Flight 123"},
		{FlightCode: "LH456", FlightName: "Lufthansa Flight 456"},
		{FlightCode: "BA789", FlightName: "British Airways Flight 789"},
		{FlightCode: "AF101", FlightName: "Air France Flight 101"},
		{FlightCode: "KL112", FlightName: "KLM Flight 112"},
	}
	db.Create(flight)
}

func DestinationSeeder(db *gorm.DB) {
	destination := []model.Destination{
		{DestinationName: "Brazil"},
		{DestinationName: "Finland"},
		{DestinationName: "Japan"},
		{DestinationName: "United-Kingdom"},
		{DestinationName: "United-States"},
	}
	db.Create(destination)
}

func OriginSeeder(db *gorm.DB) {
	origin := []model.Origin{
		{OriginName: "Brazil"},
		{OriginName: "Finland"},
		{OriginName: "Japan"},
		{OriginName: "United-Kingdom"},
		{OriginName: "United-States"},
	}
	db.Create(origin)
}
func SeatSeeder(db *gorm.DB) {
	rand.Seed(time.Now().UnixNano())

	var seatClasses = []string{"Economy", "Business", "FirstClass"}

	var seats []model.Seat

	for i := 0; i < 50; i++ {
		randomIndex := rand.Intn(len(seatClasses))
		randomSeatClass := seatClasses[randomIndex]

		seat := model.Seat{
			SeatClass: randomSeatClass,
		}

		seats = append(seats, seat)
	}

	// Insert the seats into the database
	for _, seat := range seats {
		db.Create(&seat)
	}
}

func HotelFacilitySeeder(db *gorm.DB) {
	hotel := []model.HotelFacility{
		{FacilityName: "Swimming Pool"},
		{FacilityName: "Gym"},
		{FacilityName: "Spa"},
		{FacilityName: "Restaurant"},
		{FacilityName: "Bar"},
	}
	db.Create(hotel)
}

func RoomFacilitySeeder(db *gorm.DB) {
	room := []model.RoomFacility{
		{FacilityName: "Air Conditioner"},
		{FacilityName: "TV"},
		{FacilityName: "Bathroom"},
		{FacilityName: "WiFi"},
		{FacilityName: "Breakfast"},
	}
	db.Create(room)
}

func Room(db *gorm.DB) {
	room := []model.Room{
		{RoomName: "Standard"},
		{RoomName: "Deluxe"},
		{RoomName: "Suite"},
		{RoomName: "Superior"},
		{RoomName: "Executive"},
	}
	db.Create(room)
}

func DestinationDetail(db *gorm.DB) {
	DestinationDetail := []model.DestinationDetail{
		{DestinationID: 1, DestinationPicture: "https://firebasestorage.googleapis.com/v0/b/travelohi-4f176.appspot.com/o/images%2Fbrazil.jpeg?alt=media&token=e2ef260d-eb62-4a56-a660-a89b4777d2bd"},
		{DestinationID: 2, DestinationPicture: "https://firebasestorage.googleapis.com/v0/b/travelohi-4f176.appspot.com/o/images%2FFindland.jpeg?alt=media&token=39de423c-f97d-4d23-8a74-a35678056298"},
		{DestinationID: 3, DestinationPicture: "https://firebasestorage.googleapis.com/v0/b/travelohi-4f176.appspot.com/o/images%2FJapan.jpeg?alt=media&token=e02ee618-b5c8-4d93-b427-324f21635fdd"},
		{DestinationID: 4, DestinationPicture: "https://firebasestorage.googleapis.com/v0/b/travelohi-4f176.appspot.com/o/images%2Funited-kingdom.jpeg?alt=media&token=cb8bb3b6-f3d4-422c-b0ba-a88c71492bd0"},
		{DestinationID: 5, DestinationPicture: "https://firebasestorage.googleapis.com/v0/b/travelohi-4f176.appspot.com/o/images%2Funited-states.jpeg?alt=media&token=3c0aa148-0b15-4a7d-8e4e-54706bd3f53a"},
	}
	db.Create(DestinationDetail)
}
