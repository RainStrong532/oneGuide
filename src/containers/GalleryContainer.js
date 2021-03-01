import { connect } from 'react-redux';
import { uploadFile, getAlbumList, getPhotoAlbum, getUploadImage, createAlbum, editAlbum } from '../actions';
import GalleryComponent from '../component/GalleryComponent'

const mapStateToProps = state => {
    const { user } = state
    return {
        user: user,
    };
};

const GalleryContainer = connect(
    mapStateToProps, {
        uploadFile,
        getAlbumList,
        getPhotoAlbum,
        getUploadImage,
        createAlbum,
        editAlbum
    }
)(GalleryComponent);

export default GalleryContainer;