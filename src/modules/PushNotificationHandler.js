// import firebase from 'react-native-firebase'
// import DeviceInfo from 'react-native-device-info';
// import NetworkManager from '../utils/NetworkManager'
// import ApiConfig from '../config/api-config'
// import { CLICK_NOTIFICATION, RELOAD_NOTIFICATION, RELOAD_DATA_PROJECT } from '../actions/action-types';
// import { dispatchAction } from '../store/store'

// const ANDROID_CHANNEL_ID = 'zentos-channel'
// const ANDROID_CHANNEL_NAME = 'Zentos-channel'

// const requestPermissionAndListen = async () => {
//   try {
//     await firebase.messaging().requestPermission();

//     // User has authorised and listen permission
//     listenNotifications()

//     // return
//     return Promise.resolve(true)
//   } catch (error) {
//   }

//   // User has rejected permissions
//   return Promise.reject(false)
// }

// const permissionEnabled = async () => {
//   try {
//     const enabled = await firebase.messaging().hasPermission();
//     if (enabled) {
//       // user has permissions
//       return Promise.resolve(true)
//     }
//   } catch (error) {
//   }

//   // User has rejected permissions
//   return Promise.reject(false)
// }

// const currentToken = async () => {
//   try {
//     const fcmToken = await firebase.messaging().getToken();
//     if (fcmToken) {
//       // user has a device token
//       return Promise.resolve(fcmToken)
//     }
//   } catch (error) { }

//   // user doesn't have a device token yet
//   return Promise.reject(null)
// }

// const listenNotifications = async () => {

//   // unlisten prev listener
//   unlistener()

//   // check permissions
//   let enabled = false;
//   try {
//     enabled = await permissionEnabled();
//   } catch (error) {
//   }
//   // user has rejected permissions
//   if (enabled === false) {
//     return
//   }

//   // Create chanel for notification android
//   const channel = new firebase.notifications.Android.Channel(
//     ANDROID_CHANNEL_ID,
//     ANDROID_CHANNEL_NAME,
//     firebase.notifications.Android.Importance.Max,
//   );
//   firebase.notifications().android.createChannel(channel);

//   // receviced in foreground
//   this.notificationUnlistener = firebase.notifications().onNotification((notification) => {
//     // Process your notification as required
//     try {
//       showNotification(notification)
//     } catch (error) { }

//   });

//   // Displayed
//   this.notificationDisplayedUnlistener = firebase.notifications().onNotificationDisplayed((notification) => {
//     reloadNotification(true)
//     reloadProject()
//     // getListNotification(1, this.state.agencyID, false, this.state.userID)
//     // Process your notification as required
//     // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
//   });

//   // when a notification is clicked / tapped / opened
//   // App in Foreground and background
//   this.notificationOpenedUnlistener = firebase.notifications().onNotificationOpened((notificationOpen) => {
//     // Get the action triggered by the notification being opened
//     const action = notificationOpen.action;
//     // Get information about the notification that was opened
//     const notification = notificationOpen.notification;
//     firebase.notifications().removeAllDeliveredNotifications(notification._notificationId)
//     clickNotification(notification._data)
//   });


//   try {
//     // App Closed
//     const notificationOpen = await firebase.notifications().getInitialNotification();
//     if (notificationOpen) {
//       // App was opened by a notification
//       // Get the action triggered by the notification being opened
//       const action = notificationOpen.action;
//       // Get information about the notification that was opened
//       const notification = notificationOpen.notification;
//       firebase.notifications().removeAllDeliveredNotifications(notification._notificationId)
//       clickNotification(notification._data)
//     }
//   } catch (error) {
//   }

// }

// const showNotification = async (notification) => {
//   // set channel for android
//   const new_notification = notification.android.setChannelId(ANDROID_CHANNEL_ID).android.setSmallIcon('app_icon')
//   //  show
//   return firebase.notifications().displayNotification(new_notification)
// }

// const setBadge = async (badge) => {
//   let number = parseInt(badge)
//   try {
//     if (number <= 0) {
//       await firebase.notifications().setBadge(0)
//       return
//     }
//     await firebase.notifications().setBadge(number)
//   } catch (eror) {
//   }
// }

// const unlistener = () => {
//   if (this.notificationOpenedUnlistener) {
//     this.notificationOpenedUnlistener()
//   }
//   if (this.notificationUnlistener) {
//     this.notificationUnlistener()
//   }
//   if (this.notificationDisplayedUnlistener) {
//     this.notificationDisplayedUnlistener()
//   }
// }

// const registerDevice = (userId) => {
//   currentToken().then(token => {
//     const deviceId = DeviceInfo.getUniqueID();
//     NetworkManager.request(ApiConfig.devices.registerDevice(userId, deviceId, token))
//       .catch(error => { })
//   })
// }

// const removeToken = async () => {
//   try {
//     await firebase.notifications().removeAllDeliveredNotifications()
//     // const deleteToken = await firebase.messaging().deleteToken()
//   } catch (error) {
//   }
// }

// const clickNotification = (notification) => {
//   dispatchAction({
//     type: CLICK_NOTIFICATION,
//     payload: notification
//   })
//   return
// }
// const reloadNotification = (isReload) => {
//   dispatchAction({
//     type: RELOAD_NOTIFICATION,
//     payload: isReload
//   })
//   return
// }

// const reloadProject = () => {
//   dispatchAction({
//     type: RELOAD_DATA_PROJECT,
//   })
// }

// export default {
//   requestPermissionAndListen,
//   currentToken,
//   permissionEnabled,
//   listenNotifications,
//   unlistener,
//   registerDevice,
//   setBadge,
//   removeToken,
//   reloadNotification,
//   reloadProject
// }
