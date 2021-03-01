import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Navigation } from 'react-native-navigation';
import {
    setRootToHomeScreen,
    backScreen,
    dimissModal
} from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import HeaderView from './views/HeaderView'
import CommonStyles from '../constants/styles'
import _ from 'lodash'
import i18next from 'i18next';
import DateHelper from '../utils/DateHelper'
import { lang } from 'moment';

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


export default class SelectLanguageInviteGuider extends Component {

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
        // this.dataFull = this.getDefaultData(props.type)
        this.state = {
            data: [],
            isLoad: false,
            languageSelected: [],
            dataSearch: []
        }
    }

    componentDidMount() {
        // console.log('this.propssssssssssssssssssssss', this.props);
        if (this.props.type == 'LANGUAGE') {
            this.setState({ isLoad: true }, () => {
                this.doGetListLanguage()
            })
        }

        if (this.props.type == 'EXPERIENCE') {
            this.setState({ isLoad: true }, () => {
                this.getDataExp()
            })
        }

        // this.onChangeText('h')
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
                const listLanguage = response.map((language) => {

                    // if (this.props.arrSelect) {
                    //     const index = _.findIndex(this.props.selected, (obj) => { return obj.name == language.name })
                    //     if (index >= 0) {
                    //         return {
                    //             ...language,
                    //             selected: true
                    //         }
                    //     }
                    // }

                    return {
                        ...language,
                        id: language.lang_id,
                        selected: false
                    }
                })
                this.setState({
                    data: listLanguage,
                    isLoad: false
                })
                this.onChangeText('')
            })
            .catch(error => {

            })
    }

    getDataExp = () => {

        let data = dataDefaultExperiences

        this.setState({
            data
        })

        // if (type === 'EXPERIENCE') {
        //     data = dataDefaultExperiences
        // }

        // return _.cloneDeep(data)
    }


    onPressBack = () => {
        dimissModal(this.props.componentId)
    }

    onPressDone = () => {

        const data = this.state.languageSelected
        this.props.callback(data)
        dimissModal(this.props.componentId)
    }

    onPressSelect = ({ index, item }) => {

        const type = _.get(this.props, 'type')
        let keysearch = this.state.keyword
        let data = this.state.dataSearch
        item.selected = !item.selected
        const indexItem = _.findIndex(data, (o) => o.id == item.id)
        const indexLang = _.findIndex(this.state.data, (o) => o.id == item.id)
        // console.log('itemmmmmmmmmmmmmmmmmmmmmmmmmmmmmm', keysearch);
        // console.log('indexxxxxxxxxxxxx', indexItem);
        // let removeSelected = data.map((item) => {
        //     return {
        //         ...item,
        //         selected: false
        //     }
        // })
        if (type == 'LANGUAGE') {

            if (indexItem != -1) {
                data.splice(indexItem, 1, item)
                this.state.data.splice(indexLang, 1, item)
            }
            // console.log('removeeeeeeeeeeeeeeeeeeeeeeeeeeeee', data);

            const result = this.search(data, keysearch)
            // }
            // if (keysearch) {
            //     this.setState({
            //         dataSearch: data,
            //         languageSelected: item
            //     })
            // }

            // this.dataFull = data
            // const result = this.search(this.dataFull, this.state.keyword)
            // let currentData = this.state.data
            let languageSelected = []
            for (let i = 0; i < this.state.data.length; i++) {
                const element = this.state.data[i];
                if (element.selected == true) {
                    languageSelected.push(element)
                }

            }
            this.setState({
                dataSearch: result,
                // data: data,
                languageSelected: languageSelected
            })
        }
        if (type == 'EXPERIENCE') {

            let { data } = this.state
            item.selected = true

            let removeSelected = data.map((item) => {
                return {
                    ...item,
                    selected: false
                }
            })

            const indexExp = _.findIndex(removeSelected, (o) => o.id == item.id)

            if (indexExp != -1) {
                removeSelected.splice(indexExp, 1, item)
            }
            // console.log('DDDDDDDDDDDDDDDDDDDDDDDDĐMMMMMMMMMMMMMMMMMMMMMMMMMMM', item.selected);
            // console.log(data, `data và và và ::::::::::: ${indexExp} và và và index`, item);

            this.setState({
                data: removeSelected,
                // expSelected: item
                // data: data,
                languageSelected: item
            })

        }
    }

    onChangeText = (keyword) => {
        // console.log('lllllllllllllllllllllllllllllllll', keyword);
        const data = this.state.data

        const result = this.search(data, keyword)
        this.setState(
            {
                keyword,
                dataSearch: result
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
        const { data, keyword, dataSearch } = this.state
        const offset = (Platform.OS === 'android') ? 0 : 0;
        const type = _.get(this.props, 'type')

        let listData
        if (type == 'LANGUAGE') {
            listData = dataSearch
        } else {
            listData = data
        }
        let title = i18next.t('Language')
        // if (this.props.type === 'EXPERIENCE') {
        //     title = i18next.t('Experience')
        // }

        // console.log('ppppppppppppppppppppppppppppppppppppp', this.state);

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
                        (this.props.type == 'LANGUAGE') &&
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
                        data={listData}
                        extraData={this.state}
                        keyExtractor={this.keyExtractor}
                        renderItem={this.renderItem}
                    // ListFooterComponent={this.renderBottom}
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
        // console.log('data onPressSelect', data);

        this.props.onPressSelect(_.cloneDeep(data))
    }

    render() {
        const { type, data } = this.props
        const { item } = data
        const value = item.name || item.value
        const imageSelect = item.selected === true ? Images.ic_select : null

        // console.log('item expppppppppppppp', value);
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
