import { Platform, StatusBar, Dimensions } from 'react-native';
import { Navigation } from 'react-native-navigation';

let statusHeight = 20
let topBarHeight = 44
let bottomTabHeight = 50
let screenWidth = Dimensions.get('window').width
let screenHeight = Dimensions.get('window').height

const screenSize = () => {
  return {
    width: screenWidth,
    height: screenHeight,
  }
}

const statusBarSize = () => {
  return {
    width: screenWidth,
    height: statusHeight,
  }
}

const topBarSize = () => {
  return {
    width: screenWidth,
    height: topBarHeight,
  }
}

const bottomBarSize = () => {
  return {
    width: screenWidth,
    height: bottomTabHeight,
  }
}

// Temp
const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const { height: W_HEIGHT, width: W_WIDTH } = Dimensions.get('window');

let isIPhoneX = false;

if (Platform.OS === 'ios' &&
  !Platform.isPad && !Platform.isTVOS) {
  isIPhoneX = W_WIDTH === X_WIDTH &&
    W_HEIGHT === X_HEIGHT ||
    W_WIDTH === XSMAX_WIDTH &&
    W_HEIGHT === XSMAX_HEIGHT;
}

const getInfo = async () => {
  // Navigation.constants().then((info) => {
  statusHeight = Platform.select({ ios: isIPhoneX ? 44 : 20, android: StatusBar.currentHeight })
  // })
}

export default Device = {
  getInfo,
  screenSize,
  statusBarSize,
  topBarSize,
  bottomBarSize,
}