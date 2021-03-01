import _ from 'lodash';
import ChatConfig from '../constants/chat-config'

const MAX_TIME_GROUP_MESSAGE_CHAT = 60 * 15
const default_options = {
  showAvatar: true,
  showInfo: false,
  top: true,
  bottom: true,
  send_status: ChatConfig.SendStatus.recevied,
  showDate: false
}

const addMessageToConversations = (newMessage, chatRooms, listConversations) => {


  // last message
  let lastMessage = null

  // get conversation
  const conversation_id = newMessage.conversation_id
  const indexConversation = _.findIndex(listConversations, { conversation_id });
  let conversation = listConversations[indexConversation]

  if (conversation) {
    let messages = conversation.messages || []

    // replace temp message
    const message_temp_id = newMessage.message_temp_id
    const index = _.findIndex(messages, { message_temp_id });

    if (index >= 0) {

      let tmp_chat = messages[index]
      tmp_chat = { ...tmp_chat, ...newMessage, send_status: ChatConfig.SendStatus.recevied }
      messages.splice(index, 1, tmp_chat)

      // lastMessage
      lastMessage = messages.slice(-1)[0]

    } else {

      // add new message
      createNewMessageOptions(messages, newMessage)

      // messages.push(message)
      messages.splice(0, 0, newMessage)

      // lastMessage
      lastMessage = newMessage
    }
  } else {
    // add new message
    let messages = []
    createNewMessageOptions(messages, newMessage)
    messages.push(newMessage)

    const seen = [{
      user_id: newMessage.user_id,
      last_seen_message_id: 0
    }]
    const conversation = { conversation_id, messages, seen }
    listConversations.push(conversation)

    // lastMessage
    lastMessage = newMessage
  }

  // chatroom
  const indexChatRoom = _.findIndex(chatRooms, { conversation_id });
  let chatRoom = chatRooms[indexChatRoom]

  // modify chat room
  if (chatRoom) {
    chatRoom.last_message_id = lastMessage.last_message_id
    chatRoom.message = lastMessage.message
    chatRoom.type = lastMessage.type
    chatRoom.image = lastMessage.image
    chatRoom.seen = lastMessage.seen
    chatRoom.send_status = lastMessage.send_status
  } else {
    // chatRooms.push(lastMessage)
  }

}

const chanageMessageSendStatus = (message, chatRooms, listConversations) => {

  // get conversation
  const conversation_id = message.conversation_id
  const indexConversation = _.findIndex(listConversations, { conversation_id });
  let conversation = listConversations[indexConversation]

  // modify chat room
  if (conversation) {

    let messages = conversation.messages || []

    // replace temp message
    const last_message_id = message.last_message_id
    const index = _.findIndex(messages, { last_message_id });
    if (index >= 0) {

      let tmp_chat = messages[index]
      tmp_chat = { ...tmp_chat, send_status: ChatConfig.SendStatus.seen }
      messages.splice(index, 1, tmp_chat)

      // last message
      if (index === messages.length - 1) {

        // chatroom
        const indexChatRoom = _.findIndex(chatRooms, { conversation_id });
        let chatRoom = chatRooms[indexChatRoom]

        // modify chat room
        if (chatRoom) {
          chatRoom.send_status = tmp_chat.send_status
        }
      }

    }
  }

}

const showMessageInfo = (message, conversations) => {


  // get conversation
  const conversation_id = message.conversation_id
  const message_id = message.message_id

  const indexConversation = _.findIndex(conversations, { conversation_id });
  let conversation = conversations[indexConversation]
  const messages = conversation.messages || []

  // 
  const indexMessageShow = _.findIndex(messages, (obj) => { return obj.options.showInfo === true });

  if (indexMessageShow >= 0) {
    let message_temp = messages[indexMessageShow]
    let options = { ...message_temp.options, showInfo: false }
    message_temp = { ...message_temp, options }
    messages.splice(indexMessageShow, 1, message_temp)
  }

  //
  const index = _.findIndex(messages, { message_id });
  if (index >= 0 &&
    index !== indexMessageShow) {
    let message_temp = messages[index]
    let options = { ...message_temp.options, showInfo: !message_temp.options.showInfo }
    message_temp = { ...message_temp, options }
    messages.splice(index, 1, message_temp)
  }

  conversation.messages = messages

}

const createNewMessageOptions = (messages, newMessage) => {

  // let lastMessage = messages.slice(-1)[0]
  let lastMessage = messages[0]
  messageOptions(lastMessage, newMessage)
}

const newMessagesRefactor = (conversation, conversations) => {

  let messages = conversation.messages

  for (let i = messages.length - 1; i > 0; i--) {
    let prevMessage = messages[i - 1]
    let newMessage = messages[i]
    messageOptions(newMessage, prevMessage)
    newMessage.send_status = ChatConfig.SendStatus.seen
    newMessage.conversation_id = conversation.conversation_id
  }

  const conversation_id = conversation.conversation_id
  const indexConversation = _.findIndex(conversations, { conversation_id });
  if (indexConversation >= 0) {
    conversations[indexConversation] = conversation
  } else {
    conversations.push(conversation)
  }

}

const messageOptions = (prev_message, message) => {

  let new_options = _.cloneDeep(default_options)

  if (prev_message) {
    let last_options = prev_message.options || _.cloneDeep(default_options)
    const prevTime = parseInt(prev_message.intime) || 0
    const currTime = parseInt(message.intime) || 0
    const compareTime = (currTime - prevTime) < MAX_TIME_GROUP_MESSAGE_CHAT

    if (prev_message.user_id === message.user_id) {
      if (compareTime) {
        last_options = { ...last_options, bottom: false, showAvatar: false }
        new_options = { ...new_options, showAvatar: true, top: false }
      } else {
        last_options = { ...last_options, bottom: true, showAvatar: false }
        new_options = { ...new_options, showAvatar: true, showDate: true }
      }

    }

    prev_message.options = last_options
  }

  message.options = new_options
}



export default {
  chanageMessageSendStatus,
  addMessageToConversations,
  showMessageInfo,
  newMessagesRefactor
}
