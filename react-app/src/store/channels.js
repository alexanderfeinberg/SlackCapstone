import { csrfFetch } from "./csrf";

//Constants
const LOAD_CHANNEL = "channels/LOAD_CHANNEL";
const LOAD_CHANNEL_LIST = "channels/LOAD_CHANNEL_LIST";
const CREATE_CHANNEL = "channels/CREATE_CHANNEL";
const EDIT_CHANNEL = "channels/EDIT_CHANNEL";
const DELETE_CHANNEL = "cahnnels/DELETE_CHANNEL";
const LOAD_SUBSCRIBED_CHANNELS = "channels/LOAD_channels_CHANNELS";
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
    channeList,
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

export const loadSubbedChannels = (channelList) => {
  return {
    type: LOAD_SUBSCRIBED_CHANNELS,
    channelList,
  };
};

export const createChannelSub = (channel) => {
  return {
    type: CREATE_CHANNEL_SUBSCRIPTION,
    channel,
  };
};

export const removeChannelSub = (channelId) => {
  return {
    type: REMOVE_CHANNEL_SUBSCRIPTION,
    channelId,
  };
};

//Thunks
export const loadChannelThunk = (channelId) => async (dispatch) => {
  const response = await csrfFetch(`/api/channels/${channelId}`);
  if (response.ok) {
    const channel = response.json();
    dispatch(loadChannel(channel));
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
    const response = await csrfFetch(
      `/api/workspaces/${workspaceId}/channels`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newChannel),
      }
    );

    if (response.ok) {
      const channel = await response.json();
      dispatch(createChannel(channel));
      return channel;
    }
  };

export const deleteChannelThunk = (channelId) => async (dispatch) => {
  const response = await csrfFetch(`/api/channels/${channelId}`);
  if (response.ok) {
    dispatch(deleteChannel(channelId));
    return;
  }
};

export const loadSubbedChannelsThunk = () => async (dispatch) => {
  const response = await csrfFetch(`/api/workspaces/channels/subscribed`);
  if (response.ok) {
    const channelList = await response.json();
    dispatch(loadSubbedChannels(channelList));
    return channelList;
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
    dispatch(removeChannelSub(channel.id));
    return channel;
  }
};
