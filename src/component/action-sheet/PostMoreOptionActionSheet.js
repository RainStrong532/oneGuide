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
import { dimissOverlay, ScreenAddGuider } from '../../navigation';
import Images from '../../assets/images'
import Colors from '../../constants/colors'
import CommonStyles from '../../constants/styles'
import { i18next, Loading } from '../../utils'
import Device from '../../modules/Device'
import _ from 'lodash'
import { connect } from 'react-redux';
import { deletePost, savePost } from '../../actions';
import Helper from '../../utils/Helper'

class PostMoreOptionActionSheet extends Component {

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
    // this.doDeleteComment = this.doDeleteComment.bind(this)
    this.onPressDeletePost = this.onPressDeletePost.bind(this)

    this.animate = this.animate.bind(this)

    // init variavles
    this.ownPost = props.data.user_id === props.user_me.user_id
    this.state = { showOptions: true }
    this.animatedValue = new Animated.Value(0)
    this.opacityValue = new Animated.Value(0)
  }

  componentDidMount() {
    this.animate()
  }

  componentDidAppear() {
    // setTimeout(() => {

    // }, 0);

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

  doSaveComment = (comment_id) => {
    Loading.showHud()

    // request
    this.props.savePost(comment_id)
      .then(data => {
        this.dismiss()
        this.props.callback('SAVE_DONE')
        Loading.hideHud()
        Helper.showAlert('', i18next.t('SaveSuccess'),
          [
            {
              text: 'OK', onPress: () => {
              }
            }
          ]
        )
      })
      .catch(error => {
        this.setState({ showOptions: true })
        Loading.hideHud()
      });
  }

  onPressSavePost = () => {
    const comment_id = _.get(this.props, 'data.comment_id')
    this.doSaveComment(comment_id)
  }

  onPressEditPost = () => {

    this.dismiss().then(() => {
      // setTimeout(() => {
      this.props.callback('edit')
      // }, 1000);

    })
  }

  onPressDeletePost = () => {
    this.dismiss().then(() => {
      this.props.callback('delete')

    })
  }

  onPressReportPost = () => {
    this.dismiss()
    //Call API delete Post 
    Helper.showAlert('Thông báo', i18next.t('Notificationfeedback'),
      [
        {
          text: 'OK', onPress: () => {
          }
        }
      ]
    )
  }

  onPressReportUser = () => {
    this.dismiss()
    Helper.showAlert('Thông báo', i18next.t('Notificationfeedback'),
      [
        {
          text: 'OK', onPress: () => {
          }
        }
      ]
    )
  }

  onPressAddGuider = () => {
    console.log('====================================');
    console.log(this.props.data, "hey:::::::::::::::::");
    console.log('====================================');
    this.dismiss()
    ScreenAddGuider(this.props.componentId, this.props.data)
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

    const type = _.get(this.props, 'data.type')

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
              {/* tạm thời đóng băng */}
              {/* <TouchableOpacity
                style={[{
                  height: 70,
                  marginVertical: 1,
                }]}
                onPress={this.onPressSavePost} >

                <View
                  style={[styles.button_left, {}]}>

                  <Image
                    style={styles.image_left}
                    source={Images.save_post}
                    resizeMode='center' />
                  <Text style={[styles.text]}>{i18next.t('SavePost')}</Text>

                </View>

                <Text style={[styles.sub_text]}>{i18next.t('AddTheArticeToTheSavedItem')}</Text>

              </TouchableOpacity> */}
              {
                this.ownPost && type != 'tour' &&
                <TouchableOpacity
                  style={[styles.button_left]}
                  onPress={this.onPressEditPost} >
                  <Image
                    style={styles.image_left}
                    source={Images.edit_post}
                    resizeMode='center' />
                  <Text style={[styles.text]}>{i18next.t('EditPost')}</Text>
                </TouchableOpacity>
              }
              {
                this.ownPost && type != 'tour' &&
                <TouchableOpacity
                  style={[styles.button_left]}
                  onPress={this.onPressDeletePost} >
                  <Image
                    style={styles.image_left}
                    source={Images.delete_post}
                    resizeMode='center' />

                  <Text style={[styles.text]}>{i18next.t('DeletePost')}</Text>
                </TouchableOpacity>
              }
              {
                this.ownPost && type == 'tour' &&
                <TouchableOpacity
                  style={[styles.button_left]}
                  onPress={this.onPressAddGuider} >
                  <Image
                    style={styles.image_left}
                    source={Images.ic_add_friend}
                    resizeMode='center' />

                  <Text style={[styles.text]}>{i18next.t('FindAGuide')}</Text>
                </TouchableOpacity>
              }
              {
                !this.ownPost &&
                <TouchableOpacity
                  style={[styles.button_left]}
                  onPress={this.onPressReportPost} >
                  <Image
                    style={styles.image_left}
                    source={Images.warningEnd}
                    resizeMode='center' />

                  <Text style={[styles.text]}>{i18next.t('ReportArticles')}</Text>
                </TouchableOpacity>
              }
              {
                !this.ownPost &&
                <TouchableOpacity
                  style={[styles.button_left]}
                  onPress={this.onPressReportUser} >
                  <Image
                    style={styles.image_left}
                    source={Images.warningEnd}
                    resizeMode='center' />

                  <Text style={[styles.text]}>{i18next.t('UserReports')}</Text>
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

const PostMoreOptionActionSheetContainer = connect(
  null,
  {
    // deletePost,
    savePost
  }
)(PostMoreOptionActionSheet)

export default PostMoreOptionActionSheetContainer


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
    marginLeft: 50,
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
    height: 20,
    width: 20,
    marginLeft: 15,
    marginRight: 5,
    // tintColor: Colors.black_1,
    alignSelf: 'center'
  },
})
