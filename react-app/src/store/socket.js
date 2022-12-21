import { objectAssign } from "./helper";
const CONNECT = "socket/CONNECT";
const DISCONNECT = "socket/DISCONNECT";
const ASSIGN_ROOM = "socket/ASSIGN_ROOM";

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

export const assignRoom = (room, chatObject) => {
  return {
    type: ASSIGN_ROOM,
    room,
    chatObject,
  };
};

let initialState = {
  socket: {},
  room: {},
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
    case ASSIGN_ROOM:
      const roomState = objectAssign(state, "room");
      roomState.room = { name: action.room, chatObject: action.chatObject };
      return roomState;
    default:
      return state;
  }
}
