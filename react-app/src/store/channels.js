import { csrfFetch } from "./csrf";

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

export const editChannelThunk =
  (channelId, editedChannel) => async (dispatch) => {
    const response = await csrfFetch(`/api/channels/${channelId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedChannel),
    });

    if (response.ok) {
      const channel = await response.json();
      dispatch(editChannel(channel));
      return channel;
    }
  };

export const deleteChannelThunk = (channelId) => async (dispatch) => {
  const response = await csrfFetch(`/api/channels/${channelId}`, {
    method: "DELETE",
  });
  if (response.ok) {
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
    dispatch(removeChannelSub(channel.id));
    return channel;
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
      const loadState = { ...state, channel: { ...action.Channel } };
      return loadState;
    case LOAD_CHANNEL_LIST:
      const loadListState = { ...state, channelList: {} };
      action.Channels.forEach((channel) => {
        loadListState.channelList[channel.id] = channel;
      });
      return loadListState;

    case CREATE_CHANNEL:
      const createState = {
        ...state,
        channel: { ...action.Channel },
        channelList: { ...state.channelList },
        subscribed: { ...state.subscribed },
      };
      createState.channelList[action.Channel.id] = action.Channel;
      createState.subscribed[action.Channel.id] = action.Channel;
      return createState;

    case EDIT_CHANNEL:
      const editState = {
        ...state,
        channel: { ...action.Channel },
        channelList: { ...state.channelList },
        subscribed: { ...state.subscribed },
      };

      editState.channelList[action.Channel.id] = action.Channel;
      editState.subscribed[action.Channel.id] = action.Channel;
      return editState;

    case DELETE_CHANNEL:
      const deleteState = {
        ...state,
        subscribed: { ...state.subscribed },
        channelList: { ...state.channelList },
      };

      delete deleteState.subscribed[action.channelId];
      delete deleteState.channelList[action.channelId];
      return deleteState;

    case LOAD_SUBSCRIBED_CHANNELS:
      const loadSubbed = { ...state, subscribed: {} };
      action.channels.Channels.forEach((channel) => {
        loadSubbed.subscribed[channel.id] = channel;
      });
      return loadSubbed;

    case CREATE_CHANNEL_SUBSCRIPTION:
      const createSub = { ...state, subscribed: { ...state.subscribed } };
      createSub.subscribed[action.Channel.id] = action.Channel;
      return createSub;

    case REMOVE_CHANNEL_SUBSCRIPTION:
      const removeSub = { ...state, subscribed: { ...state.subscribed } };
      delete removeSub.subscribed[action.channelId];
      return removeSub;
    default:
      return state;
  }
}
