
import { Navigation } from 'react-native-navigation';
import ScreenName from '../config/screens-name'

export function showMoreOptionsPost(data, user_me, callback) {
  Navigation.showOverlay({
    component: {
      name: ScreenName.post_more_option,
      passProps: {
        data,
        user_me,
        callback
      },
      options: {
      }
    }
  });
};

export function showModalComment(data, callback) {
  Navigation.showOverlay({
    component: {
      name: ScreenName.modal_comment,
      passProps: {
        data,
        callback
      },
      options: {
      }
    }
  });
};
export function showModalCommentPostCheckIn(data, callback) {
  Navigation.showOverlay({
    component: {
      name: ScreenName.modal_postcheckin,
      passProps: {
        data,
        callback
      },
      options: {
      }
    }
  });
};
export function showModalCommentReport(dataFunction, callbackFunction, callBackLoad) {
  Navigation.showOverlay({
    component: {
      name: ScreenName.modal_Report,
      passProps: {
        dataFunction,
        callbackFunction,
        callBackLoad
      },
      options: {
      }
    }
  });
};
///
export function showModalCommentRequestJoinGroup(componentId, data) {

  Navigation.showOverlay({
    component: {
      name: ScreenName.modal_comment_group_container,
      passProps: {
        data,
        componentId
      },
      options: {
      }
    }
  });
};

export function showModalCancelPost(callback) {
  Navigation.showOverlay({
    component: {
      name: ScreenName.modal_cancel_post,
      passProps: {
        callback
      },
      options: {
      }
    }
  });
};
export function showModalCancelBackGroup(callback) {
  Navigation.showOverlay({
    component: {
      name: ScreenName.modal_cancel_back_group_post,
      passProps: {
        callback
      },
      options: {
      }
    }
  });
};

export function showSharePost(data, user_me, callback) {
  Navigation.showOverlay({
    component: {
      name: ScreenName.post_share_action_sheet,
      passProps: {
        data,
        user_me,
        callback
      },
      options: {
      }
    }
  });
};

export function showRegisterSelectCard(type, data, callback) {
  Navigation.showOverlay({
    component: {
      name: ScreenName.register_select_card,
      passProps: {
        type,
        data,
        callback
      },
      options: {
      }
    }
  });
};

export function showDatePicker(data, callback) {
  Navigation.showOverlay({
    component: {
      name: ScreenName.date_picker,
      passProps: {
        data,
        callback
      },
      options: {
      }
    }
  });
};


export function showDate(data, callback) {
  Navigation.showOverlay({
    component: {
      name: ScreenName.date,
      passProps: {
        data,
        callback
      },
      options: {
      }
    }
  });
};


export function showActionSheet(data, callback) {
  Navigation.showOverlay({
    component: {
      name: ScreenName.ActionSheet,
      passProps: {
        data,
        callback

      },
      options: {
      }
    }
  });
};
export function showModalMoreOptionGallery(callback) {
  Navigation.showOverlay({
    component: {
      name: ScreenName.MoreOptionGallery,
      passProps: {
        callback
      },
      options: {
      }
    }
  });
};

export function ScreenAddGuider(componentId, data) {
  Navigation.showModal({
    component: {
      name: ScreenName.AddGuiderComponent,
      passProps: {
        componentId,
        data
      },
      options: {
      }
    }
  });
};

export function ScreenSelectLanguageInviteGuider(componentId, callback, type) {
  Navigation.showModal({
    component: {
      name: ScreenName.SelectLanguageInviteGuider,
      passProps: {
        componentId,
        callback,
        type
      },
      options: {
      }
    }
  });
};

export function showModalToUserProfile(componentId, data, callBack) {
  Navigation.showModal({
    component: {
      name: ScreenName.ShowModalUserProfile,
      passProps: {
        data,
        callBack,
        componentId
      },
      options: {}
    }
  })

};


