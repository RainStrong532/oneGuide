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
    createCommentGroup,
    likenewfeedGroup
} from '../actions';
import PostDetailGroupComponent from '../component/PostDetailGroupComponent'

const mapStateToProps = state => {
    const { user, posts } = state
    return {
        user,
        posts
    };
};

const PostDetailGroupContainer = connect(
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
        createCommentGroup,
        likenewfeedGroup
    }
)(PostDetailGroupComponent);

export default PostDetailGroupContainer;
