import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, FlatList, KeyboardAvoidingView, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { Navigation } from 'react-native-navigation';
import {
  pushToUserProfile,
  gotoChatScreen,
  pushInformationGroup,
  pushToGroup
} from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import SearchBarView from './views/SearchBarView'
import DismissKeyboard from 'dismissKeyboard';
import Device from '../modules/Device'
import { i18next, Loading } from '../utils'
import UserItemView from './tour-view/UserItemView';
import _ from 'lodash'
import InvitedUser from './InvitedUser';
// import SearchJourneys from '../component/search_all/searchJourneys'
import ResolveSearchUsers from '../component/search_all/resolveSearchUsers'
import TourSearchUsers from '../component/search_all/tourSearchUsers'
import PostSearchUsers from '../component/search_all/postSearchUsers'
import GroupSearchUsers from '../component/search_all/groupSearchUsers'
import InboxChatView from '../component/chat/InboxChatView'

const TYPES = {
  AGENT: 2, GUIDE: 1,
}
const STATUS = {
  NOT_OK: 'RESULT_NOT_OK',
  OK: 'RESULT_OK'
}
export default class SearchComponent extends Component {

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
    // Navigation.events().bindComponent(this);
    this.onPressDismiss = this.onPressDismiss.bind(this)

    this.state = {
      showInvited: false,
      isLoadMore: true,
      refreshing: false,
    }
  }
  componentDidDisappear() {

  }

  onPressDismiss = () => {
    this.props.onPressDismiss()
  }


  onPressUserProfile = (user_id) => {
    this.props.onPressUserProfile && this.props.onPressUserProfile(user_id)
  }

  onPressChatButon = (item) => {

    this.props.onPressChatButon && this.props.onPressChatButon(item)
  }

  showInvited = () => {
    this.setState(
      {
        showInvited: true
      }
    )
  }

  hideInvited = () => {
    this.setState({ showInvited: false })
  }

  getInfomationGroup = (id_group) => {
    this.props.getInfomationGroup(id_group)
  }

  goToGroup = (data) => {
    // console.log('go to group', data);
    if (data.check_user == 'no') {
      pushInformationGroup(this.props.parentComponentId, {
        passProps: data
      })
    } else
      if (data.check_user == 'yes') {
        pushToGroup(this.props.componentId, {
          passProps: data
        })
      }
  }


  render() {
    const statusBarHeight = Device.statusBarSize().height
    const topBarHeight = Device.topBarSize().height
    const { refreshing } = this.state;
    const users = _.get(this.props, 'users') || undefined;
    const user = _.get(this.props, 'user') || undefined;
    const userAll = _.get(this.props, 'find_users') || []
    const posts = _.get(this.props, 'find_posts') || []
    const tours = _.get(this.props, 'find_tours') || []
    const group = _.get(this.props, 'find_group') || []
    const type = _.get(this.props, 'type') || undefined
    const is_agent = _.get(this.props, 'user.me.is_agent') || ''
    let chatRoomsSearch = []
    if (type === 'inbox') {
      chatRoomsSearch = _.get(this.props, 'chat.chatRoomsSearch').filter(item => item.ids) || []
    }
    const status = _.get(this.props, 'users.data.status') || undefined
    const searching = _.get(this.props, 'searching');
    console.log('bờ rốp đao', this.props);

    return (
      <ScrollView style={[this.props.style, styles.container]}>
        {
          this.props.txtSearch
            ?
            <View style={{ flex: 1 }}>
              {is_agent == 1 &&
                <TourSearchUsers
                  onPressLikeButton={this.props.onPressLikeTourSearch}
                  parentComponentId={this.props.componentId}
                  data={this.props.listTour}
                  user={user}
                  onPressImage={this.props.onPressImage}
                  onPressShareButton={this.props.onPressShareButton}
                  onPressMoreOptionsButton={this.props.onPressMoreOptionsButton}
                  onPressApplyButton={this.props.onPressApplyButton}
                  textSearch={this.props.txtSearch}
                  isAgent={this.props.user.me.is_agent}
                />
              }
              <ResolveSearchUsers
                data={this.props.listUser}
                componentId={this.props.componentId}
                addFriend={this.props.addFriend}
                textSearch={this.props.txtSearch}
                totalUser={this.props.totalUser}
              />

              <GroupSearchUsers
                componentId={this.props.componentId}
                data={this.props.listGroup}
                joinGroup={this.props.joinGroup}
                getInfomationGroup={this.getInfomationGroup}
                joinGroupSearch={this.props.joinGroupSearch}
                outGroupSearch={this.props.outGroupSearch}
                joinGroupContainer={this.props.joinGroupContainer}
              />

              <PostSearchUsers
                data={this.props.listPost}
                textSearch={this.props.txtSearch}
                onPressLikeButton={this.props.onPressLikePostSearch}
                parentComponentId={this.props.componentId}
                onPressImage={this.props.onPressImage}
                onPressShareButton={this.props.onPressShareButton}
                onPressMoreOptionsButton={this.props.onPressMoreOptionsButton}
                onPressApplyButton={this.props.onPressApplyButton}
                getInfomationGroup={this.props.getInfomationGroup}
                goToGroup={this.goToGroup}
              // onPressLikeTotalPost={this.props.onPressLikeTotalPost}
              />
            </View>
            :
            (type !== 'inbox')
              ?
              <View >
                <Image
                  source={Images.search_not_value}
                  style={{ width: 60, height: 60, alignSelf: 'center', marginTop: 100, tintColor: Colors.gray }}
                />
                <Text
                  style={{
                    fontSize: 20,
                    marginTop: 20,
                    alignSelf: 'center',
                    textAlign: 'center',
                    color: Colors.gray
                  }}
                >


                  {i18next.t('NoData')}
                </Text>
              </View>
              :
              <></>
          // type === 'inbox'
          //   ?
          //   searching
          //     ?
          //     <View style={{ height: 40, marginTop: 20, justifyContent: 'center' }}>
          //       <ActivityIndicator animating size="small" color={Colors.black} />
          //     </View>
          //     :
          //     <FlatList
          //       data={chatRoomsSearch}
          //       keyExtractor={this.keyExtractor}
          //       renderItem={this.renderItemChat}
          //       ListFooterComponent={this.renderBottom}
          //       refreshing={this.props.refreshing}
          //       onRefresh={this.pullRefresh}
          //       ListEmptyComponent={this.renderEmptyChat}
          //       scrollEventThrottle={1}
          //       onEndReached={this.loadMore}
          //       onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 1}
          //     />
          //   :
          //   <View>
          //     <Text
          //       style={{
          //         marginTop: 20,
          //         textAlign: 'center'
          //       }}
          //     >
          //       {i18next.t('NoData')}
          //     </Text>
          //   </View>
        }
        {
          type === 'inbox'
            ?
            searching
              ?
              <View style={{ height: 40, marginTop: 20, justifyContent: 'center' }}>
                <ActivityIndicator animating size="small" color={Colors.black} />
              </View>
              :
              <FlatList
                removeClippedSubviews={false}
                data={chatRoomsSearch}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItemChat}
                ListFooterComponent={this.renderBottom}
                refreshing={this.props.refreshing}
                onRefresh={this.pullRefresh}
                ListEmptyComponent={this.renderEmptyChat}
                scrollEventThrottle={1}
                onEndReached={this.loadMore}
                onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 1}
              />
            :
            // <View>
            //   <Text
            //     style={{
            //       marginTop: 20,
            //       textAlign: 'center'
            //     }}
            //   >
            //     {i18next.t('NoData')}
            //   </Text>
            // </View>
            null
        }
      </ScrollView>
    );
  }

  renderEmptyChat = () => {
    return (
      <View >
        <Image
          source={Images.search_not_value}
          style={{ width: 60, height: 60, alignSelf: 'center', marginTop: 100, tintColor: Colors.gray }}
        />
        <Text
          style={{
            fontSize: 20,
            marginTop: 20,
            alignSelf: 'center',
            textAlign: 'center',
            color: Colors.gray
          }}
        >


          {i18next.t('NoData')}
        </Text>
      </View>
    )
  }
  loadMore = () => {
    if (this.state.isLoadMore === true) {
      return
    }

    this.props.setIsLoadMore()
  }

  pullRefresh = () => {
    if (this.props.refreshing === true) {
      return
    }
    this.props.setRefreshing()
  }

  renderItemChat = ({ index, item }) => {

    const data = { index, room: item }
    return (
      <TouchableOpacity onPress={() => {
        this.onPressMessageCell(data)
      }}>
        <InboxChatView
          data={data} />
      </TouchableOpacity>
    )
  }



  onPressMessageCell = ({ index, room }) => {
    gotoChatScreen(this.props.componentId, room)
  }

  keyExtractor = (item, index) => item.user_id.toString();

  getTitleType = (typeId) => {
    try {
      typeId = parseInt(typeId)
    } catch { }
    switch (typeId) {
      case TYPES.AGENT:
        return i18next.t('ListAgentTitle')
      case TYPES.GUIDE:
      default:
        return i18next.t('ListGuideTitle')
    }
  }

  renderItem = ({ item, index }) => {

    return (
      <View>
        {
          item.is_header && <View style={styles.titleContainer}>
            <Text style={styles.txtTitle}>{this.getTitleType(item.is_agent)}</Text></View>
        }
        <UserItemView
          item={item}
          index={index}
          onPressUserProfile={this.onPressUserProfile}
          onPressChatButon={this.onPressChatButon}
        />
      </View>

    )
  }
  renderEmpty = () => {

    const { is_searching } = this.props;
    if (is_searching) {
      return null
    }

    return (<View style={styles.emptyView}>
      <Text style={{ fontSize: 14, color: Colors.black_1, textAlign: 'center' }}>
        {i18next.t('resultSearch')}
      </Text>
    </View>)
  }
  renderBottom = () => {
    const { is_searching } = this.props;
    return (<View style={{ height: 40, justifyContent: 'center' }}>
      {is_searching ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
    </View>)
  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F1F7F5',
    paddingTop: 2
  },
  titleContainer: {
    backgroundColor: '#F8F8FF',
    paddingLeft: 10,
    paddingVertical: 10,
  },
  emptyView: {
    flex: 1,
    // height:1000,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100

  },
  txtTitle: {
    fontWeight: 'bold',
    fontSize: 17,
  }
})
