import { GET_APP_INFO, GET_STATE, CLEAR_STATE, createAction, TEST_ACTION, GET_CHECKIN_DATA } from './action-types'
import NetworkManager from '../modules/NetworkManager'
import ApiConfig from '../config/api-config'
import _ from 'lodash';
import apiConfig from '../config/api-config';

export function clearState() {
  return { type: CLEAR_STATE }
}

export function getState() {
  return { type: GET_STATE }
}

export function getListLanguage() {

  return async function (dispatch, getState) {
    return NetworkManager.requestWithoutToken(ApiConfig.app.getListLanguage())
      .then(response => {
        // data

        let language = _.get(response.data, 'data.language')
        return Promise.resolve(language)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}


export function getCheckIn(page) {

  return async function (dispatch) {
    return NetworkManager.request(ApiConfig.auth.getApiCheck(page))
      .then((res) => {


        //nếu muốn trả về reducer thì sao
        dispatch(createAction(GET_CHECKIN_DATA,
          //{ res: res, page: page }
          res
          , true))
        return Promise.resolve(res)
      })
      .catch(error => {
        return Promise.reject(error)
      });

  }
}

//term and policy
export function getTermAndPolicy() {

  return async function (dispatch) {
    return NetworkManager.requestWithoutToken(ApiConfig.app.getTermPolicy())
      .then((res) => {
        // console.log("object", res);
        if (res.data && res.data.result == 'success') {
          return Promise.resolve(res.data.terms)
        }
      })
      .catch(error => {
        return Promise.reject(error)
      });

  }
}
