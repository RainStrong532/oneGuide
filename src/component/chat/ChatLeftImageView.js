import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, Image, ActivityIndicator } from 'react-native'
import _ from 'lodash'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import ChatConfig from '../../constants/chat-config'
import Device from '../../modules/Device'

export default class ChatLeftImageView extends Component {

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

    const photos = _.get(this.props, 'data.message.photos')
    const type = parseInt(_.get(this.props, 'data.image')) || 0
    let icon = null
    if (type === 2) {
      icon = Images.ic_like
    }

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
          onPress={this.props.onPressShowMessageInfo} >
          {
            icon ?
              <Image
                style={{ width: 40, height: 40, alignSelf: 'flex-end' }}
                source={icon}
                resizeMode='contain' />
              :
              ((photos && photos.length >= 1) ?
                <Image
                  source={{ uri: photos[0].path }}
                  style={{
                    // width: photos[0].width,
                    // height: photos[0].height,
                    width:150,
                    height:150,
                    borderRadius: 10,
                    maxWidth: Device.screenSize().width * 3 / 4
                  }} />
                : null
              )
          }
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
  }
})