
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
  BackHandler, Dimensions, ScrollView
} from 'react-native';
import { ReachabilityView, i18next, Loading } from '../utils'
import { setRootToHomeScreen, gotoRegisterScreen, gotoTutorialScreen, gotoSelectProviderScreen, backScreen, setRootToLoginScreen } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import DismissKeyboard from 'dismissKeyboard';
import Fonts from '../constants/fonts'
import CommonStyles from '../constants/styles'
import TextInputForm from './views/TextInputForm'
import HeaderView from './views/HeaderView'
import Helper from '../utils/Helper'
import _ from 'lodash';

export default class ResetPasswordComponent extends Component {

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.onPressResetPassButton = this.onPressResetPassButton.bind(this)
    this.state = {
      email: '',
    };

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  onPressBack = () => {
    backScreen(this.props.componentId)
  }

  onPressResetPassButton = () => {
    const { email } = this.state
    if (email === '') {
      Helper.showErrorAlert('', i18next.t('ErrorInputEmail'))
    } else if (!Helper.validateEmail(email)) {
      Helper.showErrorAlert('', email + ' ' + i18next.t('IsNotValid'))
    } else {
      Loading.showHud()
      this.props.resetPassword(email)
        .then(response => {
          Loading.hideHud()
          const message = _.get(response, 'data.messages')
          const result = _.get(response, 'data.result')
          if (result === 'success') {
            const callBack = () => {
              setRootToLoginScreen()
            }
            Helper.showErrorAlert('', i18next.t('ResetPasswordSuccess'), callBack)
          } else {
            Helper.showErrorAlert('', message);
          }
        })
        .catch(error => {
          Loading.hideHud()
          Helper.showErrorAlert('', i18next.t('SomethingWasWrong'));
        });
    }
  }

  render() {
    const offset = (Platform.OS === 'android') ? 0 : 40;
    return (
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
        <HeaderView
          title={i18next.t('ResetPassword').toUpperCase()}
          style={{ fontSize: 20 }}
          back={true}
          onPressLeftBarButton={this.onPressBack}
        />
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.button_bg}
            activeOpacity={1}
            onPress={() => { DismissKeyboard() }}
          >
            <KeyboardAvoidingView style={styles.container} behavior={"padding"} keyboardVerticalOffset={offset} >
              <ScrollView style={{ flex: 1 }}>
                <View style={{
                  flex: 1,
                  flexDirection: 'column',
                  backgroundColor: Colors.white,
                  //marginTop: 50
                }}>
                  <Image

                    style={styles.logo_text}
                    resizeMode='contain'
                    source={Images.logo123}
                  />

                  <Text style={{ marginBottom: 10, marginHorizontal: 25, fontSize: 18, textAlign: 'center' }}>
                    {i18next.t('InputSendResetPassword')}
                  </Text>
                  <TextInputForm
                    style={styles.text_input_form_1}
                    rightImage={Images.icon_email}
                    placeholder={i18next.t('Email')}
                    placeholderTextColor={Colors.light_gray_2}
                    secureTextEntry={false}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    onChangeText={(value) => { this.setState({ email: value }) }}
                  />
                  <TouchableOpacity
                    style={styles.login_button}
                    onPress={this.onPressResetPassButton}>
                    <Text style={[CommonStyles.textJp14, styles.login_text]}>
                      {i18next.t('SendResetPass')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
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
  button_bg: {
    justifyContent: 'center',
    flex: 1,
  },
  login_title: {
    marginTop: 52,
    alignSelf: 'center',
    fontSize: 25,
    fontWeight: 'bold'
  },
  logo_text: {

    alignSelf: 'center',
    tintColor: Colors.green_1,
    width: 250,
    height: 250
  },
  text_input_form_1: {
    marginTop: 10,
    marginHorizontal: 25,
  },
  login_button: {
    marginTop: 15,
    marginHorizontal: 45,
    height: 50,
    backgroundColor: Colors.blue,
    justifyContent: 'center',
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
  }

});

