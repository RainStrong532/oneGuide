import { connect } from 'react-redux';
import { getMyInfo, uploadFile, verify, clearState } from '../actions';
import AccountVerificationComponent from '../component/AccountVerificationComponent'

const mapStateToProps = state => {
    const { user } = state
    return {
        user: user,
    };
};

const AccountVerificationContainer = connect(
    mapStateToProps, {
    getMyInfo,
    verify,
    uploadFile,
    clearState
}
)(AccountVerificationComponent);

export default AccountVerificationContainer;