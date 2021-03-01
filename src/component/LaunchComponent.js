import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, ImageBackground, Alert, Platform, AsyncStorage } from 'react-native';
import { Navigation } from 'react-native-navigation';
import {
  setRootToHomeScreen,
  setRootToLoginScreen,
  setRootToSelectLanguageScreen,
  setRootToLaunchProfile,
  setRootToRegisterAgentScreen,
  setRootToRegisterGuideScreen,
  gotoLoginScreen,
  gotoActiveAccount
} from '../navigation';
import SplashScreen from 'react-native-splash-screen'
import Images from '../assets/images'
import Colors from '../constants/colors'
import Device from '../modules/Device'
import DataManager from '../modules/DataManager';
import Helper from '../utils/Helper'
import { i18next } from '../utils'
import _ from 'lodash'
const screenW = Device.screenSize().width
const screenH = Device.screenSize().height
const SKIP_TUTORIAL = 'SKIP_TUTORIAL'

export default class LaunchComponent extends Component {

  static options(passProps) {
    return {
      statusBar: {
        backgroundColor: 'transparent',
        visible: true,
        style: 'dark'
      },
    };
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    // this.doGetMyInfo = this.doGetMyInfo.bind(this)
    // this.setRoot = this.setRoot.bind(this)
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    try {
      const skip_tutorial = await DataManager.getValue(SKIP_TUTORIAL);

      if (!skip_tutorial) {
        setRootToSelectLanguageScreen()
      } else {
        const userToken = await AsyncStorage.getItem('ONE_GUIDE_ACCESS_TOKEN');
        // console.log("token load app", userToken);
        userToken ? this.gotoTimeLine() : this.gotoLogin()
      }
    } catch (e) {

      setRootToSelectLanguageScreen()
    }

  };
  gotoTimeLine = () => {
    this.props.getMyInfo()
      .then(data => {
        if (data.is_active == '0') {
          //setRootToHomeScreen(data)
          setRootToLoginScreen()
        }
        if (data.is_active == '1')
        //if (true)
        {
          setRootToHomeScreen(data)
        }
      })
  }

  gotoLogin = () => {
    setRootToLoginScreen()
  }

  async componentDidMount() {
    SplashScreen.hide();

    try {
      const lang = await DataManager.getValue('TYPE_LANGUAGE') || 'vn'
      i18next.changeLanguage(lang.toLowerCase())
    } catch (error) { }

  }


  // componentDidAppear() {
  //   if (!this.didAppearFirst) {
  //     this.didAppearFirst = true
  //     this.doGetMyInfo()

  //   }
  // }

  // doGetMyInfo = async () => {
  //   // request
  //   this.props.getMyInfo()
  //     .then(data => {
  //       console.log("dataloadApp", data);
  //       if (data.messages == 'error') {
  //         this.setRoot(null)
  //       }
  //       else {
  //         this.setRoot(data)
  //       }

  // const messages = _.get(data, 'messages')
  // if (messages === 'info basic') {

  //   const type = _.get(data, 'type')
  //   const email = _.get(data, 'email')

  //   if (type === 'guilder') {

  //     setRootToRegisterGuideScreen(email, true)
  //   } else {

  //     setRootToRegisterAgentScreen(email, true)
  //   }
  // } else if (messages === 'Information') {

  //   setRootToLaunchProfile()
  // } else if (messages === 'error') {

  //   this.setRoot(null)
  // } else {

  //   this.setRoot(data)
  // }
  // })
  // .catch(error => {
  //   Helper.showAlert('', i18next.t('SomethingWasWrong'),
  //     [
  //       {
  //         text: 'OK', onPress: () => {
  //           this.doGetMyInfo()
  //         }
  //       }
  //     ]
  //   )
  // });
  // }

  // setRoot = async (data) => {
  //   if (data) {
  //     setRootToHomeScreen(data)
  //     return
  //   }
  //   try {
  //     const skip_tutorial = await DataManager.getValue(SKIP_TUTORIAL);

  //     if (!skip_tutorial) {
  //       setRootToSelectLanguageScreen()
  //     } else {
  //       setRootToLoginScreen()
  //     }
  //   } catch (e) {

  //     setRootToSelectLanguageScreen()
  //   }
  // }

  render() {
    /* <Image
            style={styles.image_bg}
            source={Images.splash_bg}
            resizeMode='stretch'
          /> */

    //     
    return (
      <ImageBackground
        source={Images.background}
        style={{ width: '100%', height: '100%', justifyContent: 'center' }}
      >
        <Image
          style={styles.logo_text}
          resizeMode='stretch'
          source={Images.logo_oneguide}
        />
        {/* <ActivityIndicator style={styles.activityIndicator} size="small" /> */}

      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  image_bg: {
    position: 'absolute',
    alignSelf: 'center',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    height: screenH,
    width: screenW,
  },
  logo_text: {
    // position: 'absolute',
    alignSelf: 'center',
    marginBottom: 130,
    // tintColor: Colors.green_1
  },
  activityIndicator: {
    marginTop: 110
  },
})
