import { connect } from 'react-redux';
import { getMyInfo, updateProfileInfo } from '../actions';
import ProfileInformationComponent from '../component/ProfileInformationComponent'

const mapStateToProps = state => {
  const { user, auth } = state
  return {
    user: user,
  };
};

const ProfileInformationContainer = connect(
  mapStateToProps,
  {
    getMyInfo,
    updateProfileInfo
  }
)(ProfileInformationComponent);

export default ProfileInformationContainer;