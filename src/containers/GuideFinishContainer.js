import { connect } from 'react-redux';

import GuideComponent from '../component/GuideComponent'
import GuideFinishComponent from '../component/GuideFinishComponent';
import { getGuiFinish } from '../actions'
const mapStateToProps = state => {

    return {
        listGuideFinish: state.agentApplyGuiderReducer ? state.agentApplyGuiderReducer.listGuideFinish : []

    }
};

const GuideFinishContainer = connect(
    mapStateToProps,
    {
        getGuiFinish
    }
)(GuideFinishComponent);

export default GuideFinishContainer;