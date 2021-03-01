
import { Navigation } from 'react-native-navigation';
import ScreenName from '../config/screens-name'

export function gotoCardScreen(componentId) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.card_update,
      passProps: {
      },
      options: {
      }
    }
  });
};

export function gotoSetupLanguageScreen(componentId) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.language_update,
      passProps: {
      },
      options: {
      }
    }
  });
};

export function gotoPhoneUpdateScreen(componentId) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.phone_update,
      passProps: {
      },
      options: {
      }
    }
  });
};

export function gotoExperienceUpdateScreen(componentId) {
  Navigation.push(componentId, {
    component: {
      name: ScreenName.experience_update,
      passProps: {
      },
      options: {
      }
    }
  });
};

export function gotoTutorialUpdateScreen(componentId) {
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

