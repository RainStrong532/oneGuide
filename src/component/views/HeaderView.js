
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import Device from '../../modules/Device'
import CommonStyles from '../../constants/styles'


export default class HeaderView extends React.PureComponent {

  static propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.string,
    colorText: PropTypes.string,
    colorBackground: PropTypes.string,
    onPressLeftBarButton: PropTypes.func,
    onPressRightBarButton: PropTypes.func
  }

  static defaultProps = {
    title: 'title',
    colorBackground: 'transparent',
    showBottomBorder: true
  };

  onPressLeftBarButton = () => {
    if (this.props.onPressLeftBarButton) {
      this.props.onPressLeftBarButton()
    }
  }

  onPressRightBarButton = () => {
    if (this.props.onPressRightBarButton) {
      this.props.onPressRightBarButton()
    }
  }
  onPressLeftBarButton_next = () => {
    this.props.onPressback()
  }
  render() {

    const statusBarHeight = Device.statusBarSize().height
    const topBarHeight = Device.topBarSize().height

    const { back, imageRight, titleRight, titleLeft, title, subTitle, tintColor, showBottomBorder } = this.props
    let imageLeft = this.props.imageLeft
    if (back === true) {
      imageLeft = Images.back
    }
    const styleContainer = { ...styles.container, ...this.props.style }
    const styleTitle = { ...CommonStyles.title_nav_bar, ...styles.title, color: tintColor || Colors.black_1 }
    const styleSubTitle = { ...CommonStyles.sub_title_nav_bar, ...styles.subTitle, color: tintColor || Colors.black_1 }
    const styleTextBar = { ...CommonStyles.text_nav_bar, ...styles.title, color: tintColor || Colors.black_1 }
    return (
      <View style={[styleContainer, { height: statusBarHeight + topBarHeight }]} >
        <View style={[{ marginTop: statusBarHeight, flex: 1 }]} >
          {
            (titleLeft) ?
              (<TouchableOpacity style={[styles.button_bar, { left: 8 }]}
                onPress={this.onPressLeftBarButton.bind(this)}
              // disabled={this.props.disabledRight}
              >
                <Text style={[styleTextBar, { textAlign: 'right' }]}>{titleLeft}</Text>
              </TouchableOpacity>) : null
          }
          {
            (imageLeft) ?
              (<View>
                {imageLeft == 9 ? <View style={{
                  flexDirection: 'row', osition: 'absolute',
                  top: 2,
                }}>
                  <TouchableOpacity style={[styles.button_bar_test, { left: 8, }]} onPress={this.onPressLeftBarButton_next} >
                    <Image
                      //  source={imageLeft}
                      source={Images.back}
                      style={[styles.image_bar, { tintColor }]} />

                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button_bar_test_lest, { left: 18 }]} onPress={this.onPressLeftBarButton.bind(this)} >
                    <Image
                      source={imageLeft}
                      style={[styles.image_bar, { tintColor }]} />
                  </TouchableOpacity>
                </View> :

                  <TouchableOpacity style={[styles.button_bar, { left: 8, }]} onPress={this.onPressLeftBarButton.bind(this)} >
                    <Image
                      source={imageLeft}
                      style={[styles.image_bar, { tintColor }]} />
                  </TouchableOpacity>
                }
              </View>
              ) : null
          }
          <View style={{ flex: 1, position: 'absolute', justifyContent: 'space-evenly', left: 48, right: 48, height: topBarHeight, top: 0, paddingBottom: 4 }}>
            <Text
              style={[styleTitle]}
              numberOfLines={1}
            >{title}</Text>
            {
              (subTitle) ? <Text style={[styleSubTitle]}>{subTitle}</Text> : null
            }
          </View>
          {
            (imageRight) ?
              (<TouchableOpacity style={[styles.button_bar, { right: 8 }]}
                onPress={this.onPressRightBarButton.bind(this)}
                disabled={this.props.disabledRight}>
                <Image
                  style={{ width: 25, height: 25, tintColor: Colors.white }}
                  resizeMode='contain'
                  source={imageRight} />
              </TouchableOpacity>) : null
          }
          {
            (titleRight) ?
              (<TouchableOpacity style={[styles.button_bar, { right: 16 }]}
                onPress={this.onPressRightBarButton.bind(this)}
                disabled={this.props.disabledRight}>
                <Text style={[styleTextBar, { textAlign: 'center' }]}>{titleRight}</Text>
              </TouchableOpacity>) : null
          }

        </View>
        {
          showBottomBorder &&
          <View style={{ height: 1, backgroundColor: Colors.gray_1 }} />
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  title: {
    alignSelf: 'center',
    color: Colors.black_1,
  },
  subTitle: {
    alignSelf: 'center',
    color: Colors.black_1,
  },
  image_bar: {
    alignSelf: 'center',
    width: 20,
    height: 20
  },
  button_bar: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 2,
    // width: 60,
    paddingLeft: 4,
    paddingRight: 4,
    height: 40,
    position: 'absolute',
  },
  button_bar_test: {
    justifyContent: 'center',
    alignItems: 'center',
    // top: 2,
    // width: 60,
    paddingLeft: 4,
    paddingRight: 4,
    height: 40,
    // position: 'absolute',
    width: 40,
  },
  button_bar_test_lest: {
    justifyContent: 'center',
    alignItems: 'center',

    // width: 60,
    paddingLeft: 10,
    paddingRight: 4,
    height: 40,
    width: 40,

    // position: 'absolute',
    // top: 2,

  }
});
