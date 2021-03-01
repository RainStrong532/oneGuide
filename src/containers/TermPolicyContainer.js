import { connect } from 'react-redux';
import {
    getTermAndPolicy
} from '../actions';
import TermPolicyComponent from '../component/TermPolicyComponent'

const mapStateToProps = state => {
    // const { user, tours } = state
    return {

    };
};

const TermPolicyContainer = connect(
    mapStateToProps,
    {
        getTermAndPolicy
    }
)(TermPolicyComponent);

export default TermPolicyContainer;
