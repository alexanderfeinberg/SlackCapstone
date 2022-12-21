import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import session from "./session";
import workspace from "./workspaces";
import channel from "./channels";
import channelMessage from "./channelMessages";
import socket from "./socket";
import ui from "./ui";
import online from "./online";
import directMessages from "./directMessages";

const rootReducer = combineReducers({
  session,
  workspace,
  channel,
  channelMessage,
  socket,
  ui,
  online,
  directMessages,
});

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
