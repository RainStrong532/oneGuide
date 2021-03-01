import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import _ from 'lodash'
import Colors from '../../constants/colors'
import ChatConfig from '../../constants/chat-config'
import Device from '../../modules/Device'
import i18next from 'i18next'
import AvatarSeenView from './AvatarSeenView';
import ChatRightTextView from './ChatRightTextView';
import ChatRightImageView from './ChatRightImageView';
import ChatRighShareLink from './ChatRighShareLink';

export default class ChatRightView extends Component {

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
      nextData.send_status !== data.send_status ||
      nextData.image !== data.image ||
      !_.isEqual(nextData.message, data.message) ||
      !_.isEqual(nextData.options, data.options)
    )
    return shouldUpdate
  }


  render() {
    let type = parseInt(_.get(this.props, 'data.image')) || 0
    type = parseInt(_.get(this.props, 'data.type')) || type
    return (
      <View style={styles.container}>
        {
          (type === 0) &&
          <ChatRightTextView data={this.props.data} onPressShowMessageInfo={this.props.onPressShowMessageInfo} />
        }
        {
          (type === 1 || type === 2) &&
          <ChatRightImageView data={this.props.data} />
        }

        {
          (type === 3) &&
          <ChatRighShareLink data={this.props.data} />
        }


      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-end',
  },
})