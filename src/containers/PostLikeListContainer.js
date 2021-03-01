
import { connect } from 'react-redux';
import { getMyInfo, getLikeListPost } from '../actions';
import PostLikeListComponent from '../component/PostLikeListComponent'

const mapStateToProps = state => {
  const { user } = state
  return {
    user
  };
};

const PostLikeListContainer = connect(
  mapStateToProps,
  {
    getLikeListPost
  }
)(PostLikeListComponent);

export default PostLikeListContainer;