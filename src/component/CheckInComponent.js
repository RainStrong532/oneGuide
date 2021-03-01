import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';

import { backScreen } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import POST_TYPE from '../constants/post-types'
import HeaderView from './views/HeaderView'
import Device from '../modules/Device'
import { i18next, Loading } from '../utils'
import DismissKeyboard from 'dismissKeyboard';
import CreateTourView from './create-post/CreateTourView'
import CommonStyles from '../constants/styles'
import _ from 'lodash'
import FastImage from 'react-native-fast-image'
import { seachLocation, addLocation, searchDetailLocation } from '../actions'
import Helper from '../utils/Helper'

export default class CheckInComponent extends Component {

  static options(passProps) {
    return {
      statusBar: {
        backgroundColor: 'transparent',
        visible: true,
        style: 'dark'
      },
    };
  }

  static defaultProps = {
    options: {}
  };

  constructor(props) {
    super(props);

    // bind
    // Navigation.events().bindComponent(this);
    this.doSearchTextDelayed = _.debounce(this.doSearchText, 1000);
    this.renderBottom = this.renderBottom.bind(this)
    this.doAddLocation = this.doAddLocation.bind(this)
    const locations = this.props.options.locations || []

    // init variables
    this.state = {
      data: [],
      locations,
      is_searching: false,
      key_search: ''
    }
    this.selectLocation = false
  }

  componentDidMount() {
  }

  onPressCancel = () => {
    if (this.props.options.push) {
      backScreen(this.props.componentId)
    } else {
      this.props.onPressCancel()
    }

  }

  onPressDone = (location) => {
    // console.log('location done check in', location);
    this.props.onPressDone(location)
    if (this.props.options.push) {
      backScreen(this.props.componentId)
    }
  }

  onPressCheckIn = (location) => {
    let address = location[0].title
    const data = {
      formatted_address: address,
      name: address,
      short_name: address,
      place_name: address,
      place_shortname: address,
      placeid: location[0].id,
    }

    const callback = (location) => {
      this.onPressDone([location])
    }
    this.doAddLocation(data, callback)
  }


  doSearchText = (text) => {
    const type = this.props.type

    if (type == 'CHECK_IN' || this.props.options.type == 'CHECK_IN') {
      // console.log('chạy vào cái check in');
      searchDetailLocation(text)
        .then(data => {
          console.log('data searchDetailLocation', data);
          const data_search = _.get(data, 'places.data') || []
          this.setState({ data: data_search, is_searching: false })
        })
        .catch(error => {
          // console.log('error searchDetailLocation', error);

        });
    }
    else {
      // console.log('chạy vào cái khác');
      seachLocation(text)
        .then(data => {
          // console.log('gggggggggggggggggggggggg', data);
          const data_search = _.get(data, 'places.data') || []
          this.setState({ data: data_search, is_searching: false })
        })
        .catch(error => {

        });
    }
  }

  doAddLocation = (data, callback) => {
    // console.log('chọn itemmmmmmmmmmmmmmmmmmmmm');
    if (callback) {
      Loading.showHud()
    }

    addLocation(data)
      .then(response => {
        if (callback) {
          Loading.hideHud()
        }
        const place_id = _.get(response, 'data.place_id')
        const location = {
          ...data,
          place_id
        }
        callback(location)
      })
      .catch(error => {
        if (callback) {
          Loading.hideHud()
        }
      });
  }

  onChangeText = (text) => {
    if (text === '' ||
      text === null) {
      this.setState({ key_search: text, data: [] })
      return
    }
    this.setState({ key_search: text, data: [], is_searching: true })

    this.doSearchTextDelayed(text)
  }

  removeLocation = (index, item) => {
    var location = this.state.locations
    location.splice(index, 1)

    let currentLocation = this.state.data
    if (currentLocation && currentLocation.length != 0) {
      const index = _.findIndex(currentLocation, (o) => o.title == item.title)
      if (index == -1) {
        const newLocations = _.concat(item, currentLocation)
        this.setState({
          data: newLocations
        })
      }
    }

    this.setState({ locations: location })
  }

  addLocationView() {
    const locations = this.state.locations
    if (locations.length !== 0) {
      this.selectLocation = true
      return (
        <View style={{ marginTop: 10, height: locations.length * 50 }}>
          {this.state.locations.map((item, index) => {
            return (
              <View style={styles.view_border}
                key={index}>
                <Text style={{ marginLeft: 5, marginRight: 20 }}>{item.title}</Text>
                <TouchableOpacity
                  style={{ position: 'absolute', right: 5 }}
                  onPress={() => { this.removeLocation(index, item) }}>
                  <Image
                    style={{ width: 20, height: 20 }}
                    source={Images.close}
                  />
                </TouchableOpacity>
              </View>
            )
          })}
        </View>
      )
    } else {
      this.selectLocation = false
    }
  }

  validateData = () => {
    let location = this.state.key_search
    if (!location) {
      return 'Bạn chưa nhập địa điểm'
    }
  }

  onPressCheckInMySelf = () => {
    const message = this.validateData()
    if (message) {
      Helper.showAlert('', message,
        [
          {
            text: 'OK', onPress: () => {
            }
          }
        ]
      )

      return
    } else {
      let address = this.state.key_search
      const data = {
        formatted_address: address,
        name: address,
        short_name: address,
        place_name: address,
        place_shortname: address,
        // placeid: location[0].id,

      }
      const callback = (location) => {
        this.onPressDone([location])
      }
      this.doAddLocation(data, callback)
    }

  }

