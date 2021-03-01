import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import Device from '../../modules/Device'
import CommonStyles from '../../constants/styles'
import { i18next } from '../../utils'
import DateHelper from '../../utils/DateHelper'

import _ from 'lodash'

export default class ProfilePersonInfoView extends Component {

  static propTypes = {
    onSelectGenderPress: PropTypes.func,
    onSelectDateOfBirthPress: PropTypes.func,
    onSelectMemberSincePress: PropTypes.func,
    onChangeFullName: PropTypes.func,
    gender: PropTypes.string,
    fullname: PropTypes.string,
    shortcutname: PropTypes.string,
    birthday: PropTypes.string,
    businessCode: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.onSelectGenderPress = this.onSelectGenderPress.bind(this)
    this.onSelectDateOfBirthPress = this.onSelectDateOfBirthPress.bind(this)
    this.onSelectMemberSincePress = this.onSelectMemberSincePress.bind(this)
    this.onChangeFullName = this.onChangeFullName.bind(this)
    this.onChangeShorcutName = this.onChangeShorcutName.bind(this)
    this.onChangeBusinessCode = this.onChangeBusinessCode.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate = (
      nextProps.gender !== this.props.gender ||
      nextProps.fullname !== this.props.fullname ||
      nextProps.birthday !== this.props.birthday ||
      nextProps.shortcutname !== this.props.shortcutname ||
      nextProps.businessCode !== this.props.businessCode
    )
    return shouldUpdate
  }

  onSelectGenderPress = () => {
    if (this.props.onSelectGenderPress) {
      this.props.onSelectGenderPress()
    }
  }

  onSelectDateOfBirthPress = () => {
    if (this.props.onSelectDateOfBirthPress) {
      this.props.onSelectDateOfBirthPress()
    }
  }

  onSelectMemberSincePress = () => {
    if (this.props.onSelectMemberSincePress) {
      this.props.onSelectMemberSincePress()
    }
  }

  onSelectRelationShip = () => {
    if (this.props.onSelectRelationship) {
      this.props.onSelectRelationship()
    }
  }

  onChangeFullName = (value) => {
    if (this.props.onChangeFullName) {
      this.props.onChangeFullName(value)
    }
  }

  onChangeShorcutName = (value) => {
    if (this.props.onChangeShorcutName) {
      this.props.onChangeShorcutName(value)
    }
  }

  onPressExperience = () => {
    if (this.props.onSelectExperiencePress) {
      this.props.onSelectExperiencePress()
    }
  }

  onChangeBusinessCode = (value) => {
    if (this.props.onChangeBusinessCode) {
      this.props.onChangeBusinessCode(value)
    }
  }

  onChangeRelationship = (value) => {
    // console.log('va lưu', value);
    if (this.props.onChangeRelationship) {
      this.props.onChangeRelationship(value)
    }
  }

  getTitle = () => {
    const { isAgent } = this.props
    let ProfileUser = ""
    if (isAgent == "1") ProfileUser = i18next.t('Your_Profile')
    else ProfileUser = i18next.t('BusinessInformation')
    return (
      <View style={styles.basicInfo}>
        <Image
          style={{ marginLeft: 10, alignSelf: 'center', width: 15, height: 15 }}
          source={Images.person_info}
          resizeMode='stretch'
        />
        <Text style={{ marginLeft: 5, fontSize: 16, fontWeight: '500' }}>{i18next.t(ProfileUser)}</Text>
      </View>
    )
  }

  getFullName = () => {
    const { isAgent } = this.props || ''
    return (
      <View>
        <View style={styles.containView}>
          <Text
            style={styles.txtTitle}>
            {isAgent == 1 ? i18next.t('FullName') : i18next.t('CompanyName')}
          </Text>
          <View style={styles.buttonRight}>
            <TextInput
              style={styles.textInputForm}
              // placeholder={ this.props.isAgent === '2' ? i18next.t('CompanyName') : i18next.t('FullName') }
              // placeholderTextColor={Colors.light_gray_2}
              secureTextEntry={false}
              numberOfLines={1}
              autoCapitalize='words'
              value={this.props.fullname}
              onChangeText={(value) => { this.onChangeFullName(value) }}

            />
            <View style={styles.lineBottomText}></View>
          </View>
        </View>
      </View>
    )
  }

  getGender = () => {
    const gender = _.get(this.props, 'gender')
    return (
      <View style={styles.containView}>
        <Text style={styles.txtTitle}>{i18next.t('Gender')}</Text>
        <View style={styles.buttonRight}>
          <TouchableOpacity
            style={styles.buttonPopup}
            onPress={() => { this.onSelectGenderPress() }}
          // disabled={false}
          >
            <Text>
              {gender}
            </Text>
            <Image
              style={styles.imagedrop}
              resizeMode='center'
              source={Images.ic_dropdown}>
            </Image>
          </TouchableOpacity>
          <View style={styles.lineBottomText}></View>
        </View>
      </View>
    )
  }

  getBirthday = () => {
    const { isAgent } = this.props
    return (
      <View style={styles.containView}>
        <Text style={styles.txtTitle}>{isAgent == 1 ? i18next.t('DateOfBirth') : i18next.t('DateRaning')}</Text>
        <View style={styles.buttonRight}>
          <TouchableOpacity
            style={styles.buttonPopup}
            onPress={() => { this.onSelectDateOfBirthPress() }}
          // disabled={this.props.isAgent === '2' ? true : false}
          >
            <Text style={styles.textInputForm}>
              {this.props.birthday}
            </Text>
            <Image
              style={styles.imagedrop}
              resizeMode='contain'
              source={Images.ic_calendar}>
            </Image>
          </TouchableOpacity>
          <View style={styles.lineBottomText}></View>
        </View>
      </View>
    )
  }

