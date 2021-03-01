import { connect } from 'react-redux';
import { login, getMyInfo, confirmAccount } from '../actions';
import LoginComponent from '../component/LoginComponent'

const mapStateToProps = state => {
  const { user, auth } = state
  return {
    user: user,
    auth: auth,
  };
};

const LoginContainer = connect(
  mapStateToProps,
  {
    login,
    getMyInfo,
    confirmAccount,
  }
)(LoginComponent);

export default LoginContainer;
