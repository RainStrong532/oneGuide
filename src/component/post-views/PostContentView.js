
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import Device from '../../modules/Device'
import CommonStyles from '../../constants/styles'
import _ from 'lodash';
import i18next from 'i18next';
import StringUtils from '../../utils/StringUtils'
import ShowMoreText from '../views/ShowMoreText'

export default class PostContentView extends Component {

  constructor(props) {
    super(props);

  }

  // static getDerivedStateFromProps(props, state) {
  //   const content = _.get(props, 'data.content')

  //   if (content &&
  //     !_.isEqual(content, state.content)) {

  //     return {
  //       ...state,
  //       content
  //     }
  //   }
  //   return null
  // }

  shouldComponentUpdate(nextProps, nextState) {

    const nextComment = _.get(nextProps, 'data')
    const comment = _.get(this.props, 'data')

    const shouldUpdate = (
      nextComment.content !== comment.content ||
      nextComment.isLongText !== comment.isLongText
    )

    return shouldUpdate
  }

  render() {

    // console.log('ờ rốp bốt looca tion', this.props);
    const content = _.get(this.props, 'data.content')
    const isLongText = _.get(this.props, 'data.isLongText')
    const location = _.get(this.props, 'data.location')
    const type = _.get(this.props, 'data.type')
    const showFull = _.get(this.props, 'showFull') || false


    if (!content) {
      return null
    }
    return (
      <View style={styles.container}>
        {/* <Text>bài content</Text> */}
        <ShowMoreText
          content={content}
          showFull={showFull}
          isLongText={isLongText}
          isContent={this.props.isContent}
          // location={location}
          type={type}
        // handleComment = {this.props.onPressComment}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
  },
});
