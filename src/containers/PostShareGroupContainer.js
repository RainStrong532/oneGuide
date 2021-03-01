import { connect } from 'react-redux';
import { getInfomationGroup } from '../actions';
import PostShareGroup from '../component/post-views/PostShareGroup'

const mapStateToProps = state => {

    return {

    };
};

const PostShareGroupContainer = connect(
    mapStateToProps,
    {
        getInfomationGroup
    }
)(PostShareGroup);

export default PostShareGroupContainer;
