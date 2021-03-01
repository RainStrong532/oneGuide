


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

const screenWidth = Device.screenSize().width

export default class ProfileInfoHeaderView extends Component {

  static propTypes = {

  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={[this.props.style, { flexDirection: 'row', height: 70 }]}>
        {/*Tips*/}
        <View
          style={styles.topView}>
          <Text style={styles.topText}> {'0'} </Text>
          <Text style={styles.subText}> {'Tips'}</Text>
        </View>
        {/*Photo*/}
        <View
          style={styles.topView}>
          <Text style={styles.topText}> {'0'} </Text>
          <Text style={styles.subText}> {'Photo'}</Text>
        </View>
        {/*Place*/}
        <View
          style={styles.topView}>
          <Text style={styles.topText}> {'0'} </Text>
          <Text style={styles.subText}> {'Place'}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  topView: {
    flexDirection: 'column',
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    width: screenWidth / 3
  },
  topText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  subText: {
    fontSize: 14,
    fontWeight: '500'
  },
});
