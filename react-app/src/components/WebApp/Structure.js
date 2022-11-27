import WorkspaceList from "../WebsiteHome/WorkspaceList";
import SubscribedChannelList from "../WebsiteHome/SubscribedChannelList";
import Channel from "../Channels/channel";
import AllChannels from "../Channels/AllChannels/AllChannels";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { BrowserRouter, Route, Switch, useRouteMatch } from "react-router-dom";

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
  let { path, url } = useRouteMatch();

  useEffect(async () => {
    console.log(workspaceId);
    await dispatch(loadWorkspaceThunk(workspaceId));
    setIsLoaded(true);
  }, []);

  //   const handleContainerDisplay = () => {
  //     switch (uiDisplay) {
  //       case "channel":
  //         return <Channel />;
  //       case "allChannels":
  //         return <AllChannels />;
  //       case "directMessage":
  //         <h1>DM HERE</h1>;
  //       case "allPeople":
  //         return <h1>ALL PEOPLE HERE</h1>;
  //     }
  //   };

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
          <Switch>
            <Route path={`${path}/channels/:channelId`}>
              <Channel />
            </Route>
            <Route path={`${path}/allChannels`}>
              <AllChannels />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Structure;
