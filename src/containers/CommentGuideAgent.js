import { connect } from 'react-redux';
import {

} from '../actions';
import CommentGuideAgentComponent from '../component/CommentGuideAgent'

const mapStateToProps = state => {
    const { user, comment } = state
    return {
        user,
        comment
    };
};

const CommentGuideAgent = connect(
    mapStateToProps, {

    }
)(CommentGuideAgentComponent);

export default CommentGuideAgent;