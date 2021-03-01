import { LOGIN, REGISTER, SUCCESS, UPDATE_INFO, REGISTER_FINISH } from '../actions/action-types'
import OAuthHandler from '../modules/OAuthHandler'
import _ from 'lodash';

const initialState = {
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${LOGIN}_${SUCCESS}`:

      // get token and save
      const access_token = _.get(action.payload.data, 'data.access_token')
      OAuthHandler.saveAccessToken(access_token)

      return {
        ...state,
        access_token
      };
    case `${REGISTER}_${SUCCESS}`:

      const access_token_register = _.get(action.payload.data, 'data.access_token')
      OAuthHandler.saveAccessToken(access_token_register)
      return {
        ...state,
        access_token
      }

    case `${REGISTER_FINISH}_${SUCCESS}`:
      return {
        ...state,
      }

    case `${UPDATE_INFO}_${SUCCESS}`:

      // get token and save
      // const access_token_update = _.get(action.payload.data, 'data.access_token')
      // OAuthHandler.saveAccessToken(access_token_update)

      return {
        ...state,
        // access_token_update
      }
    default:
      return state
  }
}

export default authReducer
