import { FormEvent, useEffect, useState } from "react";
import { format } from "date-fns";
import "./manageruser.scss";
import axios from "axios";

function ManageFlight() {
  const [flightDetails, setFlightDetails] = useState<[]>([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [flights, setFlights] = useState<[]>([]);
  const [destinations, setDestinations] = useState<[]>([]);
  const [origins, setOrigins] = useState<[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<string>("");

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

  const handleUpdateClick = (id: string) => {
    setShowUpdateModal(true);
    setSelectedPromo(id);
  };

  const handleDelete = (id: string) => {
    const confirm = window.confirm("Are you sure to delete flight?");
    if (confirm === true) {
      axios
        .delete("http://localhost:8080/api/admin/delete-flight-detail", {
          params: { ID: id },
        })
        .then(() => {
          alert("Delete Success");
          window.location.reload();
        });
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/flight/get-all-flight-detail")
      .then((res) => {
        setFlightDetails(res.data);
        console.log(res.data);
      });
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const ID = parseInt(selectedPromo as string);
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
      alert("Flight Price cannot be less than 0!");
      return;
    }

    axios
      .put("http://localhost:8080/api/admin/update-flight-detail", {
        ID: ID,
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
        alert("Update Success!");
        window.location.reload();
      });
  };

  return (
    <div className="outer-manager-container">
      <div className="bg-primary middle-manager-container">
        <h1 className="text-h1">Manage Flights</h1>
        <table className="table1">
          <thead>
            <tr>
              <th>Flight Code</th>
              <th>Origin Name</th>
              <th>Destination Name</th>
              <th>Departure DateTime</th>
              <th>Arrival DateTime</th>
              <th>Flight Duration</th>
              <th>Seat</th>
              <th>Flight Status</th>
              <th>Transit Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {flightDetails && flightDetails.map((flightDetail: any, index: number) => {
              return (
                <tr key={index}>
                  <td>{flightDetail.FlightCode}</td>
                  <td>{flightDetail.OriginName}</td>
                  <td>{flightDetail.DestinationName}</td>
                  <td>
                    {format(
                      new Date(flightDetail.DestinationDate),
                      "yyyy-MM-dd HH:mm:ss"
                    )}
                  </td>
                  <td>
                    {format(
                      new Date(flightDetail.ArrivalDate),
                      "yyyy-MM-dd HH:mm:ss"
                    )}
                  </td>
                  <td>{flightDetail.FlightDuration}</td>
                  <td>{flightDetail.SeatAvailable}</td>
                  {flightDetail.Status === 1 ? (
                    <td>On Going</td>
                  ) : (
                    <td>Not Available</td>
                  )}
                  {flightDetail.TransitStatus === 1 ? (
                    <td>Transit</td>
                  ) : (
                    <td>Direct</td>
                  )}
                  <td className="flex flex-col items-center">
                    <button
                      onClick={() => handleUpdateClick(flightDetail.ID)}
                      className="button-update w-20 py-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(flightDetail.ID)}
                      className="button-update w-20 py-2 mt-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showUpdateModal && (
        <div>
          <div className="modal-overlay"></div>
          <div className="update-modal-1">
            <h1 className="text-promo-h1">Update Promo</h1>
            <form onSubmit={handleSubmit} className="form-container">
              <div className="picture-container gap-2">
                <label className="ml-6" htmlFor="flightName">
                  Flight Name
                </label>
                <select className="select-input-1" name="flightName">
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
                  <label className="ml-6" htmlFor="originName">
                    Origin
                  </label>
                  <select className="select-input-21" name="originName">
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
                  <label className="ml-6" htmlFor="destinationDate">
                    Destination Date
                  </label>
                  <input
                    className="select-input-21"
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
                  <label className="ml-6" htmlFor="destinationTime">
                    Destination Time
                  </label>
                  <input
                    className="select-input-21"
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
                <label className="ml-6" htmlFor="seatAvailable">
                  Seat Availability
                </label>
                <input
                  type="number"
                  name="seatAvailable"
                  className="select-input-1"
                  placeholder="Seat Availability"
                />
              </div>
              <div className="picture-container gap-2 mt-3">
                <label className="ml-6" htmlFor="flightPrice">
                  Flight Price
                </label>
                <input
                  name="flightPrice"
                  type="number"
                  className="select-input-1"
                  placeholder="Seat Availability"
                />
              </div>
              <div className="picture-container gap-2 mt-3">
                <label className="ml-6" htmlFor="transitStatus">
                  Transit Status
                </label>
                <select className="select-input-1" name="transitStatus">
                  <option value="-1">Select Transit Status</option>
                  <option value="0">No Transit</option>
                  <option value="1">Transit</option>
                </select>
              </div>
              <div className="button-update-container mt-4">
                <button type="submit" className="button-update py-2">
                  Update
                </button>
              </div>
            </form>
            <div className="button-update-container">
              <button
                className="button-update py-2"
                onClick={() => setShowUpdateModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageFlight;
