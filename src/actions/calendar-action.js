import _ from 'lodash';
import {  } from './action-types'
import NetworkManager from '../modules/NetworkManager'
import ApiConfig from '../config/api-config'


export function addEvent(data) {

  return async function (dispatch, getState) {

    return NetworkManager.request(ApiConfig.calendar.addEvent(data))
      .then(response => {
       
        return Promise.resolve(response.data)

      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function deleteEvent(data) {

  return async function (dispatch, getState) {

    return NetworkManager.request(ApiConfig.calendar.deleteEvent(data))
      .then(response => {
     
        return Promise.resolve(response.data)

      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}


export function editEvent(data) {

  return async function (dispatch, getState) {

    return NetworkManager.request(ApiConfig.calendar.editEvent(data))
      .then(response => {
     
        return Promise.resolve(response.data)

      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}