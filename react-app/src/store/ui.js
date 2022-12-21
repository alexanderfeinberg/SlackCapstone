const DISPLAY_CHANNEL = "ui/DISPLAY_CHANNEL";
const DISPLAY_DIRECT_MESSAGE = "ui/DISPLAY_DIRECT_MESSAGE";

export const displayChannel = () => {
  return { type: DISPLAY_CHANNEL };
};

export const displayDM = () => {
  return { type: DISPLAY_DIRECT_MESSAGE };
};

let initialState = {
  display: "",
};

export default function displayReducer(state = initialState, action) {
  switch (action.type) {
    case DISPLAY_CHANNEL:
      const channelState = { ...state, display: "channel" };
      return channelState;
    case DISPLAY_DIRECT_MESSAGE:
      const dmState = { ...state, display: "directMessage" };
      return dmState;

    default:
      return state;
  }
}
