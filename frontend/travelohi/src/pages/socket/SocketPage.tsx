import { useEffect, useState } from "react";
import client from "../../client/client";
import audio from "../../assets/others/GameAsset/music1.mp3";

function SocketPage() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    client.on("message", (data: string) => {
      setMessage(data);
    });

    return () => {
      client.off("message");
    };
  }, []);

  const sendMessage = () => {
    client.emit("sendMessage", "Hello, Server!");
  };
  return (
    <div>
      <h1>Socket.IO React TypeScript Example</h1>
      <p>Received message from server: {message}</p>
      <audio src={audio} controls></audio>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}

export default SocketPage;
