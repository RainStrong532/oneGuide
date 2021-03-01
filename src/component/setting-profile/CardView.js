
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
}
    from 'react-native';
import { ReachabilityView, i18next } from '../../utils'
import { gotoSetupLanguageScreen, gotoCameraRollScreen } from '../../navigation';
import Images from '../../assets/images'
import Colors from '../../constants/colors'
import Fonts from '../../constants/fonts'
import CommonStyles from '../../constants/styles'
import HeaderView from '../../component/views/HeaderView'
import _ from 'lodash'

export default class CardView extends Component {

  static propTypes = {
    status: PropTypes.string,
  }
    
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const nextData = _.get(nextProps, 'uri')
    const data = _.get(this.props, 'uri')
    const shouldUpdate = (
      nextData !== data 
    )
    return shouldUpdate
  }

  componentDidMount() { 
  }

  componentWillUnmount() {
  }

  onBackButtonPressed() {
  }

  onTouchSelectCardAction() {
    if(this.props.onSelectNewCard) {
      this.props.onSelectNewCard()
    }
  }

  render() {
    const uriImage = _.get(this.props, 'uri')
    let imageCard = null;
    if (uriImage === '') {
      imageCard = (
        <Image
          source={Images.id_card}
          resizeMode='cover'>
        </Image>
      );
    } else {
      imageCard = (
        <Image
          source={{uri: uriImage}}
          resizeMode='cover'
          style={{flex: 1}}>
        </Image>
      );
    }

    return (
      <View style={{flex: 1,}}>
        <View style={styles.viewCard}>
          <Text style={{fontSize: 18, fontWeight: '500', textAlign: 'center'}}>
            {i18next.t('AddBackPhotoCard')}
          </Text>
          <TouchableOpacity 
            style={{marginTop: 20, height: 139, width: 185}}
            onPress={() => {this.onTouchSelectCardAction()}}>
              {imageCard}
          </TouchableOpacity>  
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewCard: {
    flex: 1, 
    flexDirection: 'column',
    backgroundColor: Colors.white, 
    marginTop: 120,
    alignItems: 'center',
  },
});
