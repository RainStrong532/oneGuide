
import { connect } from 'react-redux';
import InvitationtoJoinTourComponent from '../component/InvitationtoJoinTourComponent'
import { getListTourAgentInvite, applyTourInvite } from '../actions/agent-apply-guider-action'

const mapStateToProps = (state) => {
    return {
        listTourInvite: state.agentApplyGuiderReducer ? state.agentApplyGuiderReducer.listTourInvite : []
    }

};

const InvitationtoJoinTourContainer = connect(
    mapStateToProps,
    {
        getListTourAgentInvite,
        applyTourInvite

    }
)(InvitationtoJoinTourComponent);

export default InvitationtoJoinTourContainer;