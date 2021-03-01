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
import { gotoLoginScreen, gotoTutorialScreen } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import Fonts from '../constants/fonts'
import CommonStyles from '../constants/styles'
import DataManager from '../modules/DataManager';
import FastImage from 'react-native-fast-image';

const en = 'EN'
const vn = 'VN'
const TYPE_LANGUAGE = 'TYPE_LANGUAGE'

export default class SelectLanguageComponent extends Component {

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
    this.state = {
      select_vn: true,
    }
  }

  componentDidMount() { 
  }

  componentWillUnmount() {
  }

  onBackButtonPressed() {
  }

  onPressGetStated() {
    gotoTutorialScreen(this.props.componentId)
  }

  onSelectLanguagePressed(type) {
    switch (type) {
      case vn: 
        this.setState({select_vn: true})
        i18next.changeLanguage('vn')
        DataManager.saveValue(type, TYPE_LANGUAGE)
        this.forceUpdate()
        return
      case en: 
        this.setState({select_vn: !this.state.select_vn})
        i18next.changeLanguage('en')
        DataManager.saveValue(type, TYPE_LANGUAGE)
        this.forceUpdate()
        return
      default:
        return
    }
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
          <FastImage
            style={{ alignSelf: 'center', marginTop: 100, width: 307, height: 184 }}
            source={Images.logo_oneguide}
            resizeMode={FastImage.resizeMode.contain}
          >
          </FastImage>
          {/* <Text style={styles.titleText}>
            {i18next.t('WelcomeAvaiguide')}
          </Text> */}

        <View style={{ flexDirection: 'column', marginTop: 40, marginHorizontal: 30}}>
          <Text style={styles.titleText2}>
            {i18next.t('ChooseAnotherLanguage')}
          </Text>
          <TouchableOpacity
            style={styles.button_vn}
            onPress={()=> {this.onSelectLanguagePressed(vn)}}
          >
            <FastImage
              style={{ marginLeft: 20, width: 28, height: 20 }}
              source={Images.ic_vn}
              resizeMode={FastImage.resizeMode.contain}>
            </FastImage>
            <Text style={styles.text}> {'Vietnam'} </Text>
            {
              this.state.select_vn && (
                <FastImage
                  style={{ position: 'absolute', right: 10, alignSelf: 'center', width: 20, height: 20 }}
                  source={Images.ic_select}
                  resizeMode={FastImage.resizeMode.contain}>
                </FastImage>
              )
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button_en}
            onPress={()=> {this.onSelectLanguagePressed(en)}}
          >
            <FastImage
              style={{ marginLeft: 20, width: 28, height: 20 }}
              source={Images.ic_en}
              resizeMode={FastImage.resizeMode.contain}>
            </FastImage>
            <Text style={styles.text}> {'English'} </Text>
            {
              !this.state.select_vn && (
                <FastImage
                  style={{ position: 'absolute', right: 10, alignSelf: 'center', width: 20, height: 20 }}
                  source={Images.ic_select}
                  resizeMode={FastImage.resizeMode.contain}>
                </FastImage>
              )
            }
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.bottom_button}
          onPress={() => {this.onPressGetStated()} }
        >
          <Text style={styles.bottom_text}> {i18next.t('GetStarted')} </Text>
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
  button_vn: {
    backgroundColor:Colors.white, 
    flexDirection: 'row', 
    borderRadius: 5, 
    alignItems: 'center', 
    marginTop: 40, 
    height: 45
  },
  button_en: {
    backgroundColor:Colors.white, 
    flexDirection: 'row', 
    borderRadius: 5, 
    alignItems: 'center', 
    marginTop: 10, 
    height: 45
  },
  bottom_button: {
    position:'absolute', 
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