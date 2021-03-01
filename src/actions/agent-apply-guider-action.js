import {
    GET_TOUR_APPLY_GUIDER,
    createAction,
    GET_LIST_TOUR_INVITE,
    GUIDE_CONFIMR,
    GET_LIST_GUIDE_INVITE,
    GET_LIST_GUIDE_APPLY_TOUR,
    GET_LIST_GUIDE_TOUR,
    GET_GUIDE_TOUR_FINISH,
    GET_TOUR_APPLIED
} from './action-types'
import NetworkManager from '../modules/NetworkManager'
import ApiConfig from '../config/api-config'
import _ from 'lodash';
import StringUtils from '../utils/StringUtils'

export function getListTourApplyGuider(data) {
    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.tour.listTourApplyGuider(data))
            .then(response => {
                let result, postTour;
                if (response.data) {
                    result = response.data.result
                }
                if (result == 'success') {
                    postTour = response.data.data.map((item) => {
                        return {
                            ...item,
                            isLongText: StringUtils.isLongTextPost(item.content),
                            showFull: false
                        }
                    })
                    return Promise.resolve(postTour)
                }

            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}


export function getListTourAgentInvite(data) {
    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.tour.listTourAgentInvite(data))
            .then(response => {
                let currTourInvite = _.get(response.data, 'data')
                if (data.page !== 1) {
                    const tourInvite = _.get(getState(), 'agentApplyGuiderReducer.listTourInvite')
                    currTourInvite = _.concat(currTourInvite, tourInvite)
                }

                dispatch(createAction(GET_LIST_TOUR_INVITE, currTourInvite, true))
                return Promise.resolve(currTourInvite)


            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}

export function applyTourInvite(comment_id) {
    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.posts.apply(comment_id))
            .then(response => {
                const messages = _.get(response.data, 'messages')
                const status = _.get(response.data, 'status')
                // const

                if (status === 'pending') {
                    // current comments
                    let currentComments = _.get(getState(), 'agentApplyGuiderReducer.listTourInvite')
                    // const index = _.findIndex(currentComments, { comment_id });
                    const index = currentComments.findIndex(item => item.comment_id == comment_id.comment_id)
                    let remove = false
                    if (index >= 0) {
                        let user_apply = null
                        let comment = currentComments[index]
                        let invited = comment.invited || {}
                        // let total_applys = parseInt(comment.total_applys) || 0

                        if (messages === 'Đợi xác nhận') {
                            user_apply = 'active'
                            // total_applys = total_applys + 1
                            invited = { ...invited, status: 'pending', message: messages }
                        }
                        comment = { ...comment, user_apply, invited }
                        currentComments.splice(index, 1, comment);
                        // dispatch
                        dispatch(createAction(GUIDE_CONFIMR, currentComments, true))
                    }
                    return Promise.resolve({ remove, currentComments, status })
                }

                if (status == 'cancelled') {
                    let currentComments = _.get(getState(), 'agentApplyGuiderReducer.listTourInvite')
                    // const index = _.findIndex(currentComments, { comment_id.comment_id });

                    const index = currentComments.findIndex(item => item.comment_id == comment_id.comment_id)

                    let remove = false
                    if (index >= 0) {
                        let user_apply = null
                        let comment = currentComments[index]
                        let invited = comment.invited || {}
                        // let total_applys = parseInt(comment.total_applys) || 0

                        if (messages === "Đã hủy") {
                            // user_apply = 'active'
                            // total_applys = total_applys - 1
                            invited = { ...invited, status: 'cancelled', message: messages }
                        }
                        comment = { ...comment, user_apply, invited }
                        currentComments.splice(index, 1, comment);
                        // dispatch
                        dispatch(createAction(GUIDE_CONFIMR, currentComments, true))
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

// danh sach Guide ma Agent đã mời
export function getListGuideInvited(data) {

    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.tour.listGuideAgentInvite(data))
            .then(response => {
                let guider = _.get(response.data, 'data')

                if (data.page !== 1) {
                    const currentGuide = _.get(getState(), 'agentApplyGuiderReducer.listGuideInvited')
                    guider = _.concat(currentGuide, guider)
                }
                // dispatch
                dispatch(createAction(GET_LIST_GUIDE_INVITE, guider, true))

                return Promise.resolve(guider)
            })
            .catch(error => {

                return Promise.reject(error)
            });
    }
}
//danh sach Guide apply tour
export function getListGuideApplyTour(data) {
    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.posts.listApply(data))
            .then(response => {
                let guider = _.get(response.data, 'data.users')

                // if (page != 1) {
                //     const currentGuide = _.get(getState(), 'agentApplyGuiderReducer.listGuideInvited')
                //     guider = _.concat(currentGuide, guider)
                // }
                // dispatch
                dispatch(createAction(GET_LIST_GUIDE_APPLY_TOUR, guider, true))

                return Promise.resolve(guider)
            })
            .catch(error => {

                return Promise.reject(error)
            });
    }
}

export function getListGuideTour(data) {
    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.posts.guiderTour(data))
            .then(response => {
                let guider = _.get(response.data, 'data.users')

                // if (page != 1) {
                //     const currentGuide = _.get(getState(), 'agentApplyGuiderReducer.listGuideInvited')
                //     guider = _.concat(currentGuide, guider)
                // }
                // dispatch
                dispatch(createAction(GET_LIST_GUIDE_TOUR, guider, true))

                return Promise.resolve(guider)
            })
            .catch(error => {

                return Promise.reject(error)
            });
    }
}

