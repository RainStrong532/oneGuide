import NetworkManager from './NetworkManager'
import DataManager from './DataManager'
import ApiConfig from '../config/api-config';

const ACCESS_TOKEN = 'ACCESS_TOKEN';
const REFRESH_TOKEN = 'REFRESH_TOKEN';
let accessToken = null;

// Refresh token
const saveRefreshToken = async (refresh_token) => {
  return DataManager.saveValue(refresh_token, REFRESH_TOKEN)
}

const getRefreshToken = async () => {

  try {
    const refresh_token = await DataManager.getValue(REFRESH_TOKEN);
    if (refresh_token) {
      return Promise.resolve(refresh_token)
    }
  } catch (error) {
  }

  return Promise.reject(false)
}

// Access token
const saveAccessToken = async (access_token) => {
  accessToken = access_token
  return DataManager.saveValue(access_token, ACCESS_TOKEN)
}

const getAccessToken = async () => {

  try {
    const access_token = await DataManager.getValue(ACCESS_TOKEN);
    if (access_token) {
      accessToken = access_token
      return Promise.resolve(access_token)
    }
  } catch (error) {
  }

  return Promise.reject(false)
}

const clearToken = async () => {

  return Promise.all([saveAccessToken(null), saveRefreshToken(null)]).
    then((values) => {
      return Promise.resolve(true)
    }).catch(() => {
      return Promise.reject(false)
    })
}

// adapterHandler
const authenticationHeader = async () => {

  if (accessToken) {
    return Promise.resolve(`Bearer ${accessToken}`)
  }

  try {
    const access_token = await getAccessToken();
    return Promise.resolve(`Bearer ${access_token}`)
  } catch (e) {
  }

  return Promise.resolve(null)
}

// retryHandler
let unauthorizedReqQueue = [];
const retryHandler = async (error, orgConfig) => {

  // check if error is not 401 or is not unauthorized type
  if (error.status !== 401) {
    return Promise.reject(error);
  }

  // check if orgConfig contain Authorization key
  if (!orgConfig.headers.Authorization) {
    return Promise.reject(error);
  }

  //================== 401 Unauthorized ================== 

  // create new promise
  let newReqPromise = new Promise((resolve, reject) => {

    let newOrgConfig = { ...orgConfig }
    // delete newOrgConfig.headers.Authorization

    const callback = async (success) => {

      if (success !== true) {
        return reject(error)
      }

      try {
        const resp = await NetworkManager.request(newOrgConfig);
        return resolve(resp);
      } catch (e) {
        return reject(e);
      }
    };

    // add callback
    unauthorizedReqQueue.push(callback);
  });

  // create request to refresh token
  getTokenAndCallBack()

  // next
  return newReqPromise;
}

// get refresh token
let isRefreshingToken = false;
const getTokenAndCallBack = () => {

  if (isRefreshingToken === false) {
    isRefreshingToken = true;

    // get token
    getTokenFromServer().then((token) => {

      if (token) {
        // save tokens
        accessToken = token.access_token
        const refresh_token = token.refresh_token
        saveAccessToken(accessToken)
        saveRefreshToken(refresh_token)
        return true
      } else {
        return false
      }
    }).catch(failure => {
      return failure
    }).then(isSuccess => {

      // request again
      unauthorizedReqQueue.forEach(callback =>
        callback(isSuccess)
      );
      unauthorizedReqQueue = []
      isRefreshingToken = false;
    });
  }
}

const getTokenFromServer = async () => {

  const refresh_token = await getRefreshToken()
  if (!refresh_token) {
    return Promise.reject(null)
  }

  // Request
  return NetworkManager.loginBasic(ApiConfig.auth.login(), refresh_token)
    .then(function (response) {
      const access_token = response.data.response.token
      if (access_token) {
        return Promise.resolve({ access_token, refresh_token })
      } else {
        return Promise.reject(null)
      }
    })
    .catch(function (error) {
      return Promise.reject(null)
    });
}

export default {
  retryHandler,
  authenticationHeader,
  saveAccessToken,
  saveRefreshToken,
  getAccessToken,
  clearToken
}