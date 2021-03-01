import { connect } from 'react-redux';
import {
  getMyInfo,
  seachLocation,
  addFriend,
  findUser,
  likePost,
  likePostSearch,
  SearchAllUser,
  // getInfomationGroup
} from '../actions';
import SearchComponent from '../component/SearchComponent'

const mapStateToProps = state => {
  const { user } = state

  return {
    user: user,
  };
};

const SearchContainer = connect(
  mapStateToProps,
  {
    getMyInfo,
    seachLocation,
    // addFriend,
    findUser,
    likePost,
    likePostSearch,
    SearchAllUser,
    // getInfomationGroup,
  }
)(SearchComponent);

export default SearchContainer;
