
import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text, View, Alert, Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  BackHandler,
  Animated,
  AsyncStorage
}
  from 'react-native';
import { ReachabilityView, i18next } from '../utils'
import { gotoLoginScreen } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import Fonts from '../constants/fonts'
import CommonStyles from '../constants/styles'
import HeaderView from '../component/views/HeaderView'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import DataManager from '../modules/DataManager';
import Device from '../modules/Device'
import FastImage from 'react-native-fast-image';

const SKIP_TUTORIAL = 'SKIP_TUTORIAL'

const initialLayout = {
  height: Device.screenSize().height,
  width: Device.screenSize().width,
};

const TabKey = {
  first: 'first',
  second: 'second',
  third: 'third',
}

export default class TutorialComponent extends Component {

  static options(passProps) {
    return {
      statusBar: {
        backgroundColor: 'transparent',
        visible: true,
        style: 'light'
      },
    };
  }

  state = {
    index: 0,
    routes: [
      { key: TabKey.first },
      { key: TabKey.second },
      { key: TabKey.third },
    ],
  };

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onBackButtonPressed() {
  }

  async touchOnNextStepButtonAction() {
    if (this.state.index < 2) {
      this.setState({
        index: this.state.index + 1,
      })
    } else if (this.state.index === 2) {
      // Set a key to storage in order to skip tutorial 
      // at the next time go to our app
      await DataManager.saveValue(JSON.stringify(true), SKIP_TUTORIAL)
      // Navigate to login screen
      gotoLoginScreen(this.props.componentId)
    }
    return
  }

  _handleIndexChange = index => {
    this.setState({
      index,
    });
  }

  _renderTabBar = props => (
    <TabBar
      {...props}
      style={{ height: 0 }}
      indicatorStyle={{ backgroundColor: 'transparent' }}
    />
  );

  _renderScene = ({ route }) => {
    switch (route.key) {
      case TabKey.first:
        return (
          <FastImage
            style={styles.scene}
            source={Images.walkthrough1}
            resizeMode={FastImage.resizeMode.center}
          />
        );
      case TabKey.second:
        return (
          <FastImage
            style={styles.scene}
            source={Images.walkthrough2}
            resizeMode={FastImage.resizeMode.center}
          />
        );
      case TabKey.third:
        return (
          <FastImage
            style={styles.scene}
            source={Images.walkthrough3}
            resizeMode={FastImage.resizeMode.center}
          />
        );
    }
  }

  getTitleTab() {
    switch (this.state.index) {
      case 0: return i18next.t('DiscoveryAmazingPlace')
      case 1: return i18next.t('Tailormadetour')
      case 2: return i18next.t('ShareYourAdventure')
    }
  }

  getContentTitleTab() {
    switch (this.state.index) {
      case 0: return i18next.t('NearbyorWherever')
      case 1: return i18next.t('BaseontimeweatherTribes')
      case 2: return i18next.t('RatePlaceToShareFriends')
    }
  }

  async onTouchSkipTutorialAction() {
    DataManager.saveValue(JSON.stringify(true), SKIP_TUTORIAL)
    gotoLoginScreen(this.props.componentId)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={CommonStyles.position_absolute_full}>
          <FastImage
            style={{ flex: 1 }}
            source={Images.background}
            resizeMode={FastImage.resizeMode.stretch}>
          </FastImage>
        </View>
        <TabView
          style={{ marginBottom: 250 }}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderTabBar={this._renderTabBar}
          tabBarPosition='bottom'
          onIndexChange={this._handleIndexChange}
          initialLayout={initialLayout}
        />

        <View style={styles.containerIndicator}>
          <View style={[styles.indicator, { opacity: this.state.index === 0 ? 1 : 0.5 }]} />
          <View style={[styles.indicator, { opacity: this.state.index === 1 ? 1 : 0.5 }]} />
          <View style={[styles.indicator, { opacity: this.state.index === 2 ? 1 : 0.5 }]} />
        </View>

        <View style={styles.containerTitle}>
          <Text style={styles.topTitle}>
            {this.getTitleTab()}
          </Text>
          <Text style={styles.bottomTitle}>
            {this.getContentTitleTab()}
          </Text>
        </View>
        <TouchableOpacity
          style={{ position: 'absolute', top: 40, right: 20 }}
          onPress={() => { this.onTouchSkipTutorialAction() }}>
          <Text style={{ color: Colors.white, fontSize: 18 }}>
            {i18next.t('Skip')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottom_button}
          onPress={() => { this.touchOnNextStepButtonAction() }}>
          <Text style={styles.bottom_text}> {i18next.t('NextStep')} </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  scene: {
    alignSelf: 'center',
    marginTop: 90,
    width: initialLayout.width - 40,
    height: initialLayout.width - 40
  },
  containerIndicator: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 250,
    alignSelf: 'center'
  },
  indicator: {
    marginTop: 0,
    height: 8,
    width: 8,
    backgroundColor: Colors.white,
    margin: 8,
    borderRadius: 5
  },
  bottom_button: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 70,
    left: 30,
    right: 30,
    borderRadius: 5,
    borderColor: Colors.white,
    borderWidth: 1,
    height: 45
  },
  bottom_text: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: Colors.white
  },
  containerTitle: {
    position: 'absolute',
    bottom: 150,
    flexDirection: 'column',
    alignSelf: 'center'
  },
  topTitle: {
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center',
    color: Colors.white
  },
  bottomTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    color: Colors.white
  },
});
