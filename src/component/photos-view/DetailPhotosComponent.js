import React from 'react';
import Device from '../../modules/Device'
import FastImage from 'react-native-fast-image';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import _ from 'lodash';
import { Image, View, Text, Platform, Modal, Alert, Button, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import HeaderView from '../views/HeaderView'
import i18next from 'i18next';
import { backScreen, pushToImageGallery, showModalMoreOptionGallery, pushCreateAlbum } from '../../navigation';
import PhotosView from './PhotosView'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import Helper from '../../utils/Helper';
import { Loading } from '../../utils';
const initialLayout = {
    height: Device.screenSize().height,
    width: Device.screenSize().width,
};

let splitArray = (arr, num) => {
    let check = 0,
        newArr = [];
    if (!Array.isArray(num)) num = [6, 4, 6];
    do {
        newArr.push(arr.splice(0, num[check]));
        if (check === num.length - 1) check = 0;
        else check++;
    } while (arr.length !== 0)
    return newArr;
}
export default class DetailPhotosComponent extends React.Component {
    constructor(props) {
        super(props);
        let title = props.data.title || "";
        let content = props.data.content || "";
        this.state = {
            refeshing: false,
            isLoadMore: true,
            modalVisible: false,
            images: [],
            listImage: [],
            title,
            content
        }
        this.page = 1;
    }
    componentDidMount() {
        if (!this.didAppearFirst) {
            this.didAppearFirst = true
            this.doGetPhoto(1)
        }
    }
    componentDidAppear() {

    }
    doGetPhoto = (page) => {
        if (!page) {
            page = this.page;
        }
        let { comment_id, type } = this.props.data;
        let user_id = this.props.user_id;
        if (type === 'album') {
            let data = { user_id, comment_id, page }
            this.props.data.getPhotoAlbum(data)
                .then(res => {
                    let images = [], listImage = [];
                    images = this.props.user.albumDetail;
                    if (images.length !== 0) {
                        listImage = splitArray(_.cloneDeep(images), [6, 4, 6]);
                    }
                    this.setState({ listImage: listImage, images: images, isLoadMore: false, refeshing: false });
                    this.page++;
                })
                .catch(err => {
                    this.setState({ isLoadMore: false, refeshing: false })
                })
        }
        if (type === 'upload') {
            let data = { user_id, page }
            this.props.data.getUploadImage(data)
                .then(res => {
                    let images = [], listImage = [];
                    images = this.props.user.uploadImages;
                    //convert image upload
                    images = images.map(item => {
                        return {
                            path: item
                        }
                    })
                    if (images.length !== 0) {
                        listImage = splitArray(_.cloneDeep(images), [6, 4, 6]);
                    }
                    this.setState({ listImage: listImage, images: images, isLoadMore: false, refeshing: false });
                    this.page++;
                })
                .catch(err => {
                    this.setState({ isLoadMore: false, refeshing: false })
                })
        }

        if (type === 'group') {
            const group_id = this.props.passProps;
            let data = { group_id, page }
            this.props.data.getUploadImage(data)
                .then(res => {
                    let images = [], listImage = [];
                    images = this.props.user.uploadImagesGroup;
                    //convert image upload
                    images = images.map(item => {
                        return {
                            path: item
                        }
                    })
                    if (images.length !== 0) {
                        listImage = splitArray(_.cloneDeep(images), [6, 4, 6]);
                    }
                    this.setState({ listImage: listImage, images: images, isLoadMore: false, refeshing: false });
                    this.page++;
                })
                .catch(err => {
                    this.setState({ isLoadMore: false, refeshing: false })
                })
        }
    }
    pullRefresh = () => {
        if (this.state.refeshing) {
            return
        }
        this.page = 1;
        this.setState({ refeshing: true }, () => {
            console.warn("refeshing");
            this.doGetPhoto(1);
        })
    }

    loadMore = () => {
        if (this.state.isLoadMore) {
            return
        }
        this.setState({ isLoadMore: true }, () => {
            this.doGetPhoto(this.page);
        })
    }

    onPressBack = () => {
        backScreen(this.props.componentId);
    }

    renderExtraKey = (item, index) => {
        return index;
    }

    renderItem = ({ item, index }) => {
        return (
            <PhotosView
                keyData={index}
                {...this.props}
                photos={item}
                onPressShowImage={this.onPressShowImage}
            />
        )
    }
    onPressShowImage = (item) => {
        let index = _.findIndex(this.state.images, ['path', item.path]);
        pushToImageGallery(this.props.componentId, { listImage: this.state.images, index: index });
    }
    onPressCloseImage = () => {
        this.setState({ image: {} }, () => {
            this.setState({ modalVisible: false })
        })
    }
    renderBottom = () => {
        const { isLoadMore } = this.state;
        return (<View style={{ height: 40, justifyContent: 'center' }}>
            {isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
        </View>)
    }
    renderEmty = () => {
        return (
            <View>
                <Text style={{ textAlign: 'center', marginTop: 40, fontSize: 16 }}>
                    {this.state.isLoadMore ? "" : i18next.t('ThereIsNoPicture')}
                </Text>
            </View>
        )
    }

    onPressMoreOptionsButton = () => {
        const callback = (type) => {
            if (type === 'EDIT') {
                this.editAlbum();
            }
            if (type === 'DELETE') {
                this.deleteAlbum();
            } else if (type === 'CANCEL') {
            }
        }

        showModalMoreOptionGallery(callback)
    }
    deleteAlbum = () => {
        Helper.showAlert('', i18next.t('AreYouSureDelete'),
            [
                { text: i18next.t('No'), onPress: this.backScreen },
                { text: i18next.t('Yes'), onPress: () => { this.onPressDeleteAlbum() } }
            ])
    }
    onPressDeleteAlbum = () => {
        const { comment_id } = this.props.data;
        Loading.showHud();
        this.props.deleteAlbum(comment_id)
            .then(res => {
                Loading.hideHud();
                Helper.showAlert('', i18next.t('DeleteAlbumSuccess'),
                    [
                        { text: 'OK', onPress: this.onPressBack }
                    ])
            })
            .catch(res => {
                Loading.hideHud();
                Helper.showAlert('', i18next.t('DeleteAlbumFail'),
                    [
                        { text: 'OK', onPress: null }
                    ])
            })
    }
    editAlbum = () => {
        pushCreateAlbum(this.props.componentId, { ...this.props, type: 'edit', backScreen: this.onPressBack, doGetPhoto: this.doGetPhoto, onEdit: this.onPressEditAlbum })
    }
    onPressEditAlbum = (title, content) => {
        this.setState({ title: title, content: content });
    }
    render() {
        const { type } = this.props.data;
        const { style } = this.props;
        const { refeshing, modalVisible, image, listImage, content, title } = this.state;

        return (
            <View style={{ backgroundColor: Colors.white, flex: 1 }}>
                {
                    type === 'album'
                        ?
                        <HeaderView
                            back={true}
                            title={title ? title : content}
                            tintColor={Colors.white}
                            style={{ backgroundColor: Colors.green_1 }}
                            onPressLeftBarButton={this.onPressBack}
                            imageRight={Images.post_more_options}
                            onPressRightBarButton={this.onPressMoreOptionsButton}
                        />
                        :
                        null
                }

                <FlatList
                    removeClippedSubviews={false}
                    contentContainerStyle={[style ? style : { paddingBottom: 20 }, { width: '100%', minHeight: '100%', marginTop: 5 }]}
                    renderItem={this.renderItem}
                    keyExtractor={this.renderExtraKey}
                    data={listImage}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 10}
                    listKey={(item2, index) => 'DP' + index.toString()}
                    ListFooterComponent={this.renderBottom}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={1}
                    refreshControl={
                        <RefreshControl
                            refreshing={refeshing}
                            onRefresh={this.pullRefresh}
                        />
                    }
                    ListEmptyComponent={this.renderEmty}
                />
            </View>
        )
    }
}