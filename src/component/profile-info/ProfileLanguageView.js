



import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import Device from '../../modules/Device'
import CommonStyles from '../../constants/styles'
import { i18next } from '../../utils'
import DateHelper from '../../utils/DateHelper'
import _ from 'lodash'

export default class ProfileLanguageView extends Component {

  static propTypes = {
    onSelectLanguagePress: PropTypes.func,
    // language: PropTypes.string,
    experience: PropTypes.string,
    // f_language: PropTypes.string,
    onSelectExperiencePress: PropTypes.func,
    onSelectOtherLanguagePress: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.onSelectLanguagePress = this.onSelectLanguagePress.bind(this)
    this.onSelectExperiencePress = this.onSelectExperiencePress.bind(this)
    this.onSelectOtherLanguagePress = this.onSelectOtherLanguagePress.bind(this)
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   const shouldUpdate = (
  //     nextProps.language !== this.props.language ||
  //     nextProps.experience !== this.props.experience ||
  //     nextProps.f_language !== this.props.f_language
  //   )
  //   return shouldUpdate
  // }

  onSelectExperiencePress = () => {
    if (this.props.onSelectExperiencePress) {
      this.props.onSelectExperiencePress()
    }
  }

  onSelectLanguagePress = () => {
    if (this.props.onSelectLanguagePress) {
      this.props.onSelectLanguagePress()
    }
  }

  onSelectOtherLanguagePress = () => {
    if (this.props.onSelectOtherLanguagePress) {
      this.props.onSelectOtherLanguagePress()
    }
  }

  render() {
    return (
      <View style={[this.props.style, styles.container]}>
        <View style={styles.languageInfo}>
          <Image
            style={{ marginLeft: 10, alignSelf: 'center', width: 15, height: 15 }}
            source={Images.ic_language}
            resizeMode='stretch'
          />
          <Text style={{ marginLeft: 5, fontSize: 16, fontWeight: '500' }}>{i18next.t('Languages')}</Text>
        </View>
        {this.getMainLanguage()}
        {this.getOtherLanguage()}
        {this.getExperience()}
      </View>
    )
  }

  getMainLanguage = () => {
    const language_name = _.get(this.props, 'language.name')
    // const language_name = _.get(this.props, 'language')

    return (
      <View style={styles.containView}>
        <Text style={styles.txtTitle}>{i18next.t('MainLanguage')}</Text>
        <View style={styles.buttonRight}>
          <TouchableOpacity
            style={styles.buttonPopup}
            onPress={() => { this.onSelectLanguagePress() }}
            disabled={this.props.isAgent === '2' ? true : false}>
            <Text>
              {language_name}
            </Text>
            <Image
              style={styles.imagedrop}
              resizeMode='center'
              source={Images.ic_dropdown}>
            </Image>
          </TouchableOpacity>
          <View style={styles.lineBottomText}></View>
        </View>
      </View>
    )
  }

  getOtherLanguage = () => {
    const f_language = _.get(this.props, 'f_language')
    const language_name = _.map(f_language, 'name').join(', ')
    return (
      <View style={styles.containView}>
        <Text style={styles.txtTitle}>{i18next.t('OtherLanguages')}</Text>
        <View style={styles.buttonRight}>
          <TouchableOpacity
            style={styles.buttonPopup}
            onPress={() => { this.onSelectOtherLanguagePress() }}>
            <Text>
              {language_name}
            </Text>
          </TouchableOpacity>
          <View style={styles.lineBottomText}></View>
        </View>
      </View>
    )
  }

  getExperience = () => {
    let experience = _.get(this.props, 'experience') || ''
    if (experience.includes('year')) {
      experience = experience
    } else {
      experience = experience + ' year'
    }
    return (
      <View style={styles.containView}>
        <Text style={styles.txtTitle}>{i18next.t('YearsofExp')}</Text>
        <View style={styles.buttonRight}>
          <TouchableOpacity
            style={styles.buttonPopup}
            onPress={() => { this.onSelectExperiencePress() }}
            disabled={this.props.isAgent === '2' ? true : false}>
            <Text>
              {experience}
            </Text>
            <Image
              style={styles.imagedrop}
              resizeMode='center'
              source={Images.ic_dropdown}>
            </Image>
          </TouchableOpacity>
          <View style={styles.lineBottomText}></View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    flexDirection: 'column',
    backgroundColor: Colors.white,
   height: 250,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    marginLeft: 15,
    marginRight: 15,
    paddingBottom: 30,
    marginBottom: 10
  },
  containView: {
    marginTop: 10,
    // flexDirection: 'row',
    //height: 36,
    // alignItems: 'center',
    flex: 1,
  },
  buttonRight: {
    marginHorizontal: 15,
  },
  imagedrop: {
    right: 10,
    width: 15,
    height: 15,
    position: 'absolute'
  },
  buttonPopup: {
    height: 30,
    justifyContent: 'center'
  },
  textInputForm: {
    fontSize: 14,
    // height: 35,
    justifyContent: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  lineBottomText: {
    height: 0.5,
    borderWidth: 0.5,
    borderColor: Colors.gray_1,

  },
  txtTitle: {
    // fontWeight: 'bold',
    fontSize: 12,
    marginHorizontal: 15,
  },
  languageInfo: {
    height: 50,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    alignItems: 'center'
  }
});
