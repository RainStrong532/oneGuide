import { GET_MY_INFO, GET_APP_INFO, SUCCESS, ERROR, GET_CHECKIN_DATA, POST_CHECKIN_DATA } from '../actions/action-types'

const initialState = {

  ListInPost: [],
  highlights_user: [],
  highlights: [],
  highlights_notCheckIn: [],
  Allhighlights: [],
  highlightMe: [],
  photo: []
};

const appReducer = (state = initialState, action) => {

  switch (action.type) {
    case `${GET_APP_INFO}_${SUCCESS}`:
      return {
        ...state,
        ...action.payload
      }
    case `${GET_MY_INFO}_${SUCCESS}`:

      let highlights_notCheckIn = {
        avatar: action.payload.avatar,
        username: action.payload.username
      }

      return {
        ...state,
        highlights_notCheckIn: [highlights_notCheckIn]
      };

    case `${GET_CHECKIN_DATA}_${SUCCESS}`:

      const { data } = action.payload.data || []

      if (data.highlights_user.length === 0) {
        state.highlights_user = state.highlights_notCheckIn

      }
      else {
        state.highlights_user = data.highlights_user
      }


      if (data.highlights) {
        state.highlights = data.highlights
      }
      return {
        ...state,
        highlights_user: data.highlights_user,
        Allhighlights: [...state.highlights_user, ...state.highlights]
      }
    case `${POST_CHECKIN_DATA}_${SUCCESS}`:

      const { comment } = action.payload.data || []
      if (comment && comment.photo && comment.photo.photos) {
        state.photo = comment.photo.photos
      }
      state.highlights_user = [{
        ...comment,
        photo: state.photo[0]
      }]

      return {
        ...state,

        Allhighlights: [...state.highlights_user, ...state.highlights]
      }
    default:
      return state
  }
}

export default appReducer

