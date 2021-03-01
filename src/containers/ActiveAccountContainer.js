import { connect } from 'react-redux';

import { confirmAccount } from '../actions/auth-action'
import { getMyInfo, resendEmail } from '../actions/user-action'

import ActiveAccountComponent from '../component/ActiveAccountComponent'

const mapStateToProps = (state) => {


    return {

    }

};

const ActiveAccountContainer = connect(
    mapStateToProps,
    {
        confirmAccount,
        getMyInfo,
        resendEmail
    }
)(ActiveAccountComponent);

export default ActiveAccountContainer;
