import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, SafeAreaView, Dimensions, TouchableOpacity, Platform, FlatList, StatusBar } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { dimissModal } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import CommonStyles from '../constants/styles'
import _ from 'lodash'
import Device from '../modules/Device'
import { RNCamera } from 'react-native-camera';
import i18next from 'i18next';

export default class CameraComponent extends Component {

  static options(passProps) {
    return {
      statusBar: {
        backgroundColor: 'transparent',
        visible: false,
        style: 'dark'
      },
    };
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.onDismiss = this.onDismiss.bind(this)
    this.onPressChangeTypeCamera = this.onPressChangeTypeCamera.bind(this)
    this.onPressTakePicture = this.onPressTakePicture.bind(this)
    this.onPressDone = this.onPressDone.bind(this)

    this.state = {
      cameraBack: true,
      cameraFlashOn: false,
      data: null
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

  onDismiss = () => {
    dimissModal(this.props.componentId)
  }

  onPressBackToCapture = () => {

    this.setState({
      data: null
    })
  }

  onPressTakePicture = async function () {
    if (this.camera) {
      let options = {
        quality: 0.8, base64: true,
        fixOrientation: true,
        orientation: 'portrait',
        // orientation: RNCamera.Constants.ORIENTATION_UP
      };
      if (this.state.cameraBack !== true) {
        options = { ...options, mirrorImage: true };
      }
      const data = await this.camera.takePictureAsync(options);

      this.setState({
        data
      })
    }
  };

  onPressChangeTypeCamera = () => {
    this.setState({
      cameraBack: !this.state.cameraBack
    })
  }

  onPressChangeFlashModeCamera = () => {
    this.setState({
      cameraFlashOn: !this.state.cameraFlashOn
    })
  };

  onPressDone = () => {
    const data = _.cloneDeep(this.state.data)
    this.props.onPressDone(data)
    this.onDismiss()
  }

  render() {
    const { data } = this.state
    const showImage = data || false
    return (
      <View style={[styles.container]}>
        <StatusBar hidden={true} />
        <SafeAreaView style={{ flex: 1 }}>
          {
            showImage ?
              this.renderImage() :
              this.renderCamera()
          }
        </SafeAreaView>
      </View>
    )
  }

  renderCamera() {
    const { cameraBack, cameraFlashOn, } = this.state
    const cameraType = cameraBack === true ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front
    const flashMode = cameraFlashOn === true ? RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off
    const imageFlashMode = cameraFlashOn === true ? Images.camera_flash_on : Images.camera_flash_off
    return (
      <View style={[styles.container]}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={cameraType}
          flashMode={flashMode}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
        />

        <View style={[
          CommonStyles.position_absolute_bottom,
          CommonStyles.center,
          {
            flexDirection: 'row',
            height: 100,
          }]
        }>
          <TouchableOpacity
            onPress={this.onPressTakePicture}
            style={styles.capture}>
          </TouchableOpacity>
        </View>

        <View style={[CommonStyles.position_absolute_top, { height: 50 }]}>
          <TouchableOpacity
            style={styles.close_button}
            onPress={this.onDismiss} >
            <Image
              source={Images.close}
              resizeMode='center'
              style={styles.close_image}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.front_button}
            onPress={this.onPressChangeTypeCamera} >
            <Image
              source={Images.camera_swich}
              resizeMode='center'
              style={styles.close_image}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.flash_button}
            onPress={this.onPressChangeFlashModeCamera} >
            <Image
              source={imageFlashMode}
              resizeMode='center'
              style={styles.close_image}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderImage() {
    const { data } = this.state
    return (
      <View style={[styles.container]}>
        <Image
          source={{ uri: data.uri }}
          resizeMode='cover'
          style={CommonStyles.position_absolute_full}
        />

        <View style={[CommonStyles.position_absolute_top, { height: 50 }]}>
          <TouchableOpacity
            style={[styles.back_button, {}]}
            onPress={this.onPressBackToCapture} >
            <Image
              source={Images.back}
              resizeMode='center'
              style={styles.close_image}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.done_button}
            onPress={this.onPressDone} >
            <Text
              style={{
                color: Colors.black_1,
                fontWeight: 'bold',
                fontSize: 16
              }}>
              {i18next.t('Done')}
            </Text>

          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black
  },
  close_button: {
    position: 'absolute',
    top: 20,
    left: 10,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  back_button: {
    position: 'absolute',
    top: 20,
    left: 5,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  front_button: {
    position: 'absolute',
    top: 20,
    right: 60,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flash_button: {
    position: 'absolute',
    top: 20,
    right: 10,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  done_button: {
    position: 'absolute',
    top: 23,
    right: 15,
    height: 40,
    paddingHorizontal: 18,
    backgroundColor: Colors.white,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  close_image: {
    height: 40,
    width: 40,
    alignSelf: 'flex-end',
    tintColor: Colors.white
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    backgroundColor: Colors.white,
    alignSelf: 'flex-start',
    borderWidth: 6,
    borderColor: Colors.light_gray,
    borderRadius: 40,
    height: 80,
    width: 80
  },

})
