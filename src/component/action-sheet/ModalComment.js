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
import { dimissOverlay, dimissModal } from '../../navigation';
import Images from '../../assets/images'
import Colors from '../../constants/colors'
import CommonStyles from '../../constants/styles'
import { i18next, Loading } from '../../utils'
import Device from '../../modules/Device'
import _ from 'lodash'
import { createPost, deleteComment } from '../../actions';
import { connect } from 'react-redux';
import Helper from '../../utils/Helper';

class ModalComment extends Component {

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
    //this.ownPost = props.data.user_id === props.user_me.user_id
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

  dismiss = async () => {
    return dimissOverlay(this.props.componentId)
  }

  handleDelComment = () => {
    this.dismiss().then(() => {
      this.props.callback('DELETE_COMMENT')
    })
  }

  handleEditComment = () => {
    this.dismiss().then(() => {
      this.props.callback('EDIT_COMMENT')
    })
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
              <TouchableOpacity
                style={[styles.button_left]}
                onPress={this.handleEditComment}
              >
                <Image
                  style={styles.image_left}
                  source={Images.share_post}
                  resizeMode='center' />
                <Text style={[styles.text]}>{i18next.t('EditComment')}</Text>
              </TouchableOpacity>
              {
                <TouchableOpacity
                  style={[styles.button_left]}
                  onPress={() => this.handleDelComment(this.props.data)}
                >
                  <Image
                    style={styles.image_left}
                    source={Images.write_post}
                    resizeMode='center' />
                  <Text style={[styles.text]}>{i18next.t('DeleteComment')}</Text>
                </TouchableOpacity>
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

const mapStateToProps = state => {
  //const { user, posts } = state
  return {

  };
};

const ModalCommentContainer = connect(
  mapStateToProps,
  {
    deleteComment
  }
)(ModalComment);

export default ModalCommentContainer;

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
