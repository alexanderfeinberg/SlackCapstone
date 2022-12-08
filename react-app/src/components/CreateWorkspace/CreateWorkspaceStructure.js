import WorkspaceName from "./WorkspaceName";
import { useState, useEffect } from "react";
import "./CreateWorkspaceStructure.css";

let stepRender;
const CreateWorkspaceStructure = ({ step }) => {
  const [companyName, setCompanyName] = useState("");
  const companyInfo = { companyName };

  switch (step) {
    case "setup-team-name":
      stepRender = <WorkspaceName props={{ companyName, setCompanyName }} />;
      break;
  }

  return (
    <div className="workspace-container">
      <div className="empty-nav-bar"></div>
      <div className="workspace-content">
        <div className="left-column">{companyName}</div>
        <div className="right-column">
          <div className="right-column-container">{stepRender}</div>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspaceStructure;
