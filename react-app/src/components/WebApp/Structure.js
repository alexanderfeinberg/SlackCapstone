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
import { io } from "socket.io-client";
import { connectSocket, disconnectSocket } from "../../store/socket";
import WorkspaceDropdown from "../WebsiteHome/WorkspaceDropdown/WorkspaceDropdown";
import { EditFormContext, EditFormProvider } from "../../context/EditForm";
import "./Structure.css";
import { addOnlineUsers, removeOnlineUser } from "../../store/online";
let socket;

const Structure = () => {
  const dispatch = useDispatch();
  const { workspaceId } = useParams();
  const workspace = useSelector((state) => state.workspace.workspace);
  const currentUser = useSelector((state) => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showWorkspaceDropdown, setShowWorkspaceDopdown] = useState(false);
  const existingSocket = useSelector((state) => state.socket.socket);
  let { path, url } = useRouteMatch();

  const initializeSocketHandler = () => {
    socket = io();

    dispatch(connectSocket(socket));
    socket.on("sign_in", (data) => dispatch(addOnlineUsers(data)));
    socket.on("user_disconnect", (data) => dispatch(removeOnlineUser(data.id)));
    socket.emit("sign_in", { user: currentUser });
  };

  const disconnectSocketHandler = () => {
    if (existingSocket) {
      console.log("DISCONNCTING");

      socket.disconnect();
      dispatch(disconnectSocket());
    }
  };

  useEffect(() => {
    initializeSocketHandler();
    (async () => {
      await dispatch(loadWorkspaceThunk(workspaceId));
      setIsLoaded(true);
    })();
    return () => disconnectSocketHandler();
  }, [dispatch]);

  if (!isLoaded) return null;

  return (
    <div className="app-container">
      <div className="container-left">
        {/* <div className="container-workspaces">
          <WorkspaceList />
        </div> */}

        <div className="container-subscribed">
          <div
            id="workspace-options-btn"
            className="header-container subscription-padding hover"
            onClick={() => setShowWorkspaceDopdown(!showWorkspaceDropdown)}
          >
            <div className="workspace-title header">{workspace.name}</div>
            {showWorkspaceDropdown && <WorkspaceDropdown />}
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
              {/* <Redirect
                to={{
                  pathname: `${path}/channels/1`,
                }}
              /> */}
            </Switch>
          </EditFormProvider>
        </div>
      </div>
    </div>
  );
};

export default Structure;
