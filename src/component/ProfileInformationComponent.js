import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Image,
  ActivityIndicator, TouchableOpacity, Alert, Platform, FlatList,
  ScrollView, TextInput, KeyboardAvoidingView,
  DatePickerAndroid,
  RefreshControl
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { ReachabilityView, i18next, Loading } from '../utils'
import { backScreen, showRegisterSelectCard, gotoSelectOptionsScreen, showDatePicker } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import CommonStyles from '../constants/styles'
import SearchBarView from './views/SearchBarView'
import SearchComponent from '../component/SearchComponent'
import DataManager from '../modules/DataManager'
import _ from 'lodash'

import HeaderView from './views/HeaderView'
import ProfileInfoHeaderView from './profile-info/ProfileInfoHeaderView'
import ProfilePersonInfoView from './profile-info/ProfilePersonInfoView'
import ProfileContactView from './profile-info/ProfileContactView';
import ProfileLanguageView from './profile-info/ProfileLanguageView';
import ProfileCardInfomation from './profile-info/ProfileCardInfomation';
import Helper from '../utils/Helper';

export default class ProfileInformationComponent extends Component {

  static options(passProps) {
    return {
      statusBar: {
        backgroundColor: 'transparent',
        visible: true,
        style: 'light'
      },
    };
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.onSelectOtherLanguagePress = this.onSelectOtherLanguagePress.bind(this)

    const user_data = this.props.user.me
    this.isAgent = _.get(user_data, 'is_agent')
    const state_user = this.getDataFromProps(user_data)
    this.state = {
      refreshing: false,
      ...state_user
    }
  }

  getDataFromProps = (data) => {
    console.log(' ------data======', data);
    const avatar = _.get(data, 'avatar')
    const fullname = _.get(data, 'username')
    const shortcutname = _.get(data, 'shortcutname')
    const businessCode = _.get(data, 'card')
    const email = _.get(data, 'email')
    const birthday = _.get(data, 'birthday')
    const gender = _.get(data, 'gender') === '1' ? i18next.t('Male') : i18next.t('Female')
    const phone = _.get(data, 'phone')
    const address = _.get(data, 'address')
    const experience = _.get(data, 'experience')
    const language = _.get(data, 'language')
    const f_language = _.get(data, 'f_language')
    const relationship = _.get(data, 'relationship')
    const organisation = _.get(data, 'organisation')
    const card = _.get(data, 'card')
    const card_name = _.get(data, 'more_information.card_name')
    const card_type = _.get(data, 'more_information.card_type')
    const card_expried = _.get(data, 'more_information.card_expried')
    const is_verify = _.get(data, 'is_verify')

    return {
      avatar,
      fullname,
      shortcutname,
      gender: gender,
      birthday,
      phone,
      email,
      address,
      language,
      f_language,
      experience,
      businessCode,
      relationship,
      organisation,
      card,
      card_name,
      card_type,
      card_expried,
      is_verify
    }
  }

  async componentDidMount() {
  }

  componentDidAppear() {
    this.isEdit = true
    if (!this.didAppearFirst) {
      this.didAppearFirst = true
    }
  }

  componentDidDisappear() {

  }

  onPressBack = () => {
    backScreen(this.props.componentId)
  }

  generateParam = () => {
    const phone = this.state.phone
    const username = this.state.fullname
    const email = this.state.email
    const birthday = this.state.birthday
    const gender = this.state.gender === i18next.t('Male') ? '1' : '2'
    const address = this.state.address
    const experience = this.state.idExperience
    const card = this.state.businessCode
    const language = _.get(this.state, 'language.id')
    const f_language = _.map(this.state.f_language, 'id').join(', ')
    const relationship = this.state.relationship
    const organisation = this.state.organisation
    const website = this.state.website || ''
    // const experience = this.state.experience

    let data = {
      phone,
      username,
      birthday,
      gender,
      address,
      language,
      experience,
      card,
      f_language,
      relationship,
      organisation,
      website
    }
    return data
  }

  validateParam = (data) => {
    let message
    var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g
    if (data.phone !== '') {
      if (vnf_regex.test(data.phone) == false) {
        return i18next.t('InvalidPhoneNumber')
      }
    } else {
      return i18next.t('YouDidNotEnterAPhoneNumber')

    }
    return message
  }

