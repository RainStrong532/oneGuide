import { connect } from 'react-redux';
import { resetPassword } from '../actions';
import ResetPasswordComponent from '../component/ResetPasswordComponent'

const mapStateToProps = state => {
  const { user } = state
  return {
    user: user,
  };
};

const ResetPasswordContainer = connect(
  mapStateToProps,
  {
    resetPassword
  }
)(ResetPasswordComponent);

export default ResetPasswordContainer;

