import { connect } from 'react-redux';
import { reviewUser, getListGuideTourFinish, handleReviewUser } from '../actions';
import TourReviewComponent from '../component/TourReviewComponent'

const mapStateToProps = state => {
  const { user } = state
  return {
    user,
    listGuideFinish: state.agentApplyGuiderReducer ? state.agentApplyGuiderReducer.listGuideFinish : []
  };
};

const TourReviewContainer = connect(
  mapStateToProps,
  {
    reviewUser,
    getListGuideTourFinish,
    handleReviewUser
  }
)(TourReviewComponent);

export default TourReviewContainer;
