import _ from 'lodash';

import {
    GET_MY_INFO,
    createAction,
    UPDATE_USER_INFO,
    GET_USER_INFO,
    GET_RECOMMEND_FRIEND,
    GET_SEARCH_ALL,
    GET_SEARCH_USER,
    GET_SEARCH_POST,
    GET_SEARCH_TOUR,
    GET_TOUR_GUIDE_LIKE,
    GET_LIST_AlBUM,
    GET_ALBUM_DETAIL,
    GET_UPLOAD_IMAGES_GROUP,
    GET_UPLOAD_IMAGES,
    SEARCH_FRIEND,
    REQUEST_ADD_FRIEND,
    REQUEST_GET_LIST_FRIEND,
    REQUEST_GET_ORTHER,
    REQUEST_POST_INVITE,
    COMFIRM_REQUEST_ADD_FRIEND
} from './action-types'
import NetworkManager from '../modules/NetworkManager'
import ApiConfig from '../config/api-config'
import { uploadFile } from './post-action';



export function getMyInfo() {
    console.log("ddax vaooooooo")
    return async function (dispatch, getState) {

        return NetworkManager.request(ApiConfig.users.me())
            .then(response => {
                console.log("response get lại data sau khi upload ảnh", response);
                let result = response.data
                const user = _.get(response.data, 'data.user')
                if (user) {
                    dispatch(createAction(GET_MY_INFO, user, true))
                    return Promise.resolve(user)
                }
                return Promise.resolve(result)
            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}

export function resendEmail(email) {

    return async function (dispatch, getState) {

        return NetworkManager.request(ApiConfig.users.resendEmail(email))
            .then(response => {
                // console.log("api resend email", response);

                return Promise.resolve(response)
            })
            .catch(error => {
                // console.log("loi o day la gif", error);
                return Promise.reject(error)
            });
    }
}

export function updateProfileInfo(data) {

    return async function (dispatch, getState) {

        return NetworkManager.request(ApiConfig.users.updateme(data))
            .then(response => {
                // console.log('eeeeetttttttttttttttttttttttttttttttt', response);
                dispatch(createAction(UPDATE_USER_INFO, response, true))
                return Promise.resolve(response)
            })
            .catch(error => {
                // console.log('eeeeeeeeeeeeeeeeeeemmmmmmmmmmmmmmmmmmmmmmmmmmmmm', error);
                return Promise.reject(error)
            });
    }
}

export function getUserInfo(user_id) {
    return async function (dispatch, getState) {

        return NetworkManager.request(ApiConfig.users.getUserInfo(user_id))
            .then(response => {
                dispatch(createAction(GET_USER_INFO, response, true))
                return Promise.resolve(response)
            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}

export function getOtherUserInfo(user_id) {
    return async function (dispatch, getState) {

        return NetworkManager.request(ApiConfig.users.getOtherUserInfo(user_id))
            .then(response => {
                console.log("responseUser thong tin chua bien doi", response);
                return Promise.resolve(response)
            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}

// export function getUserFriendList() {
//     return async function (dispatch, getState) {

//         return NetworkManager.request(ApiConfig.users.getUserFriendList())
//             .then(response => {
//                 let users = _.get(response, 'data.listFriends')
//                 return Promise.resolve(users)
//             })
//             .catch(error => {
//                 return Promise.reject(error)
//             });
//     }
// }
export function getUserFriendList(user_id, page) {
    return async function (dispatch, getState) {

        return NetworkManager.request(ApiConfig.users.getUserFriendList(user_id, page))
            .then(response => {
                let totalFriends
                if (response.data.listFriends) {
                    totalFriends = response.data.listFriends
                }
                if (page != 1) {
                    const dataListFriends = _.get(getState(), 'user.getListFriendsMeOrOther')
                    totalFriends = _.concat(dataListFriends, totalFriends)
                }
                // let users = _.get(response, 'data.listFriends')
                dispatch(createAction(REQUEST_GET_LIST_FRIEND, totalFriends, true))
                return Promise.resolve(totalFriends)

            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}
export function getUserFriendListOther(data) {
    return async function (dispatch, getState) {

        return NetworkManager.request(ApiConfig.users.getListFriendOther(data))
            .then(response => {
                let users = _.get(response, 'data.listFriends')
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}
export function getRequestAddMeFriend() {
    return async function (dispatch, getState) {

        return NetworkManager.request(ApiConfig.users.RequestAddUserFriendList())
            .then(response => {
                // let users = _.get(response, 'data.listFriends')
                dispatch(createAction(REQUEST_ADD_FRIEND, response, true))

                return Promise.resolve(users)
            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}
// API get list bạn bè để mời 
export function getUserFriendListAdd(data) {
    // console.log("API get list bạn bè để mời ::::: action::: đì:::::", data);
    return async function (dispatch, getState) {

        return NetworkManager.request(ApiConfig.users.getUserFriendListAddMe(data))
            .then(response => {
                // console.log("API get list bạn bè để mời ::::: action::: về:::::", response);
                dispatch(createAction(REQUEST_GET_ORTHER, response.data, true))
                return Promise.resolve(response)
            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}
// API gửi yêu cầu mời bạn tham gia nhóm
export function inviteFriendMore(data) {
    // console.log("API gửi yêu cầu mời bạn tham gia nhóm :: action:::::::đi:::::::", data);
    return async function (dispatch, getState) {

        return NetworkManager.request(ApiConfig.users.inviteFriendMore(data))
            .then(response => {
                // console.log("API gửi yêu cầu mời bạn tham gia nhóm :: action:::::::về:::::::", response);
                dispatch(createAction(REQUEST_POST_INVITE, { response, user_id: data.user_orther_id }, true))
                return Promise.resolve(response)
            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}

export function getFriendListOtherUser(user_id) {
    return async function (dispatch, getState) {

        return NetworkManager.request(ApiConfig.users.getFriendListOtherUser(user_id))
            .then(response => {
                // console.log('lấy danh sách bạn bè của người khác', response);
                let other = _.get(response, 'data.listFriends')
                return Promise.resolve(other)
            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}

export function getReviewGuider(payload) {
    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.users.getReviewGuider(payload))
            .then(response => {
                return Promise.resolve(response)
            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}

export function getUserRequest() {
    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.users.getUserRequest())
            .then(response => {

                let users = _.get(response, 'data.data.users')
                return Promise.resolve(users)
            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}

export function changePassword(pass_old, password) {
    return async function () {
        return NetworkManager.request(ApiConfig.users.changePassword(pass_old, password))
            .then(response => {
                // console.log("object change pass", response);
                return Promise.resolve(response)
            })
            .catch(error => {
                return Promise.resolve(error)
            })
    }
}
export function addFriend(data) {
    return async function (dispatch) {
        return NetworkManager.request(ApiConfig.users.addFriend(data))
            .then(response => {
                // console.log('ressppppooon::::: đã gửi trả về cái gì nhỉ', response);
                if (response) {

                    dispatch(createAction(COMFIRM_REQUEST_ADD_FRIEND, response.data, true))
                }
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.resolve(error)
            })
    }
}
export function findUser(keyword) {
    return async function (dispatch) {
        return NetworkManager.request(ApiConfig.users.findUser(keyword))
            .then(response => {
                // console.log(keyword, 'oooooooooooooo', response);

                if (response) {
                    dispatch(createAction(GET_SEARCH_ALL, response.data, true))
                }
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.resolve(error)
            })
    }
}

export function SearchAllUser(keyword, page) {
    // console.log('key word', keyword, page);
    return async function (dispatch) {
        return NetworkManager.request(ApiConfig.users.searchUser(keyword, page))
            .then(response => {

                if (response) {
                    //listPostSearch = [...response.data.post.comments, ...response.data.tour.comments]
                    //console.log("1231212121111111111111111111111", listPostSearch);
                    dispatch(createAction(GET_SEARCH_USER, response.data, true))
                }
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.resolve(error)
            })
    }
}

export function SearchAllPost(keyword, page) {

    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.users.searchPost(keyword, page))
            .then(response => {
                let totalPost = response.data.post.comments
                if (page != 1) {
                    const currentPost = _.get(getState(), 'posts.totalPost')
                    totalPost = _.concat(currentPost, totalPost)

                }
                let resultPost = totalPost.filter(el => el != undefined)

                // console.log('totalllllllllllllllll', resultPost);
                dispatch(createAction(GET_SEARCH_POST, resultPost, true))
                return Promise.resolve(resultPost)
            })
            .catch(error => {
                return Promise.resolve(error)
            })
    }
}

export function SearchAllTour(keyword, page) {

    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.users.searchTour(keyword, page))
            .then(response => {
                // console.log('ok ok ok ok', response);
                let totalTour
                if (response.data.tour.comments) {
                    totalTour = response.data.tour.comments
                }
                if (page != 1) {
                    const currentTour = _.get(getState(), 'posts.totalTour')
                    totalTour = _.concat(currentTour, totalTour)

                }
                // let resultTour = totalTour.filter(el => el != undefined)

                dispatch(createAction(GET_SEARCH_TOUR, totalTour, true))
                return Promise.resolve(totalTour)
            })
            .catch(error => {
                return Promise.resolve(error)
            })
    }
}

export function sendEmail(email) {
    return async function () {
        return NetworkManager.request(ApiConfig.users.sendEmail(email))
            .then(response => {
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.resolve(error)
            })
    }
}

export function getRecommenFriend() {
    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.users.getRecommenFr())
            .then(response => {
                // get user info
                const listUser = response.data.users;
                if (listUser) {
                    dispatch(createAction(GET_RECOMMEND_FRIEND, listUser, true))
                    return Promise.resolve(listUser)
                }
            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}
// moi them 5/8 , huong dan vien du lich yeu thich
export function getListTourGuideLike() {
    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.users.getListTourGuideLike())
            .then(response => {
                // console.log("ressponse data yeu thich", response);
                let users = _.get(response, 'data.user')
                return Promise.resolve(users)
            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}
export function doFavorite(data) {

    return async function () {
        return NetworkManager.request(ApiConfig.users.doFavorite(data))
            .then(response => {

                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.resolve(error)
            })
    }
}

export function getAlbumList(data) {

    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.users.getAlbumList(data))
            .then(response => {
                let listAlbum = response.data.data;
                let current = _.get(getState(), 'user.listAlbum')
                if (data.page !== 1 && albumDetail.length > 0) {
                    current = _.concat(current, listAlbum)
                }
                if (data.page === 1) {
                    current = listAlbum
                }
                dispatch(createAction(GET_LIST_AlBUM, current, true));
                return Promise.resolve(listAlbum)
            })
            .catch(error => {
                return Promise.resolve(error)
            })
    }
}

export function getPhotoAlbum(data) {
    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.users.getPhotoAlbum(data))
            .then(response => {
                let albumDetail = response.data.data[0].photos ? response.data.data[0].photos : [];
                let current = _.get(getState(), 'user.albumDetail')
                if (data.page !== 1 && albumDetail) {
                    current = _.concat(current, albumDetail);
                } else {
                    current = albumDetail;
                }

                dispatch(createAction(GET_ALBUM_DETAIL, current, true))
                return Promise.resolve(albumDetail)
            })
            .catch(error => {
                return Promise.resolve(error)
            })
    }
}

export function getUploadImage(data) {

    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.users.getUploadImage(data))
            .then(response => {
                let uploadImages = response.data.data;
                let current = _.get(getState(), 'user.uploadImages')
                if (data.page !== 1 && uploadImages.length > 0) {
                    current = _.concat(current, uploadImages)
                }
                if (data.page === 1) {
                    current = uploadImages
                }
                dispatch(createAction(GET_UPLOAD_IMAGES, current, true))
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.resolve(error)
            })
    }
}

export function getUploadImageGroup(data) {

    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.users.getUploadImageGroup(data))
            .then(response => {
                let uploadImages = response.data.data;
                let current = _.get(getState(), 'user.uploadImagesGroup')
                if (data.page !== 1 && uploadImages.length > 0) {
                    current = _.concat(current, uploadImages)
                }
                if (data.page === 1) {
                    current = uploadImages
                }
                dispatch(createAction(GET_UPLOAD_IMAGES_GROUP, current, true))
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.resolve(error)
            })
    }
}

export function createAlbum(data) {

    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.users.createAlbum(data))
            .then(response => {
                // console.log("object", response);
                let comment = response.data.data.comment;
                let current = _.get(getState(), 'user.listAlbum')
                // console.log("122222", current);
                if (current) {

                    current.push(comment);
                }
                dispatch(createAction(GET_LIST_AlBUM, current, true));
                return Promise.resolve(response.data)
            })
            .catch(error => {
                // console.log("object errro", error);
                return Promise.resolve(error)
            })
    }
}

export function deleteAlbum(comment_id) {

    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.posts.deletePost(comment_id))
            .then(response => {

                // current comments
                let currentAlbum = _.get(getState(), 'user.listAlbum')
                const index = _.findIndex(currentAlbum, { comment_id });
                currentAlbum.splice(index, 1);

                // dispatch
                dispatch(createAction(GET_LIST_AlBUM, currentAlbum, true))
                return Promise.resolve(comment_id)
            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}

export function editAlbum(data) {

    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.posts.commentEdit(data))
            .then(response => {

                // dispatch
                const comment = response.data.data.comment;
                const comment_id = comment.comment_id;
                const photos = comment.photo.photos;
                let currentAlbum = _.get(getState(), 'user.listAlbum');
                let currentAlbumDetail = _.get(getState(), 'user.albumDetail');
                const index = _.findIndex(currentAlbum, { comment_id });
                currentAlbum.splice(index, 1, comment);
                currentAlbumDetail = photos;
                dispatch(createAction(GET_LIST_AlBUM, currentAlbum, true))
                dispatch(createAction(GET_ALBUM_DETAIL, currentAlbumDetail, true))
                return Promise.resolve(response)
            })
            .catch(error => {
                return Promise.reject(error.toString())
            });
    }
}

export function searchUserFriendList(data) {
    return async function (dispatch, getState) {

        return NetworkManager.request(ApiConfig.users.searchUserFriendList(data))
            .then(response => {
                let current = _.get(getState(), 'user.friendSearch');
                let users = _.get(response, 'data.listFriends')
                if (data.page !== 1 && users && !_.isEqual(current, users)) {
                    current = _.concat(current, users);
                }
                if (data.page === 1 && users) {
                    current = users
                }
                dispatch(createAction(SEARCH_FRIEND, current, true))
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}