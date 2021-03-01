import { connect } from 'react-redux';
import { likeTourSearch } from '../actions';
import TourSearchUsersComponent from '../component/search_all/tourSearchUsers'

const mapStateToProps = state => {
    // const { user } = state
    return {
        // user,
    };
};

const TourSearchUserContainer = connect(
    mapStateToProps,
    {
        likeTourSearch,
    }
)(TourSearchUsersComponent);

export default TourSearchUserContainer;
