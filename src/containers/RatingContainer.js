import { connect } from 'react-redux';
import RatingInfo from '../component/RatingInfo';
import { getReviewGuider, getListPostRatingInfo } from '../actions'

const mapStateToProps = state => {
  const { tours } = state
  return {
    listPostRatingInfo: tours && tours.listRatingInfo ? tours.listRatingInfo : []
  };
};

const RatingContainer = connect(
  mapStateToProps,
  {
    getReviewGuider,
    getListPostRatingInfo
  }
)(RatingInfo);

export default RatingContainer;
