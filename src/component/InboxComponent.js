import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { gotoChatScreen, pushToUserFriendList, backScreen } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import SearchBarView from './views/SearchBarView'
import HeaderView from './views/HeaderView'
import { i18next, Loading } from '../utils'
import CommonStyles from '../constants/styles'
import _ from 'lodash'
import SearchComponent from '../component/SearchComponent'
import InboxChatView from '../component/chat/InboxChatView'

export default class InboxComponent extends Component {

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
    this.doGetChatRooms = this.doGetChatRooms.bind(this)
    this.renderBottom = this.renderBottom.bind(this)
    this.pullRefresh = this.pullRefresh.bind(this)
    this.onPressDismissSearch = this.onPressDismissSearch.bind(this)
    this.page = 1
    this.searchPage = 1
    this.state = {
      isLoadMore: true,
      refreshing: false,
      isSearching: false,
      textSearch: "",
      searching: false,
      isLoadMoreSearch: false,
      refreshingSearch: false
    }
  }

  componentDidMount() {

  }

  componentDidAppear() {

    if (!this.didAppearFirst) {
      this.didAppearFirst = true

    }
    this.page = 1
    this.doGetChatRooms(this.page)
  }

  componentDidDisappear() {

  }

  onPressSearch = () => {
    this.setState({
      isSearching: true
    },
      () => {
        this.doSearchConversations();
      }
    )
  }

  onPressDismissSearch = () => {
    this.setState({
      isSearching: false,
      textSearch: ""
    })
  }

  onPressRightBarButton = () => {
    pushToUserFriendList(this.props.componentId, { isSearch: true })
  }
  onPressLeftBarButton = () => {
    this.onPressSearch();
  }
  onPressMessageCell = ({ index, room }) => {
    gotoChatScreen(this.props.componentId, room)
  }

  doGetChatRooms = (page) => {

    // request
    this.props.getListChatRooms(page)
      .then(data => {

        this.page = page + 1
        this.setState({
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

  doSearchConversations = (page) => {
    this.setState({ searching: true },
      () => {
        this.props.searchConversations({ keysearch: this.state.textSearch, page: page ? page : 1 })
          .then(res => {
            this.searchPage++;
            this.setState({ searching: false, isLoadMoreSearch: false, refreshingSearch: false })
          })
          .catch(err => {
            this.setState({ searching: false, isLoadMoreSearch: false, refreshingSearch: false })
          })
      }
    )
  }

  loadMore = () => {
    if (this.state.isLoadMore === true) {
      return
    }

    this.setState({ isLoadMore: true }, () => {
      this.doGetChatRooms(this.page)
    })
  }

  pullRefresh = () => {
    if (this.state.refreshing === true) {
      return
    }

    this.setState({ refreshing: true }, () => {
      this.doGetChatRooms(1)
    })
  }

  searchConversations = (page) => {
    this.doSearchConversations(page ? page : this.searchPage);
  }

  onChangeText = (text) => {
    this.setState({ searching: true })
    this.setState({ textSearch: text }, () => {
      this.searchPage = 1;
      this.doSearchConversations(1)
    });
  }
  onPressback = () => {
    backScreen(this.props.componentId)
  }

  setIsLoadMoreSearch = () => {
    this.setState({ isLoadMoreSearch: true },
      this.searchConversations()
    )
  }

  setRefreshingSearch = () => {
    this.setState({ refreshingSearch: true },
      this.searchConversations(1)
    )
  }

  render() {
    // console.log("dataRequestChatCO", this.props);
    const { refreshing, isSearching } = this.state

    let chatRooms = _.get(this.props, 'chat.chatRooms');
    chatRooms = chatRooms ? chatRooms.filter(item => item.ids) : [];

    return (
      <View style={[styles.container]}>
        {
          isSearching ?
            <>
              <SearchBarView

                imageRight={Images.new_message}
                onPressRightBarButton={this.onPressRightBarButton}
                onPressSearch={this.onPressSearch}
                onPressCancel={this.onPressDismissSearch}
                onChangeText={this.onChangeText}
                search_inbox={isSearching}
                back={true}
                holder='Search_username' />
            </>
            :
            <>
              <HeaderView
                onPressback={this.onPressback}
                title={i18next.t('Inbox')}
                tintColor={Colors.white}
                style={{ backgroundColor: Colors.green_1 }}
                imageRight={Images.new_message}
                imageLeft={Images.search}
                // back={true}
                onPressRightBarButton={this.onPressRightBarButton}
                onPressLeftBarButton={this.onPressLeftBarButton} />
            </>
        }
        <View style={{ flex: 1 }}>
          <FlatList
          removeClippedSubviews={false}
            // ref={innerRef}
            data={chatRooms}
            extraData={this.state}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            ListFooterComponent={this.renderBottom}
            refreshing={refreshing}
            onRefresh={this.pullRefresh}
            scrollEventThrottle={1}
            onEndReached={this.loadMore}
            onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 1}
          />

          {
            isSearching &&
            <SearchComponent
              style={[CommonStyles.position_absolute_full]}
              onPressDismiss={this.onPressDismissSearch}
              searching={this.state.searching}
              type='inbox'
              isLoadMore={this.state.isLoadMoreSearch}
              refreshing={this.state.refreshingSearch}
              setIsLoadMore={this.setIsLoadMoreSearch}
              setRefreshing={this.setRefreshingSearch}
              textSearch={this.state.textSearch}
              {...this.props} />
          }
        </View>
      </View>
    );
  }

  keyExtractor = (item, index) => (item['conversation_id'] || '').toString() + index.toString();

  renderItem = ({ index, item }) => {

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
  renderBottom() {
    const { isLoadMore } = this.state;
    return (<View style={{ height: 40, justifyContent: 'center', marginTop: 30 }}>
      {isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
    </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  activityIndicator: {
    marginTop: 100
  },
})
