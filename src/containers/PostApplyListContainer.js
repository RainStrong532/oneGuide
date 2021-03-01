
import { connect } from 'react-redux';
import { getMyInfo, getApplyListPost, applyUser } from '../actions';
import PostApplyListComponent from '../component/PostApplyListComponent.js'

const mapStateToProps = state => {
  const { user } = state
  return {
  };
};

const PostApplyListContainer = connect(
  mapStateToProps,
  {
    getApplyListPost,
    applyUser
  }
)(PostApplyListComponent);

export default PostApplyListContainer;