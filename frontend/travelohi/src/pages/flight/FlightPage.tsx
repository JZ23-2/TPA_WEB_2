import { FormEvent, useEffect, useState } from "react";
import "./flight.scss";
import { PiAirplaneInFlightBold, PiAirplaneInFlightFill } from "react-icons/pi";
import axios from "axios";
import { Link } from "react-router-dom";

type Flight = {
  FlightID: number;
  FlightName: string;
  FlightCode: string;
  ArrivalDate: string;
  DestinationDate: string;
  DestinationID: number;
  ArrivalID: number;
  OriginName: string;
  DestinationName: string;
  Status: number;
  TransitStatus: number;
  SeatAvailable: number;
  ID: number;
  FlightPrice: number;
  FlightDuration: number;
};

function FlightPage() {
  const [destination, setDestionation] = useState<[]>([]);
  const [arrival, setArrival] = useState<[]>([]);
  const [flight, setFlight] = useState<[]>([]);
  const [onSearch, setOnSearch] = useState<boolean>(false);
  const [result, setResult] = useState<Flight[]>([]);
  const [filtered, setFiltered] = useState<Flight[]>([]);
  const [isDirectFilterChecked, setIsDirectFilterChecked] =
    useState<boolean>(false);
  const [isTransitFilterChecked, setIsTransitFilterChecked] =
    useState<boolean>(false);
  const [selectedFlightNames, setSelectedFlightNames] = useState<string[]>([]);
  const [isLessThan, setIsLessThan] = useState<boolean>(false);
  const [isMoreThan, setIsMoreThan] = useState<boolean>(false);
  const [is1hour, setIs1hour] = useState<boolean>(false);
  const [ismorethan1hour, setIsMoreThan1hour] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;
  const [paginationResult, setPaginationResult] = useState<Flight[]>([]);
  var totalPages = 0;

  const language = localStorage.getItem("language");

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOnSearch(true);
    const formData = new FormData(e.currentTarget);
    const origin = parseInt(formData.get("origin") as string);
    const arrival = parseInt(formData.get("arrival") as string);

    if (origin === 0 || arrival === 0) {
      alert("Please fill all the form!");
      return;
    }

    if (origin === arrival) {
      alert("Origin and Destination cannot be the same!");
      return;
    }

    axios
      .get("http://localhost:8080/api/search/get-flight-search", {
        params: {
          OriginID: origin,
          DestinationID: arrival,
        },
      })
      .then((res) => {
        // const startIndex = (currentPage - 1) * itemsPerPage;
        // const endIndex = startIndex + itemsPerPage;
        // setResult(res.data.slice(startIndex, endIndex));
        setResult(res.data);
      });
  };

  useEffect(() => {
    axios.get("http://localhost:8080/api/origin/get-origin").then((res) => {
      setDestionation(res.data);
    });

    axios
      .get("http://localhost:8080/api/destination/get-destination")
      .then((res) => {
        setArrival(res.data);
      });

    axios.get("http://localhost:8080/api/flight/get-flight").then((res) => {
      setFlight(res.data);
    });
  }, []);

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

  const handleFilter = () => {
    let filteredResult = result;

    if (isDirectFilterChecked) {
      filteredResult = result.filter((flight) => flight.TransitStatus === 0);
    }

    if (isTransitFilterChecked) {
      filteredResult = result.filter((flight) => flight.TransitStatus === 1);
    }

    if (isLessThan) {
      filteredResult = result.filter((flight) => flight.FlightPrice < 1500000);
    }

    if (isMoreThan) {
      filteredResult = result.filter((flight) => flight.FlightPrice >= 1500000);
    }

    if (selectedFlightNames.length > 0) {
      filteredResult = filteredResult.filter((flight) =>
        selectedFlightNames.includes(flight.FlightName)
      );
    }

    if (is1hour) {
      filteredResult = result.filter((flight) => flight.FlightDuration === 1);
    }

    if (ismorethan1hour) {
      filteredResult = result.filter((flight) => flight.FlightDuration > 1);
    }

    setFiltered(filteredResult);
  };

  useEffect(() => {
    handleFilter();
  }, [
    isDirectFilterChecked,
    isTransitFilterChecked,
    isLessThan,
    isMoreThan,
    selectedFlightNames,
    is1hour,
    ismorethan1hour,
  ]);

  totalPages = Math.ceil(result.length / 3);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginationResult(result.slice(startIndex, endIndex));
  }, [result, currentPage]);

  return (
    <div className="outer-manager-flight-container">
      <h1 className="text-h1">Flight</h1>
      <div className="middle-manage-flight-container">
        <div className="search-box-container">
          <form onSubmit={handleSearch} className="form-flight-container">
            <div className="inner-input-flight">
              <label className="color-primary" htmlFor="origin">
                Destination
              </label>
              <select className="search-flight-input" name="origin">
                <option value="0">Select A Destination</option>
                {destination.map((dest: any, index: number) => (
                  <option key={index} value={dest.OriginID}>
                    {dest.OriginName}
                  </option>
                ))}
              </select>
            </div>
            <PiAirplaneInFlightFill className="flight-icon" />
            <div className="inner-input-flight">
              <label className="color-primary" htmlFor="arrival">
                Arrival
              </label>
              <select className="search-flight-input" name="arrival">
                <option value="0">Select A Arrival</option>
                {arrival.map((arr: any, index: number) => (
                  <option key={index} value={arr.DestinationID}>
                    {arr.DestinationName}
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
          (result && result.length !== 0 ? (
            <div className="result-search-container">
              <div className="filter-search-container">
                <div className="filter-price">
                  <h4 className="font-filter color-primary">Filter By Price</h4>
                  <div className="checkbox-container">
                    <input
                      checked={isLessThan}
                      onChange={() => {
                        setIsLessThan(!isLessThan);
                      }}
                      type="checkbox"
                    />
                    <label className="font-label color-primary" htmlFor="lower">
                      Rp. 0 - Rp.1.500.000
                    </label>
                  </div>
                  <div className="checkbox-container">
                    <input
                      checked={isMoreThan}
                      onChange={() => {
                        setIsMoreThan(!isMoreThan);
                      }}
                      type="checkbox"
                    />
                    <label
                      className="font-label  color-primary"
                      htmlFor="greater"
                    >
                      &gt; Rp. 1.500.000
                    </label>
                  </div>
                </div>
                <div className="filter-price">
                  <h4 className="font-filter  color-primary">
                    Filter By Transit
                  </h4>
                  <div className="checkbox-container">
                    <input
                      checked={isDirectFilterChecked}
                      onChange={() => {
                        setIsDirectFilterChecked(!isDirectFilterChecked);
                      }}
                      name="direct"
                      type="checkbox"
                    />
                    <label
                      className="font-label  color-primary"
                      htmlFor="direct"
                    >
                      Direct
                    </label>
                  </div>
                  <div className="checkbox-container">
                    <input
                      checked={isTransitFilterChecked}
                      onChange={() => {
                        setIsTransitFilterChecked(!isTransitFilterChecked);
                      }}
                      name="transit"
                      type="checkbox"
                    />
                    <label
                      className="font-label  color-primary"
                      htmlFor="transit"
                    >
                      Transit
                    </label>
                  </div>
                </div>
                <div className="filter-price">
                  <h4 className="font-filter  color-primary">
                    Filter By Duration
                  </h4>
                  <div className="checkbox-container">
                    <input
                      checked={is1hour}
                      onChange={() => {
                        setIs1hour(!is1hour);
                      }}
                      name="1hour"
                      type="checkbox"
                    />
                    <label
                      className="font-label  color-primary"
                      htmlFor="1hour"
                    >
                      1 hour
                    </label>
                  </div>
                  <div className="checkbox-container">
                    <input
                      checked={ismorethan1hour}
                      onChange={() => {
                        setIsMoreThan1hour(!ismorethan1hour);
                      }}
                      name="morethan1hour"
                      type="checkbox"
                    />
                    <label
                      className="font-label  color-primary"
                      htmlFor="morethan1hour"
                    >
                      &gt; 1 Hour
                    </label>
                  </div>
                </div>
                <div className="filter-price">
                  <h4 className="font-filter  color-primary">Airline</h4>
                  {flight.map((fl: any, index: number) => (
                    <div key={index} className="checkbox-container">
                      <input
                        checked={selectedFlightNames.includes(fl.FlightName)}
                        onChange={() => {
                          const updatedSelection = selectedFlightNames.includes(
                            fl.FlightName
                          )
                            ? selectedFlightNames.filter(
                                (name) => name !== fl.FlightName
                              )
                            : [...selectedFlightNames, fl.FlightName];
                          setSelectedFlightNames(updatedSelection);
                          handleFilter();
                        }}
                        name="flightName"
                        type="checkbox"
                      />
                      <label
                        className="font-label  color-primary"
                        htmlFor="flightName"
                      >
                        {fl.FlightName}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="result-container">
                {filtered.length === 0 ? (
                  paginationResult.map((res: any, index: number) => (
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
                            {language === "IDN" ? (
                              <h1>Price: Rp. {res.FlightPrice}</h1>
                            ) : (
                              <h1>Price: Rp. {res.FlightPrice * 2}</h1>
                            )}
                            <h1>Seat: {res.SeatAvailable}</h1>
                          </div>
                          <Link to={`/flight-detail-page/${res.ID}`}>
                            <button className="button-buy-style">Choose</button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    {filtered.map((res: any, index: number) => (
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
                              {language === "IDN" ? (
                                <h1>Price: Rp. {res.FlightPrice}</h1>
                              ) : (
                                <h1>Price: Rp. {res.FlightPrice * 2}</h1>
                              )}
                              <h1>Seat: {res.SeatAvailable}</h1>
                            </div>
                            <Link to={`/flight-detail-page/${res.ID}`}>
                              <button className="button-buy-style">
                                Choose
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                <div className="pagination-container">
                  {Array.from({ length: totalPages }, (_, index) => (
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
            <h1 className="text-h1">No Flight Found</h1>
          ))}
      </div>
    </div>
  );
}

export default FlightPage;
