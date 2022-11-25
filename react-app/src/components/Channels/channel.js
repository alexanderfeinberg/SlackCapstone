import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { loadChannelThunk } from "../../store/channels";
import { createMessageThunk } from "../../store/channelMessages";
import ChannelMessage from "../ChannelMessages/ChannelMessage";
import configureStore from "../../store";
let socket;

const Channel = () => {
  const { channelId } = useParams();
  const dispatch = useDispatch();
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const currentUser = useSelector((state) => state.session.user);
  const channel = useSelector((state) => state.channel.channel);

  useEffect(async () => {
    await dispatch(loadChannelThunk(channelId));
    socket = io();
    socket.on("sign_in", (data) => setUserList(data));
    socket.on("join", (oldMessages) =>
      setMessages((messages) => [...messages, ...oldMessages])
    );
    socket.on("chat", (chat) => setMessages((messages) => [...messages, chat]));
    socket.emit("sign_in", { user: currentUser });

    setIsLoaded(true);

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("join", { user: currentUser, room: channel.id });
    }
  }, [channel]);

  const handleChatsend = async (e) => {
    e.preventDefault();
    console.log("SOCKET ", socket);

    const newMessage = await dispatch(
      createMessageThunk(channel.id, { content: userMessage, edited: false })
    );

    console.log("NEW MESSAGE ", newMessage);

    socket.emit("chat", {
      msg: userMessage,
      msgData: newMessage,
      user: currentUser,
      room: channel.id,
    });
    setUserMessage("");
  };

  if (!isLoaded) return null;
  return (
    <div>
      <div>
        <h3>User List</h3>
        <ul>
          {Object.values(userList).map((onlineUser, idx) => (
            <li key={idx}>{onlineUser.firstName}</li>
          ))}
        </ul>
      </div>
      <div>
        {messages.map((message, idx) => (
          <ChannelMessage key={idx} message={message} />
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
