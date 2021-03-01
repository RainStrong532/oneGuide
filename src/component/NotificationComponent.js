import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Platform
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import {
  gotoPostDetail,
  pushToUserProfile,
  pushInformationGroup,
  pushToGroup
} from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import SearchBarView from './views/SearchBarView'
import HeaderView from './views/HeaderView'

import CommonStyles from '../constants/styles'
import _ from 'lodash'
import { i18next, Loading } from '../utils'
import DateHelper from '../utils/DateHelper'
import SearchComponent from '../component/SearchComponent'
import moment from 'moment';
import Helper from '../utils/Helper'

export default class NotificationComponent extends Component {

  static options(passProps) {
    return {
      statusBar: {
        backgroundColor: 'transparent',
        visible: true,
        style: 'light'
      },
    };
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.doGetNotifications = this.doGetNotifications.bind(this)
    this.renderBottom = this.renderBottom.bind(this)
    this.pullRefresh = this.pullRefresh.bind(this)
    this.onPressDismissSearch = this.onPressDismissSearch.bind(this)
    // first page already loaded from home screen
    // this.page = 1
    this.state = {
      isLoadMore: false,
      refreshing: false,
      isSearching: false,
      page: 1
    }
  }

  componentDidMount() {
    // this.doGetNotifications(this.page)
    Navigation.events().registerBottomTabSelectedListener(({ selectedTabIndex, unselectedTabIndex }) => {
      console.log(" button id 3", selectedTabIndex, unselectedTabIndex);
      if (selectedTabIndex === 3) {
        console.log("hieu: ", selectedTabIndex);
        this.doGetNotifications(1)
        this.doGetMyInfo()
      }
    });


  }

  // componentDidAppear() {
  //   if (!this.didAppearFirst) {
  //     this.didAppearFirst = true
  //     Navigation.events().registerBottomTabSelectedListener(({ selectedTabIndex, unselectedTabIndex }) => {
  //       console.log(" button id 3", selectedTabIndex, unselectedTabIndex);
  //       if (selectedTabIndex === 3) {
  //         this.doGetNotifications(this.page)
  //       }
  //     });

  //   }
  //  
  // }

  componentDidDisappear() {

  }


  onPressSearch = () => {
    this.setState({
      isSearching: true
    })
  }

  onPressDismissSearch = () => {
    this.setState({
      isSearching: false
    })
  }

  doGetNotifications = (page) => {
    console.log("tutu: ", page)


    // request
    this.props.getListNotifications(page)
      .then(data => {
        // console.log("postNotification", data)

        this.setState({
          refreshing: false,
          isLoadMore: false
        })
      })
      .catch(error => {
      });
  }

  doGetMyInfo = async () => {
    // request
    this.props.getMyInfo()
      .then(data => {
      })
      .catch(error => {

      });
  }


  loadMore = () => {
    if (this.state.isLoadMore === true) {
      return
    }

    this.setState({ isLoadMore: true }, () => {
      this.state.page += 1
      this.doGetNotifications(this.state.page)
    })
  }

  pullRefresh = () => {
    if (this.state.refreshing === true) {
      return
    }

    this.setState({ refreshing: true, page: 1 }, () => {
      this.doGetNotifications(1)
    })
  }

  onPressMoreOptionsButton = (notification) => {
    Helper.showAlert('', i18next.t('AreYouSureDeleteNotification'),
      [
        { text: i18next.t('Cancel'), style: 'cancel', onPress: null },
        {
          text: i18next.t('Ok'), style: 'destructive', onPress: () => {

            // tạm đóng
            const notification_id = _.get(notification, 'notification_id')
            this.doDeleteNotification(notification_id)
          }
        }
      ]
    )
  }

