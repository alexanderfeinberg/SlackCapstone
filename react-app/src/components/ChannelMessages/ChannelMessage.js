import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  editMessageThunk,
  deleteMessageThunk,
} from "../../store/channelMessages";

const ChannelMessage = ({ messageId }) => {
  const dispatch = useDispatch();
  console.log("DISPLAYTING MESSAGE ", messageId);
  const message = useSelector(
    (state) => state.channelMessage.messages[messageId]
  );

  const [editedMessage, setEditedMessage] = useState(
    message.content ? message.content : message.msgData.Message.content
  );
  const [showEditForm, setShowEditForm] = useState(false);
  const socket = useSelector((state) => state.socket.socket);
  const channel = useSelector((state) => state.channel.channel);
  const user = useSelector((state) => state.session.user);

  const handleEdit = async (e) => {
    e.preventDefault();
    console.log("HANDLING EDIT ", message);
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
    <div>
      <div>
        {message.sender.firstName} {message.sender.lastName}
      </div>
      {message.content ? message.content : message.msgData.Message.content}
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
