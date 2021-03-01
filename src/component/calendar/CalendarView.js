import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, Text, View, FlatList, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import _ from 'lodash'
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import CommonStyles from '../../constants/styles'
import Helper from '../../utils/Helper'
import MonthView from './MonthView'
const ScreenWidth = Dimensions.get('window').width
const widthLabel = ScreenWidth / 7
// const MonthNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const MonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
// const DayNames = ['日', '月', '火', '水', '木', '金', '土']
const DayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const now = new Date();
const currentMonthIndex = now.getMonth()
const currentYear = now.getFullYear()
const headerHeightMonth = 40

export default class CalendarView extends Component {

  static propTypes = {
    text: PropTypes.string,
    dataCalendar: PropTypes.array
  }

  constructor(props) {
    super(props)
    this.loadMore = this.loadMore.bind(this)
    this.renderBottom = this.renderBottom.bind(this)

    this.page = props.startYear || currentYear
    this.startMonth = props.startMonth || currentMonthIndex

    this.state = {
      dataCalendar: [],
      isLoadMore: false,
      showCalandar: false
    }

    // this.initMonthData(this.page, 0)
  }

  componentDidMount() {
    this.initMonthData(this.page, 0)

    setTimeout(() => {
      this.flastList.scrollToIndex({ animated: true, index: this.startMonth, viewPosition: 0 });
      setTimeout(() => {
        this.setState({
          showCalandar: true
        })
      }, 300);
    }, 1000);
  }


  // static getDerivedStateFromProps(props, state) {
  //   return null;
  // }


  // shouldComponentUpdate(nextProps, nextState) {

  //   const nextDateSelectedRange = _.get(nextProps, 'dateSelectedRange')
  //   const dateSelectedRange = _.get(this.props, 'dateSelectedRange')

  //   const shouldUpdate = (
  //     nextDateSelectedRange === dateSelectedRange
  //   )
  //   return shouldUpdate
  // }

  // componentDidUpdate(prevProps) {
  // }

  initMonthData = async (currentYear, currentMonth) => {
    const { dataCalendar } = this.state;

    let temp = []
    let offset = 0;
    let year = currentYear;
    let month = currentMonth;

    if (dataCalendar.length > 0) {
      const lastMonth = dataCalendar[dataCalendar.length - 1];
      offset = lastMonth.offset + lastMonth.height;
    }

    for (var i = 0; i < 12; i++) {

      const id = `${year}_${month}`

      // date : year/month/1 ex: 2018/10/01
      const numberOfDayInMonth = new Date(year, month + 1, 0).getDate()
      const firstDayIndex = new Date(year, month, 1).getDay()

      const info = { firstDayIndex, numberOfDayInMonth, year, month }
      const extraInfo = this.getExtraInfo(info)
      const height = this.getRowHeight(info)
      const monthData = { id, info, extraInfo, height, offset }
      offset = offset + height
      temp.push(monthData)

      year = (month === 11) ? year + 1 : year;
      month = month === 11 ? 0 : month + 1;

    }
    let dataCalendarNew = dataCalendar.concat(temp)
    this.page += 1
    this.setState({
      dataCalendar: dataCalendarNew,
      isLoadMore: false
    })
  }

  getRowHeight = (monthData) => {
    const numberOfWeek = Math.ceil((monthData.numberOfDayInMonth + monthData.firstDayIndex) / 7)
    const rowHeight = numberOfWeek * 60 + headerHeightMonth
    return rowHeight
  }

  getExtraInfo = (info) => {
    const firstDayIndex = info.firstDayIndex
    const numberOfDayInMonth = info.numberOfDayInMonth
    const numberOfWeek = Math.ceil((numberOfDayInMonth + firstDayIndex) / 7)
    const numberOfDayInPrevMonth = this.getNumberOfDayInPrevMonth(info.year, info.month)

    const prevMonths = _.range(numberOfDayInPrevMonth - firstDayIndex + 1, numberOfDayInPrevMonth + 1).map(day => { return { day, otherMonth: true } })
    const currentMonths = _.range(1, numberOfDayInMonth + 1).map(day => { return { day, month: info.month, year: info.year, otherMonth: false } })
    const nextMonths = _.range(1, numberOfWeek * 7 - numberOfDayInMonth - firstDayIndex + 1).map(day => { return { day, otherMonth: true } })

    const allMonths = prevMonths.concat(currentMonths).concat(nextMonths)
    const allWeeks = _.chunk(allMonths, 7)
    const extraInfo = { allMonths, allWeeks }

    return extraInfo
  }


