import { connect } from 'react-redux';
import { getPhotoAlbum, getUploadImage, deleteAlbum, editAlbum } from '../actions';
import DetailPhotosComponent from '../component/photos-view/DetailPhotosComponent'

const mapStateToProps = state => {
    const { user } = state
    return {
        user: user,
    };
};

const DetailPhotosContainer = connect(
    mapStateToProps, {
        getUploadImage,
        getPhotoAlbum,
        deleteAlbum,
        editAlbum
    }
)(DetailPhotosComponent);

export default DetailPhotosContainer;