import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, TouchableOpacity, Alert, Platform, FlatList, ScrollView, RefreshControl } from 'react-native';
import { Navigation } from 'react-native-navigation';
import {
  dimissModal, setRootToLoginScreen, setRootToLaunchScreen,
  pushToProfileInformation, pushToUserFriendList,
  pushToPostSavedList, pushToChangePassword, pushTourGuideLike,
  showActionSheet,
  // pushToWebview, 
  gotoCameraRollScreen,
  pushToGroup, pushToHomeGroup,
  pushToUserProfile,
  pushGallery,
  requestAddUserFriendList,
  pushToTermPolicy,
  pushInvitationtojointour,
  pushToAgentHome,
  nextScreenTrackingGuide,
  nextScreenTrackingAgent
} from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import CommonStyles from '../constants/styles'
import SearchBarView from './views/SearchBarView'
import SearchComponent from '../component/SearchComponent'
import DataManager from '../modules/DataManager'
import { i18next, Loading } from '../utils'
import _ from 'lodash'

const en = 'EN'
const vn = 'VN'
const TYPE_LANGUAGE = 'TYPE_LANGUAGE'

import ProfileHeaderView from './profile-info/ProfileHeaderView'
import ProfileItemView from './profile-info/ProfileItemView'
import Helper from '../utils/Helper';
import HeaderView from './views/HeaderView';
import UserManager from '../modules/UserManager';
import { getRequestAddMeFriend } from '../actions';

export default class ProfileComponent extends Component {

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
    const user_data = this.props.user.me
    const state_user = this.getDataFromProps(user_data)

