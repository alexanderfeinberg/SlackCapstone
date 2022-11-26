import WorkspaceList from "../WebsiteHome/WorkspaceList";
import SubscribedChannelList from "../WebsiteHome/SubscribedChannelList";
import Channel from "../Channels/channel";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { loadWorkspaceThunk } from "../../store/workspaces";
import { useDispatch } from "react-redux";
import { useState } from "react";

const Structure = () => {
  const dispatch = useDispatch();
  const { workspaceId } = useParams();
  const workspace = useSelector((state) => state.workspace.workspace);
  const uiDisplay = useSelector((state) => state.ui.display);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(async () => {
    console.log(workspaceId);
    await dispatch(loadWorkspaceThunk(workspaceId));
    setIsLoaded(true);
  }, []);

  const handleContainerDisplay = () => {
    switch (uiDisplay) {
      case "channel":
        return <Channel />;
      case "allChannels":
        return <h1>ALL CHANNELS HERE</h1>;
      case "directMessage":
        <h1>DM HERE</h1>;
      case "allPeople":
        return <h1>ALL PEOPLE HERE</h1>;
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="app-container">
      <div className="container-left">
        <div className="container-workspaces">
          <WorkspaceList />
        </div>
        <div className="container-subscribed">
          <SubscribedChannelList />
        </div>
      </div>
      <div className="container-right">
        <div className="container-data">
          <Channel />
        </div>
      </div>
    </div>
  );
};

export default Structure;
