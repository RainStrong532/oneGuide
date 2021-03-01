
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native';
import { pushToAccountVerify } from '../../navigation';
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import Device from '../../modules/Device'
import CommonStyles from '../../constants/styles'
import { i18next } from '../../utils'
import DateHelper from '../../utils/DateHelper'
import _ from 'lodash'

export default class ProfileHeaderView extends Component {

  static propTypes = {
    avatar: PropTypes.string,
    fullname: PropTypes.string,
    onPressAvatarButton: PropTypes.func,
    onPressEditProfileButton: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.onPressAvatarButton = this.onPressAvatarButton.bind(this)
    this.onPressEditProfileButton = this.onPressEditProfileButton.bind(this)
  }

  onPressAvatarButton = () => {
    if (this.props.onPressAvatarButton) {
      this.props.onPressAvatarButton()
    }
  }

  onPressEditProfileButton = () => {
    if (this.props.onPressEditProfileButton) {
      this.props.onPressEditProfileButton()
    }
  }

  onPressGotoAccountVerify = () => {

    pushToAccountVerify(this.props.componentId, { getMyInfo: this.props.getMyInfo });
  }

  onPressNameButton = () => {
    if (this.props.onPressNameButton) {
      this.props.onPressNameButton()
    }
  }

  render() {
    const { is_verify, is_agent } = this.props;
    let ProfileUser = ""
    if (is_agent == "1") ProfileUser = i18next.t('Your_Profile')
    else ProfileUser = i18next.t('BusinessInformation')
    return (
      <View style={[this.props.style, { flexDirection: 'row' }]} >
        <TouchableOpacity
          style={{ margin: 10, height: 60, width: 60, marginTop: 15 }}
          onPress={this.onPressAvatarButton} >
          <Image style={styles.avatar}
            source={{ uri: this.props.avatar }}></Image>
          {
            is_agent == "1" ?
              <Image
                style={{ width: 20, height: 20, borderRadius: 10, position: 'absolute', bottom: -3, right: -3 }}
                source={Images.logo_flag_header}>
              </Image>
              :
              null
          }
        </TouchableOpacity>
        <View style={styles.viewName}>
          <TouchableOpacity
            onPress={this.onPressNameButton}>
            <Text numberOfLines={2} style={{ fontSize: 18, fontWeight: 'bold', color: '#273746' }}>
              {this.props.fullname + "\t"}
              {
                is_verify === "1" || is_verify === 1
                  ?
                  <Image source={Images.ic_select} style={{ width: 16, height: 16 }} />
                  :
                  null

              }
            </Text>
          </TouchableOpacity>
          {
            is_verify === "1" || is_verify === 1
              ?
              // <Text style={styles.subName}>{i18next.t('Your_Profile')}</Text>
              <Text style={styles.subName}>{i18next.t(ProfileUser)}</Text>
              :
              is_verify === "2" || is_verify === 2
                ?
                <Text style={{ color: 'blue' }}>Đang chờ xác thực!</Text>
                :
                <TouchableOpacity
                  onPress={this.onPressGotoAccountVerify}
                >
                  <Text style={[styles.subName, { color: Colors.blue_2 }]}>
                    {i18next.t('AccountVerification') + '*'}
                  </Text>
                </TouchableOpacity>
          }
        </View>
        <TouchableOpacity
          style={styles.editProfile}
          onPress={this.onPressEditProfileButton} >
          <Image style={{ height: 40, width: 40, alignSelf: 'center', }}
            source={Images.ic_edit_profile}
            resizeMode='center' />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  editProfile: {
    height: 40,
    width: 40,
    alignSelf: 'center',
    position: 'absolute',
    right: 10
  },
  avatar: {
    height: 60,
    width: 60,
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 30
  },
  viewName: {
    maxWidth: Dimensions.get('window').width - 150,
    marginLeft: 10,
    flexDirection: 'column',
    alignSelf: 'center'
  },
  fullName: {

    fontWeight: 'bold',
    fontSize: 15
  },
  subName: {
    marginTop: 1,
    fontSize: 15,
    color: Colors.gray_4,
    zIndex: 1
  }
});
