// import React, { Component } from 'react';

// class InviteMemberContainer extends Component {
//     render() {
//         return (
//             <div>

//             </div>
//         );
//     }
// }

// export default InviteMemberContainer;

import { connect } from 'react-redux';
import InviteMemberComponnet from '../component/InviteMemberComponnet'
import { getUserFriendList, getUserFriendListAdd, inviteFriendMore } from '../actions'

import Helper from '../utils/Helper';

const mapStateToProps = (state) => {
    const { user } = state

    let list_Other = state.tours.list_Other
    return {
        friends: user && user.me && user.me.list_friends ? user.me.list_friends : [],
        list_Other
    }

};

const InviteMemberContainer = connect(
    mapStateToProps,
    {
        getUserFriendList,
        getUserFriendListAdd,
        inviteFriendMore

    }
)(InviteMemberComponnet);

export default InviteMemberContainer;