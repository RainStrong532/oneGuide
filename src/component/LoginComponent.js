import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert, Image,
  TouchableOpacity, KeyboardAvoidingView,
  BackHandler, Dimensions,
  Modal,
  TextInput,
  ImageBackground,
} from 'react-native';
import { ReachabilityView, i18next, Loading } from '../utils'
import {
  setRootToHomeScreen,
  gotoRegisterScreen,
  gotoTutorialScreen,
  gotoSelectProviderScreen,
  gotoLaunchProfile,
  gotoResetPassword,
  gotoRegisterAgentScreen,
  gotoRegisterGuideScreen,
  setRootToLoginScreen,
  gotoActiveAccount
} from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import DismissKeyboard from 'dismissKeyboard';
import Fonts from '../constants/fonts'
import CommonStyles from '../constants/styles'
import TextInputForm from './views/TextInputForm'
import HeaderView from './views/HeaderView'
import Helper from '../utils/Helper'
// import UserManager from '../utils/UserManager'
// import PushNotificationHandler from '../utils/PushNotificationHandler'
import _ from 'lodash';
import images from '../assets/images';
// import GoogleSiginManager from '../modules/GoogleSiginManager'
import { PixelRatio } from 'react-native'

export default class LoginComponent extends Component {

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.onPressLoginButton = this.onPressLoginButton.bind(this)
    // GoogleSiginManager.signOut()
    this.state = {
      username: '',
      password: '',
      modalVisible: false,
    };
  }
  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressed);
  }

  onBackButtonPressed() {
    // BackHandler.exitApp()
  }

  doGetMyInfo = () => {
    // request
    this.props.getMyInfo()
      .then(data => {
        // console.log("dataLogin", data);
        Loading.hideHud()
        // localStorage.setItem("accountLogin", data)
        setRootToHomeScreen(data)
      })
      .catch(error => {
        Loading.hideHud()
      });
  }

  onPressLoginButton = () => {
    const { username, password } = this.state
    if (username === '') {
      Helper.showErrorAlert('', i18next.t('ErrorInputEmail'))
    } else if (!Helper.validateEmail(username)) {
      Helper.showErrorAlert('', username + ' ' + i18next.t('IsNotValid'))
    } else if (password === '') {
      Helper.showErrorAlert('', i18next.t('ErrorInputPassword'))
    } else if (password.length <= 5) {
      Helper.showErrorAlert('', i18next.t('MinimumPasswordLength'))
    } else {
      Loading.showHud()
      const data = {
        email: username,
        password,
        oauth_provider: 'GUIDE',
      }
      this.doLogin(data)
    }
  }
  onPressRegisterButton = () => {
    gotoSelectProviderScreen(this.props.componentId)
  }

  onPressForgotPass = () => {
    gotoResetPassword(this.props.componentId)
  }

  doLogin = (data) => {

    Loading.showHud()
    this.props.login(data)
      .then(response => {
        // console.log("response dang nhap", response);
        const message = _.get(response, 'data.message')
        const error = _.get(response, 'data[0].message')
        if (message === 'Success') {
          this.doGetMyInfo()

        } else if (message == 'Tài khoản chưa được kích hoạt') {
          Loading.hideHud()
          const callBack = () => {
            gotoActiveAccount(this.props.componentId, this.state.username)
          }

          Helper.showErrorAlert('', "Tài khoản của bạn chưa được kích hoạt", callBack)

        } else if (error) {
          Loading.hideHud()
          Helper.showErrorAlert('', error);
        } else {
          Loading.hideHud()
          Helper.showErrorAlert('', i18next.t('Error'))
        }
      })
      .catch(error => {
        Loading.hideHud()
        Helper.showErrorAlert('', i18next.t('SomethingWasWrong'));
      });
  }

  render() {

    return (
      <View
        // source={Images.ScreenHomeLogin
        // }
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: Colors.green_1
        }}
      >
        <View style={styles.wrappLogo}>
          <Image
            source={Images.logo123}
            style={styles.imgLogo}
            resizeMode='contain'
          />

        </View>

        <View style={{ flex: 0.45, }}>


          <TouchableOpacity style={styles.button_bg} activeOpacity={1} onPress={() => { DismissKeyboard() }} >
            <View style={{
              // marginTop: 100,
              flex: 1,
              flexDirection: 'column',
              backgroundColor: Colors.white,
              // marginBottom: 80,
              paddingTop: 20,
              marginLeft: 15,
              marginRight: 15,
              borderRadius: 10
            }}>
              <TextInputForm
                style={styles.text_input_form_1}
                rightImage={Images.icon_email}
                placeholder={i18next.t('Email')}
                placeholderTextColor={Colors.light_gray_2}
                secureTextEntry={false}
                keyboardType='email-address'
                autoCapitalize='none'
                onChangeText={(value) => { this.setState({ username: value }) }}
                isPassWord={true}
              />
              <TextInputForm
                autoCapitalize="none"
                style={styles.text_input_form_2}
                iconShowPass={Images.iconsEyeTrueEnd}
                isHidePass={Images.eyes_new_not_end_done}
                placeholder={i18next.t('Password')}
                placeholderTextColor={Colors.light_gray_2}
                secureTextEntry={true}
                onChangeText={(value) => { this.setState({ password: value }) }}
                onSubmitEditing={this.onPressLoginButton}
              />

              <TouchableOpacity

                style={styles.forgot_pass}
                onPress={this.onPressForgotPass}>
                <Text style={{
                  color: '#008cc9', fontSize: 15,

                }}>
                  {i18next.t('ForgotPass')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.login_button}
                onPress={this.onPressLoginButton}>
                <Text style={[CommonStyles.textJp14, styles.login_text]}
                >{i18next.t('Login')}</Text>
              </TouchableOpacity>

              <View style={styles.containLine}>
                <Text style={styles.textNotAccount} >{i18next.t('NotAccount')}</Text>
                <TouchableOpacity
                  style={[styles.textNotAccount, { marginLeft: 5 }]}
                  onPress={this.onPressRegisterButton}
                >
                  <Text style={{ color: Colors.blue }} >
                    {i18next.t('Signup')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.15 }}></View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',

  },
  login_title: {
    marginTop: 52,
    alignSelf: 'center',
    fontSize: 25,
    fontWeight: 'bold'
  },
  text_input_form_1: {
    marginTop: 10,
    marginHorizontal: 35,
  },
  text_input_form_2: {
    marginTop: 20,
    marginHorizontal: 35,
  },
  forgot_pass: {
    marginTop: 20,
    marginHorizontal: 35,
    alignSelf: 'flex-end'
  },
  login_button: {
    marginTop: 15,
    marginHorizontal: 35,
    height: 50,
    backgroundColor: Colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
  },

  openButton: {
    backgroundColor: "#03a9f4",
    borderRadius: 10,
    padding: 10,
    elevation: 2
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  google_button: {
    flexDirection: 'row',
    marginTop: 15,
    marginHorizontal: 35,
    height: 50,
    backgroundColor: Colors.red_1,
    alignItems: 'center',
    borderRadius: 4
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 35
  },
  login_text: {
    color: 'white',
    letterSpacing: 1.1,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    left: 0, right: 0
  },
  button_bg: {
    justifyContent: 'center',
    flex: 1,
    // backgroundColor: Colors.white
  },
  containLine: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 5
  },
  line_1: {
    marginLeft: 5,
    marginRight: 5,
    width: Dimensions.get('window').width / 2 - 60,
    height: 0.5,
    borderWidth: 0.5,
    borderColor: Colors.gray_1
  },
  line_text: {
    height: 20,
    textAlign: 'center',
    width: 40,
    fontSize: 15,
  },
  line_2: {
    marginRight: 5,
    marginLeft: 5,
    height: 0.5,
    width: Dimensions.get('window').width / 2 - 60,
    borderWidth: 0.5,
    borderColor: Colors.gray_1
  },
  textNotAccount: {
    height: 20,
    fontSize: 15,
    textAlign: 'center',

  },
  wrappLogo: {
    flex: 0.38,
    // height: 220,
    // //marginVertical: 10,
    // marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1
    // marginTop: 50,
  },
  imgLogo: {
    width: 260,
    height: 260,
    alignSelf: 'center',
    tintColor: Colors.white,
  }
});

