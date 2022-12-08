import { useState, useEffect } from "react";

const WorkspaceChannels = ({ props }) => {
  const { workspaceChannel, setWorkspaceChannel, createWorkspaceHandler } =
    props;

  return (
    <div className="workspace-name-container">
      <div className="step-count">Step 2/2</div>
      <div className="action-title-container">
        <div className="action-title">
          <h3>What’s your team working on right now?</h3>
        </div>
      </div>
      <div className="action-subtitle">
        <div className="action-subtitle-text"></div>This could be anything: a
        project, campaign, event, or the deal you’re trying to close.
      </div>
      <div className="company-name-input">
        <input
          type="text"
          placeholder="Ex: Q4 budget, autumn campaign"
          value={workspaceChannel}
          onChange={(e) => {
            setWorkspaceChannel(e.target.value);
          }}
        ></input>
      </div>
      <div className="company-name-submit">
        <button
          disabled={
            workspaceChannel.length < 1 || workspaceChannel.length > 80
              ? true
              : false
          }
          onClick={createWorkspaceHandler}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WorkspaceChannels;
