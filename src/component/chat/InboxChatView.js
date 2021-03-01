
import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import CommonStyles from '../../constants/styles'
import _ from 'lodash'
import i18next from 'i18next';
import DateHelper from '../../utils/DateHelper'

export default class InboxChatView extends Component {

  // static propTypes = {
  //   onPressMoreOptionsButton: PropTypes.func,
  //   onPressAvatarButton: PropTypes.func
  // }

  constructor(props) {
    super(props);
    this.onPressMoreOptionsButton = this.onPressMoreOptionsButton.bind(this)
    this.onPressAvatarButton = this.onPressAvatarButton.bind(this)
  }

  // shouldComponentUpdate(nextProps, nextState) {

  //   const nextData = _.get(nextProps, 'data.mesage')
  //   const data = _.get(this.props, 'data.mesage')

  //   const shouldUpdate = (
  //     nextData.conversation_id !== data.conversation_id ||
  //     nextData.message !== data.message 
  //   )
  //   return shouldUpdate
  // }

  onPressMoreOptionsButton = () => {
    if (this.props.onPressMoreOptionsButton) {
      this.props.onPressMoreOptionsButton()
    }
  }

  onPressAvatarButton = () => {
    if (this.props.onPressAvatarButton) {
      this.props.onPressAvatarButton()
    }
  }

  render() {
    // date
    const avatar = _.get(this.props, 'data.room.recipients[0].avatar');
    const username = _.get(this.props, 'data.room.recipients[0].username');
    let intime = _.get(this.props, 'data.room.intime');
    const updated_date = DateHelper.timeSince(intime);

    const new_message = _.get(this.props, 'data.room.new');
    const fontWeight = (new_message === 'active') ? 'bold' : null;
    const fontWeights = (new_message === 'active') ? '700' : '500';
    const total_message_unread = parseInt(_.get(this.props, 'data.room.total_message_unread')) || 0;
    let type = parseInt(_.get(this.props, 'data.room.image')) || 0;
    type = parseInt(_.get(this.props, 'data.room.type')) || type;

    let message = null;
    let icon = null;
    if (type === 1) {
      message = i18next.t('YouReceivedPhoto')
    } else if (type === 2) {
      message = i18next.t('Like')
      icon = Images.ic_like
    } else if (type === 3) {
      message = i18next.t('ShareALink')
    } else {
      message = _.get(this.props, 'data.room.message') || ''
    }

    return (
      <View style={[styles.container, { backgroundColor: Colors.white }]} >
        {/* View Profile  */}
        <TouchableOpacity
          style={styles.container_avt}
          onPress={this.onPressAvatarButton} >
          <Image
            style={styles.avt}
            source={{ uri: avatar }}>
          </Image>
        </TouchableOpacity>
        <View style={styles.container_text}>
          <Text
            style={{ color: Colors.black, fontSize: 16, fontWeight: fontWeights }}>
            {username}
          </Text>
          {
            icon ? <Image
              style={{ width: 20, height: 20, marginTop: 4 }}
              source={icon}
              resizeMode='stretch' /> : <Text style={[styles.text_message, { fontWeight }]} numberOfLines={1}>{message}</Text>
          }
        </View>

        <Text
          style={{
            position: 'absolute',
            top: 6,
            right: 10
          }}>
          {updated_date}
        </Text>

        {
          (total_message_unread && total_message_unread !== 0)
            ?
            <View
              style={styles.number_of_message}>

              <Text
                style={[styles.number, { fontSize: total_message_unread > 100 ? 10 : 12 }]}>
                {
                  total_message_unread > 100
                    ?
                    "99+"
                    :
                    total_message_unread
                }
              </Text>
            </View>
            :
            <></>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 0.2,
    borderColor: '#DCDCDC'
  },
  avt: {
    height: 60,
    width: 60,
    alignSelf: 'center',
    borderRadius: 30
  },
  container_text: {
    flex: 1,
    marginBottom: 15,
    marginTop: 18
  },
  text_message: {
    // flex: 1,
    marginTop: 4,
    fontSize: 14,
    color: Colors.black,
    marginRight: 5
  },
  container_avt: {
    margin: 10,
    height: 60,
    width: 60
  },
  number_of_message: {
    width: 20,
    height: 20,
    backgroundColor: Colors.red_1,
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    bottom: 15,
    right: 10,
  },
  number: {
    fontWeight: "bold",
    color: Colors.white,
  }
})