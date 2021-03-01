import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Image,
  ActivityIndicator, TouchableOpacity, Alert, Platform, FlatList,
  ScrollView, TextInput, KeyboardAvoidingView,
  RefreshControl
} from 'react-native';
import { ReachabilityView, i18next, Loading } from '../utils'
import { backScreen, showModalUserProfile } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import CommonStyles from '../constants/styles'
import HeaderView from './views/HeaderView'
import _ from 'lodash'
import Helper from '../utils/Helper';

export default class LocationListComponent extends Component {

  static options(passProps) {
    return {
      statusBar: {
        backgroundColor: 'transparent',
        visible: true,
        style: 'light'
      },
    };
  }

  constructor(props) {
    super(props);

    const locations = this.props.data.locations || []
    this.state = {
      locations
    }
  }

  componentDidMount() {

  }

  render() {
    const { locations } = this.state

    return (
      <View style={styles.container}>
        <HeaderView
          title={i18next.t('Locations')}
          tintColor={Colors.white}
          style={{ backgroundColor: Colors.green_1 }}
          back={true}
          onPressLeftBarButton={this.onPressBack}
        />
        <FlatList
          data={locations}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 10}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={this.renderEmpty}
        />
      </View>
    )
  }

  onPressBack = () => {
    backScreen(this.props.componentId)
  }

  renderEmpty = () => {

    return (<View style={styles.emptyView}>
      <Text style={{ fontSize: 14, color: Colors.black_1, textAlign: 'center' }}>
        {i18next.t('ThereIsNoData')}
      </Text>
    </View>)
  }


  renderItem = ({ item, index }) => {
    return (
      <View style={[{ margin: 8, flexDirection: 'row' }]} >
        <Image
          source={Images.tour_location}
          resizeMode='center'
          style={{ height: 20, width: 20, alignSelf: 'flex-start' }}
        />
        <Text
          style={{
            flex: 1,
            color: Colors.black_1,
            marginLeft: 5,
            marginBottom: 5,
            fontSize: 14,
            // fontWeight: 'bold',
            lineHeight: 20
          }
          }>{item}</Text>
        <View
          style={{
            position: 'absolute',
            left: 5,
            right: 5,
            bottom: 0,
            height: 1,
            backgroundColor: Colors.light_gray
          }}></View>
      </View>
    )
  }

  keyExtractor = (item, index) => index.toString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  }
});