  onPressItem = (notification) => {
    // console.log("press-request", notification);
    const type = _.get(notification, 'type')
    const group_id = _.get(notification, 'group_id')
    if (type === 'user') {
      // console.log('chaysj vaof usser', type);
      const user_id = _.get(notification, 'user_id')
      const data = { user_id }
      if (user_id) {

        pushToUserProfile(this.props.componentId, data)
      }
    } else
      if (type === 'comment') {
        // console.log('chaysj vaof comment', type);
        // console.log('notification onPressItem', notification);
        const comment_id = _.get(notification, 'comment_id')
        const comment = { comment_id }
        //get Post from comment_id
        //push data gotoPostDetail
        //check data push PostDetailComponet
        // console.log('comment notification', notification.comment);
        gotoPostDetail(this.props.componentId, {
          comment: notification.comment,
          isNotifycation: true,
          notification_id: notification.notification_id
        }, { showKeyboard: true })
      } else
        if (type === 'group') {
          this.props.getInfomationGroup(group_id)
            .then(res => {
              const dataConvert = {
                ...res,
                background: res.avatar,
                id: group_id
              }
              if (res.check_user == 'no') {
                pushInformationGroup(this.props.componentId, {
                  passProps: dataConvert
                })
              } else
                if (res.check_user == 'yes') {
                  pushToGroup(this.props.componentId, {
                    passProps: dataConvert
                  })
                }
            })
            .catch(err => {
              // console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', err);
            })
        }
        else {
          alert(i18next.t('TheArticleDoesNotExist'))
        }

  }

  doDeleteNotification = (notification_id) => {
    // tạm đóng
    Loading.showHud()

    // request
    this.props.deleteNotification(notification_id)
      .then(data => {
        Loading.hideHud()
      })
      .catch(error => {
        Loading.hideHud()
      });
  }


  render() {
    const { refreshing, isSearching } = this.state
    const notifications = _.get(this.props, 'notification.notifications')
    // const { notifications } = this.props.notification
    // console.log("notifications", notifications);

    return (
      <View style={[styles.container]}>
        {/* <SearchBarView
          onPressSearch={this.onPressSearch}
          onPressCancel={this.onPressDismissSearch} /> */}
        <HeaderView
          title={i18next.t('Notification')}
          tintColor={Colors.white}
          style={{ backgroundColor: Colors.green_1 }}
        // imageRight={Images.new_message}
        // back={true}
        // onPressRightBarButton={this.onPressBack}
        />
        <View style={{ flex: 1 }}>
          <FlatList
            removeClippedSubviews={false}
            // ref={innerRef}
            data={notifications}
            extraData={this.state}
            //tạm đóng
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            ListFooterComponent={this.renderBottom}
            refreshing={refreshing}
            onRefresh={this.pullRefresh}
            onEndReached={this.loadMore}
            onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 1}
            ListEmptyComponent={this.renderEmpty} />
          {/* <Text>Test search component</Text> */}

          {
            isSearching &&
            <SearchComponent
              style={[CommonStyles.position_absolute_full]}
              onPressDismiss={this.onPressDismissSearch} />

          }
        </View>
      </View>
    );
  }
  // tạm đóng
  keyExtractor = (item, index) => index.toString();

  renderItem = ({ index, item }) => {

    const data = { index, notification: item } || {}
    return (
      <NotificationView
        data={data}
        onPressMoreOptionsButton={this.onPressMoreOptionsButton}
        onPressItem={this.onPressItem} />
    )
  }

  renderEmpty = () => {

    const { isLoadMore } = this.state
    if (isLoadMore) {
      return null
    }

    return (<View style={styles.emptyView}>
      <Text style={{ fontSize: 14, color: Colors.black_1, textAlign: 'center' }}>
        {i18next.t('ThereIsNoNotification')}
      </Text>
    </View>)
  }


  renderBottom() {
    const { isLoadMore } = this.state;
    return (<View style={{ height: 40, justifyContent: 'center' }}>
      {isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
    </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // paddingTop: 20,
    backgroundColor: Colors.white
  },
  activityIndicator: {
    marginTop: 100
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  }
})



class NotificationView extends Component {

  // static propTypes = {
  //   onPressMoreOptionsButton: PropTypes.func,
  //   onPressAvatarButton: PropTypes.func
  // }

