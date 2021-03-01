import { connect } from 'react-redux';
import { register, registerFinish } from '../actions';
import RegisterGuiderComponent from '../component/RegisterGuiderComponent'

const mapStateToProps = state => {
  const { user, auth } = state
  return {
    user: user,
    auth: auth,
  };
};

const RegisterGuiderContainer = connect(
  mapStateToProps,
  {
    register,
    registerFinish
  }
)(RegisterGuiderComponent);

export default RegisterGuiderContainer;
