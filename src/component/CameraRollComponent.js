import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
  CameraRoll,
  PermissionsAndroid,
  ImageStore
} from 'react-native';

import { Navigation } from 'react-native-navigation';
import { dimissModal, showModalCamera } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import POST_TYPE from '../constants/post-types'
import HeaderView from './views/HeaderView'
import Device from '../modules/Device'
import { i18next, Loading } from '../utils'
import DismissKeyboard from 'dismissKeyboard';
import CreateTourView from './create-post/CreateTourView'
import CommonStyles from '../constants/styles'
import _ from 'lodash'
import FastImage from 'react-native-fast-image'
import { backScreen } from '../navigation';
import RNFetchBlob from 'react-native-fetch-blob'

class ImageButtonView extends Component {

  static propTypes = {
  }

  constructor(props) {
    super(props);
  }

  onPress = () => {
    if (this.props.onPress) {
      this.props.onPress(this.props.data)
    }
  }

  shouldComponentUpdate = (nextProps) => {
    return nextProps.selected !== this.props.selected
  }

  render() {
    const { uri, selected, style } = this.props
    let styleSelected = {}
    if (selected === true) {
      styleSelected = { borderWidth: 4, borderColor: Colors.blue_1 }
    }

    return (
      <View style={[style]}>
        <TouchableHighlight
          style={[styleSelected, { flex: 1, margin: 2 }]}
          onPress={this.onPress} >
          <Image
            source={{ uri }}
            resizeMode='cover'
            style={{ flex: 1 }} />
        </TouchableHighlight>
      </View>
    );
  }
}


export default class CameraRollComponent extends Component {

  static options(passProps) {
    return {
      statusBar: {
        backgroundColor: 'transparent',
        visible: true,
        style: 'dark'
      },
    };
  }

  static defaultProps = {
    options: {}
  };

  constructor(props) {
    super(props);

    // bind
    // Navigation.events().bindComponent(this);

    // init variables
    this.arrPhotoSelect = []
    this.state = {
      photos: [['camera']],
      isLoadMore: false,
      lastCursor: null,
      noMorePhotos: false
    }
  }