    this.state = {
      isSearching: false,
      newAvatar: '',
      refreshing: false,
      titlel: '',
      ...state_user
    }
  }

  getDataFromProps = (data) => {

    const avatar = _.get(data, 'avatar')
    const fullname = _.get(data, 'username')
    const email = _.get(data, 'email')

    return {
      avatar,
      fullname,
      email,
    }
  }

  componentDidMount() {

  }

  componentDidAppear() {
    if (!this.didAppearFirst) {
      this.didAppearFirst = true
    }
  }

  componentDidDisappear() {

  }

  onPressLogout = () => {
    Helper.showAlert('', i18next.t('AreYouSureLogout'),
      [
        { text: i18next.t('Cancel'), onPress: null },
        { text: i18next.t('Ok'), onPress: this.clearDataAndLogout.bind(this) }
      ]
    )
  }


  onPressGroup = () => {
    pushToHomeGroup(this.props.componentId)
  }

  clearDataAndLogout = () => {
    this.props.logout()
      .then(response => {
        const message = _.get(response, 'data.message')
        const error = _.get(response, 'data[0].message')
        if (message === 'Succes') {
          setRootToLoginScreen()
          UserManager.logout()
          this.props.clearState()
        } else if (error) {
          Helper.showErrorAlert('', error)
        } else {
          Helper.showErrorAlert('', i18next.t('Error'))
        }
      })
      .catch(error => {
        Helper.showErrorAlert('', error)
      })
  }

  onPressDismissSearch = () => {
    this.setState({
      isSearching: false
    })
  }

  onPressSearch = () => {
    this.setState({
      isSearching: true
    })
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

    this.doUploadFile(photoUploading)
  }

  doUploadFile = (photoUploaded) => {
    // upload file
    // console.log("photo thay doi avatar", photoUploaded);
    Loading.showHud()
    this.props.uploadFile(photoUploaded)
      .then(data => {
        //console.log("data sau khi upload ảnh thành công", data);
        Loading.hideHud()
        if (data.path) {
          this.doUpdateProfile(data.path)
        }
      })
      .catch(error => {
        Loading.hideHud()
        Helper.showErrorAlert('', error)
      });
  }

  doUpdateProfile = (path) => {
    //Call api edit

    const avatar = path
    let data = {
      avatar
    }

    Loading.showHud()
    this.props.updateProfileInfo(data)
      .then(response => {
        // console.log("data update lại profile", response);
        Loading.hideHud()
        const message = _.get(response, 'data.message')
        if (message === 'Succes') {
          this.doGetMyInfo()
        } else {
          Helper.showErrorAlert('', message)
          this.setState({ isEdit: false })
        }
      })
      .catch(error => {
        Loading.hideHud()
        Helper.showErrorAlert('', error)
      });
  }

  onPressAvatarButton = () => {
    gotoCameraRollScreen(this.onPressCancelPhotos, this.onPressDonePhotos, { getOneImage: true })
  }

  onPressEditProfileButton = () => {
    pushToProfileInformation(this.props.componentId)
  }

  doGetMyInfo = async () => {
    this.props.getMyInfo()
      .then(data => {
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

  onPressBack = () => {
    dimissModal(this.props.componentId)
  }

  getHeaderView = () => {
    const show = _.get(this.props, 'options.show')
    if (show) {
      return (
        <HeaderView
          title={''}
          tintColor={Colors.white}
          style={{ backgroundColor: Colors.green_1 }}
          back={true}
          onPressLeftBarButton={this.onPressBack}
        />
      )
    } else {
      return (
        // <SearchBarView
        //   onPressSearch={this.onPressSearch}
        //   onPressCancel={this.onPressDismissSearch} 
        // />
        <HeaderView
          title={i18next.t('Profile')}
          tintColor={Colors.white}
          style={{ backgroundColor: Colors.green_1 }}
        // imageRight={Images.new_message}
        // back={true}
        // onPressRightBarButton={this.onPressBack}
        />
      )
    }
  }

  onPressUserFriendList = () => {
    pushToUserFriendList(this.props.componentId)
  }

  onPressRequestFriend = () => {
    requestAddUserFriendList(this.props.componentId)
    getRequestAddMeFriend()
  }
  onPressPostSavedList = () => {
    pushToPostSavedList(this.props.componentId)
  }
  onPressInvitationtojointour = () => {
    pushInvitationtojointour(this.props.componentId)
  }

  onPressChangePassword = () => {
    pushToChangePassword(this.props.componentId)
  }
  onPressNextTrackingGuide = (data) => {
    nextScreenTrackingGuide(this.props.componentId, { is_agent: data })
  }
  onPressNextTrackingAgent = () => {
    nextScreenTrackingAgent(this.props.componentId)
  }
  onPressTourGuideLike = (titlel) => {
    pushTourGuideLike(this.props.componentId, titlel)
  }
  onPressNameButton = () => {
    pushToUserProfile(this.props.componentId, this.props.user.me)
  }

  onPressLanguage = () => {
    const callback = (index) => {

      // accept
      if (index === 0) {
        i18next.changeLanguage('vn')
        DataManager.saveValue(vn, TYPE_LANGUAGE)
        // this.forceUpdate()
        setRootToLaunchScreen()
      } else {
        i18next.changeLanguage('en')
        DataManager.saveValue(en, TYPE_LANGUAGE)
        // this.forceUpdate()
        setRootToLaunchScreen()
      }

    }

    const buttons = [i18next.t('Vietnamese'), i18next.t('English')]
    showActionSheet(buttons, callback)
  }

  onPressSupport = () => {
    const callback = (index) => {
      let url = 'https://m.oneguide.com.vn/'
      let title = ''

      // HelpCenter
      if (index === 0) {
        title = i18next.t('HelpCenter')
        url = url + 'help-center'
      } else if (index === 1) {
        title = i18next.t('Tutorial')
        url = url + 'tutorial'
      } else if (index === 2) {
        title = i18next.t('Introduction')
        url = url + 'introduction'
      }

      const data = { url, title }
      // pushToWebview(this.props.componentId, data)
    }

    const buttons = [i18next.t('HelpCenter'), i18next.t('Tutorial'), i18next.t('Introduction')]
    showActionSheet(buttons, callback)
  }

  onPressPrivacy = () => {
    let url = 'https://m.oneguide.com.vn/privacy'
    let title = i18next.t('Privacy')

    const data = { url, title }
    // pushToWebview(this.props.componentId, data)
  }
  onPressGallery = () => {
    pushGallery(this.props.componentId);
  }

  onPressTermPolicy = () => {
    pushToTermPolicy(this.props.componentId)
  }

  changeAgent = () => {
    pushToAgentHome(this.props.componentId)
  }

  render() {
    // console.log('bowf roops profile component', this.props);
    let titlel = this.state.titlel
    const avatar = _.get(this.props, 'user.me.avatar')
    const username = _.get(this.props, 'user.me.username')
    const email = _.get(this.props, 'user.me.email')
    const card = _.get(this.props, 'user.me.card')
    const is_agent = _.get(this.props, 'user.me.is_agent')
    titlel = is_agent == '2' ? i18next.t('TheTourGuideLikes') : i18next.t('TravelCompanyFavorite')
    const is_verify = _.get(this.props, 'user.me.is_verify')
    // console.log("tai khoan dang nhap he thong", is_agent);
    const { isSearching } = this.state
    let titlelTracking = ''
    if (is_agent == "2") titlelTracking = "Agent tracking"
    else titlelTracking = "Guide tracking"
    return (
      <View style={[styles.container]}>
        {this.getHeaderView()}

        <View style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            refreshControl={this.pullRefresh()}>
            <ProfileHeaderView
              dataUserEmail={email}
              dataUserCard={card}
              style={{ height: 85, backgroundColor: Colors.white, borderBottomColor: '#DBE1DB', borderBottomWidth: 1 }}
              avatar={avatar}
              fullname={username === '' ? email : username}
              onPressAvatarButton={this.onPressAvatarButton}
              onPressEditProfileButton={this.onPressEditProfileButton}
              is_verify={is_verify}
              is_agent={is_agent}
              componentId={this.props.componentId}
              onPressNameButton={this.onPressNameButton}
              getMyInfo={this.props.getMyInfo}
            />
            {/* <ProfileItemView
              style={{ marginTop: 5 }}
              title={i18next.t('Saved')}
              image={Images.ic_bookmark}
              onPress={() => { this.onPressPostSavedList() }}
            /> */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 15, }}>
              <ProfileItemView
                style={styles.distanceItem}
                title={i18next.t('Friends')}
                image={Images.ic_friends}
                onPress={() => { this.onPressUserFriendList() }}
              />
              <ProfileItemView
                style={[styles.distanceItem, styles.ColorsImg]}
                title={i18next.t('inviteListFriend')}
                image={Images.invite_friend_end}
                onPress={() => { this.onPressRequestFriend() }}
              />
              <ProfileItemView
                style={styles.distanceItem}
                title={i18next.t('History')}
                image={Images.medical_history_end}
                onPress={() => { this.onPressNextTrackingGuide(is_agent) }}
              />
              {
                is_agent == 2 ?
                  null
                  :
                  <ProfileItemView
                    style={styles.distanceItem}
                    title={i18next.t('TourSystem')}
                    image={Images.ic_location_map}
                    onPress={() => { this.changeAgent() }}
                  />
              }

              {/* <ProfileItemView
              style={[styles.distanceItem, styles.ColorsImg]}
              title={i18next.t('Group')}
              image={Images.icon_group_}
              onPress={() => { this.onPressGroup() }}
            /> */}
              <ProfileItemView
                style={styles.distanceItem}
                title={i18next.t('Gallery')}
                image={Images.icon_collection}
                onPress={this.onPressGallery}
              />
              {/* <ProfileItemView
                style={styles.distanceItem}
                title={i18next.t(titlel)}
                image={Images.icon_heart}
                onPress={() => { this.onPressTourGuideLike(titlel) }}
              /> */}
              <ProfileItemView
                style={styles.distanceItem}
                title={i18next.t('Language')}
                image={Images.ic_language}
                onPress={this.onPressLanguage}
              />
              <ProfileItemView
                style={styles.distanceItem}
                title={i18next.t('ChangePassword')}
                image={Images.ic_key}
                onPress={() => { this.onPressChangePassword() }}
              />
              {/* {
              is_agent == 2 ?
                <ProfileItemView
                  style={styles.distanceItem}
                  title={i18next.t('trackKing hisstory guide')}
                  image={Images.ic_key}
                  onPress={() => { this.onPressNextTrackingAgent() }}
                />
                : */}


              {/* } */}
              <ProfileItemView
                style={styles.distanceItem}

                title={i18next.t('TermAndPolicy')}
                image={Images.ic_privacy_max}
                onPress={this.onPressTermPolicy}
              />
              <ProfileItemView
                style={styles.distanceItems}
                title={i18next.t('Logout')}
                image={Images.ic_logout}
                nextPress={false}
                onPress={() => { this.onPressLogout() }}
              />
            </View>
          </ScrollView>
          {
            isSearching &&
            <SearchComponent
              style={[CommonStyles.position_absolute_full]}
              onPressDismiss={this.onPressDismissSearch} />
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    //backgroundColor: Colors.light_gray_3
    backgroundColor: "#F2F8F8"
  },
  distanceItem: {
    // marginTop: 1
  },
  distanceItems: {
    width: '95%',
    flexDirection: 'row',

  },
  profile: {
    backgroundColor: Colors.white,
    marginTop: 8,
    flexDirection: 'column'
  },
  ColorsImg: {
    tintColor: 'red'
  }
})
