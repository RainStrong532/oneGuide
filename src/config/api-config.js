// {
//   url,
//   method,
//   data,
//   params, 
//   cancelToken: source.token,
//   needBaseUrl, // default : true
// }

// Router
const app = {
    // info: () => {
    // return {
    // url: 'https://www.reddit.com/r/frontend.json',
    // method: 'get',
    // needBaseUrl: false
    // }
    // },
    getListLanguage: () => {
        return {
            url: '/language',
            method: 'get'
        }
    },
    getTermPolicy: () => {
        return {
            url: '/terms',
            method: 'get'
        }
    }
}

const auth = {
    login: (data) => {
        // let data = {
        //   email, password, oauth_provider
        // }
        return {
            url: '/login',
            method: 'post',
            data: data
        }
    },
    register: (email, password, fullname, type, oauth_provider) => {
        let data = {
            email,
            password,
            fullname,
            type,
            oauth_provider
        }
        return {
            url: '/register',
            method: 'post',
            data: data
        }
    },
    registerFinish: (data) => {

        return {
            url: '/registerfinish',
            method: 'post',
            data
        }
    },
    getApiCheck: () => {

        return {
            url: '/comment/highlights',
            method: 'get',

        }
    },

    updateInfo: (data) => {
        return {
            url: '/updateinformation',
            method: 'post',
            data,
            headers: { 'Content-Type': 'multipart/form-data' }
        }
    },

    logout: () => {
        return {
            url: '/logout',
            method: 'get'
        }
    },
    confirmAccount: (data) => {
        return {
            url: '/register_confirm',
            method: 'post',
            data
        }
    },
    resetPassword: (email) => {
        let data = {
            email
        };
        return {
            url: '/forgotpass',
            method: 'post',
            data
        }
    },

    hamdinhnghiasudungTet: (data) => {
        return {
            url: "register_confirm",
            method: "post",
            data
        }
    },

    verify: (data) => {
        return {
            url: '/verify',
            method: 'post',
            data
        }
    }

}

