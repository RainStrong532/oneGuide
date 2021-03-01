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
  TouchableHighlight,
  FlatList
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { dimissOverlay } from '../../navigation';
import Images from '../../assets/images'
import Colors from '../../constants/colors'
import CommonStyles from '../../constants/styles'
import { i18next, Loading } from '../../utils'
import Device from '../../modules/Device'
import _ from 'lodash'

export default class RegisterSelectCardActionSheet extends Component {

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
    this.animate = this.animate.bind(this)

    // init variavles
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

  onPressItem = (index, item) => {
    if (this.props.callback) {
      this.props.callback(index, item, this.props.type)
      dimissOverlay(this.props.componentId)
    }
  }

  renderItem = ({ index, item }) => {
    return (
      <TouchableOpacity
        style={[styles.button_left]}
        onPress={() => {this.onPressItem(index, item)}} >
        <Text style={[styles.text]}>{item}</Text>
      </TouchableOpacity>
    )
  }

  keyExtractor = (item, index) => index.toString();

  render() {
    const { showOptions } = this.state

    const marginBottom = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-250, 0]
    })

    const opacity = this.opacityValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.7]
    })

    const height = this.props.data.length > 6 ? 50 * 6 : this.props.data.length * 50

    return (
      <SafeAreaView style={[styles.container]}>
        <Animated.View style={[styles.overlay_bg, { opacity }]} />
        <TouchableOpacity
          style={[CommonStyles.position_absolute_full,]}
          onPress={this.dismiss} >
        </TouchableOpacity>
        {
          showOptions &&
          <Animated.View style={{ marginBottom: marginBottom,}} >
            <View style={{
              backgroundColor: Colors.white,
              borderRadius: 10,
              marginVertical: 5,
              marginHorizontal: 5,
              overflow: 'hidden',
              height: height,
            }}>
                {
                  <FlatList
                  removeClippedSubviews={false}
                    data={this.props.data}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                  />
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
    justifyContent: 'center',
    marginVertical: 1,
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
