import { connect } from 'react-redux';
import {
  addTempChat,
  getListMessages,
  showMessageInfo,
  createChatroom
} from '../actions';
import ChatComponent from '../component/ChatComponent'

const mapStateToProps = state => {
  const { user, chat } = state
  return {
    user,
    conversations: chat.conversations
  };
};

const ChatContainer = connect(
  mapStateToProps,
  {
    addTempChat,
    getListMessages,
    showMessageInfo,
    createChatroom
  }
)(ChatComponent);

export default ChatContainer;
