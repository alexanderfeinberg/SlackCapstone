import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import {
  removeChannelSubThunk,
  createChannelSubThunk,
} from "../../../../store/channels";

const ChannelListItem = ({ channelId }) => {
  const dispatch = useDispatch();

  const channel = useSelector((state) => state.channel.channelList[channelId]);
  const user = useSelector((state) => state.session.user);

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (channel && user) {
      setIsLoaded(true);
    }
  }, [channel, user]);

  const handleCreateSub = async () => {
    await dispatch(createChannelSubThunk(channel.id, user.id));
  };

  const handleRemoveSub = async () => {
    await dispatch(removeChannelSubThunk(channel.id));
  };

  if (!isLoaded) return null;
  return (
    <div className="channel-list-item">
      <div className="all-channel-list-item-header">{channel.name}</div>
      <div className="all-channel-list-item-subheader">
        {channel.currentUserSubscribed && (
          <div className="channel-joined-check">Joined</div>
        )}
        <div className="channel-user-count">{channel.userCount} members</div>

        <div className="channel-description">{channel.description}</div>
      </div>
      <div className="channel-list-action-btns">
        {!channel.currentUserSubscribed && (
          <button className="subscribe-btn" onClick={handleCreateSub}>
            Join
          </button>
        )}
        {channel.currentUserSubscribed && (
          <button className="leave-btn" onClick={handleRemoveSub}>
            Leave
          </button>
        )}
      </div>
    </div>
  );
};

export default ChannelListItem;
