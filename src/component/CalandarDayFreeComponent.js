import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { dimissModal, pushAddEvent, pushFreeDayListComponent } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import HeaderView from './views/HeaderView'
import CommonStyles from '../constants/styles'
import _ from 'lodash'
import i18next from 'i18next';
import DateHelper from '../utils/DateHelper'
import Helper from '../utils/Helper'
import CalendarView from './calendar/CalendarView'
import { Loading } from '../utils';
const now = new Date();
const currentMonthIndex = now.getMonth()
const currentYear = now.getFullYear()

export default class CalandarDayFreeComponent extends Component {

  static options(passProps) {
    return {
      statusBar: {
        backgroundColor: 'transparent',
        visible: true,
        style: 'light'
      },
      topBar: {
        drawBehind: true,
        visible: false,
      },
    };
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.onPressAtDay = this.onPressAtDay.bind(this)
    this.renderHearder = this.renderHearder.bind(this)
    this.onPressAddFreeDay = this.onPressAddFreeDay.bind(this)
    this.onPressAddEventDay = this.onPressAddEventDay.bind(this)
    this.onPressAddFreeDayDone = this.onPressAddFreeDayDone.bind(this)
    this.doAddFreedays = this.doAddFreedays.bind(this)

    this.state = {
      dateFree: [],
      tempDateFree: [],
      editFreeDay: false
    }

  }

  componentDidMount() {

  }

  componentDidAppear() {

    if (!this.didAppearFirst) {
      this.didAppearFirst = true
      // this.doGetFreedays()
    }
    this.doGetFreedays()
  }

  componentDidDisappear() {

  }

  onPressBack = () => {
    if (this.state.editFreeDay === true) {
      let tempDateFree = this.state.dateFree.filter(item => { return item.type === 'free' })
      this.setState({ tempDateFree, editFreeDay: false })
      return
    }
    dimissModal(this.props.componentId)
  }

  onPressAddFreeDay = () => {
    // console.log(' cái gì đây = = = = = = =');
    this.setState({ editFreeDay: true })

  }

  onPressAddEventDay = () => {

    const callback = () => {
      // this.doGetFreedays()
    }
    pushAddEvent(this.props.componentId, null, null, callback)

  }

  onPressAddFreeDayDone = () => {

    this.doAddFreedays()
  }


  onPressAtDay = (info) => {
    //console.log("call here", info);

    if (this.state.editFreeDay !== true) {
      // console.log("calllllllllllllll");
      const day = DateHelper.formatDateStringDefault({ ...info, month: info.month + 1 })
      const results = this.state.dateFree.filter(item => {
        return (item.freeDateStart <= day && day <= item.freeDateEnd)
      })
      if (results.length > 0) {
        pushFreeDayListComponent(this.props.componentId, { results, info })
      }

      return
    }

    // const minimumDateSelected = _.get(this.props, 'options.minimumDateSelected') || DateHelper.currentDate()

    // if (minimumDateSelected &&
    //   DateHelper.date1GreaterDate2(minimumDateSelected, info)) {
    //   return
    // }

    const newYear = info.year || 0
    const newMonth = Helper.formatNumberString((info.month + 1) || 0, '0')
    const newDay = Helper.formatNumberString(info.day || 0, '0')

    const start = `${newDay}/${newMonth}/${newYear} 00:00`
    const end = `${newDay}/${newMonth}/${newYear} 23:59`
    const freeDateStart = DateHelper.convertStringDateToString(start)
    const freeDateEnd = DateHelper.convertStringDateToString(end)

    const type = 'free'

    const data = {
      type,
      start,
      end,
      freeDateStart,
      freeDateEnd
    }

    let tempDateFree = _.cloneDeep(this.state.tempDateFree)
    const index = _.findIndex(tempDateFree, { freeDateStart, freeDateEnd })
    if (index >= 0) {
      tempDateFree.splice(index, 1)
    } else {
      tempDateFree.push(data)
    }

    this.setState({
      tempDateFree
    })
  }

