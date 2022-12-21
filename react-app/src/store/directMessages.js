import { csrfFetch } from "./csrf";
import { objectAssign } from "./helper";

//Constants
const LOAD_DIRECT_MESSAGES = "directMessages/LOAD_DIRECT_MESSAGES";
const LOAD_DIRECT_MESSAGE = "directMessages/Load_DIRECT_MESSAGE";
const CREATE_DIRECT_MESSAGE = "directMessages/CREATE_DIRECT_MESSAGE";
const DELETE_DIRECT_MESSAGE = "directMessages/DELETE_CREATE_MESSAGE";

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
    const response = await csrfFetch(`/api/workspaces/${workspaceId}/dms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(directMessage),
    });

    if (response.ok) {
      const newDirectMessage = await response.json();
      dispatch(createDirectMessage(newDirectMessage));
      return newDirectMessage;
    }
  };

export const deleteDirectMessageThunk = (directMessage) => async (dispatch) => {
  const response = await csrfFetch(`/api/dms/${directMessage.id}`);
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
      loadAllState.directMessagesList = Object.assign(
        {},
        loadAllState.directMessagesList
      );
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
        "directMessageList",
        "directMessage"
      );
      if (!loadState.directMessageList[action.directMessage.DirectMessage.id]) {
        loadState.directMessageList[action.directMessage.DirectMessage.id] =
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
      createState.directMessagesList[directMessage.id] = directMessage;
      createState.directMessage = directMessage;
      return createState;

    case DELETE_DIRECT_MESSAGE:
      const deleteState = objectAssign(
        state,
        "directMessageList",
        "directMessage"
      );
      const deleteMessage = action.directMessage;
      if (deleteState.directMessage.id === deleteMessage.id) {
        deleteState.directMessage = {};
      }
      delete deleteState.directMessageList[deleteMessage.id];
      return deleteState;

    default:
      return state;
  }
}
