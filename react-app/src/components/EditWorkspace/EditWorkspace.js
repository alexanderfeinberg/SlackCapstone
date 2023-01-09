import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useContext } from "react";
import { editWorkspaceThunk } from "../../store/workspaces";
import { ModalContext } from "../../context/Modal";
import Errors from "../Errors/Errors";

import "./EditWorkspace.css";

const EditWorkspace = () => {
  const dispatch = useDispatch();
  const workspace = useSelector((state) => state.workspace.workspace);
  const [isLoaded, setIsLoaded] = useState(false);

  const { setModalType } = useContext(ModalContext);

  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceURL, setWorkspaceURL] = useState("");
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (workspace) {
      setIsLoaded(true);
      setWorkspaceName(workspace.name);
      setWorkspaceURL(workspace.url);
    }
  }, [workspace]);

  useEffect(() => {
    setDisableSubmit(disableHandler());
    setErrors([]);
  }, [workspaceName, workspaceURL]);

  const editWorkspaceHandler = async (e) => {
    e.preventDefault();
    console.log("WORKSPACE ", workspace);
    const newWorkspace = {
      ...workspace,
      name: workspaceName,
      url: workspaceURL,
    };
    try {
      const workspaceReturned = await dispatch(
        editWorkspaceThunk(workspace.id, newWorkspace)
      );
      setModalType(null);
    } catch (e) {
      const data = await e.json();
      setErrors([data.errors]);
      console.log(data);
    }
  };

  const disableHandler = () => {
    if (workspaceName === workspace.name && workspaceURL === workspace.url) {
      return true;
    }
    return false;
  };

  const closeModalHandler = () => {
    setModalType(null);
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
        {/* <div className="errors">
          {errors.map((err, idx) => (
            <div key={err}>{err}</div>
          ))}
        </div> */}
        {errors.length > 0 && <Errors errors={errors} />}
        <form onSubmit={editWorkspaceHandler}>
          <div className="modal-content-item">
            <div className="modal-content-item-header">Workspace name</div>
            <div id="workspace-edit-name" className="workspace-modal-input">
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
            <div className="workspace-modal-input">
              <input
                type="text"
                value={workspaceURL}
                onChange={(e) => setWorkspaceURL(e.target.value)}
              ></input>
            </div>
          </div>
          <div className="modal-btns">
            <div className="cancel-btn">
              <button type="button" onClick={closeModalHandler}>
                Cancel
              </button>
            </div>
            <div className="submit-btn">
              <button type="submit" disabled={disableSubmit}>
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWorkspace;
