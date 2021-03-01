import { GET_NEW_NOTIFICATIONS, SUCCESS, DELETE_NOTIFICATION, LIKE_POST_NOTIFICATION } from '../actions/action-types'
import _ from 'lodash';
import { State } from 'react-native-image-zoom-viewer/built/image-viewer.type';

const initialState = {
  notifications: []
};

const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${GET_NEW_NOTIFICATIONS}_${SUCCESS}`:
      // const notificationList = action.payload
      // let notificationComment
      // notificationList.forEach(element => {
      //   if (element.type === 'comment') {
      //     notificationComment.push(element)
      //   }
      // });
      let newStateNoti = { ...state, notifications: action.payload };
      newStateNoti = _.cloneDeep(newStateNoti);
      return newStateNoti
    case `${DELETE_NOTIFICATION}_${SUCCESS}`:

      // new state
      let newState = { ...state, notifications: action.payload };
      newState = _.cloneDeep(newState);
      return newState

    case `${LIKE_POST_NOTIFICATION}_${SUCCESS}`:

      // new state
      // let newState = { ...state, notifications: action.payload };
      // newState = _.cloneDeep(newState);
      return {
        ...state,
        notifications: action.payload
      }
    default:
      return state
  }
}

export default notificationsReducer
