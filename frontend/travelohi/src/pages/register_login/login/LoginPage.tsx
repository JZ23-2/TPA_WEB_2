import "../style.scss";
import TextField from "../../../components/form/TextField";
import LinkContainer from "../../../components/form/LinkContainer";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { FormEvent, useEffect, useState } from "react";
import { IUser } from "../../../interfaces/user-interface";
import { useUserAuth } from "../../../context/UserContext";
import axios from "axios";
import LogoContainer from "../../../components/form/LogoContainer";

function LoginPage() {
  const [capValue, setCapValue] = useState<string>("");
  const [user, setUser] = useState<IUser>();
  const { update, getUser } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (user?.token === undefined) {
      navigate("/");
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    var email = formData.get("email") as string;
    var password = formData.get("password") as string;
    await axios
      .post("http://localhost:8080/api/user/login", {
        Email: email,
        Password: password,
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        if (err.response) {
          alert(err.response.data);
        }
      });
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="form-color w-96 flex-col rounded-2xl">
        <LogoContainer />
        <div>
          <form onSubmit={handleSubmit}>
            <TextField label="Email" name="email" type="email" />
            <TextField label="Password" name="password" type="password" />
            <div className="flex items-center justify-center mt-3 ml-2">
              <ReCAPTCHA
                sitekey="6Lda4k8pAAAAAKqpVtlBi8kf6JM7p7phaggg7QVC"
                onChange={(value) => setCapValue(value!)}
              />
            </div>
            {capValue && (
              <>
                <div className="flex justify-center items-center mt-2">
                  <button
                    className="w-72 py-3  border-2 rounded-md submit-button"
                    type="submit"
                  >
                    Login
                  </button>
                </div>
                <div className="flex justify-center mt-5">
                  <Link className="link-color" to={"/otp-page"}>
                    Login With OTP
                  </Link>
                </div>
              </>
            )}
            <LinkContainer
              name="Register"
              text="Don't have an account?"
              link="/register-page"
            />
          </form>
          <div className="flex justify-center items-center mb-3">
            <Link className="link-color" to={"/forgot-password-page"}>
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
