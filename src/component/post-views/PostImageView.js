
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image, TouchableWithoutFeedback } from 'react-native';
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import Device from '../../modules/Device'
import _ from 'lodash';
import FastImage from 'react-native-fast-image'

const imageResizeMode = 'cover'
const IMAGE_MAX_COUNT = 5

export default class PostImageView extends Component {

  static propTypes = {
    status: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.onPressImage = this.onPressImage.bind(this)
    this.state = { status: "", isShow: false, }
    //this.onPressImage = _.debounce(this.onPressImageDebounce, 500, { leading: true, trailing: false })

    this.widthView = Device.screenSize().width
    if (this.props.margin) {
      this.widthView = this.widthView - 2 * (this.props.margin)
    }

    this.imageStyle2 = {
      width: this.widthView / 2 - 2,
      height: this.widthView / 2 - 2,
      margin: 1
    }

    this.imageStyle3 = {
      width: this.widthView / 3 - 2,
      height: this.widthView / 3 - 2,
      margin: 1
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate = !_.isEqual(nextProps.photos, this.props.photos)
    return shouldUpdate
  }

  getImageStyle = (imageWidth, imageHeight, width = 3, height = 1) => {
    width = width - 2

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
        margin: 1
      }
    } else if (!width) {
      return {
        width: imageWidth * (height / imageHeight),
        height: height,
        margin: 1
      }
    } else {
      return {
        width: imageWidth,
        height: imageHeight || 1,
        margin: 1
      }
    }
  }

  getImageRatio = (photo) => {
    return photo.width / photo.height
  }

  onPressImage = (index) => {
    // console.log("call laanf 1", this.props);
    if (this.props.onPressImage) {
      this.props.onPressImage(index)
    }
  }

  handleShowImage = () => {
    this.setState({
      isShow: true,
    })
  }
  render() {
    // console.log('render phôt', this.props);
    let { photos } = this.props
    if (!photos) {
      return null
    }

    if (photos.length >= IMAGE_MAX_COUNT) {
      return this.renderPhotos5(photos)
    }

    if (photos.length === 4) {
      return this.renderPhotos4(photos)
    }

    if (photos.length === 3) {
      return this.renderPhotos3(photos)
    }

    if (photos.length === 2) {
      return this.renderPhotos2(photos)
    }

    return this.renderPhotos1(photos)
  }

  renderPhotos1(photos) {

    const photo1 = photos[0]
    let imageStyle1
    if (this.props.imagePostApprove) {
      // console.log("check ::::::::::::::::::::,", this.props.imagePostApprove);
      imageStyle1 = this.getImageStyle(photo1.width / 4, photo1.height / 4, this.widthView)
    }
    else {

      imageStyle1 = this.getImageStyle(photo1.width, photo1.height, this.widthView)
    }
    return (
      <View>
        <TouchableWithoutFeedback style={[this.props.style, { imageStyle1 }]} onPress={() => this.onPressImage(0)} >
          <FastImage
            style={imageStyle1}
            source={{ uri: photo1.path }}
            resizeMode={imageResizeMode} />
        </TouchableWithoutFeedback>
        {/* {
          this.state.isShow ?
            <View style={styles.imgCover}>
              <Image
                source={Images.walkthrough1}
                style={imageStyle1}
                resizeMode='contain'
              />
            </View> :
            null
        } */}

        {/* {this.props.showImage ?
          <View style={{ justifyContent: "center", alignItems: 'center', backgroundColor: '#DCDCDC', paddingVertical: 5 }}>
            <Text>Chúng tôi đã tự động che đi hình ảnh này</Text>
            <TouchableOpacity onPress={this.handleShowImage}>
              <Text>Show Image</Text>
            </TouchableOpacity>
          </View> :
          null
        } */}

      </View>

    )
  }

  renderPhotos2(photos) {

    const photo1 = photos[0]
    const photo2 = photos[1]
    let imageStyle = {}
    if (this.getImageRatio(photo1) > this.getImageRatio(photo2)) {
      imageStyle = this.getImageStyle(photo1.width, photo1.height, this.widthView / 2)
    } else {
      imageStyle = this.getImageStyle(photo2.width, photo2.height, this.widthView / 2)
    }
    // const imageStyle1 = { ...this.getImageStyle(photo1.width, photo1.height, this.widthView / 2), ...{ marginHorizontal: 1 } }
    // const imageStyle2 = { ...this.getImageStyle(photo2.width, photo2.height, this.widthView / 2), ...{ marginHorizontal: 1 } }
    return (
      <View style={[this.props.style, { flex: 1, flexDirection: 'row', height: imageStyle.height }]} >
        <TouchableWithoutFeedback onPress={() => this.onPressImage(0)} >
          <FastImage
            style={imageStyle}
            source={{ uri: photo1.path }}
            resizeMode={imageResizeMode} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => this.onPressImage(1)} >
          <FastImage
            style={imageStyle}
            source={{ uri: photo2.path }}
            resizeMode={imageResizeMode} />
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderPhotos3(photos) {
    const photo1 = photos[0]
    const photo2 = photos[1]
    const photo3 = photos[2]
    return (
      <View style={[this.props.style, { flexDirection: 'row' }]}>
        <TouchableWithoutFeedback onPress={() => this.onPressImage(0)} >
          <FastImage
            style={this.imageStyle3}
            source={{ uri: photo1.path }}
            resizeMode={imageResizeMode} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => this.onPressImage(1)} >
          <FastImage
            style={this.imageStyle3}
            source={{ uri: photo2.path }}
            resizeMode={imageResizeMode} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => this.onPressImage(2)} >
          <FastImage
            style={this.imageStyle3}
            source={{ uri: photo3.path }}
            resizeMode={imageResizeMode} />
        </TouchableWithoutFeedback>
      </View>
    )
  }

  renderPhotos4(photos) {

    const photo1 = photos[0]
    const photo2 = photos[1]
    const photo3 = photos[2]
    const photo4 = photos[3]

    return (
      <View style={[this.props.style, { flex: 1, flexDirection: 'column' }]}>

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableWithoutFeedback onPress={() => this.onPressImage(0)} >
            <FastImage
              style={this.imageStyle2}
              source={{ uri: photo1.path }}
              resizeMode={imageResizeMode} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => this.onPressImage(1)} >
            <FastImage
              style={this.imageStyle2}
              source={{ uri: photo2.path }}
              resizeMode={imageResizeMode} />
          </TouchableWithoutFeedback>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableWithoutFeedback onPress={() => this.onPressImage(2)} >
            <FastImage
              style={this.imageStyle2}
              source={{ uri: photo3.path }}
              resizeMode={imageResizeMode} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => this.onPressImage(3)} >
            <FastImage
              style={this.imageStyle2}
              source={{ uri: photo4.path }}
              resizeMode={imageResizeMode} />
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }


  renderPhotos5(photos) {
    const photo1 = photos[0]
    const photo2 = photos[1]
    const photo3 = photos[2]
    const photo4 = photos[3]
    const photo5 = photos[4]

    if (this.getImageRatio(photo4) > this.getImageRatio(photo5)) {
      imageStyle = this.getImageStyle(photo4.width, photo4.height, this.widthView / 2)
    } else {
      imageStyle = this.getImageStyle(photo5.width, photo5.height, this.widthView / 2)
    }
    return (

      <View style={[this.props.style, { flex: 1, flexDirection: 'column' }]}>

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableWithoutFeedback onPress={() => this.onPressImage(0)} >
            <FastImage
              style={this.imageStyle3}
              source={{ uri: photo1.path }}
              resizeMode={imageResizeMode} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => this.onPressImage(1)} >
            <FastImage
              style={this.imageStyle3}
              source={{ uri: photo2.path }}
              resizeMode={imageResizeMode} />
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={() => this.onPressImage(2)} >
            <FastImage
              style={this.imageStyle3}
              source={{ uri: photo3.path }}
              resizeMode={imageResizeMode} />
          </TouchableWithoutFeedback>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableWithoutFeedback onPress={() => this.onPressImage(3)} >
            <FastImage
              style={imageStyle}
              source={{ uri: photo4.path }}
              resizeMode={imageResizeMode} />
          </TouchableWithoutFeedback>
          {(photos.length > IMAGE_MAX_COUNT) ? (
            <View style={imageStyle}>
              <FastImage
                style={[{ flex: 1 }]}
                source={{ uri: photo5.path }}
                resizeMode={imageResizeMode}
              />
              <TouchableOpacity
                onPress={() => this.onPressImage(IMAGE_MAX_COUNT)}
                style={{ flexDirection: 'row', position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, justifyContent: 'center' }} >
                <View style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, backgroundColor: Colors.black, opacity: 0.5 }}></View>
                <Text style={{ fontWeight: 'bold', alignSelf: 'center', color: Colors.white, fontSize: 40, }}>+{photos.length - IMAGE_MAX_COUNT}</Text>
              </TouchableOpacity>
            </View>
          ) :
            <TouchableWithoutFeedback onPress={() => this.onPressImage(4)} >
              <FastImage
                style={imageStyle}
                source={{ uri: photo5.path }}
                resizeMode={imageResizeMode} />
            </TouchableWithoutFeedback>
          }

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: Colors.green_1,
  },
  imgCover: {
    position: 'absolute',
    flex: 1,
    width: 200,
    height: 200,
    top: 0,
    left: 0,
    opacity: 1,
  }
});
