import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  loadChannelThunk,
  loadSubbedChannelsThunk,
} from "../../store/channels";
import "./SubscribedChannelList.css";

const SubscribedChannelList = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDropDown, setShowDropDown] = useState(true);
  const channels = useSelector((state) => state.channel.subscribed);
  const workspace = useSelector((state) => state.workspace.workspace);
  let history = useHistory();

  useEffect(async () => {
    await dispatch(loadSubbedChannelsThunk(workspace.id));
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return null;
  return (
    <div className="subbed-channels-container">
      <div className="subbed-channels-btn pointer">
        <span
          className="subbed-channels-title "
          onClick={() => setShowDropDown(!showDropDown)}
        >
          Channels
        </span>
      </div>
      {showDropDown && (
        <div className="subbed-channel-list">
          {Object.values(channels).map((channel, idx) => (
            <div
              className="subbed-channel-individual-container hover pointer"
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
      <a href={`/workspaces/${workspace.id}/allChannels`}>Browse Channels</a>
    </div>
  );
};

export default SubscribedChannelList;
