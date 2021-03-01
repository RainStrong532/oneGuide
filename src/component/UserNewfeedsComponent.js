import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, Text, ScrollView, Image, Dimensions, RefreshControl, ActivityIndicator, Animated, Platform, Keyboard, TouchableOpacity } from 'react-native';
import { Navigation } from 'react-native-navigation';
import {
  showModalPostCreate,
  gotoPostDetail,
  viewPhoto,
  showMoreOptionsPost,
  showSharePost,
  backScreen,
  showModalSharePost,
  showModalSharePostAsMessage,
  pushListLocation
} from '../navigation';
import _ from 'lodash';
import Images from '../assets/images'
import Colors from '../constants/colors'
import CommonStyles from '../constants/styles'
import { i18next, Loading } from '../utils'
import PostListComponent from './PostListComponent'
import PostView from './post-views/PostView'
import SearchComponent from './SearchComponent'
// import SearchBarView from './views/SearchBarView'
import HeaderView from './views/HeaderView'
import StringUtils from '../utils/StringUtils'
import { FlatList } from 'react-native-gesture-handler';

const AnimatedPostListComponent = Animated.createAnimatedComponent(PostListComponent);
export default class UserNewfeedsComponent extends Component {

  // static options(passProps) {
  //   return {
  //     statusBar: {
  //       backgroundColor: 'transparent',
  //       visible: true,
  //       style: 'light'
  //     },
  //   };
  // }

  constructor(props) {
    super(props);

    this.doSharePost = this.doSharePost.bind(this)
    this.onPressDismissSearch = this.onPressDismissSearch.bind(this)

    this.state = {
      refreshing: false,
      newfeeds: [],
      isLoadMore: true,
      isSearching: false,
    };

    this.page = 1
  }

  componentDidMount() {
    // console.log('rít chấm', this.props);
    const user_id = _.get(this.props, 'data.user_id')
    setTimeout(() => {
      this.doGetPosts(this.page, user_id)
    }, 100);
  }

  componentWillUnmount() {
  }



  doGetPosts = (page, user_id) => {

    // request
    // console.log('papapapapapapgegegegeg', page);
    this.props.getNewPostsOtherUser(page, user_id)
      .then(data => {
        let newfeeds = data
        newfeeds = _.map(newfeeds, (post) => {
          return {
            ...post,
            isLongText: StringUtils.isLongTextPost(post.content),
            showFull: false
          }
        });

        if (page !== 1) {
          const currentPosts = this.state.newfeeds
          newfeeds = _.concat(currentPosts, newfeeds)
        }

        this.page = page + 1
        this.setState({
          newfeeds,
          refreshing: false,
          isLoadMore: false
        })
      })
      .catch(error => {
      });
  }

  doLikeComment = (comment_id) => {

    // request
    this.props.likenewfeedOther(comment_id)
      .then(data => {
        // console.log('da    tâ', data);
        this.setState({
          newfeeds: data
        })
        SocketManager.sendComment()
      })
      .catch(error => {
      });
  }

  doSharePost = (data) => {
    Loading.showHud()
    // request
    this.props.createPost(data)
      .then(data => {

        Loading.hideHud()
        dimissModal(this.props.componentId)
      })
      .catch(error => {
        Loading.hideHud()
      });
  }

  // doDeleteComment = (comment_id) => {
  //   Loading.showHud()
  //   // request
  //   this.props.deletePost(comment_id)
  //     .then(data => {
  //       Loading.hideHud()
  //     })
  //     .catch(error => {
  //       Loading.hideHud()
  //     });
  // }

