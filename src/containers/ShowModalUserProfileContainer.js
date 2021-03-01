import { connect } from 'react-redux';
import {
    getNewPosts,
    getOtherUserInfo,
    getNewPostsOtherUser,
    likePost, createPost,
    addFriend,
    getUserFriendList,
    uploadFile,
    updateProfileInfo,
    getMyInfo,
    updateInfo,
    doFavorite,
    getFriendListOtherUser,
    likenewfeedOther,
    applyPost,
    createPostUserProfile,
    deletePostProfile,
    getInfomationGroup
} from '../actions';
import UserProfileComponent from '../component/UserProfileComponent'

const mapStateToProps = state => {
    const { user } = state
    const posts = state.posts ? state.posts.newfeedOther : []
    return {
        user,
        posts
    };
};

const ShowModalUserProfileContainer = connect(
    mapStateToProps,
    {
        getNewPosts,
        getNewPostsOtherUser,
        likePost,
        createPost,
        getOtherUserInfo,
        addFriend,
        getUserFriendList,
        uploadFile,
        updateProfileInfo,
        getMyInfo,
        updateInfo,
        doFavorite,
        getFriendListOtherUser,
        likenewfeedOther,
        applyPost,
        createPostUserProfile,
        deletePostProfile,
        getInfomationGroup

    }
)(UserProfileComponent);

export default ShowModalUserProfileContainer;
