import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { loadSubbedWorkspacesThunk } from "../../../store/workspaces";

import "./GetStarted.css";

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
    <div className="get-started-root">
      <div className="get-started-container">
        <div className="get-started-header">
          <div className="get-started-header-img">
            <img src="https://a.slack-edge.com/6c404/marketing/img/homepage/bold-existing-users/waving-hand.gif" />
          </div>
          <div className="get-started-header-text">
            <h1>Welcome back</h1>
          </div>
        </div>
        <div className="subscribed-workspace-list-container">
          <div className="workspace-list-meta">Workspaces for {user.email}</div>
          <div className="workspace-list-items">
            {Object.values(workspaces).map((workspace, idx) => (
              <div className="workspace-list-item" key={idx}>
                <div className="workspace-info">
                  <div className="workspace-name">{workspace.name}</div>
                  <div className="workspace-member-count">
                    {workspace.userCount} Members
                  </div>
                </div>
                <div className="workspace-action-btn">
                  <button
                    onClick={() => history.push(`/workspaces/${workspace.id}`)}
                  >
                    Launch Transmit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="create-new-workspace-container">
          <div className="left-content">
            <div className="holder-img">
              <img src="data:image/png;base64,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" />
            </div>
            <div className="new-workspace-slogan">
              Want to use Transmit with a different team?
            </div>
          </div>
          <div className="right-content">
            <button onClick={() => history.push("/setup-team-name")}>
              Create a new workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