  getNumberOfDayInPrevMonth = (year, month) => {

    const prevYear = (month === 0) ? year - 1 : year;
    const prevMonth = (month === 0) ? 0 : month - 1;
    const numberOfDayInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate()
    return numberOfDayInPrevMonth
  }

  pullRefresh = () => {
    this.props.pullRefresh()
  }

  loadMore = () => {

    if (this.state.isLoadMore === true) {
      return
    }

    setTimeout(() => {
      this.setState({ isLoadMore: true }, () => {
        this.initMonthData(this.page, 0)
      })
    }, 1000);

  }

  _viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
    waitForInteraction: true
  };

  onViewableItemsChanged = info => {
    // this.props.onViewableItemsChanged(info.viewableItems)
  }

  getItemLayout = (data, index) => {
    if (index < 0) {
      return { length: 0, offset: 0, index }
    }
    const rowHeight = data[index].height
    const offset = data[index].offset
    const offset0 = data[0].offset
    return { length: rowHeight, offset: offset + Math.abs(offset0), index }
  }

  render() {

    const opacity = (this.state.showCalandar === true) ? 1 : 0

    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.viewBorderDay}>
          {
            DayNames.map((value, index) => {
              let color = Colors.white
              if (index === 0 ||
                index === 6) {
                color = Colors.yellow
              }
              return (<Text key={`${value}_${index}`} style={[styles.textDay, { color: color }]}>{value}</Text>)
            })
          }
        </View>

        <FlatList
        removeClippedSubviews={false}
          style={{ opacity }}
          ref={(flastList) => this.flastList = flastList}
          data={this.state.dataCalendar}
          extraData={this.props}
          // initialScrollIndex={this.startMonth}
          getItemLayout={this.getItemLayout}
          viewabilityConfig={this._viewabilityConfig}
          onViewableItemsChanged={this.onViewableItemsChanged}
          initialNumToRender={2}
          maxToRenderPerBatch={6}
          renderItem={this.renderItem.bind(this)}
          ListFooterComponent={this.renderBottom}
          // refreshing={this.props.refreshing}
          // onRefresh={this.pullRefresh.bind(this)}
          onEndReached={this.loadMore}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => `${item.id}`}
          onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 10}
        />
        {
          !this.state.showCalandar &&
          <View style={[CommonStyles.position_absolute_full, { justifyContent: 'center' }]}>
            <ActivityIndicator style={{ alignSelf: 'center' }} animating size="small" color={Colors.gray} />
          </View>
        }
      </View>
    );
  }

  renderItem = ({ item }) => {
    const dateFree = _.get(this.props, 'dateFree')
    const minimumDateSelected = this.props.minimumDateSelected
    const maximumDateSelected = this.props.maximumDateSelected
    const { year, month, firstDayIndex } = item.info

    // const marginLeft = firstDayIndex * widthLabel
    let dateSelectedRange = null
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

      if (idStart <= idMonth &&
        idEnd >= idMonth) {
        dateSelectedRange = this.props.dateSelectedRange
      }
    }

    return (<View key={item.id} style={{ flex: 1, backgroundColor: Colors.white, height: item.height, justifyContent: 'center' }}>

      <View style={{ height: headerHeightMonth, justifyContent: 'center' }}>
        <Text style={{ marginLeft: 16, fontSize: 18, color: Colors.black_1, fontWeight: 'bold' }}>{MonthNames[month]} {year}</Text>
      </View>

      <MonthView
        key={item.id}
        onPressDay={this.props.onPressAtDay}
        monthData={item}
        dateSelectedRange={dateSelectedRange}
        dateFree={dateFree}
        minimumDateSelected={minimumDateSelected}
        maximumDateSelected={maximumDateSelected}
      />
    </View>)
  }

  renderBottom() {
    const { isLoadMore } = this.state;
    return (<View style={{ height: 40, justifyContent: 'center', }}>
      <ActivityIndicator animating size="small" color={Colors.gray} />
    </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: Colors.white,
  },
  containerLoading: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textDay: {
    flex: 1,
    textAlign: 'center',
    alignSelf: 'center',
    // fontFamily: Fonts.hiraKakuProW6,
    fontSize: 14,
    // backgroundColor: Colors.green_1
  },
  viewBorderDay: {
    height: 28,
    backgroundColor: Colors.green_1,
    flexDirection: 'row',
    alignItems: 'center'
  }
});
