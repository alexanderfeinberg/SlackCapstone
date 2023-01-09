import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  loadChannelThunk,
  loadSubbedChannelsThunk,
} from "../../store/channels";
import "./SubscribedChannelList.css";
import AddChannelsDropdown from "../AddChannels/AddChannelsDropdown";
import DirectMessageList from "../DirectMessageList/DirectMessageList";
import CaretIcon from "../CaretIcon/CaretIcon";

const SubscribedChannelList = () => {
  console.log("SUBSCRIBED CHANNEL LIST");
  const dispatch = useDispatch();
  let history = useHistory();

  const [isLoaded, setIsLoaded] = useState(false);
  const [showDropDown, setShowDropDown] = useState(true);
  const [showCreateDropDown, setShowCreateDropDown] = useState(false);
  const [currentChat, setCurrentChat] = useState(false);

  const channels = useSelector((state) => state.channel.subscribed);
  const currChannel = useSelector((state) => state.channel.channel);
  const workspace = useSelector((state) => state.workspace.workspace);
  let chat = useSelector((state) => state.socket.room);

  const closeDropDown = (e) => {
    console.log("EEEEE ", e.path[0].className);
    if (
      e.path[0].className !== "add-channel-text" &&
      e.path[0].className !==
        "add-channel-container hover subscription-padding pointer"
    )
      setShowCreateDropDown(false);
  };

  useEffect(async () => {
    await dispatch(loadSubbedChannelsThunk(workspace.id));
    setIsLoaded(true);
    document.body.addEventListener("click", closeDropDown);

    return () => document.body.removeEventListener("click", closeDropDown);
  }, []);

  useEffect(() => {
    if (chat && chat.chatObject) setCurrentChat(chat.chatObject);
  }, [chat]);

  if (!isLoaded) return null;
  return (
    <div className="subbed-channels-container">
      <div
        className="subbed-channels-btn subscription-padding pointer hover"
        onClick={() => setShowDropDown(!showDropDown)}
      >
        <CaretIcon state={showDropDown} />
        <span className="subbed-channels-title">Channels</span>
      </div>
      {showDropDown && (
        <div className="subbed-channel-list">
          {Object.values(channels).map((channel, idx) => (
            <div
              className={`subbed-channel-individual-container hover pointer subscription-padding ${
                currentChat &&
                currentChat.type === "channel" &&
                currentChat.id == channel.id
                  ? "active-channel"
                  : ""
              }`}
              key={idx}
              onClick={async () => {
                await dispatch(loadChannelThunk(channel.id));
                history.push(
                  `/workspaces/${workspace.id}/channels/${channel.id}`
                );
              }}
            >
              <div className="hashtag-icon hashtag-thin">
                <i class="fa-regular fa-hashtag fa-sm"></i>
              </div>
              <div className="subbed-channel-individual">{channel.name}</div>
            </div>
          ))}
        </div>
      )}
      <div
        className="add-channel-container hover subscription-padding pointer"
        onClick={() => setShowCreateDropDown((prev) => !prev)}
      >
        <div className="hashtag-icon">
          <i class="fa-solid fa-plus"></i>
        </div>
        <div className="add-channel-text">Add channels</div>
      </div>
      <div className="container-bottom">
        {showCreateDropDown && (
          <div className="drop-down-container">
            <AddChannelsDropdown
              setShowCreateDropDown={setShowCreateDropDown}
            />
          </div>
        )}
      </div>
      <div>
        <DirectMessageList />
      </div>
    </div>
  );
};

export default SubscribedChannelList;
