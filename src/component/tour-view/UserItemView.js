import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Colors from '../../constants/colors';
import Device from '../../modules/Device';
import _ from 'lodash';
import FastImage from 'react-native-fast-image'
import Images from '../../assets/images';
import DismissKeyboard from 'dismissKeyboard';
import DateHelper from '../../utils/DateHelper'

const screenWidth = Device.screenSize().width

export default class UserItemView extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const nextData = _.get(nextProps, 'item')
    const data = _.get(this.props, 'item')
    return true
  }

  onPressUserProfile = () => {
    DismissKeyboard()
    if (this.props.onPressUserProfile) {
      this.props.onPressUserProfile(this.props.item.user_id)
    }
  }


  onPressChatButon = (item) => {
    DismissKeyboard()
    if (this.props.onPressChatButon) {
      this.props.onPressChatButon(item)
    }
  }

  render() {
    const isChat = (this.props.isChat === false)
    const { avatar, display_name, user_id, email, phone } = this.props.item || ""
    let { last_login } = this.props.item || ''
    if (last_login) {
      last_login = DateHelper.timeSince(parseInt(last_login));
    }
    return (
      <View style={styles.container}>
        {
          this.props.isSearch ?
            <>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}
                //  containerStyle={{}}
                onPress={() => { this.onPressChatButon(this.props.item) }} >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FastImage
                    source={{ uri: avatar }}
                    style={{ width: 50, height: 50, marginLeft: 10, borderRadius: 25 }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  <View style={styles.info}>
                    <Text style={styles.subTxt}>{display_name}</Text>
                  </View>
                </View>
                <View style={styles.rightView}>
                  <View
                    style={styles.rightButton}>
                    <Text>
                      {last_login}
                    </Text>
                    <Image
                      source={Images.icon_chat_end}
                      //source={Images.tabbar_inbox}
                      resizeMode='contain'
                      style={{ flex: 1, width: 20, height: 20, marginTop: 5 }} />
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.borderline}></View>
            </>
            :
            <>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                //  containerStyle={{}}
                onPress={() => { this.onPressUserProfile(user_id) }}>
                <FastImage
                  source={{ uri: avatar }}
                  style={{ width: 50, height: 50, marginLeft: 10, borderRadius: 25 }}
                  resizeMode={FastImage.resizeMode.cover}
                />
                <View style={styles.info}>
                  <Text numberOfLines={1} style={styles.title}>{display_name}</Text>
                  {email ?
                    <Text numberOfLines={1} style={styles.subTxt}>{email}</Text> : null
                  }
                  {phone ?
                    <Text numberOfLines={1} style={styles.subTxt}>{phone}</Text> : null
                  }

                </View>

              </TouchableOpacity>
              {
                isChat || <View style={styles.rightView}>
                  <TouchableOpacity
                    style={styles.rightButton}
                    onPress={() => { this.onPressChatButon(this.props.item) }} >
                    {/* <Text>test chat inbox</Text> */}
                    <Image
                      source={Images.icon_chat_end}
                      // source={Images.tabbar_inbox}
                      resizeMode='contain'
                      style={{ flex: 1, width: 30, height: 30, }} />
                  </TouchableOpacity>
                </View>
              }
              <View style={styles.borderline}></View>
            </>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    height: 80,
    alignItems: 'center',
    backgroundColor: '#F7F9F9'
    // borderColor:'red',
    // borderWidth:1,
    // borderRadius:10
  },
  subContain: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
    justifyContent: 'space-between'
  },
  title: {
    marginLeft: 7,
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 2,
    alignSelf: 'center',
    color: 'black'

  },
  time_text: {
    marginLeft: 5,
    fontSize: 15,
    fontWeight: '300'
  },
  detail_text: {
    fontSize: 15,
    fontWeight: '500'
  },
  borderline: {
    height: 0.5,
    borderWidth: 0.5,
    borderColor: Colors.light_gray,
    width: screenWidth,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  rightView: {
    // position: 'absolute',
    // padding:5,
    // right: 5,
    height: 40,
    // width: 150,
    marginRight: 10,
    borderRadius: 5,
    // borderWidth: 0.5,
    // borderColor: Colors.light_gray

  },
  rightButton: {
    height: 40,
    // width: 150,
    // marginVertical: 10,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: 'black', borderWidth: 1,
  },
  agentContainer: {
    flexDirection: 'row'
  },
  guideContainer: {
    flexDirection: 'row'
  },
  info: {
    marginLeft: 10,
    //justifyContent: 'space-between',
    alignItems: "center",
    justifyContent: "center"
  },
  subTxt: {
    fontSize: 13,
    paddingVertical: 2
  }

})
