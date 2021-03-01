import { connect } from 'react-redux';
import { getNewPosts, likePost, createPost, getDatagroup } from '../actions';
import SharePostComponent from '../component/SharePostComponent'

const mapStateToProps = state => {
  const { user, tours } = state
  return {
    user,
    listGroupJoined: tours.grade_Level_group_joined
  };
};

const SharePostContainer = connect(
  mapStateToProps,
  {
    createPost,
    getDatagroup
  }
)(SharePostComponent);

export default SharePostContainer;
