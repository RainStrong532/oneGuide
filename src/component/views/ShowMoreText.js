
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native';
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import Device from '../../modules/Device'
import CommonStyles from '../../constants/styles'
import _ from 'lodash';
import i18next from 'i18next';
import StringUtils from '../../utils/StringUtils'
import { showMoreOptionsPost, showModalSharePost, showSharePost, showModalComment } from '../../navigation'
import HTML from 'react-native-render-html'

export default class ShowMoreText extends Component {

  constructor(props) {
    super(props);

    // bind
    this.onPressShowMore = this.onPressShowMore.bind(this)

    // init
    const showFull = _.get(this.props, 'showFull') || false
    this.state = {
      showFull
    }
  }

  // static getDerivedStateFromProps(props, state) {
  //   const content = _.get(props, 'content')

  //   if (content !== state.content) {
  //     const canShowMore = this.isShowMore(content)
  //     return {
  //       ...state,
  //       canShowMore,
  //       content
  //     }
  //   }
  //   return null
  // }

  shouldComponentUpdate(nextProps, nextState) {

    // const nextContent = _.get(nextProps, 'content')
    // const content = _.get(this.props, 'content')

    // const shouldUpdate = (
    //   nextContent !== content ||
    //   // nextProps.isLongText !== this.props.isLongText ||
    //   nextState.showFull !== this.state.showFull
    // )

    return true;
  }

  onPressShowMore = () => {
    this.setState({
      showFull: !this.state.showFull
    })
  }

  render() {
    const { showFull } = this.state
    const content = _.get(this.props, 'content')
    const location = _.get(this.props, 'location')
    const type = _.get(this.props, 'type')
    const isLongText = _.get(this.props, 'isLongText') || false
    const { data, isContent, photo } = this.props
    let numOfLines = showFull ? 0 : 5
    if (isLongText === false) {
      numOfLines = 0
    }
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.wrappImg}>
          {
            photo ?
              <Image
                style={styles.imgComment}
                source={{ uri: photo }}
                resizeMode='contain'
              /> : null
          }
          {
            type === 'text' && location ?
              <View
                style={{ flexDirection: "row" }}
              >
                <Image
                  source={Images.tour_location}
                />
                <Text
                  selectable
                  style={[styles.text, { marginLeft: 5, fontWeight: "500" }]}
                >
                  {location}
                </Text>
              </View>
              :
              null
          }
        </View>

        {
          isContent ?
            <>
              {
                type == 'tip'
                  ?
                  <HTML html={content}
                    imagesMaxWidth={Dimensions.get('window').width}
                    baseFontStyle={{ fontSize: 14, color: '#0e1217' }}
                  // tagsStyles={textStyles}
                  />
                  :
                  <Text
                    selectable
                    style={[styles.text, {}]}
                    numberOfLines={numOfLines}
                  >
                    {
                      content
                    }
                  </Text>
              }
            </>
            :
            <>
              {
                type == 'tip'
                  ?
                  <HTML html={content}
                    imagesMaxWidth={Dimensions.get('window').width}
                    baseFontStyle={{ fontSize: 14, color: '#0e1217' }}
                  // tagsStyles={textStyles}
                  />
                  :
                  <TouchableOpacity style={{ flex: 1 }}
                    onPress={() => this.props.handleComment(data)}
                  >
                    <Text
                      selectable
                      style={[styles.text, {}]}
                      numberOfLines={numOfLines}
                    >
                      {content}
                    </Text>
                  </TouchableOpacity>
              }
            </>
        }

        {
          (isLongText && !showFull && type != 'tip') &&
          <Text
            selectable
            style={styles.text_show_more}
            onPress={this.onPressShowMore}>
            {i18next.t('ShowMore')}
          </Text>
        }
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginBottom: 10
  },
  text: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: '#0e1217'
  },
  text_show_more: {
    color: Colors.green_1,
    marginTop: 4
  },
  imgComment: {
    minWidth: 100,
    minHeight: 100,
    paddingHorizontal: 10,
    borderRadius: 10
  },
  wrappImg: {
    maxHeight: 150,
    maxWidth: 150,

  }
});