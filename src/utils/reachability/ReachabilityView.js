import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

const loadingText = Platform.select({
  ios: 'No Internet Connection !',
  android: 'No Internet Connection !',
});

class ReachabilityView extends Component {

  render() {
    if (this.props.netInfo &&
      this.props.netInfo.isConnected === true) {
      return null
    }

    return (
      <View style={styles.container} >
        <Text style={styles.instructions}>{loadingText}</Text>
      </ View>
    );
  }
}

const mapStateToProps = state => {
  const { netInfo } = state
  return {
    netInfo: netInfo,
  };
};

const ReachabilityContainer = connect(mapStateToProps, {})(ReachabilityView);
export default ReachabilityContainer;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    right: 10,
    left: 10,
    justifyContent: 'center',
    backgroundColor: 'yellow',
    height: 50
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
