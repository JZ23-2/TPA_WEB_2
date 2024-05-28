import { useState } from "react";
import "./card.scss";

interface CardProps {
  title: string;
  address?: string;
  roomType?: string;
  facility: string[];
  images: string[];
  onHandleDelete?: (id: string, hotelID?: string) => void;
  onHandleUpdate?: (id: string, hotelID: string) => void;
  id: string;
  hotelID?: string;
  roomPrice?: number;
}

const Card = ({
  title,
  images,
  address,
  facility,
  roomType,
  onHandleDelete,
  onHandleUpdate,
  id,
  hotelID,
  roomPrice,
}: CardProps) => {
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
    <div className="promo-card">
      <div className="image-slider">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Image ${index + 1}`}
            className={`${
              index === currentIndex ? "active" : ""
            } hotel-picture border-1 rounded-md`}
          />
        ))}
        <button className="prev" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="next" onClick={nextSlide}>
          &#10095;
        </button>
      </div>

      <div className="promo-details">
        <h3 className="title-name mt-2">Hotel Name: {title}</h3>
        {address && <p>Address: {address}</p>}
        {roomType && <p>Room Type: {roomType}</p>}
        {roomPrice && <p>Room Price: {roomPrice}</p>}
        <p>Facility:</p>
        <ul>
          {facility.map((fac, index) => (
            <li className="order-style" key={index}>
              {fac}
            </li>
          ))}
        </ul>
        <div className="action-container">
          <button
            className="button-action button-update"
            onClick={() => onHandleUpdate && onHandleUpdate(id, hotelID!)}
          >
            Update
          </button>
          <button
            className="button-action ml-3 button-remove"
            onClick={() => onHandleDelete && onHandleDelete(id, hotelID!)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
