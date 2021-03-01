import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import { getStore } from './store/store';
import { defautOptions } from './config/options';
import { registerScreensWithStore } from './config/screens-register';
import { setRootToLaunchScreen } from './navigation';
import { Reachability } from './utils'
import Device from './modules/Device'
import AppHandler from './modules/AppHandler'
import SocketManager from './modules/SocketManager'
// import GoogleSiginManager from './modules/GoogleSiginManager'
import { getListNotifications } from '../src/actions/notification-action'

registerScreensWithStore(Provider, getStore());

Navigation.events().registerAppLaunchedListener(() => {

  // options
  Navigation.setDefaultOptions(defautOptions);

  // setroot
  setRootToLaunchScreen()

  // app state
  AppHandler.listenState()

  // listen
  Reachability.listen()

  // get device info
  Device.getInfo()

  // socket
  SocketManager.connect()

  // Googlesign
  // GoogleSiginManager.configure()

});
Navigation.events().registerComponentDidAppearListener(({ componentId, componentName }) => {
});
Navigation.events().registerComponentDidDisappearListener(({ componentId, componentName }) => {
});
// Navigation.events().registerBottomTabSelectedListener(({ selectedTabIndex, unselectedTabIndex }) => {

//   if (selectedTabIndex === 3) {

//     getListNotifications(1)
//   }
// });