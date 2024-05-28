import axios from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Card from "../../components/Card";
import { storage } from "../../config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function ManageRoom() {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [selectedHotel, setSelectedHotel] = useState<string>("");
  const [roomPrice, setRoomPrice] = useState<number>(0);
  const [roomCapacity, setRoomCapacity] = useState<number>(0);
  const [availableDate, setAvailableDate] = useState<string>("");
  const [rooms, setRooms] = useState<[]>([]);
  const [roomFacility, setRoomFacility] = useState<[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [image, setImage] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpdateClick = (id: string, hotelID: string) => {
    setShowUpdateModal(true);
    setSelectedHotel(hotelID);
    setSelectedRoom(id);
  };

  const handleCancelClick = () => {
    setShowUpdateModal(false);
  };

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
    if (name === "roomPrice") {
      setRoomPrice(parseInt(value));
    } else if (name === "roomCapacity") {
      setRoomCapacity(parseInt(value));
    } else if (name === "availableDate") {
      setAvailableDate(value);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/room/get-all-room-detail")
      .then((res) => {
        setRooms(res.data);
        console.log(res.data);
      });

    axios
      .get("http://localhost:8080/api/room/get-room-facility")
      .then((res) => {
        setRoomFacility(res.data);
      });
  }, []);

  const handleDelete = (id: string, hotelID: string) => {
    const confirm = window.confirm("Are you sure to delete room?");
    if (confirm === true) {
      axios
        .delete(`http://localhost:8080/api/admin/delete-room`, {
          params: { ID: id, HotelID: hotelID },
        })
        .then((response) => {
          console.log(response);
          window.location.reload();
        });
    }
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
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
      .put("http://localhost:8080/api/admin/update-room", {
        HotelID: parseInt(selectedHotel),
        RoomID: parseInt(selectedRoom),
        RoomPrice: roomPrice,
        RoomCapacity: roomCapacity,
        RoomPicture: imageUrls,
        FacilityName: intFacilities,
        AvailableDate: new Date(availableDate),
      })
      .then(() => {
        alert("Room Upated");
        window.location.reload();
      });
  };

  return (
    <div className="outer-manage-promo-container">
      <div className="middle-manage-promo-container">
        <h1 className="text-h1">Manage Rooms</h1>
        <div className="cards-container">
          {rooms &&
            rooms.map((room: any, index: number) => (
              <Card
                key={index}
                facility={room.FacilityName}
                title={room.HotelName}
                images={room.RoomPicture}
                id={room.RoomID}
                roomType={room.RoomName}
                roomPrice={room.RoomPrice}
                onHandleDelete={() => handleDelete(room.RoomID, room.HotelID)}
                onHandleUpdate={() =>
                  handleUpdateClick(room.RoomID, room.HotelID)
                }
              />
            ))}
        </div>
      </div>
      {showUpdateModal && (
        <div>
          <div className="modal-overlay"></div>
          <div className="update-modal">
            <h1 className="text-promo-h1">Update Rooms</h1>
            <form onSubmit={handleSubmit} className="form-container">
              <div className="picture-container gap-2 mt-3">
                <label className="ml-7" htmlFor="roomPrice">
                  Room Price
                </label>
                <input
                  onChange={handleOnChange}
                  type="number"
                  name="roomPrice"
                  className="select-update-hotel"
                  placeholder="Room Price"
                />
                <div className="picture-container gap-2 mt-3">
                  <label className="ml-7" htmlFor="roomCapacity">
                    Room Capacity
                  </label>
                  <input
                    onChange={handleOnChange}
                    type="number"
                    name="roomCapacity"
                    className="select-update-hotel"
                    placeholder="Room Capacity"
                  />
                </div>
                <div className="picture-container gap-2 mt-3">
                  <label className="ml-7" htmlFor="availableDate">
                    Available Date
                  </label>
                  <input
                    onChange={handleOnChange}
                    type="date"
                    name="availableDate"
                    className="select-update-hotel"
                    placeholder="Available Date"
                  />
                </div>
                <div className="picture-container gap-2 mt-3">
                  <label className="ml-7" htmlFor="facilityName">
                    Facility Name
                  </label>
                  <select
                    onChange={handleFacilityChange}
                    className="select-update-hotel"
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
                  <label className="ml-7" htmlFor="roomPictures">
                    Room Pictures
                  </label>
                  <input
                    ref={inputRef}
                    onChange={handleFileChange}
                    type="file"
                    name="hotelPictures"
                    className="select-update-hotel"
                    multiple
                  />
                </div>
                <div className="flex justify-center items-center mt-3">
                  <button type="submit" className="button-promo-container">
                    Submit
                  </button>
                </div>
              </div>
            </form>
            <div className="flex justify-center items-center">
              <button
                onClick={handleCancelClick}
                type="submit"
                className="button-promo-container"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageRoom;
