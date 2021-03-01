import React, { Component } from 'react';
import {
  StyleSheet, View, StatusBar, Text, ScrollView,
  Image, Dimensions,
  RefreshControl, ActivityIndicator, Animated,
  Platform, Keyboard, TouchableOpacity, TextInput, Button, Alert, Linking,
  ImageBackground
} from 'react-native';
import { Navigation } from 'react-native-navigation';
// import ImagePicker from 'react-native-image-picker';
import {
  gotoChatScreen,
  backScreen,
  showActionSheet,
  pushToRatingInfo,
  showScreenPostTrip,
  ShowScreenMoreInfo,
  showModalPostCreate,
  gotoCameraRollScreen,
  pushToUserFriendList,
  pushToUserProfile,
  ShowScreenPublicProfile,
  viewPhoto,
  showMoreOptionsPost,
  showModalSharePostAsMessage,
  showModalSharePost,
  showSharePost,
  gotoPostDetail,
  pushListLocation,
  dimissModal
} from '../navigation';
import POST_TYPE from '../constants/post-types'
import _ from 'lodash';
import Images from '../assets/images'
import Colors from '../constants/colors'
import CommonStyles from '../constants/styles'
import { i18next, Loading } from '../utils'
import PostListComponent from './PostListComponent'
import PostCreateView from './post-views/PostCreateView'
import SearchComponent from './SearchComponent'
import SearchBarView from './views/SearchBarView'
import PostView from './../component/post-views/PostView'
import HeaderView from './views/HeaderView'
import UserNewfeedsComponent from './UserNewfeedsComponent'
import StringUtils from '../utils/StringUtils'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import DismissKeyboard from 'dismissKeyboard';
import Fonts from '../constants/fonts';
import PostCreateComponent from './PostCreateComponent'
import { FlatList } from 'react-native-gesture-handler';
import Helper from '../utils/Helper';

import { getRequestAddMeFriend, } from '../actions';

const HEADER_MAX_HEIGHT = 350;
const HEADER_MAX_HEIGHT_ME = 300;

// const options = {
//   title: 'Select Avatar',
//   customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
//   storageOptions: {
//     skipBackup: true,
//     path: 'images',
//   },
// };

