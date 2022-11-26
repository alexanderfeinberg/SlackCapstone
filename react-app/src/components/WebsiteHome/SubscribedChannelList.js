import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadChannelThunk,
  loadSubbedChannelsThunk,
} from "../../store/channels";

const SubscribedChannelList = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const channels = useSelector((state) => state.channel.subscribed);
  const workspace = useSelector((state) => state.workspace.workspace);

  useEffect(async () => {
    await dispatch(loadSubbedChannelsThunk(workspace.id));
    setIsLoaded(true);
  }, []);

  useEffect(async () => {
    if (Object.values(channels).length) {
      await dispatch(loadChannelThunk(Object.values(channels)[0].id));
    }
  }, [isLoaded]);

  if (!isLoaded) return null;
  return (
    <div>
      <ul>
        {Object.values(channels).map((channel, idx) => (
          <li key={idx}>
            <a href={`/channels/${channel.id}`}>{channel.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubscribedChannelList;
