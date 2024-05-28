import { FormEvent, useEffect, useState } from "react";
import "./hotel.scss";
import axios from "axios";
import ImageCard from "../../components/ImageCard";
import { MdLocationOn } from "react-icons/md";
import logo_burung from "../../assets/logo_burung.png";
import { Link } from "react-router-dom";

function HotelPage() {
  const [hotel, setHotel] = useState<[]>([]);
  const [resultName, setResultName] = useState<[]>([]);
  const [onSearch, setOnSearch] = useState<boolean>(false);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [facility, setFacility] = useState<[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<String[]>([]);
  const [rating, setRating] = useState<[]>([]);
  const [review, setReview] = useState<[]>([]);
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationResult, setPaginationResult] = useState<any[]>([]);
  let totalPage = 0;

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/hotel/get-all-hotel-detail")
      .then((response) => {
        setHotel(response.data);
        console.log(response.data);
      });

    axios
      .get("http://localhost:8080/api/hotel/get-hotel-facility")
      .then((res) => {
        setFacility(res.data);
      });

    axios.get("http://localhost:8080/api/rating/get-rating").then((res) => {
      setRating(res.data);
    });

    axios.get("http://localhost:8080/api/review/get-review").then((res) => {
      setReview(res.data);
    });
  }, []);

  const handleSearchBynName = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOnSearch(true);
    const formData = new FormData(e.currentTarget);
    const hotelName = parseInt(formData.get("hotelName") as string);
    const hotelStringName = formData.get("hotelName") as string;
    axios
      .post("http://localhost:8080/api/hotel/get-hotel-by-name", {
        HotelID: hotelName,
      })
      .then((res) => {
        setResultName(res.data);
      });

    if (hotelStringName === "all") {
      axios
        .get("http://localhost:8080/api/hotel/get-all-hotel-detail")
        .then((response) => {
          setResultName(response.data);
        });
    }
  };

  const handleFacilityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    facilityName: String
  ) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedFacilities((prevSelected) => [...prevSelected, facilityName]);
    } else {
      setSelectedFacilities((prevSelected) =>
        prevSelected.filter((id) => id !== facilityName)
      );
    }
  };

  useEffect(() => {
    if (onSearch && resultName && resultName.length > 0) {
      const filteredHotels = resultName.filter((res: any) => {
        const hasAllFacilities = selectedFacilities.every((facilityID) =>
          res.FacilityName.includes(facilityID)
        );
        return hasAllFacilities;
      });
      setFiltered(filteredHotels);
    }
  }, [selectedFacilities, onSearch, resultName]);

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

  if (resultName) {
    totalPage = Math.ceil(resultName.length / itemsPerPage);
    console.log(totalPage);
  }

  useEffect(() => {
    if (resultName) {
      if (resultName.length !== 0) {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setPaginationResult(resultName.slice(startIndex, endIndex));
      }
    }
  }, [resultName, currentPage]);
  return (
    <div className="outer-manage-hotel-container">
      <h1 className="text-h1">Hotel</h1>
      <div className="middle-manage-hotel-container">
        <div className="search-box-container">
          <form
            onSubmit={handleSearchBynName}
            className="form-flight-container"
          >
            <div className="inner-input-flight">
              <label htmlFor="hotelName">Search Hotel</label>
              <select name="hotelName" className="search-hotel-input">
                <option value="0">Select A Hotel</option>
                <option value="all">View All</option>
                {hotel.map((hotel: any, index: number) => (
                  <option key={index} value={hotel.HotelID}>
                    {hotel.HotelName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-5">
              <button className="button-flight-style">Search</button>
            </div>
          </form>
        </div>
        {onSearch &&
          (resultName && resultName.length !== 0 ? (
            <div className="result-search-container">
              <div className="filter-search-container">
                <div className="filter-price">
                  <h4 className="font-filter">Filter By Facilities</h4>
                  {facility.map((fac: any, index: number) => (
                    <div className="checkbox-filter" key={index}>
                      <input
                        type="checkbox"
                        name="facility"
                        value={fac.FacilityName}
                        onChange={(e) =>
                          handleFacilityChange(e, fac.FacilityName)
                        }
                      />

                      <label htmlFor="facility">{fac.FacilityName}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="result-container">
                {filtered.length === 0 ? (
                  paginationResult.map((res: any, index: number) => (
                    <div key={index} className="hotel-display">
                      <ImageCard images={res.HotelPicture} />
                      <div className="description-container">
                        <div className="burung-container">
                          <h1 className="mt-3 text-hotel-h1">
                            {res.HotelName}
                          </h1>
                          <div className="flex mt-3">
                            <img
                              className="logo-burung"
                              src={logo_burung}
                              alt="logo_burung"
                            />
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
                            <button className="view-room-button">
                              View Rooms
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    {paginationResult.map((res: any, index: number) => (
                      <div key={index} className="hotel-display">
                        <ImageCard images={res.HotelPicture} />
                        <div className="description-container">
                          <div className="burung-container">
                            <h1 className="mt-3 text-hotel-h1">
                              {res.HotelName}
                            </h1>
                            <div className="flex mt-3 gap-2">
                              <img
                                className="logo-burung"
                                src={logo_burung}
                                alt="logo_burung"
                              />
                              <h2 className="burung-text">
                                {`${filteredRating(res.HotelID)}
                                (${filteredReview(res.HotelID)})`}
                              </h2>
                            </div>
                          </div>
                          <h2 className="general-text">
                            {res.HotelDescription}
                          </h2>
                          <h2 className="general-text">
                            <MdLocationOn />
                            {res.HotelAddress}
                          </h2>
                          <div className="flex gap-2 ml-2">
                            {res.FacilityName &&
                              res.FacilityName.map(
                                (fac: any, index: number) => (
                                  <div key={index} className="facility-bubble">
                                    {fac}
                                  </div>
                                )
                              )}
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
                              <button className="view-room-button">
                                View Rooms
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                <div className="pagination-container">
                  {Array.from({ length: totalPage }, (_, index) => (
                    <button
                      className="pagination-button"
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>No hotels found</div>
          ))}
      </div>
    </div>
  );
}

export default HotelPage;
