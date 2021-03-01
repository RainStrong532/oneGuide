import { connect } from 'react-redux';
import { getMyInfo, getUserFriendList, searchUserFriendLis, getRequestAddMeFriend, addFriend } from '../actions';
import RequestAddFriendListComponent from '../component/ListRequestAddFriendComponnet'

const mapStateToProps = state => {
    const { user } = state
    return {
        allDataFriend: user && user.requestAddFriend ? user.requestAddFriend : {},
        // ListAddFriend: user && user.requestAddFriend.user.requestAddFriend.data && user.requestAddFriend.data.listFriends ? user.requestAddFriend.data.listFriends : []
    };
};

const RequestAddFriendListContainer = connect(
    mapStateToProps,
    {
        getRequestAddMeFriend,
        addFriend
        // getUserFriendList,
        // searchUserFriendList
    }
)(RequestAddFriendListComponent);

export default RequestAddFriendListContainer;
