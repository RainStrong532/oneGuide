const initialState = {
    isConnected: false
};

const reachabilityReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CONNECTION_CHANGE':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state
  }
}

export default reachabilityReducer
