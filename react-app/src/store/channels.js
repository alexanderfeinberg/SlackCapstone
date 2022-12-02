import { csrfFetch } from "./csrf";
import { displayChannel, displayAllChannels } from "./ui";
import { objectAssign } from "./helper";

//Constants
const LOAD_CHANNEL = "channels/LOAD_CHANNEL";
const LOAD_CHANNEL_LIST = "channels/LOAD_CHANNEL_LIST";
const CREATE_CHANNEL = "channels/CREATE_CHANNEL";
const EDIT_CHANNEL = "channels/EDIT_CHANNEL";
const DELETE_CHANNEL = "cahnnels/DELETE_CHANNEL";
const LOAD_SUBSCRIBED_CHANNELS = "channels/LOAD_SUBSCRIBED_CHANNELS";
const CREATE_CHANNEL_SUBSCRIPTION = "channels/CREATE_CHANNEL_SUBSCRIPTION";
const REMOVE_CHANNEL_SUBSCRIPTION = "channels/REMOVE_CHANNEL_SUBSCRIPTION";

//Actions
export const loadChannel = (channel) => {
  return {
    type: LOAD_CHANNEL,
    channel,
  };
};

export const loadChannelList = (channelList) => {
  return {
    type: LOAD_CHANNEL_LIST,
    channelList,
  };
};

export const createChannel = (channel) => {
  return {
    type: CREATE_CHANNEL,
    channel,
  };
};

export const editChannel = (channel) => {
  return {
    type: EDIT_CHANNEL,
    channel,
  };
};

const deleteChannel = (channelId) => {
  return {
    type: DELETE_CHANNEL,
    channelId,
  };
};

export const loadSubbedChannels = (channels) => {
  return {
    type: LOAD_SUBSCRIBED_CHANNELS,
    channels,
  };
};

export const createChannelSub = (channel) => {
  return {
    type: CREATE_CHANNEL_SUBSCRIPTION,
    channel,
  };
};

export const removeChannelSub = (channel) => {
  return {
    type: REMOVE_CHANNEL_SUBSCRIPTION,
    channel,
  };
};

//Thunks
export const loadChannelThunk = (channelId) => async (dispatch) => {
  const response = await csrfFetch(`/api/channels/${channelId}`);
  if (response.ok) {
    const channel = await response.json();
    console.log("LOAD CHANNEL RESP", channel);
    await dispatch(loadChannel(channel));
    // dispatch(displayChannel());
    return channel;
  }
};

export const loadChannelListThunk = (workspaceId) => async (dispatch) => {
  let response;
  if (workspaceId) {
    response = await csrfFetch(`/api/workspaces/${workspaceId}/channels`);
  } else {
    response = await csrfFetch(`/api/channels/`);
  }

  if (response.ok) {
    const channelList = await response.json();
    dispatch(loadChannelList(channelList));
    return channelList;
  }
};

export const createChannelThunk =
  (workspaceId, newChannel) => async (dispatch) => {
    console.log("WORKSPACE OD", workspaceId);
    const response = await csrfFetch(
      `/api/workspaces/${workspaceId}/channels`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newChannel),
      }
    );
    console.log("CREATED CHANNEL ", response);

    if (response.ok) {
      const channel = await response.json();
      console.log("CREATED CHANNEL ", channel);
      dispatch(createChannel(channel));
      return channel;
    }
  };

export const editChannelThunk =
  (channelId, editedChannel) => async (dispatch) => {
    console.log("EDIT OBJ ", editedChannel);
    const response = await csrfFetch(`/api/channels/${channelId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedChannel),
    });

    if (response.ok) {
      const channel = await response.json();
      console.log("EDITED CHANNEL ", channel);
      dispatch(editChannel(channel));
      return channel;
    }
  };

export const deleteChannelThunk = (channelId) => async (dispatch) => {
  const response = await csrfFetch(`/api/channels/${channelId}`, {
    method: "DELETE",
  });
  console.log("DELETE CHANNEL RESP", response);
  if (response.ok) {
    const channel = await response.json();
    dispatch(deleteChannel(channelId));
    return;
  }
};

export const loadSubbedChannelsThunk = (workspaceId) => async (dispatch) => {
  const response = await csrfFetch(
    `/api/workspaces/${workspaceId}/channels/subscribed`
  );
  if (response.ok) {
    const channels = await response.json();
    dispatch(loadSubbedChannels(channels));
    return channels;
  }
};

export const createChannelSubThunk =
  (channelId, userId) => async (dispatch) => {
    const response = await csrfFetch(`/api/channels/${channelId}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });
    if (response.ok) {
      const channel = await response.json();
      dispatch(createChannelSub(channel));
      return channel;
    }
  };

