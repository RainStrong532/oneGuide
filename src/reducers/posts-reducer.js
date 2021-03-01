import {
  GET_NEW_POSTS, SUCCESS, LIKE_POST,
  CREATE_NEW_POST,
  CREATE_NEW_POST_OTHER,
  DELETE_POST,
  CREATE_COMMENT,
  GET_POSTS_OTHER_USER,
  ADD_POST_STORAGE,
  GET_POST_AGENT,
  LIKE_AGENT_HOME,
  SEARCH_ACTION,
  GET_SEARCH_ALL, GET_SEARCH_USER,
  GET_SEARCH_POST,
  GET_SEARCH_TOUR,
  GET_lIST_COMMENTS,
  LIKE_TOUR_SEARCH,
  JOIND_GROUP_SEARCH,
  OUT_GROUP_SEARCH,
  GUIDE_APPLY_TOUR,
  CREATE_COMMENT_SEARCH_ALL,
  CREATE_COMMENT_SEARCH_ALL_POST,
  LIKE_POST_SEARCH,
  LIKE_POST_PROFILE,
  CREATE_COMMENT_PROFILE,
  CREATE_COMMENT_SEARCH_TOTAL_POST,
  CREATE_COMMENT_SEARCH_TOTAL_TOUR,
  DELETE_POST_PROFILE,
  APPLY_TOUR_PROFILE
} from '../actions/action-types'
import _ from 'lodash';

const initialState = {
  newfeeds: [],
  postAgentHome: [],
  listPostSearch: [],
  listTourSearch: [],
  listUserSearch: [],
  totalUser: [],
  totalPost: [],
  totalTour: [],
  comments: [],
  newfeedOther: [],
  listUserGroup: []
};

