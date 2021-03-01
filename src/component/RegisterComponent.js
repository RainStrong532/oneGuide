import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import {
  Modal,
  StyleSheet,
  TouchableHighlight,
  Platform,
  SafeAreaView,
  Text,
  View,
  Alert, Image,
  TouchableOpacity, KeyboardAvoidingView,
  BackHandler, Dimensions, TextInput
} from 'react-native';
import { ReachabilityView, i18next, Loading } from '../utils'
import { backScreen, gotoRegisterGuideScreen, setRootToHomeScreen, gotoLaunchProfile, pushToTermPolicy } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import DismissKeyboard from 'dismissKeyboard';
import Fonts from '../constants/fonts'
import CommonStyles from '../constants/styles'
import TextInputForm from './views/TextInputForm'
import HeaderView from './views/HeaderView'
import Helper from '../utils/Helper'
import Checkbox from '../component/views/Checkbox'
import { gotoLoginScreen, setRootToLoginScreen, gotoRegisterAgentScreen, gotoActiveAccount } from '../navigation';
import _ from 'lodash';
// import GoogleSiginManager from '../modules/GoogleSiginManager'

export default class RegisterComponent extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.onPressLoginButton = this.onPressLoginButton.bind(this)
    this.state = {
      username: '',
      password: '',
      retypepassword: '',
      selected: false,
      modalVisible: false,
      pass_reset_key: '',
      user_id: '',
      fullname: ''
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressed);
  }

  onBackButtonPressed() {
    // BackHandler.exitApp()
  }

  onPressLoginButton = () => {

    setRootToLoginScreen()
  }

  onPressRegisterButton = () => {
    //gotoActiveAccount(this.props.componentId)
    const { username, password, retypepassword, fullname } = this.state
    if (username === '') {

      Helper.showErrorAlert('', i18next.t('ErrorInputEmail'))
    }
    else if (fullname === '') {

      Helper.showErrorAlert('', i18next.t('Tên hiển thị không để trống'))
    }
    else if (!Helper.validateEmail(username)) {

      Helper.showErrorAlert('', username + ' ' + i18next.t('IsNotValid'))
    } else if (password === '') {

      Helper.showErrorAlert('', i18next.t('ErrorInputPassword'))
    } else if (password.length <= 5) {

      Helper.showErrorAlert('', i18next.t('MinimumPasswordLength'))
    } else if (retypepassword !== password) {

      Helper.showErrorAlert('', i18next.t('ErrDiffRetypePass'))
    } else {
      Loading.showHud()
      this.props.register(username, password, fullname, this.props.provider.toLowerCase(), 'GUIDE')
        .then(response => {
          // console.log("reponse dang ki", response);
          const message = _.get(response, 'data.message')
          const { result } = response.data
          if (result === "success") {

            Loading.hideHud()

            gotoActiveAccount(this.props.componentId, username)
          } else if (message) {
            Loading.hideHud()
            Helper.showErrorAlert('', message)
          }
          else {

            Loading.hideHud()
            Helper.showErrorAlert('', i18next.t('Error'))
          }
        })
        .catch(error => {
          Loading.hideHud()
          Helper.showErrorAlert('', error);
        })
    }
  }

  checkBoxSelected = (name, checked) => {
    this.setState({ selected: checked })
  }

  onPressBack = () => {
    backScreen(this.props.componentId)
  }
  handleTermCondition = () => {
    pushToTermPolicy(this.props.componentId)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: Colors.white, zIndex: 1 }}>
          <HeaderView
            title={i18next.t('Signup').toUpperCase()}
            style={{ fontSize: 20 }}
            back
            onPressLeftBarButton={this.onPressBack}
          />
          <TouchableOpacity style={styles.button_bg} activeOpacity={1} onPress={() => { DismissKeyboard() }} >
            <KeyboardAvoidingView
              // style={styles.container} 
              // behavior={"padding"} 
              behavior={Platform.OS === "ios" ? "padding" : null}
              style={{ flex: 1 }}
            >
              {/* <ReachabilityView /> */}
              <View
                style={{
                  marginTop: 0,
                  flex: 1,
                  flexDirection: 'column',
                  padding: 20
                  // justifyContent: "flex-end"
                }}>
                <TextInputForm
                  style={styles.text_input_form_1}
                  rightImage={Images.icon_email}
                  placeholder={i18next.t('Email')}
                  placeholderTextColor={Colors.light_gray_2}
                  keyboardType='email-address'
                  autoCapitalize='none'
                  secureTextEntry={false}
                  onChangeText={(value) => { this.setState({ username: value }) }}
                />

                <TextInputForm
                  style={styles.text_input_form_2}
                  rightImage={Images.tabbar_profile}
                  placeholder={i18next.t('Tên hiển thị')}
                  placeholderTextColor={Colors.light_gray_2}
                  //secureTextEntry={true}
                  onChangeText={(value) => { this.setState({ fullname: value }) }}
                />

                <TextInputForm
                  style={styles.text_input_form_2}
                  // rightImage={Images.icon_password}
                  iconShowPass={Images.iconsEyeTrueEnd}
                  isHidePass={Images.eyes_new_not_end_done}
                  placeholder={i18next.t('Password')}
                  placeholderTextColor={Colors.light_gray_2}
                  secureTextEntry={true}
                  onChangeText={(value) => { this.setState({ password: value }) }}
                />



                <TextInputForm
                  style={styles.text_input_form_2}
                  //rightImage={Images.icon_password}
                  iconShowPass={Images.iconsEyeTrueEnd}
                  isHidePass={Images.eyes_new_not_end_done}
                  placeholder={i18next.t('RetypePassword')}
                  placeholderTextColor={Colors.light_gray_2}
                  secureTextEntry={true}
                  onChangeText={(value) => { this.setState({ retypepassword: value }) }}
                />
                <View style={styles.forgot_pass}>
                  <View>
                    <Checkbox
                      checked={this.state.selected}
                      style={{
                        backgroundColor: Colors.white,
                        color: Colors.gray_2,
                        borderRadius: 2,
                        borderWidth: 1,
                        borderColor: Colors.gray_2,
                        marginTop: 0,
                      }}
                      size={60}
                      onChange={(name, checked) => this.checkBoxSelected(name, checked)}
                    />
                  </View>

                  <View style={styles.termandcondition}>

                    <Text style={{ fontSize: 16, fontWeight: '400' }}> {i18next.t('ReadAndAgree')} </Text>

                    <TouchableOpacity
                      // style={{ borderWidth: 1, backgroundColor: 'red' }}
                      onPress={this.handleTermCondition}
                    >
                      <Text
                        style={{ fontSize: 16, fontWeight: 'bold', color: Colors.blue, margin: 2 }}
                      // onPress={() => { }}
                      >
                        {i18next.t('TermAndConditions')}
                      </Text>
                    </TouchableOpacity>


                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.login_button, { backgroundColor: this.state.selected ? Colors.blue : Colors.gray }]}
                  onPress={() => { this.onPressRegisterButton() }}
                  disabled={!this.state.selected}
                >

                  <Text style={[CommonStyles.textJp14, styles.login_text]}>{i18next.t('Signup')}</Text>
                </TouchableOpacity>

                <View
                  style={{
                    zIndex: 1, flexDirection: 'row',
                    marginTop: 20,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text style={styles.textNotAccount} >
                    {i18next.t('HaveAccount')} </Text>
                  <TouchableOpacity
                    style={{ marginLeft: 1 }}
                    onPress={this.onPressLoginButton}
                  >
                    <Text style={{ color: Colors.blue }} >
                      {i18next.t('Signin')}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* <View style={styles.containLine}>
                <View style={styles.line_1} />
                <Text style={styles.line_text} > {i18next.t('Or')} </Text>
                <View style={styles.line_2} />
              </View>
              <TouchableOpacity
                style={styles.google_button}
                onPress={this.onPressLoginGoolge}>
                <Image source={Images.logo_google} resizeMode='center' style={{ height: 20, width: 20, marginLeft: 10 }}></Image>
                <Text style={[CommonStyles.textJp14, styles.login_text]}>{i18next.t('LoginGoogle')}</Text>
              </TouchableOpacity> */}

              </View>
            </KeyboardAvoidingView>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  termandcondition: {
    flex: 1,
    alignSelf: 'center',
    marginTop: 0,
    marginLeft: 8,
    zIndex: 9999
  },
  login_title: {
    marginTop: 52,
    alignSelf: 'center',
    fontSize: 25,
    fontWeight: 'bold'
  },
  text_input_form_1: {
    marginTop: 60,
    marginHorizontal: 35,
  },
  text_input_form_2: {
    marginTop: 20,
    marginHorizontal: 35,
  },
  forgot_pass: {
    marginTop: 20,
    marginHorizontal: 35,
    flexDirection: 'row',
  },
  login_button: {
    marginTop: 15,
    marginHorizontal: 35,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
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
  },
  containLine: {

    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center'
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
    textAlign: 'center'
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  // modalView: {
  //   margin: 20,
  //   backgroundColor: "white",
  //   borderRadius: 20,
  //   padding: 35,
  //   alignItems: "center",
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 2
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  //   elevation: 5
  // },
  openButton: {
    backgroundColor: "#03a9f4",
    borderRadius: 10,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 35
  },
  modalText: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: "#9e9e9e",
    color: "white",
    fontWeight: "bold",
  }
});


