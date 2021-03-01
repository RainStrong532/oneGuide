import { Navigation } from 'react-native-navigation';
import ScreenName from '../config/screens-name'

export function gotoSearchScreen() {
  Navigation.showOverlay({
    component: {
      name: ScreenName.search,
      passProps: {
      },
      options: {
      }
    }
  });
};

export function gotoSearchAllUser(componentId, passProps) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.SearchAllUser,
      passProps: {
        passProps
      },
      options: {
      }
    }
  });
};

export function gotoSearchAllPost(componentId, passProps) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.SearchAllPost,
      passProps: {
        passProps
      },
      options: {
      }
    }
  });
};

export function gotoSearchAllTour(componentId, passProps) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.SearchAllTour,
      passProps: {
        passProps
      },
      options: {
      }
    }
  });
};

export function gotoBackHome(componentId) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.home,
      passProps: {
      },
      options: {
      }
    }
  });
};


export function gotoSelectOptionsScreen(componentId, type, callback, mutilChoise, arrSelect) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.select_options,
      passProps: {
        options: { arrSelect },
        callback,
        type,
        mutilChoise
      },
      options: {
      }
    }
  });
};

export function gotoCheckInScreen(componentId, onPressDone, options, multichoise) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.checkIn,
      passProps: {
        onPressDone,
        options,
        multichoise
      },
      options: {
      }
    }
  });
};

export function pushTourTimeScreen(componentId, data, options, onPressDone) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.select_tour_time,
      passProps: {
        options: { ...options, push: true },
        data,
        onPressDone
      },
      options: {
      }
    }
  });
};