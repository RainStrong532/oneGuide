import { connect } from 'react-redux';
import { changePassword } from '../actions';
import ChangePasswordComponent from '../component/ChangePasswordComponent'

const mapStateToProps = state => {
  const { user } = state
  return {
    user: user,
  };
};

const ChangePasswordContainer = connect(
  mapStateToProps,
  {
    changePassword
  }
)(ChangePasswordComponent);

export default ChangePasswordContainer;

