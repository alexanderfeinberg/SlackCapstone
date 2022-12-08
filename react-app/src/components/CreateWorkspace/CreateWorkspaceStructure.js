import WorkspaceName from "./WorkspaceName";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { createWorkspaceThunk } from "../../store/workspaces";
import { createChannelThunk } from "../../store/channels";
import "./CreateWorkspaceStructure.css";
import WorkspaceChannels from "./WorkspaceChannels";

let stepRender;
const CreateWorkspaceStructure = ({ step }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [companyName, setCompanyName] = useState("");
  const [workspaceChannel, setWorkspaceChannel] = useState("");

  const createWorkspaceHandler = async () => {
    console.log("CREATE WORKSAPCE HANDLER");
    const workspace = await dispatch(
      createWorkspaceThunk({
        name: companyName,
        url: `${companyName}.transmit.com`,
      })
    );

    const channel = await dispatch(
      createChannelThunk(workspace.id, { name: workspaceChannel })
    );
    history.push(`/workspaces/${workspace.id}/channels/${channel.Channel.id}`);
  };

  switch (step) {
    case "setup-team-name":
      stepRender = <WorkspaceName props={{ companyName, setCompanyName }} />;
      break;
    case "setup-channels":
      stepRender = (
        <WorkspaceChannels
          props={{
            workspaceChannel,
            setWorkspaceChannel,
            createWorkspaceHandler,
          }}
        />
      );
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
