import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadSubbedWorkspacesThunk } from "../../store/workspaces";
import SubscribedChannelList from "./SubscribedChannelList";

const WorkspaceList = () => {
  const dispatch = useDispatch();

  const workspaces = useSelector((state) => state.workspace.subscribed);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(loadSubbedWorkspacesThunk()).then(() => setIsLoaded(true));
  }, []);

  if (!isLoaded) return null;
  return (
    <div className="workspace-list-container">
      <div className="workplace-list">
        {Object.values(workspaces).map((workspace, idx) => (
          <div className="workplace-individual" key={idx}>
            {workspace.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkspaceList;