  getShortName = () => {
    return (
      <View style={styles.containView}>
        <Text style={styles.txtTitle}>{i18next.t('ShorcutName')}</Text>
        <View style={styles.buttonRight}>
          <TextInput
            style={styles.textInputForm}
            // placeholder={i18next.t('ShorcutName')}
            // placeholderTextColor={Colors.light_gray_2}
            secureTextEntry={false}
            numberOfLines={1}
            autoCapitalize='words'
            value={this.props.shortcutname}
            onChangeText={(value) => { this.onChangeShorcutName(value) }}
          />
          <View style={styles.lineBottomText}></View>
        </View>
      </View>
    )
  }

  getExperience = () => {
    return (
      <View style={styles.containView}>
        <Text style={styles.txtTitle}>Kinh Nghiệm</Text>
        <View style={styles.buttonRight}>
          <TouchableOpacity
            onPress={this.onPressExperience}
          >
            <TextInput
              style={styles.textInputForm}
              // placeholder={i18next.t('ShorcutName')}
              // placeholderTextColor={Colors.light_gray_2}
              editable={false}
              secureTextEntry={false}
              numberOfLines={1}
              autoCapitalize='words'
              // placeholder={this.props.experience}
              onChangeText={(value) => { this.onChangeExperience(value) }}
            />
          </TouchableOpacity>
          <View style={styles.lineBottomText}></View>
        </View>
      </View>
    )
  }

  getBusinessCode = () => {
    return (
      <View style={styles.containView}>
        <Text style={styles.txtTitle}>{i18next.t('BusinessCode')}</Text>
        <View style={styles.buttonRight}>
          <TextInput
            style={styles.textInputForm}
            // placeholder={i18next.t('BusinessCode')}
            // placeholderTextColor={Colors.light_gray_2}
            secureTextEntry={false}
            numberOfLines={1}
            autoCapitalize='none'
            value={this.props.businessCode}
            onChangeText={(value) => { this.onChangeBusinessCode(value) }}
          // editable={false}
          />
          <View style={styles.lineBottomText}></View>
        </View>
      </View>
    )
  }

  getRelationship = () => {
    const relationship = _.get(this.props, 'relationship')
    return (
      <View style={styles.containView}>
        <Text style={styles.txtTitle}>{i18next.t('Relation')}</Text>
        <View style={styles.buttonRight}>
          <TouchableOpacity
            style={styles.buttonPopup}
            onPress={this.onSelectRelationShip}
          // disabled={false}
          >
            <Text>
              {relationship}
            </Text>
            <Image
              style={styles.imagedrop}
              resizeMode='center'
              source={Images.ic_dropdown}>
            </Image>
          </TouchableOpacity>
          <View style={styles.lineBottomText}></View>
        </View>
      </View >
    )
  }

  render() {
    console.log('***********************', this.props);
    const { isAgent } = this.props
    return (
      <View style={[this.props.style, isAgent == 1 ? styles.container : styles.containerAgent]}>
        {this.getTitle()}
        {this.getFullName()}
        {/* {isAgent === '1' ? this.getShortName() : null} */}
        {isAgent === '1' ? this.getGender() : null}
        {this.getBirthday()}
        {/* {this.getRelationship()} */}
        {isAgent === '2' ? this.getBusinessCode() : null}
        {/* {isAgent === '1' ? this.getExperience() : null} */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    flexDirection: 'column',
    backgroundColor: Colors.white,
    // height: 250,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    marginLeft: 15,
    marginRight: 15,
    paddingBottom: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  containerAgent: {
    flex: 1,
    marginTop: 5,
    flexDirection: 'column',
    backgroundColor: Colors.white,
    // height: 250,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    marginLeft: 15,
    marginRight: 15,
    paddingBottom: 30,
  },
  containView: {
    marginTop: 10,
    // flexDirection: 'row',
    //height: 36,
    // alignItems: 'center',
    flex: 1,
  },
  // textLeft: {
  //   marginLeft: 30,
  //   fontWeight: 'bold'
  // },
  buttonRight: {
    // flexDirection: 'column',
    // width: 150,
    // height: 35,
    // position: 'absolute',
    // right: 5,
    justifyContent: 'center',
    marginHorizontal: 15,

  },
  imagedrop: {
    right: 10,
    width: 15,
    height: 15,
    position: 'absolute'
  },
  buttonPopup: {
    height: 30,
    justifyContent: 'center'
  },
  textInputForm: {
    fontSize: 14,
    // height: 35,
    justifyContent: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,

  },
  lineBottomText: {
    height: 0.5,
    borderWidth: 0.5,
    borderColor: Colors.gray_1
  },
  txtTitle: {
    // fontWeight: 'bold',
    fontSize: 12,
    marginHorizontal: 15,
  },
  txtTitle: {
    // fontWeight: 'bold',
    fontSize: 12,
    marginHorizontal: 15,
    color: '#99A3A4'
  },
  basicInfo: {
    // marginTop: 10,
    //marginLeft: 5,
    height: 50,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    alignItems: 'center',
  }
});
