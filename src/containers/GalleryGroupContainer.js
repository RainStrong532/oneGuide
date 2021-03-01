import { connect } from 'react-redux';
import { getUploadImageGroup } from '../actions';
import GalleryGroupComponent from '../component/GalleryGroupComponent'

const mapStateToProps = state => {
    const { user } = state
    return {
        user: user,
    };
};

const GalleryGroupContainer = connect(
    mapStateToProps, {
    getUploadImageGroup
}
)(GalleryGroupComponent);

export default GalleryGroupContainer;