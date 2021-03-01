import { connect } from 'react-redux';
import { getMyInfo, getUserFriendList, getUserFriendListOther, searchUserFriendList } from '../actions';
import UserFriendListComponent from '../component/UserFriendListComponent'

const mapStateToProps = state => {
  const { user } = state
  return {
    user,
    DataListFirends: user && user.getListFriendsMeOrOther ? user.getListFriendsMeOrOther : []
  };
};

const UserFriendListContainer = connect(
  mapStateToProps,
  {
    getUserFriendList,
    searchUserFriendList,
    getUserFriendListOther
  }
)(UserFriendListComponent);

export default UserFriendListContainer;
