import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, TouchableOpacity, Alert, Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { backScreen } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import HeaderView from './views/HeaderView'
import CommonStyles from '../constants/styles'
import Device from '../modules/Device'
import FastImage from 'react-native-fast-image';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { ReachabilityView, i18next, Loading } from '../utils'
import _ from 'lodash'
import AlbumGalleryComponent from './photos-view/AlbumGalleryComponent';
import UploadGalleryComponent from './photos-view/UploadGalleryComponent';

const initialLayout = {
  height: Device.screenSize().height,
  width: Device.screenSize().width,
};

const TabKey = {
  Upload: 'Upload',
  Album: 'Album',
}


export default class GalleryComponent extends Component {

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
      index: 0,
      routes: [
        { key: TabKey.Upload, title: i18next.t('Upload').toUpperCase() },
        { key: TabKey.Album, title: i18next.t('Album').toUpperCase() },
      ],
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

  onPressRightBarButton = () => {
    const callback = (data) => {

    }

    const data = {}
    showModalCalendarDayFree(data, { mitilchoise: false, disable: true }, callback)
  }

  _handleIndexChange = index => {
    this.setState({
      index,
    });
  }

  _renderTabBar = props => (
    <TabBar
      {...props}
      style={{ backgroundColor: Colors.white }}
      indicatorStyle={{ backgroundColor: Colors.green_1 }}
      renderLabel={this._renderLabel}
    />
  );

  _renderScene = ({ route }) => {

    switch (route.key) {
      case TabKey.Album:
        return (
          <AlbumGalleryComponent
            {...this.props}
            getAlbumList={this.props.getAlbumList}
            getPhotoAlbum={this.props.getPhotoAlbum}
            createAlbum={this.props.createAlbum}
            editAlbum={this.props.editAlbum}
            activeTab={route.key}

          />
        );
      case TabKey.Upload:
        return (
          <UploadGalleryComponent
            {...this.props}
            getUploadImage={this.props.getUploadImage}
            activeTab={route.key}

          />
        );
    }
  }

  _renderLabel = ({ route, focused }) => {
    return (
      <Text
        style={{ color: focused ? Colors.green_1 : Colors.black, fontSize: 16, fontWeight: '400', textAlign: 'center' }}>
        {route.title}
      </Text>
    );
  }

  onPressBack = () => {
    backScreen(this.props.componentId);
  }
  render() {
    return (
      <View style={[styles.container]}>
        <HeaderView
          title={i18next.t('Gallery')}
          tintColor={Colors.white}
          style={{ backgroundColor: Colors.green_1 }}
          back={true}
          onPressLeftBarButton={this.onPressBack}
        />

        <TabView
          lazy
          style={{}}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderTabBar={this._renderTabBar}
          onIndexChange={this._handleIndexChange}
          initialLayout={initialLayout}
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
