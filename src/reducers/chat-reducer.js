import {
  SUCCESS,
  GET_NEW_INBOX,
  GET_NEW_MESSAGES,
  MESSAGE_CHAT_RECEIVED,
  MESSAGE_CHAT_ADD_TEMP,
  MESSAGE_CHAT_SEEN,
  MESSAGE_CHAT_SHOW_INFO,
  SEARCH_INBOX
} from '../actions/action-types'
import _ from 'lodash';
import ChatHelper from '../utils/ChatHelper'

const initialState = {
  chatRooms: [],
  conversations: [],
  chatRoomsSearch: [],
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${GET_NEW_INBOX}_${SUCCESS}`: {

      // new state
      let newState = { ...state, chatRooms: action.payload };
      newState = _.cloneDeep(newState)
      return newState
    }
    case `${GET_NEW_MESSAGES}_${SUCCESS}`: {

      let conversation = action.payload
      let conversations = _.cloneDeep(state.conversations)
      ChatHelper.newMessagesRefactor(conversation, conversations)

      // new state
      let newState = { ...state, conversations };
      newState = _.cloneDeep(newState)
      return newState
    }
    case `${MESSAGE_CHAT_ADD_TEMP}`:
    case `${MESSAGE_CHAT_RECEIVED}`: {
      const message = _.cloneDeep(action.payload.message)
      let chatRooms = _.cloneDeep(state.chatRooms)
      let conversations = _.cloneDeep(state.conversations)

      ChatHelper.addMessageToConversations(message, chatRooms, conversations)

      // new state
      const newState = { ...state, chatRooms, conversations }
      return newState
    }
    case `${MESSAGE_CHAT_SEEN}`: {
      const message = _.cloneDeep(action.payload.message)
      let chatRooms = _.cloneDeep(state.chatRooms)
      let conversations = _.cloneDeep(state.conversations)
      ChatHelper.chanageMessageSendStatus(message, chatRooms, conversations)

      // new state
      const newState = { ...state, chatRooms, conversations }

      return newState
    }
    case `${MESSAGE_CHAT_SHOW_INFO}`: {

      const message = _.cloneDeep(action.payload.message)
      let conversations = _.cloneDeep(state.conversations)
      ChatHelper.showMessageInfo(message, conversations)

      // new state
      const newState = { ...state, conversations }

      return newState
    }
    case `${SEARCH_INBOX}_${SUCCESS}`:
      return {
        ...state,
        chatRoomsSearch: action.payload
      }
    default:
      return state
  }
}

export default chatReducer
