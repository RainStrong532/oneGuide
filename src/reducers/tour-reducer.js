
import {
  GET_TOUR_APPLIED, SUCCESS, GET_GROUP_HOME, SEARCH_ACTION, GET_TOUR_UPCOMING,
  GET_TOUR_DEPARTED, GET_TOUR_CANCEL, GET_GROUP_DETAIL,
  GET_TOUR_FINISH,
  GET_USER_APPLY,
  GET_POST_AGENT,
  GET_GROUP_INFORMATION,
  POST_GROUP_HOME,
  GET_MEMBER_GROUP,
  POST_OUT_GROUP,
  OUT_GROUP_HOME,
  JOIND_GROUP_SEARCH,
  LIKE_POST_GROUP,
  GET_MEMBER_APPOVAL,
  POST_MEMBER_REQUEST,
  GET_LISTAPPROVLI_GROUP,
  POST_LISTAPPOVAIL_REQUEST,
  LIKE_POST_HOME_GROUP,
  COMMENT_POST_HOME_GROUP,
  DELETE_POST_HOME_GROUP,
  REQUEST_GET_ORTHER,
  REQUEST_POST_INVITE,
  CREATE_NEW_POST_GROUP,
  DELETE_POST_GROUP,
  GET_GUIDER_FINISH,
  INVITE_GUIDER,
  GET_LIST_TRACKING_HISTORY,
  GET_LIST_POST_TIP,
  GET_LIST_RATING_INFO,
  GET_LIST_REPORT,
  GET_LIST_HOT_RELATED
} from '../actions/action-types'
import _ from 'lodash';

const initialState = {
  tours: [],
  post: '',
  listPostGroup: [],
  pagePostGroup: 1,
  joinGroup: '',
  listMember: [],
  //pageListMember: 1,
  pageListApproval: 1,
  outGroup: '',
  grade_Level_group_joined: [],
  grade_Level_group_orther: [],
  grade_Level_list_post: [],
  data_group: [],
  appoval_member: [],
  status_member: '',
  listPostApproval: [],
  infoGroup: [],
  actionListPostApproval: [],
  pageListMembers: 1,
  listPostApproval_message: '',
  list_Other: [],
  status_Invite: '',
  listGuider: [],
  listTracking: [],
  listPostTip: [],
  listRatingInfo: [],
  listReport: [],
  listTourUpcomming: [],
  listTourDeparted: []
};

