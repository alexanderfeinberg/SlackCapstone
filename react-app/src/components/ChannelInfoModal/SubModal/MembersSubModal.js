import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getChannelUsers } from "../../../store/channels";

const MembersSubModal = () => {
  const [users, setUsers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const channel = useSelector((state) => state.channel.channel);
  const onlineUsers = useSelector((state) => state.online.online);

  useEffect(async () => {
    console.log("RE-RENDER MEMBERS MODAL");
    if (channel) {
      const resp = await getChannelUsers(channel.id);
      setUsers(resp.Users);
      setIsLoaded(true);
    }
  }, [channel, onlineUsers]);

  if (!isLoaded) return null;
  return (
    <div className="members-submodal-container">
      <div className="members-list">
        {users.map((user, idx) => (
          <div className="member-container" key={idx}>
            <img className="member-profile-pic" src={user.profilePicture} />
            <div className="member-full-name">
              {user.firstName} {user.lastName}
            </div>
            {onlineUsers[user.id] && (
              <img
                className="is-online"
                src="https://miro.medium.com/max/512/1*nZ9VwHTLxAfNCuCjYAkajg.png"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default MembersSubModal;
