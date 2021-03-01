import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Platform
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { backScreen } from '../navigation';
import _ from 'lodash'
import DismissKeyboard from 'dismissKeyboard';
import Device from '../modules/Device'
import Images from '../assets/images'
import Colors from '../constants/colors'
import ChatConfig from '../constants/chat-config'
import HeaderView from './views/HeaderView'
import { i18next } from '../utils'
import ImageUtils from '../utils/ImageUtils'
import InputMessageView from './views/InputMessageView'
import SocketManager from '../modules/SocketManager'
import { gotoCameraRollScreen } from '../navigation'
import POST_TYPE from '../constants/post-types'
import MessageView from '../component/chat/MessageView'

export default class ChatComponent extends Component {

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

    // bind
    Navigation.events().bindComponent(this);
    this.sendMessage = this.sendMessage.bind(this)
    this.sendLike = this.sendLike.bind(this)
    this.doGetMessages = this.doGetMessages.bind(this)
    this.scrollToEnd = this.scrollToEnd.bind(this)
    this.renderBottom = this.renderBottom.bind(this)
    this.pullRefresh = this.pullRefresh.bind(this)
    this.conversation_id = _.get(props, 'data.conversation_id')

    this.page = 1
    this.state = {
      messages: [],
      isLoadMore: true,
      refreshing: false,
      conversation_id: this.conversation_id
    }


  }

  componentDidMount() {

  }

  componentDidAppear() {
    if (!this.didAppearFirst) {
      this.didAppearFirst = true

      this.doGetMessages(this.page)

      // const conversation_id = _.get(this.props, 'data.conversation_id')
      if (!this.conversation_id) {
        this.doCreateChatroom()
      }



      // const conversation_id = _.get(this.props, 'data.conversation_id')
      // const user_id = _.get(this.props, 'data.recipients[0].user_id')
      // const data = {
      //   convertstation_id: conversation_id,
      //   user_id
      // }
      // this.doGetMessages(data)
    }
  }


  componentDidUpdate() {

    this.scrollToEndWhenSendMessage()

    // const { messages } = this.state
    // if (messages.length > 0) {
    //   if (!this.didScrollFirst) {
    //     this.didScrollFirst = true
    //     setTimeout(this.scrollToEnd, 0)
    //   }
    // }
  }

  static getDerivedStateFromProps(props, state) {
    const conversations = _.get(props, 'conversations')
    let conversation_id = _.get(props, 'data.conversation_id') || state.conversation_id
    if(conversation_id){
      conversation_id = conversation_id.toString();
    }
    const index = _.findIndex(conversations, { conversation_id });
    if (index < 0) {
      return null
    }
    const conversation = conversations[index]
    const messages = conversation.messages || []

    return {
      ...state,
      messages
    };
  }

  scrollToEnd = () => {
    // const index = this.state.messages.length - 1

    // if (index < 0) {
    //   return
    // }
    // this.flatList.scrollToIndex({ animated: true, index: 0, viewPosition: 1, viewOffset: 0 })

    // this.scrollView.scrollToEnd({ animated: true })
    this.flatList.scrollToOffset({ x: 0, y: 0, animated: true })
  }

  scrollToEndWhenSendMessage = () => {

    const lastMessage = this.state.messages.slice(-1)[0]
    const last_message_temp_id = _.get(lastMessage, 'message_temp_id')
    const message_temp_id = _.get(this.last_send_message, 'message_temp_id') || ''

    if (last_message_temp_id === message_temp_id) {
      this.last_send_message = null

      setTimeout(this.scrollToEnd, 0)
    }
  }

  onPressBack = () => {
    backScreen(this.props.componentId)
  }

  onPressShowMessageInfo = (message) => {
    const conversation_id = message.conversation_id || this.conversation_id
    // _.get(this.props, 'data.conversation_id')
    const new_message = { ...message, conversation_id }
    this.props.showMessageInfo(new_message)
  }

  onPressAddImage = () => {
    const callback = async (photos) => {
      photos.forEach(element => {
        ImageUtils.resizeDefault(element)
          .then(data => {
            ImageUtils.imagePathToBase64(data.path)
              .then(data => {
                this.onPressSendImage(data.base64)
              })
              .catch(error => {
              })
          })
          .catch(error => { })
      });
    }

    gotoCameraRollScreen(this.props.componentId, callback, callback)
  }

  socketBody = () => {
    const timestamps = Math.round(new Date().getTime())
    const user_me_id = _.get(this.props.user.me, 'user_id') || ''
    const message_temp_id = user_me_id + '_' + timestamps.toString()
    const conversation_id = this.conversation_id
    const user_id = _.get(this.props.data, 'user_id')
    const intime = (timestamps / 1000).toString()

    const dataBody = {
      conversation_id,
      user_id: user_me_id,
      message_temp_id,
      intime,
    }
    return dataBody
  }
  onPressSendImage = (imageBase64) => {
    // get content
    const commonBody = this.socketBody()
    const type = 1
    const dataBody = {
      ...commonBody,
      'images[]': imageBase64,
      type
    }
    this.props.addTempChat({ ...dataBody, send_status: ChatConfig.SendStatus.sending })
    this.last_send_message = dataBody

    // send message
    SocketManager.sendMessage(dataBody)
  }
  onPressSendMessage = (text, can_like) => {

    if (can_like === true) {
      this.sendLike()
      return
    }

    const content = this.inputMessageView.getText().trim()
    if (!content) {
      return
    }
    this.sendMessage(content)
    this.inputMessageView.clear()
  }

  sendMessage = (content) => {

    // get content
    const commonBody = this.socketBody()
    const type = 0
    const dataBody = {
      ...commonBody,
      content,
      type
    }
    dataBody.conversation_id = dataBody.conversation_id.toString();
    this.props.addTempChat({ ...dataBody, message: content, send_status: ChatConfig.SendStatus.sending })

    this.last_send_message = dataBody
    SocketManager.sendMessage(dataBody)

  }


  sendLike = () => {

    // get content
    const commonBody = this.socketBody()
    const type = 2
    const dataBody = {
      ...commonBody,
      type,
      image: 2
    }

    this.props.addTempChat({ ...dataBody, send_status: ChatConfig.SendStatus.sending })

    this.last_send_message = dataBody

    // send message
    SocketManager.sendMessage(dataBody)
  }

  doCreateChatroom = () => {
    // console.log("12345812812", this.props);
    const user_id = _.get(this.props, 'data.user_id')
    const data = {
      user_id
    }
    // request
    this.props.createChatroom(data)
      .then(data => {

        const status = _.get(data, 'status')
        if (status === 'RESULT_OK') {
          this.conversation_id = _.get(data, 'conversation_id');
          this.setState({conversation_id: _.get(data, 'conversation_id')})
        }
      })
      .catch(error => {
      });
  }
  doGetMessages = (page) => {
    let conversation_id = this.conversation_id;
    const user_id = _.get(this.props, 'data.user_id')
    if(conversation_id){
      conversation_id = conversation_id.toString();
    }
    const data = {
      convertstation_id: conversation_id,
      user_id
    }
    // request
    this.props.getListMessages(data, page)
      .then(data => {
        this.page = page + 1
        this.setState({
          refreshing: false,
          isLoadMore: false
        })
      })
      .catch(error => {
        this.page= page;
        this.setState({
          refreshing: false,
          isLoadMore: false
        })
      });
  }

  pullRefresh = () => {
    if (this.state.isLoadMore === true) {
      return
    }

    this.setState({ isLoadMore: true }, () => {
      this.doGetMessages(this.page)
    })
  }

  render() {
    const statusBarHeight = Device.statusBarSize().height
    const topBarHeight = Device.topBarSize().height
    const { messages, refreshing } = this.state
    const { data } = this.props
    let name_list = _.get(data, 'name_list') || ''
    name_list = name_list.toString().trim().replace(/\,$/g, '')

    return (
      <View style={[styles.container]}>
        <HeaderView
          title={name_list}
          tintColor={Colors.white}
          style={{ backgroundColor: Colors.green_1 }}
          back={true}
          onPressLeftBarButton={this.onPressBack}
        />

        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1, flexDirection: 'column', }}
            behavior='padding'
            keyboardVerticalOffset={statusBarHeight + topBarHeight}
          >
            <FlatList
              style={{ flex: 1 }}
              contentContainerStyle={{ justifyContent: 'flex-end', }}
              removeClippedSubviews={false}
              ref={ref => { this.flatList = ref }}
              data={messages}
              extraData={this.state}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
              enableEmptySections
              onEndReached={this.pullRefresh}
              ListFooterComponent={this.renderBottom}
              keyboardShouldPersistTaps='handled'
              scrollEventThrottle={100}
              onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 10}
              inverted
              automaticallyAdjustContentInsets={false}
            />
            <InputMessageView
              ref={ref => this.inputMessageView = ref}
              onPressSendMessage={this.onPressSendMessage}
              onPressAddImage={this.onPressAddImage}
              include_like={true}
              content
            />

          </KeyboardAvoidingView>
        </SafeAreaView>

      </View>
    );
  }

  keyExtractor = (item, index) => (item.message_temp_id || item.message_id).toString();

  renderItem = ({ index, item }) => {
    const my_user_id = _.get(this.props, 'user.me.user_id')
    const right = my_user_id === item.user_id
    return (
      <MessageView
        data={item}
        right={right}
        onPressShowMessageInfo={this.onPressShowMessageInfo}
      />
    )
  }

  renderBottom() {
    const { isLoadMore } = this.state;
    return (<View style={{ height: 40, justifyContent: 'center' }}>
      {isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
    </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.light_gray_3
  },
  touch_dismiss_keyboard: {
    flex: 1,
    justifyContent: 'center',
  },
  time_info: {
    textAlign: 'center',
    color: Colors.gray,
    fontSize: 12,
    lineHeight: 18,
    marginVertical: 6
  },
  seen_info: {
    color: Colors.gray,
    fontSize: 10,
    lineHeight: 16
  },
})
