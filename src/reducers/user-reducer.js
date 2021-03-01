import {
  GET_MY_INFO,
  SUCCESS,
  URL_USER,
  GET_USER_INFO,
  UPDATE_USER_INFO,
  GET_TOUR_GUIDE_LIKE,
  GET_LIST_AlBUM,
  GET_ALBUM_DETAIL,
  GET_UPLOAD_IMAGES,
  SEARCH_FRIEND,
  GET_UPLOAD_IMAGES_GROUP,
  REQUEST_ADD_FRIEND,
  REQUEST_GET_LIST_FRIEND,
  COMFIRM_REQUEST_ADD_FRIEND

} from '../actions/action-types'

import UserManager from '../modules/UserManager';
import _ from 'lodash';

const initialState = {
  listAlbum: [],
  uploadImages: [],
  albumDetail: [],
  friendSearch: [],
  getListFriendsMeOrOther: [],
  uploadImagesGroup: []
  // requestAddFriend: {}
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${GET_MY_INFO}_${SUCCESS}`:
      // user id
      const user = action.payload

      return {
        ...state,
        me: user
      };

    case `${GET_USER_INFO}_${SUCCESS}`:
      // user id
      const other_user = action.payload

      return {
        ...state,
        me: other_user
      };
    //danh sach yeu cau kb  
    case `${REQUEST_ADD_FRIEND}_${SUCCESS}`:
      // user id
      const list_request = action.payload
      return {
        ...state,
        requestAddFriend: list_request
      };
    case `${COMFIRM_REQUEST_ADD_FRIEND}_${SUCCESS}`:
      // user id
      return {
        ...state,
      };
    case `${REQUEST_GET_LIST_FRIEND}_${SUCCESS}`:
      const dataFriends = action.payload

      return {
        ...state,
        getListFriendsMeOrOther: action.payload
      };
    case `${UPDATE_USER_INFO}_${SUCCESS}`:
      return {
        ...state,
      };
    case `${URL_USER}_${SUCCESS}`:
      // user id
      const url_user = action.payload
      const me = { ...state.me, url_user }
      return {
        ...state,
        me
      };
    //  MOI THEM 5/8
    case `${GET_TOUR_GUIDE_LIKE}_${SUCCESS}`:
      const tour_guide_user = action.payload

      return {
        ...state,
        me: tour_guide_user
      };
    case `${GET_LIST_AlBUM}_${SUCCESS}`:
      return {
        ...state,
        listAlbum: action.payload
      }
    case `${GET_ALBUM_DETAIL}_${SUCCESS}`:
      return {
        ...state,
        albumDetail: action.payload
      }
    case `${GET_UPLOAD_IMAGES}_${SUCCESS}`:
      return {
        ...state,
        uploadImages: action.payload
      }
    case `${SEARCH_FRIEND}_${SUCCESS}`:
      return {
        ...state,
        friendSearch: action.payload
      }
    case `${GET_UPLOAD_IMAGES_GROUP}_${SUCCESS}`:
      return {
        ...state,
        uploadImagesGroup: action.payload
      }
    default:
      return state
  }
}

export default userReducer