const toursReducer = (state = initialState, action) => {
  switch (action.type) {

    //Applied
    case `${GET_TOUR_APPLIED}_${SUCCESS}`:
      let newStateApplied = { ...state, tours: action.payload };
      newStateApplied = _.cloneDeep(newStateApplied);
      return newStateApplied

    //Upcoming
    case `${GET_TOUR_UPCOMING}_${SUCCESS}`:

      let newStateUpcoming = { ...state, listTourUpcomming: action.payload };
      newStateUpcoming = _.cloneDeep(newStateUpcoming);
      return newStateUpcoming

    //Departed
    case `${GET_TOUR_DEPARTED}_${SUCCESS}`:

      let newStateDeparted = { ...state, listTourDeparted: action.payload };
      newStateDeparted = _.cloneDeep(newStateDeparted);
      return newStateDeparted

    //Cancel
    case `${GET_TOUR_CANCEL}_${SUCCESS}`:

      let newStateCancel = { ...state, tours: action.payload };
      newStateCancel = _.cloneDeep(newStateCancel);
      return newStateCancel

    //Finish
    case `${GET_TOUR_FINISH}_${SUCCESS}`:

      let newStateFinish = { ...state, tours: action.payload };
      newStateFinish = _.cloneDeep(newStateFinish);
      return newStateFinish

    case `${GET_USER_APPLY}_${SUCCESS}`:

      let newStateUserApply = { ...state, tours: action.payload };
      newStateUserApply = _.cloneDeep(newStateUserApply);
      return newStateUserApply


    case `${POST_GROUP_HOME}_${SUCCESS}`:

      // Save current data of all groups
      let tempData = JSON.parse(JSON.stringify(state.grade_Level_group_orther))
      // Find clicked group and change it's status
      let clickedGroupIdx = tempData.findIndex(item => item.id == action.payload.id)
      // Found group => Change status
      if (clickedGroupIdx !== -1)
        tempData[clickedGroupIdx].submitted_request = "yes"

      if (clickedGroupIdx !== -1) tempData[clickedGroupIdx].checkInvitedGroup = "0"
      return {
        ...state,
        grade_Level_group_orther: tempData
      }
    case `${OUT_GROUP_HOME}_${SUCCESS}`:

      // Save current data of all groups
      let tempData_out = JSON.parse(JSON.stringify(state.grade_Level_group_orther))
      // Find clicked group and change it's status
      let clickedGroupIdx_out = tempData_out.findIndex(item => item.id == action.payload.id)
      // Found group => Change status
      if (clickedGroupIdx_out !== -1) tempData_out[clickedGroupIdx_out].submitted_request = "no"
      if (clickedGroupIdx !== -1) tempData_out[clickedGroupIdx_out].checkInvitedGroup = "0"
      return {
        ...state,
        grade_Level_group_orther: tempData_out

      }


    case `${GET_GROUP_HOME}_${SUCCESS}`:

      return {
        ...state,
        grade_Level_group_joined: action.payload.data.group_joined,
        grade_Level_group_orther: action.payload.data.group_orther,
        grade_Level_list_post: action.payload.data.list_post,
        data_group: action.payload.data

      }


    case `${GET_GROUP_DETAIL}_${SUCCESS}`:

      // return {
      //   ...state,
      //   listPostGroup: action.payload,
      // }
      let ListPost = { ...state, listPostGroup: action.payload };
      ListPost = _.cloneDeep(ListPost);
      return ListPost

    case `${CREATE_NEW_POST_GROUP}_${SUCCESS}`:
      // return {
      //   ...state,
      //   listPostGroup: action.payload,
      // }
      let newListPost = { ...state, listPostGroup: action.payload };
      newListPost = _.cloneDeep(newListPost);
      return newListPost


    case `${DELETE_POST_GROUP}_${SUCCESS}`:
      let newListPostDelete = { ...state, listPostGroup: action.payload };
      newListPostDelete = _.cloneDeep(newListPostDelete);
      return newListPostDelete

    case `${GET_LIST_TRACKING_HISTORY}_${SUCCESS}`:
      return {
        ...state,
        listTracking: action.payload

      }
    case `${GET_LIST_HOT_RELATED}_${SUCCESS}`:
      return {
        ...state,
        listHotPostRelated: action.payload

      }

    case `${GET_LIST_POST_TIP}_${SUCCESS}`:
      return {
        ...state,
        listPostTip: action.payload

      }

    case `${GET_LIST_RATING_INFO}_${SUCCESS}`:
      return {
        ...state,
        listRatingInfo: action.payload

      }
    case `${GET_MEMBER_GROUP}_${SUCCESS}`:
      return {
        ...state,
        listMember: action.payload
        // pageListMembers: state.pageListMembers + 1

      }
    case `${POST_OUT_GROUP}_${SUCCESS}`:

      return {
        ...state,
        outGroup: action.payload

      }
    case `${GET_MEMBER_APPOVAL}_${SUCCESS}`:
      return {
        ...state,
        appoval_member: action.payload.data.data

      }
    case `${POST_MEMBER_REQUEST}_${SUCCESS}`:
      // Save current data of all groups

      let status_member = JSON.parse(JSON.stringify(state.appoval_member))
      let clickedGroupIdx_out_ = status_member.findIndex(el => el.user_id == action.payload.id_user)
      let message = action.payload.data.data.message
      //Found group => Change status
      if (clickedGroupIdx_out_ !== -1) {
        if (message == 'Xác nhận thành công') {

          status_member[clickedGroupIdx_out_].status = "Xác nhận thành công"
        }
        if (message == 'Đã gỡ') {
          status_member[clickedGroupIdx_out_].status = "Đã gỡ"
        }
      }
      return {
        ...state,
        //status_member: action.payload,
        appoval_member: status_member

      }


    case `${GET_GROUP_INFORMATION}_${SUCCESS}`:
      return {
        ...state,
        infoGroup: action.payload

      }
    case `${LIKE_POST_GROUP}_${SUCCESS}`:
      return {
        ...state,
        listPostGroup: action.payload,
      }

    case `${GET_LISTAPPROVLI_GROUP}_${SUCCESS}`:
      // let currlistPostApproval = JSON.parse(JSON.stringify(state.listPostApproval))
      // if (state.pageListApproval != 1) currlistPostApproval = currlistPostApproval.concat(action.payload)
      // else {
      //   currlistPostApproval = action.payload.data.data
      // }
      return {
        ...state,
        listPostApproval: action.payload,
        //pageListApproval: state.pageListApproval + 1,
        //listPostApproval_message: action.payload.data

      }
    case `${POST_LISTAPPOVAIL_REQUEST}_${SUCCESS}`:
      // Save current data of all groups
      let status_listpost_appovail = JSON.parse(JSON.stringify(state.listPostApproval))
      let clickedGroupIdx_action__ = status_listpost_appovail.findIndex(el => el.comment_id == action.payload.comment_id)
      // Found group => Change status
      if (clickedGroupIdx_action__ !== -1) status_listpost_appovail[clickedGroupIdx_action__].status = "Đã phê duyệt bài viết"
      return {
        ...state,
        //status_member: action.payload,
        listPostApproval: status_listpost_appovail

      }
    case `${LIKE_POST_HOME_GROUP}_${SUCCESS}`:
      let newData = { ...state, grade_Level_list_post: action.payload };
      newData = _.cloneDeep(newData);
      return newData

    case `${COMMENT_POST_HOME_GROUP}_${SUCCESS}`:
      let newDataComment = { ...state, grade_Level_list_post: action.payload };
      newDataComment = _.cloneDeep(newDataComment);
      return newDataComment

    case `${DELETE_POST_HOME_GROUP}_${SUCCESS}`:
      let newDataDelete = { ...state, grade_Level_list_post: action.payload };
      newDataDelete = _.cloneDeep(newDataDelete);
      return newDataDelete

    ///// get thành viên nhóm để mời tham gia nhóm
    case `${REQUEST_GET_ORTHER}_${SUCCESS}`:
      // let status_listfriend_invite = JSON.parse(JSON.stringify(state.list_Other))
      // let clickedGroupIdx_action_invite_ = status_listfriend_invite.findIndex(el => el.user_id == action.payload.id)
      // if (clickedGroupIdx_action_invite_ !== -1) status_listfriend_invite[clickedGroupIdx_action_invite_].status = "no"
      return {
        ...state,

        list_Other: action.payload.listFriends

      }

    // get guider match tour
    case `${GET_GUIDER_FINISH}_${SUCCESS}`:
      // let status_listfriend_invite = JSON.parse(JSON.stringify(state.list_Other))
      // let clickedGroupIdx_action_invite_ = status_listfriend_invite.findIndex(el => el.user_id == action.payload.id)
      // if (clickedGroupIdx_action_invite_ !== -1) status_listfriend_invite[clickedGroupIdx_action_invite_].status = "no"
      let stateGuider = { ...state, listGuider: action.payload };
      stateGuider = _.cloneDeep(stateGuider);
      return stateGuider


    case `${INVITE_GUIDER}_${SUCCESS}`:
      // let status_listfriend_invite = JSON.parse(JSON.stringify(state.list_Other))
      // let clickedGroupIdx_action_invite_ = status_listfriend_invite.findIndex(el => el.user_id == action.payload.id)
      // if (clickedGroupIdx_action_invite_ !== -1) status_listfriend_invite[clickedGroupIdx_action_invite_].status = "no"
      let newStateGuider = { ...state, listGuider: action.payload };
      newStateGuider = _.cloneDeep(newStateGuider);
      return newStateGuider

    // post gửi lời mời tham gia nhóm
    case `${REQUEST_POST_INVITE}_${SUCCESS}`:
      let status_listfriend_invite = JSON.parse(JSON.stringify(state.list_Other))
      let idx = status_listfriend_invite.findIndex(el => el.user_id == action.payload.user_id)
      let check_invite_group = status_listfriend_invite[idx].check_invite_group
      if (idx !== -1) {
        if (check_invite_group == 'yes') {
          status_listfriend_invite[idx].check_invite_group = 'no'
        }
        if (check_invite_group == 'no') {
          status_listfriend_invite[idx].check_invite_group = 'yes'
        }
      }
      return {
        ...state,

        list_Other: status_listfriend_invite

      }

    case `${GET_LIST_REPORT}_${SUCCESS}`:
      let newListReport = { ...state, listReport: action.payload };
      newListReport = _.cloneDeep(newListReport);
      return newListReport




    default:
      return state
  }

}

export default toursReducer
