import { connect } from 'react-redux';
import {
    likePost,
    getListCommentPost,
    getListReplyComment,
    createCommentGuideAgent,
    createReplyComment,
    likeComment,
    deletePost,
    commentDetail,
    deleteComment,
    editComment,
    applyPost,
    likePostAgent,
} from '../actions';
import PostDetailComponent from '../component/PostDetailAgentGuide'

const mapStateToProps = state => {
    const { user, posts, comments, postAgentHome } = state
    return {
        user,
        posts,
        postAgentHome
    };
};

const PostDetailAgentGuide = connect(
    mapStateToProps, {
        likePost,
        getListCommentPost,
        getListReplyComment,
        createCommentGuideAgent,
        createReplyComment,
        likeComment,
        deletePost,
        commentDetail,
        deleteComment,
        editComment,
        applyPost,
        likePostAgent,
    }
)(PostDetailComponent);

export default PostDetailAgentGuide;