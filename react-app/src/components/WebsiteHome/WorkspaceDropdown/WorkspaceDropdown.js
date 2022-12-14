import { useSelector } from "react-redux";
import { ModalContext } from "../../../context/Modal";
import { useContext, useState } from "react";
import AddWorkspaceDropdown from "./AddWorkspaceDropdown/AddWorkspaceDropdown";
import "./WorkspaceDropdown.css";

const WorkspaceDropdown = () => {
  const [addWorkspaceDropdown, setAddWorkspaceDropdown] = useState(false);

  const workspace = useSelector((state) => state.workspace.workspace);
  const { setModalType } = useContext(ModalContext);

  const createChannelHandler = () => {
    setModalType("createChannel");
  };

  const editWorkspaceHandler = () => {
    setModalType("editWorkspace");
  };

  return (
    <div className="workspace-dropdown-container">
      <div className="workspace-dropdown-content">
        <div
          className="workspace-item workspace-dropdown-header"
          onClick={editWorkspaceHandler}
        >
          <div className="item-text-content">
            <div className="workspace-dropdown-title">{workspace.name}</div>
            <div className="workspace-dropdown-url">{workspace.url}</div>
          </div>
        </div>
        <div className="workspace-item" onClick={createChannelHandler}>
          <div className="workspace-item-text">
            <div className="item-text-content">Create a channel</div>
          </div>
        </div>

        <div className="workspace-item item-section">
          <div
            className="workspace-item-text"
            onMouseOver={() => setAddWorkspaceDropdown(true)}
            onMouseLeave={() => setAddWorkspaceDropdown(false)}
          >
            {addWorkspaceDropdown && (
              <AddWorkspaceDropdown
                setAddWorkspaceDropdown={setAddWorkspaceDropdown}
              />
            )}
            <div className="item-text-content">Add workspaces</div>
          </div>
          <div className="workspace-item-text">
            <div className="item-text-content">Switch workspaces</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceDropdown;
