import { useState, useEffect, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ModalContext } from "../../context/Modal";
import { useParams } from "react-router-dom";

import { loadChannelThunk } from "../../store/channels";
import {
  createMessageThunk,
  loadMessagesThunk,
} from "../../store/channelMessages";
import ChannelMessage from "../ChannelMessages/ChannelMessage";
import "./Channel.css";
import ChatInputText from "../ChatInputText/ChatInputText";

const Channel = () => {
  const dispatch = useDispatch();
  const { channelId } = useParams();

  const { setModalType, setSubModalType } = useContext(ModalContext);

  const messagesEndRef = useRef(null);

  const currentUser = useSelector((state) => state.session.user);
  const channel = useSelector((state) => state.channel.channel);
  const messages = useSelector((state) => state.channelMessage.messages);
  const socket = useSelector((state) => state.socket.socket);

  const [userMessage, setUserMessage] = useState("");

  const [isLoaded, setIsLoaded] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(async () => {
    await dispatch(loadChannelThunk(channelId));
  }, [dispatch]);

  useEffect(() => {
    setErrors([]);
  }, [userMessage]);

  useEffect(() => {
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

    return () => {
      socket.emit("leave", { room: channel.id, user: currentUser });
      socket.off("load_messages");
      socket.off("chat");
    };
  }, [channel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const handleChatsend = async (e) => {
    e.preventDefault();
    let newMessage;

    try {
      newMessage = await dispatch(
        createMessageThunk(channel.id, { content: userMessage, edited: false })
      );
    } catch (e) {
      const eData = await e.json();
      console.log(eData);
      setErrors(eData.errors);
      return;
    }

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
      <div className="header-container" id="chat-header">
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
          <ChatInputText
            setUserMessage={setUserMessage}
            userMessage={userMessage}
            channelName={channel.name}
          />

          <div className="errors">
            {errors.map((error, ind) => (
              <div key={ind}>{error}</div>
            ))}
          </div>
          <button
            onClick={handleChatsend}
            className={userMessage.length > 0 ? "green" : ""}
          >
            Send
          </button>
        </div>
      </div>
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default Channel;
