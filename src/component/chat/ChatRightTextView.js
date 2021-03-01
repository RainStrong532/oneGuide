import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import _ from 'lodash'
import Colors from '../../constants/colors'
import ChatConfig from '../../constants/chat-config'
import Device from '../../modules/Device'
import i18next from 'i18next'
import AvatarSeenView from './AvatarSeenView';

export default class ChatRightTextView extends Component {

  constructor(props) {
    super(props)

    this.state = {
    }
  }

  shouldComponentUpdate(nextProps, nextState) {

    const nextData = _.get(nextProps, 'data')
    const data = _.get(this.props, 'data')

    const shouldUpdate = (
      nextData.message_id !== data.message_id ||
      nextData.message !== data.message ||
      nextData.send_status !== data.send_status ||
      !_.isEqual(nextData.options, data.options)
    )
    return shouldUpdate
  }

  render() {

    // message
    let message = _.get(this.props, 'data.message')

    // send status
    const send_status = _.get(this.props, 'data.send_status')
    let send_status_style = ChatConfig.Message.styte_send_status_sending
    if (send_status === ChatConfig.SendStatus.recevied) {
      send_status_style = ChatConfig.Message.styte_send_status_received
    }
    // border
    const borderTopRightRadius = _.get(this.props, 'data.options.top') ? ChatConfig.Message.border_radius : 2
    const borderBottomRightRadius = _.get(this.props, 'data.options.bottom') ? ChatConfig.Message.border_radius : 2

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, { borderTopRightRadius, borderBottomRightRadius }]}
          onPress={this.props.onPressShowMessageInfo}>
          <Text style={[styles.text, ChatConfig.Message.style_text]}>{message}</Text>
        </TouchableOpacity>
        {
          // (send_status !== ChatConfig.SendStatus.seen) &&
          // <View style={[
          //   styles.send_status,
          //   send_status_style
          // ]}>
          // </View>
        }
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-end',
  },
  button: {
    backgroundColor: Colors.blue,
    borderTopLeftRadius: ChatConfig.Message.border_radius,
    borderBottomLeftRadius: ChatConfig.Message.border_radius,
    maxWidth: Device.screenSize().width * 3 / 4,
    marginRight: 14,
    // marginTop: 4
  },
  text: {
    color: Colors.white,
    marginVertical: 8,
  },
  send_status: {
    position: 'absolute',
    bottom: 0,
    right: 2,
  }
})