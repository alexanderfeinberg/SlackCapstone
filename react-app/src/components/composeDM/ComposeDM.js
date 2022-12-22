import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { createDMMessageThunk } from "../../store/channelMessages";
import { createDirectMessageThunk } from "../../store/directMessages";
import DirectMessageChat from "../DirectMessageChat/DirectMessageChat";
import ChatInputText from "../ChatInputText/ChatInputText";
import "./ComposeDM.css";

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

    let { DirectMessage: directMessage } = await dispatch(
      createDirectMessageThunk(workspaceId, {
        workspace_id: workspaceId,
        recipient: selected[0].id,
      })
    );

    let newMessage;

    socket.emit("incoming_dm", {
      room: `User${selected[0].id}`,
      directMessage: directMessage,
    });

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
    if (users && users.Users && name.length > 0) {
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
    if (!selected.length) setExistingDirectMessage(null);
    for (let dm of Object.values(directMessages)) {
      console.log("DM ", dm, selected);
      selected.forEach((user) => {
        console.log("SELECTED ", user);
        if (dm.users[user.id]) {
          setExistingDirectMessage(dm);
        }
      });
    }
  }, [selected]);

  return (
    <div className="compose-dm-container">
      <div className="compose-header">New Message</div>

      <div className="compose-input" id="compose-input">
        <div className="input-text">To: </div>
        <div className="compose-selected">
          {selected.length > 0 &&
            selected.map((user, idx) => (
              <div className="selected-result-container" key={idx}>
                {user.firstName} {user.lastName}
                <div
                  className="remove-selected"
                  onClick={() => setSelected([])}
                >
                  X
                </div>
              </div>
            ))}
        </div>
        {selected.length < 1 && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="#channel or @person"
          />
        )}
      </div>

      {!selected.length && name.length > 0 && (
        <div className="search-results-container">
          <div className="compose-search-results">
            {options.length > 0 &&
              options.map((user, idx) => (
                <div
                  className="search-result-listing"
                  key={idx}
                  onClick={() => {
                    setSelected((prevState) => [...prevState, user]);
                    setOptions([]);
                    setName("");
                  }}
                >
                  <div className="search-result-name">
                    {user.firstName} {user.lastName}
                  </div>
                </div>
              ))}
            {options.length < 1 && (
              <div className="compose-no-search-results">No results..</div>
            )}
          </div>
        </div>
      )}
      <div className="compose-chat-container">
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
