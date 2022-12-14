import "./AddWorkspaceDropdown.css";
import { useHistory } from "react-router-dom";

const AddWorkspaceDropdown = () => {
  console.log("Add workspace dropdown");
  const history = useHistory();

  return (
    <div className="add-workspace-dropdown-container">
      <div className="add-workspace-dropdown-item">
        <div
          className="item-content"
          onClick={() => history.push("/get-started")}
        >
          Sign in to another workspace
        </div>
      </div>
      <div className="add-workspace-dropdown-item">
        <div
          className="item-content"
          onClick={() => history.push("/setup-team-name")}
        >
          Create a new workspace
        </div>
      </div>
    </div>
  );
};

export default AddWorkspaceDropdown;
