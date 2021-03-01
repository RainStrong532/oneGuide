import _ from 'lodash';
import {
  GET_NEW_POSTS,
  GET_POSTS_OTHER_USER,
  LIKE_POST,
  CREATE_NEW_POST,
  DELETE_POST,
  CREATE_COMMENT,
  URL_USER,
  createAction,
  EMPTY,
  ADD_POST_STORAGE,
  LIKE_AGENT_HOME,
  GET_lIST_COMMENTS,
  GET_POST_AGENT,
  CREATE_NEW_POST_OTHER,
  POST_CHECKIN_DATA,
  LIKE_TOUR_SEARCH,
  GUIDE_APPLY_TOUR,
  LIKE_POST_NOTIFICATION,
  LIKE_POST_GROUP,
  CREATE_COMMENT_SEARCH_ALL,
  CREATE_COMMENT_SEARCH_ALL_POST,
  LIKE_POST_SEARCH,
  LIKE_POST_PROFILE,
  CREATE_COMMENT_PROFILE,
  CREATE_COMMENT_SEARCH_TOTAL_TOUR,
  CREATE_COMMENT_SEARCH_TOTAL_POST,
  CREATE_NEW_POST_GROUP,
  LIKE_POST_HOME_GROUP,
  COMMENT_POST_HOME_GROUP,
  DELETE_POST_HOME_GROUP,
  DELETE_POST_PROFILE,
  DELETE_POST_GROUP,
  GET_LIST_GUIDE_APPLY_TOUR,
  APPLY_TOUR_PROFILE,
  GET_LIST_GUIDE_TOUR
} from './action-types'
import NetworkManager from '../modules/NetworkManager'
import ApiConfig from '../config/api-config'
import StringUtils from '../utils/StringUtils'
import ImageUtils from '../utils/ImageUtils'
import { AsyncStorage } from 'react-native';
import { State } from 'react-native-gesture-handler';

export function getNewPosts(page) {

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.newfeeds(page))
      .then(response => {


        // console.log("response phan trang ", response);
        let url_user = _.get(response.data, 'data.url_user')
        dispatch(createAction(URL_USER, url_user, true))
        if (page === 1) {

          dispatch(createAction(ADD_POST_STORAGE, response.data.data.comments, true))
        }
        // comments
        let comments = _.get(response.data, 'data.comments')
        comments = _.map(comments, (cmt) => {
          let detailCommentShare = _.get(cmt, 'detailCommentShare')
          if (detailCommentShare) {
            detailCommentShare = {
              ...detailCommentShare,
              isLongText: StringUtils.isLongTextPost(detailCommentShare.content),
              showFull: false
            }
          }
          return {
            ...cmt,
            detailCommentShare,
            isLongText: StringUtils.isLongTextPost(cmt.content),
            showFull: false
          }
        });

        if (page !== 1) {
          const currentComments = _.get(getState(), 'posts.newfeeds')
          comments = _.concat(currentComments, comments)
        }
        // dispatch
        dispatch(createAction(GET_NEW_POSTS, comments, true))

        return Promise.resolve(comments)
      })
      .catch(error => {

        return Promise.reject(error)
      });
  }
}

export function addPostStorage() {
  return async function (dispatch, getState) {
    let newPost = await AsyncStorage.getItem('ONEGUIDE_USER_DATA')
    newPost = JSON.parse(newPost)
    if (newPost) {
      dispatch(createAction(ADD_POST_STORAGE, newPost.posts, true))

    }
    // return Promise.resolve(newPost)
  }
}

export function getNewPostsOtherUser(page, user_id) {

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.listCommentOtherUser(page, user_id))
      .then(response => {
        // console.log('respon get post other', response.data);
        // url_user
        let url_user = _.get(response.data, 'data.url_user')
        dispatch(createAction(URL_USER, url_user, true))

        // comments
        let comments = _.get(response.data, 'data.comments')
        comments = _.map(comments, (cmt) => {
          let detailCommentShare = _.get(cmt, 'detailCommentShare')

          if (detailCommentShare) {
            detailCommentShare = {
              ...detailCommentShare,
              isLongText: StringUtils.isLongTextPost(detailCommentShare.content),
              showFull: false
            }
          }

          return {
            ...cmt,
            detailCommentShare,
            isLongText: StringUtils.isLongTextPost(cmt.content),
            showFull: false
          }
        });

        if (page != 1) {
          const currentComments = _.get(getState(), 'posts.newfeedOther')
          comments = _.concat(currentComments, comments)
        }
        // console.log('comments người khác', comments);
        // dispatch
        dispatch(createAction(GET_POSTS_OTHER_USER, comments, true))
        return Promise.resolve(comments)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}



export function createPost(data) {
  // console.log('data share', data);
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.createPost(data))
      .then(response => {
        console.log('respon create post tour', response);
        let user_id = _.get(getState(), 'user.me.user_id')

        // data
        let comment = _.get(response.data, 'data.comment');
        let currentComments;
        let currentCommentsUser;
        let currentCommentsGroup;
        let deadline_timer;
        let dt;
        if (comment) {
          let detailCommentShare = _.get(comment, 'detailCommentShare')

          if (detailCommentShare) {
            detailCommentShare = {
              ...detailCommentShare,
              isLongText: StringUtils.isLongTextPost(detailCommentShare.content),
              showFull: false
            }
          }
          deadline_timer = comment.deadline_timer
          if (deadline_timer) {

            deadline_timer = deadline_timer.split("/");
            var newDate = deadline_timer[1] + "/" + deadline_timer[0] + "/" + deadline_timer[2];
            dt = (new Date(newDate).getTime()) / 1000
          }


          const place_name = comment.place_name || data.place_name
          const typecomment = comment.typecomment || data.typecomment
          comment = {
            ...comment,
            deadline_timer: dt,
            place_name,
            typecomment,
            detailCommentShare,
            user_id,
            isLongText: false,
            link: data.content_url,

          }

          // currentComments = _.get(getState(), 'posts.newfeeds')
          // currentComments.splice(0, 0, comment);

          // currentCommentsUser = _.get(getState(), 'posts.newfeedOther')
          // currentCommentsUser.splice(0, 0, comment);

          // currentCommentsGroup = _.get(getState(), 'tours.listPostGroup')
          // currentCommentsGroup.splice(0, 0, comment);

          // dispatch
          if (data.group_id == 0 || !data.group_id) {
            // console.log('Chayj vaof trang home');
            currentComments = _.get(getState(), 'posts.newfeeds')
            currentComments.splice(0, 0, comment);

            currentCommentsUser = _.get(getState(), 'posts.newfeedOther')
            currentCommentsUser.splice(0, 0, comment);
            // console.log('baiiiiiiiiiiiiiiiiiiiiiiiiiiiiii', currentComments);
            dispatch(createAction(CREATE_NEW_POST, currentComments, true))
            dispatch(createAction(CREATE_NEW_POST_OTHER, currentCommentsUser, true))
            // return Promise.resolve(comment)
          } else {
            // console.log('Chayj vaof group');
            currentCommentsGroup = _.get(getState(), 'tours.listPostGroup')
            currentCommentsGroup.splice(0, 0, comment);
            dispatch(createAction(CREATE_NEW_POST_GROUP, currentCommentsGroup, true))
            // let messages = _.get(response.data, 'messages')
            // return Promise.reject(messages)
            // return Promise.resolve(currentCommentsGroup)
          }

          return Promise.resolve(response.data)
        } else {
          // let messages = _.get(response.data, 'messages')
          console.log("chay vao day ko");
          return Promise.resolve(response.data)
        }

      })
      .catch(error => {
        //console.log('đăng bài bị lỗi rồi', error);
        return Promise.reject(error.toString())
      });
  }
}

