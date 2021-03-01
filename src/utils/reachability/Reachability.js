import { NetInfo } from 'react-native';

let isConnected = false;

const listen = () => {
  // listen
  NetInfo.addEventListener('connectionChange', this.handleConnectionChange);
}

const removeListener = () => {
  // removeListener
  NetInfo.removeEventListener('connectionChange', this.handleConnectionChange)
}

handleConnectionChange = (connectionChange) => {

  // fetch
  NetInfo.isConnected.fetch().then(connected => {
    isConnected = connected;

    // data
    let data = { ...connectionChange, isConnected: isConnected }

    // action
    const action = () => ({
      type: 'CONNECTION_CHANGE',
      payload: data
    })

    // dispatch action
    const { dispatchAction } = require('../../store/store')
    dispatchAction(action())
  });

};

export default { listen, removeListener, isConnected }