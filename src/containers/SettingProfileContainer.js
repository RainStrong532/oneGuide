

import { connect } from 'react-redux';
import { login, getMyInfo, uploadFile, updateInfo } from '../actions';
import SettingProfileComponent from '../component/SettingProfileComponent'

const mapStateToProps = state => {
  const { user, auth } = state
  return {
    user: user,
    auth: auth,
  };
};

const SettingProfileContainer = connect(
  mapStateToProps,
  {
    login,
    getMyInfo,
    uploadFile,
    updateInfo
  }
)(SettingProfileComponent);

export default SettingProfileContainer;
