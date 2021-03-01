import { Platform, AppState } from 'react-native';

const listenState = () => {
  // app state
  AppState.addEventListener('change', this.handleAppStateChange);
  this.handleAppStateChange(AppState.currentState)
}

handleAppStateChange = (nextAppState) => {

  if (nextAppState === 'active') {
    // get current id and update token
  } else if (nextAppState === 'background') {
  }
}

export default AppHandler = {
  listenState
}