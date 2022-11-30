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

  const [editedMessage, setEditedMessage] = useState(message.content);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { editFormOpen, setEditFormOpen } = useContext(EditFormContext);
  console.log("EDIT FORM OPEN ", editFormOpen);

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
    setEditFormOpen(false);
  };

  const handleDelete = () => {
    dispatch(deleteMessageThunk(messageId)).then(() =>
      socket.emit("load_messages", { room: channel.id })
    );
  };

  const editForm = (
    <form type="submit" onSubmit={handleEdit}>
      <div className="chat-input">
        <ChatInputText
          userMessage={editedMessage}
          setUserMessage={setEditedMessage}
        />
        <button
          onClick={() => {
            setEditedMessage(message.content);
            setShowEditForm(false);
            setShowDropdown(false);
          }}
        >
          Cancel
        </button>
        <button type="submit">Save</button>
      </div>
    </form>
  );

  useEffect(() => {
    setShowEditForm(false);
    setEditFormOpen(false);
  }, [messageId]);

  useEffect(() => {
    if (editFormOpen !== messageId) {
      setShowEditForm(false);
    }
  }, [editFormOpen]);

  return (
    <div
      className="channel-message-container"
      onMouseOver={() => {
        if (!showEditForm) setShowDropdown(true);
      }}
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
            <div className="channel-message-btns">
              <button
                onClick={() => {
                  setShowEditForm(true);
                  setShowDropdown(false);
                  setEditFormOpen(messageId);
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
      {editFormOpen === messageId && editForm}
    </div>
  );
};

export default ChannelMessage;
