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
  showModalTourReview,
  pushReportTour,
  pushToUserProfile,
  pushListReportComponent,
  showModalReview,
  showModalGuideFinish,
  pushDetailTourInvited
} from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import CommonStyles from '../constants/styles'
import DataManager from '../modules/DataManager'
import _ from 'lodash'
import Helper from '../utils/Helper';
import TourItemComponent from './tour-view/TourItemComponent'

export default class FinishTourComponent extends Component {
  constructor(props) {
    super(props);
    this.doGetListTour = this.doGetListTour.bind(this)
    this.handleDtailTour = _.debounce(this.onPressTourItem, 500, { leading: true, trailing: false })
    this.handleApply = _.debounce(this.onPressApplyItem, 500, { leading: true, trailing: false })
    this.state = {
      refreshing: false,
      isLoadMore: true,
      tours: []
    }
  }

  componentDidMount() {

    this.doGetListTour(this.page)

  }
  nextScreenGetList = () => {
    this.setState({
      refreshing: true,
      isLoadMore: true
    })
    this.doGetListTour(this.page)
  }
  componentWillUnmount() {

  }

  doGetListTour = (page) => {
    this.props.getListFinished()
      .then(data => {
        let tours = data
        Loading.hideHud()
        this.setState({
          tours,
          refreshing: false,
          isLoadMore: false
        })
      })
      .catch(error => {
        Loading.hideHud()
        this.setState({
          refreshing: false,
          isLoadMore: false
        })
      });
  }
  handleName = (user_id) => {
    const data = { user_id }
    pushToUserProfile(this.props.componentId, data)
  }
  render() {
    const { refreshing, tours } = this.state

    return (
      <View style={styles.container}>
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

  handleReview = (item) => {
    // guide thi show 1 danh gia voi agent
    // agent thi show danh gia cua nhieu guide
    // showModalTourReview(this.props.componentId, { item })
    showModalReview(this.props.componentId, { item }, this.nextScreenGetList)
  }

  handleAgentReView = (item) => {
    showModalGuideFinish(this.props.componentId, { item }, this.nextScreenGetList, null)
  }

  onPressRepostView = (item) => {
    const isAgent = _.get(this.props, 'user.me.is_agent')

    if (isAgent == 1) {
      pushReportTour(this.props.componentId, { item }, this.nextScreenGetList)
    } else if (isAgent == 2) {
      pushListReportComponent(this.props.componentId, item)
    }

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
      //   onPressApplyItem={this.handleApply}
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
            <View style={{ flexDirection: 'row', marginRight: 5 }}>
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
              <View style={{ width: '88%', justifyContent: 'center', marginLeft: 3 }}>
                <TouchableOpacity
                  style={{ marginLeft: 6 }}
                  onPress={() => this.handleName(item.user_id)}
                >
                  <Text style={{ color: Colors.black, fontSize: 16, fontWeight: '500' }}>
                    {item.display_name}
                  </Text>
                  <Text>
                    {item.created_format}
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
          <View style={{ flexDirection: 'row', marginTop: 5, }}>
            <Image
              source={Images.tour_location}
              resizeMode='contain'
              style={{ marginTop: 3, width: 16, height: 16 }}
            />
            <Text style={{ paddingLeft: 5, fontSize: 14, color: Colors.black }}>{item.location}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5, }}>
            <Image
              source={Images.tour_calendar}
              resizeMode='contain'
              style={{ marginTop: 3, width: 16, height: 16 }}
            />
            <Text style={{ paddingLeft: 5, fontSize: 14, color: Colors.black }}>{item.date_tour}</Text>
          </View>
        </TouchableOpacity>
        {

          isAgent == 2 ?
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginTop: 10,
              borderTopWidth: 0.5,
              borderTopColor: Colors.light_gray_1,
              // paddingLeft: 5,
              paddingVertical: 10,
              paddingHorizontal: 15
            }}>
              <TouchableOpacity
                onPress={() => this.onPressRepostView(item)}
              >
                <View style={{ flexDirection: 'row', }}>
                  <Image
                    source={Images.icon_repost}
                    style={{ width: 16, height: 16, resizeMode: 'contain', alignSelf: 'center' }}
                  />
                  <Text style={{ fontSize: 14, paddingLeft: 5, color: Colors.black }}>Xem báo cáo </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.handleAgentReView(item)}
              >
                <View style={{ flexDirection: 'row', }}>
                  <Image
                    source={Images.icon_repost}
                    style={{ width: 16, height: 16, resizeMode: 'contain', alignSelf: 'center' }}
                  />
                  <Text style={{ fontSize: 14, paddingLeft: 5, color: Colors.black }}>Viết đánh giá </Text>
                </View>
              </TouchableOpacity>
            </View>
            :
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly', marginTop: 10,
              borderTopWidth: 0.5,
              borderTopColor: Colors.light_gray_1,
              paddingHorizontal: 15,
              paddingVertical: 10
            }}>
              <TouchableOpacity
                onPress={() => this.onPressRepostView(item)}
              >
                <View style={{ flexDirection: 'row', }}>
                  <Image
                    source={Images.icon_repost}
                    style={{ width: 16, height: 16, resizeMode: 'contain', alignSelf: 'center' }}
                  />
                  {
                    item.sended_report.toString() == '1' ?
                      <Text style={{ fontSize: 14, paddingLeft: 5, color: Colors.black }}>Chỉnh sửa báo cáo</Text> :
                      <Text style={{ fontSize: 14, paddingLeft: 5, color: Colors.black }}>Viết báo cáo</Text>
                  }
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.handleReview(item)}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={Images.icon_write_repost}
                    style={{ width: 16, height: 16, resizeMode: 'contain', alignSelf: 'center' }}
                  />
                  {
                    item.reviewed.toString() == '1' ?
                      <Text style={{ fontSize: 14, paddingLeft: 5, color: Colors.black }}>Chỉnh sửa nhận xét</Text> :
                      <Text style={{ fontSize: 14, paddingLeft: 5, color: Colors.black }}>Viết nhận xét</Text>
                  }
                </View>
              </TouchableOpacity>
            </View>
        }
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