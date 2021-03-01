import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { backScreen } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import HeaderView from './views/HeaderView'
import Device from '../modules/Device'
import { i18next } from '../utils'
import _ from 'lodash'

import DetailPhotosComponent from './photos-view/DetailPhotosComponent';

const initialLayout = {
    height: Device.screenSize().height,
    width: Device.screenSize().width,
};

export default class GalleryGroupComponent extends Component {

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
        if (!this.didAppearFirst) {
            this.didAppearFirst = true
        }
    }

    componentDidDisappear() {

    }

    onPressBack = () => {
        backScreen(this.props.componentId);
    }
    render() {
        const data = {
            getUploadImage: this.props.getUploadImageGroup,
            type: 'group'
        }
        return (
            <View style={[styles.container]}>
                <HeaderView
                    title={i18next.t('Gallery')}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                    back={true}
                    onPressLeftBarButton={this.onPressBack}
                />
                
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
