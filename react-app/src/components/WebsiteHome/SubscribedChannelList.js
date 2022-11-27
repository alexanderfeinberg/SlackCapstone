import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  loadChannelThunk,
  loadSubbedChannelsThunk,
} from "../../store/channels";

const SubscribedChannelList = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const channels = useSelector((state) => state.channel.subscribed);
  const workspace = useSelector((state) => state.workspace.workspace);
  let history = useHistory();

  useEffect(async () => {
    await dispatch(loadSubbedChannelsThunk(workspace.id));
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return null;
  return (
    <div>
      <ul>
        {Object.values(channels).map((channel, idx) => (
          <li key={idx}>
            <a
              onClick={async () => {
                await dispatch(loadChannelThunk(channel.id));
                history.push(
                  `/workspaces/${workspace.id}/channels/${channel.id}`
                );
              }}
            >
              {channel.name}
            </a>
          </li>
        ))}
      </ul>
      <a href={`/workspaces/${workspace.id}/allChannels`}>Browse Channels</a>
    </div>
  );
};

export default SubscribedChannelList;
