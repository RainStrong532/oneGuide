
import React, { Component } from 'react';
import { Navigation } from 'react-native-navigation';
import PropTypes from 'prop-types';
import {
    Platform,
    SafeAreaView,
    StyleSheet,
    Text, View, Alert, Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    BackHandler,
    TextInput,
    ScrollView
}
    from 'react-native';
import { ReachabilityView, i18next } from '../../utils'
import { gotoSetupLanguageScreen } from '../../navigation';
import Images from '../../assets/images'
import Colors from '../../constants/colors'
import Fonts from '../../constants/fonts'
import CommonStyles from '../../constants/styles'
import HeaderView from '../../component/views/HeaderView'
import DismissKeyboard from 'dismissKeyboard';

export default class PhoneNumberView extends Component {

  static propTypes = {
    status: PropTypes.string,
  }
        
  constructor(props) {
    super(props);
  }

  componentDidMount() { 
  }

  componentWillUnmount() {
  }

  onBackButtonPressed() {
  }

  onChangeTextInput = (value) => {
    if(this.props.onSelectPhoneNumber) {
      this.props.onSelectPhoneNumber(value)
    }
  }

  render() {
    const offset = (Platform.OS === 'android') ? 0 : 40;
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity 
          style={styles.button_bg} 
          activeOpacity={1} 
          onPress={() => { DismissKeyboard() }}
        >
          <KeyboardAvoidingView style={styles.container} behavior={'padding'} keyboardVerticalOffset={offset} >
            <ScrollView style={{flex: 1}}>
              <View style={styles.viewCard}>
                <Image 
                  style={{alignSelf: 'center'}}
                  source={Images.phone_number}
                >
                </Image>
                <Text style={[styles.text, {fontSize: 16, fontWeight: 'bold', marginTop: 20}]}>
                  {i18next.t('AddYourPhoneLanguage')}
                </Text>
                <Text style={[styles.text, {fontSize: 15, fontWeight: '300', marginTop: 10}]}>
                  {i18next.t('Basedontimeweatherlocation')}
                </Text>
            
                <TextInput
                  style={{marginTop: 20, marginHorizontal: 30, height: 40, fontSize: 15}}
                  placeholder={i18next.t('AddYourPhoneLanguage')}
                  placeholderTextColor={Colors.light_gray_2}
                  secureTextEntry={false}
                  keyboardType='number-pad'
                  onChangeText={(value) => { this.onChangeTextInput(value) }}
                />
                <View style={styles.lineBottomText}></View>
              </View>
             </ScrollView> 
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 100
  },
  viewCard: {
    flex: 1, 
    flexDirection: 'column',
    backgroundColor: Colors.white, 
    marginTop: 120
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  button_bg: {
    justifyContent: 'center',
    flex: 1,
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
  lineBottomText: {
    marginTop: 0, 
    marginHorizontal: 30, 
    height: 0.5, 
    borderWidth: 0.5, 
    borderColor: Colors.gray_1
  },
  bottom_button: {
    position:'absolute', 
    alignItems: 'center',
    justifyContent: 'center', 
    left: 30, 
    right: 30, 
    borderRadius: 5,
    height: 45
  },
  bottom_text: {
    fontSize: 16, 
    fontWeight: '500', 
    textAlign: 'center', 
    color: Colors.white
  },
  text: {
    textAlign: 'center'
  }, 
});
