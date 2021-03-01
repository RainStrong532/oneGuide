import { connect } from 'react-redux';
import { register, getMyInfo, login, confirmAccount, } from '../actions';
import RegisterComponent from '../component/RegisterComponent'

const mapStateToProps = state => {
  const { user, auth } = state
  return {
    user: user,
    auth: auth,
  };
};

const RegisterContainer = connect(
  mapStateToProps,
  {
    register,
    getMyInfo,
    login,
    confirmAccount,
  }
)(RegisterComponent);

export default RegisterContainer;
