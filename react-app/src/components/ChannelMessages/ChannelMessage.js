import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  editMessageThunk,
  deleteMessageThunk,
} from "../../store/channelMessages";
import "./ChannelMessages.css";

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
    <div className="channel-message-container">
      <div className="channel-message-header">
        <div className="channel-message-name">
          {message.sender.firstName} {message.sender.lastName}
        </div>
        <div className="channel-message-date">
          {message.updatedAt.split(",")[0]}
        </div>
      </div>
      <div className="channel-message-content">
        {message.content ? message.content : message.msgData.Message.content}
      </div>
      <div>
        {showEditForm && editForm}
        {message.senderId === user.id && (
          <button onClick={() => setShowEditForm(true)}>Edit</button>
        )}
        {message.senderId === user.id && (
          <button onClick={handleDelete}>Delete</button>
        )}
      </div>
    </div>
  );
};

export default ChannelMessage;
