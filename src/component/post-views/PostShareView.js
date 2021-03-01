
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import Device from '../../modules/Device'
import CommonStyles from '../../constants/styles'
import _ from 'lodash';

import PostHeaderView from './PostHeaderView'
import PostContentView from './PostContentView'
import PostImageView from './PostImageView'
import PostTourView from './PostTourView'
import PostGuideView from './PostGuideView'
import { pushToUserProfile, viewPhoto, pushInformationGroup, pushToGroup } from '../../navigation'
import PostShareGroup from './PostShareGroup'
import PostScarperView from './PostScarperView'

export default class PostShareView extends Component {

  static propTypes = {
    status: PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.state = { status: "" }
    this.onPressImage = _.debounce(this.onPressImageDebounce, 500, { leading: true, trailing: false })
  }

  handleAvatar = (value) => {
    pushToUserProfile(this.props.parentComponentId, value)
  }

  handleAva = (value) => {
    pushToUserProfile(this.props.componentId, value)
  }

  onPressImageDebounce = (index) => {
    // console.log("call here", this.props);
    const photo = _.get(this.props, 'data.photo')
    if (this.props.onPressImage) {
      this.props.onPressImage(index, photo)
    } else {
      viewPhoto({ index, photo })
    }
  }

  // goToGroup = (data) => {
  //   console.log('go to group', data);
  //   if (data.check_user == 'no') {
  //     pushInformationGroup(this.props.parentComponentId, {
  //       passProps: data
  //     })
  //   } else
  //     if (data.check_user == 'yes') {
  //       pushToGroup(this.props.parentComponentId, {
  //         passProps: data
  //       })
  //     }
  // }


  render() {
    const detailCommentShare = _.get(this.props, 'data')
    const detailGroupShare = _.get(this.props, 'data.detailGroupShare')
    const type = _.get(this.props, 'data.type')
    const isShareGroup = type == 'share_group'
    const scraper = _.get(this.props, 'data')
    // console.log(scraper, "detailCommentShare", this.props);
    if (!detailCommentShare) {
      return null
    }

    const photos = _.get(detailCommentShare, 'photo.photos')
    const { share } = this.props
    const { is_agent } = this.props.data || ''
    return (
      <View style={[styles.container, this.props.style]}>
        <PostHeaderView
          data={detailCommentShare}
          isShare={share}
          onPressAvatar={this.handleAvatar}
          onPressAva={this.handleAva}
          isAgent={is_agent}
        />
        <PostTourView
          showFull={true}
          data={detailCommentShare}
          isShare={share}
          share
          onPressTourLocation={this.props.onPressTourLocation}
        />
        <PostGuideView
          showFull={true}
          data={detailCommentShare}
          isShare={share}
          share
          onPressTourLocation={this.props.onPressTourLocation}
        />
        <PostContentView
          isContent
          data={detailCommentShare} />
        {
          isShareGroup && (
            <PostShareGroup
              data={detailGroupShare}
              getInfomationGroup={this.props.getInfomationGroup}
              goToGroup={this.props.goToGroup}
            />)
        }
        { (scraper.scraper && scraper.scraper.length != 0 && scraper.scraper != 'Not scraper') &&
          (<PostScarperView
            scraper={scraper}
          />)
        }
        <PostImageView
          photos={photos} margin={10} style={{ marginBottom: 8 }}
          onPressImage={this.onPressImage}
          showImage
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    borderColor: Colors.light_gray,
    borderWidth: 1,
    borderRadius: 3,
    marginBottom: 8
  },
});
