import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { setRootToHomeScreen, backScreen } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import HeaderView from './views/HeaderView'
import CommonStyles from '../constants/styles'
import _ from 'lodash'
import i18next from 'i18next';
import DateHelper from '../utils/DateHelper'
import Helper from '../utils/Helper'
import CalendarView from './calendar/CalendarView'

const now = new Date();
const currentMonthIndex = new Date().getMonth()
const currentYear = now.getFullYear()

export default class SelectTourTimeComponent extends Component {

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
    // this.doGetNotifications = this.doGetNotifications.bind(this)
    // this.renderBottom = this.renderBottom.bind(this)
    // this.pullRefresh = this.pullRefresh.bind(this)
    // this.onPressDismissSearch = this.onPressDismissSearch.bind(this)
    this.onPressAtDay = this.onPressAtDay.bind(this)
    // const minimumDate = props.options.minimumDateSelected || DateHelper.currentDate()
    const date_selected_range = props.data.date_selected_range || []
    this.state = {
      date_selected_range: date_selected_range
    }

  }

  componentDidMount() {

  }

  componentDidAppear() {

    if (!this.didAppearFirst) {
      this.didAppearFirst = true
    }
  }

  componentDidDisappear() {

  }

  onPressBack = () => {
    backScreen(this.props.componentId)
  }

  onPressDone = () => {

    this.props.onPressDone(_.cloneDeep(this.state.date_selected_range))
    backScreen(this.props.componentId)
  }

  onPressAtDay = (info) => {

    const minimumDateSelected = _.get(this.props, 'options.minimumDateSelected') || DateHelper.currentDate()
    const maximumDateSelected = _.get(this.props, 'options.maximumDateSelected')

    if (minimumDateSelected &&
      DateHelper.date1GreaterDate2(minimumDateSelected, info)) {
      return
    }

    if (maximumDateSelected &&
      DateHelper.date1GreaterDate2(info, maximumDateSelected)) {
      return
    }

    let date_selected_range = this.state.date_selected_range

    if (this.props.options.mitilchoise !== true) {
      date_selected_range = [info, info]
    } else if (date_selected_range.length === 0) {
      date_selected_range.push(info)
      date_selected_range.push(info)
    } else {

      let dateSelectedStart = _.get(date_selected_range, '[0]') || { year: 0, month: 0, day: 0 }
      let dateSelectedEnd = _.get(date_selected_range, '[1]') || { year: 0, month: 0, day: 0 }

      const newStart = this.idFromDateObject(dateSelectedStart)
      const newEnd = this.idFromDateObject(dateSelectedEnd)
      const newId = this.idFromDateObject(info)

      if (newId > newEnd) {
        dateSelectedEnd = info
      } else if (newId === newEnd) {
        dateSelectedEnd = dateSelectedStart
      } else if (newId < newStart) {
        dateSelectedStart = info
      } else if (newId === newStart) {
        dateSelectedStart = dateSelectedEnd
      } else {
        const diff1 = info.year * 12 + info.month * 30 + info.day - (dateSelectedStart.year * 12 + dateSelectedStart.month * 30 + dateSelectedStart.day)
        const diff2 = (dateSelectedEnd.year * 12 + dateSelectedEnd.month * 30 + dateSelectedEnd.day) - (info.year * 12 + info.month * 30 + info.day)

        if (diff1 > diff2) {
          dateSelectedEnd = info
        } else {
          dateSelectedStart = info
        }

      }

      if (newId === newEnd &&
        newId === newStart) {
        dateSelectedStart = null
        dateSelectedEnd = null
      }

      date_selected_range = []
      if (dateSelectedStart) {
        date_selected_range.push(dateSelectedStart)
      }

      if (dateSelectedEnd) {
        date_selected_range.push(dateSelectedEnd)
      }

    }

    this.setState({ date_selected_range })
  }

  idFromDateObject = ({ year, month, day }) => {

    const newMonth = Helper.formatNumberString(month, '0')
    const newDay = Helper.formatNumberString(day, '0')

    return `${year}_${newMonth}_${newDay}`
  }

  render() {
    const { date_selected_range } = this.state
    const minimumDateSelected = _.get(this.props, 'options.minimumDateSelected') || DateHelper.currentDate()
    const maximumDateSelected = _.get(this.props, 'options.maximumDateSelected')

    let startYear = currentYear
    let startMonth = currentMonthIndex


    if (date_selected_range.length > 0) {
      startYear = date_selected_range[0].year
      startMonth = date_selected_range[0].month
    }

    return (
      <View style={[styles.container]}>
        <HeaderView
          title={i18next.t('Calendar')}
          tintColor={Colors.white}
          style={{ backgroundColor: Colors.green_1 }}
          back={true}
          titleRight={i18next.t('Done')}
          showBottomBorder={false}
          onPressLeftBarButton={this.onPressBack}
          onPressRightBarButton={this.onPressDone} />

        <View style={{ flex: 1 }}>
          <CalendarView
            onPressAtDay={this.onPressAtDay}
            dateSelectedRange={date_selected_range}
            startYear={startYear}
            startMonth={startMonth}
            minimumDateSelected={minimumDateSelected}
            maximumDateSelected={maximumDateSelected}
          />
        </View>
      </View>
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
})
