//Constants
const LOAD_SUBSCRIBED_WORKSPACES = "workspaces/LOAD_SUSCRIBED_WORKSPACES";
const CREATE_WORKPLACE_SUBSCRIPTION =
  "workspaces/CREATE_WORKPLACE_SUBSCRIPTION";
const REMOVE_WORKPLACE_SUBSCRIPTION =
  "workspaces/REMOVE_WORKPLACE_SUBSCRIPTION";

//Actions
const loadSubbedWorkspaces = (workspaceList) => {
  return {
    type: LOAD_SUBSCRIBED_WORKSPACES,
    workspaceList,
  };
};

const createWorkspaceSub = (workspace) => {
  return { type: CREATE_WORKPLACE_SUBSCRIPTION, workspace };
};

const removeWorkspaceSub = (workspace) => {
  return {
    type: REMOVE_WORKPLACE_SUBSCRIPTION,
    workspace,
  };
};

// Thunks
const loadSubbedWorkspacesThunk = () => async (dispatch) => {
  const response = await csrfFetch(`/api/workspaces/subscribed`);
  if (response.ok) {
    const jsonData = await response.json();
    dispatch(loadSubbedWorkspaces(jsonData));
    return jsonData;
  }
};

// const createWorkspaceSubThunk = (workspaceId) => async (dispatch) => {
//     const response = await csrfFetch(`/api/workspaces/`)
// };
