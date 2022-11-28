import { objectAssign } from "./helper";
const CONNECT = "socket/CONNECT";
const DISCONNECT = "socket/DISCONNECT";

export const connectSocket = (socket) => {
  return {
    type: CONNECT,
    socket,
  };
};

export const disconnectSocket = () => {
  return {
    type: DISCONNECT,
  };
};

let initialState = {
  socket: {},
};

export default function socketReducer(state = initialState, action) {
  switch (action.type) {
    case CONNECT:
      const socket = action.socket;
      const connectState = objectAssign(state);
      connectState.socket = socket;
      return connectState;
    case DISCONNECT:
      const disconnectState = {};
      return disconnectState;
    default:
      return state;
  }
}
