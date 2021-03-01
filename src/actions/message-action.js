import _ from 'lodash';
import {
  createAction,
  GET_NEW_INBOX,
  GET_NEW_MESSAGES,
  MESSAGE_CHAT_ADD_TEMP,
  MESSAGE_CHAT_SHOW_INFO,
  SEARCH_INBOX
} from './action-types'
import NetworkManager from '../modules/NetworkManager'
import ApiConfig from '../config/api-config'

export function getListChatRooms(page) {

  return async function (dispatch, getState) {

    return NetworkManager.request(ApiConfig.message.listConversations(page))
      .then(response => {

        let conversations = _.get(response.data, 'data.messages') || []

        if (page !== 1) {
          const currentConversations = _.get(getState(), 'chat.chatRooms')
          conversations = _.concat(currentConversations, conversations)
        }

        dispatch(createAction(GET_NEW_INBOX, conversations, true))
        return Promise.resolve(conversations)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function getListMessages(data, page = 1) {

  return async function (dispatch, getState) {

    return NetworkManager.request(ApiConfig.message.listMessages(data, page))
      .then(response => {
        const conversation_id = data.convertstation_id
        let messages = _.get(response.data, 'data.messages').reverse()

        if (page !== 1) {

          const allConversations = _.get(getState(), 'chat.conversations')

          const indexConversation = _.findIndex(allConversations, { conversation_id });
          const currentMessages = allConversations[indexConversation].messages
          messages = _.concat(currentMessages, messages)
        }

        const conversation = { conversation_id, messages }
        dispatch(createAction(GET_NEW_MESSAGES, conversation, true))
        return Promise.resolve(conversation)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}
export function searchConversations(data) {

  return async function (dispatch, getState) {

    return NetworkManager.request(ApiConfig.message.searchConversations(data))
      .then(response => {
        let current = _.get(getState(), 'chat.chatRoomsSearch');
        let chatRooms = _.get(response.data, 'data.messages').reverse();

        if (data.page !== 1 && chatRooms && current !== chatRooms) {
          current = _.concat(current, chatRooms);
        }
        if (data.page === 1) {
          current = chatRooms;
        }
        dispatch(createAction(SEARCH_INBOX, current, true))
        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function createChatroom(data) {

  return async function (dispatch, getState) {

    return NetworkManager.request(ApiConfig.message.createChatroom(data))
      .then(response => {

        return Promise.resolve(response.data)
      })
      .catch(error => {
        return Promise.reject(error)
      });
  }
}

export function addTempChat(data) {
  return {
    type: MESSAGE_CHAT_ADD_TEMP,
    payload: { message: data }
  }
}

export function showMessageInfo(data) {
  return {
    type: MESSAGE_CHAT_SHOW_INFO,
    payload: { message: data }
  }
}
