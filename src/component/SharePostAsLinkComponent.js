import React, { Component } from 'react';
import {
  StyleSheet,
  View, Text,
  ScrollView,
  Image, ActivityIndicator, TextInput, TouchableOpacity, FlatList,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import _ from 'lodash'
import { dimissModal } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import Device from '../modules/Device'
import { i18next, Loading } from '../utils'
import DismissKeyboard from 'dismissKeyboard';
import CommonStyles from '../constants/styles'
import StringUtils from '../utils/StringUtils'
import PostShareView from './post-views/PostShareView'
import HeaderView from './views/HeaderView'
import Helper from '../utils/Helper';
import SocketManager from '../modules/SocketManager'
import UserSelectView from './tour-view/UserSelectView';

export default class SharePostAsLinkComponent extends Component {

  static options(passProps) {
    return {
      statusBar: {
        backgroundColor: 'transparent',
        visible: true,
        style: 'light'
      },
      topBar: {
        drawBehind: true,
        visible: false,
      },
    };
  }

  constructor(props) {
    super(props);

    // bind
    Navigation.events().bindComponent(this);
    this.onPressDismiss = this.onPressDismiss.bind(this)
    // this.onPressShare = this.onPressShare.bind(this)
    this.doGetListUserFriend = this.doGetListUserFriend.bind(this)
    this.onPressSelectButon = this.onPressSelectButon.bind(this)

    // init variables
    this.state = {
      content: '',
      enableShare: true,
      refreshing: false,
      isLoadMore: true,
      userFriends: []
    }
  }

  componentDidMount() {

  }

  componentDidAppear() {

    if (!this.didAppearFirst) {
      this.didAppearFirst = true
      this.doGetListUserFriend()
    }
  }

  componentDidDisappear() {

  }

  onPressDismiss = () => {
    DismissKeyboard()
    dimissModal(this.props.componentId)
  }


  // onPressShare = () => {

  //   const index = _.findIndex(this.state.userFriends, { checked: true });
  //   if (index < 0) {
  //     return
  //   }

  //   DismissKeyboard()

  //   this.state.userFriends.forEach(user => {
  //     if (user.checked === true) {
  //       this.sendLink(user)
  //     }
  //   })

  //   this.onPressDismiss()
  // }

  onPressSelectButon = (user) => {
    if (user.checked === true) {
      return
    }

    this.sendLink(user)

    // 
    let userFriends = _.cloneDeep(this.state.userFriends)
    const user_id = _.get(user, 'user_id').toString()

    const index = _.findIndex(userFriends, { user_id });

    if (index >= 0) {

      let user_select = userFriends[index]

      let checked = user_select.checked || false
      checked = !checked
      user_select = { ...user_select, checked }

      userFriends.splice(index, 1, user_select);

      this.setState({ userFriends })
    }

  }

  sendLink = (user) => {

    const user_id = _.get(user, 'user_id').toString()

    const conversation_id = _.get(user, 'conversation_id').toString()

    // get content
    const comment_id = _.get(this.props, 'data.comment_id')
    const content = StringUtils.formatNewline(this.state.content) || ''

    const type = 3
    const dataBody = {
      conversation_id,
      user_id,
      type,
      content,
      comment_id
    }
    // console.log(dataBody)
    // send message
    SocketManager.sendMessage(dataBody)
  }

  doGetListUserFriend = () => {
    this.props.getUserFriendList()
      .then(data => {
        const userFriends = data || []

        this.setState({
          userFriends,
          refreshing: false,
          isLoadMore: false
        })
      })
      .catch(error => {
      });
  }


  render() {
    const { data } = this.props
    const { refreshing, userFriends } = this.state

    // const index = _.findIndex(userFriends, { checked: true });
    // const titleRight = index >= 0 ? i18next.t('Share') : ''

    return (
      <View style={[styles.container]} >
        <HeaderView
          title={i18next.t('Share')}
          // titleRight={titleRight}
          titleLeft={i18next.t('Cancel')}
          tintColor={Colors.white}
          style={{ backgroundColor: Colors.green_1 }}
          onPressLeftBarButton={this.onPressDismiss}
        // onPressRightBarButton={this.onPressShare}
        />

        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: 'column' }}
          behavior='padding'
          keyboardVerticalOffset={0} >

          <ScrollView
          // keyboardShouldPersistTaps='always'
          >
            <TextInput
              multiline
              autoFocus={true}
              ref={(textInput) => { this.textInput = textInput }}
              style={[styles.text_input]}
              placeholder={i18next.t('SaySomethingAboutThisPost')}
              selectionColor={Colors.black}
              value={this.state.content}
              onChangeText={(text) => this.setState({
                content: text
              })}
              underlineColorAndroid='transparent'
            />

            <PostShareView
              style={{ marginBottom: 10 }}
              data={data}
            />
            <FlatList
            removeClippedSubviews={false}
              data={userFriends}
              extraData={userFriends}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
              refreshing={refreshing}
              onRefresh={this.pullRefresh}
              // onEndReached={this.loadMore}
              onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 10}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={this.renderBottom}
              ListEmptyComponent={this.renderEmpty}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }


  renderEmpty = () => {

    const { isLoadMore } = this.state
    if (isLoadMore) {
      return null
    }

    return (<View style={styles.emptyView}>
      <Text style={{ fontSize: 14, color: Colors.black_1, textAlign: 'center' }}>
        {i18next.t('ThereIsNoFriends')}
      </Text>
    </View>)
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
      this.doGetListUserFriend()
    })
  }

  renderItem = ({ item, index }) => {

    return (
      <UserSelectView
        item={item}
        index={index}
        onPressSelectButon={this.onPressSelectButon}
      />
    )
  }

  keyExtractor = (item, index) => index.toString();

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.white,

  },
  text_input: {
    marginHorizontal: 12,
    marginTop: 20,
    // height: 100,
    minHeight: 40,
    maxHeight: 300,
    marginBottom: 10,
    textAlignVertical: 'top'
  },
})
