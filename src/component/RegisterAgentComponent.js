

import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text, View,
  Alert, Image,
  TouchableOpacity, KeyboardAvoidingView,
  BackHandler, Dimensions,
  ScrollView
} from 'react-native';
import _ from 'lodash';
import { ReachabilityView, i18next, Loading } from '../utils'
import { setRootToLoginScreen, showRegisterSelectCard, setRootToLaunchScreen } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import DismissKeyboard from 'dismissKeyboard';
import Fonts from '../constants/fonts'
import CommonStyles from '../constants/styles'
import TextInputForm from './views/TextInputForm'
import HeaderView from './views/HeaderView'
import Helper from '../utils/Helper'

const WebstieType = {
  http: 'http://',
  https: 'https://',
}

export default class RegisterAgentComponent extends Component {

  static options(passProps) {
    return {
      statusBar: {
        backgroundColor: 'transparent',
        visible: true,
        style: 'light'
      },
    };
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.companyRef = React.createRef();
    this.shorcutNameRef = React.createRef();
    this.businessCodeRef = React.createRef();
    this.websiteRef = React.createRef();
    this.phoneNumberRef = React.createRef();

    this.state = {
      organization: '',
      shortName: '',
      businessCode: '',
      website: '',
      phoneNumber: '',
      http: WebstieType.http
    }
  }

  handleKeyPress = (e) => {
    if (e.nativeEvent.key === 'done') {
      DismissKeyboard()
    }
  }

  validateAndGenerateParam = () => {
    const email = this.props.email
    const organisation = this.state.organization
    const website = this.state.website.toLocaleLowerCase()
    const phone = this.state.phoneNumber
    const name = this.state.shortName
    const http = this.state.http
    const cardid = this.state.businessCode

    // data
    let dataBody = {
      email,
      name,
      organisation,
      website,
      phone,
      http,
      cardid
    }
    // console.log(dataBody)
    return dataBody
  }

  onPressCompleteRegisterAgent() {
    const { organization, website, phoneNumber, businessCode, shortName } = this.state
    if (organization === '') {
      Helper.showErrorAlert('', i18next.t('PleaseInputOrganization'))
    } else if (shortName === '') {
      Helper.showErrorAlert('', i18next.t('PleaseInputShortName'))
    } else if (businessCode === '') {
      Helper.showErrorAlert('', i18next.t('PleaseInputBusinessCode'))
    } else if (website === '') {
      Helper.showErrorAlert('', i18next.t('PleaseInputWebsite'))
    } else if (!Helper.validateUrl(website)) {
      Helper.showErrorAlert('', 'Website ' + website + ' ' + i18next.t('IsNotValid'))
    } else if (phoneNumber === '') {
      Helper.showErrorAlert('', i18next.t('PleaseInputPhoneNumber'))
    } else {
      let dataBody = this.validateAndGenerateParam()
      dataBody = {
        ...dataBody,
      }

      Loading.showHud()
      this.props.registerFinish(dataBody)
        .then(response => {
          Loading.hideHud()
          const messages = _.get(response, 'data.messages')
          const message = _.get(response, 'data.message')
          if (message) {
            const callBack = () => {
              if (this.props.fromGoogle === true) {
                //   gotoLaunchProfile(this.props.componentId)
                setRootToLaunchScreen()
              } else {
                setRootToLoginScreen()
              }
            }
            Helper.showErrorAlert('', message, callBack)
          } else {
            Helper.showErrorAlert('', messages, callBack)
          }
        })
        .catch(error => {
          Loading.hideHud()
        })
    }
  }

  getWebsiteTypeSelect = () => {
    return [
      WebstieType.http,
      WebstieType.https
    ]
  }

  onPressTypeWebsite = () => {
    const callback = (index, item) => {
      this.setState({ http: item })
    }
    showRegisterSelectCard('Link', this.getWebsiteTypeSelect(), callback)
  }

  render() {
    const offset = (Platform.OS === 'android') ? -500 : 0;
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior='padding' keyboardVerticalOffset={offset}>
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.container}>
              <Image
                style={{ alignSelf: 'center', marginTop: 40, width: 150, height: 150 }}
                source={Images.logo_splash_oneguide}
                resizeMode='contain' />
              <Text style={[styles.commontText, { alignSelf: 'center', marginTop: 10 }]}>
                {i18next.t('Welcome To OneGuide')}
              </Text>

