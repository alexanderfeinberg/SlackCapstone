import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ChannelMessage = ({ message }) => {
  console.log("DISPLAYTING MESSAGE ", message);
  const [messageContent, setMessageContent] = useState(
    message.msg ? message.msg : message.content
  );
  const [editedMessage, setEditedMessage] = useState(message.msg);
  const [showEditForm, setShowEditForm] = useState(false);

  const handleEdit = (e) => {
    e.preventDefault();
    setMessageContent(editedMessage);
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
      {messageContent}
      {/* <div>
        {showEditForm && editForm}
        <button onClick={() => setShowEditForm(true)}>Edit</button> */}
      {/* </div> */}
    </div>
  );
};

export default ChannelMessage;