const users = {
    me: () => {
        return {
            url: '/user/profile',
            method: 'get',
            data: '',
        }
    },
    search_all: () => {
        return {
            url: '',
            method: 'get',
            data: ''
        }
    },
    updateme: (data) => {

        return {
            url: '/update-profile',
            method: 'post',
            data
        }
    },
    getUserInfo: (user_id) => {
        const params = {
            user_id
        };
        return {
            url: '/user',
            method: 'get',
            params,
        }
    },
    // getUserFriendList: (params) => {
    //     const data = {
    //         // user_id: params,
    //         page: 1
    //     }
    //     return {
    //         url: '/listfriends',
    //         method: 'post',
    //         data
    //     }
    // },
    getUserFriendList: (user_id, page) => {
        const data = {
            user_id,
            page
        }
        return {
            url: '/listfriends_orther',
            method: 'post',
            data
        }
    },
    RequestAddUserFriendList: () => {
        const params = {
            status: "0"
        }
        return {
            url: '/listfriends',
            method: 'get',
            params
        }
    },
    searchUserFriendList: (data) => {
        return {
            url: '/listfriends',
            method: 'post',
            data
        }
    },
    getUserFriendListAddMe: (data) => {
        // console.log(data, "000000000000000000000");
        // 

        return {
            url: '/listfriends_orther',
            method: 'post',
            data
        }
    },
    inviteFriendMore: (data) => {
        // const params = {
        //     ...data
        // }
        return {
            url: '/invite_group',
            method: 'post',
            data
        }
    },
    getListTourGuideLike: () => {
        // console.log("------------------------------------------------");
        return {
            url: '/list_favourite',
            method: 'get',
        }
    },
    getFriendListOtherUser: (user_id) => {
        return {
            url: `/listfriends_orther?user_id=${user_id}&page=1`,
            method: 'get',
        }
    },
    getListFriendOther: (data) => {
        return {
            url: `/listfriends_orther`,
            method: 'post',
            data
        }
    },
    // changePassword: (pass_old, password) => {
    //     const params = {
    //         pass_old,
    //         password,
    //         re_password: password
    //     }
    //     return {
    //         url: '/change-password',
    //         method: 'post',
    //         params
    //     }
    // },
    // getOtherUserInfo: (user_id) => {
    //     const params = {
    //         user_id
    //     }

    //     return {
    //         url: `/user/${user_id}`,
    //         method: 'get',
    //         params
    //     }
    // },
    // addFriend: (data) => {
    //     return {
    //         url: `/friendrequests`,
    //         method: 'post',
    //         data
    //     }
    // },
    // findUser: (keyword) => {


    //     return {
    //         //tạm đóng
    //         // url: '/finduser',
    //         url: `/search_all?keySearch=${keyword}`,
    //         method: 'get',
    //         //params
    //     }
    // },
    // sendEmail: (payload) => {
    //     const params = {
    //         email: payload
    //     }
    //     return {
    //         url: '/invail',
    //         method: 'post',
    //         params
    //     }
    // },

    // getRecommenFr: () => {
    //     return {
    //         url: 'user/suggestfriend',
    //         method: 'get'
    //     }
    // },

    getUserRequest: () => {
        return {
            url: 'listusersendrequeust',
            method: 'get'
        }
    },

    getReviewGuider: (payload) => {
        const data = {
            user_id: payload.user_id,
            page: payload.page
        }
        return {
            url: 'reviews/list',
            method: 'get',
            params: data,
        }
    },

    // doFavorite: (data) => {

    //     return {
    //         url: `/favourite`,
    //         method: 'post',
    //         data
    //     }
    // },
    changePassword: (pass_old, password) => {
        const data = {
            pass_old,
            password,
            re_password: password
        }
        return {
            url: '/change-password',
            method: 'post',
            data
        }
    },
    getOtherUserInfo: (user_id) => {
        const params = {
            user_id
        }

        return {
            url: `/user/${user_id}`,
            method: 'get',
            // params
        }
    },
    addFriend: (data) => {
        return {
            url: `/friendrequests`,
            method: 'post',
            data
        }
    },
    findUser: (keyword) => {
        return {
            //tạm đóng
            // url: '/finduser',
            url: `/search_all?keySearch=${keyword}`,
            method: 'get',
            //params
        }
    },

    searchUser: (keyword, page) => {
        // console.log(keyword, 'hú hú hú hú,', page);
        const params = {
            page
        }
        return {
            //tạm đóng
            // url: '/finduser',
            url: `/list_user_search?keySearch=${keyword}`,
            method: 'get',
            params
        }
    },

    searchPost: (keyword, page) => {
        // const params = {
        //     page
        // }
        return {
            //tạm đóng
            // url: '/finduser',
            url: `/list_post_normal_search?keySearch=${keyword}&page=${page}`,
            method: 'get',
            // params
        }
    },

    searchTour: (keyword, page) => {
        // const params = {
        //     page
        // }
        return {
            //tạm đóng
            // url: '/finduser',
            url: `/list_post_search?keySearch=${keyword}&page=${page}`,

            method: 'get',
            // params
        }
    },

    sendEmail: (payload) => {
        const params = {
            email: payload
        }
        return {
            url: '/invail',
            method: 'post',
            params
        }
    },

    getRecommenFr: () => {
        return {
            url: 'user/suggestfriend',
            method: 'get'
        }
    },

    // getUserRequest: () => {
    //     return {
    //         url: 'listusersendrequeust',
    //         method: 'get'
    //     }
    // },

    // getReviewGuider: (payload) => {
    //     const data = {
    //         user_id: payload.user_id,
    //         page: payload.page
    //     }
    //     return {
    //         url: 'reviews/list',
    //         method: 'get',
    //         params: data,
    //     }
    // },

    doFavorite: (data) => {

        return {
            url: `/favourite`,
            method: 'post',
            data
        }
    },

    getAlbumList: (payload) => {
        const data = {
            page: payload.page ? payload.page : 1
        }
        if (payload.group_id) {
            data.group_id = parseInt(payload.group_id);
        }
        return {
            url: `album_list/`,
            method: 'get',
            params: data,
        }
    },

    getPhotoAlbum: (payload) => {
        const data = {
            page: payload.page ? payload.page : 1,
            comment_id: payload.comment_id
        }
        return {
            url: `photo_album/`,
            method: 'get',
            params: data
        }
    },
    getUploadImage: (payload) => {
        const data = {
            page: payload.page ? payload.page : 1,
        }
        if (payload.group_id) {
            data.group_id = parseInt(payload.group_id);
        }
        return {
            url: `all_photo`,
            method: 'get',
            params: data
        }
    },

    getUploadImageGroup: (payload) => {
        const data = {
            page: payload.page ? payload.page : 1,
            group_id: payload.group_id
        }
        return {
            url: `all_photo`,
            method: 'get',
            params: data
        }
    },

    createAlbum: (data) => {
        return {
            url: `/comment/post`,
            method: 'post',
            data
        }
    },
    resendEmail: (email) => {
        let data = {
            email
        }
        return {
            url: '/resend',
            method: 'post',
            data
        }
    }
}

