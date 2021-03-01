
import { connect } from 'react-redux';
import { login, getMyInfo, getTrackingHistory } from '../actions';
import TrackingHistoryGuideComponent from '../component/TrackingHistoryGuideComponent'

const mapStateToProps = state => {
    const { user, auth, tours } = state
    return {
        // user: user,
        // auth: auth,
        listTracking: tours && tours.listTracking ? tours.listTracking : []
    };
};

const TrackingHistoryGuideContainer = connect(
    mapStateToProps,
    {
        getTrackingHistory
    }
)(TrackingHistoryGuideComponent);

export default TrackingHistoryGuideContainer;