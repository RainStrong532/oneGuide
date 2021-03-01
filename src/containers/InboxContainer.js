import { connect } from 'react-redux';
import { getListChatRooms, searchConversations } from '../actions';
import InboxComponent from '../component/InboxComponent'

const mapStateToProps = state => {
  const { user, chat } = state
  return {
    user,
    chat
  };
};

const InboxContainer = connect(
  mapStateToProps,
  {
    getListChatRooms,
    searchConversations
  }
)(InboxComponent);

export default InboxContainer;
