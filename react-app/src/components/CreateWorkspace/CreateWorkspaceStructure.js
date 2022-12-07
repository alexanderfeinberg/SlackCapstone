import WorkspaceName from "./WorkspaceName";
import { useState, useEffect } from "react";

let stepRender;
const CreateWorkspaceStructure = ({ step }) => {
  switch (step) {
    case "setup-team-name":
      stepRender = <WorkspaceName />;
      break;
  }

  return (
    <div className="workspace-container">
      <div className="empty-nav-bar"></div>
      <div className="left-column"></div>
      <div className="right-column">
        <div className="right-column-container">{stepRender}</div>
      </div>
    </div>
  );
};

export default CreateWorkspaceStructure;
