import _ from 'lodash';
import { LOGIN, REGISTER, UPDATE_INFO, REGISTER_FINISH, createAction } from './action-types'
import NetworkManager from '../modules/NetworkManager'
import ApiConfig from '../config/api-config'
import ImageUtils from '../utils/ImageUtils'

export function login(data) {

    return async function (dispatch) {
        return NetworkManager.requestWithoutToken(ApiConfig.auth.login(data))
            .then(response => {
                const result = _.get(response, 'data.result')
                if (result === 'success') {
                    dispatch(createAction(LOGIN, response, true))
                }

                return Promise.resolve(response)
            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}
export function confirmAccount(pass_reset_key) {

    return async function (dispatch) {
        return NetworkManager.request(ApiConfig.auth.confirmAccount(pass_reset_key))
            .then(response => {

                // const message = _.get(response, 'data.message')
                // if (message === 'Success') {
                //   dispatch(createAction(LOGIN, response, true))
                // }

                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}

export function register(account, password, fullname, type, provider) {

    return async function (dispatch) {
        return NetworkManager.requestWithoutToken(ApiConfig.auth.register(account, password, fullname, type, provider))
            .then(response => {
                dispatch(createAction(REGISTER, response, true))
                return Promise.resolve(response)
            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}

export function registerFinish(data) {

    return async function (dispatch) {
        return NetworkManager.request(ApiConfig.auth.registerFinish(data))
            .then(response => {
                dispatch(createAction(REGISTER_FINISH, response, true))
                return Promise.resolve(response)
            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}

export function updateInfo(file, data) {

    return async function () {
        return ImageUtils.resizeDefault(file)
            .then(data_resizer => {
                const body = new FormData();
                body.append('image_card', {
                    uri: data_resizer.path,
                    name: data_resizer.file_name,
                    type: 'image/jpg'
                });
                Object.keys(data).forEach(key => body.append(key, data[key]))
                return NetworkManager.request(ApiConfig.auth.updateInfo(body))
                    .then(response => {
                        // dispatch(createAction(UPDATE_INFO, response, true))
                        return Promise.resolve(response)
                    })
                    .catch(error => {
                        return Promise.reject(error)
                    });

            }).catch((err) => {
                return Promise.reject(null)
            });
    }
}

export function logout() {
    return async function () {
        return NetworkManager.request(ApiConfig.auth.logout())
            .then(response => {
                return Promise.resolve(response)
            })
            .catch(error => {
                return Promise.resolve(error)
            })
    }
}

export function resetPassword(email) {
    return async function () {
        return NetworkManager.requestWithoutToken(ApiConfig.auth.resetPassword(email))
            .then(response => {
                //   console.log("reponse reset pass", response);
                return Promise.resolve(response)
            })
            .catch(error => {
                return Promise.resolve(error)
            })
    }
}
export function verify(data) {
    console.log("1111111111111111111", data)
    return async function () {
        return NetworkManager.request(ApiConfig.auth.verify(data))
            .then(response => {
                console.log("request xác thực tài khoản", response);
                return Promise.resolve(response)
            })
            .catch(error => {
                return Promise.resolve(error)
            })
    }
}