export function createPostUserProfile(data) {
  // console.log('đây là đăng bài ở trang cá nhân', data);
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.createPost(data))
      .then(response => {
        //  console.log('respon share', response);
        let user_id = _.get(getState(), 'user.me.user_id')

        // data
        let comment = _.get(response.data, 'data.comment');
        let currentComments;
        let deadline_timer;
        let dt;
        if (comment) {
          let detailCommentShare = _.get(comment, 'detailCommentShare')

          if (detailCommentShare) {
            detailCommentShare = {
              ...detailCommentShare,
              isLongText: StringUtils.isLongTextPost(detailCommentShare.content),
              showFull: false
            }
          }
          deadline_timer = comment.deadline_timer
          if (deadline_timer) {

            deadline_timer = deadline_timer.split("/");
            var newDate = deadline_timer[1] + "/" + deadline_timer[0] + "/" + deadline_timer[2];
            dt = (new Date(newDate).getTime()) / 1000
          }


          const place_name = comment.place_name || data.place_name
          const typecomment = comment.typecomment || data.typecomment
          comment = {
            ...comment,
            deadline_timer: dt,
            place_name,
            typecomment,
            detailCommentShare,
            user_id,
            isLongText: false,
            link: data.content_url,

          }

          currentComments = _.get(getState(), 'posts.newfeedOther')
          currentComments.splice(0, 0, comment);

          // dispatch
          dispatch(createAction(CREATE_NEW_POST_OTHER, currentComments, true))
        } else {
          let messages = _.get(currentComments, 'messages')
          return Promise.reject(messages)
        }

        return Promise.resolve(comment, currentComments)
      })
      .catch(error => {
        // console.log('đăng bài bị lỗi rồi', error);
        return Promise.reject(error.toString())
      });
  }
}



export function createPostCheckIn(data) {

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.createPost(data))
      .then(response => {
        let user_id = _.get(getState(), 'user.me.user_id')

        // data
        let comment = _.get(response.data, 'data.comment');
        let currentComments;
        let deadline_timer;
        let dt;
        if (comment) {
          let detailCommentShare = _.get(comment, 'detailCommentShare')

          if (detailCommentShare) {
            detailCommentShare = {
              ...detailCommentShare,
              isLongText: StringUtils.isLongTextPost(detailCommentShare.content),
              showFull: false
            }
          }
          deadline_timer = comment.deadline_timer
          if (deadline_timer) {

            deadline_timer = deadline_timer.split("/");
            var newDate = deadline_timer[1] + "/" + deadline_timer[0] + "/" + deadline_timer[2];
            dt = (new Date(newDate).getTime()) / 1000
          }


          const place_name = comment.place_name || data.place_name
          const typecomment = comment.typecomment || data.typecomment
          comment = {
            ...comment,
            deadline_timer: dt,
            place_name,
            typecomment,
            detailCommentShare,
            user_id,
            isLongText: false,
            link: data.content_url,

          }

          currentComments = _.get(getState(), 'posts.newfeeds')
          currentComments.splice(0, 0, comment);

          // dispatch
          dispatch(createAction(POST_CHECKIN_DATA, { data: response.data.data, currentComments: currentComments }, true))

        } else {
          let messages = _.get(response.data, 'messages')
          return Promise.reject(messages)
        }

        return Promise.resolve(comment, currentComments)
      })
      .catch(error => {

        return Promise.reject(error.toString())
      });
  }
}
//post checkin
// export function createPostCheckIn(data) {

//   return async function (dispatch, getState) {
//     return NetworkManager.request(ApiConfig.posts.createPost(data))
//       .then(response => {

//         let user_id = _.get(getState(), 'user.me.user_id')

//         // data
//         let comment = _.get(response.data, 'data.comment');
//         let currentComments;
//         let deadline_timer;
//         if (comment) {
//           let detailCommentShare = _.get(comment, 'detailCommentShare')

//           if (detailCommentShare) {
//             detailCommentShare = {
//               ...detailCommentShare,
//               isLongText: StringUtils.isLongTextPost(detailCommentShare.content),
//               showFull: false
//             }
//           }
//           deadline_timer = comment.deadline_timer
//           deadline_timer = deadline_timer.split("/");
//           var newDate = deadline_timer[1] + "/" + deadline_timer[0] + "/" + deadline_timer[2];
//           const dt = (new Date(newDate).getTime()) / 1000


//           const place_name = comment.place_name || data.place_name
//           const typecomment = comment.typecomment || data.typecomment
//           comment = {
//             ...comment,
//             deadline_timer: dt,
//             place_name,
//             typecomment,
//             detailCommentShare,
//             user_id,
//             isLongText: false,
//             link: data.content_url,

//           }

//           currentComments = _.get(getState(), 'posts.newfeeds')
//           currentComments.splice(0, 0, comment);
//           //   console.log("currentComments", currentComments);
//           // dispatch
//           dispatch(createAction(POST_CHECKIN_DATA, { data: data, currentComments: currentComments }, true))

//         } else {
//           let messages = _.get(response.data, 'messages')
//           return Promise.reject(messages)
//         }

//         return Promise.resolve(comment, currentComments)
//       })
//       .catch(error => {

//         return Promise.reject(error.toString())
//       });
//   }
// }

export function editPost(data) {
  // console.log("dataedit o day la gi", data);
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.commentEdit(data))
      .then(response => {
        // console.log("response edit trả vè", response);
        let user_id = _.get(getState(), 'user.me.user_id')

        // data
        let comment = _.get(response.data, 'data.comment[0]') || _.get(response.data, 'data.comment')
        let deadline;
        if (comment) {
          let detailCommentShare = _.get(comment, 'detailCommentShare')

          if (detailCommentShare) {
            detailCommentShare = {
              ...detailCommentShare,
              isLongText: StringUtils.isLongTextPost(detailCommentShare.content),
              showFull: false
            }
          }
          deadline = comment.deadline_timer
          deadline = deadline.split("/");
          var newDate = deadline[1] + "/" + deadline[0] + "/" + deadline[2];
          const date = (new Date(newDate).getTime()) / 1000


          const place_name = comment.place_name || data.place_name
          const typecomment = comment.typecomment || data.typecomment
          comment = {
            ...comment,
            deadline_timer: date,
            place_name,
            typecomment,
            detailCommentShare,
            user_id,
            isLongText: false,
            link: data.content_url,
          }
          let currentComments = _.get(getState(), 'posts.newfeeds')
          const index = _.findIndex(currentComments, { comment_id: comment.comment_id });
          currentComments.splice(index, 1, comment);

          // dispatch
          dispatch(createAction(CREATE_NEW_POST, currentComments, true))
          return Promise.resolve(comment)
        } else {
          let messages = _.get(response.data, 'messages')
          return Promise.reject(messages)
        }
      })
      .catch(error => {
        return Promise.reject(error.toString())
      });
  }
}

