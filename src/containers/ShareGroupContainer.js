import { connect } from 'react-redux';
import { postShareGroup } from '../actions';
import shareGroupComponent from '../component/ShareGroupComponent'

const mapStateToProps = state => {
    // const { user } = state
    return {

    };
};

const ShareGroupContainer = connect(
    mapStateToProps,
    {
        postShareGroup
    }
)(shareGroupComponent);

export default ShareGroupContainer;
