import { connect } from 'react-redux';
import { getMyInfo, createPost, uploadFile, commentDetail, editPost } from '../actions';
import PostCreateComponent from '../component/PostCreateComponent'

const mapStateToProps = state => {
  const { user } = state
  return {
    user,
  };
};

const PostCreateContainer = connect(
  mapStateToProps,
  {
    getMyInfo,
    createPost,
    uploadFile,
    commentDetail,
    editPost
  }
)(PostCreateComponent);

export default PostCreateContainer;
