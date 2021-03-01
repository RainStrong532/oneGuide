
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

export default class PostLikeReplyActionView extends React.PureComponent {

  static propTypes = {
  }

  constructor(props) {
    super(props);
  }

  render() {
    const likeColor = this.props.liked ? Colors.green_1 : Colors.black_1
    const likeText = this.props.liked ? i18next.t('Unlike') : i18next.t('Like')

    return (
      <View style={{ marginLeft: 68, marginBottom: 8, height: 25, flexDirection: 'row' }} >
      {/* View Profile  */}
      <TouchableOpacity
        style={{ height: 25, alignItems: 'center', justifyContent: 'center' }}
        onPress={this.props.onPressLike} >
        <Text style={{ textAlign: 'left', color: likeColor }} >{likeText}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ height: 25, marginLeft: 10, justifyContent: 'center' }}
        onPress={this.props.onPressReply} >
        <Text style={{ textAlign: 'left', color: Colors.black_1 }}>{i18next.t('Reply')}</Text>
      </TouchableOpacity>
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
