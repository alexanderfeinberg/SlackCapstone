import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadChannelListThunk } from "../../../store/channels";
const AllChannels = ({ workspace }) => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const channels = useSelector((state) => state.channel.channelList);

  useEffect(() => {
    (async () => {
      await dispatch(loadChannelListThunk(workspace.id));
      setIsLoaded(true);
    })();
    return () => console.log("ALL CHANNELS CLEAN UP");
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

export default AllChannels;
