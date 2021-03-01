
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import Device from '../../modules/Device'
import CommonStyles from '../../constants/styles'
import { i18next, Loading } from '../../utils'
import _ from 'lodash';
import { showModalApplyList } from '../../navigation';
import Helper from '../../utils/Helper';


class ImageButtonView extends Component {

  static propTypes = {
    title: PropTypes.string,
    // image: PropTypes.string,
  }

  constructor(props) {
    super(props);
  }

  onPress = () => {
    // console.log("this.props o day", this.props);
    if (this.props.onPress) {
      this.props.onPress()
    }
  }

  render() {
    const { image, title, actived, destructed } = this.props
    let colorStyle = Colors.black_1
    let tintColor = null
    if (actived === true) {
      colorStyle = Colors.blue
      tintColor = Colors.blue
    }
    if (destructed === true) {
      colorStyle = Colors.red
      tintColor = Colors.red
    }

    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity style={styles.imageButton} onPress={this.onPress} >
          <Image source={image} resizeMode='center' style={{ width: 35, height: 35, }}></Image>
          <Text style={{ color: colorStyle, fontSize: 12 }}>{title}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}


export default class PostActionView extends Component {

  static propTypes = {
  }

  shouldComponentUpdate(nextProps, nextState) {

    const nextComment = _.get(nextProps, 'data')
    const comment = _.get(this.props, 'data')

    const shouldUpdate = (
      nextComment.like_comment !== comment.like_comment ||
      nextComment.total_applys !== comment.total_applys ||
      nextComment.user_apply !== comment.user_apply ||
      nextComment.typecomment !== comment.typecomment
    )
    return shouldUpdate

  }

  onPressLikeButton = () => {

    if (this.props.onPressLikeButton) {
      this.props.onPressLikeButton()
    }
  }

  onPressCommentButton = () => {
    if (this.props.onPressCommentButton) {
      this.props.onPressCommentButton()
    }
  }

  onPressShareButton = () => {
    if (this.props.onPressShareButton) {
      this.props.onPressShareButton()
    }
  }

  onPressApplyButton = () => {
    // console.log("12345678", this.props);
    if (this.props.onPressApplyButton) {

      this.props.onPressApplyButton(this.props.data)
    }
  }


  render() {
    // like
    const like_comment = _.get(this.props, 'data.like_comment')
    const liked = (like_comment === 'active')
    let likeTitle = i18next.t('Like')
    if (liked === true) {
      likeTitle = i18next.t('Unlike')
    }
    const type = this.props.data.apply ? this.props.data.apply.type : ''
    // apply title
    let applyTitle = i18next.t('Apply');
    let destructed_tour = false
    if (type.toString() == '0') {
      applyTitle = i18next.t('Apply')
    }
    if (type.toString() == '2') {
      applyTitle = i18next.t('Hủy đăng ký');
      destructed_tour = true
    }
    if (type.toString() == '4' || type.toString() == '6' || type.toString() == '3') {
      applyTitle = i18next.t('Canceled')
      destructed_tour = true
    }

    // kiem tra so luong dang ki

    const user_id = this.props.user && this.props.user.me ? this.props.user.me.user_id : ''
    const user_id_create_post = this.props.data.user_id
    const total_applys = this.props.data.total_applys
    if (user_id == user_id_create_post && total_applys >= 1) {
      // console.log("log case nay");
      applyTitle = total_applys + ' ' + 'Đăng kí'
    }
    // const apply_type = _.get(this.props, 'data.apply.type') || ''

    // if (apply_type.toString() === '4') {

    //   applyTitle = i18next.t('Canceled')
    //   destructed_tour = true
    // } else {

    //   const total_applys = _.get(this.props, 'data.total_applys')
    //   const user_apply = _.get(this.props, 'data.user_apply')

    //   if (user_apply === 'active') {
    //     applyTitle = i18next.t('Cancel')
    //     destructed_tour = true
    //   } else {
    //     if (total_applys) {
    //       if (parseInt(total_applys) === 0) {
    //         applyTitle = i18next.t('Apply')
    //       } else {
    //         applyTitle = total_applys + '  ' + i18next.t('Apply')
    //       }
    //     }
    //   }

    // }
    const isTour = _.get(this.props, 'data.typecomment') === 'tour';
    const isGuide = _.get(this.props, 'data.typecomment') === 'guide';
    const is_agent_me = _.get(this.props, 'user.me.is_agent');
    return (
      <View style={[this.props.style, styles.container]}>
        <ImageButtonView
          style={styles.imageButton}
          image={Images.post_like}
          title={likeTitle}
          actived={liked}
          onPress={this.onPressLikeButton} />

        <ImageButtonView
          style={styles.imageButton}
          image={Images.post_comment}
          title={i18next.t('Comment')}
          onPress={this.onPressCommentButton} />

        {
          is_agent_me == 1
            ?
            isTour &&
            <ImageButtonView
              {...this.props}
              style={styles.imageButton}
              image={Images.post_apply}
              title={applyTitle}
              destructed={destructed_tour}
              onPress={this.onPressApplyButton}

            />
            : null
        }
        {
          isGuide &&
          <ImageButtonView
            {...this.props}
            style={styles.imageButton}
            image={Images.post_apply}
            title={applyTitle}
            destructed={destructed_tour}
            onPress={this.onPressApplyButton}

          />
        }
        <ImageButtonView
          style={styles.imageButton}
          image={Images.post_share}
          title={i18next.t('Share')}
          onPress={this.onPressShareButton} />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: 'row',
    borderColor: Colors.light_gray_1,
    borderTopWidth: 0.5,
    // borderBottomWidth: 0.5,
    paddingRight: 15,
    justifyContent: 'center',
  },
  imageButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
