


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
  BackHandler
}
  from 'react-native';
import { ReachabilityView, i18next } from '../utils'
import { gotoSettingProfileScreen } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import Fonts from '../constants/fonts'
import CommonStyles from '../constants/styles'
import HeaderView from './views/HeaderView'

export default class LaunchProfileComponent extends Component {

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
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onBackButtonPressed() {
  }

  touchOnStartButtonAction() {
    gotoSettingProfileScreen(this.props.componentId)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.background}>
          <Image
            style={{ flex: 1 }}
            source={Images.background}
            resizeMode='stretch'
          >
          </Image>
        </View>
        <Image
          style={{ alignSelf: 'center', marginTop: 150 }}
          source={Images.profile_update}
          resizeMode='center'
        >
        </Image>
        <View style={{ position: 'absolute', bottom: 150, flexDirection: 'column', alignSelf: 'center' }}>
          <Text
            style={{ fontSize: 22, fontWeight: '500', textAlign: 'center', color: Colors.white }}
          >
            {i18next.t('SettingUpYourProfile')}
          </Text>
          <Text
            style={{ marginTop: 10, fontSize: 16, fontWeight: '400', textAlign: 'center', color: Colors.white }}
          >
            {i18next.t('BaseontimeweatherTribes')}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.bottom_button}
          onPress={() => { this.touchOnStartButtonAction() }}
        >
          <Text style={styles.bottom_text}> {'Get started'} abc</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 100
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  titleText: {
    marginTop: 40,
    color: Colors.white,
    fontSize: 20,
    fontWeight: '400',
    textAlign: 'center',
  },
  titleText2: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
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
    fontWeight: '400',
    textAlign: 'center',
    color: Colors.white
  },
  text: {
    fontSize: 15,
    fontWeight: '400',
    marginLeft: 10
  },
});