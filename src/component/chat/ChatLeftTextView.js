import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native'
import _ from 'lodash'
import Colors from '../../constants/colors'
import ChatConfig from '../../constants/chat-config'
import Device from '../../modules/Device'

export default class ChatLeftTextView extends Component {

  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps, nextState) {

    const nextData = _.get(nextProps, 'data')
    const data = _.get(this.props, 'data')

    const shouldUpdate = (
      nextData.message_id !== data.message_id ||
      nextData.message !== data.message ||
      nextData.avatar !== data.avatar ||
      !_.isEqual(nextData.options, data.options)
    )
    return shouldUpdate
  }

  render() {
    let message = _.get(this.props, 'data.message')
    const avatar = _.get(this.props, 'data.avatar')
    const showAvatar = _.get(this.props, 'data.options.showAvatar')
    const borderTopLeftRadius = _.get(this.props, 'data.options.top') ? ChatConfig.Message.border_radius : 2
    const borderBottomLeftRadius = _.get(this.props, 'data.options.bottom') ? ChatConfig.Message.border_radius : 2

    return (
      <View style={styles.container}>
        {
          showAvatar &&
          <TouchableOpacity
            style={styles.avt}
            onPress={this.props.onPressAvt}>
            <Image
              source={{ uri: avatar }}
              style={styles.img_avt}
            />
          </TouchableOpacity>
        }

        <TouchableOpacity
          style={[styles.button, { borderTopLeftRadius, borderBottomLeftRadius }]}
          onPress={this.props.onPressShowMessageInfo} >
          <Text style={[styles.text, ChatConfig.Message.style_text]}>{message}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginLeft: 50,
    // marginTop: 4,
    backgroundColor: Colors.light_gray,
    borderBottomRightRadius: ChatConfig.Message.border_radius,
    borderTopRightRadius: ChatConfig.Message.border_radius,
    maxWidth: Device.screenSize().width * 3 / 4
  },
  text: {
    color: Colors.black,
    marginHorizontal: 10,
    marginVertical: 8,
  },
  avt: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    height: 30,
    width: 30,
    borderRadius: 15,
    // alignSelf: 'flex-start'
  },
  img_avt: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignSelf: 'center',
    // borderColor: Colors.gray,
    // borderWidth: 1
  }
})