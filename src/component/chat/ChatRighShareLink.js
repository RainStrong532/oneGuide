import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, Image, ActivityIndicator } from 'react-native'
import _ from 'lodash'
import Colors from '../../constants/colors'
import CommonStyles from '../../constants/styles'
import ChatConfig from '../../constants/chat-config'
import Device from '../../modules/Device'
import Images from '../../assets/images';

export default class ChatRighShareLink extends Component {

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
    const message = _.get(this.props, 'data.message')
    const image = _.get(this.props, 'data.comment.image')
    const title = _.get(this.props, 'data.comment.title')
    const name = _.get(this.props, 'data.comment.name')

    return (
      <View style={styles.container} >
        <TouchableOpacity
          style={[styles.img_container]}
          onPress={this.props.onPressShowMessageInfo} >
          {
            !message || <View
              style={[styles.button]}
              onPress={this.props.onPressShowMessageInfo}>
              <Text style={[styles.text, ChatConfig.Message.style_text]}>{message}</Text>
            </View>
          }

          <View style={{ backgroundColor: Colors.white, width: 120, marginVertical: 2, borderBottomRightRadius: 16 }}>
            {

              image &&
              <Image
                source={{ uri: image }}
                style={{
                  width: 120,
                  height: 120,
                }} />
            }
            <Text style={{ marginTop: 5, marginBottom: 5, marginHorizontal: 5 }} numberOfLines={2} >{title}</Text>
            <Text style={{ marginBottom: 5, color: Colors.light_gray, marginHorizontal: 5 }} >{name}</Text>
          </View>
        </TouchableOpacity>
      </View >
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
    marginRight: 14,
    // borderRadius: 10,
    alignItems: 'flex-end',
    maxWidth: Device.screenSize().width * 3 / 4
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
  },
  button: {
    backgroundColor: Colors.blue,
    borderTopLeftRadius: ChatConfig.Message.border_radius,
    borderBottomLeftRadius: ChatConfig.Message.border_radius,
    borderTopRightRadius: ChatConfig.Message.border_radius,
    borderBottomRightRadius: 0,
    maxWidth: Device.screenSize().width * 3 / 4,
    // marginRight: 14,
    // marginTop: 4
  },
  text: {
    color: Colors.white,
    marginVertical: 8,
  },
})