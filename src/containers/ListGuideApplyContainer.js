import { connect } from 'react-redux';
import ListGuideApply from '../component/ListGuideApply'
import { getListGuideInvited, getListGuideApplyTour, handleAgentCancelInvited, getListGuideTour, getListTourAgentInvite, } from '../actions/agent-apply-guider-action'
import { applyUser, agentCancelGuide } from '../actions/post-action'
const mapStateToProps = state => {

    return {
        listGuideInvite: state.agentApplyGuiderReducer ? state.agentApplyGuiderReducer.listGuideInvited : [],
        listGuideApply: state.agentApplyGuiderReducer ? state.agentApplyGuiderReducer.listGuideApply : [],
        listGuideTour: state.agentApplyGuiderReducer ? state.agentApplyGuiderReducer.listGuideTour : [],
        listTourInvite: state.agentApplyGuiderReducer ? state.agentApplyGuiderReducer.listTourInvite : []
    };
};

const ListGuideApplyContainer = connect(
    mapStateToProps,
    {
        getListGuideInvited,
        getListGuideApplyTour,
        applyUser,
        handleAgentCancelInvited,
        getListGuideTour,
        getListTourAgentInvite,
        agentCancelGuide

    }
)(ListGuideApply);

export default ListGuideApplyContainer;
