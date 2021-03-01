
import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Image,
  ActivityIndicator, TouchableOpacity, Alert, Platform, FlatList,
  ScrollView, TextInput, KeyboardAvoidingView,
  RefreshControl
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { ReachabilityView, i18next, Loading } from '../utils'
import { dimissModal, showModalUserProfile, pushToUserProfile, backScreen, gotoChatScreen } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import CommonStyles from '../constants/styles'
import DataManager from '../modules/DataManager'
import HeaderView from './views/HeaderView'
import _ from 'lodash'
import Helper from '../utils/Helper';
import TourItemComponent from './tour-view/TourItemComponent'
import UserItemView from './tour-view/UserItemView';

export default class PostLikeListComponent extends Component {

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
    this.doGetLikeListPost = this.doGetLikeListPost.bind(this)
    this.state = {
      refreshing: false,
      isLoadMore: true,
      likeList: []
    }
  }

  componentDidMount() {
    setTimeout(() => {
      const commentId = _.get(this.props, 'data.comment.comment_id')
      this.doGetLikeListPost(commentId)
    }, 300);
  }

  doGetLikeListPost = (commentId) => {
    this.props.getLikeListPost(commentId)
      .then(data => {
        let likeList = data

        this.setState({
          likeList,
          refreshing: false,
          isLoadMore: false
        })
      })
      .catch(error => {
      });
  }

  render() {
    const { refreshing, likeList } = this.state

    return (
      <View style={styles.container}>
        <HeaderView
          title={i18next.t('Danh sách Like')}
          tintColor={Colors.white}
          style={{ backgroundColor: Colors.green_1 }}
          back={true}
          onPressLeftBarButton={this.onPressBack}
        />
        <FlatList
        removeClippedSubviews={false}
          data={likeList}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          refreshing={refreshing}
          onRefresh={this.pullRefresh}
          onEndReached={this.loadMore}
          onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 10}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={this.renderBottom}
        />
      </View>
    )
  }

  onPressBack = () => {
    backScreen(this.props.componentId)
  }

  onPressUserProfile = (user_id) => {
    // showModalUserProfile(user_id, '')
    const data = { user_id }
    pushToUserProfile(this.props.componentId, data)
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

  loadMore = () => {
    return
  }

  renderBottom = () => {
    const { isLoadMore } = this.state;
    return (<View style={{ height: 40, justifyContent: 'center' }}>
      {isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
    </View>)
  }

  pullRefresh = () => {
    if (this.state.refreshing === true) {
      return
    }

    this.setState({ refreshing: true }, () => {
      const commentId = _.get(this.props, 'data.comment.comment_id')
      this.doGetLikeListPost(commentId)
    })
  }

  renderItem = ({ item, index }) => {
    // const isMe = item.user_id === this.props.user.me.user_id

    return (
      <UserItemView
        item={item}
        index={index}
        isChat={false}
        onPressUserProfile={this.onPressUserProfile}
        onPressChatButon={this.onPressChatButon}
      />
    )
  }

  keyExtractor = (item, index) => index.toString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  }
});