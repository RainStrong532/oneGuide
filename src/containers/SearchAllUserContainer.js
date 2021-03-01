import { connect } from 'react-redux';
import { SearchAllUser, likeTotalPost, addFriend } from '../actions';
import SearchAllUserComponent from '../component/search_all/SearchAllUser'

const mapStateToProps = state => {
    const { posts } = state
    return {
        totalUser: posts && posts.totalUser ? posts.totalUser : []
    };
};

const SearchAllUserContainer = connect(
    mapStateToProps,
    {
        SearchAllUser,
        likeTotalPost,
        addFriend
    }
)(SearchAllUserComponent);

export default SearchAllUserContainer;
