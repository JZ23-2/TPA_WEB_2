import TextField from "../../../components/form/TextField";

import "../style.scss";
import axios from "axios";
import LinkContainer from "../../../components/form/LinkContainer";
import { FormEvent, useEffect, useRef, useState } from "react";
import { storage } from "../../../config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ReCAPTCHA from "react-google-recaptcha";
import { useUserAuth } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import LogoContainer from "../../../components/form/LogoContainer";

function RegisterPage() {
  interface QuestionInterface {
    QuestionID: number;
    Question: string;
  }
  const { getUser } = useUserAuth();
  const [questions, setQuestions] = useState<QuestionInterface[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [capValue, setCapValue] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (user?.token === undefined) {
      navigate("/register-page");
    } else {
      navigate("/home-page");
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstname") as string;
    const lastName = formData.get("lastname") as string;
    const gender = formData.get("gender") as string;
    const dateOfBirth = formData.get("dataofbirth") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmpassword") as string;
    const personalQuestion = formData.get("questions") as string;
    const answer = formData.get("answer") as string;
    const subscribe = formData.get("subscribe") as string;
    var subscribeConfirm = -1;
    var url = "";

    if (firstName.length < 5 || lastName.length < 5) {
      alert("Name must be at least 5 characters");
      return;
    }

    const nameRegex = /^[a-zA-Z\s]*$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      alert("Name must not contain symbols or numbers");
      return;
    }

    const passowrdRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
    if (!passowrdRegex.test(password)) {
      alert(
        "Password must contain capital letters, lowercase letters, numbers, and special symbols, and have a length of 8-30 characters"
      );
      return;
    }

    if (confirmPassword !== password) {
      alert("Password and Confirm Password must be the same");
      return;
    }

    var testGender = gender.toLowerCase();
    if (testGender !== "male" && testGender !== "female") {
      alert("Gender must be male or female");
      return;
    }

    const currentDate = new Date();
    const dob = new Date(dateOfBirth);
    const thirteenYearsAgo = new Date(
      currentDate.getFullYear() - 13,
      currentDate.getMonth(),
      currentDate.getDate()
    );

    if (dob >= thirteenYearsAgo) {
      alert("Date of Birth must be at least 13 years old");
      return;
    }

    if (subscribe == "on") {
      subscribeConfirm = 1;
    } else if (subscribe == null) {
      subscribeConfirm = 0;
    }

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

    console.log(url);
    axios
      .post("http://localhost:8080/api/user/register", {
        FirstName: firstName,
        LastName: lastName,
        Password: password,
        Email: email,
        Gender: testGender,
        QuestionID: parseInt(personalQuestion),
        dateOfBirth: new Date(dateOfBirth),
        SubscribeStatus: subscribeConfirm,
        Status: 1,
        Role: "User",
        AccountStatus: 1,
        ProfiePicture: url,
        WalletAmount: 2000000,
        Answer: answer,
      })
      .then(() => {
        alert("Register Success");
        window.location.reload();
      })
      .catch((e: any) => {
        alert(e.data);
        window.location.reload();
      });
  };

  useEffect(() => {
    axios.get("http://localhost:8080/api/question/get-question").then((res) => {
      setQuestions(res.data);
    });
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="form-color w-96 flex-col rounded-2xl">
        <LogoContainer />
        <div>
          <form onSubmit={handleSubmit}>
            <div className="flex">
              <div className="flex flex-col gap-1">
                <label className="ml-11 label-color" htmlFor="firstname">
                  First Name
                </label>
                <input
                  className="ml-11 w-36 pl-2 py-3 border-1 color-primary rounded-md"
                  type="text"
                  placeholder="First Name"
                  name="firstname"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="ml-6 label-color" htmlFor="lastname">
                  Last Name
                </label>
                <input
                  className="ml-5 w-36 pl-2 py-3 border-1 color-primary rounded-md"
                  type="text"
                  placeholder="Last Name"
                  name="lastname"
                  required
                />
              </div>
            </div>
            <div className="flex mt-2">
              <div className="flex flex-col gap-1">
                <label className="ml-11 label-color" htmlFor="gender">
                  Gender
                </label>
                <input
                  className="ml-11 w-36 pl-2 py-3 border-1 color-primary rounded-md"
                  type="text"
                  placeholder="Gender"
                  name="gender"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="ml-6 label-color" htmlFor="dataofbirth">
                  Data Of Birth
                </label>
                <input
                  className="ml-5 w-36 pl-2 py-3 border-1 color-primary rounded-md"
                  type="date"
                  name="dataofbirth"
                  required
                />
              </div>
            </div>
            <TextField label="Email" name="email" type="email" />
            <div className="flex mt-2">
              <div className="flex flex-col gap-1">
                <label className="ml-11 label-color" htmlFor="password">
                  Password
                </label>
                <input
                  className="ml-11 w-36 pl-2 py-3 border-1 color-primary rounded-md"
                  type="password"
                  placeholder="Password"
                  name="password"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="ml-6 label-color" htmlFor="confirmpassword">
                  Confirm Password
                </label>
                <input
                  className="ml-5 w-36 pl-2 py-3 border-1 color-primary rounded-md"
                  type="password"
                  name="confirmpassword"
                  placeholder="Confirm Password"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 mt-2 ml-5">
              <label className="ml-6 label-color" htmlFor="picture">
                Picture
              </label>
              <input
                ref={inputRef}
                className="ml-6 w-74 pl-2 py-3 border-1 rounded-md background-white"
                type="file"
                name="picture"
                required
              />
            </div>
            <div className="flex flex-col mt-2 gap-1 ml-5">
              <label htmlFor="questions" className="ml-6 label-color">
                Personal Question
              </label>
              <select
                name="questions"
                className="border-1 w-74 ml-6 py-3 rounded-md color-primary"
                required
              >
                <option value="">Select a Personal Question</option>
                {questions.map((question: QuestionInterface) => (
                  <option key={question.QuestionID} value={question.QuestionID}>
                    {question.Question}
                  </option>
                ))}
              </select>
            </div>
            <TextField label="Answer" name="answer" type="password" />
            <div className="flex gap-2 justify-center mt-2">
              <input type="checkbox" id="subscribe" name="subscribe" />
              <label htmlFor="subscribe" className="label-color">
                Subscribe Newsletter
              </label>
            </div>
            <div className="flex justify-center items-center mt-2">
              <ReCAPTCHA
                sitekey="6Lda4k8pAAAAAKqpVtlBi8kf6JM7p7phaggg7QVC"
                onChange={(value) => setCapValue(value!)}
              />
            </div>
            <div className="flex items-center justify-center mt-3">
              {capValue && (
                <button
                  className="w-72 py-3 submit-button border-2 rounded-md "
                  type="submit"
                >
                  Login
                </button>
              )}
            </div>
            <LinkContainer
              name="Login"
              text="Already have an account?"
              link="/"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
