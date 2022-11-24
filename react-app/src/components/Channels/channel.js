import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
let socket;

const Channel = () => {
  const dispatch = useDispatch();
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoaded, setIsLoaded] = useState([]);
  const currentUser = useSelector((state) => state.session.user);

  useEffect(() => {
    socket = io();
    console.log("SET SOCKET");
    socket.on("sign_in", (data) => setUserList(data));
    socket.on("chat", (chat) => setMessages((messages) => [...messages, chat]));

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    socket.emit("sign_in", { user: currentUser.firstName });
    setIsLoaded(true);
  }, [currentUser]);

  const handleChatsend = (e) => {
    e.preventDefault();
    console.log("SOCKET ", socket);
    socket.emit("chat", { msg: userMessage, user: currentUser });
    setUserMessage("");
  };

  if (!isLoaded) return null;
  return (
    <div>
      <div>
        {messages.map((message, idx) => (
          <li key={idx}>
            {message.user.firstName}: {message.msg}
          </li>
        ))}
      </div>
      <form onSubmit={handleChatsend}>
        <textarea
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
        />
        <button type="submit">Send message</button>
      </form>
    </div>
  );
};

export default Channel;
