import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, TouchableOpacity, Alert, Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { dimissModal } from '../../navigation';
import Images from '../../assets/images'
import Colors from '../../constants/colors'
import HeaderView from '../views/HeaderView'
import CommonStyles from '../../constants/styles'
import Device from '../../modules/Device'
import FastImage from 'react-native-fast-image';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { ReachabilityView, i18next, Loading } from '../../utils'
import _ from 'lodash'
import AlbumGalleryComponent from './AlbumGalleryComponent';
import DetailPhotosComponent from './DetailPhotosComponent'

export default class UploadGalleryComponent extends Component {

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
        }
    }

    componentDidMount() {

    }

    componentDidAppear() {

    }

    componentDidDisappear() {

    }
    render() {
        let getUploadImage;
        if (this.props.getUploadImageGroup) {
            getUploadImage = this.props.getUploadImageGroup
        } else {
            getUploadImage = this.props.getUploadImage
        }
        const data = {
            getUploadImage: getUploadImage,
            type: 'upload'
        }
        return (
            <View style={[styles.container]}>
                <DetailPhotosComponent
                    data={data}
                    style={{ paddingBottom: 0 }}
                    {...this.props}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    scene: {
        flex: 1,
    },
    activityIndicator: {
        marginTop: 100
    },
})
