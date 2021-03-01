import { connect } from 'react-redux';
import ListTourAgentApplyGuide from '../component/ListTourAgentApplyGuide';
import { getListTourApplyGuider } from '../actions/agent-apply-guider-action'
import { agentApplyTour } from '../actions/post-action'
const mapStateToProps = state => {
    //const { agentApplyGuiderReducer } = state

    return {
        //   listTour: agentApplyGuiderReducer.listTourAgentApplyGuider ? agentApplyGuiderReducer.ListTourAgentApplyGuide : []
    };
};

const ListTourAgentApplyGuideContainer = connect(
    mapStateToProps,
    {
        getListTourApplyGuider,
        agentApplyTour
    }
)(ListTourAgentApplyGuide);

export default ListTourAgentApplyGuideContainer;
