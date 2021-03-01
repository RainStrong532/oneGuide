import { connect } from 'react-redux';
import { getMyInfo } from '../actions';
import LaunchComponent from '../component/LaunchComponent'

const mapStateToProps = state => {
  const { user } = state
  return {
    user: user,
  };
};

const LaunchContainer = connect(
  mapStateToProps,
  {
    getMyInfo
  }
)(LaunchComponent);

export default LaunchContainer;