export const removeChannelSubThunk = (channelId) => async (dispatch) => {
  const response = await csrfFetch(`/api/channels/${channelId}/users`, {
    method: "DELETE",
  });
  if (response.ok) {
    const channel = await response.json();
    console.log("RESP ", channel);

    dispatch(removeChannelSub(channel));
    return channel;
  }
};

export const getChannelUsers = async (channelId) => {
  const response = await csrfFetch(`/api/channels/${channelId}/users`);
  if (response.ok) {
    const users = await response.json();
    return users;
  }
};

let initialState = {
  channel: {},
  subscribed: {},
  channelList: {},
};

export default function ChannelReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_CHANNEL:
      const loadState = objectAssign(state);
      loadState.channel = { ...action.channel.Channel };
      return loadState;
    case LOAD_CHANNEL_LIST:
      const loadListState = objectAssign(state);
      loadListState.channelList = {};
      // const loadListState = { ...state, channelList: {} };
      action.channelList.Channels.forEach((channel) => {
        loadListState.channelList[channel.id] = channel;
      });
      return loadListState;

    case CREATE_CHANNEL:
      const createState = objectAssign(
        state,
        "channel",
        "channelList",
        "subscribed"
      );
      createState.channel = action.channel.Channel;
      createState.channelList[action.channel.Channel.id] =
        action.channel.Channel;
      createState.subscribed[action.channel.Channel.id] =
        action.channel.Channel;
      return createState;

    case EDIT_CHANNEL:
      // const editedState = Object.assign({}, state);
      const editedState = objectAssign(
        state,
        "channel",
        "channelList",
        "subscribed"
      );

      if (editedState.channel.id === action.channel.Channel.id) {
        console.log("CURR CHANNEL");
        editedState.channel = action.channel.Channel;
      }
      editedState.channelList[action.channel.Channel.id] =
        action.channel.Channel;
      editedState.subscribed[action.channel.Channel.id] =
        action.channel.Channel;
      return editedState;

    case DELETE_CHANNEL:
      const deleteState = objectAssign(state, "subscribed", "channelList");
      console.log("CHANNEL ");
      deleteState.channel = Object.values(deleteState.channelList)[0];
      delete deleteState.subscribed[action.channelId];
      delete deleteState.channelList[action.channelId];
      return deleteState;

    case LOAD_SUBSCRIBED_CHANNELS:
      // const loadSubbed = { ...state, subscribed: {} };
      const loadSubbed = objectAssign(state);
      loadSubbed.subscribed = {};
      action.channels.Channels.forEach((channel) => {
        loadSubbed.subscribed[channel.id] = channel;
      });
      return loadSubbed;

    case CREATE_CHANNEL_SUBSCRIPTION:
      const createSub = objectAssign(state, "subscribed", "channelList");
      createSub.channel = action.channel.Channel;
      createSub.channelList[action.channel.Channel.id] = action.channel.Channel;
      createSub.subscribed[action.channel.Channel.id] = action.channel.Channel;
      return createSub;

    case REMOVE_CHANNEL_SUBSCRIPTION:
      const removeSub = objectAssign(state, "subscribed", "channelList");
      removeSub.channel = {};
      delete removeSub.subscribed[action.channel.Channel.id];
      removeSub.channelList[action.channel.Channel.id] = action.channel.Channel;
      return removeSub;
    default:
      return state;
  }
}
