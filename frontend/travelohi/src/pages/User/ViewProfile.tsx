import "./user.scss";
import { useEffect, useRef, useState } from "react";
import { useUserAuth } from "../../context/UserContext";
import axios from "axios";
import { storage } from "../../config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function ViewProfile() {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const { user } = useUserAuth();
  const [userDetail, setUserDetail] = useState<any | null>(null);
  const [selectedUser, setSelectedUser] = useState<number>(0);
  const [creditCard, setCreditCard] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUpdateProfileClick = () => {
    setShowUpdateModal(true);
    setSelectedUser(1);
  };

  const handleAddCreditClick = () => {
    setShowUpdateModal(true);
    setCreditCard(1);
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user/get-user-by-id", {
        params: { id: user?.userID },
      })
      .then((res) => {
        console.log(res.data);
        setUserDetail(res.data);
      });
  }, [user]);

  const handleAddCreditCard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const creditCardCode = form.get("creditCardCode") as string;

    axios
      .post("http://localhost:8080/api/user/add-credit-card", {
        UserID: user?.userID,
        CreditCardNumber: creditCardCode,
      })
      .then(() => {
        alert("Credit Card Added");
        window.location.reload();
      });
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const subscribeNewletters = parseInt(
      formData.get("subscribeNewletters") as string
    );
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
      .put("http://localhost:8080/api/user/update-profile", {
        UserID: user?.userID,
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        SubscribeStatus: subscribeNewletters,
        ProfiePicture: url,
      })
      .then(() => {
        alert("Profile Updated");
        window.location.reload();
      });
  };

  return (
    <div className="outer-manage-user-container">
      <div className="middle-manage-user-container">
        <h1 className="text-user">Profile Information</h1>
        <div className="inner-manage-user-container">
          {userDetail && (
            <div className="inner-input-user">
              <div className="inner-inner-container">
                <div className="profile-user-container">
                  <img
                    src={userDetail.ProfiePicture}
                    className="image-profile-user"
                    alt={userDetail.FirstName}
                  />
                </div>
                <form>
                  <div className="horizontal-user-input">
                    <div className="outer-input-user">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        name="FirstName"
                        className="input-user-1"
                        value={userDetail.FirstName}
                        readOnly
                      />
                    </div>
                    <div className="outer-input-user">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        name="LastName"
                        className="input-user-1"
                        value={userDetail.LastName}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="outer-input-user">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      name="Email"
                      className="input-user-2"
                      value={userDetail.Email}
                      readOnly
                    />
                  </div>
                  <div className="outer-input-user">
                    <label htmlFor="gender">Gender</label>
                    <input
                      type="text"
                      name="gender"
                      className="input-user-2"
                      value={userDetail.Gender}
                      readOnly
                    />
                  </div>
                  {userDetail.CreditCardNumber === "" ? (
                    <div className="outer-input-user">
                      <label htmlFor="creditCard">Credit Card</label>
                      <input
                        type="text"
                        name="creditCard"
                        className="input-user-2"
                        value="No Credit Card"
                        readOnly
                      />
                    </div>
                  ) : (
                    <div className="outer-input-user">
                      <label htmlFor="gender">Credit Card</label>
                      <input
                        type="text"
                        name="gender"
                        className="input-user-2"
                        value={userDetail.CreditCardNumber}
                      />
                    </div>
                  )}
                  {userDetail.SubscribeStatus === 1 ? (
                    <div className="outer-input-user">
                      <label htmlFor="subscription">Subscription</label>
                      <input
                        type="text"
                        name="subscription"
                        className="input-user-2"
                        value="Active"
                        readOnly
                      />
                    </div>
                  ) : (
                    <div className="outer-input-user">
                      <label htmlFor="subscription">Subscription</label>
                      <input
                        type="text"
                        name="subscription"
                        className="input-user-2"
                        value="Inactive"
                        readOnly
                      />
                    </div>
                  )}
                </form>
              </div>
              <div className="flex justify-center gap-4 my-5">
                <button
                  onClick={handleUpdateProfileClick}
                  className="button-user"
                >
                  Edit Profile
                </button>
                {userDetail.CreditCardNumber === "" && (
                  <button
                    onClick={handleAddCreditClick}
                    className="button-user"
                  >
                    Add Credit Card
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {showUpdateModal && (
        <div>
          {creditCard === 1 && (
            <div>
              <div className="modal-overlay"></div>
              <div className="update-modal-1">
                <h1 className="text-promo-h1">Add Credit Card</h1>
                <form onSubmit={handleAddCreditCard} className="form-container">
                  <div className="picture-container gap-2 mt-3">
                    <label className="ml-6" htmlFor="creditCardCode">
                      Credit Card Code
                    </label>
                    <input
                      type="text"
                      name="creditCardCode"
                      className="select-input-1"
                      placeholder="Credit Card Code"
                    />
                  </div>
                  <div className="button-update-container mt-4">
                    <button type="submit" className="button-update py-2">
                      Add Credit Card
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

          {selectedUser === 1 && (
            <div>
              {selectedUser === 1 && (
                <div>
                  <div className="modal-overlay"></div>
                  <div className="update-modal-1">
                    <h1 className="text-promo-h1">Update Profile</h1>
                    <form
                      onSubmit={handleUpdateProfile}
                      className="form-container"
                    >
                      <div className="double-container">
                        <div className="inner-double-container">
                          <label className="ml-6" htmlFor="firstName">
                            First Name
                          </label>
                          <input
                            className="select-input-21"
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                          />
                        </div>
                        <div className="inner-double-container">
                          <label className="ml-11" htmlFor="lastName">
                            LastName
                          </label>
                          <input
                            className="select-input-2"
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                          />
                        </div>
                      </div>
                      <div className="picture-container gap-2 mt-3">
                        <label className="ml-6" htmlFor="emai">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="select-input-1"
                          placeholder="Email"
                        />
                      </div>
                      <div className="picture-container gap-2 mt-3">
                        <label className="ml-6" htmlFor="profilePhoto">
                          Profile Photo
                        </label>
                        <input
                          ref={inputRef}
                          type="file"
                          name="profilePhoto"
                          className="select-input-1"
                        />
                      </div>
                      <div className="picture-container gap-2 mt-3">
                        <label className="ml-6" htmlFor="subscribeNewletters">
                          Subscribe Newletters
                        </label>
                        <select
                          className="select-input-1"
                          name="subscribeNewletters"
                        >
                          <option value="-1">
                            Select To Subscribe Newletters
                          </option>
                          <option value="0">No Subscribe</option>
                          <option value="1">Subscribe</option>
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
          )}
        </div>
      )}
    </div>
  );
}

export default ViewProfile;