const postsReducer = (state = initialState, action) => {

  switch (action.type) {
    case `${GET_NEW_POSTS}_${SUCCESS}`:
    // return {
    //   ...state,
    //   newfeeds: action.payload
    // }
    case `${LIKE_POST}_${SUCCESS}`:
    case `${CREATE_NEW_POST}_${SUCCESS}`:
    case `${DELETE_POST}_${SUCCESS}`:
      // console.log('acionvapayload', action.payload);
      // new state
      let newState = { ...state, newfeeds: action.payload };
      newState = _.cloneDeep(newState);
      return newState
    case `${CREATE_COMMENT}_${SUCCESS}`:
      return {
        ...state,
        newfeeds: action.payload
      }
    case `${GET_POSTS_OTHER_USER}_${SUCCESS}`:
      let newStateOther = { ...state, newfeedOther: action.payload };
      // console.log('action.payload', { newStateOther });
      newStateOther = _.cloneDeep(newStateOther);
      return newStateOther
    //   newfeedOther: action.payload
    // }
    case `${CREATE_NEW_POST_OTHER}_${SUCCESS}`:
      // console.log('post other user', action.payload);
      // return {
      //   ...state,
      //   newfeedOther: action.payload
      // }

      let newPostOther = { ...state, newfeedOther: action.payload };
      newPostOther = _.cloneDeep(newPostOther);
      return newPostOther

    case `${ADD_POST_STORAGE}_${SUCCESS}`:
      if (state.newfeeds.length) {
        return state
      }
      return {
        ...state,
        newfeeds: action.payload,

      }

    case `${GET_POST_AGENT}_${SUCCESS}`:

      let newStateAgentHome = { ...state, postAgentHome: action.payload };
      newStateAgentHome = _.cloneDeep(newStateAgentHome);
      return newStateAgentHome
    case `${LIKE_AGENT_HOME}_${SUCCESS}`:
      let post
      //xu ly du lieu ben api tra ve 
      let currPost = JSON.parse(JSON.stringify(state.postAgentHome))
      const idx = currPost.findIndex(item => item.comment_id == action.payload.comment_id)
      post = currPost[idx]
      let total_likes_currPost = parseInt(post.total_likes)
      let like_comment;
      if (action.payload.res == "active") {

        total_likes_currPost = total_likes_currPost + 1
        like_comment = "active"
      }
      if (action.payload.res == "not active") {

        total_likes_currPost = total_likes_currPost - 1,
          like_comment = "Not active"
      }
      // if (action.payload.)
      post.like_comment = like_comment
      post.total_likes = total_likes_currPost
      return {

        ...state,
        postAgentHome: currPost
      }

    case `${SEARCH_ACTION}_${SUCCESS}`:

      let newStateAgentHomeSearch = { ...state, postAgentHome: action.payload };
      newStateAgentHomeSearch = _.cloneDeep(newStateAgentHomeSearch);
      return newStateAgentHomeSearch

    case `${GET_SEARCH_ALL}_${SUCCESS}`:
      // console.log('====================================');
      // console.log(action.payload, "dzzzzzzzzzzzzzzzzzzzzzzzzzzz");
      // console.log('====================================');
      // console.log("action va payload", action);
      return {
        ...state,
        listPostSearch: action.payload.post ? action.payload.post.comments : [],
        listTourSearch: action.payload.tour ? action.payload.tour.comments : action.payload.guide.comments,
        listUserSearch: action.payload.users,
        listUserGroup: action.payload.group
      }

    case `${GET_SEARCH_USER}_${SUCCESS}`:
      return {
        ...state,
        totalUser: action.payload.users
      }

    case `${GET_SEARCH_POST}_${SUCCESS}`:
      return {
        ...state,
        totalPost: action.payload
      }

    case `${LIKE_TOUR_SEARCH}_${SUCCESS}`:

      let newStateTour = { ...state, listTourSearch: action.payload };
      newStateTour = _.cloneDeep(newStateTour);
      return newStateTour

    // return {
    //   ...state,
    //   listTourSearch: action.payload
    // }

    case `${GET_SEARCH_TOUR}_${SUCCESS}`:
      // console.log('action like tour search', action.payload);
      return {
        ...state,
        totalTour: action.payload
      }
    case `${GET_lIST_COMMENTS}_${SUCCESS}`:
      return {
        ...state,
        comments: action.payload
      }
    case `${JOIND_GROUP_SEARCH}_${SUCCESS}`:
      let newStateJoinGroup = { ...state, listUserGroup: action.payload };
      newStateJoinGroup = _.cloneDeep(newStateJoinGroup);
      return newStateJoinGroup

    case `${OUT_GROUP_SEARCH}_${SUCCESS}`:
      // console.log('ách sừn và payload', action.payload);
      let newStateOutGroup = { ...state, listUserGroup: action.payload };
      newStateOutGroup = _.cloneDeep(newStateOutGroup);
      return newStateOutGroup
    case `${GUIDE_APPLY_TOUR}_${SUCCESS}`:
      // console.log("action.payload sau ghi apply", action.payload);
      let newStatePostAgent = { ...state, postAgentHome: action.payload };
      newStatePostAgent = _.cloneDeep(newStatePostAgent);
      return newStatePostAgent


    case `${CREATE_COMMENT_SEARCH_ALL}_${SUCCESS}`:
      // console.log("action.payload sau ghi apply", action.payload);
      return {
        ...state,
        listTourSearch: action.payload
      }
    case `${CREATE_COMMENT_SEARCH_ALL_POST}_${SUCCESS}`:
    // console.log("action.payload sau ghi apply", action.payload);
    // case `${GUIDE_APPLY_TOUR}_${SUCCESS}`:
    //   console.log("action.payload sau ghi apply", action.payload);
    //   return {
    //     ...state,
    //     postAgentHome: action.payload
    //   }

    case `${LIKE_POST_SEARCH}_${SUCCESS}`:
      let newData = { ...state, listPostSearch: action.payload };
      newData = _.cloneDeep(newData);
      return newData
    case `${LIKE_POST_PROFILE}_${SUCCESS}`:
      let newLikeState = { ...state, newfeedOther: action.payload };
      newLikeState = _.cloneDeep(newLikeState);
      return newLikeState

    // let newDatapostProfile = { ...state, newfeedOther: action.payload };
    // newDatapostProfile = _.cloneDeep(newDatapostProfile);
    // return newDatapostProfile
    case `${CREATE_COMMENT_PROFILE}_${SUCCESS}`:
      let newCreateState = { ...state, newfeedOther: action.payload };
      newCreateState = _.cloneDeep(newCreateState);
      return newCreateState
    case `${CREATE_COMMENT_SEARCH_TOTAL_POST}_${SUCCESS}`:
      return {
        ...state,
        totalPost: action.payload
      }
    case `${CREATE_COMMENT_SEARCH_TOTAL_TOUR}_${SUCCESS}`:
      return {
        ...state,
        totalTour: action.payload
      }

    case `${DELETE_POST_PROFILE}_${SUCCESS}`:;
      let newDeleteProfile = { ...state, newfeedOther: action.payload };
      newDeleteProfile = _.cloneDeep(newDeleteProfile);
      return newDeleteProfile

    case `${APPLY_TOUR_PROFILE}_${SUCCESS}`:
      let newPost = { ...state, newfeedOther: action.payload };
      newPost = _.cloneDeep(newPost);
      return newPost
    default:
      return state
  }
}

export default postsReducer
