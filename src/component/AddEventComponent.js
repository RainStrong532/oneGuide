import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Image,
  ActivityIndicator, TouchableOpacity, Alert, Platform, FlatList,
  ScrollView, TextInput, KeyboardAvoidingView,
  Switch,
  DatePickerAndroid,
  TimePickerAndroid
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { ReachabilityView, i18next, Loading } from '../utils'
import { backScreen, showDate, gotoCheckInScreen } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import CommonStyles from '../constants/styles'
import DataManager from '../modules/DataManager'
import HeaderView from './views/HeaderView'
import _ from 'lodash'
import Helper from '../utils/Helper';
import DateHelper from '../utils/DateHelper';
import DismissKeyboard from 'dismissKeyboard';

export default class AddEventComponent extends Component {
  // thêm lịch có cả giờ ở đây
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
    this.doAddEvent = this.doAddEvent.bind(this)
    this.onPressDone = this.onPressDone.bind(this)

    const now = new Date()
    const minutes = Helper.formatNumberString(now.getMinutes())
    const hours = Helper.formatNumberString(now.getHours())
    const month = Helper.formatNumberString(now.getMonth() + 1)
    const day = Helper.formatNumberString(now.getDate())
    const year = now.getFullYear()

    this.now_date = `${day}/${month}/${year} ${hours}:${minutes}`

