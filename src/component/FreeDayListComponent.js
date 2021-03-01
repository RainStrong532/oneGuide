import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Image,
  ActivityIndicator, TouchableOpacity, Alert, Platform, FlatList,
  ScrollView, TextInput, KeyboardAvoidingView,
  RefreshControl
} from 'react-native';
import { ReachabilityView, i18next, Loading } from '../utils'
import { backScreen, pushAddEvent, showActionSheet } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import CommonStyles from '../constants/styles'
import HeaderView from './views/HeaderView'
import _ from 'lodash'
import DateHelper from '../utils/DateHelper';
import Device from '../modules/Device'
import Helper from '../utils/Helper';

export default class FreeDayListComponent extends Component {

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
    this.doDeleteEvent = this.doDeleteEvent.bind(this)
    const freeDay = _.get(props, 'data.results') || []
    this.state = {
      freeDay
    }
  }

  componentDidMount() {

  }


  onPressMoreOptionsButton = (item) => {
    const callback = (index) => {

      // edit
      if (index === 0) {
        const data = {
          content: item.title,
          location: { place_name: item.place_name },
          started_event: item.start,
          ended_event: item.end,
          allday: item.allday || 0,
          warning: item.warning || 0,
          event_id: item.id
        }

        const callback = (data) => {

          const event_id = data.event_id
          const freeDay = _.cloneDeep(this.state.freeDay)
          const index = _.findIndex(freeDay, function (o) { return o.id.toString() === event_id.toString(); });

          if (index >= 0) {

            const newEvent = {
              title: data.title,
              place_name: data.place_name,
              freeDateStart: DateHelper.convertStringDateToString(data.started_event),
              freeDateEnd: DateHelper.convertStringDateToString(data.ended_event),
              start: data.started_event,
              end: data.ended_event,
              allday: data.allday || 0,
              warning: data.warning || 0,
              event_id: data.id,
              id: data.event_id,
              type: 'event'
            }
            freeDay.splice(index, 1, newEvent);
          }
          this.setState({ freeDay })
        }

        pushAddEvent(this.props.componentId, data, null, callback)
      } else {
        const event_id = item.id
        this.doDeleteEvent({ event_id })
      }
    }
    const buttons = [i18next.t('Edit'), i18next.t('Delete')]
    showActionSheet(buttons, callback)
  }

  doDeleteEvent = (data) => {
    Loading.showHud()
    // request
    this.props.deleteEvent(data)
      .then(response => {

        const event_id = data.event_id
        const freeDay = _.cloneDeep(this.state.freeDay)

        const index = _.findIndex(freeDay, { id: event_id })

        if (index >= 0) {
          freeDay.splice(index, 1);
        }
        this.setState({ freeDay })
        Loading.hideHud()
      })
      .catch(error => {
        Loading.hideHud()
      });
  }

  render() {
    const statusBarHeight = Device.statusBarSize().height
    const { freeDay } = this.state
    const info = _.get(this.props, 'data.info')

    const month = _.get(info, 'month') + 1
    const day = _.get(info, 'day')
    const year = _.get(info, 'year')
    const year_month = Helper.formatNumberString(month) + ' ' + year
    const datetime = DateHelper.formatDateStringDefault({ year, month, day })
    const day_number = DateHelper.convertStringToDate(datetime, 'YYYY/MM/DD').getDay()
    let day_name = ''
    if (day_number === 0) {
      day_name = 'CN'
    } else {
      day_name = 'Thứ ' + (day_number + 1)
    }

    return (
      <View style={styles.container}>

        <View
          style={{ height: 220 }}>
          <Image
            style={{ flex: 1 }}
            source={Images.image_date_cover}
            resizeMode='stretch' />

          <View
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              position: 'absolute',
              opacity: 0.2,
              backgroundColor: Colors.red_2
            }} />
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              top: statusBarHeight,
              left: 8,
              width: 40,
              height: 40,
              position: 'absolute',
            }}
            onPress={this.onPressBack} >

            <Image
              source={Images.back}
              style={[{ tintColor: Colors.white }]} />

          </TouchableOpacity>


          <View
            style={{
              position: 'absolute',
              top: statusBarHeight + 40,
              left: 0,
              right: 0,
              // height: 100,
              backgroundColor: Colors.transparent,
              flexDirection: 'row',
              justifyContent: 'center'
            }}>

            <Text style={{
              fontSize: 70,
              color: Colors.white,
              flex: 1,
              textAlign: 'right',
              alignSelf: 'center',
              fontWeight: '600'
            }}>{day}</Text>

            <View style={{ flex: 2, flexDirection: 'column', paddingLeft: 20, paddingVertical: 10 }}>
              <Text style={{ flex: 1, fontSize: 36, color: Colors.white, fontWeight: '400' }}>{day_name}</Text>
              <Text style={{ flex: 1, fontSize: 20, color: Colors.white, marginLeft: 4 }}>{year_month}</Text>
            </View>
          </View>

        </View>


        <FlatList
          removeClippedSubviews={false}
          data={freeDay}
          // extraData={freeDay}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 10}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={this.renderEmpty}
        />
      </View>
    )
  }

  onPressBack = () => {
    backScreen(this.props.componentId)
  }

  renderEmpty = () => {

    return (<View style={styles.emptyView}>
      <Text style={{ fontSize: 14, color: Colors.black_1, textAlign: 'center' }}>
        {i18next.t('ThereIsNoData')}
      </Text>
    </View>)
  }


  renderItem = ({ item, index }) => {
    console.log("object-item calendar", item);
    let borderColor = Colors.orange_2
    let time = item.start + ' - ' + item.end
    if (item.type === 'free') {
      time = item.freeDateStart
      borderColor = Colors.green_2
    } else if (item.type === 'event') {
      borderColor = Colors.red_2
    }
    const place_name = item.place_name
    return (
      <View style={[{
        justifyContent: 'center',
        flexDirection: 'row',
        marginLeft: 5

      }]} >

        <View style={[{ flex: 1, flexDirection: 'column' }]} >
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 15,
              bottom: 0,
              width: 1,
              backgroundColor: Colors.gray
            }}></View>

          <View
            style={{
              color: Colors.black_1,
              marginLeft: 5,
              marginTop: 10,
              justifyContent: 'center',
              flexDirection: 'row'

            }}>
            <View style={{
              height: 20,
              width: 20,
              borderColor,
              borderRadius: 10,
              borderWidth: 2,
              backgroundColor: Colors.white
            }}></View>
            <Text
              style={{
                flex: 1,
                color: Colors.black_1,
                marginLeft: 10,
                marginBottom: 5,
                fontSize: 16,
                // fontWeight: 'bold',
                lineHeight: 20
              }
              }>{time}</Text>

          </View>
          <View style={{
            flexDirection: 'row',
            // justifyContent: "center",
            alignItems: 'center',
            marginLeft: 50
          }}>
            <Image
              source={Images.tour_name}
              resizeMode='contain'
              style={{ width: 15, height: 15 }}
            />
            <Text style={{ fontSize: 16, marginLeft: 10 }}>{item.title}</Text>
          </View>
          {/* {
            place_name &&
            <Text
              style={{
                // flex: 1,
                color: Colors.black_1,
                marginLeft: 35,
                marginBottom: 10,
                fontSize: 12,
                fontWeight: 'bold',
                lineHeight: 20
              }
              }>{place_name}</Text>

          } */}
        </View>

        {
          item.type !== 'free' && item.type !== 'tour' ?
            <TouchableOpacity
              style={{ height: 40, width: 40, alignSelf: 'center' }}
              onPress={() => {
                this.onPressMoreOptionsButton(item)
              }}
            >
              <Image style={{ height: 40, width: 40, }}
                source={Images.post_more_options}
                resizeMode='center' />
            </TouchableOpacity>
            : null
        }

      </View>
    )
  }

  keyExtractor = (item, index) => index.toString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  }
});