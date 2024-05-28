import { FormEvent, useEffect, useState } from "react";
import { useUserAuth } from "../../context/UserContext";
import axios from "axios";
import { MdPeopleOutline } from "react-icons/md";
import ImageCard from "../../components/ImageCard";
import { PiAirplaneInFlightBold } from "react-icons/pi";

function TicketPage() {
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [flight, setFlight] = useState<[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [filterValue, setFilterValue] = useState<string>("");
  const [hotel, setHotel] = useState<[]>([]);
  const { user } = useUserAuth();
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
          setFlightSearch(res.data);
          setHotelSearch([]);
        });
    }
  };

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

  return (
    <div className="outer-manage-hotel-container">
      <h1 className="text-h1">My Ticket</h1>
      <div className="middle-manage-hotel-container">
        <div className="search-box-container">
          <form onSubmit={handleSubmit} className="form-flight-container">
            <div className="inner-input-flight">
              <label htmlFor="searchValue">Search Ticket</label>
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
                            {res.Status === 1 &&
                            new Date(res.DestinationDate).getTime() >
                              new Date().getTime() ? (
                              <h1>Status : Paid & Ticket Status : On Going</h1>
                            ) : (
                              <h1>Status : Paid & Ticket Status : Expired</h1>
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
                        {res.Status === 1 &&
                        new Date(res.CheckInDate).getTime() >
                          new Date().getTime() ? (
                          <h2 className="room-font">
                            Status: Paid && Ticket Status: On Going
                          </h2>
                        ) : (
                          <h2 className="room-font">
                            Status: Not Paid && Ticket Status: Expired
                          </h2>
                        )}
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
                            {res.Status === 1 &&
                            new Date(res.DestinationDate).getTime() >
                              new Date().getTime() ? (
                              <h1>Status : Paid & Ticket Status : On Going</h1>
                            ) : (
                              <h1>Status : Paid & Ticket Status : Expired</h1>
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
                          {res.Status === 1 &&
                          new Date(res.CheckInDate).getTime() >
                            new Date().getTime() ? (
                            <h2 className="room-font">
                              Status: Paid && Ticket Status: On Going
                            </h2>
                          ) : (
                            <h2 className="room-font">
                              Status: Not Paid && Ticket Status: Expired
                            </h2>
                          )}
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
                              {res.Status === 1 &&
                              new Date(res.DestinationDate).getTime() >
                                new Date().getTime() ? (
                                <h1>
                                  Status : Paid & Ticket Status : On Going
                                </h1>
                              ) : (
                                <h1>Status : Paid & Ticket Status : Expired</h1>
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
                            {res.Status === 1 &&
                            new Date(res.CheckInDate).getTime() >
                              new Date().getTime() ? (
                              <h2 className="room-font">
                                Status: Paid && Ticket Status: On Going
                              </h2>
                            ) : (
                              <h2 className="room-font">
                                Status: Not Paid && Ticket Status: Expired
                              </h2>
                            )}
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
    </div>
  );
}

export default TicketPage;
