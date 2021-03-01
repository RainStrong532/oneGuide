
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import _ from 'lodash'
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import CommonStyles from '../../constants/styles'
import DateHelper from '../../utils/DateHelper'

const now = new Date();
const currentMonth = new Date().getMonth()
const currentYear = now.getFullYear()
const currentDay = now.getDate()

export default class DayView extends Component {

  static propTypes = {
    text: PropTypes.string,
    color: PropTypes.string,
  };

  static defaultProps = {
    text: '',
    color: 'white',
    // dataPlan: []
  };

  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const nextData = _.get(nextProps, 'data')
    const data = _.get(this.props, 'data')

    const shouldUpdate = (
      !_.isEqual(nextData, data) ||
      nextProps.inActive !== this.props.inActive ||
      !_.isEqual(nextProps.dateFree, this.props.dateFree)
    )
    return shouldUpdate
  }

  handlePress = () => {
    const { data } = this.props

    if (data.otherMonth === true) {
      return
    }

    if (this.props.onPressDay) {
      this.props.onPressDay(data.day)
    }
  }

  render() {

    const { data, inActive, dateFree } = this.props
    //console.log("1234567", data);
    const currentDate = DateHelper.currentDate()
    const minimumDateSelected = this.props.minimumDateSelected || currentDate
    const maximumDateSelected = this.props.maximumDateSelected

    const dayString = DateHelper.formatDateStringDefault({ ...data, month: data.month + 1 })

    const text = (data.day === 0) ? '' : `${data.day}`
    let bgColorText = Colors.white

    // text color
    let color = Colors.black_1
    if (data.otherMonth === true) {
      color = Colors.light_gray
    } else {
      if (inActive === '1' ||
        inActive === '0') {
        color = Colors.red_1
      }
    }

    let fontWeight = null
  
    if (DateHelper.date1EqualDate2(currentDate, data)) {
      fontWeight = 'bold'
      color = Colors.green_1
      if (data.selected === true) {
        color = Colors.white
      }

    } else if (DateHelper.date1GreaterOrEqualDate2(minimumDateSelected, data)) {
      color = Colors.light_gray
    }

    if (maximumDateSelected &&
      DateHelper.date1GreaterDate2(data, maximumDateSelected)) {
      color = Colors.light_gray
    }

    if (data.selected === true) {
      color = Colors.white
      bgColorText = Colors.green_1
    }


    ///
    let freeDay = false
    let arrayEvent = []
    let arrayTour = []

    dateFree.forEach(item => {

      if (item.freeDateStart <= dayString &&
        item.freeDateEnd >= dayString) {

        if (item.type === 'free') {
          freeDay = true
        } else if (item.type === 'event') {
          arrayEvent.push(arrayEvent.length + 1)
        } else if (item.type === 'tour') {
          arrayTour.push(arrayTour.length + 1)
        }
      }
    })



    return (
      <TouchableOpacity
        style={{ height: 60, flex: 1, justifyContent: 'flex-start' }}
        //check date color === grey =>> not onpress
        onPress={this.handlePress}>
        <Text style={[styles.text, { color, backgroundColor: bgColorText, fontWeight }]}>{text}</Text>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
          {
            (freeDay === true) &&
            <View style={[styles.dot_view, { backgroundColor: Colors.green_2, }]} />
          }
          {
            arrayEvent.map(item => {
              const key = 'event_' + item.toString()
              return <View key={key} style={[styles.dot_view, { backgroundColor: Colors.red_2 }]} />
            })

          }
          {
            arrayTour.map(item => {
              const key = 'tour_' + item.toString()
              return <View key={key} style={[styles.dot_view, { backgroundColor: Colors.orange_2 }]} />
            })
          }


        </View>

      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    alignSelf: 'center',
    lineHeight: 30,
    height: 30,
    width: 30,
    borderRadius: 15,
    overflow: 'hidden',
  },
  dot_view: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 2
  }
});
