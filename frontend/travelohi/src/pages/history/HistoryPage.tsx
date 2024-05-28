import { FormEvent, useEffect, useState } from "react";
import "../../pages/flight/flight.scss";
import "./history.scss";
import axios from "axios";
import { PiAirplaneInFlightBold } from "react-icons/pi";
import { useUserAuth } from "../../context/UserContext";
import ImageCard from "../../components/ImageCard";
import { MdPeopleOutline } from "react-icons/md";
function HistoryPage() {
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [flight, setFlight] = useState<[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [hotel, setHotel] = useState<[]>([]);
  const { user } = useUserAuth();
  const [selectedHotel, setSelectedHotel] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [isReview, setIsReview] = useState<boolean>(false);
  const [isRating, setIsRating] = useState<boolean>(false);
  const [clean, setClean] = useState<number>(0);
  const [comfort, setComfort] = useState<number>(0);
  const [location, setLocation] = useState<number>(0);
  const [service, setService] = useState<number>(0);
  const [anonymous, setAnonymous] = useState<any[]>([]);
  const [anonymousValue, setAnonymousValue] = useState<string>("");
  const [flightSearch, setFlightSearch] = useState<any[]>([]);
  const [hotelSearch, setHotelSearch] = useState<any[]>([]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSearch(true);
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("searchValue") as string;
    const searchType = formData.get("searchType") as string;
    console.log(searchValue);
    if (searchType === "0") {
      alert("Please select search by");
    }

    if (searchValue === "") {
      alert("Please input search value");
      setIsSearch(false);
    }

    if (searchType === "flightName") {
      axios
        .get("http://localhost:8080/api/search/get-flight-history-by-name", {
          params: { FlightName: searchValue },
        })
        .then((res) => {
          setHotelSearch([]);
          setFlightSearch(res.data);
        });
    } else if (searchType === "hotelName") {
      axios
        .get("http://localhost:8080/api/search/get-room-history-by-name", {
          params: { HotelName: searchValue },
        })
        .then((res) => {
          setHotelSearch(res.data);
          setFlightSearch([]);
        });
    } else if (searchType === "flightCode") {
      axios
        .get("http://localhost:8080/api/search/get-flight-history-by-code", {
          params: { FlightCode: searchValue },
        })
        .then((res) => {
          setHotelSearch([]);
          setFlightSearch(res.data);
        });
    }
  };

  const handleShowModal = (hoteID: number, isReview: boolean) => {
    setShowModal(true);
    setSelectedHotel(hoteID);
    setIsReview(isReview);
    setIsRating(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedHotel(0);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/history/get-flight-history", {
        params: { UserID: user?.userID },
      })
      .then((res) => {
        setFlight(res.data);
      });

    axios
      .get("http://localhost:8080/api/history/get-room-history", {
        params: { UserID: user?.userID },
      })
      .then((res) => {
        setHotel(res.data);
      });
  }, [user]);

  function formatDate(dateTimeString: string): string {
    const options = {
      year: "numeric" as const,
      month: "short" as const,
      day: "numeric" as const,
    };

    const formattedDate = new Date(dateTimeString).toLocaleString(
      "en-US",
      options
    );
    return formattedDate;
  }

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

  const handleFilter = (name: string) => {
    const isChecked = filtered.includes(name);

    if (isChecked) {
      setFiltered(filtered.filter((value) => value !== name));
      setFilterValue("");
    } else {
      setFiltered([...filtered, name]);
      setFilterValue(name);
    }
  };

  const handleAnounymouse = (name: string) => {
    const isChecked = anonymous.includes(name);

    if (isChecked) {
      setAnonymous(anonymous.filter((value) => value !== name));
      setAnonymousValue("");
    } else {
      setAnonymous([...anonymous, name]);
      setAnonymousValue(name);
    }
  };

  const handleAddReview = () => {
    var userID = user?.userID;
    if (review === "") {
      alert("Please input review");
      return;
    }

    if (anonymousValue === "yes") {
      userID = 0;
    }

    axios
      .post("http://localhost:8080/api/review/add-review", {
        HotelID: selectedHotel,
        UserID: userID,
        ReviewContent: review,
        ReviewDate: new Date(),
      })
      .then(() => {
        alert("Review Added");
        window.location.reload();
        setShowModal(false);
        setSelectedHotel(0);
      });
  };

  const handleRating = () => {
    if (clean === 0 || comfort === 0 || location === 0 || service === 0) {
      alert("Please input all rating");
      return;
    }

    if (clean > 5 || comfort > 5 || location > 5 || service > 5) {
      alert("Rating must be less than 5");
      return;
    }

    if (clean < 1 || comfort < 1 || location < 1 || service < 1) {
      alert("Rating must be greater than 1");
      return;
    }

    axios
      .post("http://localhost:8080/api/rating/add-rating", {
        HotelID: selectedHotel,
        UserID: user?.userID,
        Cleanliness: clean,
        Comfort: comfort,
        Location: location,
        Service: service,
      })
      .then(() => {
        alert("Rating Added");
        window.location.reload();
        setShowModal(false);
        setSelectedHotel(0);
      });
  };

  return (
    <div className="outer-manage-hotel-container">
      <h1 className="text-h1">History</h1>
      <div className="middle-manage-hotel-container">
        <div className="search-box-container">
          <form onSubmit={handleSubmit} className="form-flight-container">
            <div className="inner-input-flight">
              <label htmlFor="searchValue">Search History</label>
              <input
                type="search"
                name="searchValue"
                className="search-history-input"
              />
            </div>
            <div className="inner-input-flight">
              <label htmlFor="searchType">Search By</label>
              <select name="searchType" className="search-history-select-input">
                <option value="0">Select Search By</option>
                <option value="flightName">Flight Name</option>
                <option value="hotelName">Hotel Name</option>
                <option value="flightCode">Flight Code</option>
              </select>
            </div>
            <div className="mt-5 ml-3">
              <button className="button-flight-style">Search</button>
            </div>
          </form>
        </div>
        {isSearch ? (
          <div className="result-search-container">
            <div className="filter-search-container">
              <div className="filter-price">
                <h4 className="font-filter color-primary">Filter By Type</h4>
                <div className="checkbox-container">
                  <input
                    checked={filtered.includes("flightTicket")}
                    onChange={() => handleFilter("flightTicket")}
                    type="checkbox"
                  />
                  <label className="font-label color-primary" htmlFor="flight">
                    Flight Ticket
                  </label>
                </div>
                <div className="checkbox-container">
                  <input
                    checked={filtered.includes("hotelTicket")}
                    onChange={() => handleFilter("hotelTicket")}
                    type="checkbox"
                  />
                  <label className="font-label color-primary" htmlFor="hotel">
                    Hotel Ticket
                  </label>
                </div>
              </div>
            </div>
            <div className="result-container">
              <div>
                {flightSearch.length !== 0 ? (
                  flightSearch.map((res: any, index: number) => (
                    <div key={index} className="ticket-display">
                      <div className="title-ticket-container">
                        <div className="title-ticket">
                          <h3 className="flight-font mt-4">{res.FlightName}</h3>
                          <div className="destination-arrival-container">
                            <div className="destination-container">
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
                        <div className="button-price-container">
                          <div className="inner-detail-container">
                            <h1>
                              {formatDate(res.DestinationDate)} -{" "}
                              {formatDate(res.ArrivalDate)}
                            </h1>
                            <h1>
                              Total Price: Rp. {res.FlightPrice * res.Quantity}{" "}
                            </h1>
                            {res.Status === 1 ? (
                              <h1>Status: Paid</h1>
                            ) : (
                              <h1>Status : Not Paid</h1>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>{hotelSearch.length === 0 && <h1>No Flight Found</h1>}</>
                )}
              </div>
              <div>
                {hotelSearch.length !== 0 ? (
                  hotelSearch.map((res: any, index: number) => (
                    <div className="room-display" key={index}>
                      <ImageCard images={res.RoomPicture} />
                      <div className="description-container">
                        <div className="inner-description-container">
                          <h1 className="mt-3 text-hotel-h1">
                            {res.HotelName}
                          </h1>
                          <h2 className="room-price-font">
                            Rp.{res.RoomPrice} / PAX
                          </h2>
                        </div>
                        <h2 className="room-font">{res.RoomName}</h2>
                        <h2 className="room-font">
                          CheckIn Datetime:{" "}
                          {`${formatDate(res.CheckInDate)} - ${formatTime(
                            res.CheckInDate
                          )}`}
                        </h2>
                        <h2 className="room-font">
                          CheckOut Datetime:{" "}
                          {`${formatDate(res.CheckOutDate)} - ${formatTime(
                            res.CheckOutDate
                          )}`}
                        </h2>
                        <h2 className="room-guest-font">
                          <MdPeopleOutline className="guest-font" />{" "}
                          {res.RoomCapacity} Guests
                        </h2>
                        {res.Status === 1 ? (
                          <h2 className="room-font">Status: Paid</h2>
                        ) : (
                          <h2 className="room-font">Status: Not Paid</h2>
                        )}
                        <div className="view-room-container gap-2">
                          <button
                            onClick={() => {
                              handleShowModal(res.HotelID, false);
                              setIsRating(true);
                            }}
                            className="view-room-button mb-2"
                          >
                            Rating
                          </button>
                          <button
                            onClick={() => {
                              handleShowModal(res.HotelID, true);
                              setIsRating(false);
                            }}
                            className="view-room-button mb-2"
                          >
                            Review
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>{flightSearch.length === 0 && <h1>No Hotel Found</h1>}</>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="result-search-container">
            <div className="filter-search-container">
              <div className="filter-price">
                <h4 className="font-filter color-primary">Filter By Type</h4>
                <div className="checkbox-container">
                  <input
                    checked={filtered.includes("flightTicket")}
                    onChange={() => handleFilter("flightTicket")}
                    type="checkbox"
                  />
                  <label className="font-label color-primary" htmlFor="flight">
                    Flight Ticket
                  </label>
                </div>
                <div className="checkbox-container">
                  <input
                    checked={filtered.includes("hotelTicket")}
                    onChange={() => handleFilter("hotelTicket")}
                    type="checkbox"
                  />
                  <label className="font-label color-primary" htmlFor="hotel">
                    Hotel Ticket
                  </label>
                </div>
              </div>
            </div>
            <div className="result-container">
              {filtered.length === 0 ? (
                <div>
                  {flight.map((res: any, index: number) => (
                    <div key={index} className="ticket-display">
                      <div className="title-ticket-container">
                        <div className="title-ticket">
                          <h3 className="flight-font mt-4">{res.FlightName}</h3>
                          <div className="destination-arrival-container">
                            <div className="destination-container">
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
                        <div className="button-price-container">
                          <div className="inner-detail-container">
                            <h1>
                              {formatDate(res.DestinationDate)} -{" "}
                              {formatDate(res.ArrivalDate)}
                            </h1>
                            <h1>
                              Total Price: Rp. {res.FlightPrice * res.Quantity}{" "}
                            </h1>
                            {res.Status === 1 ? (
                              <h1>Status: Paid</h1>
                            ) : (
                              <h1>Status : Not Paid</h1>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div>
                    {hotel.map((res: any, index: number) => (
                      <div className="room-display" key={index}>
                        <ImageCard images={res.RoomPicture} />
                        <div className="description-container">
                          <div className="inner-description-container">
                            <h1 className="mt-3 text-hotel-h1">
                              {res.HotelName}
                            </h1>
                            <h2 className="room-price-font">
                              Rp.{res.RoomPrice} / PAX
                            </h2>
                          </div>
                          <h2 className="room-font">{res.RoomName}</h2>
                          <h2 className="room-font">
                            CheckIn Datetime:{" "}
                            {`${formatDate(res.CheckInDate)} - ${formatTime(
                              res.CheckInDate
                            )}`}
                          </h2>
                          <h2 className="room-font">
                            CheckOut Datetime:{" "}
                            {`${formatDate(res.CheckOutDate)} - ${formatTime(
                              res.CheckOutDate
                            )}`}
                          </h2>
                          <h2 className="room-guest-font">
                            <MdPeopleOutline className="guest-font" />{" "}
                            {res.RoomCapacity} Guests
                          </h2>
                          {res.Status === 1 ? (
                            <h2 className="room-font">Status: Paid</h2>
                          ) : (
                            <h2 className="room-font">Status: Not Paid</h2>
                          )}
                          <div className="view-room-container gap-2">
                            <button
                              onClick={() => {
                                handleShowModal(res.HotelID, false);
                                setIsRating(true);
                              }}
                              className="view-room-button mb-2"
                            >
                              Rating
                            </button>
                            <button
                              onClick={() => {
                                handleShowModal(res.HotelID, true);
                                setIsRating(false);
                              }}
                              className="view-room-button mb-2"
                            >
                              Review
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  {filterValue === "flightTicket" ? (
                    flight.map((res: any, index: number) => (
                      <div key={index} className="ticket-display">
                        <div className="title-ticket-container">
                          <div className="title-ticket">
                            <h3 className="flight-font mt-4">
                              {res.FlightName}
                            </h3>
                            <div className="destination-arrival-container">
                              <div className="destination-container">
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
                          <div className="button-price-container">
                            <div className="inner-detail-container">
                              <h1>
                                {formatDate(res.DestinationDate)} -{" "}
                                {formatDate(res.ArrivalDate)}
                              </h1>
                              <h1>
                                Total Price: Rp.{" "}
                                {res.FlightPrice * res.Quantity}{" "}
                              </h1>
                              {res.Status === 1 ? (
                                <h1>Status: Paid</h1>
                              ) : (
                                <h1>Status : Not Paid</h1>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>
                      {hotel.map((res: any, index: number) => (
                        <div className="room-display" key={index}>
                          <ImageCard images={res.RoomPicture} />
                          <div className="description-container">
                            <div className="inner-description-container">
                              <h1 className="mt-3 text-hotel-h1">
                                {res.HotelName}
                              </h1>
                              <h2 className="room-price-font">
                                Rp.{res.RoomPrice} / PAX
                              </h2>
                            </div>
                            <h2 className="room-font">{res.RoomName}</h2>
                            <h2 className="room-font">
                              CheckIn Datetime:{" "}
                              {`${formatDate(res.CheckInDate)} - ${formatTime(
                                res.CheckInDate
                              )}`}
                            </h2>
                            <h2 className="room-font">
                              CheckOut Datetime:{" "}
                              {`${formatDate(res.CheckOutDate)} - ${formatTime(
                                res.CheckOutDate
                              )}`}
                            </h2>
                            <h2 className="room-guest-font">
                              <MdPeopleOutline className="guest-font" />{" "}
                              {res.RoomCapacity} Guests
                            </h2>
                            {res.Status === 1 ? (
                              <h2 className="room-font">Status: Paid</h2>
                            ) : (
                              <h2 className="room-font">Status: Not Paid</h2>
                            )}
                            <div className="view-room-container gap-2">
                              <button
                                onClick={() => {
                                  handleShowModal(res.HotelID, false);
                                  setIsRating(true);
                                }}
                                className="view-room-button mb-2"
                              >
                                Rating
                              </button>
                              <button
                                onClick={() => {
                                  handleShowModal(res.HotelID, true);
                                  setIsRating(false);
                                }}
                                className="view-room-button mb-2"
                              >
                                Review
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {showModal && (
        <div>
          <div className="modal-overlay"></div>
          <div className="update-modal">
            <h1 className="text-promo-h1">{isReview ? "Review" : "Rating"}</h1>
            <div className="mt-3">
              {isReview ? (
                <>
                  <label className="mt-3" htmlFor="reviewContent">
                    Review Content
                  </label>
                  <input
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="input-container"
                    type="text"
                    name="reviewContent"
                    placeholder="Write Your Review"
                  />

                  <div className="flex mt-3 gap-2 justify-center">
                    <input
                      checked={anonymous.includes("yes")}
                      onChange={() => handleAnounymouse("yes")}
                      type="checkbox"
                    />
                    <label htmlFor="">Anonymous</label>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <label className="mt-3" htmlFor="cleanliness">
                    Cleanliness
                  </label>
                  <input
                    name="cleanliness"
                    type="number"
                    onChange={(e) => setClean(Number(e.target.value))}
                    min={1}
                    max={5}
                    className="input-container"
                  />
                  <label className="mt-3" htmlFor="comfort">
                    Comfort
                  </label>
                  <input
                    type="number"
                    onChange={(e) => setComfort(Number(e.target.value))}
                    min={1}
                    max={5}
                    name="comfort"
                    className="input-container"
                  />
                  <label className="mt-3" htmlFor="location">
                    location
                  </label>
                  <input
                    name="location"
                    onChange={(e) => setLocation(Number(e.target.value))}
                    type="number"
                    min={1}
                    max={5}
                    className="input-container"
                  />
                  <label className="mt-3" htmlFor="service">
                    Service
                  </label>
                  <input
                    onChange={(e) => setService(Number(e.target.value))}
                    name="service"
                    type="number"
                    min={1}
                    max={5}
                    className="input-container"
                  />
                </div>
              )}
            </div>
            <div className="button-update-container">
              <button
                onClick={isReview ? handleAddReview : handleRating}
                className="button-update py-2"
                type="submit"
              >
                Confirm
              </button>
              <button onClick={handleCloseModal} className="button-update py-2">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
