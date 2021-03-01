

import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text, View, Alert, Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  BackHandler,
  Dimensions,
}
  from 'react-native';
import { ReachabilityView, i18next, Loading } from '../utils'
import { gotoLoginScreen, gotoCardScreen, gotoSelectOptionsScreen, gotoCameraRollScreen, setRootToHomeScreen, setRootToLoginScreen } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import Fonts from '../constants/fonts'
import CommonStyles from '../constants/styles'
import HeaderView from './views/HeaderView'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import CardView from './setting-profile/CardView'
import ExperienceView from './setting-profile/ExperienceView'
import LanguageView from './setting-profile/LanguageView'
import PhoneNumberView from './setting-profile/PhoneNumberView'
import _ from 'lodash'
import Helper from '../utils/Helper'
import Device from '../modules/Device'

const initialLayout = {
  height: Device.screenSize().height,
  width: Device.screenSize().width,
};

const UploadStatus = {
  none: 'none',
  uploading: 'uploading',
  upload_success: 'upload_success',
  upload_fail: 'upload_fail',
}

const TabKey = {
  first: 'first',
  second: 'second',
  third: 'third',
  four: 'four'
}

export default class SettingProfileComponent extends Component {

  static options(passProps) {
    return {
      statusBar: {
        backgroundColor: 'transparent',
        visible: true,
        style: 'light'
      },
    };
  }

  state = {
    index: 0,
    headerTitle: i18next.t('AddYourTourGuide'),
    experience: '',
    language: '',
    uri: '',
    photos: '',
    routes: [
      { key: TabKey.first },
      { key: TabKey.second },
      { key: TabKey.third },
      { key: TabKey.four }
    ],
  };

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.onSelectLanguage = this.onSelectLanguage.bind(this)
    this.onSelectPhoneNumber = this.onSelectPhoneNumber.bind(this)
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onBackButtonPressed() {
  }

  touchOnStartButtonAction() {
    gotoCardScreen(this.props.componentId)
  }

  getHeaderTitle(index) {
    switch (index) {
      case 0: return i18next.t('AddYourTourGuide')
      case 1: return i18next.t('AddYourPhoneLanguage')
      case 2: return i18next.t('AddYourMainLanguage')
      case 3: return i18next.t('AddYourYearExperience')
    }
  }

  onSelectPhoneNumber = (phoneNumber) => {
    this.phoneNumber = phoneNumber
  }

  onSelectLanguage = () => {
    const callback = (data) => {
      const languages = data.map(item => {
        return item.name
      })

      const idLanguage = data.map(item => {
        return item.lang_id
      })
      this.idLanguage = idLanguage.join(',')
      this.setState({ language: languages.join(', ') })
    }
    gotoSelectOptionsScreen(this.props.componentId, 'LANGUAGE', callback, false)
  }

  onPressCancelPhotos = () => {
    return
  }

  onPressDonePhotos = (photos) => {
    if (photos.length === 0) {
      return
    }
    this.all_photos = _.cloneDeep(photos);
    let photoUploading = this.all_photos[0]
    photoUploading = { ...photoUploading, upload: UploadStatus.uploading }
    this.all_photos.splice(0, 1, photoUploading);


    this.setState({ uri: _.cloneDeep(photos)[0].uri })
  }

  onSelectNewCard = () => {
    gotoCameraRollScreen(this.onPressCancelPhotos, this.onPressDonePhotos, {})
  }

  onSelectExperience = () => {
    const callback = (data) => {
      const experiences = data.map(item => {
        return item.value
      })
      const idExperience = data.map(item => {
        return item.id
      })
      this.idExperience = idExperience.join(',')
      this.setState({ experience: experiences.join(',') })
    }
    gotoSelectOptionsScreen(this.props.componentId, 'EXPERIENCE', callback)
  }

