import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import {
  removeChannelSubThunk,
  createChannelSubThunk,
} from "../../../../store/channels";
import "./ChannelListItem.css";

const ChannelListItem = ({ channelId }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const channel = useSelector((state) => state.channel.channelList[channelId]);
  const workspace = useSelector((state) => state.workspace.workspace);
  const user = useSelector((state) => state.session.user);

  const [isLoaded, setIsLoaded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  useEffect(() => {
    if (channel && user) {
      setIsLoaded(true);
    }
  }, [channel, user]);

  const handleCreateSub = async () => {
    await dispatch(createChannelSubThunk(channel.id, user.id));
    history.push(`/workspaces/${workspace.id}/channels/${channelId}`);
  };

  const handleRemoveSub = async () => {
    await dispatch(removeChannelSubThunk(channel.id));
  };

  if (!isLoaded) return null;
  return (
    <div
      className="channel-list-item"
      onMouseOver={() => {
        setShowButton(true);
      }}
      onMouseLeave={() => setShowButton(false)}
      // onClick={() =>
      //   history.push(`/workspaces/${workspace.id}/channels/${channel.id}`)
      // }
    >
      <div className="all-channel-list-content">
        <div className="all-channel-list-item-header">
          <div className="chat-header-icon">
            <i class="fa-regular fa-hashtag"></i>
          </div>
          {channel.name}
        </div>
        <div className="all-channel-list-item-subheader">
          {channel.currentUserSubscribed && (
            <>
              <div className="channel-joined-check">Joined</div>
              <div className="dot-seperator">·</div>
            </>
          )}
          <div className="channel-user-count">{channel.userCount} members</div>
          <div className="dot-seperator">·</div>
          <div className="channel-description">{channel.description}</div>
        </div>
      </div>
      <div className="channel-list-action-btns">
        {!channel.currentUserSubscribed && showButton && (
          <button className="subscribe-btn" onClick={handleCreateSub}>
            Join
          </button>
        )}
        {channel.currentUserSubscribed && showButton && (
          <button className="leave-btn" onClick={handleRemoveSub}>
            Leave
          </button>
        )}
      </div>
    </div>
  );
};

export default ChannelListItem;
