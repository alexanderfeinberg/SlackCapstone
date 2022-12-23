import { csrfFetch } from "./csrf";
import { objectAssign } from "./helper";

//Constants
const LOAD_MESSAGES = "channelMessages/LOAD_MESSAGES";
const CREATE_MESSAGE = "channelMessages/CREATE_MESSAGES";
const EDIT_MESSAGE = "channelMessages/EDIT_MESSAGES";
const DELETE_MESSAGES = "channelMessages/DELETE_MESSAGES";
const CLEAR_MESSAGE_CACHE = "channelMessages/CLEAR_MESSAGE_CACHE";

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

export const clearMessages = () => {
  return { type: CLEAR_MESSAGE_CACHE };
};

//Thunks
export const loadMessagesThunk = (channelId) => async (dispatch) => {
  const response = await csrfFetch(`/api/channels/${channelId}/messages`);
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

export const editMessageThunk =
  (messageId, editedMessage) => async (dispatch) => {
    const response = await csrfFetch(`/api/channel-messages/${messageId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedMessage),
    });

    if (response.ok) {
      const message = await response.json();
      console.log("MESSAGE REDUCER RESPONSE ", message);
      dispatch(editMessage(message));
      return message;
    }
  };

export const deleteMessageThunk = (messageId) => async (dispatch) => {
  const response = await csrfFetch(`/api/channel-messages/${messageId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(deleteMessage(messageId));
  }
};

let initialState = {
  messages: {},
};

export const loadDMMessages = (directMessageId) => async (dispatch) => {
  const response = await csrfFetch(`/api/dms/${directMessageId}/messages`);
  if (response.ok) {
    const messages = await response.json();
    dispatch(loadMessages(messages));
    return messages;
  }
};

export const createDMMessageThunk =
  (directMessageId, directMessageContent) => async (dispatch) => {
    const response = await csrfFetch(`/api/dms/${directMessageId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(directMessageContent),
    });
    if (response.ok) {
      const message = await response.json();
      dispatch(createMessage(message));
      return message;
    }
  };

export default function channelMessageReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_MESSAGES:
      const newState = objectAssign(state);
      newState.messages = {};

      if (action.messageList.Messages) {
        action.messageList.Messages.forEach((message) => {
          if (message.msgData) {
            console.log("MESSAGE ");
            message = message.msgData.Message;
          }
          newState.messages[message.id] = message;
        });
        return newState;
      }
      return newState;

    case CREATE_MESSAGE:
      const createState = objectAssign(state, "messages");

      const newMessageId = action.message.Message.id;
      createState.messages[newMessageId] = action.message.Message;
      return createState;

    case EDIT_MESSAGE:
      const editState = objectAssign(state, "messages");

      editState.messages[action.message.Message.id] = action.message.Message;
      return editState;

    case DELETE_MESSAGES:
      const deleteState = objectAssign(state, "messages");

      delete deleteState.messages[action.messageId];
      return deleteState;

    case CLEAR_MESSAGE_CACHE:
      const messageCache = objectAssign(state, "messages");
      messageCache.messages = {};
      return messageCache;

    default:
      return state;
  }
}
