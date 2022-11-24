import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSubbedChannelsThunk } from "../../store/channels";

const SubscribedChannelList = ({ workspaceId }) => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const channels = useSelector((state) => state.channel.subscribed);

  useEffect(() => {
    dispatch(loadSubbedChannelsThunk(workspaceId)).then(() =>
      setIsLoaded(true)
    );
  }, []);

  if (!isLoaded) return null;
  return (
    <div>
      <ul>
        {Object.values(channels).map((channel, idx) => (
          <li key={idx}>{channel.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SubscribedChannelList;