// let isMe
class UserProfileComponent extends Component {

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
    // const user_data = this.props.user.me
    // const state_user = this.getDataFromProps(user_data)
    this.eventSubscription = Navigation.events().registerBottomTabSelectedListener(this.onPressBottomTab)
    //this.onPressBack = this.onPressBack.bind(this)
    this.handleRating = _.debounce(this.handleRatingInfo, 300, { leading: true, trailing: false })
    this.state = {
      tabview: {
        index: 0,
        routes: [
          { key: 'Newsfeed', title: 'Newsfeed' },
          // { key: 'Images', title: 'Images' },
          // { key: 'Tour', title: 'Tour' },
        ],
      },
      // scrollY: new Animated.Value(
      //   Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0,
      // ),
      other_user: null,
      //is_agent: props.data.is_agent
      listFriend: [],
      // ...state_user
      isEdit: false,
      backgroundImage: '',
      editIntro: true,
      textIntro: '',
      listFriendOtherUser: [],
      newfeeds: [],
      isLoadMore: true,
      refreshing: false,
      isMe: false
    }
    this.page = 1
  }



  componentDidMount() {
    const { user_id } = this.props.data || ""
    // const user_id = _.get(this.props, 'data.user_id') || ''
    setTimeout(() => {
      this.doGetPosts(this.page, user_id)
    }, 100);
    this.props.getUserFriendList(user_id, 1)
      .then(data => {

        const listFriend = data || []
        this.setState({
          listFriend
        })
      })
      .catch(error => {
      });
    // const { user_id } = this.props.data

    // this.props.getOtherUserInfo(user_id)
    //   .then(data => {

    //     const other_user = _.get(data, 'data.data.other_user')
    //     this.setState({
    //       other_user,
    //       isMe: true ? other_user.user_id == this.props.user.me.user_id : false
    //     })
    //   })
    //   .catch(error => {
    //   });
    this.doGetOtherUserInfo(user_id)

    this.props.getFriendListOtherUser(user_id)
      .then(data => {
        // console.log('qưertyuiodsfskjdfjndsfjkhsd', data);

        const listFriendOtherUser = data
        this.setState({ listFriendOtherUser })
      })
      .catch(error => {
      });
  }

  doGetOtherUserInfo = (user_id) => {
    console.log('mới chỉ chạy vào hàm thôi');
    if (this.props.user.me) {
      console.log('chạy vào if rồi', this.props.user);
      this.props.getOtherUserInfo(user_id)
        .then(data => {
          console.log(this.props, 'dataa người dùng khác và mình', data.data);
          const other_user = _.get(data, 'data.data.other_user')
          this.setState({
            other_user,
            isMe: true ? other_user.user_id == this.props.user.me.user_id : false
          })
        })
        .catch(error => {
        });
    }
  }

  doGetPosts = (page, user_id) => {

    // request
    // console.log('papapapapapapgegegegeg', page);
    this.props.getNewPostsOtherUser(page, user_id)
      .then(data => {
        // let newfeeds = data
        // newfeeds = _.map(newfeeds, (post) => {
        //   return {
        //     ...post,
        //     isLongText: StringUtils.isLongTextPost(post.content),
        //     showFull: false
        //   }
        // });
        let newfeeds = data

        // if (page !== 1) {
        //   const currentPosts = this.state.newfeeds
        //   newfeeds = _.concat(currentPosts, newfeeds)
        // }

        this.page = page + 1
        this.setState({
          newfeeds,
          refreshing: false,
          isLoadMore: false
        })
      })
      .catch(error => {
        this.setState({
          refreshing: false,
          isLoadMore: false
        })
      });
  }

  componentDidAppear() {

    if (!this.didAppearFirst) {
      this.didAppearFirst = true
      this.doGetOtherUserProfile()
    }
  }

  componentDidDisappear() {
  }

  componentWillUnmount() {
    this.eventSubscription.remove()
  }

  doGetOtherUserProfile = () => {

  }

  onPressBottomTab = ({ selectedTabIndex, unselectedTabIndex }) => {
    if (unselectedTabIndex === 0 &&
      selectedTabIndex === 0 &&
      this.refs.flatList) {
      this.refs.flatList.scrollToOffset({
        x: 0, y: 0,
        //  animated: true
      })
    }
  }

  onPressBack = () => {

    backScreen(this.props.componentId);
    dimissModal(this.props.componentId)
    getRequestAddMeFriend()
  }


  onPressFriend = () => {
    const follow = _.get(this.state.other_user, 'follow')
    const friend_type = _.get(this.state.other_user, 'friend.type')
    if (!friend_type) {
      return
    }

    if (friend_type === 'friend-decline' ||
      friend_type === 'decline') {
      return
    }

    if (friend_type === 'friend') {
      this.showRemove()
    } else if (friend_type === 'not-friend') {

      const type = 'friend-add'
      const user_id = _.get(this.state.other_user, 'user_id')
      const data = {
        user_id,
        type
      }

      this.doAddFriend(data)
      // if (follow === 'Follow') {
      //   return
      // }
      // this.onPressFollow()

    } else if (friend_type === 'friend-send') {
      this.showCancel(this.props.callBack)
    } else if (friend_type === 'friend-watting') {
      this.showAcceptOrDecline()
    }
    if (this.props.callBack && friend_type == "not-friend") {
      this.props.callBack()
    }

  }

  showAcceptOrDecline = () => {
    const callback = (index) => {
      let type = ''
      // accept
      if (index === 0) {
        type = 'friend-accept'
      } else {
        type = 'friend-decline'
      }

      // call api
      if (type) {
        const user_id = _.get(this.state.other_user, 'user_id')
        const data = {
          user_id,
          type
        }

        this.doAddFriend(data)
      }
    }
    const buttons = [i18next.t('Agree'), i18next.t('Decline')]
    showActionSheet(buttons, callback)
  }


  onPressImage = (index, photo) => {

    viewPhoto({ index, photo })
  }


  showRemove = () => {
    const callback = (index) => {
      let type = ''
      // accept
      if (index === 0) {
        type = 'friend-remove'
      }

      if (type) {
        const user_id = _.get(this.state.other_user, 'user_id')
        const data = {
          user_id,
          type
        }

        this.doAddFriend(data)
      }

    }
    const buttons = [i18next.t('RemoveFriend')]
    showActionSheet(buttons, callback)
  }

  showCancel = (callbackCancel) => {
    const callback = (index) => {
      let type = ''
      // accept
      if (index === 0) {
        type = 'friend-cancel'
      }

      if (type) {
        const user_id = _.get(this.state.other_user, 'user_id')
        const data = {
          user_id,
          type
        }

        this.doAddFriend(data)
        if (callbackCancel) {
          callbackCancel()
        }
      }

    }
    const buttons = [i18next.t('CancelRequest')]

    showActionSheet(buttons, callback)
  }

  onPressFavourite = () => {
    const user_id = _.get(this.state.other_user, 'user_id')
    const data = {
      user_id
    }
    this.doFavorite(data)

  }


  onPressFollow = () => {
    const follow = _.get(this.state.other_user, 'follow')

    if (!follow) {
      return
    }

    const type = (follow === 'Not Follow') ? 'follow' : 'unfollow'
    const user_id = _.get(this.state.other_user, 'user_id')
    const data = {
      user_id,
      type
    }

    this.doFollow(data)

  }

  onPressMessage = () => {
    const conversation_id = _.get(this.state.other_user, 'conversation_id')
    const user_id = _.get(this.state.other_user, 'user_id')
    const username = _.get(this.state.other_user, 'username')
    const room = {
      user_id,
      name_list: username,
      conversation_id
    }
    // console.log(' log chát screen_:__:_:_:_:_', room);
    gotoChatScreen(this.props.componentId, room)
  }

  doAddFriend = (data) => {
    // console.log(data, 'data bạn bè');
    this.props.addFriend(data)
      .then(response => {
        // console.log(response, 'response bạn bè');
        const status = _.get(response, 'status')
        const friend_type = _.get(response, 'type')

        if (status === 'RESULT_OK') {

          let type = ''
          let follow = null
          if (friend_type === 'friend-add') {
            type = 'friend-send'
          } else if (friend_type === 'friend-remove') {
            type = 'not-friend'
            follow = 'Not Follow'
          } else if (friend_type === 'friend-decline') {
            type = 'not-friend'
          } else if (friend_type === 'friend-cancel') {
            type = 'not-friend'
          } else if (friend_type === 'friend-accept') {
            type = 'friend'
            follow = 'Follow'
          }

          if (type) {
            const other_user = this.state.other_user
            other_user.friend = { type }
            other_user.follow = follow || other_user.follow
            this.setState({ other_user })
          }

        }


      })
      .catch(error => {
      });
  }

  onPressLeftBarButton = () => {
    DismissKeyboard()
    backScreen(this.props.componentId)
  }

  doFavorite = (data) => {
    this.props.doFavorite(data)
      .then(response => {
        const message = _.get(response, 'message')
        const status = _.get(response, 'status')

        if (message === 'Succes') {
          let favorite = 0
          if (status === 'liked') {
            favorite = 1
          }

          const other_user = this.state.other_user
          other_user.check_favourite = favorite

          this.setState({ other_user })
        }


      })
      .catch(error => {
      });
  }

  doFollow = (data) => {

    this.props.addFriend(data)
      .then(response => {

        const status = _.get(response, 'status')
        const type = _.get(response, 'type')

        if (status === 'RESULT_OK') {
          let follow = 'Not Follow'
          if (type === 'follow') {
            follow = 'Follow'
          }

          const other_user = this.state.other_user
          other_user.follow = follow
          this.setState({ other_user })
        }


      })
      .catch(error => {
      });
  }

  handleRatingInfo = () => {
    const { user_id } = this.props.data
    //check user_id Guide
    //if(Guide)
    const { componentId } = this.props
    pushToRatingInfo(componentId, this.props.data)
  }



  handleMoreInfo = () => {
    ShowScreenMoreInfo(this.props.componentId, { otherUser: this.state.other_user, isMe: this.state.isMe })
  }

  onPressScreenPost = () => {
    showModalPostCreate(null, null, this.props.createPostUserProfile)
    // this.doGetPosts()
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
    Loading.showHud()
    this.props.uploadFile(photoUploaded)
      .then(data => {
        Loading.hideHud()
        if (data.path) {
          this.doUpdateProfile(data.path)
        }
      })
      .catch(error => {
        Loading.hideHud()
      });
  }

  doUpdateProfile = (path) => {
    //Call api edit

    // const avatar = path
    let data = {
      avatar: path
    }

    Loading.showHud()
    this.props.updateProfileInfo(data)
      .then(response => {
        Loading.hideHud()
        const message = _.get(response, 'data.message')
        if (message === 'Succes') {
          this.doGetMyInfo()
        } else {
          // Helper.showErrorAlert('', message)
          this.setState({ isEdit: false })
        }
      })
      .catch(error => {
        Loading.hideHud()
        // console.log('erot upload profile', error);
        // Helper.showErrorAlert('', error)
      });
  }

  onPressButtonChangeAvatar = () => {
    gotoCameraRollScreen(this.onPressCancelPhotos, this.onPressDonePhotos, { getOneImage: true })
  }

  onPressDoneCover = (photos) => {
    if (photos.length === 0) {
      return
    }
    this.all_photos = _.cloneDeep(photos);

    let photoUploading = this.all_photos[0]

    this.doUploadFileCover(photoUploading)
  }
  doUploadFileCover = (photoUploaded) => {

    // upload file
    Loading.showHud()
    this.props.uploadFile(photoUploaded)
      .then(data => {

        Loading.hideHud()
        if (data.path) {
          this.doUpdateCoverImage(data.path)
        }
      })
      .catch(error => {
        Loading.hideHud()
      });
  }

  doUpdateCoverImage = (path) => {
    //Call api edit
    // const background = path
    let data = {
      background: path
    }

    Loading.showHud()
    this.props.updateProfileInfo(data)
      .then(response => {
        Loading.hideHud()
        const message = _.get(response, 'data.message')
        if (message === 'Succes') {
          this.doGetMyInfo()
        } else {
          // Helper.showErrorAlert('', message)
          this.setState({ isEdit: false })
        }
      })
      .catch(error => {
        Loading.hideHud()
        // Helper.showErrorAlert('', error)
      });
  }

  onPressButtonChangeImageCover = () => {
    gotoCameraRollScreen(this.onPressCancelPhotos, this.onPressDoneCover, { getOneImage: true })
  }


  onPressListFriend = () => {

    // let listFriend
    // if (this.state.listFriend) {
    //   listFriend = this.state.listFriend
    // }
    const user_id = this.props.data.user_id
    const isMe = this.state.isMe
    let listFriendOtherUser
    if (this.state.listFriendOtherUser) {
      listFriendOtherUser = this.state.listFriendOtherUser
    }
    let dataOther = {
      list_friends: this.state.listFriendOtherUser
    }

    let data = {
      list_friends: this.state.listFriend
    }

    let totalFriendUser
    if (isMe === true) {
      totalFriendUser = data
    }
    if (isMe === false) {
      totalFriendUser = dataOther
    }
    // console.log('tất cả bạn bè ở đây', totalFriendUser);
    pushToUserFriendList(this.props.componentId, { user_id })
  }

  onChangeImage = (buttonChange, styleButton) => {
    return (
      <TouchableOpacity
        onPress={buttonChange}
        style={styleButton}
      >
        <View
        // style={{ borderColor: 'red', borderWidth: 4 }}
        >
          <Image
            source={Images.camera}
            style={styles.change_avatar}
          />
        </View>
      </TouchableOpacity>
    )
  }

  onPressSaveIntro = () => {
    DismissKeyboard()
    let intro = this.state.textIntro
    let data = {
      intro
    }
    // console.log('data edit intro', data);
    Loading.showHud()
    this.props.updateProfileInfo(data)
      .then(response => {
        Loading.hideHud()
        const message = _.get(response, 'data.message')
        if (message === 'Succes') {
          this.doGetMyInfo()
          // backScreen(this.props.componentId)
        } else {
          Helper.showErrorAlert('', message)
          this.setState({ isEdit: false })
        }
      })
      .catch(error => {
        // console.log('error edit intro', error);
        Loading.hideHud()
      });
    this.setState({
      editIntro: true
    })
  }

  doGetMyInfo = async () => {
    this.props.getMyInfo()
      .then(data => {
        // console.log('data sau khi get', data);
        //const user_data = this.props.user.me
        const state_other = this.state.other_user
        state_other.avatar = data.avatar
        state_other.background = data.background,
          state_other.intro = data.intro,
          this.setState({
            other_user: state_other
          })

      })
      .catch(error => {
        // console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeee', error);
      });
  }

  onPressShowAvatar = () => {
    let avatar
    if (this.state.other_user) {
      avatar = this.state.other_user.avatar
    }
    let photo = {
      photos: [
        {
          path: avatar,
          width: 1000,
          height: 1000
        }
      ],
      total: 1
    }
    viewPhoto({ index: 0, photo })
  }

  onPressShowBackground = () => {
    let background
    if (this.state.other_user) {
      background = this.state.other_user.background
    }
    let photo = {
      photos: [
        {
          path: background,
          width: 1000,
          height: 1000
        }
      ],
      total: 1
    }
    viewPhoto({ index: 0, photo })
  }

  loadMore = () => {
    // console.log('có chạy vào hàm load thêm này');
    if (this.state.isLoadMore === true) {
      return
    }

    this.setState({ isLoadMore: true }, () => {
      this.doGetPosts(this.page, this.props.data.user_id)
    })
  }

  render() {
    // const { display_name } = this.props.data
    // console.log(this.props, "dât a::::::::::::::::::::::");
    const { isMe } = this.state
    // let isMe
    const { data } = this.props || {}
    const { me } = this.props.user || {}
    let checkDataUser, checkMeUser = ""
    if (data && data.user_id) checkDataUser = data.user_id
    if (me && me.user_id) checkMeUser = me.user_id
    // if (this.props.user) {
    //   //isMe = this.props.data.user_id === this.props.user.me.user_id
    //   isMe = checkDataUser === checkMeUser
    // }

    const statusBarHeight = Device.statusBarSize().height
    const topBarHeight = Device.topBarSize().height
    const screenWidth = Device.screenSize().width
    const screenHeight = Device.screenSize().height

    const HEADER_MIN_HEIGHT = statusBarHeight + topBarHeight
    const HEADER_HEIGHT = isMe ? HEADER_MAX_HEIGHT_ME : HEADER_MAX_HEIGHT
    const HEADER_SCROLL_DISTANCE = HEADER_HEIGHT - HEADER_MIN_HEIGHT;
    const newfeeds = this.state.newfeeds
    // const { newfeeds } = this.state
    const { refreshing } = this.state
    // const scrollY = Animated.add(
    //   this.state.scrollY,
    //   Platform.OS === 'ios' ? HEADER_HEIGHT : 0,
    // );

    return (
      <View style={{ flex: 1, background: "gray" }}>
        <HeaderView
          title='OneGuide'
          tintColor={Colors.white}
          style={{ backgroundColor: Colors.green_1 }}
          back={true}
          showBottomBorder={false}
          onPressLeftBarButton={this.onPressBack}
        />
        {/* <View
          style={{ height: 30, width: '100%', backgroundColor: Colors.green_1 }}
        >
        </View> */}
        <View style={[styles.container]}>

          <FlatList
            removeClippedSubviews={false}
            // onContentSizeChange={() => console.log('kéo đến cuối dùng')}
            ListHeaderComponent={this.renderScene}
            data={newfeeds}
            renderItem={this.renderItem}
            onEndReached={this.loadMore}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.pullRefresh}
              />
            }
            ListFooterComponent={this.renderBottom}
          />
        </View>
      </View>
    );
  }

  onPressTourLocation = (data) => {
    if (data.location) {
      const locations = data.location.split('-')
      pushListLocation(this.props.componentId, { locations })
    }

  }

  onPressApplyButton = (data) => {
    // console.log("data request tren trang ca nhân", data);
    const is_verify = _.get(this.props, 'user.me.is_verify');
    if (is_verify.toString() === "0") {
      Helper.showAlert('', i18next.t('NeedToVerify'),
        [
          { text: i18next.t(i18next.t('Cancelled')), onPress: null },
          { text: i18next.t(i18next.t('verify')), onPress: this.pushToAccountVerify }
        ])
      return;
    }
    if (is_verify.toString() === "2") {
      Helper.showAlert('', i18next.t('AccountWaitVerify'),
        [
          { text: i18next.t(i18next.t('OK')), onPress: null },
        ])
      return;
    }
    // console.log("data request apply len home", data);
    //  console.log("props tren HomePage", this.props);
    const user_id = this.props.user ? this.props.user.me.user_id : {}
    const user_id_create_tuor = data.user_id
    const comment_id = data.comment_id
    const is_agent = this.props.user ? this.props.user.me.is_agent : {}
    //check action apply tour

    if (user_id !== user_id_create_tuor) {
      const apply_type = data.apply ? data.apply.type : ''
      //   console.log("12345678908765", apply_type);
      if (data.check_apply == "Not permission" && is_agent == '2') {
        Helper.showAlert('', i18next.t('OnlyGuideIsAllowedToRegisterForTheTour'),
          [
            {
              text: i18next.t('Ok'),
              onPress: () => {

              },
              style: 'destructive'
            },
          ]
        )
      }

      if (data.check_apply == "Not permission" && is_agent == '1') {
        Helper.showAlert('', i18next.t('OnlyAgentsAreRegistered'),
          [
            {
              text: i18next.t('Ok'),
              onPress: () => {

              },
              style: 'destructive'
            },
          ]
        )
      }

      if (apply_type.toString() == '4') {
        Helper.showAlert('', i18next.t('YouHaveUnsubscribedFromThisTour'))
      }
      // const user_apply = _.get(data, 'comment.user_apply')
      if (apply_type.toString() == '2') {
        Helper.showAlert('', i18next.t('DoYouWantToCancelThisTour'),
          [
            {
              text: i18next.t('Ok'),
              onPress: () => {
                const data = {
                  comment_id,
                  action: 'guide-cancel'
                }
                this.doApplyPost(data)
              },
              style: 'destructive'
            },
            {
              text: i18next.t('No'), onPress: () => {
              },
            },
          ]
        )
      }
      if (apply_type.toString() == '0') {
        const data = {
          comment_id,
        }
        this.doApplyPost(data)
      }

    } else {
      showModalApplyList(this.props.componentId, { comment_id }, '')
    }
  }

  doApplyPost = (comment_id) => {

    Loading.showHud()

    // request
    this.props.applyTourProfile(comment_id)
      .then(data => {

        Loading.hideHud()

        if (data.error) {
          Helper.showAlert('', data.messages,
            [
              {
                text: 'OK', onPress: () => {
                }
              }
            ]
          )
        }
      })
      .catch(error => {
        Loading.hideHud()

        if (error) {
          Helper.showAlert('', error,
            [
              {
                text: 'OK', onPress: () => {
                }
              }
            ]
          )
        }

      });
  }

  renderBottom = () => {
    // const isLoadMore = this.state.isLoadMore
    // console.log(this.state.isLoadMore, "dfjgkdfjg");
    return (
      <View style={{ height: 40, justifyContent: 'center' }}>
        {this.state.isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
      </View>
    )
  }

  pullRefresh = () => {
    if (this.state.refreshing === true) {
      return
    }

    this.setState({ refreshing: true }, () => {
      this.doGetPosts(1, this.props.data.user_id)
    })
  }

  renderOtherButton(imageOpacity) {
    const friend_type = _.get(this.state.other_user, 'friend.type')
    const follow = _.get(this.state.other_user, 'follow')
    const favourite = _.get(this.state.other_user, 'check_favourite')


    let follow_color = Colors.gray
    let follow_title = i18next.t('Follow')
    if (follow === 'Not Follow') {
      follow_color = Colors.gray
    } else if (follow === 'Follow') {
      follow_color = Colors.blue
    }

    let favourite_color = favourite === 0 ? Colors.gray : Colors.blue
    let favourite_title = favourite === 0 ? i18next.t('Favourite') : i18next.t('QuitFavorite')
    let friend_icon = Images.ic_friend
    let friend_color = Colors.gray
    let friend_title = i18next.t('Friend')
    if (friend_type === 'friend') {
      friend_color = Colors.blue
      friend_title = i18next.t('Friend')

    } else if (friend_type === 'not-friend') {
      friend_title = i18next.t('AddFriend')
      friend_icon = Images.ic_add_friend

    } else if (friend_type === 'friend-send') {
      friend_color = Colors.blue
      friend_title = i18next.t('WaitingAccept')
      friend_icon = Images.ic_add_friend,
        follow_color = Colors.blue

    } else if (friend_type === 'friend-watting') {
      friend_icon = Images.ic_add_friend
      friend_title = i18next.t('AcceptFriend')

    } else if (friend_type === 'friend-decline') {
      friend_icon = Images.ic_add_friend
      friend_title = i18next.t('FriendDecline')

    } else if (friend_type === 'decline') {
      friend_icon = Images.ic_add_friend
      friend_title = i18next.t('DeclineFriend')
    }

    return (
      <View
        style={
          // styles.other_button,  opacity: imageOpacity 
          styles.view_other_tab
        }>
        <TouchableOpacity
          onPress={this.onPressFriend}
          style={[CommonStyles.center, styles.button_tab, { flexDirection: 'column' }]}>
          <Image
            style={{ width: 20, height: 20, alignSelf: 'center', marginTop: 4, tintColor: friend_color }}
            resizeMode='contain'
            source={friend_icon}>
          </Image>
          <Text
            style={{ color: friend_color, fontSize: 14, marginTop: 5, textAlign: 'center' }}
          >{friend_title}</Text>
        </TouchableOpacity>
        {/* Tạm đóng yêu thích */}
        {/* <TouchableOpacity
          onPress={this.onPressFavourite}
          style={[CommonStyles.center, styles.button_tab, { flexDirection: 'column' }]}>
          <Image
            style={{ width: 20, height: 20, alignSelf: 'center', marginTop: 4, tintColor: favourite_color }}
            resizeMode='contain'
            source={Images.ic_star_yellow}>
          </Image>
          <Text
            style={{ color: favourite_color, fontSize: 14, marginTop: 5, textAlign: 'center' }}
          >{favourite_title}</Text>
        </TouchableOpacity> */}
        {/* Tạm đóng yêu thích */}
        <TouchableOpacity
          onPress={this.onPressFollow}
          style={[CommonStyles.center, styles.button_tab, { flexDirection: 'column' }]}>
          <Image
            style={{ width: 20, height: 20, alignSelf: 'center', marginTop: 4, tintColor: follow_color }}
            resizeMode='contain'
            source={Images.ic_follow}>
          </Image>
          <Text
            style={{ fontSize: 14, marginTop: 5, textAlign: 'center', color: follow_color }}
          >{follow_title}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.onPressMessage}
          style={[CommonStyles.center, styles.button_tab, { flexDirection: 'column' }]}>
          <Image
            style={{ width: 20, height: 20, alignSelf: 'center', marginTop: 4, tintColor: Colors.blue }}
            resizeMode='contain'
            source={Images.tabbar_inbox}>
          </Image>
          <Text
            style={{ color: Colors.blue, fontSize: 14, marginTop: 5, textAlign: 'center' }}
          >{i18next.t('Message')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderTabsButton() {
    return (
      <View
        style={[CommonStyles.position_absolute_bottom, styles.view_button_tab]}>
        <TouchableOpacity
          onPress={() => {
            const tabview = { ...this.state.tabview, index: 0 }
            this.setState({ tabview })
          }}
          style={[CommonStyles.center, styles.button_tab]}>
          <Text
            style={styles.text_button_tab}
          >{i18next.t('Newsfeed')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            const tabview = { ...this.state.tabview, index: 1 }
            this.setState({ tabview })
          }}
          style={[CommonStyles.center, styles.button_tab]}>
          <Text
            style={styles.text_button_tab}
          >{i18next.t('Image')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            const tabview = { ...this.state.tabview, index: 2 }
            this.setState({ tabview })
          }}
          style={[CommonStyles.center, styles.button_tab]}>
          <Text
            style={styles.text_button_tab}
          >{i18next.t('Tour')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  onPressLikeButton = (comment_id) => {
    this.doLikeComment(comment_id)
  }

  doLikeComment = (comment_id) => {

    // request
    this.props.likenewfeedOther(comment_id)
      .then(data => {
        // console.log('da    tâ', data);
        this.setState({
          newfeeds: data
        })
      })
      .catch(error => {
      });
  }

  onPressMoreOptionsButton = (comment) => {
    const callback = (type) => {

      if (type === 'edit') {
        showModalPostCreate(type, comment.comment_id)
      } else if (type === 'delete') {
        this.showAlertDeletePost(comment)
      }
    }

    const user_me = _.get(this.props, 'user.me')
    showMoreOptionsPost(comment, user_me, callback)
  }

  showAlertDeletePost = (comment) => {
    Helper.showAlert('', i18next.t('AreYouSureDeletePost'),
      [
        { text: i18next.t('Cancel'), onPress: null },
        {
          text: i18next.t('Ok'), onPress: () => {
            this.setState({ showOptions: false },
              () => {
                const comment_id = _.get(comment, 'comment_id')
                this.doDeleteComment(comment_id)
              })
          }
        }
      ]
    )
  }

  doDeleteComment = (comment_id) => {
    Loading.showHud()

    // request
    this.props.deletePostProfile(comment_id)
      .then(data => {
        this.setState({
          newfeeds: data
        })
        Loading.hideHud()
      })
      .catch(error => {
        Loading.hideHud()
      });
  }

  onPressShareButton = (comment) => {
    const callback = (type) => {
      if (type === 'WRITE_POST') {
        showModalSharePost(comment)
      } else if (type === 'SEND_AS_MESSAGE') {
        showModalSharePostAsMessage(comment)
      }

    }

    const user_me = _.get(this.props, 'user.me')
    showSharePost(comment, user_me, callback)

  }

  setNewDataNewfeeds = (data) => {
    this.setState({
      newfeeds: data,
    })
  }

  onPressCommentButton = (data, isComment) => {
    gotoPostDetail(this.props.componentId, { ...data, createCommentProfile: this.props.createCommentProfile, likeButtonUserProfile: true, setNewDataNewfeeds: this.setNewDataNewfeeds }, { showKeyboard: isComment })
  }

  onPressSharePostButton = (data) => {
    gotoPostDetail(this.props.componentId, { comment: data })
  }

  goToGroup = (data) => {
    // console.log('go to group', data);
    if (data.check_user == 'no') {
      pushInformationGroup(this.props.parentComponentId, {
        passProps: data
      })
    } else
      if (data.check_user == 'yes') {
        pushToGroup(this.props.parentComponentId, {
          passProps: data
        })
      }
  }

  renderItem = (item, index) => {
    console.log('item newfeed', item);
    const newfeeds = { index, comment: item.item }
    // const { isLoadMore } = this.state
    // const { contentInset, contentOffset } = this.props
    const user_id = _.get(this.props, 'user.me') ? _.get(this.props, 'user.me.user_id') : ''
    const isMe = this.state.isMe
    const user = _.get(this.props, 'user')
    // const avatar = this.props.data.avatar
    return (
      <View
        style={{ borderTopColor: "#F3EEED", borderTopWidth: 5 }}
      // style={isMe ? null : 5 { marginTop: 220 }} 
      >
        <PostView
          parentComponentId={this.props.componentId}
          data={newfeeds}
          isMe={isMe}
          user={user}
          // extraData={{ avatar: '' }}
          // refreshing={false}
          // pullRefresh={this.pullRefresh}
          // loadMore={this.loadMore}
          // isLoadMore={isLoadMore}
          onPressLikeButton={this.onPressLikeButton}
          onPressMoreOptionsButton={this.onPressMoreOptionsButton}
          onPressShareButton={this.onPressShareButton}
          onPressCommentButton={this.onPressCommentButton}
          // onScroll={this.props.onScroll}
          // avatar={avatar}
          onPressApplyButton={this.onPressApplyButton}
          onPressTourLocation={this.onPressTourLocation}
          onPressSharePostButton={this.onPressSharePostButton}
          getInfomationGroup={this.props.getInfomationGroup}
          goToGroup={this.goToGroup}
          onPressImage={this.onPressImage}
        />
      </View>
    )
  }

  onPressCreatePost = (type) => {

    const is_verify = _.get(this.props, 'user.me.is_verify');
    if (is_verify.toString() === "0" && (type === POST_TYPE.GUIDE || type === POST_TYPE.TOUR)) {
      Helper.showAlert('', i18next.t('NeedToVerify'),
        [
          { text: i18next.t(i18next.t('Cancelled')), onPress: null },
          { text: i18next.t(i18next.t('verify')), onPress: this.pushToAccountVerify }
        ])
      return;
    }
    if (is_verify.toString() === "2" && (type === POST_TYPE.GUIDE || type === POST_TYPE.TOUR)) {
      Helper.showAlert('', i18next.t('AccountWaitVerify'),
        [
          { text: i18next.t(i18next.t('OK')), onPress: null },
        ])
      return;
    }
    showModalPostCreate(type, null, null,
      // this.props.listdata.passProps.id
    )
  }



  renderScene = ({ route }) => {
    const { other_user } = this.state || {}
    const { user } = this.props || {}
    const is_agent = other_user && other_user.is_agent ? other_user.is_agent : null
    const background = other_user && other_user.background ? other_user.background : null
    const avatar = other_user && other_user.avatar ? other_user.avatar : null
    const rating = other_user && other_user.rating ? other_user.rating : 0
    const total_rating = other_user && other_user.total_rating ? other_user.total_rating : 0
    const isMe = this.state.isMe
    const username = other_user && other_user.username ? other_user.username : null
    const birthday = other_user && other_user.birthday ? other_user.birthday : null
    // const other_user = this.state.other_user?
    const statusBarHeight = Device.statusBarSize().height
    // const topBarHeight = Device.topBarSize().height
    // console.log('avatar state other', avatar);

    let checkTotalfriends = ""
    if (other_user && other_user.totalfriends) {
      checkTotalfriends = other_user.totalfriends
    }
    let privacyFriend = ""
    if (other_user && other_user.check_privacy_friend) {
      privacyFriend = other_user.check_privacy_friend
    }
    let me = {};
    if (user && user.me) {
      me = user.me
    }

    // totalfriend
    let totalCheckFriends = ''
    if (me && me.totalfriends) {
      totalCheckFriends = me.totalfriends
    }

    let totalfriends = ''
    if (other_user && other_user.totalfriends) {
      totalfriends = other_user.totalfriends
    }
    let typeFriend = ''
    if (other_user && other_user.friend && other_user.friend.type) {
      typeFriend = other_user.friend.type
    }

    let total_friend_user
    if (isMe) {
      total_friend_user = totalCheckFriends
    } else {
      total_friend_user = totalfriends
    }

    let publicFriend
    if (isMe === true) {
      publicFriend = true

    }
    if (isMe === false) {
      if (privacyFriend === 'me') {
        publicFriend = false
      }
      if (privacyFriend === 'friends') {
        if (typeFriend === 'not-friend') {
          publicFriend = false
        }
        if (typeFriend === "friend-send") {
          publicFriend = false
        }
        if (typeFriend === 'friend') {
          publicFriend = true
        }
      }
      if (privacyFriend === 'public') {
        publicFriend = true
      }
    }
    let address, company = ""
    // let experience
    if (isMe) {
      address = me.address
    } else if (!isMe) {
      if (other_user && other_user.address) {
        address = other_user.address
      }
    }

    if (isMe) {
      company = me.organisation
    } else if (!isMe) {
      if (other_user && other_user.company)
        company = other_user.company
    }
    // if (other_user && other_user.company)
    //   company = other_user.company
    // experience = this.state.other_user.experience


    let emailUser
    if (isMe) {
      if (is_agent === '1') {
        emailUser = me.email
      }
      if (is_agent === '2') {
        emailUser = me.website
      }
    }
    else {
      if (is_agent === '1') {
        emailUser = this.state.other_user.email
      }
      if (is_agent === '2') {
        emailUser = this.state.other_user.website
      }
    }
    let introUser
    if (isMe === true) {
      if (this.state.other_user) {
        introUser = this.state.other_user.intro
      }
      if (me.intro === null || me.intro === '') {
        introUser = 'Thêm thông tin mô tả về trang cá nhân'
      }
    }

    if (isMe === false) {
      if (this.state.other_user) {
        introUser = this.state.other_user.intro
      }
      if (!this.state.other_user) {
        introUser = ''
      }
    }
    let listFriendUser = []
    if (this.state.other_user && this.state.listFriend) {
      for (let index = 0; index <= 5; index++) {
        let list_friends = this.state.listFriend[index]
        listFriendUser.push(
          list_friends
        )
      }
    }

    // console.log('`````````````````````````````````', other_user);

    let experience
    if (isMe) {
      if (is_agent == 1) {
        experience = me.experience
      }
      if (is_agent == 2) {
        experience = me.birthday
      }
    }
    if (isMe == false) {
      if (is_agent == 1) {
        experience = other_user.experience
      }
      if (is_agent == 2) {
        experience = other_user.birthday
      }
    }

    let filterListFriend = listFriendUser.filter(function (friend) {
      return friend != null;
    });
    let friendItem = []
    if (filterListFriend) {
      friendItem = filterListFriend.map((friend, key) => {

        return (
          <TouchableOpacity
            key={key}
            style={styles.view_avatar_friend}
            onPress={() => { pushToUserProfile(this.props.componentId, friend) }}
          >
            <View style={{
              alignItems: "center"
              // height: 90, position: 'relative' 
            }}>
              <Image
                style={styles.avatar_friend}
                source={{ uri: friend.avatar }}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{
                color: 'black',
                fontSize: 14,
                // fontWeight: "400",
                paddingBottom: 5,
                paddingTop: 5,
                paddingLeft: 10,
                paddingRight: 10
                //  padding: 10,
                // borderTopWidth: 1,
                //  borderTopColor: '#F3EEED'
              }}>
                {friend.display_name}
              </Text></View>

          </TouchableOpacity>
        )
      })
    }
    // switch (route.key) {
    //   case 'Newsfeed':
    return (
      <View
        style={isMe ? null : {
          // marginBottom: 270
        }}
      >
        <View style={{
          flex: 1,
          height: 210,
          position: 'relative',
        }}>
          <TouchableOpacity
            onPress={this.onPressShowBackground}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 170
            }}
          >
            {/* // </TouchableOpacity> */}
            <ImageBackground
              style={styles.image_cover}
              source={{ uri: background }}
            >
              {/* 
                </ImageBackground> */}
              <View style={{
                justifyContent: 'center',
                flex: 1,
              }}>
                <View style={[styles.button_bar, { left: 0 }]}>
                  {
                    is_agent === '1'
                      ?
                      <Image
                        source={Images.logo_flag_header}
                        style={styles.image_guide} />
                      :
                      null
                  }
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
          {
            isMe ? this.onChangeImage(this.onPressButtonChangeImageCover, styles.view_change_cover) : <View style={styles.view_noChange_coverFriend}></View>
          }

          <View
            style={{ flex: 1 }}
            style={{
              bottom: -115,
              width: 130,
              height: 130,
              position: 'absolute',
              position: 'relative',
              marginLeft: 10,
              flexDirection: 'row'
            }}
          >
            <TouchableOpacity
              onPress={this.onPressShowAvatar}
            >
              {/* cccc */}
              <Image
                style={styles.image_avatar}
                source={{ uri: avatar }}
              />
              <View style={{ position: 'absolute', right: 0, bottom: 0 }}>
                {
                  isMe ? this.onChangeImage(this.onPressButtonChangeAvatar, styles.view_change_avatar) : <View style={styles.view_noChange_avatarFriend}></View>
                }
              </View>
            </TouchableOpacity>

          </View>
        </View>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <View
            style={{
              marginLeft: 160,
              marginHorizontal: 5,
              marginBottom: 10,
              paddingBottom: 5
            }}
          >
            <Text
              style={styles.text_title}>
              {username}
            </Text>
            <View style={{
              paddingTop: 5
            }}>
              <Text style={{ fontSize: 12, color: "#B2BABB" }}>{is_agent == '1' ? i18next.t('InforAndContact') : i18next.t('BusinessInformation')} </Text>
            </View>
            <TouchableOpacity
              onPress={this.handleRating}
              style={{
                flexDirection: 'row',
                marginTop: 5,
                borderRadius: 13,
                alignItems: 'center'
              }}
            >
              <Image style={{ width: 15, height: 15, marginRight: 5 }} source={Images.ic_star_yellow}>
              </Image>
              <Text
                style={{
                  color: '#3498DB',
                  fontSize: 14,
                  fontWeight: "500",

                }}>
                {rating}
              </Text>
              <View
                onPress={this.handleRating}
                style={{
                  marginLeft: 5,
                  backgroundColor: "#DEEEFF",
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text
                  style={{
                    color: '#3498DB',
                    fontSize: 14,
                    fontWeight: "500",
                    textAlign: 'center'
                  }}
                >
                  {total_rating}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {!isMe ? <View style={{ flex: 1, height: 0.5, backgroundColor: '#CCD1D1' }}></View> : null}
        {
          !isMe && (
            this.renderOtherButton())
        }
        <View style={styles.view_info}>
          {address ? (
            <View style={styles.info}>
              <Image resizeMode='contain'
                source={Images.tabbar_home}
                style={styles.icon_info}
              />
              <View>
                <Text style={styles.text_info}>{is_agent == 1 ? i18next.t('LiveAt') : 'Địa chỉ'} <Text style={styles.text_info_last}>{address}</Text>
                </Text>
              </View>

            </View>) : <View></View>
          }

          {company
            ?
            <View style={styles.info}>
              <Image resizeMode='contain'
                source={Images.company_icon}
                style={styles.icon_info}
              />
              <View>
                <Text style={styles.text_info}>{is_agent === '1' ? i18next.t('WorkAt') : i18next.t('CompanyName')} <Text style={styles.text_info_last}> {company}</Text>
                </Text></View>
            </View>
            : null
          }
          {experience && experience > 0
            ?
            <View style={styles.info}>
              <Image resizeMode="contain"
                source={Images.tour_experience}
                style={styles.icon_info}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.text_info}>{is_agent === '1' ? i18next.t('Experience') : i18next.t('DateRaning')} <Text style={styles.text_info_last}>{is_agent == 1 ? `${experience} năm` : experience}</Text>
                </Text>

              </View>



            </View>
            :
            null
          }
          {
            emailUser
              ?
              <View style={styles.info}>
                <Image resizeMode='contain'
                  source={Images.link_icon}
                  style={styles.icon_info}
                />
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      if (is_agent == 2) {
                        Linking.openURL(`${emailUser}`)
                      }
                      if (is_agent == 1) {
                        return
                      }
                    }}>
                    <Text style={styles.text_info}>{emailUser}</Text>
                  </TouchableOpacity>
                </View>

              </View>
              : null
          }
          {is_agent == 1 && (
            <TouchableOpacity
              onPress={this.handleMoreInfo}
            >
              <View style={styles.info}>
                <Image
                  source={Images.more_icon}
                  style={styles.icon_more}
                />
                <Text style={styles.text_info}>{i18next.t('SeeMoreIntroductoryInformation')}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View style={
          styles.friendsView

        }>
          <>
            {
              total_friend_user && total_friend_user > 0
                ?
                <View style={styles.view_friend} >
                  <View
                    style={{ marginBottom: 3 }}
                  >
                    <Text style={styles.friend} >{i18next.t('Friends')}</Text>
                  </View>

                  <Text style={styles.list_friend} >{isMe ? `${totalCheckFriends} ${i18next.t('PeopleFriend')}` : `${totalfriends} ${i18next.t('PeopleFriend')}`}</Text>
                </View>
                :
                null
            }
          </>
          {

            total_friend_user && total_friend_user > 0
              ?
              <View>
                <View style={friendItem.length < 3 ? styles.viewlistfriend : styles.viewlistfriendlength}>

                  {/* kiểm tra */}
                  {friendItem}
                </View>
                <View
                  style={{
                    marginTop: 10,
                  }}
                >
                  {/* {
                    friendItem.length <= 6 ?
                      null
                      : */}

                  <TouchableOpacity
                    style={{
                      backgroundColor: "#F2F3F4",
                      borderRadius: 5,
                      alignItems: 'center',
                      marginTop: 10,
                      marginLeft: 10,
                      marginRight: 10,
                    }}
                    onPress={this.onPressListFriend}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '400',
                        paddingTop: 6,
                        paddingBottom: 6,

                        color: "#1B2631"
                      }}
                    >
                      {i18next.t('SeeMoreFriends')}
                    </Text>
                  </TouchableOpacity>
                  {/* } */}
                </View>
              </View>
              :
              null
          }
        </View>
        {
          isMe ?
            <View style={{
              marginTop: 10
            }}>
              <Text style={{ fontWeight: '500', color: Colors.black_1, fontSize: 16, margin: 10 }}>{i18next.t('post')}</Text>
              <View style={{ flex: 1, height: 0.5, backgroundColor: Colors.light_gray_1, marginBottom: 5 }}></View>
              <View style={{ marginTop: 5, marginBottom: 5 }}
              >
                <PostCreateView
                  componentId={this.props.componentId}
                  isMe={isMe}
                  isAgent={me.is_agent}
                  onPressCreatePost={this.onPressCreatePost}
                  postUserProfile={true}
                  avatar={me.avatar}
                />
              </View>
            </View>
            : null
        }
      </View>
    );
  }
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    margin: 5
  },
  fill: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.green_1,
    overflow: 'hidden',
  },
  image_cover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 200,
    resizeMode: 'cover',
    backgroundColor: Colors.gray,
    overflow: 'hidden',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7
  },
  image_avatar: {
    width: 130,
    height: 130,
    resizeMode: 'cover',
    backgroundColor: 'transparent',
    borderRadius: 65,
    borderWidth: 2,
    borderColor: '#fff',
  },
  view_change_avatar: {
    width: 30,
    height: 30,
    alignItems: "center",
    backgroundColor: Colors.gray_4,
    position: "absolute",
    bottom: 10,
    right: 10,
    borderRadius: 20
  },
  view_noChange_avatarFriend: {
    width: 30,
    height: 30,
    alignItems: "center",
    position: "relative",
    top: 70,
    left: '80%',
  },
  view_change_cover: {
    alignSelf: 'flex-end',
    width: 30,
    height: 30,
    backgroundColor: Colors.gray_4,
    borderRadius: 20,
    marginRight: 10,
    right: 10,
    bottom: -160
  },
  view_noChange_coverFriend: {
    alignSelf: 'flex-end',
    width: 30,
    height: 30,
    marginRight: 10,
    top: -30
  },
  change_avatar: {
    width: 20,
    height: 20,
    tintColor: 'white',
    alignSelf: 'center',
    margin: 5
  },
  text_info: {
    color: Colors.black_1,
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 3
  },
  text_info_last: {
    color: Colors.black_1,
    fontSize: 15,
    fontWeight: '500',
  },
  view_info: {
    borderTopColor: '#DDDDDD',
    borderTopWidth: 1,
    marginBottom: 15
  },
  icon_info: {
    marginTop: 6,
    tintColor: Colors.gray_2,
    width: 19,
    height: 19,
  },
  icon_more: {
    alignSelf: 'center'
  },
  info: {
    flexDirection: 'row',
    marginTop: 10,
    paddingRight: 10,
    marginLeft: 8,


  },
  view_friend: {
    flexDirection: 'column',
    marginBottom: 10
  },
  friend: {
    color: Colors.black_1,
    fontWeight: "500",
    fontSize: 16,
    marginLeft: 8
  },
  list_friend: {
    color: '#4F4F4F',
    fontSize: 14,
    marginLeft: 8
  },
  avatar_friend: {
    height: 90,
    width: 90,

    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    resizeMode: "cover",
    borderRadius: 6
  },
  view_avatar_friend: {
    width: '32%',
    marginTop: 5,
    flexDirection: 'column',
  },
  text_button_post: {
    fontSize: 16,
    color: Colors.gray_1,
  },
  button_post: {
    flexDirection: 'row',
    marginTop: 10,
    flex: 1,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#DDDDDD',
    paddingRight: 5,
    paddingLeft: 5,
    width: '30%'
  },
  button_post_right: {
    flexDirection: 'row',
    marginTop: 10,
    flex: 1,
    justifyContent: 'center',
    paddingRight: 5,
    paddingLeft: 5,
    width: 150
  },
  icon_post: {
    alignSelf: 'center',
    marginRight: 5
  },
  bar: {
    backgroundColor: 'transparent',
    marginTop: Platform.OS === 'ios' ? 28 : 38,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    color: 'white',
    fontSize: 18,
  },
  // scrollViewContent: {
  //   // iOS uses content inset, which acts like padding.
  //   paddingTop: Platform.OS !== 'ios' ? HEADER_MAX_HEIGHT : 0,
  // },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  view_button_tab: {
    height: 40,
    flexDirection: 'row'
  },
  view_other_tab: {
    marginVertical: 10,
    // height: 60,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    // marginTop: 15
  },
  text_button_tab: {
    color: Colors.red,
    fontSize: 14
  },
  button_tab: {
    flex: 1
  },
  text_title: {
    color: Colors.black,
    fontSize: 18,
    fontWeight: "700",

  },
  more_title: {
    textAlign: 'center',
    color: Colors.black,
    fontSize: 13,
    marginBottom: 10,
    writingDirection: "rtl"
  },
  rating_title: {
    alignSelf: 'center',
    color: Colors.white,
    fontSize: 14,
    top: 6
  },
  other_button: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: Colors.white
  },
  button_bar: {
    position: 'absolute',
    top: 2,
    height: 40,
    zIndex: 2,
  },
  image_guide: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 10,
    width: 30,
    height: 30,
    borderRadius: 15
  },
  image_bar: {
    alignSelf: 'flex-start',
    tintColor: Colors.white,
    marginTop: 10,
    width: 30,
    height: 30
  },
  textSaveUser: {
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 2,
    borderColor: Colors.green_1,
    borderRadius: 20,
    backgroundColor: Colors.green_1,
    fontSize: 18,
    fontWeight: '500',
    color: Colors.white,
  },
  backScreenmiss: {
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 2,
    borderColor: Colors.green_1,
    borderRadius: 20,
    backgroundColor: Colors.green_1,
    fontSize: 18,
    fontWeight: '500',
    color: Colors.white,
  },
  friendsView: {
    borderTopWidth: 2,
    borderTopColor: '#F2F2F2',
    borderBottomWidth: 7,
    borderBottomColor: '#F2F2F2',
    paddingTop: 10,
    paddingBottom: 10,
  },
  viewlistfriend: {
    display: "flex",
    flexWrap: 'wrap',
    flexDirection: "row",
  },
  viewlistfriendlength: {
    display: "flex",
    flexWrap: 'wrap',
    flexDirection: "row",
    justifyContent: "flex-start"
    // justifyContent: "space-around"
  }
});

export default UserProfileComponent;





