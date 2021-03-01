import React, { Component } from 'react';
import {
  StyleSheet,
  View, Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,

} from 'react-native';
import { Navigation } from 'react-native-navigation';
import {
  dimissModal,
  gotoSelectOptionsScreen,
  gotoCheckInScreen,
  pushTourTimeScreen,
  showDate,
  backScreen,
} from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import POST_TYPE from '../constants/post-types'
import Device from '../modules/Device'
import { i18next, Loading } from '../utils'
import DismissKeyboard from 'dismissKeyboard';
import CommonStyles from '../constants/styles'
import StringUtils from '../utils/StringUtils'
import Helper from '../utils/Helper';

import _ from 'lodash'
import HeaderView from './views/HeaderView';
import ReviewComponent from './ReviewComponent';

export default class TourReviewComponent extends Component {

  static options(passProps) {
    return {
      statusBar: {
        backgroundColor: 'transparent',
        visible: true,
        style: 'dark'
      },
      topBar: {
        drawBehind: true,
        visible: false,
      },
    };
  }

  constructor(props) {
    super(props);
  }
  componentDidMount() {
  }
  saveDataReview = () => {
    this.setState({

    })
  }
  _keyExtractor = (item, idx) => idx.toString()
  render() {
    return (

      <View style={styles.container}>
        <ReviewComponent
          {...this.props}
          item={this.props.data.item}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#F1F7F5',
    // marginBottom: 10
  },
})
