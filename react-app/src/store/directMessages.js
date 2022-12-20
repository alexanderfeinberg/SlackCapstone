//Constants
const LOAD_DIRECT_MESSAGES = "directMessages/LOAD_DIRECT_MESSAGES";
const LOAD_DIRECT_MESSAGE = "directMessages/Load_DIRECT_MESSAGE";
const CREATE_DIRECT_MESSAGE = "directMessages/CREATE_DIRECT_MESSAGE";
const DELETE_DIRECT_MESSAGe = "directMessages/DELETE_CREATE_MESSAGE";

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
  return { type: DELETE_DIRECT_MESSAGe, directMessage };
};

//Thunks