    const data = props.data
    this.edit_event = data ? true : false
    this.state = {
      content: '',
      location: {},
      ...data
    }
  }

  componentDidMount() {
    // console.log('ats e ven');
  }

  validateParam = (params) => {

    let messages = null

    if (!params.title) {
      return i18next.t('TitleNotValid')
    }


    if (!params.started_event) {
      return i18next.t('PleaseSelectStartDate')
    }

    if (!params.ended_event) {
      return i18next.t('PleaseSelectEndDate')
    }


    return messages
  }

  onPressBack = () => {
    DismissKeyboard()
    backScreen(this.props.componentId)
  }

  onPressDone = () => {
    DismissKeyboard()
    const title = this.state.content
    const place_shortname = this.state.location.place_shortname
    const place_name = this.state.location.place_name
    const placeid = this.state.location.place_id
    const allday = this.state.allday || 0
    const warning = this.state.warning || 0
    const started_event = this.state.started_event
    const ended_event = this.state.ended_event
    const event_id = this.state.event_id

    const data = {
      title,
      place_shortname,
      place_name,
      placeid,
      allday,
      warning,
      started_event,
      ended_event,
      event_id
    }

    const messages = this.validateParam(data)

    if (messages) {
      Helper.showAlert('', messages,
        [
          {
            text: 'OK', onPress: () => {
            }
          }
        ]
      )

      return
    }

    //console.log(data)
    if (this.edit_event) {
      this.doEditEvent(data)
    } else {
      this.doAddEvent(data)
    }

  }


  onPressLocation = () => {
    DismissKeyboard()

    setTimeout(() => {
      const callback = (data) => {
        const location = data[0]
        this.setState({ location })
      }
      gotoCheckInScreen(this.props.componentId, callback, { push: true, place: true, type: 'CHECK_IN' }, false)
    }, 0);

  }

  onPressStart = () => {
    DismissKeyboard()
    const minDate = new Date()

    if (Platform.OS === 'ios') {

      const callback = (data) => {

        const seletedDate = data.seletedDate
        const minutes = Helper.formatNumberString(seletedDate.getMinutes())
        const hours = Helper.formatNumberString(seletedDate.getHours())
        const month = Helper.formatNumberString(seletedDate.getMonth() + 1)
        const day = Helper.formatNumberString(seletedDate.getDate())
        const year = seletedDate.getFullYear()

        const started_event = `${day}/${month}/${year} ${hours}:${minutes}`

        this.setState({
          started_event,
          ended_event: ''
        })
      }
      showDate({ mode: 'datetime', minDate }, callback)
    } else {
      const callback = (datetime) => {

        const started_event = datetime

        this.setState({
          started_event,
          ended_event: ''
        })
        // console.log('sờ tát tựt event', started_event);
      }

      this.showDateAndroid(callback, minDate)
    }

  }

  onPressEnd = () => {
    DismissKeyboard()
    const minDate = DateHelper.convertStringToDate(this.state.started_event) || new Date()
    if (Platform.OS === 'ios') {
      const callback = (data) => {

        const seletedDate = data.seletedDate
        const minutes = Helper.formatNumberString(seletedDate.getMinutes())
        const hours = Helper.formatNumberString(seletedDate.getHours())
        const month = Helper.formatNumberString(seletedDate.getMonth() + 1)
        const day = Helper.formatNumberString(seletedDate.getDate())
        const year = seletedDate.getFullYear()

        const ended_event = `${day}/${month}/${year} ${hours}:${minutes}`

        this.setState({ ended_event })
      }
      showDate({ mode: 'datetime', minDate }, callback)
    } else {
      const callback = (datetime) => {

        const ended_event = datetime

        this.setState({ ended_event })
        // console.log(this.state.ended_event);
      }

      this.showDateAndroid(callback, minDate)
    }
  }

  showDateAndroid = async (callback, minDate) => {

    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
        minDate
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        this.showTimeAndroid({ year, month, day }, callback)
      }
    } catch ({ code, message }) {

    }
  }

  showTimeAndroid = async (data, callback) => {
    try {
      const { action, hour, minute } = await TimePickerAndroid.open({
        // hour: 9,
        // minute: 0,
        is24Hour: false, // Will display '2 PM'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        const minutes = Helper.formatNumberString(minute)
        const hours = Helper.formatNumberString(hour)
        const month = Helper.formatNumberString(data.month + 1)
        const day = Helper.formatNumberString(data.day)
        const year = data.year

        const datetime_event = `${day}/${month}/${year} ${hours}:${minutes}`
        callback(datetime_event)
        // this.setState({ ended_event })
        // console.log('date time event', datetime_event);
      }

    } catch ({ code, message }) {
    }
  }

  doAddEvent = (data) => {
    Loading.showHud()
    // request
    this.props.addEvent(data)
      .then(data => {
        Loading.hideHud()
        this.props.callback()
        this.onPressBack()
      })
      .catch(error => {
        Loading.hideHud()
      });
  }


  doEditEvent = (data) => {
    Loading.showHud()
    // request
    this.props.editEvent(data)
      .then(response => {
        Loading.hideHud()
        this.onPressBack()
        this.props.callback(_.cloneDeep(data))

      })
      .catch(error => {
        Loading.hideHud()
      });
  }

  render() {
    const { content, location, started_event, ended_event } = this.state
    const place_name = location.place_name
    const allday = this.state.allday === 1 ? true : false
    const warning = this.state.warning === 1 ? true : false
    const title = this.edit_event ? i18next.t('EditEvent') : i18next.t('AddEvent')

    return (
      <View style={styles.container}>
        <HeaderView
          title={title}
          tintColor={Colors.white}
          style={{ backgroundColor: Colors.green_1 }}
          back={true}
          titleRight={i18next.t('Done')}
          onPressLeftBarButton={this.onPressBack}
          onPressRightBarButton={this.onPressDone}
        />
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <TouchableOpacity
            activeOpacity={1}
            style={[{ flex: 1 }]}
            onPress={() => { DismissKeyboard() }}
          >
            <View style={[styles.imageText]}>
              <TouchableOpacity
                activeOpacity={1}
                style={[
                  { flex: 1 },
                  styles.image_text_input
                ]}
              >
                <Image
                  source={Images.edit_post}
                  resizeMode='center'
                  style={styles.imageIcon}
                />
                <TextInput
                  // editable={editable}
                  // pointerEvents={textInputPointerEvents}
                  placeholder={i18next.t('NewEvent')}
                  value={content}
                  onChangeText={(text) => this.setState({
                    content: text
                  })}
                  style={[styles.textInput]} />
              </TouchableOpacity>
              {/* <View style={[styles.bottomLine]} /> */}
            </View>
            {/* {====} */}
            <View style={[styles.imageText]}>
              <TouchableOpacity
                activeOpacity={1}
                style={[
                  { flex: 1 },
                  styles.image_text_input
                ]}
                onPress={this.onPressLocation}
              >
                <Image
                  source={Images.tour_location}
                  resizeMode='center'
                  style={styles.imageIcon}
                />
                <TextInput
                  editable={false}
                  pointerEvents='none'
                  placeholder={i18next.t('Location')}
                  value={place_name}
                  style={[styles.textInput]} />
              </TouchableOpacity>
              <View style={[styles.bottomLine]} />
            </View>

            <View style={[styles.imageText, styles.image_text_input]}>
              <Text style={{ flex: 1, marginLeft: 10 }}>{i18next.t('AllDay')}</Text>
              <Switch
                style={{ marginRight: 8 }}
                value={allday}
                onValueChange={(value) => {
                  const allday = value === true ? 1 : 0
                  this.setState({ allday })
                }}
              />
            </View>

            <View style={[styles.imageText]}>
              <TouchableOpacity
                activeOpacity={1}
                style={[
                  { flex: 1 },
                  styles.image_text_input
                ]}
                onPress={this.onPressStart}
              >
                <Text style={{ marginLeft: 10 }}>{i18next.t('Start')}</Text>
                <TextInput
                  editable={false}
                  pointerEvents='none'
                  placeholder={this.now_date}
                  value={started_event}
                  style={[styles.textInput, { textAlign: 'right' }]} />
              </TouchableOpacity>
              {/* <View style={[styles.bottomLine]} /> */}
            </View>

            <View style={[styles.imageText]}>
              <TouchableOpacity
                activeOpacity={1}
                style={[
                  { flex: 1 },
                  styles.image_text_input
                ]}
                onPress={this.onPressEnd}
              >
                <Text style={{ marginLeft: 10 }}>{i18next.t('End')}</Text>
                <TextInput
                  editable={false}
                  pointerEvents='none'
                  placeholder={this.now_date}
                  value={ended_event}
                  style={[styles.textInput, { textAlign: 'right' }]} />
              </TouchableOpacity>
              {/* <View style={[styles.bottomLine]} /> */}
            </View>

            {/* <View style={[styles.imageText, styles.image_text_input]}>
              <Text style={{ flex: 1, marginLeft: 10 }}>{i18next.t('Alert')}</Text>
              <Switch
                style={{ marginRight: 8 }}
                value={warning}
                onValueChange={(value) => {
                  const warning = value === true ? 1 : 0
                  this.setState({ warning })
                }}
              />
            </View> */}
          </TouchableOpacity>
        </View>

      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image_text_input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageText: {
    margin: 2,
    height: 46
  },
  imageIcon: {
    height: 20,
    width: 20,
    alignSelf: 'center',
    marginHorizontal: 8,
    tintColor: Colors.blue_2
  },
  textInput: {
    flex: 1,
    color: Colors.black_1,
    fontSize: 16,
    marginRight: 8,
  },
  bottomLine: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 0,
    height: 2,
    backgroundColor: Colors.light_gray_1
  },
});