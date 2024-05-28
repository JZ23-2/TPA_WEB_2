import { FormEvent, useRef } from "react";
import TextField from "../../components/form/TextField";
import "./promo.scss";
import { storage } from "../../config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import axios from "axios";

function AddPromo() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const promoName = formData.get("promoName") as string;
    const promoCode = formData.get("promoCode") as string;
    const promoDescription = formData.get("promoDescription") as string;
    const promoBenefit = parseInt(formData.get("promoBenefit") as string);
    var url = "";

    if (inputRef.current && inputRef.current.files) {
      const file = inputRef.current.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        alert("Image File Doen't Support (Only Support .jpg, .jpeg, .png)");
        return;
      } else {
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        url = await getDownloadURL(storageRef);
      }
    }
    console.log(promoName);
    console.log(promoCode);
    console.log(promoDescription);
    console.log(promoBenefit);
    console.log(url);
    axios
      .post("http://localhost:8080/api/admin/add-promo", {
        PromoName: promoName,
        PromoCode: promoCode,
        PromoDescription: promoDescription,
        PromoBenefit: promoBenefit,
        PromoPicture: url,
      })
      .then(() => {
        alert("Add promo successfully");
        window.location.reload();
      });
  };

  return (
    <div className="outer-promo-container">
      <h1 className="text-h1">Add Promos</h1>
      <div className="middle-promo-container">
        <form onSubmit={handleSubmit} className="form-container">
          <TextField name="promoName" label="Promo Name" type="text" />
          <TextField name="promoCode" label="Promo Code" type="text" />
          <TextField
            name="promoDescription"
            label="Promo Description"
            type="text"
          />
          <TextField name="promoBenefit" label="Promo Benefit" type="number" />
          <div className="picture-container gap-1">
            <label className="ml-7" htmlFor="promoPicture">
              Picture Promo
            </label>
            <input
              ref={inputRef}
              className="picture-input"
              type="file"
              name="promoPicture"
              required
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

export default AddPromo;
