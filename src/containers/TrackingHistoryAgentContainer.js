
import { connect } from 'react-redux';
import { login, getMyInfo } from '../actions';
import TrackingHistoryAgentComponent from '../component/TrackingHistoryAgentComponent'

const mapStateToProps = state => {
    const { user, auth } = state
    return {
        user: user,
        auth: auth,
    };
};

const TrackingHistoryAgentContainer = connect(
    mapStateToProps,
    {

    }
)(TrackingHistoryAgentComponent);

export default TrackingHistoryAgentContainer;