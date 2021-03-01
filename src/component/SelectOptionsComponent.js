import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { setRootToHomeScreen, backScreen } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import HeaderView from './views/HeaderView'
import CommonStyles from '../constants/styles'
import _ from 'lodash'
import i18next from 'i18next';
import DateHelper from '../utils/DateHelper'

const dataDefaultExperiences = [
  { id: 1, value: '1 year', selected: false },
  { id: 2, value: '2 year', selected: false },
  { id: 3, value: '3 year', selected: false },
  { id: 4, value: '4 year', selected: false },
  { id: 5, value: '5 year', selected: false },
  { id: 6, value: '6 year', selected: false },
  { id: 7, value: '7 year', selected: false },
  { id: 8, value: '8 year', selected: false },
  { id: 9, value: '9 year', selected: false },
  { id: 10, value: '>= 10 year', selected: false },
];


export default class SelectOptionsComponent extends Component {

  static options(passProps) {
    return {
      statusBar: {
        backgroundColor: 'transparent',
        visible: true,
        style: 'dark'
      },
    };
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.onChangeText = this.onChangeText.bind(this)
    // this.renderBottom = this.renderBottom.bind(this)
    // this.pullRefresh = this.pullRefresh.bind(this)
    // this.onPressDismissSearch = this.onPressDismissSearch.bind(this)

    this.mutilChoise = props.mutilChoise || false
    this.dataFull = this.getDefaultData(props.type)
    this.state = {
      data: this.dataFull,
      isLoad: false
    }
  }

  componentDidMount() {
    if (this.props.type !== 'EXPERIENCE') {
      this.setState({ isLoad: true }, () => {
        this.doGetListLanguage()
      })
    }
  }

  componentDidAppear() {

    if (!this.didAppearFirst) {
      this.didAppearFirst = true
    }
  }

  componentDidDisappear() {

  }

  doGetListLanguage = () => {
    this.props.getListLanguage()
      .then(response => {


        const dataCheck = response.map((item) => {

          if (this.props.options.arrSelect) {
            const index = _.findIndex(this.props.options.arrSelect, (obj) => { return parseInt(obj) == parseInt(item.lang_id) })
            if (index >= 0) {
              return {
                ...item,
                selected: true
              }
            }
          }

          return {
            ...item,
            selected: false
          }
        })
        this.dataFull = dataCheck
        this.setState({
          data: this.dataFull,
          isLoad: false
        })
      })
      .catch(error => {

      })
  }

  getDefaultData = (type) => {

    let data = []

    if (type === 'EXPERIENCE') {
      data = dataDefaultExperiences
    }

    return _.cloneDeep(data)
  }


  onPressBack = () => {
    backScreen(this.props.componentId)
  }

  onPressDone = () => {

    const data = this.dataFull.filter(value => {
      return value.selected === true
    })
    this.props.callback(_.cloneDeep(data))
    backScreen(this.props.componentId)
  }

  onPressSelect = ({ index, item }) => {

    let data = this.dataFull

    if (this.props.type === 'EXPERIENCE') {
      item.selected = !item.selected
      data = this.getDefaultData(this.props.type)
      data.splice(index, 1, item)
    } else {

      if (this.mutilChoise !== true) {
        const defaultLanguage = data.map((item) => {
          return {
            ...item,
            selected: false
          }
        })
        data = defaultLanguage
      }

      item.selected = !item.selected
      const indexItem = _.findIndex(data, { lang_id: item.lang_id })
      if (indexItem >= 0) {
        data.splice(indexItem, 1, item)
      }
    }

    this.dataFull = data
    const result = this.search(this.dataFull, this.state.keyword)
    this.setState({
      data: result
    })
  }

  onChangeText = (keyword) => {
    const result = this.search(this.dataFull, keyword)
    this.setState(
      {
        keyword,
        data: result
      })
  }

  search = (data, keyword) => {
    if (!keyword) {
      return data
    }

    const result = data.filter(item => {
      return item.name.toString().toLowerCase().includes(keyword.toLowerCase())
    })
    return result
  }

  render() {
    const { data, keyword } = this.state
    const offset = (Platform.OS === 'android') ? 0 : 0;
    let title = i18next.t('Language')
    if (this.props.type === 'EXPERIENCE') {
      title = i18next.t('Experience')
    }

    // console.log('ppppppppppppppppppppppppppppppppppppp', this.props);

    return (
      <View style={[styles.container]}>
        <HeaderView
          title={title}
          tintColor={Colors.green_1}
          back={true}
          titleRight={i18next.t('Done')}
          onPressLeftBarButton={this.onPressBack}
          onPressRightBarButton={this.onPressDone} />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={"padding"}
          keyboardVerticalOffset={offset} >
          {/* <View style={{ flex: 1 }}> */}
          {
            (this.props.type !== 'EXPERIENCE') &&
            <TextInput
              style={{
                height: 40,
                borderColor: Colors.gray,
                borderWidth: 0.5,
                borderRadius: 6,
                marginVertical: 6,
                marginHorizontal: 10,
                paddingLeft: 4
              }}
              placeholder={i18next.t('Searching')}
              value={keyword}
              onChangeText={this.onChangeText}
            ></TextInput>
          }


          <FlatList
            // ref={innerRef}
            keyboardShouldPersistTaps='handled'
            style={{ flex: 1 }}
            data={data}
            extraData={this.state}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            ListFooterComponent={this.renderBottom}
          />
          {/* </View> */}
        </KeyboardAvoidingView>
      </View>
    );
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ index, item }) => {
    const { type } = this.props
    const data = { index, item }
    return (
      <SelectOptionsView
        type={type}
        data={data}
        onPressSelect={this.onPressSelect}
      />

    )
  }

  renderBottom = () => {
    const { isLoad } = this.state;
    return (<View style={{ height: 40, justifyContent: 'center' }}>
      {isLoad ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
    </View>)
  }

}


class SelectOptionsView extends Component {

  constructor(props) {
    super(props);

  }


  shouldComponentUpdate(nextProps, nextState) {

    const nextData = _.get(nextProps, 'data.item')
    const data = _.get(this.props, 'data.item')

    const shouldUpdate = (
      !_.isEqual(nextData, data)
    )
    return shouldUpdate
  }

  onPressSelect = () => {
    const { data } = this.props

    this.props.onPressSelect(_.cloneDeep(data))
  }

  render() {
    const { type, data } = this.props
    const { item } = data
    const value = type === 'EXPERIENCE' ? item.value : item.name
    const imageSelect = item.selected === true ? Images.ic_select : null

    return (
      <View style={[{ flex: 1, height: 50, backgroundColor: Colors.white, flexDirection: 'row' }]} >
        <Text style={{
          flex: 1,
          marginTop: 4,
          marginLeft: 16,
          fontSize: 18,
          color: Colors.black,
          alignSelf: 'center'

        }} >{value}</Text>

        <TouchableOpacity
          style={[CommonStyles.border_green_1_1, CommonStyles.center, { backgroundColor: Colors.white, alignSelf: 'center', borderRadius: 14, height: 28, width: 28, marginRight: 16 }]}
          onPress={this.onPressSelect} >

          <Image style={{ height: 28, width: 28, alignSelf: 'center', }}
            source={imageSelect}
            resizeMode='stretch' />
        </TouchableOpacity>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  activityIndicator: {
    marginTop: 100
  },
})
