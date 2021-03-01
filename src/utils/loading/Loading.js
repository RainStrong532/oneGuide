import { Navigation } from 'react-native-navigation';

let isShowing = false

const showHud = () => {
  if (isShowing === true) {
    return
  }

  isShowing = true
  Navigation.showOverlay({
    component: {
      id: 'loadingHUDScreenId',
      name: 'LoadingHUDComponent',
      options: {
        overlay: {
          interceptTouchOutside: false
        }
      }
    }
  });
}

const hideHud = async () => {
  isShowing = false
  try {
    await Navigation.dismissOverlay('loadingHUDScreenId');
    return Promise.resolve()
  } catch (e) {
    return Promise.reject(e);
  }

}

export default { showHud, hideHud, isShowing };