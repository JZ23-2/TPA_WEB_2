import { FormEvent, useEffect, useRef, useState } from "react";
import "./managepromo.scss";
import axios from "axios";
import { storage } from "../../config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function ManagePromo() {
  const [promos, setPromos] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleDelete = (id: string) => {
    const confirm = window.confirm("Are you sure to delete promo?");
    if (confirm === true) {
      axios
        .delete("http://localhost:8080/api/admin/delete-promo", {
          params: { PromoID: id },
        })
        .then(() => {
          alert("Promo Deleted!");
          window.location.reload();
        });
    }
  };

  const handleUpdateClick = (id: string) => {
    setShowUpdateModal(true);
    setSelectedPromo(id);
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
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

    axios
      .put("http://localhost:8080/api/admin/update-promo", {
        PromoID: selectedPromo,
        PromoName: promoName,
        PromoCode: promoCode,
        PromoDescription: promoDescription,
        PromoBenefit: promoBenefit,
        PromoPicture: url,
      })
      .then(() => {
        alert("Promo Updated!");
        window.location.reload();
      });
  };

  useEffect(() => {
    axios.get("http://localhost:8080/api/promo/get-promo").then((res) => {
      setPromos(res.data);
    });
  }, []);

  return (
    <div className="outer-manage-promo-container">
      <div className="middle-manage-promo-container">
        <h1 className="text-h1">Manage Promos</h1>
        <div className="cards-container">
          {promos.map((promo: any, index: number) => (
            <div key={index} className="promo-card">
              <img
                className="promo-picture border-1 rounded-md"
                src={promo.PromoPicture}
                alt="Promo"
              />
              <div className="promo-details">
                <h2 className="promo-name">Promo Name: {promo.PromoName}</h2>
                <p className="promo-description">
                  Promo Descripton: {promo.PromoDescription}
                </p>
                <p className="promo-benefit">
                  Promo Benefit: {promo.PromoBenefit}
                </p>
              </div>
              <div className="action-container">
                <button
                  className="button-action button-update"
                  onClick={() => handleUpdateClick(promo.PromoID)}
                >
                  Update
                </button>
                <button
                  className="button-action ml-3 button-remove"
                  onClick={() => handleDelete(promo.PromoID)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showUpdateModal && (
        <div>
          <div className="modal-overlay"></div>
          <div className="update-modal">
            <h1 className="text-promo-h1">Update Promo</h1>
            <form className="form-container" onSubmit={handleUpdate}>
              <div className="">
                <label className="mt-3" htmlFor="promoName">
                  Promo Name
                </label>
                <input
                  className="input-container"
                  type="text"
                  name="promoName"
                  placeholder="Promo Name"
                  required
                />
              </div>
              <div className="mt-3">
                <label className="mt-3" htmlFor="promoCode">
                  Promo Code
                </label>
                <input
                  className="input-container"
                  type="text"
                  name="promoCode"
                  placeholder="Promo Code"
                  required
                />
              </div>
              <div className="mt-3">
                <label className="mt-3" htmlFor="promoDescription">
                  Promo Description
                </label>
                <input
                  className="input-container"
                  type="text"
                  name="promoDescription"
                  placeholder="Promo Description"
                  required
                />
              </div>
              <div className="mt-3">
                <label className="mt-3" htmlFor="promoBenefit">
                  Promo Benefit
                </label>
                <input
                  className="input-container"
                  type="text"
                  name="promoBenefit"
                  placeholder="Promo Benefit"
                  required
                />
              </div>
              <div className="mt-3">
                <label className="mt-3" htmlFor="promoPicture">
                  Promo Picture
                </label>
                <input
                  ref={inputRef}
                  className="input-container"
                  type="file"
                  name="promoPicture"
                  required
                />
              </div>
              <div className="button-update-container">
                <button className="button-update py-2" type="submit">
                  Update
                </button>
                <button
                  className="button-update py-2"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagePromo;
