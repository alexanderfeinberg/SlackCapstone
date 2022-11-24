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
    <div>
      <ul>
        {Object.values(workspaces).map((workspace, idx) => (
          <li key={idx}>{workspace.name}</li>
        ))}
      </ul>
      <SubscribedChannelList workspaceId={workspaces["1"].id} />
    </div>
  );
};

export default WorkspaceList;
