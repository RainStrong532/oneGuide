import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, Image, ActivityIndicator } from 'react-native'
import _ from 'lodash'
import Colors from '../../constants/colors'
import CommonStyles from '../../constants/styles'
import ChatConfig from '../../constants/chat-config'
import Device from '../../modules/Device'
import Images from '../../assets/images';

export default class ChatRightImageView extends Component {

  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps, nextState) {

    const nextData = _.get(nextProps, 'data')
    const data = _.get(this.props, 'data')

    const shouldUpdate = (
      nextData.message_id !== data.message_id ||
      !_.isEqual(nextData.message, data.message) ||
      nextData.send_status !== data.send_status ||
      !_.isEqual(nextData.options, data.options)
    )
    return shouldUpdate
  }

  render() {
    let photos = _.get(this.props, 'data.message.photos')

    const type = parseInt(_.get(this.props, 'data.image')) || 0
    let icon = null
    if (type === 2) {
      icon = Images.ic_like
    }

    return (
      <View style={styles.container} >
        <TouchableOpacity
          style={[styles.img_container]}
          onPress={this.props.onPressShowMessageInfo} >
          {
            icon ?
              <Image
                style={{ width: 40, height: 40, alignSelf: 'flex-end' }}
                source={icon}
                resizeMode='contain' />
              :
              !photos ?
                // default img 
                <View
                  style={{
                    width: Device.screenSize().width * 3 / 4,
                    height: 200,
                    backgroundColor: Colors.light_gray,
                    borderRadius: 10,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }} >
                  <ActivityIndicator animating size="small" color={Colors.black} />
                </View>
                :
                ((photos && photos.length >= 1) ?
                  <Image
                    source={{ uri: photos[0].path }}
                    style={{
                      // width: photos[0].width,
                      // height: photos[0].height,
                      width: 150,
                      height: 150,
                      borderRadius: 10,
                      maxWidth: Device.screenSize().width * 3 / 4
                    }} /> :
                  null)
          }
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  img_container: {
    marginRight: 10,
    // borderRadius: 10,
    // maxWidth: Device.screenSize().width * 3 / 4
  },
  avt: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  img_avt: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignSelf: 'center',
  }
})