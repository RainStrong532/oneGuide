import { connect } from 'react-redux';
import { register, registerFinish } from '../actions';
import RegisterAgentComponent from '../component/RegisterAgentComponent'

const mapStateToProps = state => {
  const { user, auth } = state
  return {
    user: user,
    auth: auth,
  };
};

const RegisterAgentContainer = connect(
  mapStateToProps,
  {
    register,
    registerFinish
  }
)(RegisterAgentComponent);

export default RegisterAgentContainer;
