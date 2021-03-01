import { Navigation } from 'react-native-navigation';
import ScreenName from '../config/screens-name'







export function pushShareGroup(componentId, data) {

  Navigation.push(componentId, {
    component: {
      name: ScreenName.pushShareGroup,
      passProps: {
        data
      },
      options: {
        bottomTabs: {
          visible: false,
          drawBehind: true,
          animate: true
        }
      }
    }
  });
};
export function gotoChatScreen(componentId, data) {

  Navigation.push(componentId, {
    component: {
      name: ScreenName.chat,
      passProps: {
        data
      },
      options: {
        bottomTabs: {
          visible: false,
          drawBehind: true,
          animate: true
        }
      }
    }
  });
};
export function nextInBox_Chat(componentId, data) {

  Navigation.push(componentId, {
    component: {
      name: ScreenName.inbox,

      passProps: {
        data
      },
      options: {
        // bottomTabs: {
        //   visible: false,
        //   drawBehind: true,
        //   animate: true
        // }
      }
    }
  });
};
// export function nextImge(componentId, data) {

//   Navigation.push(componentId, {
//     component: {
//       name: ScreenName.ShowImageCheckInComponent,

//       passProps: {
//         data
//       },
//       options: {
//         // bottomTabs: {
//         //   visible: false,
//         //   drawBehind: true,
//         //   animate: true
//         // }
//       }
//     }
//   });
// };