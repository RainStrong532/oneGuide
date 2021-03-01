import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Colors from '../../constants/colors';
import Device from '../../modules/Device';
import _ from 'lodash';
import FastImage from 'react-native-fast-image'
import Images from '../../assets/images';
import { i18next } from '../../utils'

const screenWidth = Device.screenSize().width

export default class UserApplyItemView extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    const nextData = _.get(nextProps, 'item')
    const data = _.get(this.props, 'item')
    return true
  }

  onPressUserProfile = (user_id) => {
    if (this.props.onPressUserProfile) {
      this.props.onPressUserProfile(user_id)
    }
  }

  handleCancel = (item) => {

    this.props.onPressCancel(item)
  }

  handleAgree = (item) => {
    this.props.onPressAgree(item)
  }


  onPressChatButon = (item) => {

    this.props.onPressChatButon(item)
  }


  render() {

    const item = _.get(this.props, 'item')

    const message = _.get(this.props, 'item.agent_apply.message')
    const avatar = _.get(this.props, 'item.avatar')
    const displayName = _.get(this.props, 'item.display_name')
    const user_id = _.get(this.props, 'item.user_id')
    const agent_apply_type = (_.get(this.props, 'item.agent_apply.type') || '').toString()
    return (
      <View style={styles.container}>

        <View style={{ flexDirection: 'row', padding: 8 }}>
          <View style={{ width: '20%' }}>
            <Image style={{ width: 60, height: 60, borderRadius: 30 }}
              source={{ uri: avatar }}></Image>
          </View>

          <View style={{ width: '80%', justifyContent: "center", alignItems: 'center' }}>
            <Text style={styles.title}>{displayName}</Text>
            {
              agent_apply_type == 'wait' ?
                <View style={styles.container_btn_right}>
                  <View style={{ width: '30%', height: 30, borderRadius: 7, marginRight: 20, backgroundColor: '#1E90FF', justifyContent: 'center' }}>
                    <TouchableOpacity
                      //style={styles.bt_agree}
                      onPress={() => this.handleAgree(item)}
                    >
                      <Text style={{ textAlign: 'center' }}>{i18next.t('Ok')}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ width: '30%', height: 30, borderRadius: 7, backgroundColor: '#C0C0C0', justifyContent: 'center' }}>
                    <TouchableOpacity
                      onPress={() => this.handleCancel(item)}
                    >
                      <Text style={{ textAlign: 'center', }}>{i18next.t('Cancel')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                : null
            }
            {
              agent_apply_type == 'agree' ?
                <View style={{ marginTop: 5, width: '60%', height: 30, backgroundColor: 'C0C0C0' }}>
                  <TouchableOpacity
                    onPress={() => this.handleCancel(item)}
                  >
                    <Text style={{ color: '#FF6347', textAlign: 'center' }}>{i18next.t('CancellationOfRegistration')}</Text>
                  </TouchableOpacity>
                </View>
                : null
            }

            {
              agent_apply_type == 'agent-cancel' ?
                <View style={{ marginTop: 5, width: '60%', height: 30, backgroundColor: 'C0C0C0' }}>
                  <TouchableOpacity
                    onPress={() => this.handleCancel(item)}
                  >
                    <Text style={{ color: '#FF6347', textAlign: 'center' }} >{i18next.t('CancellationOfRegistrationRequestForGuide')}</Text>
                  </TouchableOpacity>
                </View>
                : null
            }

          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  text_comfim: {
    color: '#000',
    fontSize: 17
  },
  bt_cancel: {
    borderRadius: 5,
    width: 60,
    height: 30,
    backgroundColor: '#dddd',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center'
  },

  bt_agree: {
    borderRadius: 5,
    width: 60,
    height: 30,
    backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center'
  },
  container_btn_right: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
    // height: 40
  },
  container: {
    flexDirection: 'row',
    width: screenWidth,
    height: 80,
    alignItems: 'center',
    borderWidth: 0.3,
    borderColor: '#C0C0C0',

  },
  subContain: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
    justifyContent: 'space-between'
  },
  rightView: {

    padding: 5,
    right: 5,
    height: 40,
    // width: 150,
    borderWidth: 1,
    borderColor: 'black',
    flex: 1,
    flexDirection: 'row'
  },
  rightButton: {
    height: 40,
    // width: 150,
    // marginVertical: 10,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 5,
    justifyContent: "center"
  },
  right_text: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.blue_1,
    textAlign: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  time_text: {
    marginLeft: 5,
    fontSize: 15,
    fontWeight: '300'
  },
  detail_text: {
    fontSize: 15,
    fontWeight: '500'
  },
  borderline: {
    height: 0.5,
    borderWidth: 0.5,
    borderColor: Colors.light_gray,
    width: screenWidth,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  }
})
