
import { connect } from 'react-redux';
import { login, getMyInfo } from '../actions';
import TutorialComponent from '../component/TutorialComponent'

const mapStateToProps = state => {
  const { user, auth } = state
  return {
    user: user,
    auth: auth,
  };
};

const TutorialContainer = connect(
  mapStateToProps,
  {
    login,
    getMyInfo
  }
)(TutorialComponent);

export default TutorialContainer;
