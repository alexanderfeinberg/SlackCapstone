import { useSelector } from "react-redux";
import { ModalContext } from "../../../context/Modal";
import { useContext } from "react";
import "./WorkspaceDropdown.css";

const WorkspaceDropdown = () => {
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
      <div
        className="workspace-item workspace-dropdown-header"
        onClick={editWorkspaceHandler}
      >
        <div className="workspace-dropdown-title">{workspace.name}</div>
        <div className="workspace-dropdown-url">{workspace.url}</div>
      </div>
      <div className="workspace-item" onClick={createChannelHandler}>
        <div className="workspace-item-text">Create a channel</div>
      </div>
      <div className="workspace-item">
        <div className="workspace-item-text">Create a Add workspaces</div>
      </div>
      <div className="workspace-item">
        <div className="workspace-item-text">Switch workspaces</div>
      </div>
    </div>
  );
};

export default WorkspaceDropdown;
