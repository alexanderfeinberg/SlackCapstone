import { csrfFetch } from "./csrf";

//Constants
const LOAD_SUBSCRIBED_WORKSPACES = "subscribed/LOAD_SUSCRIBED_WORKSPACES";
const CREATE_WORKPLACE_SUBSCRIPTION =
  "subscribed/CREATE_WORKPLACE_SUBSCRIPTION";
const REMOVE_WORKPLACE_SUBSCRIPTION =
  "subscribed/REMOVE_WORKPLACE_SUBSCRIPTION";

const LOAD_SUBSCRIBED_CHANNELS = "subscribed/LOAD_SUBSCRIBED_CHANNELS";
const CREATE_CHANNEL_SUBSCRIPTION = "subscribed/CREATE_CHANNEL_SUBSCRIPTION";
const REMOVE_CHANNEL_SUBSCRIPTION = "subscribed/REMOVE_CHANNEL_SUBSCRIPTION";

//Actions

const loadSubbedWorkspaces = (workspaceList) => {
  return {
    type: LOAD_SUBSCRIBED_WORKSPACES,
    workspaceList,
  };
};

const createWorkspaceSub = (workspace) => {
  return { type: CREATE_WORKPLACE_SUBSCRIPTION, workspace };
};

const removeWorkspaceSub = (workspace) => {
  return {
    type: REMOVE_WORKPLACE_SUBSCRIPTION,
    workspace,
  };
};

const loadSubbedChannels = (channelList) => {
  return {
    type: LOAD_SUBSCRIBED_CHANNELS,
    channelList,
  };
};

const createChannelSub = (channel) => {
  return {
    type: CREATE_CHANNEL_SUBSCRIPTION,
    channel,
  };
};

const removeChannelSub = (channel) => {
  return {
    type: REMOVE_CHANNEL_SUBSCRIPTION,
    channel,
  };
};

// Thunks
const loadSubbedWorkspacesThunk = () => async (dispatch) => {
  const response = await csrfFetch(`/api/workspaces/subscribed`);
  if (response.ok) {
    const jsonData = await response.json();
    dispatch(loadSubbedWorkspaces(jsonData));
    return jsonData;
  }
};
