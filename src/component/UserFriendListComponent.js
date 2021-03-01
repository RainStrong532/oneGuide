import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Image,
  ActivityIndicator, TouchableOpacity, Alert, Platform, FlatList,
  ScrollView, TextInput, KeyboardAvoidingView,
  RefreshControl,

} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { ReachabilityView, i18next, Loading } from '../utils'
import { backScreen, pushToUserProfile, gotoChatScreen } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import CommonStyles from '../constants/styles'
import DataManager from '../modules/DataManager'
import HeaderView from '../component/views/HeaderView'
import _ from 'lodash'
import Helper from '../utils/Helper';
import TourItemComponent from './tour-view/TourItemComponent'
import UserItemView from './tour-view/UserItemView';
import SearchBarView from './views/SearchBarView';
import ScreenName from '../config/screens-name'

export default class UserFriendListComponent extends Component {

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
    this.doGetListUserFriend = this.doGetListUserFriend.bind(this)
    this.page = 1;
    this.state = {
      refreshing: false,
      isLoadMore: true,
      keysearch: "",
      listFriend: []
    }
  }

  componentDidMount() {
    let user_id = ""
    const { passProps } = this.props || {}
    if (passProps && passProps.user_id) {
      user_id = passProps.user_id
    }
    // const user_id = this.props.passProps.user_id || null
    setTimeout(() => {
      this.doGetListUserFriend(user_id, this.page)
    }, 300);
  }


  onPressBack = () => {
    backScreen(this.props.componentId)
  }



  onPressUserProfile = (user_id) => {
    const data = { user_id }
    pushToUserProfile(this.props.componentId, data)
  }

  onPressChatButon = (item) => {

    const conversation_id = _.get(item, 'conversation_id');
    const user_id = item.user_id;
    const room = {
      user_id: user_id,
      name_list: item.display_name,
      conversation_id
    }
    gotoChatScreen(this.props.componentId, room)
  }

  doGetListUserFriend = (user_id, page) => {

    this.props.getUserFriendList(user_id, page)

      .then(data => {

        this.page = page + 1
        this.setState({
          refreshing: false,
          isLoadMore: false,
          searching: false
        })
      })
      .catch(error => {
        this.page = page + 1

        this.setState({
          refreshing: false,
          isLoadMore: false,
          searching: false
        })
      });

  }
  doSearchListUserFriend = (data) => {

    this.props.getUserFriendListOther(data)

      .then(data => {
        this.page++;
        this.setState({
          refreshing: false,
          isLoadMore: false,
          searching: false
        })
      })
      .catch(error => {
        this.setState({
          refreshing: false,
          isLoadMore: false,
          searching: false
        })
      });

  }
  onChangeText = (text) => {
    this.page = 1;
    this.setState({ keysearch: text, searching: true }, () => {
      let data = { page: this.page }
      // if (this.props.searchUserFriendList) {
      this.doSearchListUserFriend(data)
      // }
    })
  }
  render() {

    const { refreshing, searching, keysearch, isLoadMore } = this.state
    const isSearch = _.get(this.props, 'passProps.isSearch');
    const { DataListFirends } = this.props || []
    let listFriendAdd, listFriend = [];
    if (DataListFirends) {
      listFriendAdd = DataListFirends
    }
    if (isSearch && keysearch) {
      listFriend = _.get(this.props, 'user.friendSearch');
    } else if (isSearch) {
      listFriend = this.state.listFriend;
    } else {
      listFriend = _.get(this.props, 'passProps.list_friends') || _.get(this.props, 'user.me.list_friends')
    }

    return (
      <View style={styles.container}>
        {
          isSearch ?
            <SearchBarView
              holder='Search_username'
              onPressCancel={this.onPressBack}
              search_inbox={isSearch}
              onChangeText={this.onChangeText}
            >
            </SearchBarView>
            :
            <HeaderView
              title={i18next.t('ListUserFriends')}
              tintColor={Colors.white}
              style={{ backgroundColor: Colors.green_1 }}
              back={true}
              onPressLeftBarButton={this.onPressBack}>
            </HeaderView>
        }
        {
          searching
            ?
            <View style={{ height: 40, justifyContent: 'center', paddingTop: 30 }}>
              <ActivityIndicator animating size="small" color={Colors.black} />
            </View>
            :
            <FlatList
              removeClippedSubviews={false}
              data={listFriendAdd}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
              onEndReached={this.loadMore}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this.pullRefresh}
                />
              }
              onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 10}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={this.renderBottom}
              ListEmptyComponent={this.renderEmpty}
              pullRefresh
            />
        }
      </View>
    )
  }

  renderEmpty = () => {

    const { isLoadMore } = this.state
    if (isLoadMore) {
      return null
    }
    const isSearch = _.get(this.props, 'passProps.isSearch');
    return (
      // <View style={styles.emptyView}>
      //   <Text style={{ fontSize: 14, color: Colors.black_1, textAlign: 'center' }}>
      //     {
      //       isSearch
      //         ?
      //         i18next.t('NoDataFound')
      //         :
      //         i18next.t('ThereIsNoFriends')
      //     }
      //   </Text>
      // </View>


      <View style={{ flex: 1 }}>
        {
          isLoadMore
            ?
            <View style={{ flex: 1, marginTop: 50 }}>
              <Image
                source={Images.search_not_value}
                style={{ alignSelf: 'center', width: 100, height: 100, tintColor: '#ADBFD1' }}
              ></Image>
              <Text style={{
                textAlign: 'center',
                marginTop: 10,
                fontSize: 16,
                color: '#ADBFD1'
              }}>{i18next.t('No_result')}</Text>
            </View>
            :
            <View style={{ flex: 1, marginTop: 50 }}>
              <Image
                source={Images.icon_friends_end}
                style={{ alignSelf: 'center', width: 100, height: 100, tintColor: '#ADBFD1', resizeMode: 'contain' }}
              ></Image>
              <Text style={{
                textAlign: 'center',
                marginTop: 10,
                fontSize: 16,
                color: '#ADBFD1'
              }}>{i18next.t('ThereIsNoFriends')}</Text>
            </View>
        }
      </View>
    )
  }
  pullRefresh = () => {
    const isSearch = _.get(this.props, 'passProps.isSearch');
    const { user_id } = this.props.passProps || ""
    const { refreshing, keysearch } = this.state;
    if (refreshing) {
      return
    }
    this.page = 1;
    this.setState({ refreshing: true }, () => {
      if (keysearch && isSearch) {
        this.doSearchListUserFriend({ keysearch: this.state.keysearch, page: this.page });
      } else {
        this.doGetListUserFriend(user_id, this.page)
      }
    })
  }

  loadMore = () => {
    const isSearch = _.get(this.props, 'passProps.isSearch');
    const user_id = _.get(this.props, 'passProps.user_id');
    const { isLoadMore, keysearch } = this.state;
    if (isLoadMore) {
      return
    }
    this.setState({ isLoadMore: true }, () => {
      if (keysearch && isSearch) {

        this.doSearchListUserFriend({ keysearch: this.state.keysearch, page: this.page });
      } else {
        this.doGetListUserFriend(user_id, this.page)
      }
    })
  }

  renderBottom = () => {
    const { isLoadMore } = this.state;
    return (<View style={{ height: 40, justifyContent: 'center', paddingTop: 30, paddingBottom: 10 }}>
      {isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
    </View>)
  }

  renderItem = ({ item, index }) => {

    let isSearch_txt
    if (this.props && this.props.passProps && this.props.passProps.isSearch) {
      isSearch_txt = this.props.passProps.isSearch
    }
    return (
      //this.props.passProps.isSearch ?
      // isSearch_txt ?
      //   <UserItemView
      //     item={item}
      //     index={index}
      //     isSearch={true}
      //     onPressChatButon={this.onPressChatButon}>
      //   </UserItemView>
      //   :
      <UserItemView
        item={item}
        index={index}
        onPressUserProfile={this.onPressUserProfile}
        onPressChatButon={this.onPressChatButon}>
      </UserItemView>
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