
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, Text, View, Dimensions } from 'react-native';
import Fonts from '../../constants/fonts'
import CommonStyles from '../../constants/styles'
import Colors from '../../constants/colors';
import _ from 'lodash'
import DayView from './DayView'
const ScreenWidth = Dimensions.get('window').width
const widthLabel = ScreenWidth / 7

export default class WeekView extends Component {

  constructor(props) {
    super(props);
    this.state = { days: [] }
  }

  static getDerivedStateFromProps(props, state) {

    const dayStart = _.get(props, 'daySelectedRange[0]')
    const dayEnd = _.get(props, 'daySelectedRange[1]')
    const { week } = props;
    const days = week.map((value) => {
      const selected = (value.day >= dayStart && value.day <= dayEnd && value.otherMonth === false)
      return { ...value, selected }
    })

    return {
      ...state,
      days
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const nextData = _.get(nextProps, 'data')
    const data = _.get(this.props, 'data')

    const shouldUpdate = (
      !_.isEqual(nextState.days, this.state.days) ||
      !_.isEqual(nextProps.dateFree, this.props.dateFree)
    )
    return shouldUpdate
  }

  componentWillUnmount() {
  }


  render() {
    const { days } = this.state;
    const dateFree = _.get(this.props, 'dateFree') || []
    const minimumDateSelected = this.props.minimumDateSelected
    const maximumDateSelected = this.props.maximumDateSelected
    return (
      <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
        {/* <View style={[CommonStyles.position_absolute_top, { marginLeft, marginRight, height: 1, backgroundColor: Colors.white, opacity: 0.5 }]} /> */}
        <DayView
          onPressDay={this.props.onPressDay}
          data={days[0]}
          inActive={'0'}
          dateFree={dateFree}
          minimumDateSelected={minimumDateSelected}
          maximumDateSelected={maximumDateSelected}
        />
        <DayView
          onPressDay={this.props.onPressDay}
          data={days[1]}
          dateFree={dateFree}
          minimumDateSelected={minimumDateSelected}
          maximumDateSelected={maximumDateSelected}
        />
        <DayView
          onPressDay={this.props.onPressDay}
          data={days[2]}
          freeday={true}
          dateFree={dateFree}
          minimumDateSelected={minimumDateSelected}
          maximumDateSelected={maximumDateSelected}
        />
        <DayView
          onPressDay={this.props.onPressDay}
          data={days[3]}
          dateFree={dateFree}
          minimumDateSelected={minimumDateSelected}
          maximumDateSelected={maximumDateSelected}
        />
        <DayView
          onPressDay={this.props.onPressDay}
          data={days[4]}
          dateFree={dateFree}
          minimumDateSelected={minimumDateSelected}
          maximumDateSelected={maximumDateSelected}
        />
        <DayView
          onPressDay={this.props.onPressDay}
          data={days[5]}
          dateFree={dateFree}
          minimumDateSelected={minimumDateSelected}
          maximumDateSelected={maximumDateSelected}
        />
        <DayView
          onPressDay={this.props.onPressDay}
          data={days[6]}
          inActive={'1'}
          dateFree={dateFree}
          minimumDateSelected={minimumDateSelected}
          maximumDateSelected={maximumDateSelected}
        />
      </View>
    )
  }
}
