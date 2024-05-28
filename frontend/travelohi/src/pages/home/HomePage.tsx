import { useEffect, useState } from "react";
import airplane from "../../assets/airplane.png";
import Carousel from "../../components/carousel/Carousel";
import "./home.scss";
import axios from "axios";
import HotelRecommendation from "../../components/recommendation/HotelRecommendation";
import Footer from "../../components/Footer";
import FlightRecommendation from "../../components/recommendation/FlightRecommendation";

function HomePage() {
  const [images, setImages] = useState<[]>([]);
  const [recommendation, setRecommendation] = useState<[]>([]);
  const [flight, setFlight] = useState<[]>([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/promo/get-promo").then((res) => {
      setImages(res.data);
    });

    axios
      .get("http://localhost:8080/api/recommendation/get-hotel-recommendation")
      .then((res) => {
        console.log(res.data);
        setRecommendation(res.data);
      });

    axios
      .get("http://localhost:8080/api/recommendation/get-flight-recommendation")
      .then((res) => {
        setFlight(res.data);
        console.log(res.data);
      });
  }, []);

  return (
    <div className="scrollable w-screen h-screen">
      <div className="outer-container">
        <div className="text-container">
          <h2 className="title">Why Travel</h2>
          <h2 className="title-2">With Travelohi?</h2>
          <p>
            "Travel with TraveloHI for an unparalleled journey filled with
            expertise, customization, and attention to detail.
            <br /> Our experienced travel experts curate personalized packages
            tailored to your unique preferences.
            <br />
            Whether you crave exotic beach escapes, cultural explorations, or
            adventurous getaways, <br />
            TraveloHI offers diverse destinations to suit every taste. <br />
            We prioritize safety, value for money, and sustainability, ensuring
            a seamless and memorable travel experience. <br />
            Join us for a journey where every detail matters, and your
            satisfaction is our top priority."
          </p>
        </div>
        <div className="image-container">
          <img src={airplane} alt="airplane" className="w-96 h-96" />
        </div>
      </div>
      <Carousel items={images} />
      <h2 className="recommendation-text">Top 5 Recommendation Hotels</h2>
      <div className="recommendation-container">
        {recommendation.map((hotel: any, index: number) => (
          <HotelRecommendation
            key={index}
            images={hotel.HotelPicture}
            title={hotel.HotelName}
            address={hotel.HotelAddress}
            description={hotel.HotelDescription}
            mostBooked={hotel.Count}
          />
        ))}
      </div>
      <h2 className="recommendation-text">Top 5 Recommendation Flights</h2>
      <div className="recommendation-container">
        {flight.map((flight: any, index: number) => (
          <FlightRecommendation
            key={index}
            destinationName={flight.DestinationName}
            flightName={flight.FlightName}
            totalBooked={flight.TotalBooked}
            averagePrice={flight.AveragePrice}
            destinationPicture={flight.DestinationPicture}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
