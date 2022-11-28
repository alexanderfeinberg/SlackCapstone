import { csrfFetch } from "./csrf";
import { objectAssign } from "./helper";

//Constants
const LOAD_WORKSPACE = "workspaces/LOAD_WORKSPACE";
const LOAD_SUBSCRIBED_WORKSPACES = "workspaces/LOAD_SUSCRIBED_WORKSPACES";
const CREATE_WORKPLACE_SUBSCRIPTION =
  "workspaces/CREATE_WORKPLACE_SUBSCRIPTION";
const REMOVE_WORKPLACE_SUBSCRIPTION =
  "workspaces/REMOVE_WORKPLACE_SUBSCRIPTION";

//Actions
const loadWorkspace = (workspace) => {
  return {
    type: LOAD_WORKSPACE,
    workspace,
  };
};

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

export const loadWorkspaceThunk = (workspaceId) => async (dispatch) => {
  const response = await csrfFetch(`/api/workspaces/${workspaceId}`);
  if (response.ok) {
    const workspace = await response.json();
    dispatch(loadWorkspace(workspace));
    return workspace;
  }
};
export const loadSubbedWorkspacesThunk = () => async (dispatch) => {
  const response = await csrfFetch(`/api/workspaces/subscribed`);
  if (response.ok) {
    const workspaces = await response.json();
    dispatch(loadSubbedWorkspaces(workspaces));
    return workspaces;
  }
};

// const createWorkspaceSubThunk = (workspaceId) => async (dispatch) => {
//     const response = await csrfFetch(`/api/workspaces/`)
// };

let initialState = {
  workspace: {},
  subscribed: {},
  workspaceList: {},
};
export default function workspaceReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_SUBSCRIBED_WORKSPACES:
      const loadSubbed = objectAssign(state);
      loadSubbed.subscribed = {};
      action.workspaceList.Workspaces.forEach((workspace) => {
        loadSubbed.subscribed[workspace.id] = workspace;
      });
      return loadSubbed;
    case LOAD_WORKSPACE:
      const loadState = objectAssign(state);
      loadState.workspace = { ...action.workspace.Workspace };

      return loadState;
    default:
      return state;
  }
}
