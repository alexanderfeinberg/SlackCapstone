import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

const EditWorkspace = () => {
  const dispatch = useDispatch();
  const workspace = useSelector((state) => state.workspace.workspace);
  const [isLoaded, setIsLoaded] = useState(false);

  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceURL, setWorkspaceURL] = useState("");
  const [disableSubmit, setDisableSubmit] = useState(true);

  useEffect(() => {
    if (workspace) {
      setIsLoaded(true);
      setWorkspaceName(workspace.name);
      setWorkspaceURL(workspace.url);
    }
  }, [workspace]);

  useEffect(() => {
    setDisableSubmit(disableHandler());
  }, [workspaceName, workspaceURL]);

  const disableHandler = () => {
    if (workspaceName === workspace.name && workspaceURL === workspace.url) {
      return true;
    }
    return false;
  };

  if (!isLoaded) return null;

  return (
    <div id="modal-content">
      <div className="modal-sub-content">
        <div className="modal-title">Edit workspace details</div>
        <div className="modal-subtitle">
          Add a name to represent your company or organization. This name will
          also be shown to other organizations that you work with using Slack.
        </div>
      </div>
      <div className="modal-content-items">
        <div className="errors"></div>
        <form>
          <div className="modal-content-item">
            <div className="modal-content-item-header">Workspace name</div>
            <div id="workspace-edit-name" className="action-edit-input">
              <input
                type="text"
                palceholder={workspaceName}
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              ></input>
            </div>
          </div>
          <div className="modal-content-item">
            <div className="modal-content-item-header">URL</div>
            <div className="action-edit-input">
              <input
                type="text"
                value={workspaceURL}
                onChange={(e) => setWorkspaceURL(e.target.value)}
              ></input>
            </div>
          </div>
        </form>
      </div>
      <div className="cancel-btn">
        <button>Cancel</button>
      </div>
      <div className="submit-btn">
        <button type="submit" disabled={disableSubmit}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditWorkspace;
