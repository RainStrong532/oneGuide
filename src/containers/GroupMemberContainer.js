import { connect } from 'react-redux';
import RequestPostGroupComponent from '../component/RequestPostGroupComponent'
import { getList_Approval, action_PostList_Confim_Delete } from '../actions/tour-action'


const mapStateToProps = (state) => {
    const { tours } = state
    return {
        listPostApproval: tours.listPostApproval,
        pageListApproval: tours.pageListApproval,

        pageListMembers: tours.pageListMembers
    }

};

const GroupMemberContainer = connect(
    mapStateToProps,
    {
        action_PostList_Confim_Delete,
        getList_Approval
    }
)(RequestPostGroupComponent);

export default GroupMemberContainer;
