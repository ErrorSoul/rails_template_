export const loadState = (namespaceKey) => {
  console.log("LOAD STATE");
  try {
    const serializedState = localStorage.getItem(namespaceKey);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state, namespaceKey) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(namespaceKey, serializedState);
  } catch (err) {}
};
