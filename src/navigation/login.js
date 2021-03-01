
import { Navigation } from 'react-native-navigation';
import ScreenName from '../config/screens-name'

export function gotoLoginScreen(componentId) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.login,
      passProps: {
      },
      options: {
      }
    }
  });

};

export function gotoRegisterScreen(componentId, provider) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.register,
      passProps: {
        provider
      },
      options: {
      }
    }
  });
};

export function gotoRegisterGuideScreen(componentId, email, fromGoogle) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.register_guide,
      passProps: {
        email,
        fromGoogle
      },
      options: {
      }
    }
  });
};

export function gotoRegisterAgentScreen(componentId, email, fromGoogle) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.register_agent,
      passProps: {
        email,
        fromGoogle
      },
      options: {
      }
    }
  });
};

export function gotoTutorialScreen(componentId) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.tutorial,
      passProps: {
      },
      options: {
      }
    }
  });
};

export function gotoSettingProfileScreen(componentId) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.profile_update,
      passProps: {
      },
      options: {
      }
    }
  });
};

export function gotoSelectProviderScreen(componentId) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.select_provider,
      passProps: {
      },
      options: {
      }
    }
  });
};

export function gotoLaunchProfile(componentId) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.launchProfile,
      passProps: {
      },
      options: {
      }
    }
  });
};


export function gotoActiveAccount(componentId, data) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.ActiveAccount,
      passProps: {
        data,
      },
      options: {
      }
    }
  });
};

export function gotoCameraRollScreen(onPressCancel, onPressDone, options) {

  Navigation.showModal({
    component: {
      name: ScreenName.cameraroll,
      passProps: {
        options: { ...options, show: true },
        onPressCancel,
        onPressDone,
      },
      options: {
      }
    }
  });
};

export function gotoResetPassword(componentId) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.reset_password,
      passProps: {
      },
      options: {
      }
    }
  });
};
