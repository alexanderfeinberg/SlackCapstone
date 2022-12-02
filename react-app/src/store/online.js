import { objectAssign } from "./helper";

const ADD_ONLINE_USERS = "online/ADD_ONLINE_USERS";
const GET_ONLINE_USERS = "online/GET_ONLINE_USERS";
const REMOVE_ONLINE_USER = "online/REMOVE_ONLINE_USER";

export const addOnlineUsers = (users) => {
  return {
    type: ADD_ONLINE_USERS,
    users,
  };
};

export const getOnlineUsers = () => {
  return {
    type: GET_ONLINE_USERS,
  };
};

export const removeOnlineUser = (userId) => {
  return {
    type: REMOVE_ONLINE_USER,
    userId,
  };
};

let initialState = {
  online: {},
};

export default function onlineReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ONLINE_USERS:
      const addUsers = objectAssign(state);
      Object.values(action.users).forEach((user) => {
        addUsers.online[user.id] = user;
      });
      return addUsers;
    case GET_ONLINE_USERS:
      const getUsers = objectAssign(state, "online");
      return getUsers;
    case REMOVE_ONLINE_USER:
      const removeUsers = objectAssign(state, "online");
      delete removeUsers.online[action.userId];
      return removeUsers;
    default:
      return state;
  }
}
