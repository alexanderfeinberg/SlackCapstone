import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadChannelListThunk } from "../../../store/channels";
import Channel from "../channel";
import ChannelListItem from "./ChannelListItem.js";

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

  const handleCreateSub = () => {};

  if (!isLoaded) return null;

  return (
    <div className="all-channels-container">
      <div chassName="all-channels-list">
        {Object.values(channels).map((channel, idx) => (
          <div className="all-channel-list-item-container" key={idx}>
            <ChannelListItem channelId={channel.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllChannels;
