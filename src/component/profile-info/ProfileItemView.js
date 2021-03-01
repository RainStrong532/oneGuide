












import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Dimensions, Platform } from 'react-native';
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import Device from '../../modules/Device'
import CommonStyles from '../../constants/styles'
import { i18next } from '../../utils'
import DateHelper from '../../utils/DateHelper'
import _ from 'lodash'

export default class ProfileItemView extends Component {
  static propTypes = {
    title: PropTypes.string,
    image: PropTypes.number,
    nextPress: PropTypes.bool,
    onPress: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      screenWidth: Dimensions.get('window').width,
      screenHeight: Dimensions.get('window').height / 7,
      screenWidthShare: Dimensions.get('window').width / 2.2,
    }
  }

  static defaultProps = {
    nextPress: true
  };

  render() {
    const title = _.get(this.props, 'title')
    const image = _.get(this.props, 'image')
    return (
      <View style={[
        // ,
        //  styles.container
        title == i18next.t('Logout') ? styles.viewAllLogout : Platform.OS === 'ios' ? styles.viewAllLogout : styles.viewAll
        , {
          width: this.state.screenWidthShare,
        }
        , this.props.style
      ]}>
        <TouchableOpacity
          style={
            title == i18next.t('Logout') ? styles.logoutCssHtm : styles.logoutCss
            // [styles.container, 

            // ]
          }
          onPress={this.props.onPress}>
          <Image
            style={{ marginLeft: 10, width: 23, height: 23 }}
            source={image}
            resizeMode='contain'>
          </Image>
          <View style={
            title == i18next.t('Logout') ? styles.viewTitleLogout : styles.viewTitle
          }>
            <Text style={styles.title}> {title} </Text></View>
          {/* {
            this.props.nextPress && (
              <Image
                style={{ width: 20, height: 20, position: 'absolute', right: 10 }}
                source={Images.ic_next}
                resizeMode='center'>
              </Image>
            )
          } */}
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: 150,
    backgroundColor: Colors.white,
    width: "40%",
    // borderWidth: 1,
    // borderColor: 'red'  
  },
  viewAll: {
    justifyContent: 'center',
    backgroundColor: Colors.white,
    margin: 8,
    // borderColor: "#D0D6CF",
    // borderWidth: 0.2,
    borderRadius: 8,
    shadowColor: "#CDE0E0",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  viewAllLogout: {
    marginVertical: 20,
    justifyContent: 'center',
    // flex: 1,
    // height: 60,
    backgroundColor: Colors.white,

    margin: 8,
    borderColor: "#D0D6CF",
    borderWidth: 0.15,
    borderRadius: 8,

    shadowColor: "#B8BFB8",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  viewTitle: {
    flex: 1,
    marginTop: 6
  },
  viewTitleLogout: {
    flex: 1,
    marginLeft: 8,
    marginRight: 10,
    // paddingVertical: 6,
    justifyContent: 'center',
    // alignItems: 'center'
    // marginTop: 6
  },
  title: {
    marginLeft: 2,
    fontSize: 15,
    fontWeight: '500',
    color: 'black'
  },
  logoutCss: {

    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10

  },
  logoutCssHtm: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 15,


  }
});
