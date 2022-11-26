const DISPLAY_CHANNEL = "ui/DISPLAY_CHANNEL";
const DISPLAY_ALL_CHANNELS = "ui/DISPLAY_ALL_CHANNELS";
const DISPLAY_DIRECT_MESSAGE = "ui/DISPLAY_DIRECT_MESSAGE";
const DISPLAY_PEOPLE = "ui/DISPLAY_PEOPLE";

export const displayChannel = () => {
  return { type: DISPLAY_CHANNEL };
};

export const displayAllChannels = () => {
  return { type: DISPLAY_ALL_CHANNELS };
};
export const displayDM = () => {
  return { type: DISPLAY_DIRECT_MESSAGE };
};
export const displayPeople = () => {
  return { type: DISPLAY_PEOPLE };
};

let initialState = {
  display: "",
};

export default function displayReducer(state = initialState, action) {
  switch (action.type) {
    case DISPLAY_CHANNEL:
      const channelState = { ...state, display: "channel" };
      return channelState;
    case DISPLAY_ALL_CHANNELS:
      const allChannelsState = { ...state, display: "allChannels" };
      return allChannelsState;
    case DISPLAY_DIRECT_MESSAGE:
      const dmState = { ...state, display: "directMessage" };
      return dmState;
    case DISPLAY_PEOPLE:
      const displayPeopleState = { ...state, display: "allPeople" };
      return displayPeopleState;
  }
}
