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
  DatePickerIOS

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

class DateActionSheet extends Component {

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
    this.setDate = this.setDate.bind(this)

    // init variavles
    // this.ownPost = props.data.user_id === props.user_me.user_id
    this.state = {
      showOptions: true,
      chosenDate: new Date()
    }
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

  done = () => {
    const seletedDate = this.state.chosenDate
    this.props.callback({ seletedDate })
    dimissOverlay(this.props.componentId)
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }


  render() {
    const { showOptions } = this.state
    const { minDate, end_date } = this.props.data

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
              <View style={{ flexDirection: 'row', justifyContent: 'center', height: 40, marginVertical: 20 }}>
                {
                  end_date ?
                    <Text style={{fontSize:16 }}>Chọn ngày kết thúc</Text>
                    : <Text style = {{fontSize:16}}>Chọn ngày bắt đầu</Text>
                }
                <TouchableOpacity
                  onPress={this.done} >
                  <Text
                    style={{ textAlign: 'right', marginHorizontal: 10, fontSize: 16 }}>Done</Text>
                </TouchableOpacity>
              </View>
              <DatePickerIOS
                locale='en'
                mode={this.props.data.mode}
                minimumDate={minDate}
                date={this.state.chosenDate}
                onDateChange={this.setDate}
              />
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
// )(DateActionSheet);

export default DateActionSheet;

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