  onPressEdit = () => {
    //Call api edit
    // const phone = this.state.phone
    // const username = this.state.fullname
    // const email = this.state.email
    // const birthday = this.state.birthday
    // const gender = this.state.gender === i18next.t('Male') ? '1' : '2'
    // const address = this.state.address
    // const experience = this.state.idExperience
    // const card = this.state.businessCode
    // const language = _.get(this.state, 'language.id')
    // const f_language = _.map(this.state.f_language, 'id').join(', ')
    // const relationship = this.state.relationship
    // const organisation = this.state.organisation
    // const website = this.state.website
    // // const experience = this.state.experience

    // let data = {
    //   phone,
    //   username,
    //   email,
    //   birthday,
    //   gender,
    //   address,
    //   language,
    //   experience,
    //   card,
    //   f_language,
    //   relationship,
    //   organisation,
    //   website
    // }
    const data = this.generateParam()
    const message = this.validateParam(data)

    // console.log('data ê đít', data);
    Loading.showHud()
    if (message) {
      Loading.hideHud()
      this.setState({ isEdit: false })
      Helper.showAlert('', message,
        [
          {
            text: 'OK', onPress: () => {
            }
          }
        ]
      )
      return
    } else {
      this.props.updateProfileInfo(data)
        .then(response => {
          Loading.hideHud()
          const message = _.get(response, 'data.message')
          if (message === 'Succes') {
            this.doGetMyInfo()
            backScreen(this.props.componentId)
          } else {
            Helper.showErrorAlert('', message)
            this.setState({ isEdit: false })
          }
        })
        .catch(error => {
          Loading.hideHud()
        });
    }
  }

  onSelectGenderPress = () => {
    const callback = (index, item) => {
      this.setState({ gender: item })
    }
    const data = [i18next.t('Male'), i18next.t('Female')]
    showRegisterSelectCard('', data, callback)
  }

  onSelectRelationship = () => {
    const callback = (index, item) => {
      this.setState({ relationship: item })
    }
    const data = [i18next.t('Married'), i18next.t('Dating'), i18next.t('Unclear')]
    showRegisterSelectCard('', data, callback)
  }

  formatDateToString = (date) => {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  onSelectDateOfBirthPress = async () => {
    if (Platform.OS === 'ios') {
      const callback = (newDate) => {
        this.setState({ birthday: this.formatDateToString(newDate) })
      }
      showDatePicker(this.state.birthday, callback)
    } else {
      try {
        const { action, year, month, day } = await DatePickerAndroid.open({
          date: new Date(),
          mode: 'calendar',
          maxDate: new Date()
        });
        if (action !== DatePickerAndroid.dismissedAction) {
          let newDate = new Date()
          newDate.setDate(day)
          newDate.setMonth(month)
          newDate.setFullYear(year)
          this.setState({ birthday: this.formatDateToString(newDate) })
          // console.log('birthay happy', this.state.birthday);
        }
      } catch ({ code, message }) {
        // console.log('can not open date picker', message)
      }
    }
  }

  onSelectMemberSincePress = () => {

  }

  onSelectExperiencePress = () => {
    const callback = (data) => {
      const experiences = data.map(item => {
        return item.value
      })
      const idExperience = data.map(item => {
        return item.id
      })
      this.setState({ idExperience: idExperience[0], experience: experiences[0] })
    }
    gotoSelectOptionsScreen(this.props.componentId, 'EXPERIENCE', callback)
  }

  onSelectLanguagePress = () => {
    const callback = (data) => {

      const language = {
        id: data[0].lang_id,
        name: data[0].name,
      }

      this.setState({ language })
    }


    const language = this.state.language
    const lang_id = [language.id]

    gotoSelectOptionsScreen(this.props.componentId, 'LANGUAGE', callback, false, lang_id)
  }

  onSelectOtherLanguagePress = () => {

    const callback = (data) => {

      const f_language = data.map(item => {
        return {
          id: item.lang_id,
          name: item.name,
        }
      })
      this.setState({
        f_language
      })
    }

    const f_language = this.state.f_language
    const lang_id = f_language.map(item => { return item.id })

    gotoSelectOptionsScreen(this.props.componentId, 'LANGUAGE', callback, true, lang_id)
  }

  onChangePhoneNumber = (value) => {
    this.setState({ phone: value })
  }

  onChangeEmail = (value) => {
    this.setState({ email: value })
  }

  onChangeWebsite = (value) => {
    this.setState({
      website: value
    })
  }

  onChangeOrganisation = (value) => {
    this.setState({
      organisation: value
    })
  }

  onChangeAddress = (value) => {
    this.setState({ address: value })
  }

  onchangeFullName = (value) => {
    this.setState({ fullname: value })
  }

  onChangeShorcutName = (value) => {
    this.setState({ shortcutname: value })
  }

  onChangeBusinessCode = (value) => {
    this.setState({ businessCode: value })
  }

  // onChangeRelationship = (value) => {
  //   this.setState({
  //     relationship: value
  //   })
  // }

  onChangeExperience = (value) => {
    // console.log(value, 'v --- a --- l- -u --e');
    this.setState({
      experience: value
    })
  }

  doGetMyInfo = async () => {
    this.props.getMyInfo()
      .then(data => {
        // console.log('tình trạng hôn nhân', data);
        const user_data = this.props.user.me
        const state_user = this.getDataFromProps(user_data)
        this.setState({
          refreshing: false,
          ...state_user
        })

      })
      .catch(error => {
      });
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.doGetMyInfo()
  }

  pullRefresh = () => {
    return (
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh}
      />
    )
  }

