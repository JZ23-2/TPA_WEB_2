import { FormEvent, useEffect, useState } from "react";
import "./flight.scss";
import axios from "axios";

function AddFlight() {
  const [flights, setFlights] = useState<[]>([]);
  const [destinations, setDestinations] = useState<[]>([]);
  const [origins, setOrigins] = useState<[]>([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/flight/get-flight").then((res) => {
      setFlights(res.data);
    });

    axios.get("http://localhost:8080/api/origin/get-origin").then((res) => {
      setOrigins(res.data);
    });

    axios
      .get("http://localhost:8080/api/destination/get-destination")
      .then((res) => {
        setDestinations(res.data);
      });
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const flightID = parseInt(formData.get("flightName") as string);
    const originID = parseInt(formData.get("originName") as string);
    const destinationID = parseInt(formData.get("destinationName") as string);
    const destinationDate = formData.get("destinationDate") as string;
    const arrivalDate = formData.get("arrivalDate") as string;
    const destinationTime = formData.get("destinationTime") as string;
    const arrivalTime = formData.get("arrivalTime") as string;
    const seatAvailable = parseInt(formData.get("seatAvailable") as string);
    const flightPrice = parseInt(formData.get("flightPrice") as string);
    const transtiStatus = parseInt(formData.get("transitStatus") as string);

    if (
      flightID === 0 ||
      originID === 0 ||
      destinationID === 0 ||
      destinationDate === "" ||
      arrivalDate === "" ||
      destinationTime === "" ||
      arrivalTime === "" ||
      seatAvailable === 0 ||
      flightPrice === 0 ||
      transtiStatus === -1
    ) {
      alert("Please fill all the form!");
      return;
    }

    if (originID === destinationID) {
      alert("Origin and Destination cannot be the same!");
      return;
    }

    if (new Date(destinationDate) > new Date(arrivalDate)) {
      alert("Destination Date cannot be later than Arrival Date!");
      return;
    }
    const destinationDateTime = new Date(
      `${destinationDate}T${destinationTime}Z`
    ).toISOString();
    const arrivalDateTime = new Date(
      `${arrivalDate}T${arrivalTime}Z`
    ).toISOString();

    var test1: Date = new Date(destinationDateTime);
    var test2: Date = new Date(arrivalDateTime);
    var result: number = Number(test2) - Number(test1);

    const hours = Math.floor(result / (60 * 60 * 1000));

    if (hours < 0) {
      alert("Flight Duration must at least 1 hours!");
      return;
    }

    if (seatAvailable < 20) {
      alert("Seat Availability cannot be less than 20!");
      return;
    }

    if (flightPrice < 1000000) {
      alert("Flight Price cannot be less than 1000000!");
      return;
    }

    axios
      .post("http://localhost:8080/api/admin/add-flight", {
        FlightID: flightID,
        OriginID: originID,
        DestinationID: destinationID,
        DestinationDate: destinationDateTime,
        ArrivalDate: arrivalDateTime,
        SeatAvailable: seatAvailable,
        FlightPrice: flightPrice,
        FlightDuration: hours,
        TransitStatus: transtiStatus,
      })
      .then(() => {
        alert("Insert Success!");
        window.location.reload();
      });
  };

  return (
    <div className="outer-promo-container">
      <h1 className="text-h1">Add Flight</h1>
      <div className="middle-promo-container">
        <form onSubmit={handleSubmit} className="form-container">
          <div className="picture-container gap-2">
            <label className="ml-11" htmlFor="flightName">
              Flight Name
            </label>
            <select className="select-input" name="flightName">
              <option value="0">Select A Flight</option>
              {flights.map((flight: any, index: number) => (
                <option key={index} value={flight.FlightID}>
                  {flight.FlightCode} - {flight.FlightName}
                </option>
              ))}
            </select>
          </div>
          <div className="double-container">
            <div className="inner-double-container">
              <label className="ml-11" htmlFor="originName">
                Origin
              </label>
              <select className="select-input-2" name="originName">
                <option value="1">Select A Origin</option>
                {origins.map((origin: any, index: number) => (
                  <option key={index} value={origin.OriginID}>
                    {origin.OriginName}
                  </option>
                ))}
              </select>
            </div>
            <div className="inner-double-container">
              <label className="ml-11" htmlFor="destinatioName">
                Destination
              </label>
              <select className="select-input-2" name="destinationName">
                <option value="1">Select A Destination</option>
                {destinations.map((destination: any, index: number) => (
                  <option key={index} value={destination.DestinationID}>
                    {destination.DestinationName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="double-container">
            <div className="inner-double-container">
              <label className="ml-11" htmlFor="destinationDate">
                Destination Date
              </label>
              <input
                className="select-input-2"
                type="date"
                name="destinationDate"
              />
            </div>
            <div className="inner-double-container">
              <label className="ml-11" htmlFor="arrivalDate">
                Arrival Date
              </label>
              <input
                className="select-input-2"
                type="date"
                name="arrivalDate"
              />
            </div>
          </div>
          <div className="double-container">
            <div className="inner-double-container">
              <label className="ml-11" htmlFor="destinationTime">
                Destination Time
              </label>
              <input
                className="select-input-2"
                type="time"
                name="destinationTime"
              />
            </div>
            <div className="inner-double-container">
              <label className="ml-11" htmlFor="arrivalTime">
                Arrival Time
              </label>
              <input
                className="select-input-2"
                type="time"
                name="arrivalTime"
              />
            </div>
          </div>
          <div className="picture-container gap-2 mt-3">
            <label className="ml-11" htmlFor="seatAvailable">
              Seat Availability
            </label>
            <input
              type="number"
              name="seatAvailable"
              className="select-input"
              placeholder="Seat Availability"
            />
          </div>
          <div className="picture-container gap-2 mt-3">
            <label className="ml-11" htmlFor="flightPrice">
              Flight Price
            </label>
            <input
              name="flightPrice"
              type="number"
              className="select-input"
              placeholder="Seat Availability"
            />
          </div>
          <div className="picture-container gap-2 mt-3">
            <label className="ml-11" htmlFor="transitStatus">
              Transit Status
            </label>
            <select className="select-input" name="transitStatus">
              <option value="-1">Select Transit Status</option>
              <option value="0">No Transit</option>
              <option value="1">Transit</option>
            </select>
          </div>
          <div className="flex justify-center items-center mt-3">
            <button type="submit" className="button-promo-container">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFlight;