export function savePost(comment_id) {

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.save(comment_id))
      .then(response => {
        let message = _.get(response.data, 'message')

        if (message === 'Succes') {
          return Promise.resolve(comment_id)
        }
        return Promise.reject(null)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function deletePost(comment_id) {

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.deletePost(comment_id))
      .then(response => {

        // current comments
        let currentComments = _.get(getState(), 'posts.newfeeds')
        const index = _.findIndex(currentComments, { comment_id });
        currentComments.splice(index, 1);

        // dispatch
        dispatch(createAction(DELETE_POST, currentComments, true))
        return Promise.resolve(comment_id)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function deletePostGroup(comment_id) {

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.deletePost(comment_id))
      .then(response => {

        // current comments
        let currentComments = _.get(getState(), 'tours.listPostGroup')
        const index = _.findIndex(currentComments, { comment_id });
        currentComments.splice(index, 1);

        // dispatch
        dispatch(createAction(DELETE_POST_GROUP, currentComments, true))
        return Promise.resolve(comment_id)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function deletePostHomeGroup(comment_id) {

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.deletePost(comment_id))
      .then(response => {

        // current comments
        let currentComments = _.get(getState(), 'tours.grade_Level_list_post')
        const index = _.findIndex(currentComments, { comment_id });
        currentComments.splice(index, 1);

        // dispatch
        dispatch(createAction(DELETE_POST_HOME_GROUP, currentComments, true))
        return Promise.resolve(comment_id)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function deletePostProfile(comment_id) {
  // console.log('comment ID)))))))))))))))))))))))', comment_id);

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.deletePost(comment_id))
      .then(response => {
        // current comments
        let currentComments = _.get(getState(), 'posts.newfeedOther')
        const index = _.findIndex(currentComments, { comment_id });
        currentComments.splice(index, 1);

        // console.log('ressssssssspon )))))))))))', currentComments);
        // dispatch
        dispatch(createAction(DELETE_POST_PROFILE, currentComments, true))
        return Promise.resolve(currentComments)
      })
      .catch(error => {
        // console.log('errrrrrrrrrrrrrrrrrrrrrrrrrrrrrr', error);
        return Promise.reject(error)
      });
  }
}

let liking_post_commnets = []
export function likePost(comment_id) {


  return async function (dispatch, getState) {

    // check if liked
    if (liking_post_commnets.includes(comment_id)) {
      return Promise.reject(null)
    }
    liking_post_commnets.push(comment_id)


    return NetworkManager.request(ApiConfig.posts.likePost(comment_id))
      .then(response => {

        // remove
        _.remove(liking_post_commnets, function (n) {
          return n === comment_id
        });

        // status
        const like_comment = _.get(response.data, 'status')

        // current comments
        let currentComments = _.get(getState(), 'posts.newfeeds')
        let index = _.findIndex(currentComments, { comment_id });
        if (index === -1) {
          currentComments = _.get(getState(), 'posts.postAgentHome');
          index = _.findIndex(currentComments, { comment_id });
        }
        // console.log('đcm index', index);
        let comment = currentComments[index]
        //console.log("comment", comment);
        let total_likes = parseInt(comment.total_likes) || 0
        if (like_comment === 'active') {
          total_likes = total_likes + 1
        } else {
          total_likes = total_likes - 1
        }
        comment = { ...comment, like_comment, total_likes }
        // console.log('comment ở đây', comment);
        currentComments.splice(index, 1, comment);
        // console.log("zxczxczxczxc", currentComments);
        // dispatch

        dispatch(createAction(LIKE_POST, currentComments, true))
        // console.log("responseCall like::::::::::::::", LIKE_POST);

        return Promise.resolve(currentComments)

      })
      .catch(error => {

        // remove
        _.remove(liking_post_commnets, function (n) {
          return n === comment_id
        });
        return Promise.reject(error)
      });
  }
}

// like notification

let liking_post_commnets_notification = []
export function likePostNotification(comment_id, notification_id) {
  // console.log(comment_id, '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', notification_id);


  return async function (dispatch, getState) {

    // check if liked
    if (liking_post_commnets_notification.includes(comment_id)) {
      return Promise.reject(null)
    }
    liking_post_commnets_notification.push(comment_id)


    return NetworkManager.request(ApiConfig.posts.likePost(comment_id))
      .then(response => {

        // console.log('response like thông báo', response);
        // remove
        _.remove(liking_post_commnets_notification, function (n) {
          return n === comment_id
        });

        // status
        const like_comment = _.get(response.data, 'status')

        // current comments
        let currentComments = _.get(getState(), 'notification.notifications')
        // const index = _.findIndex(currentComments, function (o) {
        //   return o.comment_id == comment_id
        // });
        // console.log("zxczxczxczxc", currentComments);
        // const checkComment = currentComments.map((o) => {
        //   return o.comment_id == comment_id
        // })
        // console.log('đcm index', checkComment);
        // const index = _.findIndex(newfeeds, (o) => { return o.comment.comment_id == comment_id });
        const index = _.findIndex(currentComments, (o) => {
          return o.notification_id == notification_id
        })
        let comment = currentComments[index]
        // console.log('index comment', index);
        // console.log("comment", comment);
        let total_likes = parseInt(comment.total_likes) || 0
        if (like_comment === 'active') {
          total_likes = total_likes + 1
        } else {
          total_likes = total_likes - 1
        }
        comment = { ...comment, like_comment, total_likes }
        // console.log('comment ở đây', comment);
        currentComments.splice(index, 1, comment);
        // dispatch

        dispatch(createAction(LIKE_POST, currentComments, true))
        // console.log("responseCall like::::::::::::::", LIKE_POST);

        return Promise.resolve(response)

      })
      .catch(error => {
        // console.log('error action', error);
        // remove
        // _.remove(liking_post_commnets_notification, function (n) {
        //   return n === comment_id
        // });
        return Promise.reject(error)
      });
  }
}

// Like Home Group

let liking_post_home_group = []
export function likePostHomeGroup(comment_id) {
  // console.log(comment_id, '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', notification_id);


  return async function (dispatch, getState) {

    // check if liked
    if (liking_post_home_group.includes(comment_id)) {
      return Promise.reject(null)
    }
    liking_post_home_group.push(comment_id)


    return NetworkManager.request(ApiConfig.posts.likePost(comment_id))
      .then(response => {

        // console.log('response like thông báo', response);
        // remove
        _.remove(liking_post_home_group, function (n) {
          return n === comment_id
        });

        // status
        const like_comment = _.get(response.data, 'status')

        // current comments
        let currentComments = _.get(getState(), 'tours.grade_Level_list_post')
        // const index = _.findIndex(currentComments, function (o) {
        //   return o.comment_id == comment_id
        // });
        // console.log("zxczxczxczxc", currentComments);
        // const checkComment = currentComments.map((o) => {
        //   return o.comment_id == comment_id
        // })
        // console.log('đcm index', checkComment);
        // const index = _.findIndex(newfeeds, (o) => { return o.comment.comment_id == comment_id });
        const index = _.findIndex(currentComments, (o) => {
          return o.comment_id == comment_id
        })
        let comment = currentComments[index]
        // console.log('index comment', index);
        // console.log("comment", comment);
        let total_likes = parseInt(comment.total_likes) || 0
        if (like_comment === 'active') {
          total_likes = total_likes + 1
        } else {
          total_likes = total_likes - 1
        }
        comment = { ...comment, like_comment, total_likes }
        // console.log('comment ở đây', comment);
        currentComments.splice(index, 1, comment);
        // dispatch

        dispatch(createAction(LIKE_POST_HOME_GROUP, currentComments, true))
        // console.log("responseCall like::::::::::::::", LIKE_POST);

        return Promise.resolve(currentComments)

      })
      .catch(error => {
        // console.log('error action', error);
        // remove
        // _.remove(liking_post_home_group, function (n) {
        //   return n === comment_id
        // });
        return Promise.reject(error)
      });
  }
}

let liking_post_commnets_post = []
export function likePostSearch(comment_id) {
  return async function (dispatch, getState) {

    // check if liked
    if (liking_post_commnets_post.includes(comment_id)) {
      return Promise.reject(null)
    }
    liking_post_commnets_post.push(comment_id)


    return NetworkManager.request(ApiConfig.posts.likePost(comment_id))
      .then(response => {
        // remove
        _.remove(liking_post_commnets_post, function (n) {
          return n === comment_id
        });

        // status
        const like_comment = _.get(response.data, 'status')

        // current comments
        let currentComments = _.get(getState(), 'posts.listPostSearch')
        // let currentComments = _.get(getState(), Atposts)
        const index = _.findIndex(currentComments, { comment_id });
        // console.log('đcm index', index);
        let comment = currentComments[index]
        // console.log('đcm index', index, ':::', currentComments, ':::::::', comment);
        //console.log("comment", comment);
        let total_likes = parseInt(comment.total_likes) || 0
        if (like_comment === 'active') {
          total_likes = total_likes + 1
        } else {
          total_likes = total_likes - 1
        }
        comment = { ...comment, like_comment, total_likes }

        currentComments.splice(index, 1, comment);
        // console.log("zxczxczxczxc", currentComments);
        // dispatch
        dispatch(createAction(LIKE_POST_SEARCH, currentComments, true))
        // console.log("responseCall like::::::::::::::", LIKE_POST);

        return Promise.resolve(currentComments)

      })
      .catch(error => {

        // remove
        _.remove(liking_post_commnets, function (n) {
          return n === comment_id
        });
        return Promise.reject(error)
      });
  }
}

let liking_post_commnets_tour = []
export function likeTourSearch(comment_id) {

  // console.log("Call like sang API :::::::action:::::::", comment_id);
  return async function (dispatch, getState) {

    // check if liked
    if (liking_post_commnets_tour.includes(comment_id)) {
      return Promise.reject(null)
    }
    liking_post_commnets_tour.push(comment_id)


    return NetworkManager.request(ApiConfig.posts.likePost(comment_id))
      .then(response => {
        // console.log("response like tra ve:::::::action:::::::2", response);
        // remove
        _.remove(liking_post_commnets_tour, function (n) {
          return n === comment_id
        });

        // status
        const like_comment = _.get(response.data, 'status')

        // current comments
        let currentComments = _.get(getState(), 'posts.listTourSearch')
        // let currentComments = _.get(getState(), Atposts)
        const index = _.findIndex(currentComments, { comment_id });
        // console.log('đcm index', index);
        let comment = currentComments[index]
        //console.log("comment", comment);
        let total_likes = parseInt(comment.total_likes) || 0
        if (like_comment === 'active') {
          total_likes = total_likes + 1
        } else {
          total_likes = total_likes - 1
        }
        comment = { ...comment, like_comment, total_likes }

        currentComments.splice(index, 1, comment);
        // console.log("zxczxczxczxc",currentComments );
        // dispatch
        dispatch(createAction(LIKE_POST, currentComments, true))
        // console.log("responseCall like::::::::::::::", LIKE_POST);

        return Promise.resolve(currentComments)

      })
      .catch(error => {

        // remove
        _.remove(liking_post_commnets, function (n) {
          return n === comment_id
        });
        return Promise.reject(error)
      });
  }
}

let liking_post_commnets_total_post = []
export function likeTotalPost(comment_id) {
  return async function (dispatch, getState) {

    // check if liked
    if (liking_post_commnets_total_post.includes(comment_id)) {
      return Promise.reject(null)
    }
    liking_post_commnets_total_post.push(comment_id)


    return NetworkManager.request(ApiConfig.posts.likePost(comment_id))
      .then(response => {
        // remove
        _.remove(liking_post_commnets_total_post, function (n) {
          return n === comment_id
        });

        // status
        const like_comment = _.get(response.data, 'status')

        // current comments
        let currentComments = _.get(getState(), 'posts.totalPost')
        // console.log('cu rừn com men', currentComments);
        const index = _.findIndex(currentComments, { comment_id });
        // console.log('đcm index', index);
        let comment = currentComments[index]
        //console.log("comment", comment);
        let total_likes = parseInt(comment.total_likes) || 0
        if (like_comment === 'active') {
          total_likes = total_likes + 1
        } else {
          total_likes = total_likes - 1
        }
        comment = { ...comment, like_comment, total_likes }

        currentComments.splice(index, 1, comment);
        // console.log("zxczxczxczxc",currentComments );
        // dispatch
        dispatch(createAction(LIKE_POST, currentComments, true))
        // console.log("responseCall like::::::::::::::", LIKE_POST);

        return Promise.resolve(currentComments)

      })
      .catch(error => {
        // console.log('ê rốt', error);
        // remove
        _.remove(liking_post_commnets_total_post, function (n) {
          return n === comment_id
        });
        return Promise.reject(error)
      });
  }
}

let liking_post_commnets_total_tour = []
export function likeTotalTour(comment_id) {
  return async function (dispatch, getState) {

    // check if liked
    if (liking_post_commnets_total_tour.includes(comment_id)) {
      return Promise.reject(null)
    }
    liking_post_commnets_total_tour.push(comment_id)


    return NetworkManager.request(ApiConfig.posts.likePost(comment_id))
      .then(response => {
        // remove
        _.remove(liking_post_commnets_total_tour, function (n) {
          return n === comment_id
        });

        // status
        const like_comment = _.get(response.data, 'status')

        // current comments
        let currentComments = _.get(getState(), 'posts.totalTour')
        // console.log('cu rừn com men', currentComments);
        const index = _.findIndex(currentComments, { comment_id });
        // console.log('đcm index', index);
        let comment = currentComments[index]
        //console.log("comment", comment);
        let total_likes = parseInt(comment.total_likes) || 0
        if (like_comment === 'active') {
          total_likes = total_likes + 1
        } else {
          total_likes = total_likes - 1
        }
        comment = { ...comment, like_comment, total_likes }

        currentComments.splice(index, 1, comment);
        // console.log("zxczxczxczxc",currentComments );
        // dispatch
        dispatch(createAction(LIKE_POST, currentComments, true))
        // console.log("responseCall like::::::::::::::", LIKE_POST);

        return Promise.resolve(currentComments)

      })
      .catch(error => {
        // console.log('ê rốt', error);
        // remove
        _.remove(liking_post_commnets_total_tour, function (n) {
          return n === comment_id
        });
        return Promise.reject(error)
      });
  }
}

let liking_post_commnets_newfeed_other = []
export function likenewfeedOther(comment_id) {
  return async function (dispatch, getState) {

    // check if liked
    if (liking_post_commnets_newfeed_other.includes(comment_id)) {
      return Promise.reject(null)
    }
    liking_post_commnets_newfeed_other.push(comment_id)


    return NetworkManager.request(ApiConfig.posts.likePost(comment_id))
      .then(response => {
        // console.log('responseeeeeee==++=+', response);
        // remove
        _.remove(liking_post_commnets_newfeed_other, function (n) {
          return n === comment_id
        });

        // status
        const like_comment = _.get(response.data, 'status')

        // current comments
        let currentComments = _.get(getState(), 'posts.newfeedOther')
        // console.log('cu rừn com men', getState());
        const index = _.findIndex(currentComments, { comment_id });
        // console.log('đc    m index', index);
        let comment = currentComments[index]
        //console.log("comment", comment);
        let total_likes = parseInt(comment.total_likes) || 0
        if (like_comment === 'active') {
          total_likes = total_likes + 1
        } else {
          total_likes = total_likes - 1
        }
        comment = { ...comment, like_comment, total_likes }

        currentComments.splice(index, 1, comment);
        // console.log("zxczxczxczxc",currentComments );
        // dispatch
        dispatch(createAction(LIKE_POST_PROFILE, currentComments, true))
        // console.log("responseCall like::::::::::::::", LIKE_POST);

        return Promise.resolve(currentComments)

      })
      .catch(error => {
        // console.log('ê rốt', error);
        // remove
        _.remove(liking_post_commnets_newfeed_other, function (n) {
          return n === comment_id
        });
        return Promise.reject(error)
      });
  }
}

let liking_post_commnets_newfeed_group = []
export function likenewfeedGroup(comment_id) {
  return async function (dispatch, getState) {

    // check if liked
    if (liking_post_commnets_newfeed_group.includes(comment_id)) {
      return Promise.reject(null)
    }
    liking_post_commnets_newfeed_group.push(comment_id)


    return NetworkManager.request(ApiConfig.posts.likePost(comment_id))
      .then(response => {
        // console.log('responseeeeeee==++=+', response);
        // remove
        _.remove(liking_post_commnets_newfeed_group, function (n) {
          return n === comment_id
        });

        // status
        const like_comment = _.get(response.data, 'status')

        // current comments
        let currentComments = _.get(getState(), 'tours.listPostGroup')
        // console.log('cu rừn com men', currentComments);
        const index = _.findIndex(currentComments, { comment_id });
        // console.log('đc    m index', index);
        let comment = currentComments[index]
        //console.log("comment", comment);
        let total_likes = parseInt(comment.total_likes) || 0
        if (like_comment === 'active') {
          total_likes = total_likes + 1
        } else {
          total_likes = total_likes - 1
        }
        comment = { ...comment, like_comment, total_likes }

        currentComments.splice(index, 1, comment);
        // console.log("zxczxczxczxc",currentComments );
        // dispatch
        dispatch(createAction(LIKE_POST_GROUP, currentComments, true))
        // console.log("responseCall like::::::::::::::", LIKE_POST);

        return Promise.resolve(currentComments)

      })
      .catch(error => {
        // console.log('ê rốt', error);
        // remove
        _.remove(liking_post_commnets_newfeed_group, function (n) {
          return n === comment_id
        });
        return Promise.reject(error)
      });
  }
}

let liking_comment = []
export function likeComment(comment_id) {

  return async function (dispatch, getState) {

    // check if liked
    if (liking_comment.includes(comment_id)) {
      return Promise.reject(null)
    }

    liking_comment.push(comment_id)

    return NetworkManager.request(ApiConfig.posts.likePost(comment_id))
      .then(response => {

        // remove
        _.remove(liking_comment, function (n) {
          return n === comment_id
        });
        // status
        const like_comment = _.get(response.data, 'status')

        // dispatch
        return Promise.resolve(like_comment)
      })
      .catch(error => {

        // remove        
        _.remove(liking_comment, function (n) {
          return n === comment_id
        });
        return Promise.reject(error)
      });
  }
}

let liking_post_tip = []
export function likePostTip(comment_id) {
  return async function (dispatch, getState) {

    // check if liked
    if (liking_post_tip.includes(comment_id)) {
      return Promise.reject(null)
    }
    liking_post_tip.push(comment_id)


    return NetworkManager.request(ApiConfig.posts.likePost(comment_id))
      .then(response => {
        // console.log('responseeeeeee==++=+', response);
        // remove
        _.remove(liking_post_tip, function (n) {
          return n === comment_id
        });

        // status
        const like_comment = _.get(response.data, 'status')

        // current comments
        let currentComments = _.get(getState(), 'posts.newfeeds')
        let tipComments = currentComments.find(e => e.type == 'tip')
        // console.log('cu rừn com men', currentComments);
        const index = _.findIndex(tipComments.list_tips, tip => tip.comment_id == comment_id)
        // console.log('đc    m index', index);
        let comment = tipComments.list_tips[index]
        // console.log("comment", comment);
        let total_likes = parseInt(comment.total_likes) || 0
        if (like_comment === 'active') {
          total_likes = total_likes + 1
        } else {
          total_likes = total_likes - 1
        }
        comment = { ...comment, like_comment, total_likes }

        tipComments.list_tips.splice(index, 1, comment);
        // console.log("zxczxczxczxc", tipComments);

        currentComments.splice(2, 1, tipComments);
        // dispatch
        dispatch(createAction(LIKE_POST, currentComments, true))
        // console.log("responseCall like::::::::::::::", LIKE_POST);

        return Promise.resolve(tipComments.list_tips[index])

      })
      .catch(error => {
        // console.log('ê rốt', error);
        // remove
        _.remove(liking_post_tip, function (n) {
          return n === comment_id
        });
        return Promise.reject(error)
      });
  }
}

export function getListCommentPost(comment_id, page) {
  // console.log(page, ')))))))))))))))))))(((((((((((((((((((', comment_id);

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.listComments(comment_id, page))
      .then(response => {
        // comments
        // console.log("123", response);
        let comments = _.get(response.data, 'data.comments')
        comments = _.map(comments, (cmt) => {
          return {
            ...cmt,
            isLongText: StringUtils.isLongTextComment(cmt.content)
          }
        });
        return Promise.resolve(comments)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function getListReplyComment(comment_id, page) {

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.listComments(comment_id, page))
      .then(response => {
        // comments
        let comments = _.get(response.data, 'data.comments')
        comments = _.map(comments, (cmt) => {
          return {
            ...cmt,
            isLongText: StringUtils.isLongTextCommentReply(cmt.content)
          }
        });
        return Promise.resolve(comments)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function createComment(data) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.createPost(data))
      .then(response => {

        // status
        let comment = _.get(response.data, 'data.comment')
        comment = {
          ...comment,
          isLongText: false
        }

        const comment_id = _.get(response.data, 'data.comment.parent_id')

        // current comments
        let newfeeds = _.get(getState(), 'posts.newfeeds');
        let index;
        index = _.findIndex(newfeeds, (o) => o.comment_id == comment_id);

        let post = newfeeds[index]
        let total_comments = parseInt(post.total_comments) || 0
        total_comments += 1
        post = { ...post, total_comments }
        newfeeds.splice(index, 1, post);

        // dispatch
        dispatch(createAction(CREATE_COMMENT, newfeeds, true))

        return Promise.resolve(comment)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function createCommentProfile(data) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.createPost(data))
      .then(response => {
        // status
        let comment = _.get(response.data, 'data.comment')
        comment = {
          ...comment,
          isLongText: false
        }

        const comment_id = _.get(response.data, 'data.comment.parent_id')

        // current comments
        let newfeedsOther;
        let newfeeds = _.get(getState(), 'posts.newfeeds');
        let index;
        index = _.findIndex(newfeeds, (o) => o.comment_id == comment_id);
        if (index >= 0) {
          let post = newfeeds[index]
          let total_comments = parseInt(post.total_comments) || 0
          total_comments += 1;
          post = { ...post, total_comments }
          newfeeds.splice(index, 1, post);
          // // dispatch
          dispatch(createAction(CREATE_COMMENT, newfeeds, true))
        }
        newfeedsOther = _.get(getState(), 'posts.newfeedOther');
        indexOther = _.findIndex(newfeedsOther, (o) => o.comment_id == comment_id);
        if (indexOther >= 0) {
          let postOther = newfeedsOther[indexOther]
          total_comments = parseInt(postOther.total_comments) || 0
          total_comments += 1;
          postOther = { ...postOther, total_comments }
          newfeedsOther.splice(indexOther, 1, postOther);
          // // dispatch
          dispatch(createAction(GET_POSTS_OTHER_USER, newfeedsOther, true))
        }
        return Promise.resolve({ comment, newfeedsOther })
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function createCommentSearchAll(data) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.createPost(data))
      .then(response => {
        // console.log('resssssssssssssssssssssssssssssssssssssssssss', response);

        // status
        let comment = _.get(response.data, 'data.comment')
        comment = {
          ...comment,
          isLongText: false
        }

        const comment_id = _.get(response.data, 'data.comment.parent_id')

        // current comments
        let newfeeds = _.get(getState(), 'posts.listTourSearch');
        let index;
        index = _.findIndex(newfeeds, (o) => o.comment_id == comment_id);

        let post = newfeeds[index]
        let total_comments = parseInt(post.total_comments) || 0
        total_comments += 1
        post = { ...post, total_comments }
        newfeeds.splice(index, 1, post);

        // dispatch
        dispatch(createAction(CREATE_COMMENT_SEARCH_ALL, newfeeds, true))

        return Promise.resolve(comment)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function createCommentSearchAllPost(data) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.createPost(data))
      .then(response => {
        let comment = _.get(response.data, 'data.comment')
        comment = {
          ...comment,
          isLongText: false
        }

        const comment_id = _.get(response.data, 'data.comment.parent_id')

        // current comments
        let newfeeds = _.get(getState(), 'posts.listPostSearch');
        let index;
        index = _.findIndex(newfeeds, (o) => o.comment_id == comment_id);

        let post = newfeeds[index]
        let total_comments = parseInt(post.total_comments) || 0
        total_comments += 1
        post = { ...post, total_comments }
        newfeeds.splice(index, 1, post);

        // dispatch
        dispatch(createAction(CREATE_COMMENT_SEARCH_ALL_POST, newfeeds, true))

        return Promise.resolve(comment)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function createCommentSearchTotalTour(data) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.createPost(data))
      .then(response => {
        let comment = _.get(response.data, 'data.comment')
        comment = {
          ...comment,
          isLongText: false
        }

        const comment_id = _.get(response.data, 'data.comment.parent_id')

        // current comments
        let newfeeds = _.get(getState(), 'posts.totalTour');
        let index;
        index = _.findIndex(newfeeds, (o) => o.comment_id == comment_id);

        let post = newfeeds[index]
        let total_comments = parseInt(post.total_comments) || 0
        total_comments += 1
        post = { ...post, total_comments }
        newfeeds.splice(index, 1, post);

        // dispatch
        dispatch(createAction(CREATE_COMMENT_SEARCH_TOTAL_TOUR, newfeeds, true))

        return Promise.resolve(comment)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function createCommentSearchTotalPost(data) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.createPost(data))
      .then(response => {
        let comment = _.get(response.data, 'data.comment')
        comment = {
          ...comment,
          isLongText: false
        }

        const comment_id = _.get(response.data, 'data.comment.parent_id')

        // current comments
        let newfeeds = _.get(getState(), 'posts.totalPost');
        let index;
        index = _.findIndex(newfeeds, (o) => o.comment_id == comment_id);

        let post = newfeeds[index]
        let total_comments = parseInt(post.total_comments) || 0
        total_comments += 1
        post = { ...post, total_comments }
        newfeeds.splice(index, 1, post);

        // dispatch
        dispatch(createAction(CREATE_COMMENT_SEARCH_TOTAL_POST, newfeeds, true))

        return Promise.resolve(comment)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function createCommentGroup(data) {
  // console.log('da ta gửi lên comment', data);
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.createPost(data))
      .then(response => {
        let comment = _.get(response.data, 'data.comment')
        comment = {
          ...comment,
          isLongText: false
        }

        const comment_id = _.get(response.data, 'data.comment.parent_id')
        // console.log('comment_id bình luận', comment_id);
        // current comments
        let newfeeds = _.get(getState(), 'tours.listPostGroup')
        // let newfeeds = _.get(getState(), 'notification.notifications')
        // console.log('newfeed action post', newfeeds);
        const index = _.findIndex(newfeeds, (o) => { return o.comment_id == comment_id });
        // console.log('index đc c c c c c', index);

        let post = newfeeds[index]

        let total_comments = parseInt(post.total_comments) || 0
        total_comments += 1
        // console.log('total comment', total_comments.toString());
        // let conver_total_comment = total_comments.toString()
        post = { ...post, total_comments }
        // console.log('post comment', post);
        newfeeds.splice(index, 1, post);

        // dispatch
        dispatch(createAction(CREATE_COMMENT, newfeeds, true))

        return Promise.resolve(comment)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function createCommentHomeGroup(data) {
  // console.log('da ta gửi lên comment', data);
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.createPost(data))
      .then(response => {
        // console.log(response, 'response comment');
        // status
        let comment = _.get(response.data, 'data.comment')
        comment = {
          ...comment,
          isLongText: false
        }

        const comment_id = _.get(response.data, 'data.comment.parent_id')
        // console.log('comment_id bình luận', comment_id);
        // current comments
        let newfeeds = _.get(getState(), 'tours.grade_Level_list_post')
        // let newfeeds = _.get(getState(), 'notification.notifications')
        // console.log('newfeed action post', newfeeds);
        const index = _.findIndex(newfeeds, (o) => { return o.comment_id == comment_id });
        // console.log('index đc c c c c c', index);

        let post = newfeeds[index]

        let total_comments = parseInt(post.total_comments) || 0
        total_comments += 1
        // console.log('total comment', total_comments.toString());
        // let conver_total_comment = total_comments.toString()
        post = { ...post, total_comments }
        // console.log('post comment', post);
        newfeeds.splice(index, 1, post);

        // dispatch
        dispatch(createAction(COMMENT_POST_HOME_GROUP, newfeeds, true))

        return Promise.resolve(comment)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function createCommentNotification(data, notification_id) {
  // console.log('da ta gửi lên comment', data);
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.createPost(data))
      .then(response => {
        // console.log(response, 'response comment');
        // status
        let comment = _.get(response.data, 'data.comment')
        comment = {
          ...comment,
          isLongText: false
        }

        const comment_id = _.get(response.data, 'data.comment.parent_id')
        // console.log('comment_id bình luận', comment_id);
        // current comments
        // let newfeeds = _.get(getState(), 'posts.newfeedOther')
        let newfeeds = _.get(getState(), 'notification.notifications')
        // console.log('newfeed action post', newfeeds);
        const index = _.findIndex(newfeeds, (o) => { return o.notification_id == notification_id });
        // console.log('index đc c c c c c', index);

        let post = newfeeds[index]

        let total_comments = parseInt(post.total_comments) || 0
        total_comments += 1
        // console.log('total comment', total_comments.toString());
        // let conver_total_comment = total_comments.toString()
        post = { ...post, total_comments }
        // console.log('post comment', post);
        newfeeds.splice(index, 1, post);

        // dispatch
        dispatch(createAction(CREATE_COMMENT, newfeeds, true))

        return Promise.resolve(comment)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}
export function createCommentGuideAgent(data) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.createPost(data))
      .then(response => {

        // status
        let comment = _.get(response.data, 'data.comment')
        comment = {
          ...comment,
          isLongText: false
        }

        const comment_id = _.get(response.data, 'data.comment.parent_id')

        // current comments
        let newfeeds = _.get(getState(), 'posts.postAgentHome');
        let index;
        index = _.findIndex(newfeeds, (o) => o.comment_id == comment_id);

        let post = newfeeds[index]
        let total_comments = parseInt(post.total_comments) || 0
        total_comments += 1
        post = { ...post, total_comments }
        newfeeds.splice(index, 1, post);

        // dispatch
        dispatch(createAction(GET_POST_AGENT, newfeeds, true))

        return Promise.resolve(comment)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function createCommentPostTip(data) {
  // console.log('da ta gửi lên comment', data);
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.createPost(data))
      .then(response => {
        // console.log(response, 'response comment');
        // status
        let comment = _.get(response.data, 'data.comment')
        comment = {
          ...comment,
          isLongText: false
        }

        const comment_id = _.get(response.data, 'data.comment.parent_id')
        // console.log('comment_id bình luận', comment_id);
        // current comments
        let newfeeds = _.get(getState(), 'posts.newfeeds')
        let postTips = newfeeds.find(post => post.type == 'tip')
        // console.log(newfeeds, 'newfeed action post', postTips);
        const index = _.findIndex(postTips.list_tips, (o) => { return o.comment_id == comment_id });
        // console.log('index đc c c c c c', index);

        let post = postTips.list_tips[index]
        // console.log('post comment', post);

        let total_comments = parseInt(post.total_comments) || 0
        total_comments += 1
        // console.log('total comment', total_comments.toString());
        // let conver_total_comment = total_comments.toString()
        post = { ...post, total_comments }
        postTips.list_tips.splice(index, 1, post)
        newfeeds.splice(2, 1, postTips);

        // dispatch
        dispatch(createAction(CREATE_COMMENT, newfeeds, true))

        return Promise.resolve(comment)
      })
      .catch(error => {
        // console.log('err binh luan', error);
        return Promise.reject(error)
      });
  }
}

export function createCommentConcernTip(data, currentPost) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.createPost(data))
      .then(response => {

        // console.log('response response response', response);

        // status
        let comment = _.get(response.data, 'data.comment')
        comment = {
          ...comment,
          isLongText: false
        }

        const comment_id = _.get(response.data, 'data.comment.comment_id')

        // current comments
        // let newfeeds = _.get(getState(), 'tours.listHotPostRelated');
        // let index;
        // index = _.findIndex(newfeeds, (o) => o.comment_id == comment_id);
        // console.log('- - - - - - - index - - - - -', index);
        // console.log('- - - - - - - newfeed - - - - -', newfeeds);
        // console.log('- - - - - - - comment_id - - - - -', comment_id);

        // let post = newfeeds[index]
        let total_comments = parseInt(currentPost.comment.total_comments) || 0
        total_comments += 1
        currentPost = { ...currentPost, total_comments }
        // newfeeds.splice(index, 1, post);

        // dispatch
        dispatch(createAction(GET_POST_AGENT, currentPost, true))

        return Promise.resolve(comment)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function createReplyComment(data) {

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.createPost(data))
      .then(response => {
        // data
        let comment = _.get(response.data, 'data.comment')
        comment = {
          ...comment,
          isLongText: false
        }

        return Promise.resolve(comment)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function editComment(data) {

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.commentEdit(data))
      .then(response => {
        return Promise.resolve(response)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}
export function uploadFile(photo) {

  return async function () {
    return ImageUtils.resizeDefault(photo)
      .then(data => {
        const body = new FormData();
        body.append('fileImages', {
          uri: data.uri,
          name: data.file_name,
          type: 'image/jpg'
        });

        return NetworkManager.request(ApiConfig.file.upload(body))
          .then(response => {
            // console.log('########################### respones', response);
            const success = _.get(response.data, 'status')
            const path = _.get(response.data, 'path')

            if (success === 'Succes' && path) {
              // console.log('chayjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj',);
              return Promise.resolve({ photo, path })
            }

            return Promise.reject()
          })
          .catch(error => {
            // console.log('TTTTTTTTTTTTTTTTT%%%%%%%%%%%%%%%%%%%', error);
            return Promise.reject(error)
          });

      }).catch((err) => {
        // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$', err);
        return Promise.reject(null)
      });
  }
}

export function getLikeListPost(comment_id) {

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.listLikes(comment_id))
      .then(response => {
        // data
        let likes = _.get(response.data, 'data.users')
        return Promise.resolve(likes)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function getApplyListPost(comment_id) {

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.listApply(comment_id))
      .then(response => {

        // console.log("lít user ", response);
        let likes = _.get(response.data, 'data.users')
        return Promise.resolve(likes)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function seachLocation(key_search) {

  // return async function (dispatch, getState) {
  return NetworkManager.request(ApiConfig.location.search(key_search))
    .then(response => {
      // console.log("responseSearch", response);
      return Promise.resolve(response.data)
    })
    .catch(error => {
      // console.log('eeeeeeeeeeeetttttttttttttttt', error);
      return Promise.reject(error)
    });
  // }
}

export function addLocation(data) {

  return NetworkManager.request(ApiConfig.location.addLocation(data))
    .then(response => {
      // console.log('ressssssssssssssss addlocation', response);
      return Promise.resolve(response)

    })
    .catch(error => {
      // console.log('eerrrrrppppptptptptptp addlocation', error);
      return Promise.reject(error)
    });
}

export function searchDetailLocation(key_search) {
  return NetworkManager.request(ApiConfig.location.searchDetail(key_search))
    .then(response => {
      // console.log("responseSearch", response);
      return Promise.resolve(response.data)
    })
    .catch(error => {
      //  console.log('eeeeeeeeeeeetttttttttttttttt', error);
      return Promise.reject(error)
    });
}

//Type post detail
const typePostDetail = {
  newfeeds: 'newfeeds',
  agentHome: 'agentHome',
  group: 'group',
  notify: 'notify',
  homeGroup: 'homeGroup'
}

export function deleteComment(data, parentData) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.deletePost(data))
      .then(response => {
        //  // status
        // let comment = _.get(response.data, 'data.comment')
        // comment = {
        //   ...comment,
        //   isLongText: false
        // }
        // current comments
        let comment_id = parentData.comment_id;
        let type = parentData.type;
        if (type == typePostDetail.newfeeds) {
          let newfeedsOther;
          let newfeeds = _.get(getState(), 'posts.newfeeds');
          let index;
          index = _.findIndex(newfeeds, (o) => o.comment_id == comment_id);
          if (index >= 0) {
            let post = newfeeds[index]
            let total_comments = parseInt(post.total_comments) || 0
            total_comments -= 1;
            post = { ...post, total_comments }
            newfeeds.splice(index, 1, post);
            // // dispatch
            dispatch(createAction(CREATE_COMMENT, newfeeds, true))
          }
          newfeedsOther = _.get(getState(), 'posts.newfeedOther');
          indexOther = _.findIndex(newfeedsOther, (o) => o.comment_id == comment_id);
          if (indexOther >= 0) {
            let postOther = newfeedsOther[indexOther]
            total_comments = parseInt(postOther.total_comments) || 0
            total_comments -= 1;
            postOther = { ...postOther, total_comments }
            newfeedsOther.splice(indexOther, 1, postOther);
            // // dispatch
            dispatch(createAction(GET_POSTS_OTHER_USER, newfeedsOther, true))
          }
        }
        if (type == typePostDetail.agentHome) {
          let postAgentHome = _.get(getState(), 'posts.postAgentHome');
          let index;
          index = _.findIndex(postAgentHome, (o) => o.comment_id == comment_id);
          let post = postAgentHome[index]
          let total_comments = parseInt(post.total_comments) || 0
          total_comments -= 1;
          post = { ...post, total_comments }
          postAgentHome.splice(index, 1, post);

          // // dispatch
          dispatch(createAction(GET_POST_AGENT, postAgentHome, true))
        }
        if (type == typePostDetail.group) {
          let newfeeds = _.get(getState(), 'tours.listPostGroup');
          let index;
          index = _.findIndex(newfeeds, (o) => o.comment_id == comment_id);
          let post = newfeeds[index]
          let total_comments = parseInt(post.total_comments) || 0
          total_comments -= 1;
          post = { ...post, total_comments }
          newfeeds.splice(index, 1, post);
          dispatch(createAction(CREATE_COMMENT, newfeeds, true));
        }
        if (type == typePostDetail.notify) {
          let newfeeds = _.get(getState(), 'notification.notifications');
          let index;
          index = _.findIndex(newfeeds, (o) => o.comment_id == comment_id);
          let post = newfeeds[index]
          let total_comments = parseInt(post.total_comments) || 0
          total_comments -= 1;
          post = { ...post, total_comments }
          newfeeds.splice(index, 1, post);
          dispatch(createAction(CREATE_COMMENT, newfeeds, true));
        }
        if (type == typePostDetail.homeGroup) {
          let newfeeds = _.get(getState(), 'tours.grade_Level_list_post')
          let index;
          index = _.findIndex(newfeeds, (o) => o.comment_id == comment_id);
          let post = newfeeds[index]
          let total_comments = parseInt(post.total_comments) || 0
          total_comments -= 1;
          post = { ...post, total_comments }
          newfeeds.splice(index, 1, post);
          dispatch(createAction(COMMENT_POST_HOME_GROUP, newfeeds, true))
        }
        return Promise.resolve(response)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }

}

//deleteGuideAgentComment
export function deleteGuideAgentComment(data, comment_id) {
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.deletePost(data.comment_id))
      .then(response => {
        if (comment_id) {
          let postAgentHome = _.get(getState(), 'posts.postAgentHome');
          let comments = _.get(getState(), 'posts.comments');
          let index = _.findIndex(comments, ['comment_id', data.comment_id]);
          if (index !== -1) {
            comments.splice(index, 1);
          }
          postAgentHome.find((item, index) => {
            if (parseInt(item.comment_id) === comment_id || item.comment_id === comment_id) {
              let total_comments = parseInt(postAgentHome[index].total_comments) || 0
              total_comments -= 1
              postAgentHome[index].total_comments = total_comments;
            }
            return item.comment_id === comment_id.toString() || item.comment_id === comment_id
          });
          // dispatch
          dispatch(createAction(GET_lIST_COMMENTS, comments, true))
          dispatch(createAction(GET_POST_AGENT, postAgentHome, true))
        }
        return Promise.resolve(response)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }

}

export function commentDetail(comment_id) {

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.commentDetail(comment_id))
      .then(response => {
        return Promise.resolve(response)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function applyPost(comment_id) {
  // console.log("data truyen len de huy", comment_id);
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.apply(comment_id))
      .then(response => {
        // console.log("response request sau apply", response);
        const messages = _.get(response.data, 'messages')
        const status = _.get(response.data, 'status')
        // const

        if (status === 'pending') {
          // current comments
          let currentComments = _.get(getState(), 'posts.newfeeds')
          // const index = _.findIndex(currentComments, { comment_id });
          const index = currentComments.findIndex(item => item.comment_id == comment_id.comment_id)
          let remove = false
          if (index >= 0) {
            let user_apply = null
            let comment = currentComments[index]
            let apply = comment.apply || {}
            let total_applys = parseInt(comment.total_applys) || 0

            if (messages === 'Đợi xác nhận') {
              user_apply = 'active'
              total_applys = total_applys + 1
              apply = { ...apply, type: 2, message: messages }
            }
            comment = { ...comment, user_apply, total_applys, apply }
            currentComments.splice(index, 1, comment);
            // console.log("currentCommentsTTTTTTT", currentComments);
            // dispatch
            dispatch(createAction(LIKE_POST, currentComments, true))
          }
          return Promise.resolve({ remove, currentComments, status })
        }

        if (status == 'cancelled') {
          let currentComments = _.get(getState(), 'posts.newfeeds')
          // const index = _.findIndex(currentComments, { comment_id.comment_id });
          // console.log("object12344556", currentComments);
          const index = currentComments.findIndex(item => item.comment_id == comment_id.comment_id)
          // console.log("index de nhan", index);
          let remove = false
          if (index >= 0) {
            let user_apply = null
            let comment = currentComments[index]
            let apply = comment.apply || {}
            let total_applys = parseInt(comment.total_applys) || 0

            if (messages === "Đã hủy tour") {
              // user_apply = 'active'
              total_applys = total_applys - 1
              apply = { ...apply, type: 4, message: messages }
            }
            comment = { ...comment, user_apply, total_applys, apply }
            currentComments.splice(index, 1, comment);
            // console.log("currentCommentsTTTTTTT", currentComments);
            // dispatch
            dispatch(createAction(LIKE_POST, currentComments, true))
          }
          return Promise.resolve({ remove, currentComments })
        }
        else {
          return Promise.resolve({ messages, error: true })
        }

      })
      .catch(error => {
        return Promise.reject(null)
      });
  }
}


export function applyUser(data) {

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.applyUser(data))
      .then(response => {
        // console.log("response agent tuong tac", response);
        const messages = _.get(response.data, 'apply.message')
        const status = _.get(response.data, 'status')
        // console.log(response)
        // console.log(status)
        // console.log("mesage ơ day la gi", status)

        if (status === 'RESULT_OK') {

          //   // current comments
          let currentGuide = _.get(getState(), 'agentApplyGuiderReducer.listGuideApply')
          const index = currentGuide.findIndex(item => item.user_guide_id == data.guider_id)
          if (index >= 0) {
            let user_apply = null
            let comment = currentGuide[index]
            let agent_apply = comment.agent_apply || {}
            // let total_applys = parseInt(comment.total_applys) || 0

            if (messages == "Agency hủy") {
              agent_apply = { ...agent_apply, type: 'agent-cancel' }

              comment = { ...comment, user_apply, agent_apply }
              currentGuide.splice(index, 1, comment);
              // console.log("object - currentGuide", currentGuide);
              dispatch(createAction(GET_LIST_GUIDE_APPLY_TOUR, currentGuide, true))
              return Promise.resolve(currentGuide)
            }
            if (messages == "Đồng ý") {
              agent_apply = { ...agent_apply, type: 'agree' }

              comment = { ...comment, user_apply, agent_apply }
              currentGuide.splice(index, 1, comment);
              // console.log("object - currentGuide", currentGuide);
              dispatch(createAction(GET_LIST_GUIDE_APPLY_TOUR, currentGuide, true))
              return Promise.resolve(currentGuide)
            }
          }
        } else {
          return Promise.resolve(response.data)
        }
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

//like post Home Agent 
export function likePostAgent(comment_id) {

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.likePost(comment_id))
      .then(response => {
        // console.log("response Like post", response);
        if (response.data && response.data.message == "Succes") {
          let data = {
            res: response.data.status,
            comment_id
          }
          dispatch(createAction(LIKE_AGENT_HOME, data, true))
          return Promise.resolve(data)
        }
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}
//guide apply tour tab agent
export function applyPostTour(comment_id) {
  // console.log("data truyen len de huy tab Agent", comment_id);
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.apply(comment_id))
      .then(response => {
        // console.log("response request", response);
        const messages = _.get(response.data, 'messages')
        const status = _.get(response.data, 'status')
        // const

        if (status === 'pending') {
          // current comments
          let currentComments = _.get(getState(), 'posts.postAgentHome')
          // console.log("object12344556 pending", currentComments);
          const index = currentComments.findIndex(item => item.comment_id == comment_id.comment_id)
          // console.log("index de nhan", index);

          if (index >= 0) {
            let user_apply = null
            let comment = currentComments[index]
            let apply = comment.apply || {}
            let total_applys = parseInt(comment.total_applys) || 0

            if (messages === 'Đợi xác nhận') {
              user_apply = 'active'
              total_applys = total_applys + 1
              apply = { ...apply, type: 2, message: messages }
            }
            comment = { ...comment, user_apply, total_applys, apply }
            // console.log("object comemnt", comment);
            currentComments.splice(index, 1, comment);
            // console.log("currentCommentsTTTTTTT tran agent", currentComments);
            // dispatch
            dispatch(createAction(GUIDE_APPLY_TOUR, currentComments, true))
          }
          return Promise.resolve(currentComments)
        }

        if (status == 'cancelled') {
          let currentComments = _.get(getState(), 'posts.postAgentHome')
          // const index = _.findIndex(currentComments, { comment_id.comment_id });
          // console.log("object12344556 cancel", currentComments);
          const index = currentComments.findIndex(item => item.comment_id == comment_id.comment_id)
          // console.log("index de nhan", index);
          let remove = false
          if (index >= 0) {
            let user_apply = null
            let comment = currentComments[index]
            let apply = comment.apply || {}
            let total_applys = parseInt(comment.total_applys) || 0

            if (messages === "Đã hủy tour") {
              // user_apply = 'active'
              total_applys = total_applys - 1
              apply = { ...apply, type: 4, message: messages }
            }
            comment = { ...comment, user_apply, total_applys, apply }
            currentComments.splice(index, 1, comment);
            // console.log("currentCommentsTTTTTTT", currentComments);
            // dispatch
            dispatch(createAction(GUIDE_APPLY_TOUR, currentComments, true))
          }
          return Promise.resolve(currentComments)
        }
        else {
          return Promise.resolve({ messages, error: true })
        }

      })
      .catch(error => {
        return Promise.reject(null)
      });
  }
}

//agent chon tour de apply guider
export function agentApplyTour(data) {

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.agentApplyTour(data))
      .then(response => {
        // console.log("agent mowif guider response", response);
        return Promise.resolve({ data: response.data, comment_id: data.comment_id })
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}


//apply trên trang cá nhân

export function applyTourProfile(comment_id) {
  // console.log("data truyen len de huy tab Agent", comment_id);
  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.apply(comment_id))
      .then(response => {
        // console.log("response request tour profile", response);
        const messages = _.get(response.data, 'messages')
        const status = _.get(response.data, 'status')
        // const

        if (status === 'pending') {
          // current comments
          let currentComments = _.get(getState(), 'posts.newfeedOther')
          // console.log("object12344556 pending", currentComments);
          const index = currentComments.findIndex(item => item.comment_id == comment_id.comment_id)
          // console.log("index de nhan", index);

          if (index >= 0) {
            let user_apply = null
            let comment = currentComments[index]
            let apply = comment.apply || {}
            let total_applys = parseInt(comment.total_applys) || 0

            if (messages === 'Đợi xác nhận') {
              user_apply = 'active'
              total_applys = total_applys + 1
              apply = { ...apply, type: 2, message: messages }
            }
            comment = { ...comment, user_apply, total_applys, apply }
            // console.log("object comemnt", comment);
            currentComments.splice(index, 1, comment);
            // console.log("currentCommentsTTTTTTT tran agent", currentComments);
            // dispatch
            dispatch(createAction(APPLY_TOUR_PROFILE, currentComments, true))
          }
          return Promise.resolve(currentComments)
        }

        if (status == 'cancelled') {
          let currentComments = _.get(getState(), 'posts.newfeedOther')
          // const index = _.findIndex(currentComments, { comment_id.comment_id });
          // console.log("object12344556 cancel", currentComments);
          const index = currentComments.findIndex(item => item.comment_id == comment_id.comment_id)
          // console.log("index de nhan", index);
          // console.log("currentComments, currentComments", currentComments);
          let remove = false
          if (index >= 0) {
            let user_apply = null
            let comment = currentComments[index]
            let apply = comment.apply || {}
            let total_applys = parseInt(comment.total_applys) || 0

            if (messages == 'Đã hủy tour') {
              // user_apply = 'active'
              total_applys = total_applys - 1
              apply = { ...apply, type: 4, message: messages }
            }
            comment = { ...comment, user_apply, total_applys, apply }
            currentComments.splice(index, 1, comment);
            // console.log("currentCommentsTTTTTTT", currentComments);
            // dispatch
            dispatch(createAction(APPLY_TOUR_PROFILE, currentComments, true))
          }
          return Promise.resolve(currentComments)
        }
        else {
          return Promise.resolve({ messages, error: true })
        }

      })
      .catch(error => {
        return Promise.reject(null)
      });
  }
}



export function agentCancelGuide(data) {

  return async function (dispatch, getState) {
    return NetworkManager.request(ApiConfig.posts.applyUser(data))
      .then(response => {
        // console.log("response agent tuong tac", response);
        const messages = _.get(response.data, 'apply.message')
        const status = _.get(response.data, 'status')
        const mess = _.get(response.data, 'messages')
        // console.log(response)
        // console.log(status)
        // console.log("mesage ơ day la gi", messages)

        if (status === 'RESULT_OK') {

          //   // current comments
          let currentGuide = _.get(getState(), 'agentApplyGuiderReducer.listGuideTour')
          const index = currentGuide.findIndex(item => item.user_guide_id == data.guider_id)
          if (index >= 0) {
            let user_apply = null
            let comment = currentGuide[index]
            let agent_apply = comment.agent_apply || {}
            // let total_applys = parseInt(comment.total_applys) || 0

            if (messages == "Agency hủy") {
              agent_apply = { ...agent_apply, type: 'agent-cancel' }

              comment = { ...comment, user_apply, agent_apply }
              currentGuide.splice(index, 1, comment);
              // console.log("object - currentGuide", currentGuide);
              dispatch(createAction(GET_LIST_GUIDE_TOUR, currentGuide, true))
              return Promise.resolve(currentGuide)
            }
            if (messages == "Đồng ý") {
              agent_apply = { ...agent_apply, type: 'agree' }

              comment = { ...comment, user_apply, agent_apply }
              currentGuide.splice(index, 1, comment);
              // console.log("object - currentGuide", currentGuide);
              dispatch(createAction(GET_LIST_GUIDE_TOUR, currentGuide, true))
              return Promise.resolve(currentGuide)
            }

            //thêm 1 case de bat trương hop chuyen type ve cancelled

          } else {
            return Promise.resolve({ messages, error: true })
          }
        } else if (status == "guide-cancel") {
          let currentGuide = _.get(getState(), 'agentApplyGuiderReducer.listGuideTour')
          const index = currentGuide.findIndex(item => item.user_guide_id == data.guider_id)
          if (index >= 0) {
            let user_apply = null
            let comment = currentGuide[index]
            let agent_apply = comment.agent_apply || {}
            if (mess == "Agency chấp nhận yêu cầu hủy guider") {
              agent_apply = { ...agent_apply, type: "cancelled" }

              comment = { ...comment, agent_apply }
              currentGuide.splice(index, 1, comment);
              // console.log("object - currentGuide", currentGuide);
              dispatch(createAction(GET_LIST_GUIDE_TOUR, currentGuide, true))
              return Promise.resolve(currentGuide)
            }
          }
        }
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}