  getRelationship = () => {
    const relationship = _.get(this.state, 'relationship')
    return (
      <View style={styles.containView}>
        <Text style={styles.txtTitle}>{i18next.t('Relation')}</Text>
        <View style={styles.buttonRight}>
          <TouchableOpacity
            style={styles.buttonPopup}
            onPress={this.onSelectRelationship}
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
    console.log('- - - - - - - - day la props - - ', this.props);
    console.log('- - - - - - - - day la state - - ', this.state);
    const offset = (Platform.OS === 'android') ? -500 : 0;
    let relationship = this.state.relationship
    const { is_agent, card } = this.props.user.me || ''

    if (is_agent == "1") ProfileUser = i18next.t('Your_Profile')
    else ProfileUser = i18next.t('BusinessInformation')
    return (
      <View style={[styles.container]}>
        <HeaderView
          // title={i18next.t('InforAndContact')}
          title={i18next.t(ProfileUser)}
          tintColor={Colors.white}
          style={{ backgroundColor: Colors.green_1 }}
          back={true}
          onPressLeftBarButton={this.onPressBack}
          onPressRightBarButton={this.onPressEdit}
          titleRight={this.isEdit ? i18next.t('Done') : ''}
        />
        <KeyboardAvoidingView
          style={styles.container}
          behavior='padding' >
          <ScrollView
            style={{ flex: 1 }}
            refreshControl={this.pullRefresh()}>
            {/* <ProfileInfoHeaderView /> */}
            <ProfilePersonInfoView
              card={card}
              is_agent={is_agent}
              onSelectGenderPress={this.onSelectGenderPress}
              onSelectDateOfBirthPress={this.onSelectDateOfBirthPress}
              onSelectMemberSincePress={this.onSelectMemberSincePress}
              onSelectRelationship={this.onSelectRelationship}
              onChangeFullName={this.onchangeFullName}
              onChangeShorcutName={this.onChangeShorcutName}
              onChangeBusinessCode={this.onChangeBusinessCode}
              // onChangeRelationship={this.onChangeRelationship}
              getRelationship={this.getRelationship}
              onSelectExperiencePress={this.onSelectExperiencePress}
              fullname={this.state.fullname}
              card={this.state.card}
              shortcutname={this.state.shortcutname}
              businessCode={this.state.businessCode}
              birthday={this.state.birthday}
              gender={this.state.gender}
              relationship={this.state.relationship}
              experience={this.state.experience}
              isAgent={this.isAgent}
              style={{ flex: 1 }}
            />
            {this.isAgent == 1 && (
              <View style={styles.containView}>
                <Text style={styles.txtTitle}>{i18next.t('Relation')}</Text>
                <View style={styles.buttonRight}>
                  <TouchableOpacity
                    style={styles.buttonPopup}
                    onPress={this.onSelectRelationship}
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
              </View>
            )
            }

            <ProfileContactView
              phone={this.state.phone}
              email={this.state.email}
              address={this.state.address}
              organisation={this.state.organisation}
              website={this.props.user.me.website || ''}
              onChangePhoneNumber={this.onChangePhoneNumber}
              onChangeEmail={this.onChangeEmail}
              onChangeOrganisation={this.onChangeOrganisation}
              onChangeAddress={this.onChangeAddress}
              onChangeWebsite={this.onChangeWebsite}
              isAgent={this.isAgent}
              style={{ flex: 1 }}
            />
            {
              this.isAgent == '1' && (
                <ProfileCardInfomation
                  card={this.state.card}
                  card_name={this.state.card_name}
                  card_type={this.state.card_type}
                  card_expried={this.state.card_expried}
                  is_verify={this.state.is_verify}
                  isAgent={this.isAgent}
                  style={{ flex: 1 }}
                  componentId={this.props.componentId}
                />
              )
            }
            {
              this.isAgent === '1' && (
                <ProfileLanguageView
                  onSelectLanguagePress={this.onSelectLanguagePress}
                  onSelectExperiencePress={this.onSelectExperiencePress}
                  onSelectOtherLanguagePress={this.onSelectOtherLanguagePress}
                  language={this.state.language}
                  f_language={this.state.f_language}
                  experience={this.state.experience}
                  isAgent={this.isAgent}
                  style={{ flex: 1 }}
                />
              )
            }
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.light_gray_3,
  },
  containView: {
    // marginTop: 10,
    // flexDirection: 'row',
    //height: 36,
    // alignItems: 'center',
    flex: 1,
    // marginTop: 5,
    flexDirection: 'column',
    backgroundColor: Colors.white,
    // height: 250,
    borderWidth: 1,
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderLeftColor: '#ddd',
    borderRightColor: '#ddd',
    borderBottomColor: '#ddd',
    borderTopColor: Colors.white,
    borderBottomWidth: 0,
    marginLeft: 15,
    marginRight: 15,
    paddingBottom: 30,
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
  basicInfo: {
    // marginTop: 10,
    //marginLeft: 5,
    height: 50,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    alignItems: 'center',
  }
})
