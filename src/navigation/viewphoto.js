import { Navigation } from 'react-native-navigation';
import ScreenName from '../config/screens-name'

export function viewPhoto(data) {
  Navigation.showModal({
    component: {
      name: ScreenName.view_photo,
      passProps: {
        data
      },
      options: {
      }
    }
  });
};

export function showModalCamera(onPressDone) {
  Navigation.showModal({
    component: {
      name: ScreenName.camera,
      passProps: {
        onPressDone
      },
      options: {
      }
    }
  });
};
