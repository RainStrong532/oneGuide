import { connect } from 'react-redux';

import Friend from '../component/FriendList'
import { getUserFriendList, getUserRequest, sendEmail } from '../actions'

const mapStateToProps = state => {
  //const { user, posts } = state
  return {

  };
};

const FriendContainer = connect(
  mapStateToProps,
  {
    getUserFriendList,
    getUserRequest,
    sendEmail
  }
)(Friend);

export default FriendContainer;
