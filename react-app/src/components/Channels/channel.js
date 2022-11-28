import { useState, useEffect, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ModalContext } from "../../context/Modal";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { loadChannelThunk } from "../../store/channels";
import {
  createMessageThunk,
  loadMessagesThunk,
} from "../../store/channelMessages";
import ChannelMessage from "../ChannelMessages/ChannelMessage";
import { connectSocket, disconnectSocket } from "../../store/socket";
import "./Channel.css";
let socket;

const Channel = () => {
  const dispatch = useDispatch();
  const { channelId } = useParams();

  const { setModalType, setSubModalType } = useContext(ModalContext);

  const messagesEndRef = useRef(null);

  const currentUser = useSelector((state) => state.session.user);
  const channel = useSelector((state) => state.channel.channel);
  const messages = useSelector((state) => state.channelMessage.messages);
  const existingSocket = useSelector((state) => state.socket.socket);

  const [userMessage, setUserMessage] = useState("");
  const [userList, setUserList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const initializeSocketHandler = () => {
    socket = io();
    dispatch(connectSocket(socket));
    socket.on("sign_in", (data) => setUserList(data));
    socket.emit("sign_in", { user: currentUser });
  };

  const disconnectSocketHandler = () => {
    if (existingSocket) {
      socket.emit("leave", { room: channel.id, user: currentUser });
      socket.disconnect();
      dispatch(disconnectSocket());
    }
  };

  useEffect(async () => {
    await dispatch(loadChannelThunk(channelId));
  }, [dispatch]);

  useEffect(() => {
    initializeSocketHandler();
    if (channel.id) {
      socket.on(
        "load_messages",
        async (chat) => await dispatch(loadMessagesThunk(channel.id))
      );

      socket.on(
        "chat",
        async (chat) => await dispatch(loadMessagesThunk(channel.id))
      );
      //FIX LATER, IM TAKING IN THE WHOLE CHAT AS A PARAM FROM SOCKET AND NOT USING IT THEN LOADING ALL MESSAGES FROM DB, IT IS REPITITVE

      socket.emit("join", { user: currentUser, room: channel.id });
      socket.emit("load_messages", { room: channel.id });
      setIsLoaded(true);
    }

    return () => disconnectSocketHandler();
  }, [channel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const handleChatsend = async (e) => {
    e.preventDefault();

    const newMessage = await dispatch(
      createMessageThunk(channel.id, { content: userMessage, edited: false })
    );

    socket.emit("chat", {
      msgData: newMessage,
      user: currentUser,
      room: channel.id,
    });
    setUserMessage("");
  };

  const setChannelInfoModal = () => {
    setModalType("channelInfo");
    setSubModalType("about");
  };

  const setMembersInfoModal = () => {
    setModalType("channelInfo");
    setSubModalType("members");
  };

  if (!isLoaded) return null;
  return (
    <div className="chat-container">
      <div className="chat-header-container">
        <div className="chat-header-title header" onClick={setChannelInfoModal}>
          <div className="chat-header-icon">
            <i class="fa-solid fa-hashtag" onClick={setChannelInfoModal}></i>
          </div>
          {channel.name}
        </div>
        <div className="chat-people-count">
          <button onClick={setMembersInfoModal}>
            <i class="fa-solid fa-user"></i>
            {channel.userCount}
          </button>
        </div>
        {/* <h3>User List</h3>
        <ul>
          {Object.values(userList).map((onlineUser, idx) => (
            <li key={idx}>{onlineUser.firstName}</li>
          ))}
        </ul> */}
      </div>
      <div className="chat-messages-container">
        {Object.values(messages).map((message, idx) => (
          <ChannelMessage key={idx} messageId={message.id} />
        ))}
      </div>
      <div className="chat-input-container">
        <div className="chat-input">
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
          />
          <button onClick={handleChatsend}>Send</button>
        </div>
      </div>
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default Channel;
