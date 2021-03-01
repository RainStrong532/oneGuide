
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
  FlatList, DatePickerAndroid, DatePickerIOS
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { dimissOverlay } from '../../navigation';
import Images from '../../assets/images'
import Colors from '../../constants/colors'
import CommonStyles from '../../constants/styles'
import { i18next, Loading } from '../../utils'
import Device from '../../modules/Device'
import _ from 'lodash'

export default class DatePickerActionSheet extends Component {

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
    this.state = { chosenDate: new Date(), showOptions: true };
    this.setDate = this.setDate.bind(this);

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

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }

  done = () => {
    if (this.props.callback) {
      this.props.callback(this.state.chosenDate)
      dimissOverlay(this.props.componentId)
    }
  }

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

    return (
      <SafeAreaView style={[styles.container]}>
        <Animated.View style={[styles.overlay_bg, { opacity }]} />
        <TouchableOpacity
          style={[CommonStyles.position_absolute_full,]}
          onPress={this.dismiss} >
        </TouchableOpacity>
        {
          showOptions &&
          <Animated.View style={{ marginBottom: marginBottom, }} >
            <View style={{
              backgroundColor: Colors.white,
              borderRadius: 10,
              marginVertical: 5,
              marginHorizontal: 5,
              overflow: 'hidden',
              height: 220,
            }}>
              {
                Platform.OS === 'ios' && (
                  <View style={styles.viewcontainer}>
                    <DatePickerIOS
                      date={this.state.chosenDate}
                      onDateChange={this.setDate}
                      mode={'date'}
                    />
                  </View>
                )
              }
            </View>
            <View style={[styles.button_cancel, {}]}>
              <TouchableOpacity
                style={[styles.button,]}
                onPress={this.done} >
                <Text style={[styles.text]}>{'Done'}</Text>
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
  viewcontainer: {
    flex: 1,
    justifyContent: 'center',
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
})
