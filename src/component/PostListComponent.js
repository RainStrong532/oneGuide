import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, FlatList, Animated, Platform, TextInput } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import { i18next, Loading } from '../utils'
import PostCreateView from './post-views/PostCreateView'
import PostView from './post-views/PostView'
import POST_TYPE from '../constants/post-types'
import {
  showModalPostCreate,
  gotoPostDetail,
  viewPhoto,
  // showMoreOptionsPost,
  dimissModal,
  pushToUserProfile,
  showModalLikeList,
  showModalApplyList,
  showModalUserProfile,
  pushListLocation,
  pushToAccountVerify,
  pushToGroup,
  pushInformationGroup

} from '../navigation';
import _ from 'lodash'
import FriendRecomendation from './FriendRecomendation ';
import CheckInListComponent from './CheckInListComponent'
// import { TextInput } from 'react-native-gesture-handler';
import Helper from '../utils/Helper';
import { getRecommenFriend } from '../actions'
// import { TextInput } from 'react-native';


class CustomPostListComponent extends Component {

  static options(passProps) {
    return {
    };
  }

  static defaultProps = {
    refreshing: false,
  }

  constructor(props) {
    super(props);
    this.renderHeader = this.renderHeader.bind(this)
    this.renderBottom = this.renderBottom.bind(this)
    this.pullRefresh = this.pullRefresh.bind(this)
    this.onPressDebounce = _.debounce(this.onPressCreatePost, 500, { leading: true, trailing: false })
    this.handlephoto = _.debounce(this.onPressImage, 500, { leading: true, trailing: false })
    this.handleAvatar = _.debounce(this.onPressAvatarButton, 500, { leading: true, trailing: false })
    this.handleListlike = _.debounce(this.onPressLikeListButton, 500, { leading: true, trailing: false })
    this.handleApply = _.debounce(this.onPressApplyButton, 500, { leading: true, trailing: false })
    this.state = {
      dataUser: []
    }
  }

  componentDidMount() {

  }

  // shouldComponentUpdate()

  onPressCommentButton = (data, isComment) => {
    // console.log('data commen bút tồng', data);
    gotoPostDetail(this.props.parentComponentId,
      {
        ...data,
        // onPressApplyButton: this.props.onPressApplyButton
      },
      { showKeyboard: isComment })
  }

  onPressLikeListButton = (data, isComment) => {
    showModalLikeList(this.props.parentComponentId, data, { showKeyboard: isComment })
  }

  onPressSharePostButton = (data) => {
    gotoPostDetail(this.props.parentComponentId, { comment: data })
  }

  onPressApplyButton = () => {
    if (this.props.onPressApplyButton) {
      this.props.onPressApplyButton()
    }
  }

  loadMore = () => {
    if (this.props.loadMore) {
      this.props.loadMore()
    }
  }

  pullRefresh = () => {
    if (this.props.pullRefresh) {
      this.props.pullRefresh()
      this.props.getCheckIn()
      this.props.getRecommenFriend()

    }

  }

  pushToAccountVerify = () => {
    pushToAccountVerify(this.props.componentId);
  }

  onPressCreatePost = (type) => {

    const is_verify = _.get(this.props, 'user.me.is_verify');
    // console.log("object is_verify", is_verify);
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

  onPressImage = (index, photo) => {

    viewPhoto({ index, photo })
  }


  onPressAvatarButton = (data) => {

    pushToUserProfile(this.props.parentComponentId, {
      ...data,
      // onPressApplyButton: this.props.onPressApplyButton, 
    })
  }

  onPressTourLocation = (data) => {
    if (data.location) {
      const locations = data.location.split('-')
      pushListLocation(this.props.parentComponentId, { locations })
    }

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


  render() {
    // console.log('post list compoent tntntntnt 8 8 8 8 8 8 8 8 8 8', this.props);
    const { data, refreshing, innerRef, user } = this.props
    return (
      <View style={[styles.container]}>
        {/* kiểm tra */}
        <FlatList
          removeClippedSubviews={false}
          ref={innerRef}
          data={data}
          extraData={this.props}
          keyExtractor={this.keyExtractor}
          ListHeaderComponent={this.renderHeader}
          renderItem={this.renderItem}
          ListFooterComponent={this.renderBottom}
          refreshing={refreshing}
          onRefresh={this.pullRefresh}
          onEndReached={this.loadMore}
          onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 1}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={1}
          onScroll={this.props.onScroll}
          contentInset={this.props.contentInset}
          contentOffset={this.props.contentOffset}
        />
      </View>
    );
  }

  keyExtractor = (item, index) => index.toString();
  //keyExtractor = (item, index) => item['comment_id'].toString()
  renderHeader() {
    const { extraData, isMe,
      avatar, friends, parentComponentId, addFriend,
      user
    } = this.props

    let username, user_avatar, isAgent
    if (user && user.me && user.me.is_agent) {
      isAgent = user.me.is_agent
    }
    // var dataUser = [{ avatar: user_avatar, username }]

    if (isMe !== undefined) {
      return null
    }
    let checkFriends = []

    if (this.props.friends) {
      checkFriends = this.props.friends
    }

    return (
      <View>
        <PostCreateView
          {...this.props}
          componentId={this.props.parentComponentId}
          isMe={isMe}
          data={extraData}
          onPressCreatePost={this.onPressDebounce}
          avatarWall={avatar}
          onPressAvatarButton={this.handleAvatar}
          isAgent={isAgent}
        />
        {/* gợi ý kết bạn */}

        <CheckInListComponent
          // {...this.props}
          // checkIndata={this.props.dataCheckInGet}
          componentId={this.props.parentComponentId}
          getCheckIn={this.props.getCheckIn}
          //  dataUser={dataUser}
          Allhighlights={this.props.Allhighlights}
          highlights_user={this.props.highlights_user}
        />

        {
          checkFriends.length == 0 ?
            null :
            <FriendRecomendation
              friends={friends}
              parentComponentId={parentComponentId}
              addFriend={addFriend}
            />
        }
      </View>
    );
  }

  renderItem = ({ index, item }) => {

    const data = { index, comment: item }
    const componentId = this.props.parentComponentId
    return (
      <View style={styles.post} >
        <PostView
          {...this.props}
          data={data}
          dataPost={this.props.data}
          onPressLikeButton={this.props.onPressLikeButton}
          onPressMoreOptionsButton={this.props.onPressMoreOptionsButton}
          onPressCommentButton={this.onPressCommentButton}
          onPressShareButton={this.props.onPressShareButton}
          onPressImage={this.handlephoto}
          onPressSharePostButton={this.onPressSharePostButton}
          onPressAvatarButton={this.handleAvatar}
          onPressNameButton={this.handleAvatar}
          onPressLikeListButton={this.handleListlike}
          // onPressApplyButton={this.handleApply}
          onPressTourLocation={this.onPressTourLocation}
          parentComponentId={this.props.parentComponentId}
          getInfomationGroup={this.props.getInfomationGroup}
          goToGroup={this.goToGroup}
          componentId={componentId}

        />
        {/* <Text>1234567</Text> */}
      </View>
    )
  }

  renderBottom() {
    const { isLoadMore } = this.props;
    return (<View style={{ height: 40, justifyContent: 'center' }}>
      {isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
    </View>)
  }

}

export default PostListComponent = React.forwardRef((props, ref) => {

  return (
    <CustomPostListComponent innerRef={ref} {...props} />
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.light_gray_3
  },
  post: {
    backgroundColor: Colors.white,
    marginTop: 8,
    flexDirection: 'column'
  },

})
