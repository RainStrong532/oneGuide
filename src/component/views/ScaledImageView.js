import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import FastImage from 'react-native-fast-image'
import _ from 'lodash';

export default class ScaledImageView extends Component {


  static propTypes = {
    uri: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number
  }

  constructor(props) {
    super(props);
    this.state = { source: { uri: this.props.uri } };
  }

  componentDidMount() {
    Image.getSize(this.props.uri, (width, height) => {
      if (this.props.width && !this.props.height) {
        this.setState({
          width: this.props.width,
          height: height * (this.props.width / width)
        });
      } else if (!this.props.width && this.props.height) {
        this.setState({
          width: width * (this.props.height / height),
          height: this.props.height
        });
      } else {
        this.setState({ width: width, height: height });
      }
    });
  }

  render() {
    return (
      <FastImage
        source={this.state.source}
        style={[this.props.style,{ height: this.state.height, width: this.state.width }]}
      />
    );
  }
}
