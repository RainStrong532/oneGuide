
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import Device from '../../modules/Device'
import CommonStyles from '../../constants/styles'
import { i18next } from '../../utils'
import _ from 'lodash';

export default class PostLikeCommentCountView extends Component {

  constructor(props) {
    super(props);

    this.state = { content: "" }
  }

  onPressComments = () => {
    if (this.props.onPressComments) {
      this.props.onPressComments()
    }
  }

  onPressLikeList = () => {
    //console.log("11111111111", this.props);
    if (this.props.onPressLikeList) {
      this.props.onPressLikeList()
    }
  }

  render() {
    // console.log('total like comment', this.props);
    let total_comments = _.get(this.props, 'data.total_comments')
    let total_likes = _.get(this.props, 'data.total_likes')
    total_comments = parseInt(total_comments) || 0
    total_likes = parseInt(total_likes) || 0

    if (total_comments === 0 &&
      total_likes === 0) {
      return null
    }

    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        {
          (total_likes > 0) && (
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={this.onPressLikeList}>
              <Image source={Images.like_count} resizeMode='center' style={{ height: 20, width: 20 }}></Image>
              <Text style={styles.like} > {total_likes} </Text>
            </TouchableOpacity>
          )
        }
        <View style={{ flex: 1 }} />
        {
          (total_comments > 0) && (
            <TouchableOpacity
              style={{ justifyContent: 'center' }}
              onPress={this.onPressComments}>
              <Text style={styles.comment} >{total_comments} {i18next.t('Comments')}</Text>
            </TouchableOpacity>
          )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    height: 30,
    flexDirection: 'row',
  },
  like: {
    textAlign: 'left',
    color: Colors.black_1
  },
  comment: {
    alignSelf: 'flex-end',
    textAlign: 'right',
    color: Colors.black_1
  },
});
