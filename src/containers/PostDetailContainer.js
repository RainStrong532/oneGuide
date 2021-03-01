import { connect } from 'react-redux';
import {
  likePost,
  getListCommentPost,
  getListReplyComment,
  createComment,
  createReplyComment,
  likeComment,
  deletePost,
  commentDetail,
  deleteComment,
  editComment,
  applyPost,
  likePostNotification,
  createCommentNotification,
  createCommentSearchAll,
  createCommentSearchAllPost,
  likePostSearch,
  likeTourSearch,
  createCommentProfile,
  createCommentSearchTotalPost,
  createCommentSearchTotalTour,
  likenewfeedOther,
  getInfomationGroup

} from '../actions';
import PostDetailComponent from '../component/PostDetailComponent'

const mapStateToProps = state => {
  const { user, posts } = state
  return {
    user,
    posts
  };
};

const PostDetailContainer = connect(
  mapStateToProps,
  {
    likePost,
    getListCommentPost,
    getListReplyComment,
    createComment,
    createReplyComment,
    likeComment,
    deletePost,
    commentDetail,
    deleteComment,
    editComment,
    applyPost,
    likePostNotification,
    createCommentNotification,
    createCommentSearchAll,
    createCommentSearchAllPost,
    likePostSearch,
    likeTourSearch,
    createCommentProfile,
    createCommentSearchTotalPost,
    createCommentSearchTotalTour,
    likenewfeedOther,
    getInfomationGroup
  }
)(PostDetailComponent);

export default PostDetailContainer;
