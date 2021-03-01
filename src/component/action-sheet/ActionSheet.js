import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  Animated,
  TouchableOpacity,
  SafeAreaView,
  Easing,
  TouchableHighlight
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { dimissOverlay } from '../../navigation';
import Images from '../../assets/images'
import Colors from '../../constants/colors'
import CommonStyles from '../../constants/styles'
import { i18next, Loading } from '../../utils'
import Device from '../../modules/Device'
import _ from 'lodash'
import { createPost } from '../../actions';
import { connect } from 'react-redux';
import Helper from '../../utils/Helper';

class ActionSheet extends Component {

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

    // bind
    Navigation.events().bindComponent(this);
    this.dismiss = this.dismiss.bind(this)
    // this.onPressSharePost = this.onPressSharePost.bind(this)
    // this.doSharePost = this.doSharePost.bind(this)
    this.animate = this.animate.bind(this)

    // init variavbes
    this.state = { showOptions: true }
    this.animatedValue = new Animated.Value(0)
    this.opacityValue = new Animated.Value(0)
  }

  componentDidMount() {
    this.animate()
  }

  componentDidAppear() {
  }

  componentDidDisappear() {

  }

  animate = () => {
    this.animatedValue.setValue(0)
    this.opacityValue.setValue(0)

    const createAnimation = function (value, duration, easing, delay = 0) {
      return Animated.timing(
        value,
        {
          toValue: 1,
          duration,
          easing,
          delay
        }
      )
    }
    Animated.parallel([
      createAnimation(this.animatedValue, 200, Easing.linear),
      createAnimation(this.opacityValue, 200, Easing.ease),
    ]).start()
  }

  dismiss = () => {
    dimissOverlay(this.props.componentId)
  }


  onPressButton = (index) => {
    this.dismiss()
    this.props.callback(index)
  }

  render() {

    const { showOptions } = this.state
    const buttons = _.get(this.props, 'data') || []

    const marginBottom = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-250, 0]
    })

    const opacity = this.opacityValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.7]
    })

    const buttons_length = buttons.length
    return (
      <SafeAreaView style={[styles.container]}>
        <Animated.View style={[styles.overlay_bg, { opacity }]} />
        <TouchableOpacity
          // activeOpacity={0}
          style={[CommonStyles.position_absolute_full,]}
          onPress={this.dismiss} >
        </TouchableOpacity>
        {
          showOptions &&
          <Animated.View style={{ marginBottom: marginBottom }}>
            <View style={{
              backgroundColor: Colors.white,
              borderRadius: 10,
              marginVertical: 5,
              marginHorizontal: 5,
              overflow: 'hidden',
            }}>
              {
                buttons.map((item, index) => {
                  const key = 'item_' + item.toString()
                  return (
                    <>
                      <TouchableOpacity
                        key={key}
                        style={[styles.button]}
                        onPress={() => {
                          this.onPressButton(index)
                        }} >
                        <Text style={[styles.text]}>{item}</Text>
                        {(index < buttons_length - 1) &&
                          <View style={[CommonStyles.position_absolute_bottom, { height: 1, backgroundColor: Colors.light_gray, marginHorizontal: 0 }]}></View>}
                      </TouchableOpacity>

                    </>)
                })
              }
            </View>
            <View style={[styles.button_cancel, {}]}>
              <TouchableOpacity
                style={[styles.button,]}
                onPress={this.dismiss} >
                <Text style={[styles.text]}>{i18next.t('Cancel')}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        }
      </SafeAreaView>
    );
  }
}

// const mapStateToProps = state => {
//   const { user } = state
//   return {
//     user,
//   };
// };

// const PostShareActionSheetContainer = connect(
//   mapStateToProps,
//   {
//     createPost
//   }
// )(PostShareActionSheet);

export default ActionSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay_bg: {
    backgroundColor: Colors.black_1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  },
  text: {
    fontSize: 18,
  },
  sub_text: {
    fontSize: 14,
    color: Colors.gray,
    marginLeft: 45,
    marginTop: -10,
    height: 20
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 1,
  },
  button_cancel: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 5
  },
  button_left: {
    height: 50,
    alignItems: 'center',
    marginVertical: 1,
    flexDirection: 'row',
  },
  image_left: {
    height: 30,
    width: 30,
    marginLeft: 15,
    marginRight: 5,
    tintColor: Colors.black_1,
    alignSelf: 'center'
  },
})