              <View style={{ flexDirection: 'column', marginTop: 30, }}>
                <Text style={[styles.commontText, { marginHorizontal: 30 }]}>
                  {i18next.t('Email')}
                </Text>
                <TextInputForm
                  style={styles.text_input_form}
                  placeholder={i18next.t('Email')}
                  placeholderTextColor={Colors.light_gray_2}
                  secureTextEntry={false}
                  returnKeyType={'next'}
                  autoCapitalize='none'
                  editable={false}
                  value={this.props.email}
                  onSubmitEditing={() => { this.companyRef.current.focus(); }}
                />
                <Text style={[styles.commontText, { marginHorizontal: 30, marginTop: 10 }]}>
                  {i18next.t('CompanyName')}
                </Text>
                <TextInputForm
                  ref={this.companyRef}
                  style={styles.text_input_form}
                  placeholder={i18next.t('CompanyName')}
                  placeholderTextColor={Colors.light_gray_2}
                  secureTextEntry={false}
                  returnKeyType={'next'}
                  autoCapitalize='words'
                  onSubmitEditing={() => { this.shorcutNameRef.current.focus(); }}
                  onChangeText={(value) => { this.setState({ organization: value }) }}
                />
                <Text style={[styles.commontText, { marginHorizontal: 30, marginTop: 10 }]}>
                  {i18next.t(i18next.t('ShorcutName'))}
                </Text>
                <TextInputForm
                  ref={this.shorcutNameRef}
                  style={styles.text_input_form}
                  placeholder={i18next.t('ShorcutName')}
                  placeholderTextColor={Colors.light_gray_2}
                  secureTextEntry={false}
                  returnKeyType={'next'}
                  autoCapitalize='words'
                  onSubmitEditing={() => { this.businessCodeRef.current.focus(); }}
                  onChangeText={(value) => { this.setState({ shortName: value }) }}
                />
                <Text style={[styles.commontText, { marginHorizontal: 30, marginTop: 10 }]}>
                  {i18next.t('BusinessCode')}
                </Text>
                <TextInputForm
                  ref={this.businessCodeRef}
                  style={styles.text_input_form}
                  placeholder={i18next.t('BusinessCode')}
                  placeholderTextColor={Colors.light_gray_2}
                  secureTextEntry={false}
                  returnKeyType={'next'}
                  autoCapitalize='none'
                  onSubmitEditing={() => { this.websiteRef.current.focus(); }}
                  onChangeText={(value) => { this.setState({ businessCode: value }) }}
                />
                <Text style={[styles.commontText, { marginHorizontal: 30, marginTop: 10 }]}>
                  {'Website'}
                </Text>
                <View style={styles.text_input_form}>
                  <TextInputForm
                    ref={this.websiteRef}
                    style={{ margin: 0 }}
                    leftPadding={60}
                    placeholder={'Og:www.vietiso.com'}
                    placeholderTextColor={Colors.light_gray_2}
                    secureTextEntry={false}
                    returnKeyType={'next'}
                    autoCapitalize='none'
                    onSubmitEditing={() => { this.phoneNumberRef.current.focus(); }}
                    onChangeText={(value) => { this.setState({ website: value }) }}
                  />
                  <TouchableOpacity
                    style={styles.button_link}
                    onPress={() => { this.onPressTypeWebsite() }}>
                    <Text style={{ marginLeft: 2 }}> {this.state.http} </Text>
                    <Image
                      style={{ right: 2, width: 8, height: 8, position: 'absolute' }}
                      resizeMode='center'
                      source={Images.ic_dropdown}></Image>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.commontText, { marginHorizontal: 30, marginTop: 10 }]}>
                  {i18next.t('PhoneNumber')}
                </Text>
                <TextInputForm
                  ref={this.phoneNumberRef}
                  style={styles.text_input_form}
                  placeholder={i18next.t('PhoneNumber')}
                  placeholderTextColor={Colors.light_gray_2}
                  secureTextEntry={false}
                  returnKeyType={'done'}
                  autoCapitalize='none'
                  onKeyPress={this.handleKeyPress}
                  keyboardType={'number-pad'}
                  onChangeText={(value) => { this.setState({ phoneNumber: value }) }}
                />
                <TouchableOpacity
                  style={styles.bottom_button}
                  onPress={() => { this.onPressCompleteRegisterAgent() }}>
                  <Text style={[styles.bottom_text, { fontSize: 17, fontWeight: '500' }]}>
                    {i18next.t('Complete')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  commontText: {
    fontSize: 17,
    fontWeight: '400'
  },
  text_input_form: {
    marginTop: 10,
    marginHorizontal: 30,
  },
  button_link: {
    backgroundColor: Colors.light_gray_4,
    justifyContent: 'center',
    top: 10,
    bottom: 10,
    left: 2,
    position: 'absolute',
    width: 65,
    borderRadius: 5,
  },
  bottom_button: {
    marginTop: 20,
    borderRadius: 5,
    backgroundColor: Colors.green_1,
    height: 45,
    marginHorizontal: 30,
    marginBottom: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottom_text: {
    textAlign: 'center',
    color: Colors.white,
  },
})