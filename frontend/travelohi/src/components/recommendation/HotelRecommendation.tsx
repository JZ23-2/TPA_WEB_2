import { useState } from "react";
import "./recommendation.scss";

interface HotelRecommendationProps {
  images: [];
  title: string;
  description: string;
  address: string;
  mostBooked : number;
}

const HotelRecommendation = ({
  images,
  title,
  description,
  address,
  mostBooked,
}: HotelRecommendationProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    );
  };

  return (
    <div className="recommendation-image-container">
      <div className="recommendation-slider">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Image ${index + 1}`}
            className={`${
              index === currentIndex ? "active" : ""
            } hotel-picture rounded-md`}
          />
        ))}
        <button className="prev" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="next" onClick={nextSlide}>
          &#10095;
        </button>
      </div>
      <div className="recommendation-detail">
        <h3 className="recommendation-name-font mt-2">Hotel Name: {title}</h3>
        <p className="other-font">{description}</p>
        {address && <p className="other-font">Address: {address}</p>}
        {mostBooked && <p className="other-font mb-3">Most Booked: {mostBooked} booked</p>}
      </div>
    </div>
  );
};

export default HotelRecommendation;
