import { connect } from 'react-redux'
import MoreInfoComponent from '../component/profile-info/ProfileMoreInfo'
import { getUserFriendList, getOtherUserInfo } from '../actions'

const mapStateToProps = state => {

    const { user } = state
    return {
        user
    }
}

const MoreInfoContainer = connect(
    mapStateToProps,
    {
        getUserFriendList,
        getOtherUserInfo
    }
)(MoreInfoComponent)

export default MoreInfoContainer