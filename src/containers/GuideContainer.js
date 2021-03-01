import { connect } from 'react-redux';

import { getAgentHomePage, getSearch } from '../actions/tour-action'
import GuideComponent from '../component/GuideComponent'
import { likePostAgent } from '../actions/post-action'

const mapStateToProps = state => {
    const { posts, user } = state

    return {
        item: posts && posts.postAgentHome ? posts.postAgentHome : [],
        user: user
    }
};

const GuideContainer = connect(
    mapStateToProps, {
        getAgentHomePage,
        getSearch,
        likePostAgent

    }
)(GuideComponent);

export default GuideContainer;