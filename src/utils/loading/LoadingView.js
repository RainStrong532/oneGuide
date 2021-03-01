import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

export default class LoadingView extends Component {
  static propTypes = {
    show: PropTypes.bool
  }   

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.show === false) {
      return null
    }
    return (
      <View style={styles.container} >
        <View style={styles.overlayBg} opacity={0.5} />
        <View style={styles.viewIndicator}>
          <ActivityIndicator style={styles.activityIndicator} size="large" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  overlayBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'gray',
  },
  viewIndicator: {
    alignSelf: 'center',
    backgroundColor: 'white',
    height: 100,
    width: 100,
    justifyContent: 'center',
    borderRadius: 8
  },
  activityIndicator: {
    // marginTop: 100
  },

});
