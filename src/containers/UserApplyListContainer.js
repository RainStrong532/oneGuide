import { connect } from 'react-redux';
import { getMyInfo, getListUserApply } from '../actions';
import UserApplyListComponent from '../component/UserApplyListComponent'

const mapStateToProps = state => {
  const { user } = state
  return {
    user
  };
};

const UserApplyListContainer = connect(
  mapStateToProps,
  {
    getMyInfo,
    getListUserApply
  }
)(UserApplyListComponent);

export default UserApplyListContainer;
