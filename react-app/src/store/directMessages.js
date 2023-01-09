import { csrfFetch } from "./csrf";
import { objectAssign } from "./helper";

//Constants
const LOAD_DIRECT_MESSAGES = "directMessages/LOAD_DIRECT_MESSAGES";
const LOAD_DIRECT_MESSAGE = "directMessages/Load_DIRECT_MESSAGE";
const CREATE_DIRECT_MESSAGE = "directMessages/CREATE_DIRECT_MESSAGE";
const DELETE_DIRECT_MESSAGE = "directMessages/DELETE_CREATE_MESSAGE";

const RESET_DIRECT_MESSAGES = "directMessages/RESET";

const INCOMING_DM = "directMessages/INCOMING_DM";
const REMOVE_INCOMING = "directMessage/REMOVE_INCOMING";

//Actions
export const loadDirectMessages = (directMessages) => {
  return { type: LOAD_DIRECT_MESSAGES, directMessages };
};

export const loadDirectMessage = (directMessage) => {
  return { type: LOAD_DIRECT_MESSAGE, directMessage };
};

export const createDirectMessage = (directMessage) => {
  return { type: CREATE_DIRECT_MESSAGE, directMessage };
};

export const deleteDirectMessage = (directMessage) => {
  return { type: DELETE_DIRECT_MESSAGE, directMessage };
};

export const incomingDM = (directMessageId) => {
  return { type: INCOMING_DM, directMessageId };
};

export const removeIncoming = (directMessageId) => {
  return { type: REMOVE_INCOMING, directMessageId };
};

export const resetDM = () => {
  return { type: RESET_DIRECT_MESSAGES };
};

//Thunks
export const loadDirectMessagesThunk = () => async (dispatch) => {
  const response = await csrfFetch(`/api/dms/`);
  if (response.ok) {
    const directMessages = await response.json();
    dispatch(loadDirectMessages(directMessages));
    return directMessages;
  }
};

export const loadDirectMessageThunk = (directMessageId) => async (dispatch) => {
  const response = await csrfFetch(`/api/dms/${directMessageId}`);
  if (response.ok) {
    const directMessage = await response.json();
    dispatch(loadDirectMessage(directMessage));
    return directMessage;
  }
};

export const createDirectMessageThunk =
  (workspaceId, directMessage) => async (dispatch) => {
    console.log("DM BODY ", directMessage);
    const response = await csrfFetch(`/api/workspaces/${workspaceId}/dms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(directMessage),
    });

    if (response.ok) {
      const newDirectMessage = await response.json();
      console.log("NEW DM INFO ", newDirectMessage);
      dispatch(createDirectMessage(newDirectMessage));
      return newDirectMessage;
    }
  };

export const deleteDirectMessageThunk = (directMessage) => async (dispatch) => {
  const response = await csrfFetch(`/api/dms/${directMessage.id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(deleteDirectMessage(directMessage));
    return;
  }
};

let initialState = {
  directMessagesList: {},
  directMessage: {},
};

export default function DirectMessageReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_DIRECT_MESSAGES:
      const loadAllState = objectAssign(state, "directMessage");
      loadAllState.directMessagesList = {};
      if (!action.directMessages.DirectMessages.length) return loadAllState;
      action.directMessages.DirectMessages.forEach((message) => {
        console.log("MESSAGE ", message);
        loadAllState.directMessagesList[message.id] = { ...message };
        loadAllState.directMessagesList[message.id].users = {};

        message.users.forEach((user) => {
          console.log("USER ", user);
          loadAllState.directMessagesList[message.id]["users"][user.id] = user;
        });
      });

      return loadAllState;
    case LOAD_DIRECT_MESSAGE:
      const loadState = objectAssign(
        state,
        "directMessagesList",
        "directMessage"
      );
      if (
        !loadState.directMessagesList[action.directMessage.DirectMessage.id]
      ) {
        loadState.directMessagesList[action.directMessage.DirectMessage.id] =
          action.directMessage.DirectMessage;
      }
      loadState.directMessage = action.directMessage.DirectMessage;
      return loadState;

    case CREATE_DIRECT_MESSAGE:
      const createState = objectAssign(
        state,
        "directMessagesList",
        "directMessage"
      );
      const directMessage = action.directMessage.DirectMessage;
      createState.directMessagesList[directMessage.id] = Object.assign(
        {},
        directMessage
      );
      createState.directMessage = Object.assign({}, directMessage);
      createState.directMessagesList[directMessage.id].users = {};

      directMessage.users.forEach((user) => {
        createState.directMessagesList[directMessage.id]["users"][user.id] =
          user;
      });
      return createState;

    case DELETE_DIRECT_MESSAGE:
      const deleteState = objectAssign(
        state,
        "directMessagesList",
        "directMessage"
      );
      const deleteMessage = action.directMessage;
      if (deleteState.directMessage.id === deleteMessage.id) {
        deleteState.directMessage = {};
      }
      delete deleteState.directMessagesList[deleteMessage.id];
      return deleteState;

    case INCOMING_DM:
      const incomingState = objectAssign(
        state,
        "directMessage",
        "directMessagesList"
      );
      incomingState.directMessagesList[action.directMessageId].incoming = true;
      return incomingState;

    case REMOVE_INCOMING:
      const removeIncomingState = objectAssign(
        state,
        "directMessage",
        "directMessagesList"
      );
      removeIncomingState.directMessagesList[
        action.directMessageId
      ].incoming = false;

      return removeIncomingState;

    case RESET_DIRECT_MESSAGES:
      const resetState = objectAssign(state);
      resetState.directMessagesList = {};
      resetState.directMessage = {};

      return resetState;

    default:
      return state;
  }
}
