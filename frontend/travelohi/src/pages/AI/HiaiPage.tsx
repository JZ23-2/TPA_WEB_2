import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "../AI/ai.scss";
import { PiAirplaneInFlightBold } from "react-icons/pi";
import ImageCard from "../../components/ImageCard";
import logo_burung from "../../assets/logo_burung.png";
import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";

function HiaiPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  var test = "";
  const [flightResult, setFlightResult] = useState<[]>([]);
  const [hotelResult, setHotelResult] = useState<[]>([]);
  const [rating, setRating] = useState<[]>([]);
  const [review, setReview] = useState<[]>([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/rating/get-rating").then((res) => {
      setRating(res.data);
    });

    axios.get("http://localhost:8080/api/review/get-review").then((res) => {
      setReview(res.data);
    });
  }, []);

  const handleImageChange = () => {
    if (inputRef.current && inputRef.current.files) {
      setSelectedImage(inputRef.current.files[0]);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedImage) {
      alert("No image selected");
      return;
    }

    if (inputRef.current && inputRef.current.files) {
      const file = inputRef.current.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        alert("Image File Doesn't Support (Only Support .jpg, .jpeg, .png)");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      await axios
        .post("http://localhost:9999/api/upload-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res: any) => {
          console.log(res.data[0]);
          test = res.data[0];
        });
    }
    console.log(test);
    await axios
      .get("http://localhost:8080/api/search/get-flight-by-search", {
        params: {
          keyword: test,
        },
      })
      .then((res: any) => {
        setFlightResult(res.data);
      });

    await axios
      .get("http://localhost:8080/api/hotel/get-hotel-by-search", {
        params: {
          keyword: test,
        },
      })
      .then((res: any) => {
        setHotelResult(res.data);
      });
  };

  const filteredRating = (hotelID: number): number => {
    const filtered = rating.filter((rate: any) => rate.HotelID === hotelID);
    const totalRatings = filtered.reduce((acc: number, rate: any) => {
      return (
        acc +
        (rate.Comfort + rate.Cleanliness + rate.Location + rate.Service / 4) /
          (filtered.length * 5)
      );
    }, 0);

    const roundedRating = parseFloat(totalRatings.toFixed(1));
    return roundedRating;
  };

  const filteredReview = (hotelID: number): number => {
    const filtered = review.filter((rev: any) => rev.HotelID === hotelID);
    return filtered.length;
  };

  function formatTime(dateTimeString: string): string {
    const options = {
      hour: "numeric" as const,
      minute: "numeric" as const,
      hour12: false,
    };

    const formattedTime = new Date(dateTimeString).toLocaleString(
      "en-US",
      options
    );
    return formattedTime;
  }

  console.log(flightResult);

  return (
    <div className="outer-manage-flight-container">
      <h1 className="text-h1">HI AI</h1>
      <div className="middle-manage-flight-container">
        {flightResult && flightResult.length === 0 ? (
          <div className="upload-picture-container">
            <div className="upload-container">
              <div className="upload-btn-wrapper">
                <button className="button-upload-image">Choose Image</button>
                <input
                  ref={inputRef}
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div>
              {selectedImage !== null && (
                <div className="inner-image-uplaod-image-container">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    className="image-upload-image"
                    alt="Selected"
                  />
                  <button
                    onClick={handleUploadImage}
                    className="button-upload-image"
                  >
                    Upload
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="result-container">
            <div>
              {flightResult && flightResult.length !== 0 ? (
                flightResult.map((res: any, index: number) => (
                  <div key={index} className="ticket-display">
                    <div className="title-ticket-container">
                      <div className="title-ticket">
                        <h3 className="flight-font mt-4">{res.FlightName}</h3>
                        <div className="destination-arrival-container">
                          <div className="destinaton-container">
                            <h3 className="time-font mt-3">
                              {formatTime(res.DestinationDate)}
                            </h3>
                            <h4 className="place-font">{res.OriginName}</h4>
                          </div>
                          <div className="destination-container">
                            <h4 className="place-font">
                              {res.FlightDuration} Hours
                            </h4>
                            <PiAirplaneInFlightBold className="time-font" />
                            {res.TransitStatus === 0 ? (
                              <h4 className="place-font">Direct</h4>
                            ) : (
                              <h4 className="place-font">Transit</h4>
                            )}
                          </div>
                          <div className="destination-container">
                            <h3 className="time-font mt-3">
                              {formatTime(res.ArrivalDate)}
                            </h3>
                            <h4 className="place-font">
                              {res.DestinationName}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>
                  {hotelResult.length === 0 && <h1>No Flight Found</h1>}
                </div>
              )}
            </div>
            {hotelResult && hotelResult.length !== 0 ? (
              hotelResult.map((res: any, index: number) => (
                <div className="hotel-display" key={index}>
                  <ImageCard images={res.HotelPicture} />
                  <div className="description-container">
                    <div className="burung-container">
                      <h1 className="mt-3 text-hotel-h1">{res.HotelName}</h1>
                      <div className="flex mt-3">
                        <img className="logo-burung" src={logo_burung} alt="" />
                        <h2 className="burung-text">
                          {`${filteredRating(res.HotelID)}
                                (${filteredReview(res.HotelID)})`}
                        </h2>
                      </div>
                    </div>
                    <h2 className="general-text">{res.HotelDescription}</h2>
                    <h2 className="general-text">
                      <MdLocationOn />
                      {res.HotelAddress}
                    </h2>
                    <div className="flex gap-2 ml-2">
                      {res.FacilityName &&
                        res.FacilityName.map((fac: any, index: number) => (
                          <div key={index} className="facility-bubble">
                            {fac}
                          </div>
                        ))}
                    </div>
                    <div className="view-room-container">
                      {filteredReview(res.HotelID) !== 0 && (
                        <Link to={`/review-page/${res.HotelID}`}>
                          <button className="view-room-button mr-2">
                            View Reviews
                          </button>
                        </Link>
                      )}
                      <Link to={`/room-detail-page/${res.HotelID}`}>
                        <button className="view-room-button">View Rooms</button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>{flightResult.length === 0 && <h1>No Hotel Found</h1>}</>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HiaiPage;
