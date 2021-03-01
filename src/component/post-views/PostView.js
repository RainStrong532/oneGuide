
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, } from 'react-native';
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import Device from '../../modules/Device'
import CommonStyles from '../../constants/styles'
import DismissKeyboard from 'dismissKeyboard';
import { SeeAllPostTip } from '../../navigation';
import _ from 'lodash';

import PostHeaderView from './PostHeaderView'
import PostContentView from './PostContentView'
import PostActionView from './PostActionView'
import PostImageView from './PostImageView'
import PostTourView from './PostTourView'
import PostShareView from './PostShareView'
import PostGuideView from './PostGuideView'
import PostLikeCommentCountView from './PostLikeCommentCountView'
import PostScarperView from './PostScarperView'
import PostShareGroup from './PostShareGroup'
import PostTipView from './PostTipView'
import i18next from 'i18next';

export default class PostView extends Component {

  static propTypes = {
    status: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      postGroup: []
    }

  }

  shouldComponentUpdate(nextProps, nextState) {
    const nextComment = _.get(nextProps, 'data.comment')
    const comment = _.get(this.props, 'data.comment')

    const shouldUpdate = !_.isEqual(nextComment, comment)
    return shouldUpdate
  }

  // componentDidMount() {
  //   this.doGetData()

  // }

  // doGetData = () => {
  //   if (this.props.data && this.props.data.comment && this.props.data.comment.comment_id) {
  //     this.setState({
  //       postGroup: this.props.data.comment
  //     })
  //   }
  //   else {
  //     this.doGetData()
  //   }
  // }

  onPressLikeButton = () => {
    if (this.props.onPressLikeButton) {
      const comment_id = _.get(this.props, 'data.comment.comment_id')
      this.props.onPressLikeButton(comment_id)
    }
  }

  onPressCommentButton = () => {
    if (this.props.onPressCommentButton) {
      const data = _.get(this.props, 'data')
      this.props.onPressCommentButton(data, true)
    }
  }

  onPressCommentCount = () => {
    if (this.props.onPressCommentButton) {
      const data = _.get(this.props, 'data')
      this.props.onPressCommentButton(data)
    }
  }

  onPressLikeList = () => {
    if (this.props.onPressLikeListButton) {
      const data = _.get(this.props, 'data')
      // console.log("datarwquest", data);
      this.props.onPressLikeListButton(data)
    }
  }

  onPressShareButton = () => {
    if (this.props.onPressShareButton) {
      const comment = _.get(this.props, 'data.comment')

      this.props.onPressShareButton(comment)
    }
  }

  onPressApplyButton = () => {
    // console.log("call hẻeeeeeee", this.props);
    if (this.props.onPressApplyButton) {
      this.props.onPressApplyButton()
    }
  }

  onPressImage = (index) => {
    if (this.props.onPressImage) {
      const photo = _.get(this.props, 'data.comment.photo')
      // console.log('onPress photo', photo);
      this.props.onPressImage(index, photo)
    }
  }

  onPressMoreOptionsButton = () => {
    if (this.props.onPressMoreOptionsButton) {
      const comment = _.get(this.props, 'data.comment')
      this.props.onPressMoreOptionsButton(comment)
    }
  }

  onPressAvatarButton = () => {
    if (this.props.onPressAvatarButton) {
      const comment = _.get(this.props, 'data.comment')
      const data = {
        profile_id: comment.profile_id,
        display_name: comment.display_name,
        fullname: comment.fullname,
        avatar: comment.avatar,
        user_id: comment.user_id
      }

      this.props.onPressAvatarButton(data)
    }
  }
  onPressNameButton = () => {
    if (this.props.onPressNameButton) {
      const comment = _.get(this.props, 'data.comment')
      const data = {
        profile_id: comment.profile_id,
        display_name: comment.display_name,
        fullname: comment.fullname,
        avatar: comment.avatar,
        user_id: comment.user_id
      }
      this.props.onPressNameButton(data)
    }
  }

  onPressTitleGroupButton = (group_id) => {
    if (this.props.onPressTitleGroupButton) {
      this.props.onPressTitleGroupButton(group_id)
    }
  }

  goToSeeAllPostTip = () => {
    SeeAllPostTip(this.props.componentId, null)
  }

  render() {
    const { is_agent } = this.props.data.comment || ""
    const comment = _.get(this.props, 'data.comment')
    // const comment = _.get(this.state, 'postGroup')
    const photos = _.get(this.props, 'data.comment.photo.photos')
    const detailCommentShare = _.get(this.props, 'data.comment.detailCommentShare')
    const detailGroupShare = _.get(this.props, 'data.comment.detailGroupShare')
    const isShare = _.get(this.props, 'data.comment.type') === 'share'
    const isShareGroup = _.get(this.props, 'data.comment.type') === 'share_group'
    const type = _.get(this.props, 'data.comment.type')
    let scraper = this.props.data.comment.scraper
    return (
      <View style={[this.props.style]}>
        {
          type == 'tip'
            ?
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Image
                  source={Images.icon_hot_news}
                  style={{
                    width: 40,
                    height: 40,
                    margin: 5,
                    marginLeft: 10
                  }}
                />
                <TouchableOpacity
                  onPress={this.goToSeeAllPostTip}>
                  <Text
                    style={{
                      color: '#3399FF',
                      margin: 5,
                      marginRight: 10,
                      fontSize: 14,
                      textAlign: "center"
                    }}

                  >
                    {i18next.t('SeeAll')}
                  </Text>
                </TouchableOpacity>
              </View>
              <PostTipView
                data={comment}
                componentId={this.props.componentId}
              />
            </View>
            :
            <>
              <PostHeaderView
                data={comment}
                onPressSharePostButton={this.props.onPressSharePostButton}
                onPressMoreOptionsButton={this.onPressMoreOptionsButton}
                onPressAvatarButton={this.onPressAvatarButton}
                onPressNameButton={this.onPressNameButton}
                onPressTitleGroupButton={this.props.onPressTitleGroupButton}
                parentComponentId={this.props.parentComponentId}
                isAgent={is_agent}
              />
              <PostTourView
                data={comment}
                showFull={true}
                onPressTourLocation={this.props.onPressTourLocation}
              // onPressCommentButton={this.onPressCommentButton}
              />
              <PostGuideView
                data={comment}
                showFull={true}
                onPressTourLocation={this.props.onPressTourLocation}
              />
              <PostContentView
                data={comment}
                isContent
              />
              {
                isShareGroup &&
                <PostShareGroup
                  data={detailGroupShare}
                  getInfomationGroup={this.props.getInfomationGroup}
                  goToGroup={this.props.goToGroup}
                  shareGroup
                />
              }
              {
                photos &&
                <PostImageView
                  photos={photos}
                  style={{ marginBottom: 8 }}
                  onPressImage={this.onPressImage}
                  showImage
                />
              }
              {
                scraper == 'Not scraper' || scraper == undefined || scraper.length == 0
                  ?
                  null
                  :
                  <PostScarperView
                    scraper={comment}
                  />
              }
              {
                isShare &&
                <PostShareView
                  {...this.props}
                  data={detailCommentShare}
                  share
                // onPressImage={this.onPressImage}
                />
              }
              <PostLikeCommentCountView
                data={comment}
                onPressComments={this.onPressCommentCount}
                onPressLikeList={this.onPressLikeList}
              />
              <PostActionView
                {...this.props}
                data={comment}
                style={{ marginBottom: 4 }}
                onPressLikeButton={this.onPressLikeButton}
                onPressCommentButton={this.onPressCommentButton}
                onPressShareButton={this.onPressShareButton}
              // onPressApplyButton={this.onPressApplyButton}
              />
              {/* <Text>{this.props.data.comment.content}</Text> */}
            </>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
  },
});
