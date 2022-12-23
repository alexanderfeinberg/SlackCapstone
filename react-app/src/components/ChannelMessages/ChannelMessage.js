import { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  editMessageThunk,
  deleteMessageThunk,
} from "../../store/channelMessages";
import "./ChannelMessages.css";
import ChatInputText from "../ChatInputText/ChatInputText";
import { EditFormContext } from "../../context/EditForm";

const ChannelMessage = ({ messageId }) => {
  const dispatch = useDispatch();

  const message = useSelector(
    (state) => state.channelMessage.messages[messageId]
  );
  const socket = useSelector((state) => state.socket.socket);
  const channel = useSelector((state) => state.channel.channel);
  const user = useSelector((state) => state.session.user);
  const currentRoom = useSelector((state) => state.socket.room.name);

  const [editedMessage, setEditedMessage] = useState(message.content);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState([]);

  const { editFormOpen, setEditFormOpen } = useContext(EditFormContext);
  console.log("EDIT FORM OPEN ", editFormOpen);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        editMessageThunk(message.id, {
          content: editedMessage,
          edited: true,
        })
      );
    } catch (e) {
      const errData = await e.json();
      setErrors(errData.errors);
      return;
    }

    socket.emit("load_messages", { room: currentRoom });
    setShowEditForm(false);
    setEditFormOpen(false);
  };

  const handleDelete = () => {
    dispatch(deleteMessageThunk(messageId)).then(() =>
      socket.emit("load_messages", { room: currentRoom })
    );
  };

  const editForm = (
    <form type="submit" onSubmit={handleEdit}>
      <div className="chat-input">
        <ChatInputText
          userMessage={editedMessage}
          setUserMessage={setEditedMessage}
          errors={errors}
        />
        <button
          type="button"
          onClick={() => {
            setEditedMessage(message.content);
            setShowEditForm(false);
            setShowDropdown(false);
            setEditFormOpen(false);
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`${
            editedMessage !== message.content && editedMessage.length < 500
              ? "green"
              : ""
          }`}
          disabled={
            editedMessage !== message.content && editedMessage.length < 500
              ? false
              : true
          }
        >
          Save
        </button>
      </div>
    </form>
  );

  useEffect(() => {
    setShowEditForm(false);
    setEditFormOpen(false);
  }, [messageId]);

  useEffect(() => {
    setEditedMessage(message.content);
  }, [message]);

  useEffect(() => {
    if (editFormOpen !== messageId) {
      setShowEditForm(false);
    }
  }, [editFormOpen]);

  useEffect(() => {
    setErrors([]);
  }, [editedMessage]);

  return (
    <div
      className="channel-message-container"
      onMouseOver={() => {
        if (!showEditForm) setShowDropdown(true);
      }}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <div className="message-profile-pic">
        <img src={message.sender.profilePicture} />
      </div>
      <div className="message-content">
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
              <div className="channel-message-btns">
                <button
                  onClick={() => {
                    setShowEditForm(true);
                    setShowDropdown(false);
                    setEditFormOpen(messageId);
                  }}
                >
                  <i class="fa-solid fa-pen"></i>
                </button>

                <button className="delete-button" onClick={handleDelete}>
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          )}
        </div>
        {!showEditForm && (
          <div className="channel-message-content">
            {message.content
              ? message.content
              : message.msgData.Message.content}
            {message.edited && (
              <div className="message-is-edited">(edited)</div>
            )}
          </div>
        )}
        {editFormOpen === messageId && editForm}
      </div>
    </div>
  );
};

export default ChannelMessage;
