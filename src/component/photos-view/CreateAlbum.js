import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import i18next from 'i18next';
import { backScreen, showModalCancelPost, dimissModal } from '../../navigation';
import Colors from '../../constants/colors'
import Helper from '../../utils/Helper';
import { Loading } from '../../utils';
import CommonStyles from '../../constants/styles'
import DismissKeyboard from 'dismissKeyboard';
import Images from '../../assets/images'
import Device from '../../modules/Device'
import { Navigation } from 'react-native-navigation';
import _ from 'lodash'
import POST_TYPE from '../../constants/post-types'
import CameraRollComponent from '../CameraRollComponent'
import { uploadFile } from '../../actions'

const initialLayout = {
    height: Device.screenSize().height,
    width: Device.screenSize().width,
};

const ADD_IMAGE_OBJECT = 'AddImageObject'
const number_photo_in_row = 4

const UploadStatus = {
    none: 'none',
    uploading: 'uploading',
    upload_success: 'upload_success',
    upload_fail: 'upload_fail',
}
export default class CreateAlbum extends React.Component {
    constructor(props) {
        super(props);
        // bind
        Navigation.events().bindComponent(this);
        this.onPressDismiss = this.onPressDismiss.bind(this)
        this.onPressAddPhotos = this.onPressAddPhotos.bind(this)
        // init variables
        const showCameraRoll = this.post_type === POST_TYPE.IMAGE
        this.album = this.getAlbumDetails();
        const title = this.album ? this.album.title : ""
        const content = this.album ? this.album.content : ""
        const comment_id = this.album ? this.album.comment_id : ""
        this.all_photos = this.getAlbumPhotos(this.album);
        const photos = this.createPhotosFrom(this.all_photos)
        this.state = {
            photos,
            showCameraRoll,
            loading: true,
            title,
            content,
            comment_id,
            enable: true
        }
    }

    onPressAddPhotos = () => {
        DismissKeyboard()
        this.addPhoto = true
        if (this.all_photos.length >= 10) {
            return
        }

        this.setState({
            showCameraRoll: true
        })
    }
    getAlbumPhotos = (album) => {
        let photo = [];
        if (album && album.photo) {
            photo = album.photo.photos.map(item => {
                let pathUploaded;
                pathUploaded = item.path.split('/files/');
                pathUploaded = '/files/' + pathUploaded[1];
                return {
                    upload: UploadStatus.upload_success,
                    uri: item.path,
                    pathUploaded: pathUploaded
                }
            })
        }
        return photo;
    }
    getAlbumDetails = () => {
        let comment_id = this.props.data.data ? this.props.data.data.comment_id : undefined
        let album;
        if (comment_id) {
            album = this.props.data.user.listAlbum.find(item => {
                return item.comment_id === comment_id;
            })
        }
        return album;
    }
    onPressRemovePhoto = (photo) => {
        const index = _.findIndex(this.all_photos, { uri: photo.uri });
        this.all_photos.splice(index, 1);
        const photos = this.createPhotosFrom(this.all_photos)

        this.setState({
            photos,
        })
    }
    createPhotosFrom = (photos) => {
        let tempPhotos = _.cloneDeep(photos);
        tempPhotos.splice(0, 0, ADD_IMAGE_OBJECT);
        tempPhotos = _.chunk(tempPhotos, number_photo_in_row);
        return tempPhotos
    }

