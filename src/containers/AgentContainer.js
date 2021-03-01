import { connect } from 'react-redux';

import { getAgentHomePage, getSearch } from '../actions/tour-action'
import AgentComponent from '../component/AgentComponent'
import { likePostAgent, applyPostTour } from '../actions/post-action'


const mapStateToProps = (state) => {
    const { posts, user } = state

    return {
        item: posts && posts.postAgentHome ? posts.postAgentHome : [],
        user: user
    }

};

const AgentContainer = connect(
    mapStateToProps, {
    getAgentHomePage,
    getSearch,
    likePostAgent,
    applyPostTour

}
)(AgentComponent);

export default AgentContainer;