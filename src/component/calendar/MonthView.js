
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, Text, View } from 'react-native';
import _ from 'lodash'
import WeekView from './WeekView'
import Colors from '../../constants/colors';
import Helper from '../../utils/Helper'
import DateHelper from '../../utils/DateHelper'

export default class MonthView extends Component {

  constructor(props) {
    super(props);

  }

  shouldComponentUpdate(nextProps, nextState) {

    const nextData = _.get(nextProps, 'monthData.info')
    const data = _.get(this.props, 'monthData.info')
    // const { year, month, firstDayIndex } = this.props.monthData.info

    const shouldUpdate = (
      nextProps.dateSelectedRange !== this.props.dateSelectedRange ||
      !_.isEqual(nextProps.dateFree, this.props.dateFree) ||
      nextData.year !== data.year ||
      nextData.month !== data.month
    )
    return shouldUpdate
  }


  onPressDay = (day) => {
    const { month, year } = this.props.monthData.info
    if (this.props.onPressDay) {
      this.props.onPressDay({ day, month, year })
    }
  }

  getDaySelectedRange = () => {
    const { year, month } = this.props.monthData.info
    const { allMonths } = this.props.monthData.extraInfo
    let daySelectedRange = [0, 0]

    if (this.props.dateSelectedRange) {

      const dateSelectedStart = _.get(this.props, 'dateSelectedRange[0]')
      const dateSelectedEnd = _.get(this.props, 'dateSelectedRange[1]')

      if (dateSelectedStart &&
        dateSelectedEnd) {

        const newMonth = Helper.formatNumberString(month, '0')
        const newMonth1 = Helper.formatNumberString(dateSelectedStart.month, '0')
        const newMonth2 = Helper.formatNumberString(dateSelectedEnd.month, '0')

        const idStart = `${dateSelectedStart.year}_${newMonth1}`
        const idEnd = `${dateSelectedEnd.year}_${newMonth2}`
        const idMonth = `${year}_${newMonth}`

        let endDay = allMonths.length
        let startDay = 1

        if (idEnd > idMonth) {
          endDay = allMonths.length
        }

        if (idEnd === idMonth) {
          endDay = dateSelectedEnd.day
        }

        if (idStart < idMonth) {
          startDay = 1
        }

        if (idStart === idMonth) {
          startDay = dateSelectedStart.day
        }

        daySelectedRange = [startDay, endDay]
      }
    }

    return daySelectedRange
  }

  getDateFree = () => {
    const { year, month } = this.props.monthData.info
    const date_Free = _.get(this.props, 'dateFree') || []

    const newMonth = Helper.formatNumberString(month + 1, '0')
    const yearMonth = `${year}/${newMonth}`
    const dateFree = _.filter(date_Free, function (item) {
      return (item.freeDateStart.includes(yearMonth) || item.freeDateEnd.includes(yearMonth))
    });

    return dateFree
  }


  render() {
    const minimumDateSelected = this.props.minimumDateSelected
    const maximumDateSelected = this.props.maximumDateSelected
    const { year, month, firstDayIndex } = this.props.monthData.info
    const { allWeeks } = this.props.monthData.extraInfo

    const daySelectedRange = this.getDaySelectedRange()
    const dateFree = this.getDateFree()

    return (
      <View style={{ flex: 1, backgroundColor: Colors.white, justifyContent: 'center' }}>
        <WeekView
          key={`${year}_${month}_1`}
          onPressDay={this.onPressDay}
          week={allWeeks[0]}
          dateFree={dateFree}
          daySelectedRange={daySelectedRange}
          minimumDateSelected={minimumDateSelected}
          maximumDateSelected={maximumDateSelected}
        />
        <WeekView
          key={`${year}_${month}_${8 - firstDayIndex}`}
          onPressDay={this.onPressDay}
          week={allWeeks[1]}
          dateFree={dateFree}
          daySelectedRange={daySelectedRange}
          minimumDateSelected={minimumDateSelected}
          maximumDateSelected={maximumDateSelected}
        />
        <WeekView
          key={`${year}_${month}_${15 - firstDayIndex}`}
          onPressDay={this.onPressDay}
          week={allWeeks[2]}
          dateFree={dateFree}
          daySelectedRange={daySelectedRange}
          minimumDateSelected={minimumDateSelected}
          maximumDateSelected={maximumDateSelected}
        />
        <WeekView
          key={`${year}_${month}_${22 - firstDayIndex}`}
          onPressDay={this.onPressDay}
          week={allWeeks[3]}
          dateFree={dateFree}
          daySelectedRange={daySelectedRange}
          minimumDateSelected={minimumDateSelected}
          maximumDateSelected={maximumDateSelected}
        />
        {
          (allWeeks.length > 4) &&
          <WeekView
            key={`${year}_${month}_${29 - firstDayIndex}`}
            onPressDay={this.onPressDay}
            week={allWeeks[4]}
            dateFree={dateFree}
            daySelectedRange={daySelectedRange}
            minimumDateSelected={minimumDateSelected}
            maximumDateSelected={maximumDateSelected}
          />
        }
        {
          (allWeeks.length > 5) &&
          <WeekView
            key={`${year}_${month}_${36 - firstDayIndex}`}
            onPressDay={this.onPressDay}
            week={allWeeks[5]}
            dateFree={dateFree}
            daySelectedRange={daySelectedRange}
            minimumDateSelected={minimumDateSelected}
            maximumDateSelected={maximumDateSelected}
          />
        }
      </View>
    )
  }
}
