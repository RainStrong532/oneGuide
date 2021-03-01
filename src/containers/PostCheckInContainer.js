import { connect } from 'react-redux';
import { getMyInfo, createPost, uploadFile, commentDetail, editPost, createPostCheckIn } from '../actions';
import CheckInPostComponent from '../component/CheckInPostComponent'

const mapStateToProps = state => {
  const { app } = state
  return {
    aPostcheckIn: app.ListInPost || null
  };
};

const CheckInPostContainer = connect(
  mapStateToProps,
  {
    getMyInfo,
    createPost,
    uploadFile,
    commentDetail,
    editPost,
    createPostCheckIn
  }
)(CheckInPostComponent);

export default CheckInPostContainer;
