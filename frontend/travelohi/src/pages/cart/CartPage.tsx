import { useEffect, useState } from "react";
import "./cart.scss";
import axios from "axios";
import { useUserAuth } from "../../context/UserContext";
import { PiAirplaneInFlightBold } from "react-icons/pi";
import { MdEventSeat, MdPeopleOutline } from "react-icons/md";
import ImageCard from "../../components/ImageCard";

interface RoomCart {
  RoomID: number;
  HotelID: number;
  RoomName: string;
  RoomPrice: number;
}

interface FlightCart {
  FlightID: number;
  FlightName: string;
  FlightPrice: number;
  Quantity: number;
  ID: number;
}

type Seat = {
  SeatID: number;
  SeatClass: string;
  SeatStatus: number;
  FlightID: number;
};

function CartPage() {
  const { user, update } = useUserAuth();
  const [flightCart, setFlightCart] = useState<[]>([]);
  const [roomCart, setRoomCart] = useState<[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<RoomCart | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<FlightCart | null>(null);
  const [promo, setPromo] = useState<any[]>([]);
  const [promoCode, setPromoCode] = useState<number>(0);
  const [promoBenefit, setPromoBenefit] = useState<number>(0);
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");
  const [creditCardNumber, setCreditCardNumber] = useState<string>("");
  const [buyFlight, setBuyFlight] = useState<boolean>(false);
  const [seat, setSeat] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [FilteredSeat, setFilteredSeat] = useState<Seat[]>([]);
  const [seatClass, setSeatClass] = useState<string>("");
  const [flightModal, setFlightModal] = useState<boolean>(false);
  const [addLagguage, setAddLagguage] = useState<number>(-1);

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

  useEffect(() => {
    if (promoCode !== 0) {
      const selectedPromo = promo.find((p) => p.PromoID === promoCode);

      if (selectedPromo) {
        const promoBenefit = selectedPromo.PromoBenefit;
        setPromoBenefit(promoBenefit);
      }
    }
  }, [promoCode, promo]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/cart/get-user-flight-cart", {
        params: {
          UserID: user?.userID,
        },
      })
      .then((res) => {
        setFlightCart(res.data);
      });

    axios
      .get("http://localhost:8080/api/cart/get-user-room-cart", {
        params: {
          UserID: user?.userID,
        },
      })
      .then((res) => {
        setRoomCart(res.data);
        console.log(res.data);
      });

    axios.get("http://localhost:8080/api/promo/get-promo").then((res) => {
      setPromo(res.data);
    });
  }, [user]);

  useEffect(() => {
    let totalPrice = 0;
    if (flightCart && flightCart.length > 0) {
      flightCart.forEach((res: any) => {
        totalPrice += res.FlightPrice * res.Quantity;
      });
    }
    {
      roomCart &&
        roomCart.forEach((res: any) => {
          totalPrice += res.RoomPrice;
        });
    }
    setTotalPrice(totalPrice);
  }, [roomCart, flightCart]);

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

  const handleOpenModal = (roomID: number, hotelID: number) => {
    const filteredRooms = roomCart.filter(
      (room: RoomCart) => room.RoomID === roomID && room.HotelID === hotelID
    );
    setSelectedRoom(filteredRooms[0]);
    setIsOpenModal(true);
  };

  const handleFlightModal = () => {
    setFlightModal(true);
    setBuyFlight(false);
  };

  const handleRoomPayment = () => {
    const checkIN = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (paymentMethod === "") {
      alert("Please select a payment method");
      return;
    }

    var currentMoney;

    if (promoCode !== 0) {
      currentMoney =
        user?.money - (selectedRoom?.RoomPrice ?? 0) + promoBenefit;
    } else {
      currentMoney = user?.money - (selectedRoom?.RoomPrice ?? 0);
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

    const oneDay = 24 * 60 * 60 * 1000;
    const timeDifference = checkOut.getTime() - checkIN.getTime();
    const daysDifference = Math.round(timeDifference / oneDay);
    if (daysDifference < 1) {
      alert("Check-out date must be at least 1 day after the check-in date");
      return;
    }
    axios
      .post("http://localhost:8080/api/cart/room-cart-transaction", {
        RoomID: selectedRoom?.RoomID,
        UserID: user?.userID,
        CheckInDate: checkIN,
        CheckOutDate: checkOut,
        PromoID: promoCode,
        PaymentMethod: paymentMethod,
        TransactionDate: new Date(),
        HotelID: selectedRoom?.HotelID,
        WalletAmount: currentMoney,
      })
      .then(() => {
        refetchUser();
        alert("Transaction Success");
        window.location.reload();
      })
      .catch((error) => {
        alert(error.response.data);
        window.location.reload();
      });
  };

  const handleOpenFlightModal = (flightID: number) => {
    const filteredFlight = flightCart.filter(
      (flight: FlightCart) => flight.ID === flightID
    );
    setSelectedFlight(filteredFlight[0]);
    setBuyFlight(true);
  };

  const handleSeatFilter = () => {
    if (seat && seat.length > 0) {
      if (seatClass) {
        const seatFilter = seat.filter((s) => s.SeatClass === seatClass);
        setFilteredSeat(seatFilter);
      } else {
        setFilteredSeat(seat);
      }
    }
  };

  useEffect(() => {
    handleSeatFilter();
  }, [seatClass]);

  const handleSeatClick = (seatID: number) => {
    const isSelected = selectedSeats.includes(seatID);

    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatID));
    } else {
      if (selectedSeats.length === selectedFlight?.Quantity) {
        alert("You have reached the maximum quantity of seat!");
        return;
      }

      setSelectedSeats([...selectedSeats, seatID]);
    }
  };

  useEffect(() => {
    console.log(selectedFlight?.ID);
    axios
      .get("http://localhost:8080/api/seat/get-flight-seat", {
        params: {
          ID: selectedFlight?.ID,
        },
      })
      .then((res) => {
        setSeat(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Error fetching seat information:", error);
      });
  }, [selectedFlight?.ID]);

  const handlePayment = () => {
    if (paymentMethod === "") {
      alert("Please Select A Payment Method");
      return;
    }

    var currentMoney;

    if (promoCode !== 0) {
      currentMoney =
        user?.money -
        (selectedFlight?.FlightPrice ?? 0) * (selectedFlight?.Quantity ?? 0) +
        promoBenefit;
    } else {
      currentMoney =
        user?.money -
        (selectedFlight?.FlightPrice ?? 0) * (selectedFlight?.Quantity ?? 0);
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
      .post("http://localhost:8080/api/cart/flight-cart-transaction", {
        FlightID: selectedFlight?.FlightID,
        UserID: user?.userID,
        PromoID: promoCode,
        Quantity: selectedFlight?.Quantity,
        LagguageStatus: addLagguage,
        ID: selectedFlight?.ID,
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
      });
  };

  return (
    <div className="outer-manage-flight-container">
      <h1 className="text-h1">Cart</h1>
      <div className="middle-manage-flight-container">
        <div className="outer-cart-container">
          <div className="result-cart-container">
            <div className="total-cart-container">
              <h1 className="cart-font">Total Price: Rp.{totalPrice}</h1>
            </div>
            <div className="result-container">
              <div className="mt-20 mb-5">
                {flightCart && flightCart.length !== 0 ? (
                  flightCart.map((res: any, index: number) => (
                    <div key={index} className="cart-ticket-display">
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
                              Price: Rp. {res.FlightPrice || 0 * res.Quantity}{" "}
                            </h1>
                            <h1>Seat: {res.SeatAvailable}</h1>
                            {new Date(res.DestinationDate).getTime() >
                            new Date().getTime() ? (
                              <h1>Status: On Going</h1>
                            ) : (
                              <h1>Status : Expired</h1>
                            )}
                          </div>
                          {new Date(res.DestinationDate).getTime() >
                            new Date().getTime() && (
                            <button
                              onClick={() => handleOpenFlightModal(res.ID)}
                              className="button-checkout-style"
                            >
                              Check Out
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>{roomCart.length === 0 && <div>No Item In Cart</div>}</>
                )}
                {roomCart && roomCart.length !== 0 ? (
                  roomCart.map((res: any, index: number) => (
                    <div className="room-cart-display" key={index}>
                      <ImageCard images={res.RoomPicture} />
                      <div className="description-container">
                        <div className="inner-description-container">
                          <h1 className="mt-3 text-hotel-h1">
                            {res.HotelName}
                          </h1>
                        </div>
                        <h2 className="room-font">{res.RoomName}</h2>
                        <h2 className="room-font">Rp.{res.RoomPrice}</h2>
                        <h2 className="room-guest-font">
                          <MdPeopleOutline className="guest-font" />{" "}
                          {res.RoomCapacity} Guests
                        </h2>
                        {new Date(res.AvailableDate).getTime() >
                        new Date().getTime() ? (
                          <h2 className="room-font">Status: On Going</h2>
                        ) : (
                          <h2 className="room-font">Status: Expired</h2>
                        )}

                        {new Date(res.AvailableDate).getTime() >
                          new Date().getTime() && (
                          <div className="view-room-container gap-2">
                            <button
                              onClick={() =>
                                handleOpenModal(res.RoomID, res.HotelID)
                              }
                              className="button-checkout-style mt-2 mb-2"
                            >
                              Checkout
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <>{flightCart.length === 0 && <div>No Item In Cart</div>}</>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpenModal && selectedRoom !== null && (
        <div>
          <div className="modal-overlay"></div>
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
                    value={selectedRoom?.RoomPrice}
                    name="totalPrice"
                    placeholder="Total Price"
                    readOnly
                  />
                  <div className="mt-3">
                    <label className="mt-3" htmlFor="checkInDate">
                      Checkin Date
                    </label>
                    <input
                      type="datetime-local"
                      className="input-container"
                      name="checkInDate"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                    />
                  </div>
                  <div className="mt-3">
                    <label className="mt-3" htmlFor="checkOutDate">
                      Checkout Date
                    </label>
                    <input
                      type="datetime-local"
                      className="input-container"
                      name="checkOutDate"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="mt-3" htmlFor="totalPrice">
                    Total Price
                  </label>
                  <input
                    className="input-container"
                    type="number"
                    value={(selectedRoom?.RoomPrice || 0) - promoBenefit}
                    name="totalPrice"
                    placeholder="Total Price"
                    readOnly
                  />
                  <div className="mt-3">
                    <label className="mt-3" htmlFor="checkInDate">
                      Checkin Date
                    </label>
                    <input
                      type="datetime-local"
                      className="input-container"
                      name="checkInDate"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                    />
                  </div>
                  <div className="mt-3">
                    <label className="mt-3" htmlFor="checkOutDate">
                      Checkout Date
                    </label>
                    <input
                      type="datetime-local"
                      className="input-container"
                      name="checkOutDate"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                    />
                  </div>
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
                    className="input-container"
                    type="text"
                    onChange={(e) => setCreditCardNumber(e.target.value)}
                    name="creditCardNumber"
                    placeholder="CreditCard Number"
                  />
                </div>
              )}
              <div className="button-update-container">
                <button
                  onClick={handleRoomPayment}
                  className="button-update py-2"
                  type="submit"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => setIsOpenModal(false)}
                  className="button-update py-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {buyFlight && (
        <div>
          <div className="modal-overlay"></div>
          <div className="update-modal">
            <h1 className="text-promo-h1">Payment</h1>
            <div className="flex flex-col">
              <label htmlFor="addLuggage">Add Lagguage</label>
              <select
                onChange={(e) => {
                  setAddLagguage(parseInt(e.target.value));
                }}
                className="input-container"
                name="addLuggage"
              >
                <option value="-1">Select To Add Lagguage</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
            {selectedFlight && selectedFlight.Quantity > 0 && (
              <div className="cart-seat-container">
                <label className="mt-3" htmlFor="seatClass">
                  Choose Seat Class
                </label>
                <select
                  onChange={(e) => setSeatClass(e.target.value)}
                  className="input-container mt-2"
                  name="seatClass"
                >
                  <option value="">Select Seat Class</option>
                  <option value="Economy">Economy</option>
                  <option value="Business">Business</option>
                  <option value="FirstClass">First Class</option>
                </select>
              </div>
            )}
            <div className="cinema-seats">
              {FilteredSeat !== null && FilteredSeat.length === 0 ? (
                <p>No seats available</p>
              ) : (
                <div className="cinema-seats">
                  {FilteredSeat && FilteredSeat.length > 0 ? (
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
                    )
                  ) : (
                    <p>No seats available</p>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-center items-center mb-3">
              {selectedSeats.length === selectedFlight?.Quantity && (
                <button
                  onClick={handleFlightModal}
                  className="button-buy-style"
                >
                  Buy Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {flightModal && (
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
                      value={
                        (selectedFlight?.FlightPrice ?? 0) *
                        (selectedFlight?.Quantity ?? 0)
                      }
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
                        (selectedFlight?.FlightPrice ?? 0) *
                          (selectedFlight?.Quantity ?? 0) -
                        promoBenefit
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
                    onClick={() => setFlightModal(false)}
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

export default CartPage;