export function handleAgentCancelInvited(data) {
    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.tour.invitedTour(data))
            .then(response => {
                const success = _.get(response.data, 'result')
                let guiders = _.get(getState(), 'agentApplyGuiderReducer.listGuideInvited')
                if (success == 'success') {
                    let index = _.findIndex(guiders, (o) => o.user_id == data.user_guider_id)
                    let guider = guiders[index]
                    if (response.data.action == 'invite') {
                        guider.invited.status = 'invite'

                    }
                    if (response.data.action == 'agent-cancel') {
                        guider.invited.status = 'agent-cancel'
                    }
                    guiders.splice(index, 1, guider)
                }
                dispatch(createAction(GET_LIST_GUIDE_APPLY_TOUR, guiders, true))
                return Promise.resolve(response)

            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}

export function handleAgentCancelGuideTour(data) {
    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.posts.guiderTour(data))
            .then(response => {
                dispatch(createAction(GET_LIST_GUIDE_TOUR, guider, true))
                return Promise.resolve(guider)
            })
            .catch(error => {

                return Promise.reject(error)
            });
    }
}

export function getListGuideTourFinish(data) {
    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.posts.getGuideFinish(data))
            .then(response => {
                let guider, status;
                status = response.data.status
                if (status == "RESULT_OK") {
                    guider = response.data.data.users
                }
                dispatch(createAction(GET_GUIDE_TOUR_FINISH, guider, true))

                return Promise.resolve(guider)
            })
            .catch(error => {

                return Promise.reject(error)
            });
    }
}

export function handleReviewUser(data) {
    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.posts.reviewUser(data))
            .then(response => {

                // console.log("response review", response);
                let guider, status;
                // status = response.data.status
                // if (status == "RESULT_OK") {
                //     guider = response.data.data.users
                // }
                // dispatch(createAction(GET_GUIDE_TOUR_FINISH, guider, true))

                return Promise.resolve(response.data)
            })
            .catch(error => {

                return Promise.reject(error)
            });
    }
}

export function guideConfirmInvited(data) {
    // console.log("data guide confim gui len ", data);
    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.posts.confirmInvited(data))
            .then(response => {

                // console.log("response guide confirm", response);

                const status = _.get(response.data, 'status')
                const message = _.get(response.data, 'messages')
                if (status == 'RESULT_OK') {
                    let currentComments = _.get(getState(), 'agentApplyGuiderReducer.listTourInvite')
                    // const index = _.findIndex(currentComments, { comment_id.comment_id });
                    // console.log("object12344556789", currentComments);
                    const index = currentComments.findIndex(item => item.comment_id == data.comment_id)
                    // console.log("index de nhan", index);
                    let remove = false
                    let comment = currentComments[index]
                    let invited = comment.invited || {}
                    if (index >= 0) {

                        invited = { ...invited, status: "agreed" }
                        comment = { ...comment, invited }
                        currentComments.splice(index, 1, comment);
                        // console.log("currentCommentsTTTTTTT", currentComments);
                        // dispatch
                        dispatch(createAction(GUIDE_CONFIMR, currentComments, true))
                    }
                    return Promise.resolve(message)

                } else if (status == "RESULT_NOT_OK") {
                    return Promise.resolve(message)
                }


            })
            .catch(error => {

                return Promise.reject(error)
            });
    }
}


