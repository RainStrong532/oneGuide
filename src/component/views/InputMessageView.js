
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import Device from '../../modules/Device'
import CommonStyles from '../../constants/styles'
import _ from 'lodash';
import { i18next } from '../../utils'

export default class InputMessageView extends Component {

  constructor(props) {
    super(props);
    this.onChangeText = this.onChangeText.bind(this)
    this.onPressSendMessage = this.onPressSendMessage.bind(this)

    const can_like = this.props.include_like || false
    this.state = {
      content: '',
      can_like,
      isEdit: false
    }
  }



  static getDerivedStateFromProps(props, state) {

    const mention = _.get(props, 'mentions[0]')

    if (mention) {
 
      // const mention = props.reply_name
      return {
        ...state,
        mention
      };
    }

    return null

  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log("nextProps", nextProps);
  //   return true
  // }

  getText = () => {
    return this.state.content
  }

  focus = () => {
    this.textInput.focus()
  }

  clear = () => {

    this.setState({
      content: '',
      mention: null,
      can_like: true,

    })

    this.textInput.clear()
  }


  onChangeText = (text) => {
    // const can_like = !text || text.length === 0
    // this.setState({
    //   content: text,
    //   can_like
    // })
    const data = {
      value: text,
      comment_id: this.props.content.comment_id,
      parentId: this.props.content.parentId
    }
    if (this.props.onChangeText) {
      this.props.onChangeText(data)
    }
    const can_like = !text || text.length === 0
    this.setState({
      content: text,
      can_like,
    })


    // if (text.length < mention.length) {

    //   console.log('da')

    //   this.setState({
    //     content: '',
    //     mention: text
    //   })
    // } else {
    // this.setState({
    //   content: text.replace(mention, ''),
    // })
    // }ss
  }

  onPressSendMessage = () => {
    if (this.props.isEdit) {
      this.setState({
        isEdit: true
      }, () => {
        if (this.props.onPressSendMessage && !this.state.isEdit) {

          const content = this.state.content
          const can_like = this.state.can_like
          this.props.onPressSendMessage(content, can_like)
        }
        if (this.props.isEdit) {

          const data = {
            content: this.state.content,
            comment_id: this.props.content.comment_id,
            parentId: this.props.content.parentId
          }

          this.props.editComment(data)
        }
      })
    }
    else {
      const content = this.state.content
      const can_like = this.state.can_like
      this.props.onPressSendMessage(content, can_like)
    }

  }

  render() {
    const { reply_name, include_like,} = this.props
    
    let image_button = Images.send_message
    if (include_like === true) {
      const can_like = this.state.can_like
      image_button = can_like ? Images.ic_like : Images.send_message
    }

    return (
      <View>
        {
          reply_name &&
          this.renderReply()
        }

        <View style={styles.container_view}>
          {this.props.iscomment ? null :
            <TouchableOpacity
              style={styles.button_send}
              onPress={this.props.onPressAddImage}>
              <Image
                source={Images.add_photo}
                resizeMode='center'
                style={styles.image_send}></Image>
            </TouchableOpacity>
          }

          <View style={styles.text_input_container}>
            <TextInput
              ref={ref => this.textInput = ref}
              multiline
              selectionColor={Colors.black}
              placeholder={i18next.t('EnterAComment')}
              //value={this.state.content}
              onChangeText={this.onChangeText}

              style={styles.textInput}
              underlineColorAndroid='transparent'
              // defaultValue = {this.props.data? this.props.data.content: ''}
              value={this.props.content.value}
            //autoFocus
            // onFocus={() => {
            //   console.log('onFocus')
            //   this.onFocus(true)
            // }}
            // onEndEditing={() => {
            //   console.log('onEndEditing')
            //   this.onFocus(false)
            // }}
            >
              {/* {
                mention &&
                <Text style={{ backgroundColor: Colors.light_gray_1 }}>{mention}</Text>
              } */}
              {/* {this.state.content} */}
            </TextInput>
          </View>

          <TouchableOpacity
            style={styles.button_send}
            onPress={this.onPressSendMessage} >
            <Image
              source={image_button}
              resizeMode='center'
              style={styles.image_send}></Image>
          </TouchableOpacity>

        </View>
      </View>
    )
  }


  renderReply() {
    const { reply_name } = this.props
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
        marginLeft: 8,
      }}>
        <TouchableOpacity
          style={{
            borderRadius: 12,
            overflow: 'hidden',
            backgroundColor: Colors.light_gray_1,
          }}
          onPress={this.props.onPressRemoveReply}
        >
          <Text style={{
            fontSize: 14,
            color: Colors.green_1,
            marginHorizontal: 9,
            marginVertical: 3,
            textAlign: 'center',
            alignSelf: 'center',
          }}>
            <Text style={{
              color: Colors.black_1,
              fontWeight: 'bold',
              fontSize: 14,
              textAlign: 'center',
              alignSelf: 'center'
            }}>{i18next.t('ReplyingTo')} </Text>
            {reply_name}</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container_view: {
    backgroundColor: Colors.white,
    paddingVertical: 5,
    maxHeight: 120,
    borderTopWidth: 0.5,
    borderTopColor: Colors.light_gray,
    flexDirection: 'row',
  },
  textInput: {
    fontSize: 16,
    lineHeight: 20,
    marginHorizontal: 20,
    marginTop: 3,
    marginBottom: 5,
    paddingVertical: 0
  },
  button_send: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    height: 40,
    width: 40
  },
  image_send: {
    // marginLeft: 5,
    height: 40,
    width: 40,
    alignSelf: 'center'
  },
  text_input_container: {
    backgroundColor: Colors.light_gray_3,
    borderColor: Colors.light_gray,
    borderWidth: 0.5,
    borderRadius: 20,
    minHeight: 28,
    justifyContent: 'center',
    flex: 1,
    marginLeft:5
  }
});
