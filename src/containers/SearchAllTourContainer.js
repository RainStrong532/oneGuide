import { connect } from 'react-redux';
import { SearchAllTour, likeTotalTour, applyPost } from '../actions';
import SearchAllTourComponent from '../component/search_all/SearchAllTour'

const mapStateToProps = state => {
    const { posts, user } = state
    return {
        totalTour: posts.totalTour,
        user
    };
};

const SearchAllTourContainer = connect(
    mapStateToProps,
    {
        SearchAllTour,
        likeTotalTour, applyPost
    }
)(SearchAllTourComponent);

export default SearchAllTourContainer;
