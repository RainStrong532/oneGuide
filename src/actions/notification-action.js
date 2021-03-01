import _ from 'lodash';
import { GET_NEW_NOTIFICATIONS, createAction, DELETE_NOTIFICATION } from './action-types'
import NetworkManager from '../modules/NetworkManager'
import ApiConfig from '../config/api-config'

export function getListNotifications(page) {
  console.log("voly: ", page);
  return async function (dispatch, getState) {

    return NetworkManager.request(ApiConfig.notification.list(page))
      .then(response => {
        console.log("notification ????", response);
        let notifications = _.get(response.data, 'data.notifications')

        if (page !== 1) {
          const currentNotifications = _.get(getState(), 'notification.notifications')
          notifications = _.concat(currentNotifications, notifications)
        }

        dispatch(createAction(GET_NEW_NOTIFICATIONS, notifications, true))
        return Promise.resolve(notifications)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}


export function deleteNotification(notification_id) {

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.notification.delete(notification_id))
      .then(response => {
        let message = _.get(response, 'data.message')
        if (message === 'Succes') {
          // current notification
          let currentNotifications = _.get(getState(), 'notification.notifications')
          const index = _.findIndex(currentNotifications, { notification_id });
          currentNotifications.splice(index, 1);

          // dispatch
          dispatch(createAction(DELETE_NOTIFICATION, currentNotifications, true))
          return Promise.resolve(notification_id)
        } else {
          return Promise.reject(message)
        }
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}