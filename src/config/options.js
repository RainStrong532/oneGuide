import Images from '../assets/images'
import Colors from '../constants/colors'
import ScreenName from '../config/screens-name'
import Fonts from '../constants/fonts'

export const pushAnimations = {
  // content: {
  //   x: {
  //     from: 1000,
  //     to: 0,
  //     duration: 300,
  //     // interpolation: 'accelerate'
  //   },
  // }
}

export const popAnimations = {
  // content: {
  //   x: {
  //     from: 0,
  //     to: 1000,
  //     duration: 250,
  //     interpolation: 'accelerate'
  //   },
  // }
}

export const defautOptions = {
  statusBar: {
    backgroundColor: 'transparent',
    style: 'dark',
    drawBehind: true
  },
  topBar: {
    drawBehind: true,
    visible: false,
  },
  bottomTabs: {
    titleDisplayMode: 'alwaysHide',
    tabsAttachMode: 'onSwitchToTab'
  },
  bottomTab: {
    iconInsets: { top: 4, left: 0, bottom: -4, right: 0 },
    selectedTextColor: Colors.green_1,
    selectedIconColor: Colors.green_1,
    fontSize: 10,
    // fontFamily: Fonts.hiraKakuProW3
    iconColor: Colors.gray
  },
  animations: {
    push: pushAnimations,
    pop: popAnimations,
  },
  layout: {
    orientation: ['portrait']
  },

}