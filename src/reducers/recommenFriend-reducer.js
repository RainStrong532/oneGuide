import {
  SUCCESS,
  GET_RECOMMEND_FRIEND
} from '../actions/action-types'

import _ from 'lodash';

const initialState = {
  listFriendRecommend: []
};

const recommendReducer = (state = initialState, action) => {
  switch (action.type) {

    case `${GET_RECOMMEND_FRIEND}_${SUCCESS}`:
      return {
        ...state,
        listFriendRecommend: action.payload
      }
    default:
      return state
  }
}

export default recommendReducer
