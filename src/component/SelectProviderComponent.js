import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import { Platform, SafeAreaView, StyleSheet, Text, View, Alert, Image, TouchableOpacity, KeyboardAvoidingView, BackHandler } from 'react-native';
import { ReachabilityView, i18next } from '../utils'
import { gotoLoginScreen, gotoRegisterScreen, backScreen } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import Fonts from '../constants/fonts'
import CommonStyles from '../constants/styles'
import FastImage from 'react-native-fast-image';
import Device from '../modules/Device';

export default class SelectProviderComponent extends Component {

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
    backScreen(this.props.componentId)
  }

  touchOnAgentButtonAction = () => {
    gotoRegisterScreen(this.props.componentId, 'AGENT')
  }

  touchOnGuiderButtonAction = () => {
    gotoRegisterScreen(this.props.componentId, 'GUIDER')
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.background}>
          <FastImage
            style={{ flex: 1 }}
            source={Images.background}
            resizeMode={FastImage.resizeMode.stretch}
          >
          </FastImage>
        </View>

        <Image
          style={{ alignSelf: 'center', marginTop: 50, width: 300, height: 300 }}
          source={Images.logo123}
          resizeMode='contain'

        />
        {/* phần ảnh logo phía trên cùng của trang */}

        <SafeAreaView style={{ position: 'absolute', left: 10, top: 20 }}>
          <TouchableOpacity
            style={{ flex: 1, }}
            onPress={() => { this.onBackButtonPressed() }}>
            <Image
              style={{ flex: 1, tintColor: Colors.white, width: 25, height: 25 }}
              source={Images.back}>
            </Image>

          </TouchableOpacity>
        </SafeAreaView>
        {/* <FastImage
          style={{ alignSelf: 'center', marginTop: 100, width: 307, height: 184 }}
          source={Images.logo_oneguide}
          resizeMode={FastImage.resizeMode.center}
        >
        </FastImage> */}

        <Text style={styles.titleText}>
          {i18next.t('WhoAreYou')}
        </Text>

        <View style={{ flexDirection: 'row', marginTop: 70, alignSelf: 'center' }}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.touchOnAgentButtonAction}>
            <FastImage
              style={{ alignSelf: 'center', width: 69, height: 65 }}
              source={Images.ic_agent}
              resizeMode={FastImage.resizeMode.contain}
            ></FastImage>
            <Text style={[styles.text, { marginTop: 10 }]}>{i18next.t('Agent')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this.touchOnGuiderButtonAction}>
            <FastImage
              style={{ alignSelf: 'center', width: 64, height: 65 }}
              source={Images.ic_guide}
              resizeMode={FastImage.resizeMode.contain}
            ></FastImage>
            <Text style={[styles.text, { marginTop: 10 }]}>{i18next.t('Guider')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  titleText: {
    marginTop: -57,
    color: Colors.white,
    fontSize: 30,
    fontWeight: '400',
    textAlign: 'center',
  },
  button: {
    height: 150,
    width: 150,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    borderColor: Colors.white,
    marginHorizontal: 15,
    backgroundColor: Colors.blue_1
  },
  text: {
    color: Colors.white,
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '400',
  },

});
