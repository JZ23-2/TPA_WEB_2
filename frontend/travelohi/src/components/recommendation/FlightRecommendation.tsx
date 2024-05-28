interface FlightRecommendationProps {
  destinationName: string;
  flightName: string;
  totalBooked: number;
  averagePrice: number;
  destinationPicture: string;
}

function FlightRecommendation({
  destinationName,
  flightName,
  totalBooked,
  averagePrice,
  destinationPicture,
}: FlightRecommendationProps) {
  return (
    <div className="recommendation-image-container">
      <div className="recommendation-slider">
        <img
          src={destinationPicture}
          alt=""
          className="active hotel-picture rounded-md"
        />
      </div>
      <div className="recommendation-detail">
        <h3 className="recommendation-name-font mt-2">
          Destination: {destinationName}
        </h3>
        <h3 className="other-font">Recommended Flight: {flightName}</h3>
        <p className="other-font">Total Booked: {totalBooked}</p>
        <p className="other-font mb-3">Average Price: Rp.{averagePrice}</p>
      </div>
    </div>
  );
}

export default FlightRecommendation;
