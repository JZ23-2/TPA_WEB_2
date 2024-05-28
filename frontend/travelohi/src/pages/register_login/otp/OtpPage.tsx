import "../style.scss";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { IUser } from "../../../interfaces/user-interface";
import { useUserAuth } from "../../../context/UserContext";
import LogoContainer from "../../../components/form/LogoContainer";

function OtpPage() {
  const [email, setEmail] = useState<string>("");
  const [isClick, setIsClick] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>();
  const { update, getUser } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (user?.token === undefined) {
      navigate("/otp-page");
    } else {
      navigate("/home-page");
    }
  }, []);

  useEffect(() => {
    if (user) {
      update(user);
      navigate("/home-page");
    }
  }, [user]);

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    var email = formData.get("email") as string;
    await axios
      .post("http://localhost:8080/api/user/get-otp", {
        Email: email,
      })
      .then(() => {
        alert("OTP sent to your email");
        setIsClick(true);
      })
      .catch((err) => {
        if (err.response) {
          alert(err.response.data);
        }
      });
  };

  const handleOnSubmitOTP = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    var email = formData.get("email") as string;
    var otp = formData.get("otp") as string;
    await axios
      .post("http://localhost:8080/api/user/login-otp", {
        Email: email,
        OTP: otp,
      })
      .then((res) => {
        alert("Login OTP success");
        setUser(res.data);
      })
      .catch((err) => {
        if (err.response) {
          alert(err.response.data);
        }
      });
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const isEmailFilled = email !== "";

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="form-color w-96 flex-col rounded-2xl">
        <LogoContainer />
        {!isClick ? (
          <div>
            <form onSubmit={handleOnSubmit}>
              <label className="ml-11 label-color" htmlFor="email">
                Email
              </label>
              <input
                className="ml-11 w-72 pl-2 py-3 border-1 color-primary rounded-md"
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                required
              />
              <div className="flex justify-center items-center mt-2">
                <button
                  className="w-74 ml-2 mt-2 py-3 submit-button border-2 rounded-md "
                  type="submit"
                  disabled={!isEmailFilled}
                >
                  Generate OTP
                </button>
              </div>
              <div className="flex justify-center items-center my-3">
                <Link className="link-color" to={"/"}>
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <form onSubmit={handleOnSubmitOTP} className="flex flex-col gap-2">
              <label className="ml-11 label-color" htmlFor="email">
                Email
              </label>
              <input
                className="ml-11 w-72 pl-2 py-3 border-1 color-primary rounded-md"
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                required
              />
              <label className="ml-11 label-color" htmlFor="otp">
                OTP
              </label>
              <input
                className="ml-11 w-72 pl-2 py-3 border-1 color-primary rounded-md"
                type="text"
                placeholder="OTP"
                name="otp"
                required
              />
              <div className="flex justify-center items-center mt-2">
                <button
                  className="w-74 ml-2 mt-2 py-3 submit-button border-2 rounded-md"
                  type="submit"
                  disabled={!isEmailFilled}
                >
                  Submit OTP
                </button>
              </div>
              <div className="flex justify-center items-center my-2">
                <Link className="link-color" to={"/"}>
                  Back To Login
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default OtpPage;
