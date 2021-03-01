import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Image,
  ActivityIndicator, TouchableOpacity, Alert, Platform, FlatList,
  ScrollView, TextInput, KeyboardAvoidingView,
  RefreshControl
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { ReachabilityView, i18next, Loading } from '../utils'
import { backScreen, showModalUserProfile, gotoChatScreen } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import CommonStyles from '../constants/styles'
import DataManager from '../modules/DataManager'
import HeaderView from '../component/views/HeaderView'
import _ from 'lodash'
import Helper from '../utils/Helper';
import TourItemComponent from './tour-view/TourItemComponent'
import UserItemView from './tour-view/UserItemView';

export default class UserApplyListComponent extends Component {

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
    this.doGetListUserApply = this.doGetListUserApply.bind(this)
    this.state = {
      refreshing: false,
      isLoadMore: true,
      tours: []
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.doGetListUserApply(this.props.commentId)
    }, 300);
  }

  doGetListUserApply = (commentId) => {
    this.props.getListUserApply(commentId)
      .then(data => {
        let tours = data

        this.setState({
          tours,
          refreshing: false,
          isLoadMore: false
        })
      })
      .catch(error => {
      });
  }

  render() {
    const { refreshing, tours } = this.state

    return (
      <View style={styles.container}>
        <HeaderView
          title={i18next.t('ListUserApply')}
          tintColor={Colors.white}
          style={{ backgroundColor: Colors.green_1 }}
          back={true}
          onPressLeftBarButton={this.onPressBack}
        />
        <FlatList
        removeClippedSubviews={false}
          data={tours}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          refreshing={refreshing}
          onRefresh={this.pullRefresh}
          onEndReached={this.loadMore}
          onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 10}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={this.renderBottom}
          ListEmptyComponent={this.renderEmpty}
        />
      </View>
    )
  }

  onPressBack = () => {
    backScreen(this.props.componentId)
  }

  onPressUserProfile = (user_id) => {
    showModalUserProfile(user_id, '')
  }

  onPressChatButon = (item) => {

    const conversation_id = _.get(item, 'conversation_id')
    const room = {
      user_id: item.user_id,
      name_list: item.display_name,
      conversation_id
    }
    gotoChatScreen(this.props.componentId, room)
  }

  renderEmpty = () => {

    const { isLoadMore } = this.state
    if (isLoadMore) {
      return null
    }

    return (<View style={styles.emptyView}>
      <Text style={{ fontSize: 14, color: Colors.black_1, textAlign: 'center' }}>
        {i18next.t('ThereIsNoApply')}
      </Text>
    </View>)
  }

  loadMore = () => {
    return
  }

  renderBottom = () => {
    const { isLoadMore } = this.state;
    return (<View style={{ height: 40, justifyContent: 'center' }}>
      {isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
    </View>)
  }

  pullRefresh = () => {
    if (this.state.refreshing === true) {
      return
    }

    this.setState({ refreshing: true }, () => {
      this.doGetListTour(1)
    })
  }

  renderItem = ({ item, index }) => {
    return (
      <UserItemView
        item={item}
        index={index}
        onPressUserProfile={this.onPressUserProfile}
        onPressChatButon={this.onPressChatButon}
      />
    )
  }

  keyExtractor = (item, index) => index.toString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  }
});