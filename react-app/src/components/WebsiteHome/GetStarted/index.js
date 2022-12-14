import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { loadSubbedWorkspacesThunk } from "../../../store/workspaces";

const GetStarted = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [isLoaded, setIsLoaded] = useState(false);

  const user = useSelector((state) => state.session.user);
  const workspaces = useSelector((state) => state.workspace.subscribed);

  useEffect(async () => {
    if (!Object.keys(workspaces).length)
      await dispatch(loadSubbedWorkspacesThunk());
    setIsLoaded(true);
  }, [user, workspaces]);

  if (!isLoaded) return null;

  return (
    <div>
      <h1>Welcome back</h1>
      <div>Workspaces for {user.email}</div>
      <div>
        {Object.values(workspaces).map((workspace, idx) => (
          <div key={idx}>{workspace.name}</div>
        ))}
      </div>
      <button onClick={() => history.push("/setup-team-name")}>
        Crate a new workspace
      </button>
    </div>
  );
};

export default GetStarted;
