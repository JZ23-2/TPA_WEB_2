import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import { PiAirplaneInFlightBold } from "react-icons/pi";
import { useParams } from "react-router-dom";
import { useUserAuth } from "../../context/UserContext";
import { MdEventSeat } from "react-icons/md";

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

type Seat = {
  SeatID: number;
  SeatClass: string;
  SeatStatus: number;
  FlightID: number;
};

function FlightDetailPage() {
  const { id } = useParams();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [isAddToCart, setIsAddToCart] = useState<boolean>(false);
  const [isBuyNow, setIsBuyNow] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(0);
  const { user, update } = useUserAuth();
  const [seat, setSeat] = useState<Seat[]>([]);
  const [seatClass, setSeatClass] = useState<string>("");
  const [FilteredSeat, setFilteredSeat] = useState<Seat[]>([]);
  const [addLagguage, setAddLagguage] = useState<number>(-1);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [promoCode, setPromoCode] = useState<number>(0);
  const [promo, setPromo] = useState<any[]>([]);
  const [creditCardNumber, setCreditCardNumber] = useState<string>("");
  const [promoBenefit, setPromoBenefit] = useState<number>(0);

  useEffect(() => {
    if (promoCode !== 0) {
      const selectedPromo = promo.find((p) => p.PromoID === promoCode);

      if (selectedPromo) {
        const promoBenefit = selectedPromo.PromoBenefit;
        setPromoBenefit(promoBenefit);
      }
    }
  }, [promoCode, promo]);

  const handlePayment = () => {
    if (paymentMethod === "") {
      alert("Please Select A Payment Method");
      return;
    }

    var currentMoney;

    if (promoCode !== 0) {
      currentMoney =
        user?.money - (flight?.FlightPrice ?? 0) * quantity + promoBenefit;
    } else {
      currentMoney = user?.money - (flight?.FlightPrice ?? 0) * quantity;
    }

    if (paymentMethod === "Credit Card") {
      if (creditCardNumber !== user?.creditCardNumber) {
        alert("Credit Card Number Is Not Match With Your Account");
        return;
      }
    }

    if (paymentMethod === "E-Wallet") {
      if (user?.money <= currentMoney) {
        alert("Your E-Wallet Balance Is Not Enough");
        return;
      }
    }

    axios
      .post("http://localhost:8080/api/user/flight-transaction", {
        FlightID: flight?.FlightID,
        UserID: user?.userID,
        PromoID: promoCode,
        Quantity: quantity,
        LagguageStatus: addLagguage,
        ID: flight?.ID,
        TransactionDate: new Date(),
        SeatID: selectedSeats,
        WalletAmount: currentMoney,
      })
      .then(() => {
        alert("Payment Success!");
        refetchUser();
        window.location.reload();
      })
      .catch((error) => {
        alert(error.response.data);
        window.location.reload();
      });
  };

  const refetchUser = () => {
    axios
      .get("http://localhost:8080/api/user/refetch-user", {
        params: {
          ID: user?.userID,
        },
      })
      .then((res) => {
        update(res.data);
      });
  };

  const handleAddToCart = () => {
    setIsAddToCart(true);
    setIsBuyNow(false);
  };

  const handleSeatClick = (seatID: number) => {
    const isSelected = selectedSeats.includes(seatID);

    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatID));
    } else {
      if (selectedSeats.length === quantity) {
        alert("You have reached the maximum quantity of seat!");
        return;
      }

      setSelectedSeats([...selectedSeats, seatID]);
    }
  };

  const handleSeatFilter = () => {
    if (seatClass) {
      const seatFilter = seat.filter((s) => s.SeatClass === seatClass);
      setFilteredSeat(seatFilter);
    } else {
      setFilteredSeat(seat);
    }
  };

  useEffect(() => {
    handleSeatFilter();
  }, [seatClass]);

  const handleBuyNow = () => {
    setIsBuyNow(true);
    setIsAddToCart(false);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/seat/get-flight-seat", {
        params: {
          ID: flight?.ID,
        },
      })
      .then((res) => {
        setSeat(res.data);
      });
  }, [flight?.ID]);

  const handleAddToCarts = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const quantity = parseInt(formData.get("quantity") as string);
    axios
      .post("http://localhost:8080/api/cart/add-flight-cart", {
        FlightID: flight?.FlightID,
        Quantity: quantity,
        ID: flight?.ID,
        UserID: user?.userID,
      })
      .then(() => {
        alert("Add To Cart Success!");
        window.location.reload();
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/flight/get-flight-detail", {
        params: { ID: id },
      })
      .then((res) => {
        setFlight(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Error fetching flight details:", error);
      });

    axios.get("http://localhost:8080/api/promo/get-promo").then((res) => {
      setPromo(res.data);
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

  return (
    <div className="outer-flight-container">
      <h1 className="text-h1">Flight Detail</h1>
      <div className="ticket-display">
        <div className="title-ticket-container">
          {flight ? (
            <div>
              <div className="title-ticket">
                <h3 className="flight-font mt-4">{flight.FlightName}</h3>
                <div className="destination-arrival-container">
                  <div className="destination-container mt-3">
                    <h3 className="time-font">
                      {formatTime(flight.DestinationDate)}
                    </h3>
                    <h4 className="place-font">{flight.OriginName}</h4>
                  </div>
                  <div className="destination-container ">
                    <h4 className="place-font">
                      {flight.FlightDuration} Hours
                    </h4>
                    <PiAirplaneInFlightBold className="time-font" />
                    {flight.TransitStatus === 0 ? (
                      <h4 className="place-font">Direct</h4>
                    ) : (
                      <h4 className="place-font">Transit</h4>
                    )}
                  </div>
                  <div className="destination-container mt-3">
                    <h3 className="time-font">
                      {formatTime(flight.ArrivalDate)}
                    </h3>
                    <h4 className="place-font">{flight.DestinationName}</h4>
                  </div>
                </div>
              </div>
              <div className="button-price-container">
                <div className="inner-detail-container">
                  <h1>
                    {formatDate(flight.DestinationDate)} -{" "}
                    {formatDate(flight.ArrivalDate)}
                  </h1>
                  <h1>Price: Rp. {flight.FlightPrice}</h1>
                  <h1>Seat: {flight.SeatAvailable}</h1>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleBuyNow}
                    className="button-detail-style"
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="button-detail-style"
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
      {isAddToCart === true && (
        <div className="input-form-detail-container">
          <form onSubmit={handleAddToCarts} className="flex mt-4 ml-6 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="quantity">Quantity To Buy</label>
              <input
                className="input-detail-container mb-3"
                type="number"
                name="quantity"
                placeholder="Quantity"
                autoComplete="off"
                min={1}
                required
              />
            </div>
            <button className="button-detail-cart-style">Add To Cart</button>
          </form>
        </div>
      )}
      {isBuyNow === true && (
        <div className="input-form-detail-container">
          <div className="flex flex-col mt-4 ml-6 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="quantity">Quantity To Buy</label>
              <input
                className="input-detail-seat-container"
                type="number"
                name="quantity"
                placeholder="Quantity"
                autoComplete="off"
                min={1}
                required
                onChange={(e) => {
                  setQuantity(parseInt(e.target.value));
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="quantity">Add Lagguage</label>
              <select
                onChange={(e) => {
                  setAddLagguage(parseInt(e.target.value));
                }}
                className="input-detail-seat-container mb-3"
                name="lagguage"
                id=""
              >
                <option value="-1">Select To Add Lagguage</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
          </div>
        </div>
      )}
      {quantity > 0 && (
        <div className="seat-container">
          <h1 className="seat-title mt-3">Seat Detail</h1>
          <label className="mt-3 ml-6" htmlFor="seatClass">
            Choose Seat Class
          </label>
          <select
            className="input-detail-seat-container ml-6 mt-2"
            name="seatClass"
            onChange={(e) => setSeatClass(e.target.value)}
          >
            <option value="">Select Seat Class</option>
            <option value="Economy">Economy</option>
            <option value="Business">Business</option>
            <option value="FirstClass">First Class</option>
          </select>

          <div className="cinema-seats">
            {FilteredSeat && FilteredSeat.length === 0 ? (
              <>
                {seat &&
                  seat.map((s: any) =>
                    s.SeatStatus === 0 ? (
                      <MdEventSeat
                        title={`Seat Number: ${s.SeatID}\nStatus: ${s.SeatClass}`}
                        key={s.SeatID}
                        className={`${
                          selectedSeats.includes(s.SeatID)
                            ? "selected"
                            : "seat-row"
                        }`}
                        onClick={() => handleSeatClick(s.SeatID)}
                      />
                    ) : (
                      <MdEventSeat
                        title={`Seat Number: ${s.SeatID}\nStatus: ${s.SeatClass}`}
                        key={s.SeatID}
                        className="no-seat"
                      />
                    )
                  )}
              </>
            ) : (
              <>
                {FilteredSeat &&
                  FilteredSeat.map((s: any) =>
                    s.SeatStatus === 0 ? (
                      <MdEventSeat
                        title={`Seat Number: ${s.SeatID}\nStatus: ${s.SeatClass}`}
                        key={s.SeatID}
                        className={`${
                          selectedSeats.includes(s.SeatID)
                            ? "selected"
                            : "seat-row"
                        }`}
                        onClick={() => handleSeatClick(s.SeatID)}
                      />
                    ) : (
                      <MdEventSeat
                        title={`Seat Number: ${s.SeatID}\nStatus: ${s.SeatClass}`}
                        key={s.SeatID}
                        className="seat-row no-seat"
                      />
                    )
                  )}
              </>
            )}
          </div>
          <div className="flex justify-center items-center mb-3">
            {selectedSeats.length === quantity && (
              <button
                onClick={() => setShowUpdateModal(true)}
                className="button-buy-style"
              >
                Buy Now
              </button>
            )}
          </div>
        </div>
      )}
      {showUpdateModal && (
        <div>
          <div className="modal-overlay">
            <div className="update-modal">
              <h1 className="text-promo-h1">Payment</h1>
              <div className="flex flex-col">
                {promoCode === 0 ? (
                  <div className="">
                    <label className="mt-3" htmlFor="totalPrice">
                      Total Price
                    </label>
                    <input
                      className="input-container"
                      type="number"
                      value={(flight?.FlightPrice ?? 0) * quantity}
                      name="totalPrice"
                      placeholder="Total Price"
                      readOnly
                    />
                  </div>
                ) : (
                  <div>
                    <label className="mt-3" htmlFor="totalPrice">
                      Total Price
                    </label>
                    <input
                      className="input-container"
                      type="number"
                      value={
                        (flight?.FlightPrice ?? 0) * quantity - promoBenefit
                      }
                      name="totalPrice"
                      placeholder="Total Price"
                      readOnly
                    />
                  </div>
                )}
                <div className="mt-3">
                  <label className="mt-3" htmlFor="promoCode">
                    Promo Code
                  </label>
                  <select
                    onChange={(e) => setPromoCode(parseInt(e.target.value))}
                    className="input-container"
                    name="promoCode"
                  >
                    <option value="0">Select A Promo Code</option>
                    {promo.map((promo: any, index: number) => (
                      <option key={index} value={promo.PromoID}>
                        {promo.PromoCode} - {promo.PromoBenefit}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-3">
                  <label className="mt-3" htmlFor="paymentMethod">
                    Payment Method
                  </label>
                  <select
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="input-container"
                    name="paymentMethod"
                  >
                    <option value="0">Select A Payment Method</option>
                    <option value="E-Wallet">E-Wallet</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>
                {paymentMethod === "Credit Card" && (
                  <div className="mt-3">
                    <label className="mt-3" htmlFor="creditCardNumber">
                      CreditCard Number
                    </label>
                    <input
                      onChange={(e) => setCreditCardNumber(e.target.value)}
                      className="input-container"
                      type="text"
                      name="creditCardNumber"
                      placeholder="CreditCard Number"
                    />
                  </div>
                )}
                <div className="button-update-container">
                  <button
                    onClick={handlePayment}
                    className="button-update py-2"
                    type="submit"
                  >
                    Confirm
                  </button>
                  <button
                    className="button-update py-2"
                    onClick={() => setShowUpdateModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlightDetailPage;
