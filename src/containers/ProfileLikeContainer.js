import { connect } from 'react-redux';
import { getMyInfo, getListTourGuideLike } from '../actions';
import ProfileLikeComponent from '../component/ProfileLikeComponent'

const mapStateToProps = state => {
    const {tour_guide_user} = state
    return {
        tour_guide_user
    };

};

const ProfileLikeContainer = connect(
    mapStateToProps,
    {
        getListTourGuideLike,
        getMyInfo
    }
)(ProfileLikeComponent);

export default ProfileLikeContainer;
