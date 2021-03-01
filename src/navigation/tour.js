import { Navigation } from 'react-native-navigation';
import ScreenName from '../config/screens-name'

export function gotoUserApplyScreen(componentId, commentId) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.user_apply,
      passProps: {
        commentId
      },
      options: {
      }
    }
  });
};

export function showModalTourReview(componentId, data) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.tour_review_component,
      passProps: {
        data
      },
      options: {
      }
    }
  });
};


export function pushListLocation(componentId, data) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.location_list_component,
      passProps: {
        data
      },
      options: {
      }
    }
  });
};

export function showModalCalendarDayFree(data, options, callback) {
  Navigation.showModal({
    stack: {
      children: [
        {
          component: {
            name: ScreenName.CalandarDayFreeComponent,
            passProps: {
              data,
              options,
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


  // Navigation.showModal({
  //   component: {
  //     name: ScreenName.CalandarDayFreeComponent,
  //     passProps: {
  //       data,
  //       options,
  //       callback
  //     },
  //     options: {
  //     }
  //   }
  // });
};

// export function ScreenAddGuider(componentId, data) {
//   Navigation.showModal(componentId, {
//     component: {
//       name: ScreenName.Guide_Home,
//       passProps: {
//         data
//       },
//       options: {
//       }
//     }
//   });
// };


export function pushCalendarDayFree(componentId, data, options, callback) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.CalandarDayFreeComponent,
      passProps: {
        data,
        options,
        callback
      },
      options: {
      }
    }
  });
};

export function pushAddEvent(componentId, data, options, callback) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.AddEventComponent,
      passProps: {
        data,
        options,
        callback
      },
      options: {
      }
    }
  });
};


export function pushFreeDayListComponent(componentId, data, options, callback) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.FreeDayListComponent,
      passProps: {
        data,
        options,
        callback
      },
      options: {
      }
    }
  });
};

export function pushTourApplyGuider(componentId, data) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.ListTourAgentApplyGuider,
      passProps: {
        data

      },
      options: {
      }
    }
  });
};



export function pushListGuideApply(componentId, data) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.ListGuideApply,
      passProps: {
        data

      },
      options: {
      }
    }
  });
};
// export function ScreenAddGuider(componentId, data) {
//   Navigation.push(componentId, {
//     component: {
//       name: ScreenName.Guide_Home,
//       passProps: {
//         data
//       },
//       options: {
//       }
//     }
//   });
// };


export function pushListGuideTour(componentId, data) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.ListGuideTour,
      passProps: {
        data

      },
      options: {
      }
    }
  });
};


export function pushListGuideInvited(componentId, data) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.ListGuideInvited,
      passProps: {
        data

      },
      options: {
      }
    }
  });
};

export function pushDetailTourInvited(componentId, data) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.DetailTourInvited,
      passProps: {
        data

      },
      options: {
      }
    }
  });
};

export function pushListGuideUpcoming(componentId, data) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.ListGuideUpcoming,
      passProps: {
        data
      },
      options: {
      }
    }
  });
};

export function pushReportTour(componentId, data, passPropsScreen) {
  Navigation.showModal({
    component: {
      name: ScreenName.ReportComponent,
      passProps: {
        componentId,
        data,
        passPropsScreen
      },
      options: {
      }
    }
  });
};
export function pushListReportComponent(componentId, data) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.ListReportComponent,
      passProps: {
        data
      },
      options: {
      }
    }
  });
};

export function pushReviewComponent(componentId, data, header) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.ReviewComponent,
      passProps: {
        item: data,
        header
      },
      options: {
      }
    }
  });
};

export function showModalReview(componentId, data, passPropsScreen) {
  Navigation.showModal({
    component: {
      name: ScreenName.tour_review_component,
      passProps: {
        componentId,
        data,
        passPropsScreen
      },
      options: {
      }
    }
  });
};

export function showModalGuideFinish(componentId, data, passPropsScreen, tabKey) {
  Navigation.showModal({
    component: {
      name: ScreenName.GuideFinishComponent,
      passProps: {
        componentId,
        data,
        passPropsScreen,
        tabKey
      },
      options: {
      }
    }
  });
};