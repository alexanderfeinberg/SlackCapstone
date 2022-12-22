import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { loadDirectMessageThunk } from "../../store/directMessages";
import {
  loadDMMessages,
  createDMMessageThunk,
} from "../../store/channelMessages";
import ChannelMessage from "../ChannelMessages/ChannelMessage";
import ChatInputText from "../ChatInputText/ChatInputText";
import { assignRoom } from "../../store/socket";
import "./DirectMessageChat.css";

const DirectMessageChat = ({ directMessageIdProp }) => {
  console.log("DM chat ", directMessageIdProp);
  const dispatch = useDispatch();

  const history = useHistory();
  const { workspaceId, directMessageId } = useParams();

  const [isLoaded, setIsLoaded] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [recipient, setRecipient] = useState("");

  const socket = useSelector((state) => state.socket.socket);
  const directMessage = useSelector(
    (state) => state.directMessages.directMessage
  );
  const sessionUser = useSelector((state) => state.session.user);
  const messages = useSelector((state) => state.channelMessage.messages);
  const onlineUsers = useSelector((state) => state.online.online);

  console.log("RECIPIENT ", recipient);

  useEffect(async () => {
    await dispatch(
      loadDirectMessageThunk(
        directMessageId ? directMessageId : directMessageIdProp
      )
    );
    await dispatch(
      loadDMMessages(directMessageId ? directMessageId : directMessageIdProp)
    );
  }, [dispatch, directMessageId, directMessageIdProp]);

  useEffect(() => {
    if (directMessage.id) {
      socket.on("load_messages", async (chat) => {
        await dispatch(loadDMMessages(directMessage.id));
      });
      socket.on("chat", async (chat) => {
        await dispatch(loadDMMessages(directMessage.id));
      });

      socket.emit("join", {
        user: sessionUser,
        room: `DM${directMessage.id}`,
      });
      socket.emit("load_messages", { room: `DM${directMessage.id}` });
      dispatch(assignRoom(`DM${directMessage.id}`, directMessage));

      setRecipient(findRecipient());
      setIsLoaded(true);
    }

    return () => {
      socket.emit("leave", {
        room: `DM${directMessage.id}`,
        user: sessionUser,
      });
      socket.off("load_messages");
      socket.off("chat");
    };
  }, [directMessage]);

  const handleChatsend = async (e) => {
    e.preventDefault();
    let newMessage;
    try {
      newMessage = await dispatch(
        createDMMessageThunk(directMessage.id, {
          content: userMessage,
          edited: false,
        })
      );
    } catch (e) {
      const eData = await e.json();
      console.log(eData);
    }

    socket.emit("chat", {
      msgData: newMessage,
      user: sessionUser,
      room: `DM${directMessage.id}`,
    });
    setUserMessage("");
    if (!directMessageId)
      history.push(`/workspaces/${workspaceId}/dms/${directMessage.id}`);
  };

  const findRecipient = () => {
    const [foundRecipient] = directMessage.users.filter(
      (user) => user.id !== sessionUser.id
    );
    if (onlineUsers[foundRecipient.id]) {
      foundRecipient.online = true;
    }
    return foundRecipient;
  };

  if (!isLoaded) return null;
  return (
    <div className="chat-container">
      {directMessageId && (
        <div className="header-container" id="chat-header">
          <div className="chat-header-title header">
            <div className="header-profile-pic">
              <img src={recipient.profilePicture} />
            </div>
            {recipient.firstName} {recipient.lastName}
            <div>
              {onlineUsers[recipient.id] && (
                <img
                  className="is-online"
                  src="https://miro.medium.com/max/512/1*nZ9VwHTLxAfNCuCjYAkajg.png"
                />
              )}
            </div>
          </div>
        </div>
      )}
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
            channelName={"test"}
          />
          <button
            onClick={handleChatsend}
            className={userMessage.length > 0 ? "green" : ""}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
export default DirectMessageChat;
