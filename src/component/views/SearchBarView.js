
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import Device from '../../modules/Device'
import CommonStyles from '../../constants/styles'
import DismissKeyboard from 'dismissKeyboard';
// import { gotoSearchScreen } from '../../navigation';
import { i18next, Loading } from '../../utils'
import { FriendList, pushToUserProfile } from '../../navigation'
import _ from 'lodash';
import { BorderlessButton } from 'react-native-gesture-handler';
import { nextInBox_Chat, backScreen, gotoBackHome } from '../../navigation'
import { backScreen_home } from '../../navigation'
//

export default class SearchBarView extends React.PureComponent {

  // static propTypes = {
  //   //searchText: PropTypes.string,
  //   friendRequestCnt: PropTypes.string,
  //   notificationCnt: PropTypes.string,
  //   onPressNotificationsBarButton: PropTypes.func,
  //   onPressFriendsBarButton: PropTypes.func,
  //   onPressSearchBarButton: PropTypes.func
  // }

  constructor(props) {
    super(props);
    this.state = {
      isSearching: false,
      show_Search: false,
      me: null
    }
    this.onPressDebounce = _.debounce(this.onPressFriendsBarButton, 300, { leading: true, trailing: false })
  }

  onPressFriendsBarButton = () => {

    // DismissKeyboard()
    // if (this.props.onPressFriendsBarButton) {
    //   this.props.onPressFriendsBarButton()
    // }
    FriendList(this.props.parentComponentId, {})
  }

  onPressSearch = () => {
    this.setState({ isSearching: true })
    if (this.props.onPressSearch) {
      this.props.onPressSearch()
    }
  }

  onPressCancel = () => {
    DismissKeyboard()
    this.setState({ isSearching: false })
    this.textInput.clear()
    if (this.props.onPressCancel) {
      this.props.onPressCancel()
    }
  }

  onChangeText = (text) => {
    this.props.onChangeText && this.props.onChangeText(text)
  }

