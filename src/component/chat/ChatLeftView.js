import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native'
import _ from 'lodash'
import Colors from '../../constants/colors'
import ChatConfig from '../../constants/chat-config'
import Device from '../../modules/Device'
import ChatLeftTextView from './ChatLeftTextView';
import ChatLeftImageView from './ChatLeftImageView';
import ChatLeftShareLink from './ChatLeftShareLink';

export default class ChatLeftView extends Component {

  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(nextProps, nextState) {

    const nextData = _.get(nextProps, 'data')
    const data = _.get(this.props, 'data')

    const shouldUpdate = (
      nextData.message_id !== data.message_id ||
      nextData.image !== data.image ||
      nextData.avatar !== data.avatar ||
      !_.isEqual(nextData.message, data.message) ||
      !_.isEqual(nextData.options, data.options)
    )
    return shouldUpdate
  }

  render() {
    // const type = _.get(this.props, 'data.image')
    let type = parseInt(_.get(this.props, 'data.image')) || 0
    type = parseInt(_.get(this.props, 'data.type')) || type

    return (
      <View style={styles.container}>
        {
          (type === 0) &&
          <ChatLeftTextView data={this.props.data} onPressShowMessageInfo={this.props.onPressShowMessageInfo} />
        }

        {
          (type === 1 || type === 2) &&
          < ChatLeftImageView data={this.props.data} />
        }

        {
          (type === 3) &&
          < ChatLeftShareLink data={this.props.data} />
        }

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
})