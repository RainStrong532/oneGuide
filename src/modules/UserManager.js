import DataManager from './DataManager'
import OAuthHandler from './OAuthHandler'

const USER_ID = 'USER_ID'
const SKIP_TUTORIAL = 'SKIP_TUTORIAL'
// Refresh token
const saveUserId = async (userId) => {
  return DataManager.saveValue(userId, USER_ID)
}

const currentUserId = async () => {

  try {
    const user_id = await DataManager.getValue(USER_ID);
    if (user_id) {
      return Promise.resolve(user_id)
    }
  } catch (error) {
  }

  return Promise.reject(null)
}

const logout = async () => {
  return Promise.all([DataManager.clearAllData([USER_ID, SKIP_TUTORIAL]), OAuthHandler.clearToken()]).
    then((values) => {
      return Promise.resolve(true)
    }).catch(() => {
      return Promise.reject(false)
    })
}


export default {
  logout,
  saveUserId,
  currentUserId
}
