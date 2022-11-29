import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  editMessageThunk,
  deleteMessageThunk,
} from "../../store/channelMessages";
import "./ChannelMessages.css";
import ChatInputText from "../ChatInputText/ChatInputText";

const ChannelMessage = ({ messageId }) => {
  const dispatch = useDispatch();

  const message = useSelector(
    (state) => state.channelMessage.messages[messageId]
  );
  const socket = useSelector((state) => state.socket.socket);
  const channel = useSelector((state) => state.channel.channel);
  const user = useSelector((state) => state.session.user);

  const [editedMessage, setEditedMessage] = useState(message.content);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userMessage, setUserMessage] = useState(false);

  const handleEdit = async (e) => {
    e.preventDefault();

    await dispatch(
      editMessageThunk(message.id, {
        content: editedMessage,
        edited: true,
      })
    );

    socket.emit("load_messages", { room: channel.id });
    setShowEditForm(false);
  };

  const handleDelete = () => {
    dispatch(deleteMessageThunk(messageId)).then(() =>
      socket.emit("load_messages", { room: channel.id })
    );
  };

  const editForm = (
    <form type="submit">
      <textarea
        type="text"
        value={editedMessage}
        onChange={(e) => setEditedMessage(e.target.value)}
      ></textarea>
      <button onClick={handleEdit}>Submit</button>
    </form>
  );

  return (
    <div
      className="channel-message-container"
      onMouseOver={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <div className="channel-message-top-content">
        <div className="channel-message-header">
          <div className="channel-message-name">
            {message.sender.firstName} {message.sender.lastName}
          </div>
          <div className="channel-message-date">
            {message.updatedAt.split(",")[0]}
          </div>
        </div>
        {message.senderId === user.id && showDropdown && (
          <div className="channel-message-options">
            {message.senderId === user.id && showEditForm && editForm}
            <div className="channel-message-btns">
              <button
                onClick={() => {
                  setShowEditForm(true);
                  setShowDropdown(false);
                }}
              >
                Edit
              </button>

              <button className="delete-button" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
      {!showEditForm && (
        <div className="channel-message-content">
          {message.content ? message.content : message.msgData.Message.content}
        </div>
      )}
      {showEditForm && (
        <div className="chat-input">
          <ChatInputText
            userMessage={userMessage}
            setUserMessage={setUserMessage}
          />
        </div>
      )}
    </div>
  );
};

export default ChannelMessage;
