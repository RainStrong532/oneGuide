import { connect } from 'react-redux';
import GroupComponent from '../component/GroupComponent'
import {
    getListItems, handleOutGroup, outGroupContainer,
    outGroupContainer_Your, getDatagroup, getMemberGroup,
} from '../actions/tour-action'
import { likenewfeedGroup, deletePostGroup } from '../actions/post-action'


const mapStateToProps = (state) => {
    const { tours, user } = state
    return {
        listPostGroup: tours && tours.listPostGroup ? tours.listPostGroup : [],
        pagePostGroup: tours && tours.pagePostGroup ? tours.pagePostGroup : [],
        user

    }

};

const GroupContainer = connect(
    mapStateToProps,
    {
        getListItems,
        handleOutGroup,
        outGroupContainer,
        outGroupContainer_Your,
        getDatagroup,
        likenewfeedGroup,
        getMemberGroup,
        deletePostGroup

    }
)(GroupComponent);

export default GroupContainer;
