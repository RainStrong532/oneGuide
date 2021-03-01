import { connect } from 'react-redux';
import { getMyInfo, logout, clearState, uploadFile, updateProfileInfo } from '../actions';
import ProfileComponent from '../component/ProfileComponent'

const mapStateToProps = state => {
  const { user } = state
  return {
    user: user,
  };
};

const ProfileContainer = connect(
  mapStateToProps,
  {
    getMyInfo,
    logout,
    clearState,
    uploadFile,
    updateProfileInfo
  }
)(ProfileComponent);

export default ProfileContainer;
