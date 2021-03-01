import { connect } from 'react-redux';
import AskedToJoinTheGroupComponent from '../component/AskedToJoinTheGroupComponent'
import { getToJoinGroup, confirm_Request } from '../actions/tour-action'


const mapStateToProps = (state) => {
    const list_Member = state.tours.appoval_member
    const status_Request = state.tours.status_member
    return {
        list_Member, status_Request
    }

};

const AskedToJoinTheGroupContainert = connect(
    mapStateToProps,
    {
        confirm_Request,
        getToJoinGroup
    }
)(AskedToJoinTheGroupComponent);

export default AskedToJoinTheGroupContainert;
