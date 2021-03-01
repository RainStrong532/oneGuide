
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
import { showRegisterSelectCard, setRootToLoginScreen, gotoLaunchProfile } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import DismissKeyboard from 'dismissKeyboard';
import Fonts from '../constants/fonts'
import CommonStyles from '../constants/styles'
import TextInputForm from './views/TextInputForm'
import HeaderView from './views/HeaderView'
import Helper from '../utils/Helper'
import Device from '../modules/Device';

const screenWidth = Device.screenSize().width
const heightButton = ((screenWidth - 60) - (10 * 2)) / 3
const CalendarType = {
  day: 'day',
  month: 'month',
  year: 'year'
}

export default class RegisterGuiderComponent extends Component {

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
    this.cardNameRef = React.createRef()
    this.months = this.getCalendarOfDate(1, 12)
    this.days = this.getCalendarOfDate(1, 31)
    this.years = this.getCalendarOfDate(2000, 2025)
    this.cardSelect = this.getCardSelect()
    var today = new Date();
    this.state = {
      cardSelected: i18next.t('CardInCountry'),
      daySelected: today.getDate(),
      monthSelected: today.getMonth() + 1,
      yearSelected: today.getFullYear(),
      cardCode: '',
      cardName: ''
    }
  }

  getCardSelect = () => {
    return [
      i18next.t('CardInCountry'),
      i18next.t('CardInternational'),
      i18next.t('CardOnPoint')
    ]
  }

  getCalendarOfDate = (from, to) => {
    var numbers = []
    for (var i = from; i <= to; i++) {
      numbers.push(i)
    }
    return numbers
  }

  onPressSelectCard() {
    const callback = (index, item) => {
      this.setState({ cardSelected: item })
    }
    showRegisterSelectCard('Type', this.cardSelect, callback)
  }

  onPressSelectCalendar(type, calendar) {
    const callback = (index, item, type) => {
      switch (type) {
        case CalendarType.day: this.setState({ daySelected: item }); return;
        case CalendarType.month: this.setState({ monthSelected: item }); return;
        case CalendarType.year: this.setState({ yearSelected: item }); return;
      }
    }
    showRegisterSelectCard(type, calendar, callback)
  }

  validateAndGenerateParam = () => {
    const cardid = this.state.cardCode.toString()
    const day = this.state.daySelected.toString()
    const month = this.state.monthSelected.toString()
    const year = this.state.yearSelected.toString()
    const typecard = this.state.cardSelected
    const name = this.state.cardName
    const email = this.props.email

    // data
    let dataBody = {
      email,
      name,
      cardid,
      day,
      month,
      year,
      typecard,
    }

    return dataBody
  }

  onPressFinishRegister() {
    const { cardCode, cardName } = this.state
    if (cardCode === '') {
      Helper.showErrorAlert('', i18next.t('PleaseInputCardCode'))
    } else if (cardName === '') {
      Helper.showErrorAlert('', i18next.t('PleaseInputCardName'))
    } else {
      let dataBody = this.validateAndGenerateParam()
      dataBody = {
        ...dataBody,
      }

      Loading.showHud()
      this.props.registerFinish(dataBody)
        .then(response => {
          Loading.hideHud()
          const message = _.get(response, 'data.message')

          const callBack = () => {
            if (this.props.fromGoogle === true) {
              gotoLaunchProfile(this.props.componentId)
            } else {
              setRootToLoginScreen()
            }

          }
          Helper.showErrorAlert('', message, callBack)
        })
        .catch(error => {
          Loading.hideHud()
        })
    }
  }

  render() {
    const offset = (Platform.OS === 'android') ? -200 : 0;
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
                  {i18next.t('CardType')}
                </Text>
                <TouchableOpacity
                  style={[CommonStyles.border_gray_46, styles.button_form]}
                  onPress={() => { this.onPressSelectCard() }}>
                  <Text style={{ fontSize: 14, marginLeft: 16, color: Colors.black }}>
                    {this.state.cardSelected}
                  </Text>
                  <Image
                    style={{ right: 10, width: 15, height: 15, position: 'absolute' }}
                    resizeMode='center'
                    source={Images.ic_dropdown}></Image>
                </TouchableOpacity>
                <TextInputForm
                  style={styles.text_input_form}
                  placeholder={i18next.t('CardCode')}
                  placeholderTextColor={Colors.light_gray_2}
                  secureTextEntry={false}
                  returnKeyType={'next'}
                  autoCapitalize='none'
                  // keyboardType={'numbers-and-punctuation'}
                  onSubmitEditing={() => { this.cardNameRef.current.focus(); }}
                  onChangeText={(value) => { this.setState({ cardCode: value }) }}
                />
                <Text style={[styles.commontText, { marginHorizontal: 30, marginTop: 20 }]}>
                  {i18next.t('ExpiredDate')}
                </Text>
                <View style={styles.button_form}>
                  <TouchableOpacity
                    style={[CommonStyles.border_gray_46, { flexDirection: 'row', alignItems: 'center', width: heightButton }]}
                    onPress={() => { this.onPressSelectCalendar(CalendarType.day, this.days) }}>
                    <Text style={{ fontSize: 14, marginLeft: 16, color: Colors.black }}>
                      {this.state.daySelected}
                    </Text>
                    <Image
                      style={{ right: 10, width: 15, height: 15, position: 'absolute' }}
                      resizeMode='center'
                      source={Images.ic_dropdown}></Image>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[CommonStyles.border_gray_46, { marginLeft: 10, flexDirection: 'row', alignItems: 'center', width: heightButton }]}
                    onPress={() => { this.onPressSelectCalendar(CalendarType.month, this.months) }}>
                    <Text style={{ fontSize: 14, marginLeft: 16, color: Colors.black }}>
                      {this.state.monthSelected}
                    </Text>
                    <Image
                      style={{ right: 10, width: 15, height: 15, position: 'absolute' }}
                      resizeMode='center'
                      source={Images.ic_dropdown}></Image>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[CommonStyles.border_gray_46, { marginLeft: 10, flexDirection: 'row', alignItems: 'center', width: heightButton }]}
                    onPress={() => { this.onPressSelectCalendar(CalendarType.year, this.years) }}>
                    <Text style={{ fontSize: 14, marginLeft: 16, color: Colors.black }}>
                      {this.state.yearSelected}
                    </Text>
                    <Image
                      style={{ right: 10, width: 15, height: 15, position: 'absolute' }}
                      resizeMode='center'
                      source={Images.ic_dropdown}></Image>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.commontText, { marginHorizontal: 30, marginTop: 20 }]}>
                  {i18next.t('NameInCard')}
                </Text>
                <TextInputForm
                  ref={this.cardNameRef}
                  style={styles.text_input_form}
                  placeholder={i18next.t('FullName')}
                  placeholderTextColor={Colors.light_gray_2}
                  secureTextEntry={false}
                  returnKeyType={'done'}
                  autoCapitalize='words'
                  onChangeText={(value) => { this.setState({ cardName: value }) }}
                />

                <TouchableOpacity
                  style={styles.bottom_button}
                  onPress={() => { this.onPressFinishRegister() }}>
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
  button_form: {
    marginTop: 10,
    marginHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text_input_form: {
    marginTop: 10,
    marginHorizontal: 30,
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
    color: Colors.white
  },
})