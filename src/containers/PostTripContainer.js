import { connect } from 'react-redux'
import PostTripComponent from '../component/PostTrip'
import { getMyInfo, createPost, uploadFile, commentDetail, editPost } from '../actions';

const mapStateToProps = state => {
    const { user } = state
    return {
        user
    }
}

const PostTripContainer = connect(
    mapStateToProps,
    {
        getMyInfo,
        createPost,
        uploadFile,
        commentDetail,
        editPost
    }
)(PostTripComponent)

export default PostTripContainer