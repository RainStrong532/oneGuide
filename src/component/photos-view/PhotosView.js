import React from 'react';
import Device from '../../modules/Device'
import FastImage from 'react-native-fast-image';
import { FlatList } from 'react-native-gesture-handler';
import _ from 'lodash';
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native';

const initialLayout = {
    height: Device.screenSize().height,
    width: Device.screenSize().width,
};

const widthBigSquare = initialLayout.width * 2 / 3 - 2.5;
const widthSquare = (initialLayout.width - 10) * 1 / 3;
const BigImage = {
    width: initialLayout.width,
    height: initialLayout.width * 2 / 3 - 2.5
};

export default class PhotosView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }
    onPressShowImage = (item) => {
        if (this.props.onPressShowImage) {
            this.props.onPressShowImage(item);
        }
    }
    renderFourPhotos = () => {
        const { photos } = this.props;
        let pts = _.cloneDeep(photos);
        pts.shift();
        return (
            <View>
                {
                    this.renderImage(photos[0], styles.bigImage)
                }
                <View>
                    {this.renderThreePhotos(pts)}
                </View>
            </View>
        )
    }

    renderSixPhotos = (type) => {
        const { photos } = this.props;
        let pts_2 = _.cloneDeep(photos);
        pts_2.splice(0, 3);
        if (!type) {
            let pts_1 = _.cloneDeep(photos);
            pts_1.shift();
            pts_1.splice(2, 3);
            return (
                <View>
                    <View style={[styles.flex, { marginBottom: 2.5, width: initialLayout.width }]}>
                        {
                            this.renderImage(photos[0], styles.bigSquare)
                        }
                        <FlatList
                        removeClippedSubviews={false}
                            data={pts_1}
                            renderItem={this.renderItem}
                            keyExtractor={(item, index) => index}
                            listKey={(index2, index) => 'PV' + index.toString()}
                            contentContainerStyle={[styles.flexColumn, { height: widthBigSquare, width: widthSquare, marginLeft: 5 }]}
                        />
                    </View>
                    <View>
                        {this.renderThreePhotos(pts_2)}
                    </View>
                </View>
            )
        } else {
            let pts_1 = _.cloneDeep(photos);
            pts_1.splice(2, 4);
            return (
                <View>
                    <View style={[styles.flex, { marginBottom: 2.5, width: initialLayout.width }]}>
                        <FlatList
                        removeClippedSubviews={false}
                            data={pts_1}
                            renderItem={this.renderItem}
                            keyExtractor={(item, index) => index}
                            listKey={(index2, index) => 'PV' + index.toString()}
                            contentContainerStyle={[styles.flexColumn, { height: widthBigSquare, width: widthSquare }]}
                        />
                        {
                            this.renderImage(photos[2], styles.bigSquare)
                        }
                    </View>
                    <View>
                        {this.renderThreePhotos(pts_2)}
                    </View>
                </View>
            )
        }
    }
    renderThreePhotos = (data) => {
        const { item } = data;
        if (item) data = item;
        return (
            <FlatList
            removeClippedSubviews={false}
                data={data}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index}
                listKey={(index2, index) => 'PV' + index.toString()}
                contentContainerStyle={[styles.flex, { marginTop: 2.5, width: (data.length === 2) ? BigImage.height : null }]}
            />)
    }
    renderManyPhotos = () => {
        const { photos } = this.props;
        return (<FlatList
            removeClippedSubviews={false}
            data={_.chunk(photos, 3)}
            renderItem={this.renderThreePhotos}
            keyExtractor={(item, index) => index}
            listKey={(index2, index) => 'PV' + index.toString()}
        />
        )
    }

    renderItem = ({ item }) => this.renderImage(item);

    renderImage = (item, style, resizeMode) => {
        return (
            <TouchableOpacity
                onPress={() => { this.onPressShowImage(item) }}
            >
                <FastImage
                    style={[style ? style : styles.square, {backgroundColor: 'gray'}]}
                    source={{ uri: item.path }}
                    resizeMode={resizeMode ? resizeMode : FastImage.resizeMode.cover}
                />
            </TouchableOpacity>
        )
    }
    render() {
        let { photos, keyData } = this.props || [];
        return (
            photos
                ?
                (photos.length === 1)
                    ?
                    <View style={{ marginBottom: 5 }}>
                        {
                            this.renderImage(photos[0], styles.square)
                        }
                    </View>
                    :
                    <View style={{ marginBottom: 5 }}>
                        {(photos.length <= 4) ?
                            this.renderFourPhotos() :
                            (photos.length <= 6) ?
                                this.renderSixPhotos(keyData % 3 === 0) :
                                this.renderManyPhotos()
                        }
                    </View>
                :
                <View></View>
        )
    }
}

const styles = StyleSheet.create({
    bigImage: { width: BigImage.width, height: BigImage.height, },
    square: { width: widthSquare, height: widthSquare },
    bigSquare: { width: widthBigSquare, height: widthBigSquare, },
    flex: { display: 'flex', flexDirection: 'row', justifyContent: "space-between" },
    flexColumn: { display: 'flex', flexDirection: 'column', justifyContent: "space-between" },
    flexWrap: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }
})