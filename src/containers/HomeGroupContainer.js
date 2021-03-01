import { connect } from 'react-redux';
import HomeGroupComponent from '../component/HomeGroupComponent'
import { joinGroupContainer, getDatagroup, outGroupContainer } from '../actions/tour-action'
import { likePostHomeGroup, deletePostHomeGroup, getInfomationGroup } from '../actions'
// import HomeGroupComponent from '../component/HomeGroupComponent'


const mapStateToProps = (state) => {
    // const { grade_Level_group_joined, grade_Level_group_orther, grade_Level_list_post, data_group } = state.tours;
    const user = state

    const submitted_request = state.tours ? state.tours.joinGroup : []

    return {
        submitted_request,
        grade_Level_group_joined: state.tours ? state.tours.grade_Level_group_joined : [],
        grade_Level_group_orther: state.tours ? state.tours.grade_Level_group_orther : [],
        grade_Level_list_post: state.tours ? state.tours.grade_Level_list_post : [],
        data_group: state.tours ? state.tours.data_group : [],
        user
    }

};

const HomeGroupContainer = connect(

    mapStateToProps,
    {
        joinGroupContainer,
        getDatagroup,
        outGroupContainer,
        likePostHomeGroup,
        deletePostHomeGroup,
        getInfomationGroup

    }
)(HomeGroupComponent);

export default HomeGroupContainer;
