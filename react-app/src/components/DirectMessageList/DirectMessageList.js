import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  loadDirectMessagesThunk,
  removeIncoming,
} from "../../store/directMessages";
import { useHistory } from "react-router-dom";
import "./DirectMessageList.css";
import CaretIcon from "../CaretIcon/CaretIcon";

const DirectMessageList = () => {
  console.log("DM LIST RERENDER");
  const dispatch = useDispatch();
  const history = useHistory();

  const [isLoaded, setIsLoaded] = useState(false);
  const [currentChat, setCurrentChat] = useState(false);
  const [showDropdown, setShowDropdown] = useState(true);
  const [recipients, setRecipients] = useState({});

  console.log("CURR CHAT ", currentChat);

  const directMessages = useSelector(
    (state) => state.directMessages.directMessagesList
  );
  const workspace = useSelector((state) => state.workspace.workspace);
  let chat = useSelector((state) => state.socket.room);
  const sessionUser = useSelector((state) => state.session.user);
  console.log("CURRENT CHAT ", currentChat);

  console.log(directMessages);

  useEffect(() => {
    console.log("DM LIST USE EFFECT");
    setIsLoaded(false);
    (async () => {
      await dispatch(loadDirectMessagesThunk());
      console.log("DIRECT MESSAGESS ", directMessages);
    })();
  }, []);

  useEffect(() => {
    if (chat && chat.chatObject) {
      setCurrentChat(chat.chatObject);
    }
  }, [chat]);

  useEffect(() => {
    setIsLoaded(false);
    console.log("RUNNING USE EFFECT");
    console.log("DM LEN ", Object.values(directMessages).length);
    if (Object.values(directMessages).length) {
      for (let dm of Object.values(directMessages)) {
        console.log("DMMMM ", dm);
        setRecipients((prevState) => {
          delete dm.users[sessionUser.id];
          const newState = { ...prevState, [dm.id]: dm.users };
          console.log("NEW STATE ", newState);
          return newState;
        });
      }
      console.log("RECIP HERE ", recipients);
      if (Object.values(recipients)) setIsLoaded(true);
    }
    console.log("RECEPIENTS ", recipients);
  }, [dispatch, directMessages]);

  if (!isLoaded) return null;

  return (
    <div className="direct-message-container">
      <div
        className="direct-message-btn hover subscription-padding"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <CaretIcon state={showDropdown} />
        Direct Messages
      </div>
      {showDropdown && (
        <div className="dm-list">
          {directMessages &&
            Object.values(directMessages).map((dm, idx) => (
              <div
                className={`dm-listing hover pointer subscription-padding ${
                  currentChat &&
                  currentChat.type === "directMessage" &&
                  currentChat.id === dm.id
                    ? "active-channel"
                    : ""
                }`}
                key={idx}
                onClick={() => {
                  dispatch(removeIncoming(dm.id));
                  history.push(`/workspaces/${workspace.id}/dms/${dm.id}`);
                }}
              >
                {recipients[dm.id] &&
                  Object.values(recipients[dm.id]).map((user, idx) => (
                    <div key={idx} className="dm-listing-info">
                      <img id="dm-profile-picture" src={user.profilePicture} />
                      {user.firstName} {user.lastName}
                    </div>
                  ))}
                {dm.incoming && <div className="incoming">New</div>}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DirectMessageList;
