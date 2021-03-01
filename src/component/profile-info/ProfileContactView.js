


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
import TextInputForm from '../views/TextInputForm';

export default class ProfileContactView extends Component {

  static propTypes = {
    phone: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
    onChangePhoneNumber: PropTypes.func,
    onChangeEmail: PropTypes.func,
    onChangeAddress: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.onChangePhoneNumber = this.onChangePhoneNumber.bind(this)
    this.onChangeEmail = this.onChangeEmail.bind(this)
    this.onChangeAddress = this.onChangeAddress.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate = (
      nextProps.phone !== this.props.phone ||
      nextProps.email !== this.props.email ||
      nextProps.address !== this.props.address
    )
    return shouldUpdate
  }

  onChangePhoneNumber = (value) => {
    if (this.props.onChangePhoneNumber) {
      this.props.onChangePhoneNumber(value)
    }
  }

  onChangeEmail = (value) => {
    if (this.props.onChangeEmail) {
      this.props.onChangeEmail(value)
    }
  }

  onChangeWebsite = (value) => {
    if (this.props.onChangeWebsite) {
      this.props.onChangeWebsite(value)
    }
  }

  onChangeOrganisation = (value) => {
    if (this.props.onChangeOrganisation) {
      this.props.onChangeOrganisation(value)
    }
  }

  onChangeAddress = (value) => {
    if (this.props.onChangeAddress) {
      this.props.onChangeAddress(value)
    }
  }

  render() {
    // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@', this.props.website);
    return (
      <View style={[this.props.style, styles.container]}>
        <View style={styles.contactInfo}>
          <Image
            style={{ marginLeft: 10, alignSelf: 'center', width: 15, height: 15 }}
            source={Images.person_contact}
            resizeMode='stretch'
          />
          <Text style={{ marginLeft: 5, fontSize: 16, fontWeight: '500' }}>
            {i18next.t('Contact')}
          </Text>
        </View>
        <View style={styles.containView}>
          <Text style={styles.txtTitle}>{i18next.t('PhoneNumber')}</Text>
          <View style={styles.buttonRight}>
            <TextInput
              style={styles.textInputForm}
              // placeholder={i18next.t('PhoneNumber')}
              // placeholderTextColor={Colors.light_gray_2}
              keyboardType='number-pad'
              maxLength={10}
              secureTextEntry={false}
              autoCapitalize='none'
              numberOfLines={1}
              value={this.props.phone}
              onChangeText={(value) => { this.onChangePhoneNumber(value) }}
            />
            <View style={styles.lineBottomText}></View>
          </View>
        </View>
        <View style={styles.containView}>
          <Text style={styles.txtTitle}>{i18next.t('Address')}</Text>
          <View style={styles.buttonRight}>
            <TextInput
              style={styles.textInputForm}
              // placeholder={i18next.t('Address')}
              // placeholderTextColor={Colors.light_gray_2}
              secureTextEntry={false}
              autoCapitalize='words'
              value={this.props.address}
              onChangeText={(value) => { this.onChangeAddress(value) }}
            />
            <View style={styles.lineBottomText}></View>
          </View>
        </View>
        {/* <View style={styles.containView}>
          <Text style={styles.txtTitle}>{'Email'}</Text>
          <View style={styles.buttonRight}>

            <TextInput
              style={styles.textInputForm}
              // placeholder={'Email'}
              // placeholderTextColor={Colors.light_gray_2}
              secureTextEntry={false}
              autoCapitalize='none'
              value={this.props.email}
              // editable={this.props.isAgent === '2' ? false : true}
              onChangeText={(value) => { this.onChangeEmail(value) }}
            />
            <View style={styles.lineBottomText}></View>
          </View>
        </View> */}
        {
          this.props.isAgent === '2'
            ?
            <View style={{ flex: 1 }}>
              <View style={styles.containView}>
                <Text style={styles.txtTitle}>{'Email'}</Text>
                <View style={styles.buttonRight}>

                  <Text
                    style={styles.textInputFormEmail}

                  >{this.props.email}</Text>
                  <View style={styles.lineBottomText}></View>
                </View>
              </View>
              <View style={styles.containView}>
                <Text style={styles.txtTitle}>{'Website'}</Text>
                <View style={styles.buttonRight}>

                  <TextInput
                    style={styles.textInputForm}
                    // placeholder={'Email'}
                    // placeholderTextColor={Colors.light_gray_2}
                    secureTextEntry={false}
                    autoCapitalize='none'
                    placeholder={this.props.website}                  // editable={this.props.isAgent === '2' ? false : true}
                    onChangeText={(value) => { this.onChangeWebsite(value) }}
                  />
                  <View style={styles.lineBottomText}></View>
                </View>
              </View>
            </View>
            :
            null
        }
        { this.props.isAgent == 1 && (
          <View>
            <View style={styles.containView}>
              <Text style={styles.txtTitle}>{'Email'}</Text>
              <View style={styles.buttonRight}>
                <Text
                  style={styles.textInputFormEmail}
                >{this.props.email}</Text>
                <View style={styles.lineBottomText}></View>
              </View>
            </View>
            <View style={styles.containView}>
              <Text style={styles.txtTitle}>{i18next.t('CompanyName')}</Text>
              <View style={styles.buttonRight}>
                <TextInput
                  style={styles.textInputForm}
                  // placeholder={'Email'}
                  // placeholderTextColor={Colors.light_gray_2}
                  secureTextEntry={false}
                  autoCapitalize='none'
                  placeholder={this.props.organisation}
                  // editable={this.props.isAgent === '2' ? false : true}
                  onChangeText={(value) => { this.onChangeOrganisation(value) }}
                />
                <View style={styles.lineBottomText}></View>
              </View>
            </View>
          </View>
        )}
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
    paddingBottom: 30,
  },
  containView: {
    marginTop: 10,
    // flexDirection: 'row',
    //height: 36,
    // alignItems: 'center',
    flex: 1,
  },
  buttonRight: {
    marginHorizontal: 15,
    justifyContent: 'center'
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
  textInputFormEmail: {
    fontSize: 14,
    // height: 35,
    justifyContent: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
    color: '#99A3A4'
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
  contactInfo: {
    height: 50,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    alignItems: 'center'
  },
  imgEdit: {
    //justifyContent: 'flex-end'
    width: 10,
    height: 10
  },
  wrapEdit: {
    flex: 1,
    justifyContent: 'center'
  }
});
