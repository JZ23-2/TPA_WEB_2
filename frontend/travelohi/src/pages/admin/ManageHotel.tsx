import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Card from "../../components/Card";
import axios from "axios";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../config/firebase";

function ManageHotel() {
  const [hotels, setHotels] = useState<[]>([]);
  const [image, setImage] = useState<File[]>([]);
  const [facility, setFacility] = useState<[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hotelName, setHotelName] = useState<string>("");
  const [hotelDescription, setHotelDescription] = useState<string>("");
  const [hotelAddress, setHotelAddress] = useState<string>("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<string>("");

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
    if (name === "hotelName") {
      setHotelName(value);
    } else if (name === "hotelDescription") {
      setHotelDescription(value);
    } else if (name === "hotelAddress") {
      setHotelAddress(value);
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
      hotelName === "" ||
      hotelDescription === "" ||
      hotelAddress === "" ||
      imageUrls.length === 0 ||
      selectedFacilities.length === 0
    ) {
      alert("Please Fill All The Form!");
      return;
    }

    if (hotelName === "") {
      alert("Hotel Name Cannot Be Empty!");
      return;
    }

    if (hotelDescription === "") {
      alert("Hotel Description Cannot Be Empty!");
      return;
    }

    if (hotelAddress === "") {
      alert("Hotel Address Cannot Be Empty!");
      return;
    }

    if (imageUrls.length === 0) {
      alert("Hotel Pictures Cannot Be Empty!");
      return;
    }

    if (selectedFacilities.length === 0) {
      alert("Hotel Facilities Cannot Be Empty!");
      return;
    }

    if (selectedFacilities.length > 3) {
      alert("Hotel Facilities Cannot Be More Than 3!");
      return;
    }

    const intFacilities = selectedFacilities.map((facility) =>
      parseInt(facility)
    );
    axios
      .put("http://localhost:8080/api/admin/update-hotel", {
        HotelID: selectedHotel,
        HotelName: hotelName,
        HotelDescription: hotelDescription,
        HotelAddress: hotelAddress,
        HotelPicture: imageUrls,
        FacilityName: intFacilities,
      })
      .then(() => {
        alert("Hotel Added!");
        window.location.reload();
      });
  };

  const handleUpdateClick = (id: string) => {
    setShowUpdateModal(true);
    setSelectedHotel(id);
  };

  const handleCancelClick = () => {
    setShowUpdateModal(false);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/hotel/get-all-hotel-detail")
      .then((response) => {
        console.log(response.data)
        setHotels(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/hotel/get-hotel-facility")
      .then((res) => {
        setFacility(res.data);
      });
  }, [setShowUpdateModal]);

  const handleDelete = (id: string) => {
    const confirm = window.confirm("Are you sure to delete hotel?");
    if (confirm === true) {
      axios
        .delete(`http://localhost:8080/api/admin/delete-hotel`, {
          params: { ID: id },
        })
        .then((response) => {
          console.log(response);
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error deleting data:", error);
        });
    }
  };

  return (
    <div className="outer-manage-promo-container">
      <div className="middle-manage-promo-container">
        <h1 className="text-h1">Manage Hotels</h1>
        <div className="cards-container">
          {hotels &&
            hotels.map((hotel: any, index: number) => (
              <Card
                key={index}
                facility={hotel.FacilityName}
                address={hotel.HotelAddress}
                title={hotel.HotelName}
                images={hotel.HotelPicture}
                id={hotel.HotelID}
                onHandleDelete={() => handleDelete(hotel.HotelID)}
                onHandleUpdate={() => handleUpdateClick(hotel.HotelID)}
              />
            ))}
        </div>
      </div>
      {showUpdateModal && (
        <div>
          <div className="modal-overlay"></div>
          <div className="update-modal">
            <h1 className="text-promo-h1">Update Promo</h1>
            <form onSubmit={handleSubmit} className="form-container">
              <div className="picture-container gap-2 mt-3">
                <label className="ml-7" htmlFor="hotelName">
                  Hotel Name
                </label>
                <input
                  onChange={handleOnChange}
                  type="text"
                  name="hotelName"
                  className="select-update-hotel"
                  placeholder="Hotel Name"
                />
              </div>
              <div className="picture-container gap-2 mt-3">
                <label className="ml-7" htmlFor="facilityName">
                  Facility Name
                </label>
                <select
                  onChange={handleFacilityChange}
                  value={selectedFacilities}
                  multiple
                  className="select-update-hotel"
                  name="facilityName"
                >
                  {facility.map((facility: any, index: number) => (
                    <option key={index} value={facility.HotelFacilityID}>
                      {facility.FacilityName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="picture-container gap-2 mt-3">
                <label className="ml-7" htmlFor="hotelDescription">
                  Hotel Description
                </label>
                <input
                  onChange={handleOnChange}
                  type="text"
                  name="hotelDescription"
                  className="select-update-hotel"
                  placeholder="Hotel Description"
                />
              </div>
              <div className="picture-container gap-2 mt-3">
                <label className="ml-7" htmlFor="hotelAddress">
                  Hotel Address
                </label>
                <input
                  onChange={handleOnChange}
                  type="text"
                  name="hotelAddress"
                  className="select-update-hotel"
                  placeholder="Hotel Address"
                />
              </div>
              <div className="picture-container gap-2 mt-3">
                <label className="ml-7" htmlFor="hotelPictures">
                  Hotel Pictures
                </label>
                <input
                  ref={inputRef}
                  type="file"
                  name="hotelPictures"
                  className="select-update-hotel"
                  multiple
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex flex-col justify-center items-center mt-3">
                <button type="submit" className="button-promo-container">
                  Update
                </button>
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

export default ManageHotel;
