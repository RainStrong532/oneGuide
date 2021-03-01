import { connect } from 'react-redux';
import { applyPost } from '../actions';
import PostListComponent from '../component/PostListComponent'
const mapStateToProps = state => {
    const { user } = state
    return {
    };
};
const PostListContainer = connect(
    mapStateToProps,
    {
        applyPost
    }
)(PostListComponent);
export default PostListContainer;