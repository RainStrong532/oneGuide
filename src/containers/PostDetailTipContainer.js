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
    createCommentPostTip,
    likePostTip,
    deletePostHomeGroup,
    likeComment,
    getHotPostRelated,
    createCommentConcernTip
} from '../actions';
import PostDetailTipComponent from '../component/PostDetailTipComponent'

const mapStateToProps = state => {
    const { user, posts, tours } = state
    return {
        user,
        posts,
        //  listDataHot: tours && tours.listTrackingHistory ? tours.listTrackingHistory : []
    };
};

const PostDetailTipContainer = connect(
    mapStateToProps,
    {
        likeComment,
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
        createCommentPostTip,
        likePostTip,
        deletePostHomeGroup,
        getHotPostRelated,
        createCommentConcernTip
    }
)(PostDetailTipComponent);

export default PostDetailTipContainer;
