import { connect } from 'react-redux';
import {
    likePost,
    getListCommentPost,
    getListReplyComment,
    createComment,
    createReplyComment,
    deletePost,
    commentDetail,
    deleteComment,
    editComment,
    applyPost,
    likePostHomeGroup,
    createCommentHomeGroup,
    likeComment,
    deletePostHomeGroup
} from '../actions';
import PostDetailHomeGroup from '../component/PostDetailHomeGroup'

const mapStateToProps = state => {
    const { user, posts } = state
    return {
        user,
        posts
    };
};

const PostDetailHomeGroupContainer = connect(
    mapStateToProps,
    {
        likePost,
        getListCommentPost,
        getListReplyComment,
        createComment,
        createReplyComment,
        deletePost,
        commentDetail,
        deleteComment,
        editComment,
        applyPost,
        likePostHomeGroup,
        createCommentHomeGroup,
        likeComment,
        deletePostHomeGroup
    }
)(PostDetailHomeGroup);

export default PostDetailHomeGroupContainer;