  nextInBox_Chat = () => {
    nextInBox_Chat('home', null)
  }
  test_OnClick = () => {

    let data
    if (this.props.user) {
      data = {
        user_id: this.props.user.me.user_id
      }
    }
    pushToUserProfile(this.props.componentId, data)
  }
  render() {



    const statusBarHeight = Device.statusBarSize().height
    const topBarHeight = Device.topBarSize().height
    const isSearching = this.state.isSearching
    const { imageRight } = this.props
    const imgRight = imageRight || Images.friend
    const { holder, search_inbox, user, value, back } = this.props || [];
    if (search_inbox) {
      this.onPressSearch();
    }
    let user_proFile, test_proFile_me = []
    if (user && user.me) {

      user_proFile = user.me
      test_proFile_me = user.me.is_agent
    }
    return (
      <View style={[this.props.style, styles.container, { height: statusBarHeight + topBarHeight, paddingRight: 5 }]} >

        <View style={styles.barSearch} >
          <View style={styles.iconBar}>
            {
              (back && !isSearching) &&
              <TouchableOpacity

                onPress={this.props.onPressBack}>
                <Image
                  source={Images.back}
                  style={[styles.image_bar, { height: 24, width: 24, tintColor: Colors.white }]}
                  resizeMode='cover' />
              </TouchableOpacity>

            }

            {/* <Image
              source={Images.search}
              style={styles.image_bar}
              resizeMode='cover' />
          </View>
          <View style={styles.inputSearch}>
            <TextInput style={styles.txtSearch}
              autoCapitalize="none"
              ref={(textInput) => this.textInput = textInput}
              placeholder={i18next.t(holder ? holder : 'Search_user')}
              // style={{ flex: 1, margin: 2, marginRight: 10, color: Colors.white, }}
              multiline={false}
              value={value}
              placeholderTextColor={Colors.light_gray}
              selectionColor={Colors.white}
              onFocus={this.onPressSearch}
              onChangeText={this.onChangeText}
            />
              resizeMode='cover' /> */}
            {/* ảnh giao diện */}
            {/*  */}
            {
              (isSearching && search_inbox === undefined) ?
                null
                :
                <View

                  style={{ flex: 0.1 }}>
                  {/* {
                    user_proFile
                      ?
                      <TouchableOpacity style={styles.personalPhoto}
                        onPress={this.test_OnClick}>
                        <Image style={styles.image_header_personalPhoto}

                          source={{ uri: user_proFile.avatar }}

                        ></Image>
                      </TouchableOpacity>
                      : null
                  }
                  {
                    test_proFile_me === "1" ?
                      <View style={styles.logo_image_right}>
                        <Image
                          source={Images.logo_flag_header}
                          resizeMode='contain'
                          style={{ width: 13, height: 13 }}
                        />
                      </View>
                      :
                      null
                  } */}
                </View>
            }
          </View>
          {/* search in put */}
          {
            (isSearching) ?
              // search header View
              <View style={styles.inputSearch_text}>
                <TextInput style={{ flex: 1, paddingLeft: 48, paddingRight: 20 }}
                  autoFocus={true}
                  placeholder={i18next.t(holder ? holder : 'Searching')}
                  autoCapitalize="none"
                  ///////////////////// test
                  ref={(textInput) => this.textInput = textInput}
                  multiline={false}
                  placeholderTextColor={Colors.light_gray}
                  selectionColor={Colors.white}
                  value={value}
                  onFocus={this.onPressSearch}
                  onChangeText={this.onChangeText}
                  onEndEditing={this.onPressSearch}
                />
                <View>
                  <Image
                    style={styles.search_in_Input}
                    source={Images.search}
                  />
                </View>
              </View>
              :
              <View style={styles.inputSearch}>
                <Image
                  style={styles.logo_Image}
                  source={Images.logo_game}
                ></Image>
              </View>
          }
          {/* {
            isSearching ?
              (

                <TouchableOpacity

                  style={[styles.text_bar]}
                  onPress={this.onPressCancel} >

                  <Text
                    style={[CommonStyles.text_nav_bar, { color: Colors.white, alignSelf: 'flex-end', marginHorizontal: 10 }]}>{i18next.t('Cancel')}</Text>
                </TouchableOpacity>
              ) :
              null
          } */}
          {
            // this.props.isSearching ||
            (isSearching) ?
              //  null
              <TouchableOpacity
                //onPress={this.onclick_Search_Close}
                onPress={this.onPressCancel}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 5,
                  paddingRight: 10,
                  paddingLeft: 10,
                  height: 38,
                }}
              >
                <Text style={{ color: 'white', fontSize: 16, textAlign: 'center', }}>
                  {i18next.t('Cancel')}
                </Text>

              </TouchableOpacity>
              :
              search_inbox ?
                null :
                <View style={{
                  flexDirection: 'row'
                }}>
                  <TouchableOpacity style={[styles.button_bar, {}]}
                    onPress={this.onPressSearch}

                    // onPress={this.onPressDebounce}

                    autoFocus={true}
                  //  onPress={this.onclick_Search({show_Search:this.state.show_Search})}
                  >
                    <Image
                      source={Images.logo_search_header}
                      style={[styles.image_bar, { height: 25, width: 25, marginRight: 3 }]}
                      resizeMode='contain' />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button_bar, { marginRight: 5 }]}
                    //  onPress={this.onPressDebounce} 
                    onPress={this.nextInBox_Chat}
                  >
                    <Image
                      source={Images.logo_chat_header}
                      style={[styles.image_bar, { height: 25, width: 25, }]}
                      resizeMode='contain' />
                  </TouchableOpacity>
                </View>

          }

        </View>

        {/* Bottom line  */}
        {/* <View style={{ height: 1, backgroundColor: Colors.blue }} /> */}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: Colors.green_1,
    paddingBottom: 60,
    paddingTop: 18,
    borderBottomColor: '#C9F9F9',
    borderBottomWidth: 1

  },
  personalPhoto: {
    position: 'absolute',
    height: 42,
    width: 42,
    left: 15,
    right: 5,
    borderRadius: 21,
    backgroundColor: Colors.gray_1
  },
  image_header_personalPhoto: {
    height: 42,
    width: 42,
    borderRadius: 21,
    overflow: 'hidden',

  },
  logo_image_right: {
    position: 'absolute',
    top: 30,
    left: 40,
  },
  image_bar: {
    height: 20,
    width: 20,
    marginTop: 5,
  },
  button_bar: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 35,
    height: 35,
  },
  text_bar: {
    alignSelf: 'center'
  },
  inputSearch: {
    borderRadius: 15,
    flex: 1,
    marginTop: 18,
    alignItems: 'center',
    justifyContent: "center",
    flexDirection: 'row',
  },
  logo_Image: {
    marginLeft: 45,
    marginTop: 5,
    height: 30,
    width: 185,
    transform: [
      {
        scale: 0.85
      }
    ]
  },
  iconBar: {
    width: 35,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  search_in_Input: {
    position: 'absolute',
    left: 10,
    top: -33,
    tintColor: 'rgb(0, 172, 193)',
    transform: [{ scale: 0.65 }]
  },
  inputSearch_text: {
    marginTop: 2,
    height: 38,
    backgroundColor: 'white',
    borderRadius: 50,
    flex: 1,
    marginLeft: -20,
  },
  txtSearch: {
    flex: 1,
    color: Colors.white,
    fontSize: 12,
  },
  barSearch: {
    marginTop: Device.statusBarSize().height,
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 5,

  }
});


