
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import Device from '../../modules/Device'
import CommonStyles from '../../constants/styles'

export default class ImageButtonView extends Component {

  static propTypes = {
    buttonTitle: PropTypes.string,
  }

  constructor(props) {
    super(props);
  }
  render() {
    const { image, title, underline, bold } = this.props
    // const image="Images.CheckIn_icon_text"
    // const title="heeeyyyy"
    // const underline="ddd"
    return (
      <View style={styles.container}>
        <Image source={image} resizeMode='contain' style={styles.icon}></Image>
        {
          // underline
          //   ? <TouchableOpacity {...this.props}>
          //     <Text style={styles.locationTxt}>{title}</Text>
          //   </TouchableOpacity>
          //   : 
          <Text selectable style={bold ? styles.titleBold : styles.descTxt}>{title}</Text>
        }

      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5,
  },
  icon: {
    height: 14,
    width: 14,
    alignSelf: 'center'
  },
  descTxt: {
    flex: 1,
    color: Colors.black_1,
    marginLeft: 5,
    fontSize: 14,
    // fontWeight: 'bold', 
    lineHeight: 20
  },
  locationTxt: {
    // flex: 1,
    color: Colors.black_1,
    marginLeft: 5,
    fontSize: 14,
    // fontWeight: 'bold', 
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
  titleBold: {
    fontWeight: '700', marginLeft: 5,
    lineHeight: 20,
    color: Colors.black_1,
    fontSize: 16,
  }
});
