import { combineReducers } from 'redux'
import { CLEAR_STATE, GET_STATE } from '../actions/action-types'
import { reachabilityReducer } from '../utils'
import appReducer from './app-reducer'
import userReducer from './user-reducer'
import authReducer from './auth-reducer'
import postsReducer from './posts-reducer'
import notificationsReducer from './notifications-reducer'
import chatReducer from './chat-reducer'
import toursReducer from './tour-reducer'
import recommenReducer from './recommenFriend-reducer'
import testReduecr from './testReduecr'
import agentApplyGuiderReducer from './agent-apply-guider-reducer'

const reducers = combineReducers({
  auth: authReducer,
  user: userReducer,
  app: appReducer,
  posts: postsReducer,
  notification: notificationsReducer,
  tours: toursReducer,
  chat: chatReducer,
  netInfo: reachabilityReducer,
  recommend: recommenReducer,
  test: testReduecr,
  agentApplyGuiderReducer: agentApplyGuiderReducer
})

const rootReducers = (state, action) => {

  if (action.type === CLEAR_STATE) {
    state = {};
    return state
  }

  if (action.type === GET_STATE) {
    return state
  }

  return reducers(state, action);
};

export default rootReducers;