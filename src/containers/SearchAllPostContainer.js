import { connect } from 'react-redux';
import { SearchAllPost, likeTotalPost } from '../actions';
import SearchAllPostComponent from '../component/search_all/SearchAllPost'

const mapStateToProps = state => {
    const { posts } = state
    return {
        totalPost: posts.totalPost
    };
};

const SearchAllPostContainer = connect(
    mapStateToProps,
    {
        SearchAllPost,
        likeTotalPost
    }
)(SearchAllPostComponent);

export default SearchAllPostContainer;
