import WorkspaceList from "../WebsiteHome/WorkspaceList";
import SubscribedChannelList from "../WebsiteHome/SubscribedChannelList";
import Channel from "../Channels/channel";
import AllChannels from "../Channels/AllChannels/AllChannels";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { loadWorkspaceThunk } from "../../store/workspaces";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { EditFormContext, EditFormProvider } from "../../context/EditForm";
import "./Structure.css";

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
          <div className="header-container subscription-padding hover">
            <div className="workspace-title header">{workspace.name}</div>
          </div>
          <div className="channel-list">
            <SubscribedChannelList />
          </div>
        </div>
      </div>
      <div className="container-right">
        <div className="container-data">
          <EditFormProvider>
            <Switch>
              <ProtectedRoute path={`${path}/channels/:channelId`}>
                <Channel />
              </ProtectedRoute>
              <Route path={`${path}/allChannels`}>
                <AllChannels workspace={workspace} />
              </Route>
              <Redirect
                to={{
                  pathname: `${path}/channels/1`,
                }}
              />
            </Switch>
          </EditFormProvider>
        </div>
      </div>
    </div>
  );
};

export default Structure;
