import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { storage } from "../../config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function AddHotels() {
  const [image, setImage] = useState<File[]>([]);

  const [facility, setFacility] = useState<[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hotelName, setHotelName] = useState<string>("");
  const [hotelDescription, setHotelDescription] = useState<string>("");
  const [hotelAddress, setHotelAddress] = useState<string>("");
  const [Address, setAddress] = useState<[]>([]);

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

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/hotel/get-hotel-facility")
      .then((res) => {
        setFacility(res.data);
      });

    axios.get("http://localhost:8080/api/origin/get-origin").then((res) => {
      setAddress(res.data);
    });
  }, []);

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
      .post("http://localhost:8080/api/hotel/add-hotel", {
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

  return (
    <div className="outer-promo-container">
      <h1 className="text-h1">Add Hotels</h1>
      <div className="middle-promo-container">
        <form onSubmit={handleSubmit} className="form-container">
          <div className="picture-container gap-2 mt-3">
            <label className="ml-11" htmlFor="hotelName">
              Hotel Name
            </label>
            <input
              onChange={handleOnChange}
              type="text"
              name="hotelName"
              className="select-input"
              placeholder="Hotel Name"
            />
          </div>
          <div className="picture-container gap-2 mt-3">
            <label className="ml-11" htmlFor="facilityName">
              Facility Name
            </label>
            <select
              onChange={handleFacilityChange}
              value={selectedFacilities}
              multiple
              className="select-input"
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
            <label className="ml-11" htmlFor="hotelDescription">
              Hotel Description
            </label>
            <input
              onChange={handleOnChange}
              type="text"
              name="hotelDescription"
              className="select-input"
              placeholder="Hotel Description"
            />
          </div>
          <div className="picture-container gap-2 mt-3">
            <label className="ml-11" htmlFor="destinatioName">
              Destination
            </label>
            <select
              onChange={(e) => setHotelAddress(e.target.value)}
              className="select-input"
              name="destinationName"
            >
              <option value="1">Select A Destination</option>
              {Address.map((destination: any, index: number) => (
                <option key={index} value={destination.OriginName}>
                  {destination.OriginName}
                </option>
              ))}
            </select>
          </div>
          <div className="picture-container gap-2 mt-3">
            <label className="ml-11" htmlFor="hotelPictures">
              Hotel Pictures
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

export default AddHotels;