  doGetFreedays = () => {

    // request
    this.props.getListCalendar()
      .then(data => {

        const result = _.get(data, 'result') || []

        const dateFree = result.map(item => {
          const freeDateStart = DateHelper.convertStringDateToString(item.start)
          const freeDateEnd = DateHelper.convertStringDateToString(item.end)
          return {
            ...item,
            freeDateStart,
            freeDateEnd
          }
        })

        let tempDateFree = dateFree.filter(item => { return item.type === 'free' })
        this.setState({
          dateFree,
          tempDateFree,
          editFreeDay: false
        })
      })
      .catch(error => {
        this.setState({
          editFreeDay: false
        })
      });
  }

  doAddFreedays = () => {
    const tempDateFree = this.state.tempDateFree

    const value = tempDateFree.map(item => {
      const date = DateHelper.convertStringDateToString(item.start, null, 'DD/MM/YYYY')

      return date
    }).join(',')

    const data = {
      name: 'emptyday',
      value
    }

    Loading.showHud()

    // request
    this.props.updateProfileInfo(data)
      .then(data => {
        this.doGetFreedays()
        Loading.hideHud()
      })
      .catch(error => {

        Loading.hideHud()
      });
  }

  render() {
    const { dateFree, editFreeDay, tempDateFree } = this.state

    const valueDate = editFreeDay === true ? tempDateFree : dateFree

    let startYear = currentYear
    let startMonth = currentMonthIndex

    return (
      <View style={[styles.container]}>
        {this.renderHearder()}

        <View style={{ flex: 1 }}>
          <CalendarView
            onPressAtDay={this.onPressAtDay}
            startYear={startYear}
            startMonth={startMonth}
            dateFree={valueDate}
          />
        </View>
      </View>
    );
  }


  renderHearder() {

    const editFreeDay = this.state.editFreeDay

    const statusBarHeight = Device.statusBarSize().height
    const topBarHeight = Device.topBarSize().height

    let imageRight = Images.ic_calendar_plus
    let imageRightAddEvent = Images.ic_add
    let title = editFreeDay !== true ? i18next.t('Calendar') : i18next.t('AddFreeDay')
    let imageLeft = editFreeDay !== true ? Images.close : Images.back
    let tintColor = Colors.white

    const styleTitle = { ...CommonStyles.title_nav_bar, ...styles.title, color: tintColor }
    const styleTextBar = { ...CommonStyles.text_nav_bar, ...styles.title, color: tintColor }
    return (
      <View style={[{ justifyContent: 'center', backgroundColor: Colors.green_1 }, { height: statusBarHeight + topBarHeight }]} >
        <View style={[{ marginTop: statusBarHeight, flex: 1 }]} >
          <TouchableOpacity style={[styles.button_bar, { left: 8, }]} onPress={this.onPressBack} >
            <Image
              source={imageLeft}
              style={[styles.image_bar, { tintColor }]} />
          </TouchableOpacity>
          <View style={{ flex: 1, position: 'absolute', justifyContent: 'space-evenly', left: 48, right: 48, height: topBarHeight, top: 0, paddingBottom: 4 }}>
            <Text
              style={[styleTitle]}
              numberOfLines={1}
            >{title}</Text>
          </View>
          {
            (editFreeDay !== true) ?

              <>
                {/* <TouchableOpacity
                  style={[styles.button_bar, { right: 48 }]}
                  onPress={this.onPressAddFreeDay}>
                  <Image
                    style={{
                      tintColor: Colors.white,
                      width: 30,
                      height: 30,
                    }}
                    source={imageRight} />
                </TouchableOpacity> */}

                <TouchableOpacity
                  style={[styles.button_bar, { right: 8 }]}
                  onPress={this.onPressAddEventDay}>
                  <Image
                    style={{
                      tintColor: Colors.white,
                      width: 30,
                      height: 30,
                    }}
                    resizeMode='stretch'
                    source={imageRightAddEvent} />
                </TouchableOpacity>

              </> :
              (<TouchableOpacity
                style={[styles.button_bar, { right: 16 }]}
                onPress={this.onPressAddFreeDayDone}>
                <Text style={[styleTextBar, { textAlign: 'right' }]}>{i18next.t('Save')}</Text>
              </TouchableOpacity>)
          }
        </View>

      </ View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  activityIndicator: {
    marginTop: 100
  },
  button_bar: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 2,
    // width: 40,
    height: 40,
    position: 'absolute',
  },
  title: {
    alignSelf: 'center',
    color: Colors.black_1,
  },
})
