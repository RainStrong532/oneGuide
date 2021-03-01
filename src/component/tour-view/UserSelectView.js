import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Colors from '../../constants/colors';
import Device from '../../modules/Device';
import _ from 'lodash';
import FastImage from 'react-native-fast-image'
import Images from '../../assets/images';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CommonStyles from '../../constants/styles'

const screenWidth = Device.screenSize().width

export default class UserSelectView extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    const nextData = _.get(nextProps, 'item')
    const data = _.get(this.props, 'item')
    return true
  }

  onPressUserProfile = (user_id) => {
    if (this.props.onPressUserProfile) {
      this.props.onPressUserProfile(user_id)
    }
  }


  onPressSelectButon = (item) => {
    if (this.props.onPressSelectButon) {
      this.props.onPressSelectButon(item)
    }
  }

  render() {
    const item = _.get(this.props, 'item')
    const avatar = _.get(this.props, 'item.avatar')
    const displayName = _.get(this.props, 'item.display_name')
    const user_id = _.get(this.props, 'item.user_id')
    const check = _.get(this.props, 'item.checked') || false
    const imageSelect = check === true ? Images.ic_select : null
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => { this.onPressUserProfile(user_id) }}>
          <FastImage
            source={{ uri: avatar }}
            style={{ width: 50, height: 50, marginLeft: 10, borderRadius: 25 }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <Text style={styles.title}>{displayName}</Text>

        </TouchableOpacity>
        <View style={{ flex: 1 }}></View>

        <View style={styles.rightView}>
          <TouchableOpacity
            style={styles.rightButton}
            onPress={() => { this.onPressSelectButon(item) }} >
            <Image
              source={imageSelect}
              resizeMode='contain'
              style={{ flex: 1 }} />
          </TouchableOpacity>
        </View>


        <View style={styles.borderline}></View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    height: 80,
    alignItems: 'center'
  },
  subContain: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 5
  },
  time_text: {
    marginLeft: 5,
    fontSize: 15,
    fontWeight: '300'
  },
  detail_text: {
    fontSize: 15,
    fontWeight: '500'
  },
  borderline: {
    height: 0.5,
    borderWidth: 0.5,
    borderColor: Colors.light_gray,
    width: screenWidth,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  rightView: {
    // position: 'absolute',
    // padding:5,
    // right: 5,
    height: 40,
    // width: 150,
    marginRight: 10,
    // borderRadius: 5,
    // borderWidth: 0.5,
    // borderColor: Colors.light_gray
  },
  rightButton: {
    height: 28,
    width: 28,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: Colors.light_gray,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
})
