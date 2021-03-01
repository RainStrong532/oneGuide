import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, TouchableOpacity, Alert, Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { showModalCalendarDayFree } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import HeaderView from './views/HeaderView'
import CommonStyles from '../constants/styles'
import Device from '../modules/Device'
import FastImage from 'react-native-fast-image';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { ReachabilityView, i18next, Loading } from '../utils'
import _ from 'lodash'
import ApplyTourComponent from './ApplyTourComponent';
import UpcomingTourComponent from './UpcomingTourComponent';
import DepartedTourComponent from './DepartedTourComponent';
import CancelTourComponent from './CancelTourComponent';
import FinishTourComponent from './FinishTourComponent';
import TourInviteComponent from './TourInviteComponent';

const initialLayout = {
  height: Device.screenSize().height,
  width: Device.screenSize().width,
};

const TabKey = {
  Applied: 'Applied',//đăng ký
  Upcoming: 'Upcoming',//sắp diễn ra
  Departed: 'Departed',//khởi hành
  Cancelled: 'Cancelled',//hủy
  Finished: 'Finished',//kết thúc
  Invited: 'Invited'//lời mời
}


export default class TourComponent extends Component {

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

    const data = this.props.user.me
    this.isAgent = _.get(data, 'is_agent')

    if (this.isAgent === '2') {
      this.state = {
        index: 0,
        routes: [
          { key: TabKey.Applied, title: i18next.t('List'), select_icon: Images.ic_applied_blue, unSelect_icon: Images.ic_applied },
          { key: TabKey.Upcoming, title: i18next.t('Upcoming'), select_icon: Images.ic_upcoming_blue, unSelect_icon: Images.ic_upcoming },
          { key: TabKey.Departed, title: i18next.t('Departed'), select_icon: Images.ic_departed_blue, unSelect_icon: Images.ic_departed },
          { key: TabKey.Finished, title: i18next.t('Finished'), select_icon: Images.ic_cancelled_blue, unSelect_icon: Images.ic_cancelled },
        ],
      };
    } else {
      this.state = {
        index: 0,
        routes: [
          { key: TabKey.Applied, title: i18next.t('Danh sách'), select_icon: Images.ic_applied_blue, unSelect_icon: Images.ic_applied },
          { key: TabKey.Invited, title: i18next.t('Lời mời tour'), select_icon: Images.ic_departed_blue, unSelect_icon: Images.ic_departed },
          { key: TabKey.Upcoming, title: i18next.t('Upcoming'), select_icon: Images.ic_upcoming_blue, unSelect_icon: Images.ic_upcoming },
          { key: TabKey.Finished, title: i18next.t('Finished'), select_icon: Images.ic_cancelled_blue, unSelect_icon: Images.ic_cancelled },
        ],
      };
    }
  }

  componentDidMount() {

  }

  componentDidAppear() {

  }

  componentDidDisappear() {

  }

  onPressRightBarButton = () => {
    const callback = (data) => {

    }

    const data = {}
    showModalCalendarDayFree(data, { mitilchoise: false, disable: true }, callback)
  }

  _handleIndexChange = index => {
    this.setState({
      index,
    });
  }

  _renderTabBar = props => (
    <TabBar
      {...props}
      style={{ height: 65, backgroundColor: Colors.white }}
      indicatorStyle={{ backgroundColor: Colors.green_1 }}
      renderIcon={this._renderIcon}
      renderLabel={this._renderLabel}
    />
  );

  _renderScene = ({ route }) => {

    switch (route.key) {
      case TabKey.Applied:
        return (
          <ApplyTourComponent
            {...this.props}
            activeTab={route.key}

          />
        );
      case TabKey.Upcoming:
        return (
          <UpcomingTourComponent
            {...this.props}
            activeTab={route.key}

          />
        );
      case TabKey.Departed:
        return (
          <DepartedTourComponent
            {...this.props}
            activeTab={route.key}


          />
        );
      case TabKey.Cancelled:
        return (
          <CancelTourComponent
            {...this.props}
            activeTab={route.key}

          />
        );
      case TabKey.Finished:
        return (
          <FinishTourComponent
            {...this.props}
            activeTab={route.key}

          />
        );
      case TabKey.Invited:
        return (
          <TourInviteComponent
            {...this.props}
          />
        );

    }
  }

  _renderIcon = ({ route, focused, color }) => {
    return (
      <FastImage
        style={{ width: 20, height: 20 }}
        source={focused ? route.select_icon : route.unSelect_icon}
        resizeMode={FastImage.resizeMode.contain}
      />
    )
  }

  _renderLabel = ({ route, focused }) => {
    return (
      <Text
        style={{ color: focused ? Colors.green_1 : Colors.black, fontSize: 14, fontWeight: '400', textAlign: 'center', marginBottom: 10, width: Device.screenSize().width / 4 }}>
        {route.title}
      </Text>
    );
  }


  render() {

    const is_agent = _.get(this.props, 'user.me.is_agent') === '2'
    let imageRight = is_agent ? null : Images.tour_calendar

    return (
      <View style={[styles.container]}>
        <HeaderView
          title={i18next.t('Tour')}
          tintColor={Colors.white}
          style={{ backgroundColor: Colors.green_1 }}
          imageRight={imageRight}
          onPressRightBarButton={this.onPressRightBarButton}
        />

        <TabView
          lazy
          style={{ backgroundColor: '#F1F7F5' }}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderTabBar={this._renderTabBar}
          onIndexChange={this._handleIndexChange}
          initialLayout={initialLayout}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F1F7F5'
  },
  scene: {
    flex: 1,
  },
  activityIndicator: {
    marginTop: 100
  },
})
