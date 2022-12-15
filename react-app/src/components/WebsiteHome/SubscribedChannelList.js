import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  loadChannelThunk,
  loadSubbedChannelsThunk,
} from "../../store/channels";
import "./SubscribedChannelList.css";
import AddChannelsDropdown from "../AddChannels/AddChannelsDropdown";

const SubscribedChannelList = () => {
  const dispatch = useDispatch();
  let history = useHistory();

  const [isLoaded, setIsLoaded] = useState(false);
  const [showDropDown, setShowDropDown] = useState(true);
  const [showCreateDropDown, setShowCreateDropDown] = useState(false);

  const channels = useSelector((state) => state.channel.subscribed);
  const currChannel = useSelector((state) => state.channel.channel);
  const workspace = useSelector((state) => state.workspace.workspace);

  useEffect(async () => {
    await dispatch(loadSubbedChannelsThunk(workspace.id));
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return null;
  return (
    <div className="subbed-channels-container">
      <div
        className="subbed-channels-btn subscription-padding pointer hover"
        onClick={() => setShowDropDown(!showDropDown)}
      >
        <span className="subbed-channels-title">Channels</span>
      </div>
      {showDropDown && (
        <div className="subbed-channel-list">
          {Object.values(channels).map((channel, idx) => (
            <div
              className={`subbed-channel-individual-container hover pointer subscription-padding ${
                currChannel && currChannel.id === channel.id
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
              <div className="hashtag-icon">
                <i class="fa-solid fa-hashtag"></i>
              </div>
              <div className="subbed-channel-individual">{channel.name}</div>
            </div>
          ))}
        </div>
      )}
      <div
        className="add-channel-container hover subscription-padding pointer"
        onClick={() => setShowCreateDropDown(!showCreateDropDown)}
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
    </div>
  );
};

export default SubscribedChannelList;
