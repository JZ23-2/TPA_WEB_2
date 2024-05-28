import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { storage } from "../../config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function AddRoom() {
  const [roomType, setRoomType] = useState<[]>([]);
  const [room, setRoom] = useState<string>("");
  const [image, setImage] = useState<File[]>([]);
  const [roomFacility, setRoomFacility] = useState<[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [roomPrice, setRoomPrice] = useState<number>(0);
  const [roomCapacity, setRoomCapacity] = useState<number>(0);
  const [hotel, setHotel] = useState<[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<string>("");
  const [availableDate, setAvailableDate] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImage(Array.from(files));
    }
  };

  const handleFacilityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = e.target.selectedOptions;
    const selectedValues = Array.from(selectedOptions).map(
      (option) => option.value
    );
    setSelectedFacilities(selectedValues);
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "roomName") {
      setRoom(value);
    } else if (name === "roomPrice") {
      setRoomPrice(parseInt(value));
    } else if (name === "roomCapacity") {
      setRoomCapacity(parseInt(value));
    } else if (name === "availableDate") {
      setAvailableDate(value);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const imageUrls: string[] = [];

    for (let i = 0; i < image.length; i++) {
      if (inputRef.current && inputRef.current.files) {
        const file = inputRef.current.files[i];

        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

        if (!allowedTypes.includes(file.type)) {
          alert("Image File Doesn't Support (Only Support .jpg, .jpeg, .png)");
          return;
        } else {
          const storageRef = ref(storage, `images/${file.name}`);
          await uploadBytes(storageRef, file);
          const imageUrl = await getDownloadURL(storageRef);
          imageUrls.push(imageUrl);
        }
      }
    }

    if (
      selectedHotel === "" ||
      room === "" ||
      roomPrice === 0 ||
      roomCapacity === 0 ||
      availableDate === "" ||
      imageUrls.length === 0 ||
      selectedFacilities.length === 0
    ) {
      alert("Please Fill All The Form");
      return;
    }

    if (roomPrice < 100000) {
      alert("Room Price Must Be Greater Than 100000");
      return;
    }

    if (roomCapacity < 0) {
      alert("Room Capacity Must Be Greater Than 0");
      return;
    }

    if (imageUrls.length > 3) {
      alert("Room Picture Must Be Less Than 3");
      return;
    }

    if (selectedFacilities.length > 3) {
      alert("Room Facility Must Be Less Than 3");
      return;
    }

    if (new Date(availableDate) < new Date()) {
      alert("Available Date Must Be Greater Than Today");
      return;
    }

    const intFacilities = selectedFacilities.map((facility) =>
      parseInt(facility)
    );
    axios
      .post("http://localhost:8080/api/admin/add-room", {
        HotelID: parseInt(selectedHotel),
        RoomID: parseInt(room),
        RoomPrice: roomPrice,
        RoomCapacity: roomCapacity,
        RoomPicture: imageUrls,
        FacilityName: intFacilities,
        AvailableDate: new Date(availableDate),
      })
      .then(() => {
        alert("Room Added");
        window.location.reload();
      });
  };

  const handleOnSelected = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "roomName") {
      setRoom(value);
    } else if (name === "hotelName") {
      setSelectedHotel(value);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/room/get-room-facility")
      .then((res) => {
        setRoomFacility(res.data);
      });

    axios.get("http://localhost:8080/api/room/get-room").then((res) => {
      setRoomType(res.data);
    });

    axios
      .get("http://localhost:8080/api/hotel/get-all-hotel-detail")
      .then((res) => {
        setHotel(res.data);
      });
  }, []);

  return (
    <div className="outer-promo-container">
      <h1 className="text-h1">Add Rooms</h1>
      <div className="middle-promo-container">
        <form onSubmit={handleSubmit} className="form-container">
          <div className="picture-container gap-2 mt-3">
            <label className="ml-11" htmlFor="hotelName">
              Hotel Name
            </label>
            <select
              onChange={handleOnSelected}
              className="select-input"
              name="hotelName"
            >
              <option value="0">Select A Hotel</option>
              {hotel.map((hotel: any, index: number) => (
                <option key={index} value={hotel.HotelID}>
                  {hotel.HotelName}
                </option>
              ))}
            </select>
          </div>
          <div className="picture-container gap-2 mt-3">
            <label className="ml-11" htmlFor="roomName">
              Room Name
            </label>
            <select
              onChange={handleOnSelected}
              className="select-input"
              name="roomName"
            >
              <option value="0">Select A Room</option>
              {roomType.map((room: any, index: number) => (
                <option key={index} value={room.RoomID}>
                  {room.RoomName}
                </option>
              ))}
            </select>
          </div>
          <div className="picture-container gap-2 mt-3">
            <label className="ml-11" htmlFor="facilityName">
              Facility Name
            </label>
            <select
              onChange={handleFacilityChange}
              value={selectedFacilities}
              className="select-input"
              name="facilityName"
              multiple
            >
              <option value="0">Select A Facility</option>
              {roomFacility.map((facility: any, index: number) => (
                <option key={index} value={facility.RoomFacilityID}>
                  {facility.FacilityName}
                </option>
              ))}
            </select>
          </div>
          <div className="picture-container gap-2 mt-3">
            <label className="ml-11" htmlFor="roomPrice">
              Room Price
            </label>
            <input
              onChange={handleOnChange}
              type="number"
              name="roomPrice"
              className="select-input"
              placeholder="Room Price"
            />
          </div>
          <div className="picture-container gap-2 mt-3">
            <label className="ml-11" htmlFor="roomCapacity">
              Room Capacity
            </label>
            <input
              onChange={handleOnChange}
              type="number"
              name="roomCapacity"
              className="select-input"
              placeholder="Room Capacity"
            />
          </div>
          <div className="picture-container gap-2 mt-3">
            <label className="ml-11" htmlFor="availableDate">
              Available Date
            </label>
            <input
              onChange={handleOnChange}
              type="date"
              name="availableDate"
              className="select-input"
              placeholder="Available Date"
            />
          </div>
          <div className="picture-container gap-2 mt-3">
            <label className="ml-11" htmlFor="roomPictures">
              Room Pictures
            </label>
            <input
              ref={inputRef}
              type="file"
              name="hotelPictures"
              className="select-input"
              multiple
              onChange={handleFileChange}
            />
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

export default AddRoom;
