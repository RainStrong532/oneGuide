import { connect } from 'react-redux';
import InformationGroup from '../component/InformationGroupComponent'
import { getInfomationGroup, joinGroupContainer, outGroupContainer, outGroupInviteContainer } from '../actions/tour-action'
// import HomeGroupComponent from '../component/HomeGroupComponent'
import Helper from '../utils/Helper';

const mapStateToProps = (state) => {
    // const infoGroup = state.tours.infoGroup
    const { tours } = state
    return {
        // infoGroup
        infoGroup: tours && tours.infoGroup ? tours.infoGroup : {}
    }

};

const InformationGroupContainer = connect(
    mapStateToProps,
    {
        getInfomationGroup,
        joinGroupContainer,
        outGroupContainer,
        outGroupInviteContainer
    }
)(InformationGroup);

export default InformationGroupContainer;
