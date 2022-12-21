import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { loadDirectMessagesThunk } from "../../store/directMessages";
import { useHistory } from "react-router-dom";

const DirectMessageList = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [isLoaded, setIsLoaded] = useState(false);
  const [currentChat, setCurrentChat] = useState(false);
  console.log("CURR CHAT ", currentChat);

  const directMessages = useSelector(
    (state) => state.directMessages.directMessagesList
  );
  const workspace = useSelector((state) => state.workspace.workspace);
  let chat = useSelector((state) => state.socket.room);
  console.log("CURRENT CHAT ", currentChat);

  console.log(directMessages);

  useEffect(() => {
    (async () => {
      await dispatch(loadDirectMessagesThunk());
      setIsLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (chat && chat.chatObject) {
      setCurrentChat(chat.chatObject);
    }
  }, [chat]);

  if (!isLoaded) return null;

  return (
    <div>
      <div>Direct Messages</div>
      <div className="dm-list">
        {Object.values(directMessages).map((dm, idx) => (
          <div
            className={`dm-listing ${
              currentChat &&
              currentChat.type === "directMessage" &&
              currentChat.id === dm.id
                ? "active-channel"
                : ""
            }`}
            key={idx}
            onClick={() =>
              history.push(`/workspaces/${workspace.id}/dms/${dm.id}`)
            }
          >
            {dm.id}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DirectMessageList;