  render() {
    // console.log('đây là props ở checkinCOmponent', this.props);
    const { data } = this.state
    const type = _.get(this.props, 'type')
    return (
      <View style={[this.props.style, styles.container]}>
        {this.renderTopBar()}
        <View style={[CommonStyles.border_light_gray_bottom, { marginHorizontal: 12, flexDirection: "row", height: 50 }]}>
          <Image
            source={Images.check_in}
            style={{ alignSelf: "center" }}
          />
          <TextInput
            ref={(textInput) => this.textInput = textInput}
            // autoFocus
            onChangeText={this.onChangeText}
            placeholder={i18next.t('EnterYourLocation')}
            style={{ flex: 1, margin: 5, }}
            value={this.state.key_search} />
          {
            (type == 'CHECK_IN' || _.get(this.props, 'options.type') == 'CHECK_IN') &&
            <TouchableOpacity
              style={{
                width: 60,
                height: 40,
                padding: 5,
                paddingLeft: 10,
                paddingRight: 10,
                // backgroundColor:Colors.green_1,
                backgroundColor: "white",
                justifyContent: 'center', alignItems: "center", borderRadius: 5, alignSelf: "center"
              }}
              onPress={this.onPressCheckInMySelf}
            >

              <Image
                source={Images.done_location}
                style={{ width: 28, height: 28, tintColor: Colors.white, alignSelf: 'center', tintColor: Colors.green_1 }}
              />
            </TouchableOpacity>
          }
        </View>
        {this.addLocationView()}
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
          <FlatList
            removeClippedSubviews={false}
            data={data}
            extraData={this.state}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            keyboardShouldPersistTaps='handled'
            ListFooterComponent={this.renderBottom}
          />
        </View>

        {/* test call api */}

        {/* <View>

          <Text>Click call api</Text>
        </View> */}
      </View>
    );
  }

  keyExtractor = (item, index) => index.toString();

  renderTopBar() {
    const statusBarHeight = Device.statusBarSize().height
    const topBarHeight = Device.topBarSize().height
    const locations = this.state.locations
    this.selectLocation = (locations.length !== 0)
    const title = this.props.options.place === true ? i18next.t('Place') : i18next.t('CheckIn')
    return (
      <View style={[{ backgroundColor: Colors.white, }, { height: statusBarHeight + topBarHeight }]}>

        <View style={[{ height: topBarHeight, marginTop: statusBarHeight }]} >
          <TouchableOpacity style={[styles.button_bar, { left: 12, }]} onPress={this.onPressCancel} >
            <Text style={[CommonStyles.text_nav_bar, { alignSelf: 'flex-start', }]}>{i18next.t('Cancel')}</Text>
          </TouchableOpacity>

          <View pointerEvents='none' style={{ flex: 1, position: 'absolute', justifyContent: 'center', left: 48, right: 48, height: topBarHeight, top: 0, paddingBottom: 4 }}>
            <Text style={[CommonStyles.title_nav_bar, { alignSelf: 'center', }]}>{title}</Text>
          </View>

          {this.selectLocation && (
            <TouchableOpacity style={[styles.button_bar, { right: 12, }]} onPress={() => this.onPressDone(this.state.locations)}>
              <Text style={[CommonStyles.text_nav_bar, , { alignSelf: 'flex-end', }]}>{i18next.t('Done')}</Text>
            </TouchableOpacity>
          )}

        </View>
        < View style={[CommonStyles.position_absolute_bottom, { height: 1, backgroundColor: Colors.light_gray }]} />
      </View>
    );
  }


  renderItem = ({ index, item }) => {
    // console.log('itemmmmmmmmmmmmmmmmmmmmmmmmm', item);
    // const address = _.get(item, 'title')
    const address = item.title
    return (
      <View
        style={{}}>
        <TouchableOpacity
          style={{
            marginVertical: 10,
            backgroundColor: Colors.white,
            flexDirection: 'row',
            marginHorizontal: 11,
            alignItems: 'center',
          }}
          onPress={() => {
            const multichoise = this.props.multichoise
            if (multichoise === false) {
              this.onPressCheckIn([item])
              return
            }

            //  data
            const data = {
              formatted_address: address,
              name: address,
              short_name: address,
              place_name: address,
              place_shortname: address,
              placeid: item.id,
            }
            this.doAddLocation(data, null)
            // remove locationed

            let currentLocation = this.state.data
            if (currentLocation && currentLocation.length != 0) {
              const index = _.findIndex(currentLocation, (o) => o.title == item.title)
              if (index != -1) {
                currentLocation.splice(index, 1)
                this.setState({
                  data: currentLocation
                })
              }
            }

            // place selection
            let location = this.state.locations
            location.push(item)
            this.setState({ locations: location })
          }} >
          <Text
            style={{ marginBottom: 2, marginHorizontal: 12, alignSelf: 'center' }}>{address}</Text>
        </TouchableOpacity>
        < View style={[CommonStyles.position_absolute_bottom, { height: 1, backgroundColor: Colors.light_gray, left: 16, right: 16 }]} />
      </View>
    )
  }

  renderBottom() {
    const is_searching = this.state.is_searching || false;
    return (
      <View style={{ height: 40, justifyContent: 'center' }}>
        {is_searching ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
      </View>)
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  title: {
    alignSelf: 'center',
    color: Colors.green_1,
    // fontWeight: 'bold',
    fontSize: 16
    // fontFamily: Fonts.hiraKakuProW6
  },
  button_bar: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 2,
    width: 80,
    height: 40,
    position: 'absolute',
  },
  photo: {
    margin: 1
  },
  view_border: {
    marginTop: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: Colors.gray_1,
    height: 40,
    alignItems: 'center',
    backgroundColor: Colors.light_gray_1,
    flexDirection: 'row'
  }
})
