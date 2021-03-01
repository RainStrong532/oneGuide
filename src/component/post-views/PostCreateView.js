
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import POST_TYPE from '../../constants/post-types'
import Images from '../../assets/images'
import Device from '../../modules/Device'
import CommonStyles from '../../constants/styles'
import { i18next } from '../../utils'
import _ from 'lodash'
import { pushAddEvent, pushToUserProfile } from '../../navigation';

export default class PostCreateView extends Component {

  static propTypes = {
    searchText: PropTypes.string,
    onPressCreatePost: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.onPressCreatePost = this.onPressCreatePost.bind(this)
    this.onPressCheckIn = this.onPressCheckIn.bind(this)
    this.onPressUploadImage = this.onPressUploadImage.bind(this)
    this.onPressTour = this.onPressTour.bind(this)
    this.onPressGuide = this.onPressGuide.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {

    const nextData_avatar = _.get(nextProps, 'data.avatar')
    const data_avatar = _.get(this.props, 'data.avatar')

    const shouldUpdate = (
      nextData_avatar !== data_avatar
    )
    return shouldUpdate
  }

  onPressCreatePost = () => {
    if (this.props.onPressCreatePost) {
      this.props.onPressCreatePost(POST_TYPE.TEXT)
    }
  }

  onPressCheckIn = () => {

    if (this.props.onPressCreatePost) {
      this.props.onPressCreatePost(POST_TYPE.CHECK_IN)
    }
  }

  onPressUploadImage = () => {
    if (this.props.onPressCreatePost) {
      this.props.onPressCreatePost(POST_TYPE.IMAGE)
    }
  }

  onPressTour = () => {

    if (this.props.onPressCreatePost) {
      this.props.onPressCreatePost(POST_TYPE.TOUR, this.props.data)
    }
  }

  onPressGuide = () => {
    const callback = () => {
      // console.log("call back de lam gi");
    }
    pushAddEvent(this.props.componentId, null, null, callback)
  }
  nextScreenUserMe = () => {
    let usersMe = ''
    const { data } = this.props || {}
    if (data && data.user_id) usersMe = data.user_id
    pushToUserProfile(this.props.componentId, { user_id: usersMe })
  }
  render() {

    const avatar = _.get(this.props, 'data.avatar') || ''
    const is_agent = _.get(this.props, 'data.is_agent') || ''
    const postGroup = _.get(this.props, 'postGroup') || ''
    // console.log("object is_agent tren trang ca nhan", this.props);
    const {
      avatarWall,
      isMe, data, isAgent
    } = this.props
    const avatarUser = this.props.avatar
    // }
    return (
      <View style={styles.container}>
        {
          this.props.postUserProfile === true
            ?
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10, paddingLeft: 10, paddingRight: 10 }} >
              <Image
                source={{ uri: avatarUser }}
                style={{
                  // flex: 1,
                  // backgroundColor: 'red',
                  width: 50, height: 50, borderRadius: 25
                }}
              />
              <TouchableOpacity
                onPress={this.onPressCreatePost}
                style={{
                  flex: 6.5, borderColor: '#DDDDDD', borderWidth: 1, borderRadius: 30,
                  marginLeft: 10, alignItems: "center", flexDirection: 'row', justifyContent: 'center'
                }}>
                <Text
                  style={{ fontSize: 16, textAlign: "center", }}
                >{i18next.t('ShareFeeling')}</Text>
              </TouchableOpacity>
            </View>
            :
            <View style={styles.titleHeader}>
              <TouchableOpacity
                onPress={this.nextScreenUserMe}
                style={{ width: 50, height: 50, marginLeft: 8 }}>
                <View style={{
                  // flex: 1,
                  // backgroundColor: 'red',
                  width: 50, height: 50, borderRadius: 25, borderWidth: 1.2, borderColor: '#AEB6BF',
                  backgroundColor: 'gray'
                }}>
                  <Image
                    source={{ uri: avatar }}
                    style={{
                      flex: 1,
                      // backgroundColor: 'red',
                      // width: 50, height: 50, 
                      borderRadius: 25,
                    }}
                  /></View>
                {
                  isAgent == '1' ?
                    <Image
                      source={Images.logo_flag_header}
                      resizeMode='contain'
                      style={{ width: 15, height: 15, position: 'absolute', bottom: 0, right: 0 }}
                    />
                    :
                    null
                }

              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.onPressCreatePost}
                style={{ flex: 1 }}>
                <View style={styles.status}>
                  <Text> {i18next.t('ShareFeeling')}</Text>
                </View>
              </TouchableOpacity>
            </View>
        }

