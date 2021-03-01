import React, { Component } from 'react';
import {
  ImageBackground, StyleSheet, View, Text, Image,
  ActivityIndicator, Dimensions, Alert, Keyboard,
  TouchableOpacity, Modal, TextInput, BackHandler, ClippingRectangle
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import {
  showModalPostCreate,
  gotoPostDetail,
  viewPhoto,
  showMoreOptionsPost,
  showSharePost,
  pushToUserProfile,
  showModalSharePost,
  showModalSharePostAsMessage,
  dimissModal,
  showModalApplyList,
  gotoChatScreen,
  pushInformationGroup,
  pushToAccountVerify

} from '../navigation';
import _ from 'lodash';
import Images from '../assets/images'
import Colors from '../constants/colors'
import CommonStyles from '../constants/styles'
import { i18next, Loading } from '../utils'
import PostListComponent from '../component/PostListComponent'
import SearchComponent from '../component/SearchComponent'
import SearchBarView from './views/SearchBarView'
import AgentComponent from './AgentComponent'
import HeaderView from './views/HeaderView'

import Helper from '../utils/Helper';
import { AsyncStorage } from 'react-native';
import FirstLogin from '../component/FirstLogin'
import images from '../assets/images';
import SocketManager from '../modules/SocketManager'

export default class HomeComponent extends Component {

  static options(passProps) {
    return {
      statusBar: {
        backgroundColor: 'transparent',
        visible: true,
        style: 'light',
      },
    };
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.eventSubscription = Navigation.events().registerBottomTabSelectedListener(this.onPressBottomTab)
    // this.onPressCreatePost = this.onPressCreatePost.bind(this)
    this.doSharePost = this.doSharePost.bind(this)
    // this.doApplyPost = this.doApplyPost.bind(this)
    this.onPressDismissSearch = this.onPressDismissSearch.bind(this)
    this.doSearchTextDelayed = _.debounce(this.doSearchUser, 1000);
    this.onPressDebounce = _.debounce(this.onPressUserProfile, 1000, { leading: true, trailing: false })
    this.state = {
      isLoadMore: true,
      isSearching: false,
      // newfeeds: ''
      key_search: "",
      modalVisible: false,
      convertData: {},
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height,
      tips: []
    }





    this.page = 1
    // props.getListNotifications();

  }

  componentDidMount = () => {

    // .then(res => {

    //   this.setState({ dataCheckIn: res })
    // })
    // .catch(error => {

    // })
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
    this.props.getRecommenFriend();
    this.props.addPostStorage()
    this.doGetPosts(this.page)
    this.props.getCheckIn()
  }

  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressed);
  }
  onBackButtonPressed = () => {
    // BackHandler.exitApp()
  }
  componentDidUpdate() {
    let user_live_notifications_counter = _.get(this.props, 'user.me.user_live_notifications_counter') || '0'
    console.log("chay ham update notification", user_live_notifications_counter);
    if (user_live_notifications_counter == '0') {
      user_live_notifications_counter = null
    }

    // this.props.getListNotifications(1)
    Navigation.mergeOptions('notification', {
      bottomTab: {
        // iconColor: 'red',
        badge: user_live_notifications_counter ? user_live_notifications_counter.toString() : ''
      }
    });

  }
  componentDidDisappear() {
  }
  componentWillUnmount() {
    this.eventSubscription.remove()
  }
  doGetPosts = (page) => {

    this.props.getNewPosts(page)
      .then(data => {

        if (this.page === 1) {

          let key = "ONEGUIDE_USER_DATA"
          let userId = this.props.user.me.user_id
          let value = {}
          value = { posts: data, user_id: userId }

          value = JSON.stringify(value)
          //  console.log(key, value)
          AsyncStorage.setItem(key, value);
        }
        this.page = this.page + 1

        this.setState({
          refreshing: false,
          isLoadMore: false,
        })
      })
      .catch(error => {
        this.setState({
          refreshing: false,
          isLoadMore: false
        })
      });
  }

  doLikeComment = (comment_id) => {

    this.props.likePost(comment_id)
      .then(data => {
        // console.log('ú ú s ú ú ú ', data);
        // this.setState({
        //   newfeeds: data
        // })
        SocketManager.sendComment()
      })
      .catch(error => {
      });
  }

  doLikeTourSearch = (comment_id) => {
    // console.log('like tour search pẹt pẹt', comment_id)
    this.props.likeTourSearch(comment_id)
      .then(data => {
        //  console.log('hàm like ở hôm', data);
        this.setState({
          find_tours: data
        })
        SocketManager.sendComment()
      })
      .catch(error => {

      })
  }

  doLikePostSearch = (comment_id) => {
    //console.log('like tour search pẹt pẹt', comment_id)
    this.props.likePostSearch(comment_id)
      .then(data => {
        // console.log('---------------------------', data);
        this.setState({
          find_posts: data
        })
        SocketManager.sendComment()
      })
      .catch(error => {

      })
  }

  doSharePost = (data) => {
    Loading.showHud()
    // request
    this.props.createPost(data)
      .then(data => {
        //  console.log("objectresponse");
        // this.setState({
        //   newfeeds:data
        // })
        Loading.hideHud()
        dimissModal(this.props.componentId)
      })
      .catch(error => {
        Loading.hideHud()
      });
  }


  // doLikeCommentTotalPost = (comment_id) => {
  //   this.props.likeTotalPost(comment_id)
  //     .then(data => {
  //       console.log('ú ú s ú ú ú ', data);
  //     })
  //     .catch(error => {
  //     });
  // }
  // onPressLikeTotalPost = (comment_id) => {

  //   this.doLikeCommentTotalPost(comment_id)
  // }


  pushToAccountVerify = () => {
    pushToAccountVerify(this.props.componentId);
  }

  onPressApplyButton = (data) => {
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
    const user_id = this.props.user.me.user_id
    const user_id_create_tuor = data.user_id
    const comment_id = data.comment_id
    const is_agent = this.props.user.me.is_agent
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

      if (apply_type.toString() == '4' || apply_type.toString() == '3' || apply_type.toString() == '6') {
        Helper.showAlert('', i18next.t('Tour đã hủy'))
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
          comment_id
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
    this.props.applyPost(comment_id)
      .then(data => {
        // console.log("data sau khi apply tour", data);
        Loading.hideHud()
        if (data.status == 'pending') {
          Helper.showAlert('', "Bạn đã đăng ký tour thành công",
            [
              {
                text: 'OK', onPress: () => {
                }
              }
            ]
          )
          SocketManager.sendComment()
        }
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

  loadMore = () => {
    if (this.state.isLoadMore === true) {
      return
    }

    this.setState({ isLoadMore: true }, () => {

      this.doGetPosts(this.page)

    })
  }

  pullRefresh = () => {
    if (this.state.refreshing === true) {
      return
    }

    this.setState({ refreshing: true }, () => {
      this.doGetPosts(1)
    })
  }

  onPressBottomTab = ({ selectedTabIndex, unselectedTabIndex }) => {
    if (unselectedTabIndex === 0 &&
      selectedTabIndex === 0 &&
      this.refs.flatList) {
      this.refs.flatList.scrollToOffset({ x: 0, y: 0, animated: true })
    }
  }


  onPressLikeButton = (comment_id) => {

    this.doLikeComment(comment_id)
  }

  onPressLikeTourSearch = (comment_id) => {
    this.doLikeTourSearch(comment_id)
  }
  onPressLikePostSearch = (comment_id) => {
    this.doLikePostSearch(comment_id)
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

  onPressDismissSearch = () => {
    this.setState({
      isSearching: false,
      find_users: [],
      is_searching: false,
      key_search: '',
      find_posts: [],
      find_tours: [],
      find_group: [],
      is_searching: false
    })
  }
  onPressSearch = () => {
    this.setState({
      isSearching: true
    })
  }

  onPressImage = (index, photo) => {
    viewPhoto({ index, photo })
  }


  onPressChatButon = (item) => {
    const conversation_id = _.get(item, 'conversation_id')
    const room = {
      user_id: item.user_id,
      name_list: item.display_name,
      conversation_id
    }

    gotoChatScreen(this.props.componentId, room)
  }

  onPressUserProfile = (user_id) => {

    const data = { user_id }

    pushToUserProfile(this.props.componentId, data)
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
    this.props.deletePost(comment_id)
      .then(data => {
        Loading.hideHud()
      })
      .catch(error => {
        Loading.hideHud()
      });
  }

  onChangeTextSearch = (keySearch) => {
    this.setState({ find_group: [], find_users: [], find_posts: [], find_tours: [], is_searching: true, key_search: keySearch }, () => {
      // console.log("this.state", this.state)
      if (this.state.key_search) {

        this.doSearchTextDelayed(this.state.key_search)
      }
    })

    //console.log("ádasdasdasd")
  }

  doSearchUser = (key) => {
    setTimeout(() => Loading.showHud(), 0)
    // request
    this.props.findUser(key)
      .then(data => {
        // console.log('sssssssssssssssssssssssssssssssssssssss', data);

        Loading.hideHud();
        if (data.length === 0 && key.match(/^[a-zA-Z0-9!#$%&'*+-/=?^_`{|}~\.]+\..+$/)) {
          this.searchComponent.showInvited()
        }
        // this.setState({ find_users: this.props.listUser, find_group: this.props.listGroup, find_posts: this.props.listPost, find_tours: this.props.listTour, is_searching: false })
        this.setState({ find_users: data.users, find_group: data.group, find_posts: data.post.comments, find_tours: data.guide ? data.guide.comments : data.tour.comments, is_searching: false })
      })
      .catch(error => {
        Loading.hideHud();
      });

    this.props.SearchAllUser(this.state.key_search)
      .then(res => {
      })
      .catch(error => {

      })
  }

  joinGroup = (dataGroup) => {
    this.props.joinGroupSearch(dataGroup)
  }

  outGroup = (id_group) => {
    this.props.outGroupSearch(id_group)
  }



  onPressInformationGroup = (group_id) => {
    // await
    this.props.getInfomationGroup(group_id)
    let convertData
    if (this.props.infoGroup != 0) {
      let infoGroup = this.props.infoGroup
      convertData = {
        ...infoGroup,
        background: infoGroup.avatar
      }

      // console.log('chuẩn bị convert data', infoGroup);
      pushInformationGroup(this.props.componentId, {
        passProps: convertData,
        removeData: () => infoGroup = null
      })
    }

  }

  removeInfoGroup = () => {

  }


  render() {
    const { posts, listTour, listPost, Allhighlights, addFriend, infoGroup } = this.props || []
    const { app, refreshing, isLoadMore, isSearching, is_searching, find_users, key_search, dataCheckIn, find_posts, find_tours, find_group } = this.state
    let newfeeds, listTourSearch, listPostSearch, totalUser, me, listUser, highlights_user, AllDataGetCheckIn, infomationGroup = []


    if (posts && posts.newfeeds) {
      newfeeds = posts.newfeeds
    }

    if (listTour) {
      listTourSearch = listTour
    }
    if (listPost) {
      listPostSearch = listPost
    }
    if (this.props.totalUser) {
      totalUser = this.props.totalUser
    }
    if (this.props.user) {
      me = _.get(this.props, 'user.me')
    }
    if (this.props.recommend) {
      listUser = this.props.recommend.listFriendRecommend
    }
    if (this.props.highlights_user) {
      highlights_user = this.props.highlights_user
    }
    if (infoGroup.length != 0) {
      infomationGroup = infoGroup
    }
    return (
      <View style={[styles.container]}>


        {/* Search bar  */}
        <SearchBarView
          {...this.props}
          onPressSearch={this.onPressSearch}
          onPressCancel={this.onPressDismissSearch}
          onChangeText={this.onChangeTextSearch}
          value={key_search}
          parentComponentId={this.props.componentId}
          isSearching={isSearching}
          user={this.props.user}

        />
        {/* <TouchableOpacity onPress={() => {
          console.log("haha")
          Navigation.mergeOptions("notification", {
            bottomTab: {
              badge: '10'
            },
          });
          // Navigation.mergeOptions('notification_tab', {
          //   bottomTab: {
          //     iconColor: 'red',
          //     badge: '2'
          //   }
          // });
        }}>
          <Text>TEST</Text>

        </TouchableOpacity> */}
        <View style={{ flex: 1, backgroundColor: Colors.white }}>

          {
            Allhighlights.length === 0

              ?
              <View style={{ flex: 1 }}>
                <Image
                  style={{
                    flex: 1,
                    // width: this.state.screenWidth, height: this.state.screenHeight 
                  }}

                  source={{ uri: 'data:image/png;base64,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' }}
                  // source={Images.waiting_ping}
                  resizeMode='cover'
                ></Image>
              </View>

              :
              <PostListComponent
                {...this.props}
                getCheckIn={this.props.getCheckIn}
                onPressLikeButton={this.onPressLikeButton}
                ref='flatList'
                parentComponentId={this.props.componentId}
                data={newfeeds}
                extraData={me}
                refreshing={refreshing}
                pullRefresh={this.pullRefresh}
                loadMore={this.loadMore}
                isLoadMore={isLoadMore}
                // onPressCreatePost={this.onPressCreatePost}
                onPressMoreOptionsButton={this.onPressMoreOptionsButton}
                // onPressCommentButton={this.onPressCommentButton}
                onPressShareButton={this.onPressShareButton}
                onPressApplyButton={this.onPressApplyButton}
                // onPressImage={this.onPressImage}
                // onPressSharePostButton={this.onPressSharePostButton}
                friends={listUser}
                addFriend={addFriend}
                getCheckIn={this.props.getCheckIn}
                Allhighlights={Allhighlights}
                //getCheckIn={dataCheckIn}
                highlights_user={this.props.highlights_user}
                getRecommenFriend={this.props.getRecommenFriend}
              // {...this.props}

              />
            // <View>
            //   <Text>scscscdvsdv</Text>
            //   <TextInput />
            //   {/* <TextInput value="dsdsdadasdasda"></TextInput> */}
            // </View>
          }
          {
            isSearching &&
            //trả về kq search hiển thị ra

            <SearchComponent
              {...this.props}
              onPressLikeButton={this.onPressLikeButton}
              onPressLikeTourSearch={this.onPressLikeTourSearch}
              onPressLikePostSearch={this.onPressLikePostSearch}
              parentComponentId={this.props.componentId}
              style={[CommonStyles.position_absolute_full]}
              onPressDismiss={this.onPressDismissSearch}
              onPressChatButon={this.onPressChatButon}
              onPressUserProfile={this.onPressDebounce}
              find_users={find_users}
              find_posts={find_posts}
              find_tours={find_tours}
              find_group={find_group}
              onPressInformationGroup={this.onPressInformationGroup}
              is_searching={is_searching}
              ref={ref => this.searchComponent = ref}
              txtSearch={key_search}
              // {...this.props}
              // componentId={this.props}
              onPressImage={this.onPressImage}
              onPressApplyButton={this.onPressApplyButton}
              refreshing={refreshing}
              onPressShareButton={this.onPressShareButton}
              onPressMoreOptionsButton={this.onPressMoreOptionsButton}
              totalUser={totalUser}
              joinGroup={this.joinGroup}
              getInfomationGroup={this.props.getInfomationGroup}
              joinGroupSearch={this.props.joinGroupSearch}
              outGroupSearch={this.props.outGroupSearch}
              joinGroupContainer={this.props.joinGroupContainer}
            // onPressLikeTotalPost={this.onPressLikeTotalPost}
            />

          }
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center'
  },
  openButton: {
    backgroundColor: "#03a9f4",
    borderRadius: 10,
    padding: 10,
    elevation: 2
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
})