  async componentDidMount() {

    let granted;
    if (Platform.OS === 'android') {
      const permissionResult = await PermissionsAndroid.requestMultiple(
        [PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE],
        {
          title: i18next.t('requestCameraTitle'),
          message: i18next.t('requestCameraMessage')
        }
      );
      granted = permissionResult[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED;
      // console.log("chay vao cho nay get ảnh library", granted);
    } else {
      granted = true;
    }

    if (granted) {
      this.getPhotos()
    }
  }

  getPhotos = () => {

    const fetchParams = {
      first: 20,
      assetType: 'All',
      //groupName:'Camera',
      //groupTypes: 'All',
    };

    if (Platform.OS === 'ios') {
      fetchParams.groupTypes = 'All'
      // fetchParams.groupName = "Camera",
      // fetchParams.groupName = "Photos"
    }

    if (this.state.lastCursor) {
      fetchParams.after = this.state.lastCursor;
    }

    CameraRoll.getPhotos(fetchParams)
      .then(r => {
        // console.log("lay ảnh trong may", r);
        let assets = r.edges.map((value) => {

          if (Platform.OS === 'ios') {
            const appleId = value.node.image.uri.substring(5, 41)

            const ext = 'JPG'

            const assetUri = `assets-library://asset/asset.${ext}?id=${appleId}&ext=${ext}`
            value.node.image.uri = assetUri
          }

          return {
            ...value.node.image,
            selected: false
          }

        })
        const nextState = { isLoadMore: false }

        if (assets.length > 0) {
          nextState.lastCursor = r.page_info.end_cursor
          if (!this.all_photos) {
            this.all_photos = assets
            this.all_photos.splice(0, 0, 'camera')
          } else {
            this.all_photos = [...this.all_photos, ...assets]
          }
          this.all_photos = _.uniqBy(this.all_photos, 'uri')
          nextState.photos = _.chunk(this.all_photos, 3);
        }
        this.setState(nextState)
      })
  }

  onPressCancel = () => {
    const show = _.get(this.props, 'options.show')
    if (show) {
      dimissModal(this.props.componentId)
    } else {
      this.props.onPressCancel()
    }
  }

  onPressDone = async () => {
    const photos = this.all_photos.filter((photo) => {
      return photo.selected === true
    })

    this.isCamera = false
    const show = _.get(this.props, 'options.show');
    const index = _.get(this.props, 'options.index')
    this.props.onPressDone(photos, index)
    if (show) {
      dimissModal(this.props.componentId)
    }
  }

  normalizeAndroidFilePath(path) {

    let previewData = path;
    if (previewData.startsWith('/')) {
      previewData = `file://${previewData}`;
    }
    return previewData;
  }

  getFileNameAndroid(name) {
    var array = name.split("/");
    return array.pop()
  }

  onPressPhoto = async (photo) => {


    let filePath = ''

    if (Platform.OS === 'android') {
      var RNGRP = require('react-native-get-real-path');
      filePath = await RNGRP.getRealPathFromURI(photo.uri)
      filePath = this.normalizeAndroidFilePath(filePath)
    }

    const index = _.findIndex(this.all_photos, { uri: photo.uri })
    let photoSelect = this.all_photos[index]
    const path = Platform.OS === 'android' ? filePath : photoSelect.uri
    const filename = Platform.OS === 'android' ? this.getFileNameAndroid(filePath) : photoSelect.uri.substring(36, 72)
    const selected = !photoSelect.selected


    photoSelect = {
      ...photoSelect,
      path,
      filename,
      selected
    }


    if (selected === true && !_.find(this.arrPhotoSelect, { path: photoSelect.path })) {
      this.arrPhotoSelect.push(photoSelect)
    } else if (selected === false && _.find(this.arrPhotoSelect, { path: photoSelect.path })) {
      const indexRemove = _.findIndex(this.arrPhotoSelect, { path: photoSelect.path })
      this.arrPhotoSelect.splice(indexRemove, indexRemove)
    }

    if (this.arrPhotoSelect.length > 10) {
      return
    }

    this.all_photos.splice(index, 1, photoSelect)

    // Get only 1 image
    if (this.props.options.getOneImage) {
      this.arrPhotoSelect = [photoSelect]
      this.all_photos = this.all_photos.map((item, idx) => {
        if (idx === 0)
          return item
        return { ...item, selected: idx === index }
      })
    }

    const photos = _.chunk(this.all_photos, 3);
    this.setState({ photos })
  }

  onPressCamera = async () => {
    const callback = (data) => {

      const photoSelect = { ...data, path: data.uri, selected: true }
      this.all_photos = [photoSelect]
      this.isCamera = true
      this.onPressDone()
    }

    showModalCamera(callback)
  }

  loadMore = () => {
    if (this.all_photos && !this.state.noMorePhotos && !this.state.isLoadMore) {
      this.setState({ isLoadMore: true }, () => { this.getPhotos(); });
    }
  }

  render() {
    const { photos } = this.state
    return (
      <View style={[this.props.style, styles.container]}>
        {this.renderTopBar()}
        <View style={{ flex: 1, backgroundColor: Colors.white, marginTop: 2, marginHorizontal: 2 }}>
          <FlatList
          removeClippedSubviews={false}
            data={photos}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            // refreshing={refreshing}
            // onRefresh={this.pullRefresh}
            onEndReached={this.loadMore}
            onEndReachedThreshold={Platform.OS === 'ios' ? 0.7 : 10}
          />
        </View>
      </View>
    );
  }

  keyExtractor = (item, index) => index.toString();

  renderTopBar() {
    const statusBarHeight = Device.statusBarSize().height
    const topBarHeight = Device.topBarSize().height

    return (
      <View style={[{ backgroundColor: Colors.white, }, { height: statusBarHeight + topBarHeight }]}>

        <View style={[{ height: topBarHeight, marginTop: statusBarHeight }]} >
          <TouchableOpacity style={[styles.button_bar, { left: 12, }]} onPress={this.onPressCancel} >
            <Text style={[CommonStyles.text_nav_bar, { alignSelf: 'flex-start', }]}>{i18next.t('Cancel')}</Text>
          </TouchableOpacity>

          <View pointerEvents='none' style={{ flex: 1, position: 'absolute', justifyContent: 'center', left: 48, right: 48, height: topBarHeight, top: 0, paddingBottom: 4 }}>
            <Text style={[CommonStyles.title_nav_bar, { alignSelf: 'center', }]}>{i18next.t('CameraRoll')}</Text>
          </View>

          <TouchableOpacity style={[styles.button_bar, { right: 12, }]} onPress={this.onPressDone}>
            <Text style={[CommonStyles.text_nav_bar, , { alignSelf: 'flex-end', }]}>{i18next.t('Done')}</Text>
          </TouchableOpacity>

        </View>
        <View style={[CommonStyles.position_absolute_bottom, { height: 1, backgroundColor: Colors.light_gray }]} />
      </View>
    );
  }


  renderItem = ({ index, item }) => {
    // console.log('item camera photo', item);
    const widthImage = (Device.screenSize().width - 4) / 3
    const styleImage = { height: widthImage, width: widthImage }

    return (
      <View style={{ height: widthImage, backgroundColor: Colors.white, flexDirection: 'row' }} >

        {
          item.map((data) => {

            if (data === 'camera') {
              return <View
                key={'camera'}
                style={[styleImage]}>
                <TouchableOpacity
                  style={[{ flex: 1, margin: 2, backgroundColor: Colors.light_gray }]}
                  onPress={this.onPressCamera} >
                  <Image
                    source={Images.camera}
                    resizeMode='center'
                    style={{ flex: 1, alignSelf: 'center', tintColor: Colors.gray }} />
                </TouchableOpacity>
              </View>
            }

            return (
              <ImageButtonView
                key={data.uri || data}
                style={[styleImage]}
                uri={data.uri}
                selected={data.selected}
                // index={{ index, 0 }}
                data={data}
                onPress={this.onPressPhoto}
              />
            )
          })
        }
        {/*         
        <ImageButtonView
          style={[styles.photo, styleImage]}
          uri={item[0].uri}
          selected={item[0].selected}
          // index={{ index, 0 }}
          onPress={this.onPressPhoto}
        />
        {
          (item.length > 1) &&
          <ImageButtonView
            style={[styles.photo, styleImage]}
            uri={item[1].uri}
            index={1}
          />
        }
        {
          (item.length > 2) &&
          <ImageButtonView
            style={[styles.photo, styleImage]}
            uri={item[2].uri}
            index={2}
          />
        } */}

      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  title: {
    alignSelf: 'center',
    color: Colors.green_1,
    // fontWeight: 'bold',
    fontSize: 16
    // fontFamily: Fonts.hiraKakuProW6
  },
  button_bar: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 2,
    width: 80,
    height: 40,
    position: 'absolute',
  },
  photo: {
    // margin: 1
  },
})