        <View style={{
          flex: 0.8,
          borderColor: '#DDDDDD',
          borderTopWidth: 0.5,
          borderBottomWidth: 0.5,
          flexDirection: 'row',
          justifyContent: "center",
          alignItems: 'center',

        }}>

          <TouchableOpacity
            style={[
              styles.button_bottom,
              {
                // borderLeftWidth: 0.5,
                // borderColor: Colors.light_gray_1,
              }
            ]}
            onPress={this.onPressUploadImage}>
            <Image source={Images.image_post_end}
              // resizeMode='center' 
              style={styles.image}></Image>
            <Text style={styles.textinput}>{i18next.t('Image')}</Text>

          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button_bottom,
            {
              borderLeftWidth: 1,
              borderColor: Colors.light_gray_1,
            }
            ]}
            onPress={this.onPressCheckIn}>
            <Image source={Images.check_in_post_end}
              style={styles.image}></Image>
            <Text style={styles.textinput}>{i18next.t('CheckIn')}</Text>
          </TouchableOpacity>

          {postGroup == true
            ?
            null
            :
            <>
              {
                is_agent == '2' || isAgent == '2'
                  ?
                  <TouchableOpacity
                    style={[
                      styles.button_bottom,
                      {
                        borderLeftWidth: 1,
                        borderColor: Colors.light_gray_1,
                      }
                    ]}
                    onPress={this.onPressTour}>
                    <Image source={Images.location_post_end}
                      //  resizeMode='center' 
                      style={styles.image}></Image>
                    <Text style={styles.textinput}>

                      {i18next.t('Journey')}
                    </Text>

                  </TouchableOpacity>
                  :
                  null
                // <TouchableOpacity
                //   style={[
                //     styles.button_bottom,
                //     {
                //       borderLeftWidth: 1,
                //       borderColor: Colors.light_gray_1,
                //     }
                //   ]}
                //   onPress={this.onPressGuide}>
                //   <Image source={Images.location_post_end}
                //     //  resizeMode='center' 
                //     style={styles.image}></Image>
                //   <Text style={styles.textinput}>

                //     {i18next.t('AddEvent')}
                //   </Text>

                // </TouchableOpacity>
              }
            </>
          }
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({

  container: {
    height: 120,
    backgroundColor: Colors.white,
    // paddingHorizontal: 20
  },
  image: {
    height: 20,
    width: 20,
    // padding:40,
    marginRight: 5,

    // backgroundColor:'red'
    tintColor: Colors.green_1

  },
  textinput: {
    color: Colors.black_1,
    marginLeft: 10
  },
  button_bottom: {

    flex: 1,
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    color: Colors.gray,



  },
  titleHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    //justifyContent: 'center',

    // marginHorizontal: 10,
    // marginVertical: 10,
  },
  imageAvatar: {
    height: 40,
    width: 40,
    // alignSelf: 'center',
    borderRadius: 20,

  },
  status: {
    //borderWidth:1,
    borderRadius: 25,
    flex: 1,
    //borderColor: '#A9A9A9',
    justifyContent: 'center',
    marginLeft: 5,
    paddingLeft: 5

  },
  txtStatus: {

  }
});
