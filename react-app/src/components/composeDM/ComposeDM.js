import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { createDMMessageThunk } from "../../store/channelMessages";
import { createDirectMessageThunk } from "../../store/directMessages";
import DirectMessageChat from "../DirectMessageChat/DirectMessageChat";
import ChatInputText from "../ChatInputText/ChatInputText";

const ComposeDM = () => {
  const { workspaceId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const sessionUser = useSelector((state) => state.session.user);
  const users = useSelector((state) => state.workspace.workspace.users);
  const directMessages = useSelector(
    (state) => state.directMessages.directMessagesList
  );
  const socket = useSelector((state) => state.socket.socket);

  const [name, setName] = useState("");
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [existingDirectMessage, setExistingDirectMessage] = useState(null);
  const [userMessage, setUserMessage] = useState("");

  const handleChatsend = async (e) => {
    e.preventDefault();
    console.log("SELEECTED ", selected, selected[0].id, workspaceId);
    let { DirectMessage: directMessage } = await dispatch(
      createDirectMessageThunk(workspaceId, {
        workspace_id: workspaceId,
        recipient: selected[0].id,
      })
    );
    let newMessage;
    console.log("NEW DM ", directMessage);
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

    // socket.emit("chat", {
    //   msgData: newMessage,
    //   user: sessionUser,
    //   room: `DM${directMessage.id}`,
    // });
    history.push(`/workspaces/${workspaceId}/dms/${directMessage.id}`);
  };

  useEffect(() => {
    console.log("USE EFFEFCT");
    setOptions([]);
    if (users && users.Users) {
      console.log("USERR ", users);
      for (let user of users.Users) {
        if (user.id === sessionUser.id) continue;
        const userName = user.firstName + " " + user.lastName;
        if (userName.toLowerCase().includes(name)) {
          console.log("USER NAME MATCHES ", userName);
          setOptions((state) => [...state, user]);
          console.log("OPTIONS ", options);
        }
      }
    }
  }, [name]);

  useEffect(() => {
    for (let dm of Object.values(directMessages)) {
      console.log("DM ", dm, selected);
      selected.forEach((user) => {
        console.log("SELECTED ", user);
        if (dm.users[user.id]) {
          console.log("DM ", dm);
          setExistingDirectMessage(dm);
        }
      });
    }
  }, [selected]);

  return (
    <div>
      <div>New Message</div>
      <div>
        {selected.length &&
          selected.map((user, idx) => (
            <div key={idx}>
              {user.firstName} {user.lastName}
            </div>
          ))}
      </div>
      {!selected.length && (
        <div>
          To:{" "}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      )}

      {!selected.length && (
        <div>
          {options.length &&
            options.map((user, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelected((prevState) => [...prevState, user]);
                  setOptions([]);
                }}
              >
                {user.firstName} {user.lastName}
              </div>
            ))}
        </div>
      )}
      <div>
        {existingDirectMessage && (
          <DirectMessageChat directMessageIdProp={existingDirectMessage.id} />
        )}
        {!existingDirectMessage && (
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
        )}
      </div>
    </div>
  );
};

export default ComposeDM;