const posts = {

    agentApplyTour: (data) => {
        return {
            url: '/comment/apply_guide',
            method: 'post',
            data
        }
    },

    getPostAgent: (param) => {
        return {
            url: `/comment/advanced?type=${param.type}&page=${param.page}`,
            method: 'get'
        }
    },
    callSearchAPI: (param) => {
        return {
            url: `/comment/search_advanced?type=${param.type}&keyword=${param.keysearch}&location=${param.place}&language=${param.language}&start_date=${param.startDate}&end_date=${param.endDate}`,
            method: 'get'

        }
    },
    newfeeds: (page) => {

        const data = {
            page
        };

        return {
            url: '/comment/list',
            method: 'get',
            params: data,
        }
    },
    createPost: (data) => {
        console.log('data data data data data data data data', data);

        return {
            url: '/comment/post',
            method: 'post',
            data,
        }
    },
    deletePost: (comment_id) => {
        const data = {
            comment_id
        };
        return {
            url: '/comment/delete',
            method: 'post',
            data,
        }
    },
    commentDetail: (comment_id) => {
        const params = {
            comment_id
        };
        return {
            url: `/comment/${comment_id}`,
            method: 'get',
            params,
        }
    },
    commentEdit: (data) => {

        return {
            url: '/comment/edit',
            method: 'post',
            data,
        }
    },
    likePost: (comment_id) => {

        const data = {
            comment_id
        };

        return {
            url: '/like',
            method: 'post',
            data: data,
        }
    },
    listComments: (comment_id, page) => {

        const params = {
            comment_id,
            page
        };
        return {
            url: '/comment/listparent',
            method: 'get',
            params,
        }
    },
    listLikes: (comment_id) => {
        const params = {
            comment_id
        }
        return {
            url: `/listuserlikecomment/${comment_id}`,
            method: 'get',
            params
        }
    },
    listApply: (comment_id,) => {
        const params = {
            comment_id
        }

        return {
            url: `/listuserapply/${comment_id}`,
            method: 'get',
            params
        }
    },
    save: (comment_id) => {
        const data = {
            comment_id
        }
        return {
            url: '/comment/save',
            method: 'post',
            data
        }
    },
    apply: (comment_id) => {
        // const data = {
        //     comment_id
        // }
        return {
            url: '/comment/apply',
            method: 'post',
            data: comment_id
        }
    },
    listCommentOtherUser: (page, user_id) => {

        const data = {
            page,
            user_id
        };

        return {
            url: `/user/comment/${user_id}`,
            method: 'post',
            data,
        }
    },
    applyUser: (data) => {
        return {
            url: '/comment/agentapply',
            method: 'post',
            data
        }
    },
    guiderTour: (data) => {
        let params = {
            data
        }
        return {
            url: `/listtourguider/${data}`,
            method: 'get',
            params
        }
    },
    getGuideFinish: (comment_id) => {
        return {
            url: `/reviews/${comment_id}`,
            method: 'get',
        }

    },
    reviewUser: (data) => {
        return {
            url: '/reviews/post',
            method: 'post',
            data
        }
    },
    confirmInvited: (data) => {
        return {
            url: '/comment/agreed_invite',
            method: 'post',
            data
        }
    },
    getListGuideFinish: (data) => {
        return {
            url: '/reviews/list_agency',
            method: 'post',
            data
        }
    }

}

