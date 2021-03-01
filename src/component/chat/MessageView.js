import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native'
import Colors from '../../constants/colors'
import _ from 'lodash'
import ChatLeftView from './ChatLeftView'
import ChatRightView from './ChatRightView'
import AvatarSeenView from './AvatarSeenView'
import DateHelper from '../../utils/DateHelper'
import i18next from 'i18next';

export default class MessageView extends Component {

  constructor(props) {
    super(props)

  }

  shouldComponentUpdate(nextProps, nextState) {

    const nextData = _.get(nextProps, 'data')
    const data = _.get(this.props, 'data')

    const shouldUpdate = (
      nextProps.right !== this.props.right ||
      !_.isEqual(nextData, data)
    )
    return shouldUpdate
  }


  onPressShowMessageInfo = () => {
    const data = _.get(this.props, 'data')
    this.props.onPressShowMessageInfo(data)
  }

  render() {
    const { data, right } = this.props
    const showInfo = _.get(data, 'options.showInfo') || false
    const showDate = _.get(data, 'options.showDate') || false
    const time = DateHelper.convertTimeToFomart(_.get(data, 'intime'))
    const seenStatus = i18next.t('Seen')
    const styleSeens = right ? { textAlign: 'right', marginRight: 14 } : { textAlign: 'left', marginLeft: 50 }
    return (
      <View style={{ marginVertical: 2 }}>
        {
          (showInfo || showDate) &&
          <Text style={styles.text_info}>{time}</Text>
        }
        {
          right ?
            <ChatRightView data={data}
              onPressShowMessageInfo={this.onPressShowMessageInfo} /> :
            <ChatLeftView data={data}
              onPressShowMessageInfo={this.onPressShowMessageInfo} />
        }

        {
          showInfo &&
          <Text style={[
            styleSeens,
            styles.text_time_seen
          ]}>{seenStatus}</Text>
        }
        <AvatarSeenView data={null} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  text_info: {
    textAlign: 'center',
    color: Colors.gray,
    fontSize: 12,
    lineHeight: 18,
    marginVertical: 6
  },
  text_time_seen: {
    color: Colors.gray,
    fontSize: 10,
    lineHeight: 16
  }
})