    doUploadPhoto = (photoUploaded) => {
        if (!photoUploaded) {
            return
        }

        const index = _.findIndex(this.all_photos, { uri: photoUploaded.uri });
        photoUploaded = { ...photoUploaded, upload: UploadStatus.uploading }
        this.all_photos.splice(index, 1, photoUploaded);
        const photos = this.createPhotosFrom(this.all_photos)
        this.setState({
            photos,
            enable: false
        })

        // upload file
        let uploadFile = this.props.data.uploadFile ? this.props.data.uploadFile : this.props.data.data.uploadFile
        uploadFile(photoUploaded)
            .then(data => {
                if (data.path) {
                    const index = _.findIndex(this.all_photos, { uri: photoUploaded.uri });
                    photoUploaded = { ...photoUploaded, upload: UploadStatus.upload_success, pathUploaded: data.path }
                    this.all_photos.splice(index, 1, photoUploaded);

                    const photos = this.createPhotosFrom(this.all_photos)

                    this.setState({
                        photos,
                        enable: true
                    })
                }
            })
            .catch(error => {
                const index = _.findIndex(this.all_photos, { uri: photoUploaded.uri });
                //  upload fail
                photoUploaded = { ...photoUploaded, upload: UploadStatus.upload_fail }
                this.all_photos.splice(index, 1, photoUploaded);
                const photos = this.createPhotosFrom(this.all_photos)

                this.setState({
                    photos,
                    enable: true
                })

            });
    }
    onPressDonePhotos = async (photos) => {
        this.setState({ enable: false });
        this.addPhoto = false
        let number_photos = (this.all_photos.length || 0) + (photos.length || 0)

        if (number_photos > 10) {
            const message_alert = i18next.t('PleaseSelectMax10Photo')
            Helper.showAlert('', message_alert,
                [
                    {
                        text: 'OK', onPress: () => {
                            this.setState({
                                showCameraRoll: false,
                            })
                        }
                    }
                ]
            )

            return
        }


        photos.forEach(new_photo => {
            new_photo = { ...new_photo, upload: UploadStatus.none }
            this.all_photos.push(new_photo)

            setTimeout(() => {
                // upload photo
                this.doUploadPhoto(new_photo)
            }, 1000);
        })

        this.all_photos = _.uniqBy(this.all_photos, 'uri')
        photos = this.createPhotosFrom(this.all_photos)

        this.setState({
            showCameraRoll: false,
            photos
        })

    }

    onPressBack = () => {
        backScreen(this.props.componentId);
        backScreen(this.props.componentId);
    }
    getParams = () => {
        const { title, content } = this.state;
        let photos = {}
        let index = 0
        this.all_photos.forEach(photo => {
            if (photo.pathUploaded) {
                photos = { ...photos, [index]: photo.pathUploaded }
                index += 1
            }
        })
        const typecomment = 'album';
        return {
            title,
            content,
            photos,
            typecomment
        }
    }

    renderTopBar() {
        const statusBarHeight = Device.statusBarSize().height
        const topBarHeight = Device.topBarSize().height
        const { type } = this.props.data || 'create';
        const title = type === 'edit' ? i18next.t('EditAlbum') : i18next.t('CreateAlbum')
        return (
            <View style={[{ backgroundColor: Colors.white, }, { height: statusBarHeight + topBarHeight }]}>

                <View style={[{ height: topBarHeight, marginTop: statusBarHeight }]} >
                    <TouchableOpacity style={[styles.button_bar, { left: 12, }]} onPress={this.onPressDismiss} >
                        <Text style={[CommonStyles.text_nav_bar, { alignSelf: 'flex-start', }]}>{i18next.t('Cancel')}</Text>
                    </TouchableOpacity>

                    <View
                        // pointerEvents='none' 
                        style={{ flex: 1, position: 'absolute', justifyContent: 'center', left: 48, right: 48, height: topBarHeight, top: 0, paddingBottom: 4 }}>
                        <Text style={[CommonStyles.title_nav_bar, { alignSelf: 'center', }]}>{title}</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.button_bar, { right: 12 }]}
                        onPress={this.onPressRightBarButton}>
                        <Text style={[CommonStyles.text_nav_bar, { alignSelf: 'flex-end', }]}>{type === 'edit' ? "Sửa" : i18next.t('Create')}</Text>
                    </TouchableOpacity>

