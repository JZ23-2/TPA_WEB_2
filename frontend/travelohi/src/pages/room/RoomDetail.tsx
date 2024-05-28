import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import "./roomdetail.scss";
import { useParams } from "react-router-dom";
import ImageCard from "../../components/ImageCard";
import { MdPeopleOutline } from "react-icons/md";
import { useUserAuth } from "../../context/UserContext";

interface IRoomDetail {
  RoomID: number;
  RoomName: string;
  RoomPrice: number;
  RoomCapacity: number;
  AvailableDate: string;
  RoomPicture: string[];
  FacilityName: string[];
  HotelName: string;
  HotelID: number;
  Status: number;
}

function RoomDetail() {
  const { id } = useParams();
  const { user, update } = useUserAuth();
  const [roomType, setRoomType] = useState<[]>([]);
  const [hotelName, setHotelName] = useState<string>("");
  const [onSearch, setOnSearch] = useState<boolean>(false);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [resultName, setResultName] = useState<[]>([]);
  const [facility, setFacility] = useState<[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<String[]>([]);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [promo, setPromo] = useState<any[]>([]);
  const [promoCode, setPromoCode] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<IRoomDetail | null>(null);
  const [creditCardNumber, setCreditCardNumber] = useState<string>("");
  const [promoBenefit, setPromoBenefit] = useState<number>(0);
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");
  const language = localStorage.getItem("language");

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
      .get("http://localhost:8080/api/room/get-room-by-id", {
        params: { hotelID: id },
      })
      .then((res) => {
        setHotelName(res.data[0].HotelName);
      });

    axios
      .get("http://localhost:8080/api/room/get-room-facility")
      .then((res) => {
        setFacility(res.data);
      });

    axios.get("http://localhost:8080/api/room/get-room").then((res) => {
      setRoomType(res.data);
    });

    axios.get("http://localhost:8080/api/promo/get-promo").then((res) => {
      setPromo(res.data);
    });
  }, [id]);

  const handleSearchByRoomType = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOnSearch(true);
    const formData = new FormData(e.currentTarget);
    const roomType = formData.get("roomType") as string;
    axios
      .get("http://localhost:8080/api/room/get-room-detail-by-id", {
        params: { roomID: roomType, hotelID: id },
      })
      .then((res) => {
        setResultName(res.data);
      });

    if (roomType === "all") {
      axios
        .get("http://localhost:8080/api/room/get-room-by-id", {
          params: { hotelID: id },
        })
        .then((res) => {
          setResultName(res.data);
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

  const handleAddToCart = (roomID: number) => {
    var conf = confirm("Are you sure you want to add this room to cart?");
    if (conf == true && id) {
      axios
        .post("http://localhost:8080/api/cart/add-room-cart", {
          UserID: user?.userID,
          RoomID: roomID,
          HotelID: Number.parseInt(id),
        })
        .then(() => {
          alert("Room added to cart");
          window.location.reload();
        });
    }
  };

  const handleOpenModal = (roomID: number) => {
    setShowUpdateModal(true);

    const result = resultName.filter(
      (res: IRoomDetail) => res.RoomID === roomID
    );
    setSelectedRoom(result[0]);
  };

  const handlePayment = () => {
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
      .post("http://localhost:8080/api/user/room-transaction", {
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
        alert("Room Booked");
        window.location.reload();
      })
      .catch((error) => {
        alert(error.response.data);
        window.location.reload();
      });
  };

  return (
    <div className="outer-manage-hotel-container">
      <h1 className="text-h1">{hotelName} Room</h1>
      <div className="middle-manage-hotel-container">
        <div className="search-box-container">
          <form
            onSubmit={handleSearchByRoomType}
            className="form-flight-container"
          >
            <div className="inner-input-flight">
              <label htmlFor="hotelName">Search Room</label>
              <select name="roomType" className="search-hotel-input">
                <option value="0">Select Room Type</option>
                <option value="all">View All</option>
                {roomType.map((roomType: any, index: number) => (
                  <option key={index} value={roomType.RoomID}>
                    {roomType.RoomName}
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
          (resultName && resultName.length > 0 ? (
            <div className="result-search-container">
              <div className="filter-search-container">
                <div className="filter-price">
                  <h4 className="font-filter">Filter By Facilities</h4>
                  {facility.map((fac: any, index: number) => (
                    <div className="checkbox-filter mt-3" key={index}>
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
                  resultName.map((res: any, index: number) => (
                    <div key={index} className="room-display">
                      <ImageCard images={res.RoomPicture} />
                      <div className="description-container">
                        <div className="inner-description-container">
                          <h1 className="mt-3 text-hotel-h1">
                            {res.HotelName}
                          </h1>
                          {language === "IDN" ? (
                            <h2 className="room-price-font">
                              Rp.{res.RoomPrice} / PAX
                            </h2>
                          ) : (
                            <h2 className="room-price-font">
                              Rp.{res.RoomPrice * 2} / PAX
                            </h2>
                          )}
                        </div>
                        <h2 className="room-font">{res.RoomName}</h2>
                        <h2 className="room-font">
                          Available Date: {formatDate(res.AvailableDate)}
                        </h2>
                        <h2 className="room-guest-font">
                          <MdPeopleOutline className="guest-font" />{" "}
                          {res.RoomCapacity} Guests
                        </h2>
                        <div className="flex gap-2 ml-2">
                          {res.FacilityName &&
                            res.FacilityName.map((fac: any, index: number) => (
                              <div key={index} className="facility-bubble">
                                {fac}
                              </div>
                            ))}
                        </div>
                        <div className="view-room-container gap-2">
                          <button
                            onClick={() => handleOpenModal(res.RoomID)}
                            className="view-room-button mb-2"
                          >
                            Book Now
                          </button>
                          <button
                            onClick={() => handleAddToCart(res.RoomID)}
                            className="view-room-button mb-2"
                          >
                            Add To Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    {filtered.map((res: any, index: number) => (
                      <div key={index} className="room-display">
                        <ImageCard images={res.RoomPicture} />
                        <div className="description-container">
                          <div className="inner-description-container">
                            <h1 className="mt-3 text-hotel-h1">
                              {res.HotelName}
                            </h1>
                            {language === "IDN" ? (
                              <h2 className="room-price-font">
                                Rp.{res.RoomPrice} / PAX
                              </h2>
                            ) : (
                              <h2 className="room-price-font">
                                Rp.{res.RoomPrice * 2} / PAX
                              </h2>
                            )}
                          </div>
                          <h2 className="room-font">{res.RoomName}</h2>
                          <h2 className="room-font">
                            Available Date: {formatDate(res.AvailableDate)}
                          </h2>
                          <h2 className="room-guest-font">
                            <MdPeopleOutline className="guest-font" />{" "}
                            {res.RoomCapacity} Guests
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
                          <div className="view-room-container gap-2">
                            <button
                              onClick={() => handleOpenModal(res.RoomID)}
                              className="view-room-button mb-2"
                            >
                              Book Now
                            </button>
                            <button
                              onClick={() => handleAddToCart(res.RoomID)}
                              className="view-room-button mb-2"
                            >
                              Add To Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div>No Room found</div>
          ))}
      </div>
      {showUpdateModal && selectedRoom !== null && (
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
                    Buy Now
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

export default RoomDetail;
