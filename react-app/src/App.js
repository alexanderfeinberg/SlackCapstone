import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthStructure from "./components/auth/AuthStructure";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/UsersList";
import User from "./components/User";
import { authenticate } from "./store/session";
import TestSocket from "./components/socket/testsocket";
import WorkspaceList from "./components/WebsiteHome/WorkspaceList";
import Channel from "./components/Channels/channel";
import Structure from "./components/WebApp/Structure";
import SplashPage from "./components/SplashPage";

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path="/login" exact={true}>
          <AuthStructure type={"login"} />
          {/* <TestSocket /> */}
        </Route>
        <Route path="/sign-up" exact={true}>
          <AuthStructure type={"signup"} />
        </Route>
        <ProtectedRoute path="/users" exact={true}>
          <UsersList />
        </ProtectedRoute>
        <ProtectedRoute path="/users/:userId" exact={true}>
          <User />
        </ProtectedRoute>
        <ProtectedRoute path="/workspaces/:workspaceId">
          <Structure />
        </ProtectedRoute>
        <Route path="/" exact={true}>
          <SplashPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
