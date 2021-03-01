import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import Device from '../../modules/Device'
import CommonStyles from '../../constants/styles'
import DismissKeyboard from 'dismissKeyboard';
import { gotoSearchScreen } from '../../navigation';
import { i18next, Loading } from '../../utils'
import { FriendList } from '../../navigation'
import _ from 'lodash';

export default class SearchBarView extends React.PureComponent {

  static propTypes = {
    searchText: PropTypes.string,
    friendRequestCnt: PropTypes.string,
    notificationCnt: PropTypes.string,
    onPressNotificationsBarButton: PropTypes.func,
    onPressFriendsBarButton: PropTypes.func,
    onPressSearchBarButton: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = { isSearching: false }
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

  render() {
    const { back, value } = this.props
    const statusBarHeight = Device.statusBarSize().height
    const topBarHeight = Device.topBarSize().height
    const isSearching = this.state.isSearching
    const { imageRight } = this.props
    const imgRight = imageRight || Images.friend

    return (
      <View style={[this.props.style, styles.container, { height: statusBarHeight + topBarHeight, paddingRight: 5 }]} >

        {/* View top bar  */}
        <View style={styles.barSearch} >
          <View style={styles.iconBar}>
            {
              (back && !isSearching) &&
              <TouchableOpacity
                // style={[styles.button_bar, {}]}
                onPress={this.props.onPressBack}>
                <Image
                  source={Images.back}
                  style={[styles.image_bar, { height: 24, width: 24, tintColor: Colors.white }]}
                  resizeMode='cover' />
              </TouchableOpacity>

            }

            <Image
              source={Images.search}
              style={styles.image_bar}
              resizeMode='cover' />
          </View>
          <View style={styles.inputSearch}>
            <TextInput style={styles.txtSearch}
              autoCapitalize="none"
              ref={(textInput) => this.textInput = textInput}
              placeholder={i18next.t('Search_user')}
              // style={{ flex: 1, margin: 2, marginRight: 10, color: Colors.white, }}
              multiline={false}
              value={value}
              placeholderTextColor={Colors.light_gray}
              selectionColor={Colors.white}
              onFocus={this.onPressSearch}
              onChangeText={this.onChangeText}
               />

          </View>
          {
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
          }
          {
            this.props.isSearching ? null
              :
              <TouchableOpacity style={[styles.button_bar, {}]} onPress={this.onPressDebounce} >
                <Image
                  source={imgRight}
                  style={[styles.image_bar, { height: 30, width: 30 }]}
                  resizeMode='contain' />
              </TouchableOpacity>
          }

        </View>

        {/* Bottom line  */}
        <View style={{ height: 1, backgroundColor: Colors.blue }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: Colors.green_1,
  },
  image_bar: {
    height: 20,
    width: 20,
    marginLeft: 10,
    marginRight: 5
  },
  button_bar: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    // position: 'absolute',
    marginRight: 5,
    //borderWidth:1
  },
  text_bar: {
    alignSelf: 'center'
    // position: 'absolute',
  },
  inputSearch: {
    backgroundColor: '#00838f',
    borderRadius: 15,
    flex: 1,
    paddingLeft: 5,
    justifyContent: 'center',
  },
  iconBar: {
    // borderWidth:1,
    width: 35,
    justifyContent: 'center',
    // paddingTop:15
  },
  txtSearch: {
    flex: 1,
    color: Colors.white,
    paddingLeft: 10,
    fontSize: 12
  },
  barSearch: {
    marginTop: Device.statusBarSize().height,
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 5,
  }
});