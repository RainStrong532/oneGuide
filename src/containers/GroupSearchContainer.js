import { connect } from 'react-redux';

import { joinGroupContainer } from '../actions/tour-action'
import GroupSearch from '../component/search_all/groupSearchUsers'

const mapStateToProps = state => {
    const { posts } = state

    return {
        item: posts && posts.postAgentHome ? posts.postAgentHome : []
    }
};

const GroupSearchContainer = connect(
    mapStateToProps,
    {
        joinGroupContainer

    }
)(GroupSearch);

export default GroupSearchContainer;
