import { connect } from 'react-redux';
import MemberGroupComponent from '../component/MemberGroupComponent'
import { getMemberGroup } from '../actions/tour-action'



const mapStateToProps = (state) => {

    const { tours } = state
    return {
        listMembers: tours.listMember,
        pageListMembers: tours.pageListMembers
    }

};

const PostApprovalContainer = connect(
    mapStateToProps,
    {

        getMemberGroup,
    }
)(MemberGroupComponent);

export default PostApprovalContainer;
