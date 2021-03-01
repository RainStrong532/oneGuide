import { connect } from 'react-redux';
import { getMyInfo, getListApplied } from '../actions';
import PostSavedComponent from '../component/PostSavedComponent'

const mapStateToProps = state => {
  const { user, tours } = state
  return {
    user,
    tours
  };
};

const PostSavedContainer = connect(
  mapStateToProps,
  {
    getMyInfo,
    getListApplied,
  }
)(PostSavedComponent);

export default PostSavedContainer;
