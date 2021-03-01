import { connect } from 'react-redux';
import { getUserFriendList } from '../actions';
import SharePostAsLinkComponent from '../component/SharePostAsLinkComponent'

const mapStateToProps = state => {
  const { user } = state
  return {
    user,
  };
};

const SharePostAsLinkContainer = connect(
  mapStateToProps,
  {
    getUserFriendList
  }
)(SharePostAsLinkComponent);

export default SharePostAsLinkContainer;
