import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;
const TestSocket = () => {
  const [uList, setUList] = useState([]);
  useEffect(() => {
    socket = io();
    socket.on("sign_in", (data) => {
      setUList(data);
      console.log("U LISTTT", data);
    });

    return () => socket.disconnect();
  }, []);

  const signIn = () => {
    socket.emit("sign_in", { user: "test" });
  };

  return <button onClick={signIn}>SignIn</button>;
};

export default TestSocket;
