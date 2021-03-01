import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, Image, ActivityIndicator } from 'react-native'
import _ from 'lodash'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import ChatConfig from '../../constants/chat-config'
import Device from '../../modules/Device'

export default class ChatLeftShareLink extends Component {

  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps, nextState) {

    const nextData = _.get(nextProps, 'data')
    const data = _.get(this.props, 'data')

    const shouldUpdate = (
      nextData.message_id !== data.message_id ||
      !_.isEqual(nextData.message, data.message) ||
      nextData.avatar !== data.avatar ||
      !_.isEqual(nextData.options, data.options)
    )
    return shouldUpdate
  }

  render() {
    const avatar = _.get(this.props, 'data.avatar')
    const showAvatar = _.get(this.props, 'data.options.showAvatar')
    const message = _.get(this.props, 'data.message')
    const image = _.get(this.props, 'data.comment.image')
    const title = _.get(this.props, 'data.comment.title')
    const name = _.get(this.props, 'data.comment.name')

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
          style={[styles.img_container]}
          onPress={this.props.onPressShowMessageInfo}
        >
          {
            !message || <View
              style={[styles.button]}
              onPress={this.props.onPressShowMessageInfo} >
              <Text style={[styles.text, ChatConfig.Message.style_text]}>{message}</Text>
            </View>
          }

          <View style={{
            backgroundColor: Colors.white,
            width: 120,
            marginVertical: 2,
            borderBottomLeftRadius: ChatConfig.Message.border_radius,
          }}>
            {
              image &&
              <Image
                source={{ uri: image }}
                style={{
                  width: 120,
                  height: 120,
                }}
              />
            }
            <Text style={{ marginTop: 5, marginBottom: 5, marginHorizontal: 5 }} numberOfLines={2} >{title}</Text>
            <Text style={{ marginBottom: 10, color: Colors.light_gray, marginHorizontal: 5 }} >{name}</Text>

          </View>
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
  img_container: {
    marginLeft: 50,
    borderRadius: 10,
    maxWidth: Device.screenSize().width * 3 / 4,
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
    // marginLeft: 50,
    // marginTop: 4,
    backgroundColor: Colors.light_gray,
    borderBottomRightRadius: ChatConfig.Message.border_radius,
    borderTopRightRadius: ChatConfig.Message.border_radius,
    borderTopLeftRadius: ChatConfig.Message.border_radius,
    borderBottomLeftRadius: 0,
    maxWidth: Device.screenSize().width * 3 / 4
  },
  text: {
    color: Colors.black,
    marginHorizontal: 10,
    marginVertical: 8,
  },
})