import { connect } from 'react-redux';
import { getListGuideApplyTour, agentCancelGuide } from '../actions';
import ListGuideApplyTour from '../component/ListGuideApplyTour'

const mapStateToProps = state => {

    return {

    };
};

const ListGuideApplyTourContainer = connect(
    mapStateToProps,
    {
        getListGuideApplyTour,
        agentCancelGuide
    }
)(ListGuideApplyTour);

export default ListGuideApplyTourContainer;
