import "./AddWorkspaceDropdown.css";
import { useHistory } from "react-router-dom";

const AddWorkspaceDropdown = () => {
  console.log("Add workspace dropdown");
  const history = useHistory();

  return (
    <div className="side-dropdown-container">
      <div
        className="side-dropdown-item"
        onClick={() => history.push("/get-started")}
      >
        <div className="item-content">Sign in to another workspace</div>
      </div>
      <div
        className="side-dropdown-item"
        onClick={() => history.push("/setup-team-name")}
      >
        <div className="item-content">Create a new workspace</div>
      </div>
    </div>
  );
};

export default AddWorkspaceDropdown;
