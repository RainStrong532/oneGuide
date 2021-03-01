import { Navigation } from 'react-native-navigation';
import ScreenName from '../config/screens-name'

export function showScreenPostTrip(componentId, data) {
    // console.log("data push userProfile", data);
    Navigation.push(componentId, {
        component: {
            name: ScreenName.PostTrip,
            passProps: {
                data
            },
            options: {}
        }
    })

};

export function ShowScreenMoreInfo(componentId, data) {
    // console.log("data push userProfile", data);
    Navigation.push(componentId, {
        component: {
            name: ScreenName.MoreInfo,
            passProps: {
                data
            },
            options: {}
        }
    })

};

export function ShowScreenPublicProfile(componentId, data) {
    // console.log("data push userProfile", data);
    Navigation.push(componentId, {
        component: {
            name: ScreenName.PublicProfile,
            passProps: {
                data
            },
            options: {}
        }
    })

};

export function pushToUserProfile(componentId, data, callBack) {
    Navigation.push(componentId, {
        component: {
            name: ScreenName.user_profie,
            passProps: {
                data,
                callBack
            },
            options: {}
        }
    })

};

export function pushToRatingInfo(componentId, data) {
    Navigation.push(componentId, {
        component: {
            name: ScreenName.RatingInfo,
            passProps: {
                data
            },
            options: {}
        }
    });
};

export function pushToProfileInformation(componentId) {
    Navigation.push(componentId, {
        component: {
            name: ScreenName.profile_infomation,
            passProps: {

            },
            options: {}
        }
    });
};

export function showModalUserProfile(user_id, options) {
    Navigation.showModal({
        component: {
            name: ScreenName.profile,
            passProps: {
                user_id,
                options: { ...options, show: true },
            },
            options: {}
        }
    });
};

export function pushToUserFriendList(componentId, passProps) {
    // console.log('============ Đây là bạn bè ==========');
    Navigation.push(componentId, {
        component: {
            name: ScreenName.user_friend_list,
            passProps: {
                passProps
            },
            options: {}
        }
    });
};

export function nextScreenTrackingGuide(componentId, passProps) {
    // console.log('============ Đây là bạn bè ==========');
    Navigation.push(componentId, {
        component: {
            name: ScreenName.ShowTrackingHistoryGuide,
            passProps: {
                passProps
            },
            options: {}
        }
    });
};
export function nextScreenHotPostRelated(componentId, passProps) {
    // console.log('============ Đây là bạn bè ==========');
    Navigation.push(componentId, {
        component: {
            name: ScreenName.ShowHotPostRelateds,
            passProps: {
                passProps
            },
            options: {}
        }
    });
};
export function nextScreenTrackingAgent(componentId, passProps) {
    // console.log('============ Đây là bạn bè ==========');
    Navigation.push(componentId, {
        component: {
            name: ScreenName.ShowTrackingHistoryAgent,
            passProps: {
                passProps
            },
            options: {}
        }
    });
};
export function requestAddUserFriendList(componentId, passProps) {
    // console.log('============ Đây là bạn bè ==========');
    Navigation.push(componentId, {
        component: {
            name: ScreenName.request_add_friend_list,
            passProps: {
                passProps
            },
            options: {}
        }
    });
};

export function pushInvitationtojointour(componentId) {
    Navigation.push(componentId, {
        component: {
            name: ScreenName.Invitationtojointour,
            passProps: {

            },
            options: {}
        }
    });
};

export function pushToPostSavedList(componentId) {
    Navigation.push(componentId, {
        component: {
            name: ScreenName.post_saved,
            passProps: {

            },
            options: {}
        }
    });
};

export function pushToChangePassword(componentId) {
    Navigation.push(componentId, {
        component: {
            name: ScreenName.change_password,
            passProps: {

            },
            options: {}
        }
    });
};
export function pushToAccountVerify(componentId, data) {
    Navigation.push(componentId, {
        component: {
            name: ScreenName.AccountVerificationComponent,
            passProps: { data },
            options: {}
        }
    });
};

export function pushToGroup(componentId, listdata, callback) {
    Navigation.push(componentId, {
        component: {
            name: ScreenName.Group,
            passProps: {
                listdata,
                callback
            },
        }
    });
};
// thêm 3/8 , chuyển từ profileComponent sang profileLikeComponent
export function pushTourGuideLike(componentId, titlel) {
    Navigation.push(componentId, {
        component: {
            name: ScreenName.tour_guide_like,
            passProps: {
                titlel
            },
            options: {

            }
        }
    });
};
// thêm 3/8, chuyển từ hướng dẫn viên yêu thích sang trang cá nhân
export function backProfileComponent(componentId) {
    Navigation.push(componentId, {
        component: {
            name: ScreenName.profile,
            passProps: {

            },
            options: {}
        }
    })
}

export function pushToHomeGroup(componentId) {
    Navigation.push(componentId, {
        component: {
            name: ScreenName.HomeGroup,
            passProps: {

            },
            options: {}
        }
    });
};
export function pushInformationGroup(componentId, data, callback) {
    Navigation.push(componentId, {
        component: {
            name: ScreenName.InformationGroup,
            passProps: {
                data,
                callback

            },
            options: {}
        }
    });
};

export function gotoPostDetailHomeGroup(componentId, data, options) {

    Navigation.push(componentId, {
        component: {
            name: ScreenName.PostDetailHomeGroup,
            passProps: {
                data,
                options
            },
            options: {
            }
        }
    });
};
// export function askedToJoinTheGroup(componentId) {
//     console.log("true 2222222222");
//     Navigation.push(componentId, {
//         component: {
//             name: ScreenName.AskedToJoinTheGroup,
//             passProps: {


//             },
//             options: {}
//         }
//     });
// };

export function pushGallery(componentId) {
    Navigation.push(componentId, {
        component: {
            name: ScreenName.GalleryComponent,
            passProps: {

            },
            options: {}
        }
    });
};

export function pushGalleryGroup(componentId, passProps) {
    Navigation.push(componentId, {
        component: {
            name: ScreenName.GalleryGroupComponent,
            passProps: {
                passProps
            },
            options: {}
        }
    });
};

export function pushCreateAlbum(componentId, data) {
    Navigation.push(componentId, {
        component: {
            name: ScreenName.CreateAlbum,
            passProps: {
                data
            },
            options: {}
        }
    });
}

export function pushToDetailPhotos(componentId, data) {
    Navigation.push(componentId, {
        component: {
            name: ScreenName.DetailPhotos,
            passProps: {
                data
            },
            options: {}
        }
    });
}

export function pushToImageGallery(componentId, data) {
    Navigation.push(componentId, {
        component: {
            name: ScreenName.ImageGalleryComponent,
            passProps: {
                data
            },
            options: {}
        }
    });
}
// export function pushToWebview(componentId, data) {
//   Navigation.push(componentId, {
//     component: {
//       name: ScreenName.WebViewComponent,
//       passProps: {
//         data
//       },
//       options: {
//       }
//     }
//   });
// };});
// };

export function pushToTermPolicy(componentId) {
    Navigation.push(componentId, {
        component: {
            name: ScreenName.TermPolicy,
            passProps: {

            },
            options: {}
        }
    });
};

export function pushToAgentHome(componentId) {
    Navigation.push(componentId, {
        component: {
            name: ScreenName.Agent_Home,
            passProps: {

            },
            options: {}
        }
    });
};