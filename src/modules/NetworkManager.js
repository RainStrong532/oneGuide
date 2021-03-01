import axios from 'axios';
import Config from 'react-native-config'
import { i18next } from '../utils';

const BASE_URL = Config.BASE_URL
const timeout = 30000
const commonHeaders = {
  'Content-Type': 'application/json'
}

// interceptors request
const interceptorsRequestSuccess = (config) => {
  return config;
}

// interceptors response
const interceptorsResponseSuccess = (response) => {
  return handlerResponse(response);
}

const interceptorsResponseError = async (error) => {

  // error handler
  const newError = handlerError(error)

  // error was made from server
  if (error.config &&
    error.config.usingRetrier === true) {
    const OAuthHandler = require('../modules/OAuthHandler').default
    return OAuthHandler.retryHandler(newError, error.config)
  }

  return Promise.reject(newError)
}

const handlerResponse = (response) => {
  const newResponse = { ...response };
  delete newResponse.config
  delete newResponse.headers
  delete newResponse.request
  return newResponse;
}

const handlerError = (error) => {

  // error was made from server
  if (error.response) {

    const newError = { ...error.response };
    if (newError.config) {
      delete newError.config
    }
    if (newError.headers) {
      delete newError.headers
    }
    if (newError.request) {
      delete newError.request
    }
    return newError

  } else if (error.request) {

    // const newError = {
    //   data: {
    //     messages: [{ message: i18next.t('noNetWorkConnection') }]
    //   },
    //   status: error.request.status
    // };

    const newError = i18next.t('noNetWorkConnection')
    return newError
  }

  // other
  let newError = { data: {}, status: -600 };
  if (!error.data) {
    newError = { ...newError, data: { ...error } };
  } else {
    newError = { ...newError, ...error };
  }

  return newError
}

// Create request
// const axiosInstance = axios.create();
// axiosInstance.defaults.timeout = timeout;
// axiosInstance.interceptors.request.use(interceptorsRequestSuccess, null);
// axiosInstance.interceptors.response.use(interceptorsResponseSuccess, interceptorsResponseError)

const createRequest = async (config) => {

  // set base url
  const headers = { ...commonHeaders, ...config.headers }
  const newConfig = { ...config, baseURL: BASE_URL, headers }
  // base url
  if (newConfig.needBaseUrl === false) {
    delete newConfig.baseURL
  }


  // create a axios instance
  const axiosInstance = axios.create();
  axiosInstance.defaults.timeout = timeout;
  axiosInstance.interceptors.request.use(interceptorsRequestSuccess, null);
  axiosInstance.interceptors.response.use(interceptorsResponseSuccess, interceptorsResponseError)

  // return
  return axiosInstance(newConfig)
}

const request = async (config) => {

  // Authentication
  const OAuthHandler = require('../modules/OAuthHandler').default
  const authen_header = await OAuthHandler.authenticationHeader()
  const headers = { ...config.headers, Authorization: authen_header }

  // using retrier
  const newConfig = { ...config, headers, usingRetrier: false }
  console.log("data call api", newConfig);
  return createRequest(newConfig)
}

const requestWithoutToken = async (config) => {

  // request
  return createRequest(config)
}

// Cancel request
const CancelToken = axios.CancelToken;
const sourceCancel = () => {
  return CancelToken.source();
}

const cancelRequest = (source, message) => {
  if (source) {
    source.cancel(message)
  }
}

const isCancel = (error) => {
  return axios.isCancel(error)
}

export default {
  request,
  requestWithoutToken,
  cancelRequest,
  sourceCancel,
  isCancel,
}

