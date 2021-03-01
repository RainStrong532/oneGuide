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
    Platform,
    KeyboardAvoidingView,
    RefreshControl
} from 'react-native';
import {
    backScreen, gotoSelectOptionsScreen,
    pushToUserProfile
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
import HeaderView from '../component/views/HeaderView'
import _ from 'lodash'
export default class TrackingHistoryGuideComponent extends Component {

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
    } constructor(props) {
        super(props);
        this.state = {

            showSearch: false,
            refreshing: false,
            data: [],
            isLoadMore: true,
            showImg: false,
            place: '',
            language: '',
            experiences: '',
            keysearch: '',
            startDate: "",
            endDate: '',
            key_tour: ''
            // page: 1
        }
        this.page = 1
        // bind
        this.onChangeTextDelayed = _.debounce(this.onChangeText, 1000);

    }

    componentDidMount = () => {
        let data = {
            page: 1,
            language: this.state.language,
            experience: this.state.experiences,
            key_name: this.state.keysearch,
            key_tour: this.state.key_tour,
        }
        this.setState({ isLoadMore: true })
        this.doGetListTracking(null, data)
    }
    doGetListTracking = (data_, page) => {

        this.props.getTrackingHistory(data_, page)
            .then(data => {
                this.page = page.page + 1
                Loading.hideHud()
                this.setState({
                    // data: data,
                    refreshing: false,
                    isLoadMore: false
                })
            })
            .catch(error => {
                Loading.hideHud()
                this.setState({
                    refreshing: false,
                    isLoadMore: false
                })
            });
    }
    componentWillUnmount = () => {

    }
    backScreen = () => {
        backScreen(this.props.componentId)
    }
    setShow = () => {
        this.setState({
            showSearch: !this.state.showSearch
        })
    }
    onChangeText = (text) => {
        this.setState({
            keysearch: text,
            // refreshing: true
        })
        let dataSearch = {
            language: this.state.language,
            experience: this.state.experiences,
            key_name: this.state.keysearch,
            key_tour: this.state.key_tour,
            page: 1
        }
        Loading.showHud()
        this.doGetListTracking(null, dataSearch)
        // .then(() => {
        //     Loading.hideHud()
        // })

    }

    searchAdvanced = () => {
        let dataSearch = {
            language: this.state.language,
            experience: this.state.experiences,
            key_name: this.state.keysearch,
            key_tour: this.state.key_tour,
            page: 1
        }
        this.setState({
            // refreshing: true
        })
        Loading.showHud()
        this.doGetListTracking(null, dataSearch)
        // .then(() => {
        //     Loading.hideHud()
        // })
    }
    changeLanguage = () => {
        DismissKeyboard()
        const callback = (data) => {
            const languages = data.map(item => {
                return item.name
            })

            const language = languages.join(', ')
            this.setState({ language })
        }

        const lang_id = []
        setTimeout(() => {
            gotoSelectOptionsScreen(this.props.componentId, 'LANGUAGE', callback, true, lang_id)
        }, 0);
    }
    onPressExperience = () => {
        DismissKeyboard()
        const callback = (data) => {
            const experience = data.map(item => {
                return item.value
            })
            const experiences = experience.join(', ')
            this.setState({ experiences })
        }
        const lang_id = []
        setTimeout(() => {
            gotoSelectOptionsScreen(this.props.componentId, 'EXPERIENCE', callback, true, lang_id)
        }, 0);

    }
    nextScreenUser = () => {

    }

    renderItem = ({ item, index }) => {
        return (
            <PeoPleAndAgentInTour
                componentId={this.props.componentId}
                nextScreenUser={this.nextScreenUser}
                dataPeople={item}
                index={index}
            />
        )
    }
    pullRefresh = () => {
        const { refreshing, isLoadMore } = this.state;
        if (refreshing) {
            return
        }
        this.page = 1;
        let data = {
            page: 1,
            language: this.state.language,
            experience: this.state.experiences,
            key_name: this.state.keysearch,
            key_tour: this.state.key_tour,
        }
        if (isLoadMore == false) {
            this.setState({ refreshing: true }, () => {
                this.doGetListTracking(null, data)
            })
        }
    }
    renderBottom = () => {
        const { isLoadMore } = this.state
        return (
            <View style={{ height: 40, justifyContent: 'center' }}>
                {isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
            </View>
        )
    }
    loadMore = () => {
        const { refreshing } = this.state
        let data = {
            page: this.page,
            language: this.state.language,
            experience: this.state.experiences,
            key_name: this.state.keysearch,
            key_tour: this.state.key_tour,
        }
        if (this.state.isLoadMore === true) {
            return
        }
        if (refreshing == false) {
            this.setState({ isLoadMore: true }, () => {
                this.doGetListTracking(null, data)
            })
        }
    }
    _keyExtractor = (item, idx) => idx.toString()
    render() {
        const { is_agent } = this.props.passProps || ''
        const { listTracking } = this.props || []
        const { refreshing, isLoadMore } = this.state
        let nameSearch = ''
        if (is_agent == '1') nameSearch = i18next.t('FindBusinessName')
        else nameSearch = i18next.t('FindGuideName')
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: '#F1F7F5'

            }} >
                <HeaderView
                    title={i18next.t('History')}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                    back={true}
                    onPressLeftBarButton={this.backScreen}
                >
                </HeaderView>
                <View style={{ backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#CDD0D0' }}>
                    <View style={styles.centeredView}>
                        <View>
                            <TextInput
                                onChangeText={this.onChangeTextDelayed}
                                autoCapitalize="none"
                                placeholder={i18next.t(nameSearch)}
                            >
                            </TextInput>
                        </View>

                        <View>
                            <TouchableOpacity
                                onPress={this.setShow}
                                style={{
                                    flexDirection: 'row',
                                    // borderWidth: 0.5,
                                    // borderRadius: 18,
                                    justifyContent: 'center',
                                    alignItems: "center",
                                    padding: 8,
                                    // marginRight: 5

                                }} >
                                {/* <Text style={styles.openButton}>{i18next.t('Chi tiết')}</Text> */}
                                {this.state.showSearch ?
                                    <Image style={{
                                        marginLeft: 5,
                                        width: 30,
                                        height: 30
                                    }}
                                        resizeMode='contain'
                                        source={Images.icon_up_button_blue_end}>
                                    </Image>
                                    :
                                    <Image style={{
                                        marginLeft: 5,
                                        width: 30,
                                        height: 30
                                    }}
                                        resizeMode='contain'
                                        source={Images.icon_down_button_blue_end}>
                                    </Image>
                                }
                            </TouchableOpacity>
                        </View>

                    </View>

                    {this.state.showSearch ?
                        <View >
                            <View>
                                <View style={styles.borderBottom}>
                                    <View style={styles.container_item}>
                                        <Image resizeMode='contain' style={styles.alignLeft}
                                            source={Images.tour_name}
                                        ></Image>
                                        <TextInput
                                            value={this.state.key_tour}
                                            onChangeText={(text) => this.setState({
                                                key_tour: text
                                            })}
                                            placeholder={i18next.t('TourName')} style={styles.alignLeftText}>
                                        </TextInput>
                                    </View>
                                </View>


                                <TouchableOpacity onPress={this.changeLanguage} style={styles.borderBottom}>
                                    <View style={styles.container_item}>
                                        <Image resizeMode='contain' style={styles.alignLeft}
                                            source={Images.tour_language}
                                        ></Image>
                                        <TextInput value={this.state.language}
                                            editable={false}
                                            placeholder={i18next.t('Language')} style={styles.alignLeftText}>
                                        </TextInput>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity onPress={this.onPressExperience} style={styles.borderBottom}>
                                    <View style={styles.container_item}>
                                        <Image resizeMode='contain' style={styles.alignLeft}
                                            source={Images.tour_experience}
                                        ></Image>
                                        <TextInput value={this.state.experiences}
                                            editable={false}
                                            placeholder={i18next.t('Experience')} style={styles.alignLeftText}>
                                        </TextInput>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                alignItems: 'flex-end',
                                marginHorizontal: 16,
                                marginTop: 15,
                                marginBottom: 10,
                                paddingBottom: 5
                            }} >
                                <TouchableOpacity
                                    onPress={this.searchAdvanced}
                                    style={{
                                        flexDirection: 'row',
                                        backgroundColor: '#00ACC1',
                                        borderRadius: 20,
                                        flexDirection: 'row',
                                        padding: 10,
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                    <Image style={{ width: 15, height: 15, marginRight: 5 }}
                                        source={Images.search}>

                                    </Image>
                                    <Text style={{ color: '#fff', marginLeft: 5 }}>{i18next.t('Search')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        :
                        null
                    }
                </View>
                {/* { refreshing == false && listTracking.length == 0 ?
                    <View style={{ flex: 1, padding: 100 }}><Text style={{ textAlign: 'center' }}>no data</Text></View>
                    : */}
                <FlatList
                    keyExtractor={this._keyExtractor}
                    onEndReached={this.doGetListTracking}
                    ListFooterComponent={this.renderBottom}
                    onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 10}
                    onEndReached={this.loadMore}
                    removeClippedSubviews={false}
                    data={listTracking}
                    renderItem={this.renderItem}
                    ListEmptyComponent={
                        <View style={{ flex: 1 }}>
                            {
                                isLoadMore
                                    ?
                                    <View>

                                    </View>
                                    :
                                    <View style={{ flex: 1, marginTop: 50 }}>
                                        <Image
                                            source={Images.search_not_value}
                                            style={{ alignSelf: 'center', width: 100, height: 100, tintColor: '#ADBFD1' }}
                                        ></Image>
                                        <Text style={{
                                            textAlign: 'center',
                                            marginTop: 10,
                                            fontSize: 16,
                                            color: '#ADBFD1'
                                        }}>{i18next.t('NoActivityYet')}
                                            {/* {i18next.t('No_result')} */}
                                        </Text>
                                    </View>
                            }
                        </View>
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={this.pullRefresh}
                        />
                    }
                />
                {/* } */}
            </View>
        );
    }
}
class PeoPleAndAgentInTour extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: [],
            showPeopleGuide: false,

        }
    }
    state = {
        addRequest: true,
        checkboxList: false
    }
    nextSeeGuide = () => {
        this.setState({
            showPeopleGuide: !this.state.showPeopleGuide
        })
    }
    nextScreenUserProfile = () => {
        const { user_id } = this.props.dataPeople || ""
        let dataUser = {
            user_id: user_id
        }

        pushToUserProfile(this.props.componentId, dataUser)
        // this.props.nextScreenUser({})
    }
    render() {
        const { status } = this.props.dataPeople || {}
        const { review_stars } = this.props.dataPeople || []
        const { avatar, content, date_tour, display_name, experience, language, location, title, is_agent, user_id } = this.props.dataPeople || ""
        let statusContent = ''
        if (status && status.message) statusContent = status.message
        let dataStarPeople = []

        dataStarPeople = review_stars.map((star, index) => {
            return (
                <StarEvaluate
                    dataface={star}
                    key={index}
                />
            )
        })
        const { index } = this.props || '0'
        return (
            <View style={{
                flex: 1,
                paddingHorizontal: 10,
                paddingVertical: 5,
                marginTop: 10,
                backgroundColor: '#ffffff',
            }}>
                { is_agent == "2" ?
                    <TouchableOpacity onPress={this.nextScreenUserProfile} style={{ flex: 1, flexDirection: 'row', marginTop: 8 }}>

                        <View>
                            <View style={{ position: 'relative', width: 40, height: 40, borderRadius: 20 }}>
                                <Image
                                    style={{ width: 40, height: 40, borderRadius: 20 }}
                                    source={{
                                        uri: avatar
                                    }}>

                                </Image>
                                {is_agent == "1" ?
                                    <Image
                                        style={{ width: 18, height: 18, borderRadius: 9, position: 'absolute', bottom: -3, right: -3 }}
                                        source={Images.logo_flag_header}>
                                    </Image> : null
                                }
                            </View>
                        </View>
                        <View style={{ marginLeft: 8 }}>
                            <Text numberOfLines={1}
                                style={{ fontWeight: 'bold', color: 'black' }}
                            >
                                {display_name}
                            </Text>
                            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                {dataStarPeople}
                            </View>
                        </View>
                    </TouchableOpacity>
                    : null
                }
                <View style={{ flex: 1, marginTop: 5 }}>
                    <View style={styles.wrapContent}>
                        <Image
                            source={Images.tour_name}
                            resizeMode='contain'
                            style={styles.imageCaseStatus}
                        />
                        <View style={styles.viewTextContent}>
                            <Text
                                style={styles.textContentdetailtitle}
                            >
                                {title}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.wrapContent}>
                        <Image
                            source={Images.tour_location}
                            resizeMode='contain'
                            style={styles.imageCaseStatus}
                        />
                        <View style={styles.viewTextContent}>
                            <Text
                                style={styles.textContentdetail}
                            >
                                {location}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.wrapContent}>
                        <Image
                            source={Images.tour_calendar}
                            resizeMode='contain'
                            style={styles.imageCaseStatus}
                        />
                        <View style={styles.viewTextContent}>
                            <Text
                                style={styles.textContentdetail}
                            >
                                {date_tour}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.wrapContent}>
                        <Image
                            source={Images.tour_language}
                            resizeMode='contain'
                            style={styles.imageCaseStatus}
                        />
                        <View style={styles.viewTextContent}>
                            <Text
                                style={styles.textContentdetail}
                            >
                                {language}
                            </Text>
                        </View>
                    </View>
                    {/* <View style={styles.wrapContent}>
                        <Text style={{ color: "#1772C8", fontSize: 14 }}>
                            {content}
                        </Text>
                    </View> */}
                    <View style={styles.wrapContent}>
                        <Text style={{ color: "red", fontSize: 14 }}>
                            {statusContent}
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 1, height: 0.5, backgroundColor: "#CDE0E0", marginBottom: 5, marginTop: 8 }}></View>
                {
                    is_agent == "1" ?

                        <TouchableOpacity onPress={this.nextScreenUserProfile} style={{ flex: 1, flexDirection: 'row', marginVertical: 8 }}>
                            <View>
                                <View style={{ position: 'relative', width: 40, height: 40, borderRadius: 20 }}>
                                    <Image
                                        style={{ width: 40, height: 40, borderRadius: 20 }}
                                        source={{
                                            uri: avatar
                                        }}>

                                    </Image>
                                    {is_agent == "1" ?
                                        <Image
                                            style={{ width: 18, height: 18, borderRadius: 9, position: 'absolute', bottom: -3, right: -3 }}
                                            source={Images.logo_flag_header}>
                                        </Image> : null
                                    }
                                </View>
                            </View>
                            <View style={{ marginLeft: 8 }}>
                                <Text numberOfLines={1}
                                    style={{ fontWeight: 'bold', color: 'black' }}
                                >
                                    {display_name}
                                </Text>
                                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                    {dataStarPeople}
                                </View>
                            </View>
                        </TouchableOpacity>
                        : null
                }
            </View>
        )
    }

}
class StarEvaluate extends React.Component {
    render() {
        const { dataface } = this.props || ""
        return (
            <Image
                source={Images.ic_star_yellow}
                resizeMode='contain'
                style={dataface == 1 ? styles.imageStar : styles.imageStarHidden}
            />
        )
    }
}
const styles = StyleSheet.create({

    container: {
        flex: 1
    },
    textContentdetail: {
        fontSize: 14,
        color: 'black'
    },
    textContentdetailtitle: {
        fontSize: 16,
        fontWeight: "500",
        color: 'black'
    },
    emptyView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100
    },
    wrapContent: {
        flexDirection: 'row',
        marginTop: 5,
        // alignItems: 'center'
    },
    viewTextContent: {
        paddingRight: 10,
        paddingLeft: 5,
        justifyContent: 'center'
    },
    imageCaseStatus: {
        width: 15,
        height: 15,
        marginTop: 2
    },
    imageStar: {
        width: 16,
        height: 16,
        marginRight: 2
    },

    imageStarHidden: {
        width: 16,
        height: 16,
        marginRight: 2,
        tintColor: 'gray'
    },
    container_item: {
        flexDirection: 'row',
        alignItems: 'center',
        //alignSelf: 'center'
        height: 50
    },
    openButton: {
        fontSize: 14,
        color: '#666666',
        fontWeight: '400',
    },

    alignLeft: {
        width: 16,
        height: 16,
        // alignItems: 'center'
        justifyContent: 'center',
        alignSelf: 'center',
        marginLeft: 3
    },
    alignLeftText: {
        // marginTop: -12,
        marginLeft: 13,
        fontSize: 13,
        color: '#1C1C1C'
    },
    alignLeftText2: {
        marginTop: 0,
        marginLeft: 10,
        fontSize: 14,
        color: '#1C1C1C',

    },
    borderBottom: {

        // paddingTop: 10,
        borderBottomWidth: 0.7,
        borderBottomColor: '#C0C0C0',
        marginLeft: 10,
        marginRight: 10,
    },
    centeredView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        borderBottomWidth: 0.7,
        borderBottomColor: '#C0C0C0',
        borderTopColor: '#fff',
        alignItems: 'center'
    },

})