  constructor(props) {
    super(props);
    this.onPressMoreOptionsButton = this.onPressMoreOptionsButton.bind(this)
    this.onPressAvatarButton = this.onPressAvatarButton.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {

    const nextData = _.get(nextProps, 'data.notification')
    const data = _.get(this.props, 'data.notification')

    const shouldUpdate = (
      nextData.avatar !== data.avatar ||
      nextData.time !== data.time ||
      nextData.message !== data.message ||
      nextData.seen !== data.seen ||
      nextData.username !== data.username
    )
    return shouldUpdate
  }

  onPressMoreOptionsButton = () => {
    const notification = _.get(this.props, 'data.notification')
    if (this.props.onPressMoreOptionsButton) {
      this.props.onPressMoreOptionsButton(notification)
    }
  }

  onPressAvatarButton = () => {
    if (this.props.onPressAvatarButton) {
      this.props.onPressAvatarButton()
    }
  }

  onPressItem = () => {
    // console.log('this.props', this.props);
    if (this.props.onPressItem) {
      const notification = _.get(this.props, 'data.notification')
      this.props.onPressItem(notification)
    }
  }

  getSubColor = (action) => {
    switch (action) {
      case 'like':
        return Colors.blue
      case 'comment':
        return Colors.red
      case 'addfriend':
        return Colors.yellow
      case 'friend':
        return Colors.gray
    }
  }

  render() {
    console.log('pờ rốp nô tì phai com bố nừn', this.props);
    // date
    // const avatar = _.get(this.props, 'data.notification.avatar')
    let avatar = this.props && this.props.data && this.props.data.notification && this.props.data.notification.avatar ? this.props.data.notification.avatar : ''
    let time = _.get(this.props, 'data.notification.time')
    const seen = _.get(this.props, 'data.notification.seen')
    const action = _.get(this.props, 'data.notification.action')
    // const seenColor = (seen === '0') ? Colors.white : Colors.light_gray_1
    const seenColor = (this.props.data.index % 2) ? Colors.light_white : Colors.white
    const diffTime = moment(time, 'YYYY-MM-D hh:mm:ss')
    var duration = diffTime.fromNow()
    if (duration === 'a day ago') {
      duration = `Hôm qua lúc ${diffTime.format('HH:mm')}`
    } else if (parseInt(duration.split(' ')[0]) < 7 && duration.includes('day')) {
      duration = `${diffTime.format('dddd')} lúc ${diffTime.format('HH:mm')}`
    } else if (parseInt(duration.split(' ')[0]) >= 7 && duration.includes('day')) {
      duration = `${diffTime.format('DD/MM')} lúc ${diffTime.format('HH:mm')}`
    } else {
      duration = `${diffTime.format('DD/MM')} lúc ${diffTime.format('HH:mm')}`
    }

    return (
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: seenColor, flexDirection: 'row' }}
        onPress={this.onPressItem}


      >
        {/* View Profile  */}
        <TouchableOpacity style={{ margin: 10, height: 60, width: 60 }}
          onPress={this.onPressAvatarButton}

        >
          <Image style={{ height: 60, width: 60, alignSelf: 'center', borderColor: 'gray', borderWidth: 1, borderRadius: 30 }}
            source={{ uri: avatar }}></Image>
          <Image
            style={{ position: 'absolute', right: -2, bottom: -2, width: 24, height: 24, borderRadius: 12, backgroundColor: this.getSubColor(action) }}
            resizeMode='center'>
          </Image>
        </TouchableOpacity>
        <View style={{
          flex: 1,
          marginBottom: 10,
          marginTop: 20
        }}>
          {this.renderTitle()}
          <Text style={{
            // flex: 1,
            marginTop: 5,
            fontSize: 13,
            color: Colors.gray_4,
          }} >{duration}</Text>
        </View>

        <TouchableOpacity
          style={{ height: 40, width: 40, alignSelf: 'center' }}
          onPress={this.onPressMoreOptionsButton} >
          <Image style={{ height: 40, width: 40, opacity: 0.5 }}
            source={Images.post_more_options}
            resizeMode='center' />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  renderTitle() {

    const message = _.get(this.props, 'data.notification.message')
    const username = _.get(this.props, 'data.notification.username')

    return (
      <View style={{ flexDirection: 'row' }} >

        <Text>
          <Text style={{ fontWeight: 'bold', color: Colors.black_1 }}
            onPress={this.onPressNameButton} >{username} </Text>
          <Text style={{ color: Colors.black_1, fontWeight: '400' }}>{message}</Text>
        </Text>

      </View>
    )
  }

}