                </View>
                <View style={[CommonStyles.position_absolute_bottom, { height: 1, backgroundColor: Colors.light_gray }]} />
            </View>
        );
    }

    onPressDismiss = () => {
        //call ModalCancel
        //showModalCancelPost()

        DismissKeyboard()
        //  dimissModal(this.props.componentId)

        const callback = (type) => {
            if (type === 'Save_temp') {
                // console.log("adadfad");
                // DismissKeyboard()
                dimissModal(this.props.componentId)
                this.onPressBack();
            }
            if (type === 'Cancel_save') {
                // DismissKeyboard()
                dimissModal(this.props.componentId)
                this.onPressBack();
            }
        }
        showModalCancelPost(callback)
    }

    validateParams = (data) => {
        let message = null
        if (this.state.photos[0].length <= 1) {
            return i18next.t('NeedImage')
        }
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const element = data[key];
                if (!element && key !== 'content') {
                    return i18next.t(key + 'NotValid');
                }
            }
        }
        return message;
    }

    backScreen = () => {
        backScreen(this.props.componentId);
        // if(this.props.data.backScreen){
        //     this.props.data.backScreen();
        // }
    }
    onPressEditAlbum = () => {
        const data = this.getParams();
        const message = this.validateParams(data);
        if (message) {
            Helper.showAlert('', message,
                [
                    { text: 'OK', onPress: null },
                ])
            return;
        }
        Loading.showHud();
    }
    onPressRightBarButton = () => {
        if (!this.state.enable) {
            Helper.showAlert('', i18next.t('WaitImage'),
                [
                    {
                        text: 'OK', onPress: null
                    }
                ]
            )
            return;
        }
        const data = this.getParams();
        const message = this.validateParams(data);
        if (message) {
            Helper.showAlert('', message,
                [
                    { text: 'OK', onPress: null },
                ])
            return;
        }
        let handle = this.props.data.createAlbum ? this.props.data.createAlbum : this.props.data.editAlbum
        if (this.state.comment_id) { data.comment_id = this.state.comment_id }
        Loading.showHud();
        const user_id = this.props.data.user.me.user_id;
        handle(data)
            .then(res => {
                Loading.hideHud()
                if (res.data.messages ? res.data.messages.toLowerCase() === 'succes' : res.messages.toLowerCase() === 'succes') {
                    if(this.props.data.type === 'edit'){
                        this.props.data.onEdit(data.title, data.content);
                    }
                    Helper.showAlert('', this.props.data.type === 'edit' ? i18next.t('EditAlbumSuccess') : i18next.t('CreateAlbumSuccess'),
                        [
                            {
                                text: 'OK', onPress: () => {
                                    this.backScreen(); this.props.data.getUploadImage({ user_id: user_id, page: 1 });
                                    if (this.props.data.doGetPhoto) {
                                        this.props.data.doGetPhoto();
                                    }
                                }
                            }
                        ]
                    )
                } else {
                    Helper.showAlert('', this.props.data.type === 'edit' ? i18next.t('EditAlbumFail') : i18next.t('CreateAlbumFail'),
                        [
                            {
                                text: 'OK', onPress: null
                            }
                        ]
                    )
                }
            })
            .catch(error => {
                Loading.hideHud()
                Helper.showErrorAlert('', error)
            });
    }

    renderItem = ({ index, item }) => {

        const imageWidth = (Device.screenSize().width - 20) / number_photo_in_row
        return (
            <View style={{ marginHorizontal: 10, height: imageWidth, backgroundColor: 'transparent', flexDirection: 'row' }} >
                {
                    item.map((data) => {

                        if (data === ADD_IMAGE_OBJECT) {
                            return (
                                <View
                                    key={ADD_IMAGE_OBJECT}
                                    style={[
                                        {
                                            height: imageWidth,
                                            width: imageWidth,
                                            justifyContent: 'center',
                                        }
                                    ]}>
                                    <TouchableOpacity
                                        style={[
                                            styles.photo,
                                            {
                                                flex: 1,
                                                justifyContent: 'center',
                                                borderWidth: 2,
                                                borderColor: Colors.light_gray,
                                            }
                                        ]}
                                        onPress={this.onPressAddPhotos}>
                                        <Image
                                            source={Images.image}
                                            style={{ width: 20, height: 20, alignSelf: 'center' }}
                                            resizeMode='contain'
                                        />
                                    </TouchableOpacity>
                                </View>
                            )
                        }

                        return (
                            <View
                                key={data.uri}
                                style={[
                                    {
                                        height: imageWidth,
                                        width: imageWidth,
                                        justifyContent: 'center',
                                    }
                                ]}>
                                <Image
                                    style={[styles.photo, { flex: 1 }]}
                                    source={{ uri: data.uri }}
                                    resizeMode='cover'
                                />
                                {
                                    (data.upload === UploadStatus.none ||
                                        data.upload === UploadStatus.upload_success) && (
                                        <TouchableOpacity
                                            style={[styles.button_remove_photo]}
                                            onPress={() => { this.onPressRemovePhoto(data) }}
                                        >
                                            <Image style={{ height: 18, width: 18, alignSelf: 'center', tintColor: Colors.white }}
                                                source={Images.close}
                                                resizeMode='cover' />
                                        </TouchableOpacity>
                                    )
                                }
                                {
                                    (data.upload === UploadStatus.uploading) &&
                                    <View style={[
                                        styles.photo,
                                        CommonStyles.position_absolute_full,
                                        CommonStyles.center,
                                        { backgroundColor: Colors.transparent, }
                                    ]}>
                                        <View style={[
                                            CommonStyles.position_absolute_full,
                                            { flex: 1, backgroundColor: Colors.black, opacity: 0.8 }
                                        ]}></View>
                                        <ActivityIndicator style={{ alignSelf: 'center' }} size='small' color={Colors.white} />
                                    </View>
                                }
                                {
                                    (data.upload === UploadStatus.upload_fail) &&
                                    <View style={[styles.photo, CommonStyles.position_absolute_full,
                                    { backgroundColor: Colors.red, opacity: 0.7 }]}>
                                    </View>
                                }
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    onPressCancelPhotos = () => {
        if (this.addPhoto !== true) {
            this.addPhoto = false
            this.onPressDismiss()
            return
        }

        this.setState({
            showCameraRoll: false,
        })
    }

    keyExtractor = (item, index) => index.toString();
    render() {
        const { showCameraRoll, photos } = this.state
        return (
            <View>
                {this.renderTopBar()}
                <View style={{ padding: 10 }}>
                    <View style={styles.view}>
                        <TextInput
                            style={{
                                marginHorizontal: 12,
                            }}
                            placeholder={i18next.t('AlbumName')}
                            autoFocus={this.autoFocus}
                            selectionColor={Colors.black}
                            value={this.state.title}
                            onChangeText={(text) => {
                                this.setState({ title: text })
                            }}
                        />
                    </View>
                    <View style={styles.viewDescription}>
                        <TextInput
                            multiline
                            style={[styles.text_input]}
                            autoFocus={this.autoFocus}
                            placeholder={i18next.t('AddDescription')}
                            selectionColor={Colors.black}
                            value={this.state.content}
                            onChangeText={(text) => this.setState({
                                content: text
                            })}
                            underlineColorAndroid='transparent'
                        />
                    </View>
                </View>
                <View>
                    <FlatList
                    removeClippedSubviews={false}
                        data={photos}
                        extraData={this.state}
                        keyExtractor={this.keyExtractor}
                        // ListHeaderComponent={this.renderHeader}
                        renderItem={this.renderItem}
                        keyboardShouldPersistTaps="always"
                    />
                </View>
                {
                    showCameraRoll
                    && <CameraRollComponent
                        style={[CommonStyles.position_absolute_full, { minHeight: initialLayout.height }]}
                        onPressCancel={this.onPressCancelPhotos}
                        onPressDone={this.onPressDonePhotos}
                    />
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    view: {
        height: 50,
        borderBottomColor: '#ccc',
        borderBottomWidth: 2,
    },
    viewDescription: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 2,
    },
    text_input: {
        marginHorizontal: 12,
        marginTop: 20,
        // height: 100,
        minHeight: 40,
        height: 200,
        // maxHeight: 200,
        marginBottom: 10,
        textAlignVertical: 'top'
    },
    button_bar: {
        justifyContent: 'center',
        alignItems: 'center',
        top: 2,
        width: 80,
        height: 40,
        position: 'absolute',
    },
    button_remove_photo: {
        position: 'absolute',
        top: 6,
        right: 5,
        height: 20,
        width: 20,
        borderRadius: 10,
    },
    photo: {
        margin: 5
    },
})