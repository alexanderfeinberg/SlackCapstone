import "./AddWorkspaceDropdown.css";
import { useHistory } from "react-router-dom";

const AddWorkspaceDropdown = () => {
  console.log("Add workspace dropdown");
  const history = useHistory();

  return (
    <div className="side-dropdown-container">
      <div className="side-dropdown-item">
        <div
          className="item-content"
          onClick={() => history.push("/get-started")}
        >
          Sign in to another workspace
        </div>
      </div>
      <div className="side-dropdown-item">
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
