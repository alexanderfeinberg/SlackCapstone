import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";

const AddChannelsDropdown = ({ setShowCreateDropDown }) => {
  const history = useHistory();
  const workspace = useSelector((state) => state.workspace.workspace);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (workspace) setIsLoaded(true);
  }, [workspace]);

  if (!isLoaded) return null;
  return (
    <div className="add-channels-dropdown">
      <div className="create-channel-btn">
        <button>Create a new channel</button>
      </div>
      <div className="browse-channels-btn">
        <button
          onClick={() => {
            history.push(`/workspaces/${workspace.id}/allChannels`);
            setShowCreateDropDown(false);
          }}
        >
          Browse channels
        </button>
      </div>
    </div>
  );
};

export default AddChannelsDropdown;
