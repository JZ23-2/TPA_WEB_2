import "../style.scss";

import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import LogoContainer from "../../../components/form/LogoContainer";

function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [isClick, setIsClick] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [personalQuestion, setPersonalQuestion] = useState<string>("");
  const [questionID, setQuestionID] = useState<number>(-1);
  const [userID, setUserID] = useState<number>(-1);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    if (newEmail !== undefined && newEmail !== null) {
      setEmail(newEmail);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    var email = formData.get("email") as string;
    await axios
      .post("http://localhost:8080/api/user/get-personal-question", {
        Email: email,
      })
      .then((res) => {
        setPersonalQuestion(res.data.question);
        setQuestionID(res.data.questionID);
        setUserID(res.data.userID);
        setIsClick(true);
      })
      .catch((err) => {
        if (err.response) {
          alert(err.response.data);
        }
      });
  };

  const handleAnswerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const answer = formData.get("answer") as string;
    await axios
      .post("http://localhost:8080/api/question/check-answer", {
        Answer: answer,
        QuestionID: questionID,
        UserID: userID,
      })
      .then(() => {
        alert("Correct Answer");
        setIsSubmit(true);
      })
      .catch((err) => {
        if (err.response) {
          alert(err.response.data);
        }
      });
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const passowrdRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
    if (!passowrdRegex.test(password)) {
      alert(
        "Password must contain capital letters, lowercase letters, numbers, and special symbols, and have a length of 8-30 characters"
      );
      return;
    }

    if (password !== confirmPassword) {
      alert("Password and Confirm Password are not the same");
      return;
    }
    await axios
      .put("http://localhost:8080/api/user/update-user-password", {
        userID: userID,
        password: password,
      })
      .then(() => {
        alert("Password Updated");
      })
      .catch((err) => {
        if (err.response) {
          alert(err.response.data);
        }
      });
  };

  const isEmailFilled = email !== "";
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="form-color w-96 flex-col rounded-2xl">
        <LogoContainer />
        {!isClick ? (
          <div>
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
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
                  Forgot Password
                </button>
              </div>
              <div className="flex justify-center items-center mt-3 mb-2">
                <Link className="link-color" to={"/"}>
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        ) : (
          <div>
            {!isSubmit ? (
              <div>
                <form
                  className="flex flex-col gap-2"
                  onSubmit={handleAnswerSubmit}
                >
                  <label className="ml-11 label-color" htmlFor="personalQuestion">
                    Personal Question
                  </label>
                  <input
                    className="ml-11 w-72 pl-2 py-3 border-1 color-primary rounded-md"
                    type="text"
                    placeholder="Personal Question"
                    name="personalQuestion"
                    value={personalQuestion}
                    readOnly
                    required
                  />
                  <label className="ml-11 label-color" htmlFor="answer">
                    Answer
                  </label>
                  <input
                    className="ml-11 w-72 pl-2 py-3 border-1 color-primary rounded-md"
                    type="password"
                    placeholder="Answer"
                    name="answer"
                    required
                  />
                  <div className="flex justify-center items-center mt-2">
                    <button
                      className="w-74 ml-2 mt-2 py-3 submit-button border-2 rounded-md "
                      type="submit"
                      disabled={!isEmailFilled}
                    >
                      Submit
                    </button>
                  </div>
                  <div className="flex justify-center items-center mt-3 mb-2">
                    <Link className="link-color" to={"/"}>
                      Back to Login
                    </Link>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <form
                  className="flex flex-col gap-2"
                  onSubmit={handleUpdateSubmit}
                >
                  <label className="ml-11 label-color" htmlFor="newpassword">
                    New Password
                  </label>
                  <input
                    className="ml-11 w-72 pl-2 py-3 border-1 color-primary rounded-md"
                    type="password"
                    placeholder="New Password"
                    name="newpassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label className="ml-11 label-color" htmlFor="confirmpassword">
                    Confirm Password
                  </label>
                  <input
                    className="ml-11 w-72 pl-2 py-3 border-1 color-primary rounded-md"
                    type="password"
                    placeholder="Confirm Password"
                    name="confirmpassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <div className="flex justify-center items-center mt-2">
                    <button
                      className="w-74 ml-2 mt-2 py-3 submit-button border-2 rounded-md "
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                  <div className="flex justify-center items-center mt-3 mb-2">
                    <Link className="link-color" to={"/"}>
                      Back to Login
                    </Link>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