  loadMore = () => {
    // console.log('có chạy vào hàm load thêm này');
    if (this.state.isLoadMore === true) {
      return
    }

    this.setState({ isLoadMore: true }, () => {
      this.doGetPosts(this.page)
    })
    // console.log(' có chạy vào hàm này');
    // if (this.props.loadMore) {
    //   this.props.loadMore()
    // }
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

  // onPressCreatePost = (type) => {
  //   showModalPostCreate(type)
  // }

  onPressLikeButton = (comment_id) => {
    this.doLikeComment(comment_id)
  }

  onPressCommentButton = (data, isComment) => {
    gotoPostDetail(this.props.componentId, data, { showKeyboard: isComment })
  }

  onPressTourLocation = (data) => {
    if (data.location) {
      const locations = data.location.split('-')
      pushListLocation(this.props.componentId, { locations })
    }

  }

  // onPressCommentButton = (data, isComment) => {
  //   console.log('data commen bút tồng', data);
  //   gotoPostDetail(this.props.componentId,
  //     { ...data, onPressApplyButton: this.props.onPressApplyButton },
  //     { showKeyboard: isComment })
  // }

  onPressMoreOptionsButton = (comment) => {
    const user_me = _.get(this.props, 'user.me')
    showMoreOptionsPost(comment, user_me)
  }

  // onPressShareButton = (comment) => {

  //   const user_me = _.get(this.props, 'user.me')
  //   showSharePost(comment, user_me)
  // }

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
      isSearching: false
    })
  }

  // onPressSharePostButton = (data) => {
  //   gotoPostDetail(this.props.componentId, { comment: data })
  // }

  onPressSearch = () => {
    this.setState({
      isSearching: true
    })
  }

  // onPressImage = (index, photo) => {
  //   viewPhoto({ index, photo })
  // }

  onPressBack = () => {
    backScreen(this.props.componentId);
  }

  renderItem = (item, index) => {
    // console.log('item newfeed', item);
    const newfeeds = { index, comment: item.item }
    const { isLoadMore } = this.state
    const { contentInset, contentOffset } = this.props
    const isMe = this.props.data.user_id === this.props.user.me.user_id
    const avatar = this.props.data.avatar
    return (
      <View  >
        <PostView
          // data={data}
          // // textSearch: this.props.textSearch,
          // onPressLikeButton={() => this.onPressLikeButton(item.comment_id)}
          // parentComponentId={this.props.passProps.parentComponentId}
          // onPressImage={this.props.passProps.onPressImage}
          // onPressCommentButton={this.onPressCommentButton}
          // onPressShareButton={this.props.passProps.onPressShareButton}
          // onPressMoreOptionsButton={this.props.passProps.onPressMoreOptionsButton}
          // onPressSharePostButton={this.props.passProps.onPressSharePostButton}
          // onPressApplyButton={() => this.onPressApplyButton({ comment: item })}
          // onPressAvatarButton={this.props.passProps.onPressAvatarButton}
          // onPressLikeListButton={this.props.passProps.handleListlike}
          // onPressTourLocation={this.props.passProps.onPressTourLocation}

          // ref='flatList'
          parentComponentId={this.props.componentId}
          data={newfeeds}
          isMe={isMe}
          extraData={{ avatar: '' }}
          // refreshing={false}
          // pullRefresh={this.pullRefresh}
          loadMore={this.loadMore}
          // isLoadMore={isLoadMore}
          onPressLikeButton={this.onPressLikeButton}
          onPressMoreOptionsButton={this.onPressMoreOptionsButton}
          onPressShareButton={this.onPressShareButton}
          onPressCommentButton={this.onPressCommentButton}
          contentInset={contentInset}
          contentOffset={contentOffset}
          onScroll={this.props.onScroll}
          avatar={avatar}
          onPressApplyButton={this.props.data.onPressApplyButton}
          onPressTourLocation={this.onPressTourLocation}
        />
      </View>
    )
  }

  render() {
    // const statusBarHeight = Device.statusBarSize().height
    // const topBarHeight = Device.topBarSize().height
    let data
    if (this.state.newfeeds) {

      data = this.state.newfeeds
    }
    const { newfeeds } = this.state
    const { isLoadMore } = this.state
    const { contentInset, contentOffset } = this.props
    const isMe = this.props.data.user_id === this.props.user.me.user_id
    const avatar = this.props.data.avatar

    // console.log('neewdataa other', data);
    return (
      <View style={styles.container}>
        {/* <AnimatedPostListComponent
          ref='flatList'
          parentComponentId={this.props.componentId}
          data={newfeeds}
          isMe={isMe}
          extraData={{ avatar: '' }}
          refreshing={false}
          // pullRefresh={this.pullRefresh}
          loadMore={this.loadMore}
          isLoadMore={isLoadMore}
          onPressLikeButton={this.onPressLikeButton}
          onPressMoreOptionsButton={this.onPressMoreOptionsButton}
          onPressShareButton={this.onPressShareButton}
          contentInset={contentInset}
          contentOffset={contentOffset}
          onScroll={this.props.onScroll}
          avatar={avatar}
          onPressApplyButton={this.props.data.onPressApplyButton}

        /> */}

        <FlatList
          removeClippedSubviews={false}
          renderItem={this.renderItem}
          data={data}
          // onScroll={this.loadMore}
          onEndReached={this.loadMore}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.pullRefresh}
            />
          }
          ListFooterComponent={this.renderBottom}
          onEndReachedThreshold={0}
        // ListFooterComponent = {}
        />
      </View>
    );
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 210,
    backgroundColor: Colors.white
  },
  content: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.green_1,
    overflow: 'hidden',
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
  row: {
    height: 40,
    margin: 16,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
});