import { useState } from "react";

interface CardProps {
  images: string[];
}

function ImageCard({ images }: CardProps) {
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
      <div className="image-slider mt-3 ml-3 mb-3">
        {images.map((image, index) => (
          <img
            key={index}
            alt={`Image ${index + 1}`}
            src={image}
            className={`${
              index === currentIndex ? "active" : ""
            } hotel-picture border-1 rounded-md`}
          />
        ))}
        <button className="prev color-white" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="next color-white" onClick={nextSlide}>
          &#10095;
        </button>
      </div>
  );
}

export default ImageCard;
