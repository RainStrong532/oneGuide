
import { connect } from 'react-redux';
import { likePost } from '../actions';
import ViewPhotoComponent from '../component/ViewPhotoComponent'

const mapStateToProps = state => {
  const { user, posts } = state
  return {
    user,
    posts
  };
};

const ViewPhotoContainer = connect(
  mapStateToProps,
  {
    likePost
  }
)(ViewPhotoComponent);

export default ViewPhotoContainer;
