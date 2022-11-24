import { csrfFetch } from "./csrf";

//Constants
const LOAD_MESSAGES = "channelMessages/LOAD_MESSAGES";
const CREATE_MESSAGE = "channelMessages/CREATE_MESSAGES";
const EDIT_MESSAGE = "channelMessages/EDIT_MESSAGES";
const DELETE_MESSAGES = "channelMessages/DELETE_MESSAGES";

//Actions
export const loadMessages = (messageList) => {
  return {
    type: LOAD_MESSAGES,
    messageList,
  };
};

export const createMessage = (message) => {
  return {
    type: CREATE_MESSAGE,
    message,
  };
};

export const editMessage = (message) => {
  return { type: EDIT_MESSAGE, message };
};

export const deleteMessage = (messageId) => {
  return {
    type: DELETE_MESSAGES,
    messageId,
  };
};

//Thunks
export const loadMessagesThunk = (channelId) => async (dispatch) => {
  const response = await csrfFetch(`/api/channels/${channelId / messages}`);
  if (response.ok) {
    const messages = await response.json();
    dispatch(loadMessages(messages));
    return messages;
  }
};

export const createMessageThunk = (channelId, message) => async (dispatch) => {
  const response = await csrfFetch(`/api/channels/${channelId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  if (response.ok) {
    const newMessage = await response.json();
    dispatch(createMessage(newMessage));
    return newMessage;
  }
};

export const editMessageThunk = (messageId) => async (dispatch) => {};
