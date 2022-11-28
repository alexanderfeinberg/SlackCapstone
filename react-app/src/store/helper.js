export const objectAssign = (oldState, ...args) => {
  const newState = Object.assign({}, oldState);
  for (let arg of args) {
    newState[arg] = Object.assign({}, newState[arg]);
  }
  return newState;
};