export function guideCancelInvited(data) {
    // console.log("data guide cancel gui len ", data);
    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.tour.invitedTour(data))
            .then(response => {

                console.log("response guide cancel tour", response);

                const status = _.get(response.data, 'status')
                const messages = _.get(response.data, 'messages')
                if (status == 'RESULT_OK') {
                    let currentComments = _.get(getState(), 'agentApplyGuiderReducer.listTourInvite')
                    // const index = _.findIndex(currentComments, { comment_id.comment_id });
                    // console.log("object12344556789", currentComments);
                    const index = currentComments.findIndex(item => item.comment_id == data.comment_id)
                    // console.log("index de nhan", index);
                    let remove = false
                    let comment = currentComments[index]
                    let invited = comment.invited || {}
                    if (index >= 0) {

                        invited = { ...invited, status: "guide-cancel" }
                        comment = { ...comment, invited }
                        currentComments.splice(index, 1, comment);
                        // console.log("currentCommentsTTTTTTT", currentComments);
                        // dispatch
                        dispatch(createAction(GUIDE_CONFIMR, currentComments, true))
                    }
                    return Promise.resolve(messages)

                } else if (status == "RESULT_NOT_OK") {
                    return Promise.resolve(messages)
                }


            })
            .catch(error => {

                return Promise.reject(error)
            });
    }
}



//xu lý hủy tour , hủy đăng ký trên danh sách lịch trình
export function guideCancelTour(comment_id) {
    console.log("data truyen len de huy tab Agent", comment_id);
    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.posts.apply(comment_id))
            .then(response => {
                console.log("response request guide dong y cancel tour", response);
                const messages = _.get(response.data, 'messages')
                const status = _.get(response.data, 'status')
                const result = _.get(response.data, 'result')
                // console.log("result guide huy tour", result);
                if (result === 'success') {
                    //     // current comments
                    let currentComments = _.get(getState(), 'tours.tours')
                    // console.log("tour dang ki hien tai", currentComments);
                    const index = currentComments.findIndex(item => item.comment_id == comment_id.comment_id)
                    console.log("index guide huyr tour", index);
                    let comment = currentComments[index]
                    if (index >= 0) {
                        let apply = comment.apply || {}
                        if (messages == "Guider yêu cầu hủy tour") {
                            apply = { ...apply, action: 'guide-request-cancel' }
                            comment = { ...comment, apply }

                            currentComments.splice(index, 1, comment);
                            dispatch(createAction(GET_TOUR_APPLIED, currentComments, true))
                        }
                        if (messages == 'Đã hủy tour') {
                            apply = { ...apply, action: "guide-agency-commit-cancel" }
                            comment = { ...comment, apply }
                            currentComments.splice(index, 1, comment);
                            dispatch(createAction(GET_TOUR_APPLIED, currentComments, true))

                        }
                        if (messages == 'Đã hủy đăng ký tour') {
                            apply = { ...apply, action: "guide-cancel-before-agreed" }
                            comment = { ...comment, apply }
                            currentComments.splice(index, 1, comment);
                            dispatch(createAction(GET_TOUR_APPLIED, currentComments, true))

                        }
                    }
                }
                return Promise.resolve(response.data)
            })
            .catch(error => {
                return Promise.reject(error)
            });
    }
}


export function getGuiFinish(data) {
    return async function (dispatch, getState) {
        return NetworkManager.request(ApiConfig.posts.getListGuideFinish(data))
            .then(response => {

                console.log("response guide finish", response);
                let guider, status;
                status = response.data.status
                if (status == "RESULT_OK") {
                    guider = response.data.users
                }
                dispatch(createAction(GET_GUIDE_TOUR_FINISH, guider, true))

                return Promise.resolve(response.data)
            })
            .catch(error => {

                return Promise.reject(error)
            });
    }
}