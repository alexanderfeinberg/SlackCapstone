import { csrfFetch } from "./csrf";
import { objectAssign } from "./helper";

//Constants
const LOAD_WORKSPACE = "workspaces/LOAD_WORKSPACE";
const LOAD_SUBSCRIBED_WORKSPACES = "workspaces/LOAD_SUSCRIBED_WORKSPACES";
const CREATE_WORKSPACE = "workspaces/CREATE_WORKSPACE";
const EDIT_WORKSPACE = "workspaces/EDIT_WORKSPACES";
const DELETE_WORKSPACE = "workspaces/DELETE_WORKSPACE";

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

const createWorkspace = (workspace) => {
  return {
    type: CREATE_WORKSPACE,
    workspace,
  };
};

const editWorkspace = (workspace) => {
  return {
    type: EDIT_WORKSPACE,
    workspace,
  };
};

const deleteWorkspace = (workspaceId) => {
  return {
    type: DELETE_WORKSPACE,
    workspaceId,
  };
};

const createWorkspaceSub = (workspace) => {
  return { type: CREATE_WORKPLACE_SUBSCRIPTION, workspace };
};

const removeWorkspaceSub = (workspaceId) => {
  return {
    type: REMOVE_WORKPLACE_SUBSCRIPTION,
    workspaceId,
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

export const createWorkspaceThunk = (workspaceData) => async (dispatch) => {
  console.log("WORKSPACE DATA ", workspaceData);
  const response = await csrfFetch(`/api/workspaces/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workspaceData),
  });
  if (response.ok) {
    const workspace = await response.json();
    dispatch(createWorkspace(workspace));
    return workspace.Workspace;
  }
};

export const editWorkspaceThunk =
  (workspaceId, updatedWorkspace) => async (dispatch) => {
    const response = await csrfFetch(`/api/workspaces/${workspaceId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedWorkspace),
    });

    if (response.ok) {
      const workspace = await response.json();
      dispatch(editWorkspace(workspace));
      return workspace;
    }
  };

export const deleteWorkspaceThunk = (workspaceId) => async (dispatch) => {
  const response = await csrfFetch(`/api/workspaces/${workspaceId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(deleteWorkspace(workspaceId));
    return;
  }
};

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
    case CREATE_WORKSPACE:
      const createState = objectAssign(
        state,
        "workspace",
        "workspaceList",
        "subscribed"
      );
      createState.workspace = action.workspace.Workspace;
      createState.workspaceList[action.workspace.Workspace.id] =
        action.workspace.Workspace;
      createState.subscribed[action.workspace.Workspace.id] =
        action.workspace.Workspace;
      return createState;

    case EDIT_WORKSPACE:
      const editState = objectAssign(
        state,
        "workspace",
        "workspaceList",
        "subscribed"
      );
      if (editState.workspace.id === action.workspace.Workspace.id) {
        editState.workspace = action.workspace.Workspace;
      }
      editState.workspaceList[action.workspace.Workspace.id] =
        action.workspace.Workspace;

      if (editState.subscribed[action.workspace.Workspace.id]) {
        editState.subscribed[action.workspace.Workspace.id] =
          action.workspace.Workspace;
      }
      return editState;

    case DELETE_WORKSPACE:
      const removeState = objectAssign(state, "workspaceList", "subscribed");
      console.log("REMOVE STATE ", removeState);
      delete removeState.workspaceList[action.workspaceId];
      delete removeState.subscribed[action.workspaceId];
      console.log("AFTER REMOVE STATE ", removeState);
      removeState.workspace = Object.values(removeState.workspaceList)[0];
      return removeState;
    default:
      return state;
  }
}