const file = {
    upload: (data) => {
        return {
            url: '/upload',
            method: 'post',
            data,
            headers: { 'Content-Type': 'multipart/form-data' }
        }
    },
}

const notification = {
    list: (page) => {
        const params = {
            page
        };

        return {
            url: '/notification/list',
            method: 'get',
            params,
        }
    },
    delete: (notification_id) => {
        const params = {
            notification_id
        };

        return {
            url: '/notification/delete',
            method: 'get',
            params,
        }
    }
}

const message = {
    listConversations: (page) => {
        const params = {
            page
        };

        return {
            url: '/messages/list',
            method: 'get',
            params,
        }
    },
    searchConversations: (data) => {
        return {
            url: `/messages/list`,
            method: 'post',
            data,
        }
    },
    listMessages: (params, page) => {
        const params_page = { ...params, page }
        return {
            url: '/chat',
            method: 'get',
            params: params_page,
        }
    },
    createChatroom: (params) => {

        return {
            url: '/chat/created_conversation',
            method: 'post',
            params,
        }
    },
}

const tour = {


    confirm_Delete_PostList: (group_id, page) => {
        return {
            url: `/list_approval_post/${group_id}?page=${page}`,
            method: 'get',

        }
    },


    confirm_delete_Request_PostList: (group_id, comment_id, action) => {

        let data = { group_id, comment_id, action }

        return {
            url: 'approval_post',
            method: 'post',
            data: data
        }
    },
    // chia sẻ group

    postShareGroupAPI: (group_id, datas) => {

        let data = {
            group_id: group_id.group_id,
            content: datas
        }
        // console.log("data API:::::::::::::::::", data);
        return {
            url: 'share_group',
            method: 'post',
            data
        }
    },
    confirm_delete_Request: (group_id, user_orther_id, action) => {

        let data = { group_id, user_orther_id, action }
        return {
            url: 'approval_group',
            method: 'post',
            data: data
        }
    },

    getMemberJoinGroup: (id) => {


        return {
            url: `/list_approval_group/${id}`,
            method: 'get',

        }
    },

    getMemberGroupId: (id, page) => {
        return {
            url: `/list_member_group/${id}?page=${page}`,
            method: 'get',
        }
    },

    getTrackingHistoryApi: (id, page) => {
        const data = page
        return {
            url: '/tracking',
            method: 'post',
            data
        }
    },
    getHotPostRelatedApi: (id, page) => {
        const data = page
        return {
            url: '/comment/list_related_tips',
            method: 'post',
            data
        }
    },
    getListPostTipApi: (id, page) => {
        // const data = page

        const data = page
        return {
            url: '/comment/list_news',
            method: 'post',
            data
        }
    },
    getListPostRatingInfoApi: (id, page) => {
        const data = page
        return {
            url: '/reviews/list',
            method: 'post',
            data

        }
    },
    getInfomationGroupApi: (data) => {

        return {
            url: `/group/${data}`,
            method: 'get',
        }
    },




    outGroupAPI: (id) => {
        let idObjec = {
            group_id: id
        }

        return {
            url: '/out_group',
            method: 'post',
            params: idObjec
        }
    },

    getDataApi: (id, page) => {


        return {
            url: `/list_comment_group/${id}?page=${page}`,
            method: 'get',
        }
    },


    joinGroupApi: (dataGroup) => {
        let idObjec = {
            group_id: dataGroup
        }
        return {
            url: '/join_group',
            method: 'post',
            params: idObjec,
        }
    },
    outGroupApi: (dataGroup) => {
        let idObjec = {
            group_id: dataGroup
        }
        return {
            url: '/out_group',
            method: 'post',
            params: idObjec,
        }
    },
    outGroupInviteApi: (dataGroup) => {
        let idObjec = {
            group_id: dataGroup
        }
        return {
            url: '/cancel_invite_group',
            method: 'post',
            params: idObjec,
        }
    },
    outGroupApi_Your: (dataGroup) => {
        let idObjec = {
            group_id: dataGroup
        }
        return {
            url: '/out_group',
            method: 'post',
            params: idObjec,
        }
    },
    getGroupApi: () => {

        return {
            url: '/cat_group?page=1',
            method: 'get',

        }
    },


    listApplied: (page) => {
        const params = {
            page
        };

        return {
            url: 'user/lich-trinh',
            method: 'get',
            params,
        }
    },

    listUpcoming: (page) => {
        const params = {
            page
        };

        return {
            url: 'user/sap-dien-ra',
            method: 'get',
            params,
        }
    },
    listDeparted: (page) => {
        const params = {
            page
        };

        return {
            url: 'user/khoi-hanh',
            method: 'get',
            params,
        }
    },
    listCancelled: () => {
        return {
            url: 'user/huy-tour',
            method: 'get',
        }
    },
    listFinished: () => {
        return {
            url: 'user/ket-thuc',
            method: 'get',
        }
    },
    listCalendar: (params) => {
        return {
            url: '/calendar',
            method: 'get',
            params
        }
    },

    listTourApplyGuider: (data) => {

        return {
            url: '/comment/list_apply_guide',
            method: 'post',
            data
        }
    },

    listTourAgentInvite: (data) => {
        return {
            url: '/comment/list_invite',
            method: 'post',
            data
        }
    },
    listGuideAgentInvite: (data) => {
        return {
            url: '/comment/list_guider_invited',
            method: 'post',
            data
        }
    },
    getGudierMatchTour: (data) => {

        return {
            url: '/comment/find_guider',
            method: 'post',
            data
        }
    },

    invitedTour: (data) => {

        return {
            url: '/comment/send_invite',
            method: 'post',
            data
        }
    },

    getListReport: (data) => {

        return {
            url: '/list_report',
            method: 'post',
            data
        }
    },

    sendReport: (data) => {

        return {
            url: '/send_report',
            method: 'post',
            data
        }
    }

}

const location = {
    search: (text) => {
        const params = {
            keysearch: text,
        }
        return {
            //tạm đóng
            // url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?`,
            url: `/locations`,
            method: 'post',
            params
        }
    },

    searchDetail: (text) => {
        const params = {
            keysearch: text,
        }
        return {
            //tạm đóng
            // url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?`,
            url: `/places`,
            method: 'post',
            params
        }
    },

    addLocation: (data) => {
        return {
            url: '/places/add',
            method: 'post',
            data
        }
    }
}



const calendar = {
    addEvent: (data) => {
        return {
            url: '/calendar/add-event-user',
            method: 'post',
            data
        }
    },
    deleteEvent: (data) => {
        return {
            url: '/calendar/delete-event',
            method: 'post',
            data
        }
    },
    editEvent: (data) => {
        return {
            url: '/calendar/edit-event',
            method: 'post',
            data
        }
    },
}

export default {
    app,
    auth,
    users,
    posts,
    file,
    notification,
    message,
    tour,
    location,
    calendar
}