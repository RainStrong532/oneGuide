import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Image,
  ActivityIndicator, TouchableOpacity, Alert, Platform, FlatList,
  ScrollView, TextInput, KeyboardAvoidingView,
  RefreshControl
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { ReachabilityView, i18next, Loading } from '../utils'
import {
  backScreen,
  gotoPostDetail,
  showModalApplyList,
  pushToUserProfile,
  pushDetailTourInvited,
  showModalGuideFinish
} from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import CommonStyles from '../constants/styles'
import DataManager from '../modules/DataManager'
import _ from 'lodash'
import Helper from '../utils/Helper';
import TourItemComponent from './tour-view/TourItemComponent'

export default class DepartedTourComponent extends Component {
  constructor(props) {
    super(props);
    this.doGetListTour = this.doGetListTour.bind(this)
    this.handleDtailTour = _.debounce(this.onPressTourItem, 300, { leading: true, trailing: false })
    this.handleApplyTour = _.debounce(this.onPressApplyItem, 500, { leading: true, trailing: false })
    this.page = 1
    this.state = {
      refreshing: false,
      isLoadMore: true,
      // tours: []
    }
  }

  componentDidMount() {
    this.doGetListTour(this.page)

  }

  componentWillUnmount() {

  }

  doGetListTour = (page) => {
    this.props.getListDeparted(page)
      .then(data => {
        // let tours = data

        this.page = page + 1
        this.setState({
          // tours,
          refreshing: false,
          isLoadMore: false
        })
      })
      .catch(error => {
        this.setState({
          isLoadMore: false
        })
      });
  }

  render() {
    const { refreshing, tours } = this.state
    const { listTourDeparted } = this.props
    return (
      <View style={styles.container}>
        <FlatList
          removeClippedSubviews={false}
          data={listTourDeparted}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          refreshing={refreshing}
          onRefresh={this.pullRefresh}
          onEndReached={this.loadMore}
          onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 10}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={this.renderBottom}
          ListEmptyComponent={this.renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.pullRefresh}
            />
          }
        />
      </View>
    )
  }
  handleName = (user_id) => {

    const data = { user_id }
    pushToUserProfile(this.props.componentId, data)
  }
  renderEmpty = () => {

    const { isLoadMore } = this.state
    if (isLoadMore) {
      return null
    }

    return (<View style={styles.emptyView}>
      <Text style={{ fontSize: 14, color: Colors.black_1, textAlign: 'center' }}>
        {i18next.t('ThereIsNoTour')}
      </Text>
    </View>)
  }

  loadMore = () => {
    if (this.state.isLoadMore === true) {
      return
    }

    this.setState({ isLoadMore: true }, () => {
      this.doGetListTour(this.page)
    })
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

  handleListGuideTour = (item) => {
    //danh sach Guide dang di tour
    let tabKey = 'Departed'
    showModalGuideFinish(this.props.componentId, { item }, null, tabKey)

  }

  renderItem = ({ item, index }) => {

    const user_id = _.get(this.props, 'user.me.user_id')
    const user_id_create_tour = _.get(item, 'user_id')
    const show_number = (user_id === user_id_create_tour)
    const isAgent = _.get(this.props, 'user.me.is_agent')
    return (
      // <TourItemComponent
      //   item={item}
      //   index={index}
      //   onPressTourItem={this.handleDtailTour}
      //   onPressApplyItem={this.handleApplyTour}
      //   show_number={show_number}
      //   isAgent = {isAgent}
      //   activeTab = {this.props.activeTab}
      // />
      <View style={{
        paddingHorizontal: 10,
        // borderBottomWidth: 0.5,
        justifyContent: "center", paddingVertical: 5, marginTop: 10, backgroundColor: '#ffffff'
      }}>
        {
          isAgent == 1 ?
            <View style={{ flexDirection: 'row', marginHorizontal: 10, }}>
              <View style={{ width: '12%' }}>
                <TouchableOpacity
                  onPress={() => this.handleName(item.user_id)}
                >
                  <Image
                    source={{ uri: item.avatar }}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ width: '88%', justifyContent: 'center' }}>
                <TouchableOpacity
                  onPress={() => this.handleName(item.user_id)}
                >
                  <Text style={{ color: Colors.black, fontSize: 16, fontWeight: '500' }}>
                    {item.display_name}
                  </Text>
                </TouchableOpacity>
              </View>

            </View> :
            null
        }
        <TouchableOpacity
          onPress={() => this.onPressTourItem(item)}
        >

          <View style={{ flexDirection: 'row', marginTop: 10, }}>
            <Image
              source={Images.tour_name}
              resizeMode='contain'
              style={{ marginTop: 3, width: 16, height: 16 }}
            />
            <Text style={{ paddingLeft: 5, fontSize: 14, color: Colors.black, fontWeight: '600' }}>{item.title}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 10, }}>
            <Image
              source={Images.tour_location}
              resizeMode='contain'
              style={{ marginTop: 3, width: 16, height: 16 }}
            />
            <Text style={{ paddingLeft: 5, fontSize: 14, color: Colors.black }}>{item.location}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 5, }}>
            <Image
              source={Images.tour_calendar}
              resizeMode='contain'
              style={{ marginTop: 3, width: 16, height: 16 }}
            />
            <Text style={{ paddingLeft: 5, fontSize: 14, color: Colors.black }}>{item.date_tour}</Text>
          </View>
        </TouchableOpacity>

        <View style={{
          flexDirection: 'row', alignItems: 'center',
          justifyContent: 'space-between', marginTop: 10,
          borderTopWidth: 0.5,
          borderTopColor: Colors.light_gray_1,
          paddingHorizontal: 15,
          paddingVertical: 10
        }}>
          <TouchableOpacity
            onPress={() => this.handleListGuideTour(item)}
          >
            <View style={{ flexDirection: 'row', }}>
              <Image
                source={Images.tour}
                style={{ width: 14, height: 14, resizeMode: 'contain', alignSelf: 'center' }}
              />
              <Text style={{ fontSize: 14, paddingLeft: 5, color: Colors.black }}>Hướng dẫn viên </Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    )
  }

  onPressTourItem = (item) => {
    // gotoPostDetail(this.props.componentId, { comment: item })
    pushDetailTourInvited(this.props.componentId, { item })
  }

  onPressApplyItem = (item) => {
    const user_id = _.get(this.props, 'user.me.user_id')
    const user_id_create_tour = _.get(item, 'user_id')
    const comment_id = _.get(item, 'comment_id')

    if (user_id === user_id_create_tour) {
      showModalApplyList(this.props.componentId, { comment_id })
    } else {
      // this.doApplyTour(comment_id)
    }
  }

  keyExtractor = (item, index) => index.toString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  }
});