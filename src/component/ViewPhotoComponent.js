import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Image,
  ActivityIndicator, Dimensions,
  TouchableOpacity, Platform, FlatList,
  Animated, ScrollView

} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { dimissModal } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import _ from 'lodash'
import Device from '../modules/Device'
import FastImage from 'react-native-fast-image'

const deviceWidth = Device.screenSize().width
const deviceHeight = Device.screenSize().height

export default class ViewPhotoComponent extends Component {

  static options(passProps) {
    return {
      statusBar: {
        backgroundColor: 'transparent',
        visible: false,
        style: 'dark'
      },
    };
  }

  static defaultProps = {
    doAnimateZoomReset: false,
    maximumZoomScale: 2,
    minimumZoomScale: 1,
    zoomHeight: deviceHeight,
    zoomWidth: deviceWidth,
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.onDismiss = this.onDismiss.bind(this)

    const photo = _.get(this.props, 'data.photo')
    this.numberPhoto = photo.photos.length
    this.animVal = new Animated.Value(0)
  }

  componentDidMount() {

  }

  componentDidAppear() {
    if (!this.didAppearFirst) {
      this.didAppearFirst = true
      const { index } = this.props.data
      this.myScroll.scrollTo({ x: index * deviceWidth, y: 0, animated: true })
    }
  }

  componentDidDisappear() {

  }

  onDismiss = () => {
    dimissModal(this.props.componentId)
  }


  getImageStyle = (imageWidth, imageHeight, width, height) => {

    if (!imageWidth ||
      !imageHeight) {
      return {
        width: 0,
        height: 0,
        margin: 1
      }
    }

    if (width) {
      return {
        width: width,
        height: imageHeight * (width / imageWidth),
      }
    } else if (!width && height) {
      return {
        width: imageWidth * (height / imageHeight),
        height: height,
      }
    } else {
      return {
        width: imageWidth,
        height: imageHeight,
      }
    }
  }

  render() {

    const photo = _.get(this.props, 'data.photo')

    if (!photo) {
      return null
    }
    // console.log('po rop pho to', this.props);

    let position = Animated.divide(this.animVal, deviceWidth);

    let imageArray = []
    let barArray = []
    let imageStyleIndex
    photo.photos.forEach((image, i) => {
      let photoIndex = photo.photos[i]
      if (photoIndex.width &&
        photoIndex.height) {
        imageStyleIndex = this.getImageStyle(photoIndex.width, photoIndex.height, deviceWidth)
      }
      const thisImage = (
        <View
          style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
          key={`image${i}`}>
          <FastImage
            source={{ uri: image.path }}
            style={imageStyleIndex}
            // style={{ flex: 1 }}
            resizeMode='contain'
          />
        </View>
      )
      imageArray.push(thisImage)

      const opacity = position.interpolate({
        inputRange: [i - 1, i, i + 1],
        outputRange: [0.3, 1, 0.3],
        extrapolate: 'clamp'
      })

      const thisBar = (
        <Animated.View
          key={i}
          style={{ opacity, height: 10, width: 10, backgroundColor: Colors.white, margin: 8, borderRadius: 5 }}
        />
      )
      barArray.push(thisBar)
    })


    const { index } = this.props.data
    const pX = index * deviceWidth
    return (
      <View
        style={[styles.container]}
        flex={1}
      >
        <ScrollView
          contentOffset={{ x: pX, y: 0 }}
          contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
          centerContent
          maximumZoomScale={this.props.maximumZoomScale}
          minimumZoomScale={this.props.minimumZoomScale}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          pagingEnabled
          onScroll={
            Animated.event(
              [{ nativeEvent: { contentOffset: { x: this.animVal } } }]
            )
          }
          ref={(ref) => {
            this.myScroll = ref
          }}>
          {imageArray}
        </ScrollView>
        {
          this.numberPhoto > 1 && (
            <View
              style={styles.barContainer}>
              {barArray}
            </View>
          )
        }
        <TouchableOpacity
          style={styles.close_button}
          onPress={this.onDismiss} >
          <Image
            source={Images.close}
            resizeMode='center'
            style={styles.close_image}></Image>
        </TouchableOpacity>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
  },
  track: {
    backgroundColor: '#ccc',
    overflow: 'hidden',
    height: 2,
  },
  bar: {
    backgroundColor: '#5294d6',
    height: 2,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  close_button: {
    position: 'absolute',
    top: 10,
    right: 10,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  close_image: {
    height: 40,
    width: 40,
    alignSelf: 'flex-end',
    tintColor: Colors.white
  }
})