  touchOnNextStepButtonAction() {
    switch (this.state.index) {
      case 0:
        if (this.state.uri === '') {
          Helper.showErrorAlert('', i18next.t('SelectAddCard'))
          return
        } else {
          this.onChangeTabIndex()
          return
        }
      case 1:
        if (!this.phoneNumber) {
          Helper.showErrorAlert('', i18next.t('AddPhoneNumberSetting'))
          return
        } else {
          this.onChangeTabIndex()
          return
        }
      case 2:
        if (!this.idLanguage) {
          Helper.showErrorAlert('', i18next.t('AddLanguageSetting'))
          return
        } else {
          this.onChangeTabIndex()
          return
        }
      case 3:
        if (this.state.experience === '') {
          Helper.showErrorAlert('', i18next.t('SelectExperience'))
          return
        } else {
          this.updateInfoLogin()
          return
        }
    }
  }

  validateAndGenerateParam = () => {
    const image_card = this.all_photos[0].uri
    const phone = this.phoneNumber
    const language = this.idLanguage
    const experience = this.idExperience

    // data
    let dataBody = {
      phone,
      language,
      experience
    }

    return dataBody
  }

  updateInfoLogin = () => {
    let dataBody = this.validateAndGenerateParam()
    dataBody = {
      ...dataBody,
    }

    Loading.showHud()
    this.props.updateInfo(this.all_photos[0], dataBody)
      .then(response => {
        Loading.hideHud()
        const status = _.get(response, 'status')
        const data = _.get(response, 'data')
        const message = _.get(response, 'data.messages')
        if (status === 200) {
          if (data !== '') {
            Helper.showErrorAlert('', message)
          } else {
            this.doGetMyInfo()
          }
        } else {
          Helper.showErrorAlert('', message)
        }
      })
      .catch(error => {
        Loading.hideHud()
        Helper.showErrorAlert('', i18next.t('SomethingWasWrong'));
      });
  }

  doGetMyInfo = () => {
    // request
    this.props.getMyInfo()
      .then(data => {
        Loading.hideHud()
        setRootToHomeScreen()
      })
      .catch(error => {
        Loading.hideHud()
      });
  }

  onChangeTabIndex() {
    if (this.state.index < 3) {
      this.setState({
        index: this.state.index + 1,
        headerTitle: this.getHeaderTitle(this.state.index + 1)
      })
    }
  }

  _handleIndexChange = index =>
    this.setState({
      index,
    });

  _renderTabBar = props => (
    <TabBar
      {...props}
      style={{ height: 0 }}
      indicatorStyle={{ backgroundColor: 'transparent' }}
    />
  );

  _renderScene = ({ route }) => {
    switch (route.key) {
      case TabKey.first:
        return (
          <CardView
            onSelectNewCard={this.onSelectNewCard}
            uri={this.state.uri}
          />
        );
      case TabKey.second:
        return (
          <PhoneNumberView
            onSelectPhoneNumber={this.onSelectPhoneNumber}
          />
        );
      case TabKey.third:
        return (
          <LanguageView
            onSelectLanguage={this.onSelectLanguage}
            language={this.state.language}
          />
        );
      case TabKey.four:
        return (
          <ExperienceView
            onSelectExperience={this.onSelectExperience}
            experience={this.state.experience}
          />
        );
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <HeaderView
          title={this.state.headerTitle}
          tintColor={Colors.white}
          style={{ backgroundColor: Colors.green_1 }}
        />

        <TabView
          navigationState={this.state}
          renderScene={this._renderScene}
          renderTabBar={this._renderTabBar}
          swipeEnabled={false}
          tabBarPosition='bottom'
          onIndexChange={this._handleIndexChange}
          initialLayout={initialLayout}
        />

        <TouchableOpacity
          style={styles.bottom_button}
          onPress={() => { this.touchOnNextStepButtonAction() }}>
          <Text style={styles.bottom_text}> {i18next.t('NextStep')} </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  bottom_button: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 70,
    left: 30,
    right: 30,
    borderRadius: 5,
    backgroundColor: Colors.green_1,
    height: 45
  },
  bottom_text: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    color: Colors.white
  },
});