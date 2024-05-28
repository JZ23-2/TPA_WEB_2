import { FormEvent } from "react";
import TextField from "../../components/form/TextField";
import "./sendnew.scss";
import axios from "axios";

function SendNewletter() {
  const handleSent = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    var content = formData.get("newletter") as string;
    axios
      .post("http://localhost:8080/api/admin/send-newsletter", {
        NewLetterContent: content,
      })
      .then(() => {
        alert("Sent newletter successfully");
        window.location.reload();
      });
  };

  return (
    <div className="outer-send-container">
      <h1 className="text-h1">Send Newletters</h1>
      <div className="middle-send-container">
        <form onSubmit={handleSent} className="form-container">
          <TextField name="newletter" label="Newletter" type="text" />
          <div className="flex items-center justify-center">
            <button className="button-send-container" type="submit">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SendNewletter;
