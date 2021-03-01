import _ from 'lodash';
import {
  GET_TOUR_APPLIED, GET_TOUR_UPCOMING, SEARCH_ACTION,
  GET_TOUR_DEPARTED, createAction, GET_TOUR_CANCEL,
  GET_TOUR_FINISH, GET_USER_APPLY, GET_POST_AGENT,
  GET_GROUP_HOME, GET_GROUP_DETAIL, GET_GROUP_INFORMATION, POST_GROUP_HOME,
  GET_MEMBER_GROUP, POST_OUT_GROUP, JOIND_GROUP_SEARCH, OUT_GROUP_SEARCH, OUT_GROUP_HOME,
  GET_MEMBER_APPOVAL, POST_MEMBER_REQUEST, GET_LISTAPPROVLI_GROUP, POST_LISTAPPOVAIL_REQUEST, GET_GUIDER_FINISH,
  INVITE_GUIDER, GET_LIST_TRACKING_HISTORY,
  GET_LIST_POST_TIP,
  GET_LIST_RATING_INFO,
  GET_LIST_REPORT,
  GET_LIST_HOT_RELATED

} from './action-types'
import NetworkManager from '../modules/NetworkManager'
import ApiConfig from '../config/api-config'
import apiConfig from '../config/api-config';



// action post phê duyệt bài đăng
export function action_PostList_Confim_Delete(group_id, comment_id, action) {

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.tour.confirm_delete_Request_PostList(group_id, comment_id, action))
      .then(response => {
        dispatch(createAction(POST_LISTAPPOVAIL_REQUEST, { data: response, comment_id }, true))
        return Promise.resolve(response)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}
// action get danh sách phê duyệt
export function getList_Approval(id_group, page) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.tour.confirm_Delete_PostList(id_group, page))
      .then(response => {
        let listPostGroupRequest = response.data.data
        if (page != 1) {
          let listPostConfirm = _.get(getState(), 'tours.listPostApproval')
          listPostGroupRequest = _.concat(listPostConfirm, listPostGroupRequest)
        }
        dispatch(createAction(GET_LISTAPPROVLI_GROUP, listPostGroupRequest, true))
        return Promise.resolve(response)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}
// chia sẻ group 

export function postShareGroup(id_group, data) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.tour.postShareGroupAPI(id_group, data))
      .then(response => {
        // dispatch(createAction(POST_MEMBER_REQUEST, { data: response, id_user }, true))
        return Promise.resolve(response)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}
// action api phê duyệt thành viên vào nhóm
export function confirm_Request(id_group, id_user, action) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.tour.confirm_delete_Request(id_group, id_user, action))
      .then(response => {
        dispatch(createAction(POST_MEMBER_REQUEST, { data: response, id_user }, true))
        return Promise.resolve(response)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

// action thành viên chờ phê duyệt
export function getToJoinGroup(id_group) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.tour.getMemberJoinGroup(id_group))
      .then(response => {
        dispatch(createAction(GET_MEMBER_APPOVAL, response, true))
        return Promise.resolve(response)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}
// action get thành viên nhóm
export function getMemberGroup(id, page) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.tour.getMemberGroupId(id, page))
      .then(response => {
        let listMember = response.data.data
        if (page != 1) {
          let curentMembers = _.get(getState(), 'tours.listMember')
          listMember = _.concat(curentMembers, listMember)
        }
        dispatch(createAction(GET_MEMBER_GROUP, listMember, true))
        return Promise.resolve(response)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}
//api get tracking
export function getTrackingHistory(id, page) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.tour.getTrackingHistoryApi(id, page))
      .then(response => {
        // console.log('====================================');
        // console.log(response, "log meeeeeeeeeeeeeeeeeee");
        // console.log('====================================');
        let listTrackingHistory = response.data.data.users
        if (page.page != 1) {
          let faceTracking = _.get(getState(), 'tours.listTracking')
          listTrackingHistory = _.concat(faceTracking, listTrackingHistory)
        }
        dispatch(createAction(GET_LIST_TRACKING_HISTORY, listTrackingHistory, true))
        return Promise.resolve(response)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function getHotPostRelated(id, page) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.tour.getHotPostRelatedApi(id, page))
      .then(response => {
        let listHotPostRelated = response.data.data.tips
        dispatch(createAction(GET_LIST_HOT_RELATED, listHotPostRelated, true))
        return Promise.resolve(response)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}
export function getListPostTip(id, page) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.tour.getListPostTipApi(id, page))
      .then(response => {
        let listDataTip = response.data.data.tips
        if (page.page != 1) {
          let faceTip = _.get(getState(), 'tours.listPostTip')
          listDataTip = _.concat(faceTip, listDataTip)
        }
        dispatch(createAction(GET_LIST_POST_TIP, listDataTip, true))
        return Promise.resolve(response)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}
export function getListPostRatingInfo(id, page) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.tour.getListPostRatingInfoApi(id, page))
      .then(response => {
        let listDataRatingUser = response.data.reviews
        if (page.page != 1) {
          let pushRating = _.get(getState(), 'tours.listRatingInfo')
          listDataRatingUser = _.concat(pushRating, listDataRatingUser)
        }
        dispatch(createAction(GET_LIST_RATING_INFO, listDataRatingUser, true))

        return Promise.resolve(response)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}
export function getInfomationGroup(data) {
  //console.log("thong tin nhom:::::::::::");
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.tour.getInfomationGroupApi(data))
      .then(response => {
        // console.log("thong tin nhom tra veeeeee:::::::::::", response);
        dispatch(createAction(GET_GROUP_INFORMATION, response.data.group, true))
        return Promise.resolve(response.data.group)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}


export function handleOutGroup(id) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.tour.outGroupAPI(id))
      .then(response => {
        dispatch(createAction(POST_OUT_GROUP, response, true))
        return Promise.resolve(response)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}
export function getListItems(id, page) {

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.tour.getDataApi(id, page))
      .then(response => {
        let newfeeds = response.data.data.comments
        if (page != 1) {
          let curentComments = _.get(getState(), 'tours.listPostGroup')
          newfeeds = _.concat(curentComments, newfeeds)
        }
        dispatch(createAction(GET_GROUP_DETAIL, newfeeds, true))
        return Promise.resolve(response)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}


export function joinGroupContainer(id) {

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.tour.joinGroupApi(id))
      .then(response => {
        let payload = { ...response, id }
        dispatch(createAction(POST_GROUP_HOME, payload, true))
        return Promise.resolve(response)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}
export function outGroupContainer(id) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.tour.outGroupApi(id))
      .then(response => {
        let payload = { ...response, id }
        dispatch(createAction(OUT_GROUP_HOME, payload, true))
        return Promise.resolve(response)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}
export function outGroupInviteContainer(id) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.tour.outGroupInviteApi(id))
      .then(response => {
        let payload = { ...response, id }
        dispatch(createAction(OUT_GROUP_HOME, payload, true))
        return Promise.resolve(response)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}
export function outGroupContainer_Your(id) {
  // console.log("gọi vào hàm này any thoat nhóm", id);
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.tour.outGroupApi_Your(id))
      .then(response => {

      })
  }
}

export function joinGroupSearch(id) {
  // console.log("id tham gia nhóm ::::::::::::::", id);
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.tour.joinGroupApi(id))
      .then(response => {
        // console.log('response join vòa nhóm', response);
        // let payload = { ...response, id }
        // dispatch(createAction(JOIND_GROUP_SEARCH, payload, true))
        // console.log(" thông báo tham gia nhóm ở action ::::::::::::::", response);
        // return Promise.resolve(response)
        const listGroup = _.get(getState(), 'posts.listUserGroup')
        const index = _.findIndex(listGroup, (o) => o.group_id == id)
        const group = listGroup[index]
        group.submitted_request = 'yes'
        group.checkInvitedGroup = 0
        listGroup.splice(index, 1, group)
        dispatch(createAction(JOIND_GROUP_SEARCH, listGroup, true))
        // return Promise.resolve(response)
        return Promise.resolve(listGroup)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function outGroupSearch(id) {
  // console.log("id tham gia nhóm ::::::::::::::", id);
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.tour.outGroupAPI(id))
      .then(response => {

        // let payload = { ...response, id }
        const listGroup = _.get(getState(), 'posts.listUserGroup')
        const index = _.findIndex(listGroup, (o) => o.group_id == id)
        const group = listGroup[index]
        group.submitted_request = 'no'
        group.checkInvitedGroup = 0
        group.check_user = 'no'
        listGroup.splice(index, 1, group)
        // console.log(listGroup, 'lấy ra phần tử index', index);
        dispatch(createAction(OUT_GROUP_SEARCH, listGroup, true))
        return Promise.resolve(listGroup)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function getDatagroup(dataGroup) {

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.tour.getGroupApi(dataGroup))
      .then(response => {
        // console.log("data Home group :::::::::::", response);

        dispatch(createAction(GET_GROUP_HOME, response, true))
        return Promise.resolve(response)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function getListApplied(page) {
  // console.log("page phan trang danh sach tao va dang ky", page);
  return async function (dispatch, getState) {

    return NetworkManager.request(ApiConfig.tour.listApplied(page))
      .then(response => {
        console.log("response tour đăng ký", response);
        const success = _.get(response.data, 'messages')
        let tour = _.get(response.data, 'data')
        if (success === 'Succes') {

          if (page !== 1) {
            const currentTour = _.get(getState(), 'tours.tours')
            tour = _.concat(currentTour, tour)
          }
          dispatch(createAction(GET_TOUR_APPLIED, tour, true))
        }
        return Promise.resolve(response.data)

      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function getListUpcoming(page) {

  return async function (dispatch, getState) {

    return NetworkManager.request(ApiConfig.tour.listUpcoming(page))
      .then(response => {
        console.log("danh sach sap dien ra", response);
        const success = _.get(response.data, 'messages')
        let tour = []
        if (success === 'Succes') {
          tour = _.isArray(_.get(response.data, 'data')) ? _.get(response.data, 'data') : []

          if (page !== 1) {
            const currentTour = _.get(getState(), 'tours.listTourUpcomming')
            tour = _.concat(currentTour, tour)
          }
        }
        dispatch(createAction(GET_TOUR_UPCOMING, tour, true))
        return Promise.resolve(tour)

      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function getListDeparted(page) {

  return async function (dispatch, getState) {

    return NetworkManager.request(ApiConfig.tour.listDeparted(page))
      .then(response => {
        console.log("danh sach tour khoi hanh", response);
        const success = _.get(response.data, 'messages')
        let tour = []
        if (success === 'Succes') {
          tour = _.isArray(_.get(response.data, 'data')) ? _.get(response.data, 'data') : []

          if (page !== 1) {
            const currentTour = _.get(getState(), 'tours.listTourDeparted')
            tour = _.concat(currentTour, tour)
          }
        }
        dispatch(createAction(GET_TOUR_DEPARTED, tour, true))
        return Promise.resolve(tour)

      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function getListCanceled() {

  return async function (dispatch, getState) {

    return NetworkManager.request(ApiConfig.tour.listCancelled())
      .then(response => {
        const success = _.get(response.data, 'messages')
        let tour = []
        if (success === 'Succes') {
          tour = _.isArray(_.get(response.data, 'data')) ? _.get(response.data, 'data') : []
        }
        return Promise.resolve(tour)

      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function getListFinished() {

  return async function (dispatch, getState) {

    return NetworkManager.request(ApiConfig.tour.listFinished())
      .then(response => {
        console.log("list guide finish", response);
        const success = _.get(response.data, 'messages')
        let tour = []
        if (success === 'Succes') {
          tour = _.isArray(_.get(response.data, 'data')) ? _.get(response.data, 'data') : []
        }
        return Promise.resolve(tour)

      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}


export function getListUserApply(commentId) {

  return async function (dispatch, getState) {

    return NetworkManager.request(ApiConfig.tour.listUserApply(commentId))
      .then(response => {
        const success = _.get(response.data, 'message')
        let tour = []
        if (success === 'Succes') {
          tour = _.get(response.data, 'data.users')
        }
        return Promise.resolve(tour)

      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

//dinh nghia 1 action test de call api
export function getAgentHomePage(param) {
  // console.log(" data trang guide truyenf len", param);
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.getPostAgent(param))
      .then((res) => {
        console.log("response:::::::::::::::::", res);
        // let postTour
        let comments = _.get(res.data, 'post.comments')
        // if (res && res.data) {
        //   postTour = res.data.post
        // }
        if (param.page != 1) {
          const currentComments = _.get(getState(), 'posts.postAgentHome')
          comments = _.concat(currentComments, comments)
        }
        // console.log("comment sau khi concat lisst agent", comments);
        dispatch(createAction(GET_POST_AGENT, comments, true))

        return Promise.resolve(comments)
        //  return Promise.resolve(res) phan du lieu tra ra co gia tri la res
      })
      // cay loi 
      .catch(error => {
        return Promise.reject(error)
      });
  }
}
export function getSearch(params) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.callSearchAPI(params))
      .then((res) => {
        // console.log("res search agent tour", res);
        let serchTour
        if (res && res.data) {
          serchTour = res.data.post.comments
        }
        dispatch(createAction(SEARCH_ACTION, serchTour, true))
        return Promise.resolve(serchTour)
        //  return Promise.resolve(res) phan du lieu tra ra co gia tri la res
      })
      // cay loi 
      .catch(error => {
        return Promise.reject(error)
      });
  }
}



export function reviewUser(data) {

  return async function (dispatch, getState) {

    return NetworkManager.request(ApiConfig.tour.reviewUser(data))
      .then(response => {
        // const success = _.get(response.data, 'message')
        // let tour = []
        // if (success === 'Succes') {
        //   tour = _.get(response.data, 'data.users')
        // }

        // dispatch(createAction(GET_USER_APPLY, tour, true))
        return Promise.resolve(response)

      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}


export function getListFreeday() {

  return async function (dispatch, getState) {

    return NetworkManager.request(ApiConfig.tour.listFreeDay())
      .then(response => {
        // const success = _.get(response.data, 'messages')
        // let tour = []
        // if (success === 'Succes') {
        //   tour = _.isArray(_.get(response.data, 'data')) ? _.get(response.data, 'data') : []
        // }

        // dispatch(createAction(GET_TOUR_FINISH, tour, true))
        return Promise.resolve(response.data)

      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function getListCalendar() {

  return async function (dispatch, getState) {

    return NetworkManager.request(ApiConfig.tour.listCalendar())
      .then(response => {
        // console.log(response)
        // const success = _.get(response.data, 'messages')
        // let tour = []
        // if (success === 'Succes') {
        //   tour = _.isArray(_.get(response.data, 'data')) ? _.get(response.data, 'data') : []
        // }

        // dispatch(createAction(GET_TOUR_FINISH, tour, true))
        return Promise.resolve(response.data)

      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function getGudierMatchTour(data) {
  // console.log('d___________t________a', data);

  return async function (dispatch, getState) {

    return NetworkManager.request(ApiConfig.tour.getGudierMatchTour(data))
      .then(response => {
        // console.log('resssssssssssssssssssssp00000000000000', response)
        const success = _.get(response.data, 'result')
        let guiders = _.get(response.data, 'data')
        // guiders = _.get(response.data, 'data')
        if (data.page != 1) {
          const curentGuiders = _.get(getState(), 'tours.listGuider')
          // const guidersFilter = guiders.filter(function (guider) {
          //   return guider != undefined;
          // });
          // console.log('guidersss i+++++++++++++++++++++', guiders);
          if (guiders) {

            for (var i = 0; i < guiders.length - 1; i++) {
              if (guiders[i] === undefined) {
                guiders.splice(i, 1);
              }
            }
          }
          guiders = _.concat(curentGuiders, guiders || [])
        }

        dispatch(createAction(GET_GUIDER_FINISH, guiders, true))
        return Promise.resolve(response)

      })
      .catch(error => {
        // console.log('resssssssssssssssssssssp00000000000000', error)
        return Promise.reject(error)
      });
  }
}

export function invitedTour(data) {
  // console.log('dattttttttttttttttttttttttttttta', data);

  return async function (dispatch, getState) {

    return NetworkManager.request(ApiConfig.tour.invitedTour(data))
      .then(response => {
        // console.log('++++++++++++++++++++++++++++++++', response)
        const success = _.get(response.data, 'result')
        let guiders = _.get(getState(), 'tours.listGuider')
        if (success == 'success') {
          let index = _.findIndex(guiders, (o) => o.user_id == data.user_guider_id)
          let guider = guiders[index]
          if (response.data.action == 'invite') {
            guider.invited.status = 'invite'

          }
          if (response.data.action == 'agent-cancel') {
            guider.invited.status = 'empty'
          }
          guiders.splice(index, 1, guider)
        }
        // console.log('guiderssssssssssssssssssssssssss', guiders);



        dispatch(createAction(INVITE_GUIDER, guiders, true))
        return Promise.resolve(response)

      })
      .catch(error => {
        // console.log('--------------------------------%%%%%%%%%%%%%%%%%%%%%%%%%%', error);
        return Promise.reject(error)
      });
  }
}

export function getListReport(data) {
  // console.log('dattttttttttttttttttttttttttttta', data);

  return async function (dispatch, getState) {

    return NetworkManager.request(ApiConfig.tour.getListReport(data))
      .then(response => {
        // console.log('++++++++++++++++++++++++++++++++', response)
        // dispatch(createAction(INVITE_GUIDER, guiders, true))

        const content = _.get(response.data, 'data.users')

        dispatch(createAction(GET_LIST_REPORT, content, true))
        return Promise.resolve(content)

      })
      .catch(error => {
        // console.log('--------------------------------%%%%%%%%%%%%%%%%%%%%%%%%%%', error);
        return Promise.reject(error)
      });
  }
}

export function sendReport(data) {
  // console.log('dattttttttttttttttttttttttttttta', data);

  return async function (dispatch, getState) {

    return NetworkManager.request(ApiConfig.tour.sendReport(data))
      .then(response => {
        // console.log('++++++++++++++++++++++++++++++++', response)
        // dispatch(createAction(INVITE_GUIDER, guiders, true))
        return Promise.resolve(response.data)

      })
      .catch(error => {
        // console.log('--------------------------------%%%%%%%%%%%%%%%%%%%%%%%%%%', error);
        return Promise.reject(error)
      });
  }
}