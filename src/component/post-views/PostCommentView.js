import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import Device from '../../modules/Device'
import CommonStyles from '../../constants/styles'
import { i18next } from '../../utils'
import _ from 'lodash'
import StringUtils from '../../utils/StringUtils'
import ShowMoreText from '../views/ShowMoreText'

export default class PostCommentView extends Component {

  static propTypes = {
  }

  constructor(props) {
    super(props);
    this.onPressNameButton = this.onPressNameButton.bind(this)

  }

  shouldComponentUpdate(nextProps, nextState) {
    const nextComment = _.get(nextProps, 'data')
    const comment = _.get(this.props, 'data')

    const shouldUpdate = (
      nextComment.avatar !== comment.avatar ||
      nextComment.content !== comment.content ||
      nextComment.display_name !== comment.display_name ||
      parseInt(nextComment.total_likes) !== parseInt(comment.total_likes) ||
      nextComment.isLongText !== comment.isLongText
    )
    return shouldUpdate
  }

  onPressNameButton = () => {
  }

  onPressAvatarButton = () => {
    const data = _.get(this.props, 'data')
    this.props.onPressAvatarButton && this.props.onPressAvatarButton(data)
  }

  render() {
    const avatar = _.get(this.props, 'data.avatar')
    const content = _.get(this.props, 'data.content')
    const display_name = _.get(this.props, 'data.display_name')
    const total_likes = _.get(this.props, 'data.total_likes')
    const showFull = _.get(this.props, 'showFull') || false
    const isLongText = _.get(this.props, 'data.isLongText')
    const replyCmt = _.get(this.props, 'isReplyComment')
    const heightAvatar = replyCmt ? 30 : 40

    let photo ;
    if(this.props.data.photo && this.props.data.photo["1"] ){
      photo = this.props.data.photo["1"].photos
      photo = photo.substring(2, photo.length - 2)
    }
 
    return (
      <View style={{ flex: 1, flexDirection: 'row' }} >
        {/* View Profile  */}
        <TouchableOpacity
          style={{ margin: 10, height: heightAvatar, width: heightAvatar }}
          onPress={this.onPressAvatarButton} >
          <Image
            style={{
              height: heightAvatar,
              width: heightAvatar,
              borderRadius: heightAvatar / 2,
              alignSelf: 'center',
            }}
            source={{ uri: avatar }}>
          </Image>
        </TouchableOpacity>

        <View style={{
          flex: 1,
          marginRight: 10,
          marginTop: 2,
          marginBottom: 2,
          padding: 8,
          borderRadius: 8,
          backgroundColor: Colors.light_gray_3
        }}>
          <Text
            style={{ fontWeight: 'bold', color: Colors.blue }}
            onPress={this.onPressNameButton}
          >
            {display_name}
          </Text>
          <ShowMoreText
            content={content}
            showFull={showFull}
            isLongText={isLongText}
            data={this.props.data}
            user_me={this.props.user_me}
            handleComment={this.props.onPressComment}
            photo = {photo}
          // values = {this.props.values}
          />

        </View>
        {
          (total_likes > 0) &&
          <TouchableOpacity style={{
            backgroundColor: Colors.green_1,
            height: 20,
            borderRadius: 10,
            position: 'absolute',
            right: 16,
            bottom: -8,
            justifyContent: 'center',
            flexDirection: 'row',
            // overflow: 'hidden'
          }}>
            <Image source={Images.like_count} resizeMode='stretch' style={{ width: 20, height: 20, }}></Image>
            <Text style={{ color: Colors.white, fontSize: 13, alignSelf: 'center', marginRight: 6 }}>{total_likes}</Text>
          </TouchableOpacity>
        }

      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: Colors.green_1,
  },
  image_bar: {
    alignSelf: 'center',
  },
  button_bar: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 2,
    width: 40,
    height: 40,
    // position: 'absolute',
  },
});
