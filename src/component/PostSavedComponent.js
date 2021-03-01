import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Image,
  ActivityIndicator, TouchableOpacity, Alert, Platform, FlatList,
  ScrollView, TextInput, KeyboardAvoidingView,
  RefreshControl
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { ReachabilityView, i18next, Loading } from '../utils'
import { backScreen, gotoPostDetail, gotoUserApplyScreen } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import CommonStyles from '../constants/styles'
import DataManager from '../modules/DataManager'
import _ from 'lodash'
import Helper from '../utils/Helper';
import TourItemComponent from './tour-view/TourItemComponent'
import HeaderView from '../component/views/HeaderView'

export default class PostSavedComponent extends Component {

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
    this.doGetListApplied = this.doGetListApplied.bind(this)
    this.page = 1
    this.state = {
      refreshing: false,
      isLoadMore: true,
      tours: []
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.doGetListApplied(this.page)
    }, 300);
  }

  componentWillUnmount() {

  }

  doGetListApplied = (page) => {
    this.props.getListApplied(page)
      .then(data => {
        let tours = data
        
        if (page !== 1 && data.length === 0) {
          const currentTour = this.state.tours
          tours = _.concat(currentTour, tours)
        }
        this.page = page + 1
        this.setState({
          tours,
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

    return (
      <View style={styles.container}>
        <HeaderView
          title={i18next.t('Saved')}
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
      this.doGetListApplied(this.page)
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
      this.doGetListApplied(1)
    })
  }

  renderItem = ({ item, index }) => {
    return (
      <TourItemComponent
        item={item}
        index={index}
        onPressTourItem={this.onPressTourItem}
        onPressApplyItem={this.onPressApplyItem}
      />
    )
  }

  onPressTourItem = (item) => {
    gotoPostDetail(this.props.componentId, { comment: item })
  }

  onPressApplyItem = (item) => {
    const commentId = _.get(item, 'comment_id')
    gotoUserApplyScreen(this.props.componentId, commentId)
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