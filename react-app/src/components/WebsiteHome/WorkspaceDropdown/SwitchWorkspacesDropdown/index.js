import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const SwitchWorkspacesDropdown = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const workspaces = useSelector((state) => state.workspace.subscribed);
  console.log("SWITCH WORKSPACES ", workspaces);
  let displayWorkspaces = [];

  useEffect(() => {
    if (workspaces) {
      for (let i = 0; i < 3; i++) {
        if (i > Object.keys(workspaces).length) return;
        const key = Object.keys(workspaces)[i];
        if (!workspaces[key]) continue;
        displayWorkspaces.push(workspaces[key]);
      }
      console.log("SUBBED ", displayWorkspaces);
      setIsLoaded(true);
    }
  }, [workspaces]);

  if (!isLoaded) return null;

  return (
    <div className="subscribed-workspaces-sneak">
      {displayWorkspaces.map((workspace, idx) => {
        console.log("WORKSPACE ", workspace);
        return <div key={idx}>hello</div>;
      })}
    </div>
  );
};

export default SwitchWorkspacesDropdown;
