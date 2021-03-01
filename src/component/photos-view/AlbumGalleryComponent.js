import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, RefreshControl, ActivityIndicator } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { backScreen, pushCreateAlbum, pushToDetailPhotos } from '../../navigation';
import Images from '../../assets/images'
import Colors from '../../constants/colors'
import CommonStyles from '../../constants/styles'
import { i18next, Loading } from '../../utils'
import _ from 'lodash'
import ImageAlbum from './ImageAlbum';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import Device from '../../modules/Device'
import images from '../../assets/images';

const initialLayout = {
    height: Device.screenSize().height,
    width: Device.screenSize().width,
};

export default class AlbumGalleryComponent extends Component {

    static options(passProps) {
        return {
            statusBar: {
                backgroundColor: 'transparent',
                visible: true,
                style: 'light'
            },
        };
    }

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);
        this.state = {
            refreshing: false,
            isLoadMore: true,
            listAlbum: []
        }
        page = 1
    }

    pullRefresh = () => {
        if (this.state.refeshing) {
            return
        }
        this.page = 1
        this.setState({ refeshing: true }, () => {
            this.doGetAlbumList(this.page)
        })
    }

    loadMore = () => {
        if (this.state.isLoadMore) {
            return
        }
        this.setState({ isLoadMore: true }, () => {
            this.doGetAlbumList(page);
        })
    }

    doGetAlbumList = (page) => {
        let data = { user_id: this.props.user.me.user_id, page: page }
        this.props.getAlbumList(data)
            .then(res => {
                // Loading.hideHud();
                let listAlbum = this.props.user.listAlbum;
                _.reverse(listAlbum)
                this.page++;
                this.setState({ listAlbum: listAlbum, isLoadMore: false, refeshing: false });
            })
            .catch(err => {
                // Loading.hideHud();
                this.setState({ isLoadMore: false, refeshing: false })
            })
    }

    componentDidMount() {
        this.doGetAlbumList(1)
    }

    componentDidAppear() {

    }

    componentDidDisappear() {

    }
    onPressAlbum = () => {
        pushCreateAlbum(this.props.componentId, { ...this.props });
    }
    onPressShowAlbumDetail = (data) => {
        data.getPhotoAlbum = this.props.getPhotoAlbum;
        data.type = 'album';
        data.uploadFile = this.props.uploadFile;
        pushToDetailPhotos(this.props.componentId, data)
    }
    renderItem = ({ item }) => {
        return (
            <ImageAlbum
                image_line={item.content ? true : false}
                image={item.photo ? item.photo.photos[0].path : ""}
                onPressAlbum={this.onPressShowAlbumDetail}
                item={item}
            />
        )
    }
    ListHeaderComponent = () => {
        return <ImageAlbum
            onPressAlbum={this.onPressAlbum}
        />
    }
    renderBottom = () => {
        const { isLoadMore } = this.state;
        return (<View style={{ height: 40, justifyContent: 'center', width: initialLayout.width }}>
            {isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
        </View>)
    }
    render() {
        const { refreshing, listAlbum } = this.state;

        return (
            <View style={[styles.container]}>
                <FlatList
                    removeClippedSubviews={false}
                    data={listAlbum}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => 'AG' + index}
                    ListHeaderComponent={this.ListHeaderComponent}
                    contentContainerStyle={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', paddingTop: 10, }}
                    onEndReached={this.loadMore}
                    ListFooterComponent={this.renderBottom}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={this.pullRefresh}
                        />
                    }
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.white
    }
})
