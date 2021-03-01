import { Navigation } from 'react-native-navigation';
import ScreenName from '../config/screens-name'


export function groupPostRequest(comment_id, data) {
  // console.log("lốc tao đi");
  Navigation.showModal({
    stack: {
      children: [
        {
          component: {
            name: ScreenName.GroupPostApproval,
            passProps: {
              comment_id,
              data
            },
            options: {
              topBar: {
                visible: false,
                drawBehind: false,
                animate: false,
                height: 0
              }
            },
            bottomTabs: {
              visible: false
            }
          }
        }
      ]
    }
  })
};
export function groupMembersRequest(comment_id, data) {
  Navigation.showModal({
    stack: {
      children: [
        {
          component: {
            name: ScreenName.GroupMembersApproval,
            passProps: {
              comment_id,
              data
            },
            options: {
              topBar: {
                visible: false,
                drawBehind: false,
                animate: false,
                height: 0
              },
              bottomTabs: {
                visible: false
              }

            }
          }
        }
      ]
    }
  })
};

export function askedToJoinTheGroup(comment_id, data) {

  Navigation.showModal({
    stack: {
      children: [
        {
          component: {
            name: ScreenName.AskedToJoinTheGroup,
            passProps: {
              comment_id,
              data
            },
            options: {
              topBar: {
                visible: false,
                drawBehind: false,
                animate: false,
                height: 0
              }
            }
          }
        }
      ]
    }
  })
};

export function showModalPostCheckIn(type, comment_id) {

  Navigation.showModal({
    stack: {
      children: [
        {
          component: {
            name: ScreenName.PostCheckInComponent,
            passProps: {
              type,
              comment_id
            },
            options: {
              topBar: {
                visible: false,
                drawBehind: false,
                animate: false,
                height: 0
              }
            }
          }
        }
      ]
    }
  })
};

export function showImageCheckIn(type, comment_id) {
  Navigation.showModal({
    stack: {
      children: [
        {
          component: {
            name: ScreenName.ShowImageCheckInComponent,
            passProps: {
              type,
              comment_id
            },
            options: {
              topBar: {
                visible: false,
                drawBehind: false,
                animate: false,
                height: 0
              }
            }
          }
        }
      ]
    }
  })
};

export function backScreenHome(componentId, toRoot) {
  if (toRoot) {

    Navigation.popToRoot(componentId);
  } else {
    Navigation.pop(componentId);
  }

}

export function showModalPostCreate(type, comment_id, callback, group_id) {
  Navigation.showModal({
    stack: {
      children: [
        {
          component: {
            name: ScreenName.post_create,
            passProps: {
              type,
              comment_id,
              callback,
              group_id
            },
            options: {
              topBar: {
                visible: false,
                drawBehind: false,
                animate: false,
                height: 0
              }
            }
          }
        }
      ]
    }
  })
};

export function gotoInvitedEmail(componentId, data) {

  Navigation.push(componentId, {
    component: {
      name: ScreenName.InvitedUserOther,
      passProps: {
        data,
      },
      options: {
      }
    }
  });
};
export function InviteMemberMe(componentId, data) {

  Navigation.push(componentId, {
    component: {
      name: ScreenName.InviteMemberMe,
      passProps: {
        data,
      },
      options: {
      }
    }
  });
};

export function gotoPostDetail(componentId, data, options) {

  Navigation.push(componentId, {
    component: {
      name: ScreenName.post_detail,
      passProps: {
        data,
        options
      },
      options: {
      }
    }
  });
};

export function gotoPostDetailGroup(componentId, data, options) {

  Navigation.push(componentId, {
    component: {
      name: ScreenName.PostDetailGroupComponent,
      passProps: {
        data,
        options
      },
      options: {
      }
    }
  });
};

export function gotoPostDetailTip(componentId, data, options) {

  Navigation.push(componentId, {
    component: {
      name: ScreenName.PostDetailTipComponent,
      passProps: {
        data,
        options
      },
      options: {
      }
    }
  });
};

export function FriendList(componentId, data) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.FriendList,
      passProps: {
        data,
      },
      options: {
      }
    }
  });
};

export function showModalSharePost(data, callback) {
  Navigation.showModal({
    stack: {
      children: [
        {
          component: {
            name: ScreenName.share_post,
            passProps: {
              data,
              callback
            },
            options: {
              topBar: {
                visible: false,
                drawBehind: false,
                animate: false,
                height: 0
              }
            }
          }
        }
      ]
    }
  })
};

export function showModalSharePostAsMessage(data, callback) {
  Navigation.showModal({
    stack: {
      children: [
        {
          component: {
            name: ScreenName.share_post_as_link,
            passProps: {
              data,
              callback
            },
            options: {
              topBar: {
                visible: false,
                drawBehind: false,
                animate: false,
                height: 0
              }
            }
          }
        }
      ]
    }
  })
};

export function showModalLikeList(componentId, data, options) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.like_list_post,
      passProps: {
        data,
        options
      },
      options: {
      }
    }
  });

  // Navigation.showModal({
  //   component: {
  //     name: ScreenName.like_list_post,
  //     passProps: {
  //       data, 
  //       options
  //     },
  //     options: {
  //     }
  //   }
  // });
};

export function showModalApplyList(componentId, data, options) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.apply_list_post,
      passProps: {
        data,
        options
      },
      options: {
      }
    }
  });

  // Navigation.showModal({
  //   component: {
  //     name: ScreenName.apply_list_post,
  //     passProps: {
  //       data, 
  //       options
  //     },
  //     options: {
  //     }
  //   }
  // });
};
export function pushDetailGuideAgent(componentId, data, options) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.DetailGuideAgent,
      passProps: {
        data,
        options
      },
      options: {
      }
    }
  });
};

export function SeeAllPostTip(componentId, data) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.SeeAllPostTip,
      passProps: {
        data
      },
      options: {
      }
    }
  });
};