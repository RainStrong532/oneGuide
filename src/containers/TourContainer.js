import { connect } from 'react-redux';
import {
  getMyInfo,
  getListApplied,
  getListUpcoming,
  getListDeparted,
  getListCanceled,
  getListFinished,
  applyPost,
  getListTourAgentInvite,
  guideConfirmInvited,
  guideCancelInvited,
  guideCancelTour,
  agentCancelGuide,
  getGuiFinish
} from '../actions';
import TourComponent from '../component/TourComponent'

const mapStateToProps = state => {
  const { user, tours } = state
  return {
    user,
    tours: state.tours ? state.tours.tours : [],
    listTourInvite: state.agentApplyGuiderReducer ? state.agentApplyGuiderReducer.listTourInvite : [],
    listTourUpcomming: state.tours ? state.tours.listTourUpcomming : [],
    listTourDeparted: state.tours ? state.tours.listTourDeparted : []
  };
};

const TourContainer = connect(
  mapStateToProps,
  {
    getMyInfo,
    getListApplied,
    getListUpcoming,
    getListDeparted,
    getListCanceled,
    getListFinished,
    applyPost,
    getListTourAgentInvite,
    guideConfirmInvited,
    guideCancelInvited,
    guideCancelTour,
    agentCancelGuide,
    getGuiFinish
  }
)(TourComponent);

export default TourContainer;
