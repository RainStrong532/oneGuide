import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Image,
  ActivityIndicator, TouchableOpacity, Alert, Platform, FlatList,
  ScrollView, TextInput, KeyboardAvoidingView,
  RefreshControl
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { ReachabilityView, i18next, Loading } from '../utils'
import { backScreen, gotoPostDetail, showModalApplyList, pushToUserProfile } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import CommonStyles from '../constants/styles'
import DataManager from '../modules/DataManager'
import _ from 'lodash'
import Helper from '../utils/Helper';
import TourItemComponent from './tour-view/TourItemComponent'

export default class CancelTourComponent extends Component {
  constructor(props) {
    super(props);
    this.doGetListTour = this.doGetListTour.bind(this)
    this.handleDetailTour = _.debounce(this.onPressTourItem, 300, { leading: true, trailing: false })
    this.handleApplyTour = _.debounce(this.onPressApplyItem, 300, { leading: true, trailing: false })
    this.state = {
      refreshing: false,
      isLoadMore: true,
      tours: []
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.doGetListTour(this.page)
    }, 300);
  }

  componentWillUnmount() {

  }

  doGetListTour = (page) => {
    this.props.getListCanceled()
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

  handleName = (user_id) => {
    const data = { user_id }
    pushToUserProfile(this.props.componentId, data)
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
      //   onPressTourItem={this.handleDetailTour}
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
        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
          <Image
            source={Images.tour_name}
            resizeMode='contain'
            style={{ justifyContent: 'center', alignItems: 'center', width: 16, height: 16 }}
          />
          <Text style={{ paddingLeft: 5, fontSize: 14, textAlign: 'center' }}>{item.title}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
          <Image
            source={Images.tour_location}
            resizeMode='contain'
            style={{ justifyContent: 'center', alignItems: 'center', width: 16, height: 16 }}
          />
          <Text style={{ paddingLeft: 5, fontSize: 14, textAlign: 'center' }}>{item.location}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 5, alignItems: 'center' }}>
          <Image
            source={Images.tour_calendar}
            resizeMode='contain'
            style={{ justifyContent: 'center', alignItems: 'center', width: 16, height: 16 }}
          />
          <Text style={{ paddingLeft: 5, fontSize: 14, textAlign: 'center' }}>{item.date_tour}</Text>
        </View>
        {
          isAgent == '1' ?
            <View style={{ marginTop: 10, marginBottom: 5, justifyContent: 'space-between' }}>

              <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}>
                <Text >{i18next.t('OrganizationalUnits')} </Text>
                <TouchableOpacity
                  onPress={() => this.handleName(item.user_id)}
                >
                  <Text style={{ textDecorationLine: 'underline', color: Colors.green_1 }}>
                    {item.display_name}
                  </Text>
                </TouchableOpacity>
              </View>
            </View> : null
        }
      </View>
    )
  }

  onPressTourItem = (item) => {
    gotoPostDetail(this.props.componentId, { comment: item })
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