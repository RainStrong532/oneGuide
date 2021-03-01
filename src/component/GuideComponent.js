import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity, TextInput,
    StyleSheet, Image, ScrollView, FlatList, Modal,
    StatusBar,
    RefreshControl,
    ActivityIndicator
} from 'react-native';

import _ from 'lodash'
import {
    gotoChatScreen, setRootToHomeScreen, viewPhoto,
    gotoSelectOptionsScreen, getSearch, pushDetailGuideAgent,
    showModalSharePost, backScreen, showSharePost, pushTourApplyGuider,
    pushToUserProfile, pushToAccountVerify
} from '../navigation';
import PostImageView from './post-views/PostImageView';
import DatePicker from 'react-native-datepicker';

import Images from '../assets/images'
import DismissKeyboard from 'dismissKeyboard';
import Colors from '../constants/colors'


import { ReachabilityView, i18next, Loading } from '../utils'
import HeaderView from './views/HeaderView';
import HeaderVer2 from './HeaderVer2';
import Helper from '../utils/Helper';




class GuideComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSearch: false,
            data: [],
            showImg: false,
            place: '',
            language: '',
            keysearch: '',
            startDate: "",
            endDate: '',
            isLoadMore: true,
            refreshing: false,
            page: 1
        }
        this.onChangeTextDelayed = _.debounce(this.onChangeText, 1000);

    }

    setShow = () => {
        this.setState({
            showSearch: !this.state.showSearch
        })
    }
    likePostdata = (id) => {

        this.props.likePostAgent(id)

    }

    pullRefresh = () => {
        if (this.state.refreshing == true) {
            return
        }
        this.setState({ refreshing: true }, () => {
            const dataInput = {
                type: 'guide',
                page: 1
            }
            this.doGetAgentHomePage(dataInput)
        })
    }
    loadMore = () => {
        if (this.state.isLoadMore == true) {
            return
        }
        this.setState({ isLoadMore: true }, () => {
            const dataInput = {
                type: 'guide',
                page: this.state.page
            }
            this.doGetAgentHomePage(dataInput)
        })
    }
    onPressBack = () => {
        backScreen(this.props.componentId)
    }

    doGetAgentHomePage = (page) => {
        // const dataInput = {
        //     type: 'guide',
        //     page,
        // }

        this.props.getAgentHomePage(page)
            .then(() => {
                this.setState({
                    page: this.state.page + 1,
                    refreshing: false,
                    isLoadMore: false
                })
            })
            .catch(() => {
                this.setState({ refreshing: false, isLoadMore: false })
            })
    }

    componentDidMount = () => {
        const data = {
            page: this.state.page,
            type: 'guide'
        }
        this.doGetAgentHomePage(data)
    }

    onPressComment = (item) => {
        pushDetailGuideAgent(this.props.componentId, { comment: item }, { showKeyboard: true });
    }

    pushToAccountVerify = () => {
        pushToAccountVerify(this.props.componentId);
    }

    handleAgentApply = (item) => {
        const is_verify = _.get(this.props, 'user.me.is_verify');
        if (is_verify.toString() === "0") {
            Helper.showAlert('', i18next.t('NeedToVerify'),
                [
                    { text: i18next.t(i18next.t('Cancelled')), onPress: null },
                    { text: i18next.t(i18next.t('verify')), onPress: this.pushToAccountVerify }
                ])
            return;
        }
        if (is_verify.toString() === "2") {
            Helper.showAlert('', i18next.t('AccountWaitVerify'),
                [
                    { text: i18next.t(i18next.t('OK')), onPress: null },
                ])
            return;
        }
        // console.log("object 123456789", item);
        pushTourApplyGuider(this.props.componentId, { data: item.comment_id, })
    }


    onPressShareButton = (data) => {

        DismissKeyboard()
        const comment = data;
        const callback = (type) => {
            if (type === 'WRITE_POST') {
                showModalSharePost(comment, (type) => {
                    this.onPressBack()
                })
            }
        }

        const user_me = _.get(this.props, 'user.me')
        showSharePost(comment, user_me, callback)
    }
    onChangeText = (text) => {
        this.setState({
            keysearch: text,
            page: 1
        })
        let dataSearch = {
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            language: this.state.language,
            place: this.state.place,
            type: 'guide',
            keysearch: this.state.keysearch
        }
        Loading.showHud()
        this.props.getSearch(dataSearch)
            .then(() => {
                Loading.hideHud()
            })

    }
    searchAdvanced = () => {
        let dataSearch = {
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            language: this.state.language,
            place: this.state.place,
            type: 'tour',
            keysearch: this.state.keysearch
        }


        Loading.showHud()
        this.props.getSearch(dataSearch)
            .then(() => {
                Loading.hideHud()
            })
    }
    handleAvatar = (user_id) => {
        const data = { user_id }
        pushToUserProfile(this.props.componentId, data)
    }

    _keyExtractor = (item, index) => index.toString();
    _renderItem = ({ item, index }) => {
        let likeStatus = item.like_comment
        const { is_agent } = item || ''
        let total_likes = item.total_likes
        let dateitems = item.started_date.split(' ');
        let started_dates = dateitems[0]
        let photos
        if (item.photo) {
            photos = item.photo.photos
        }

        let apply_type = i18next.t('Register')
        if (item.apply) {
            apply_type = item.apply.type
        }

        return (
            <View style={{
                backgroundColor: '#fff',
                //  paddingBottom: 10,
                paddingTop: 18, paddingLeft: 10, paddingRight: 17,
                borderTopColor: '#f0f6f6', borderTopWidth: 8
            }}>
                <View style={styles.centeredView2}>
                    <View style={styles.container}>
                        <TouchableOpacity
                            onPress={() => this.handleAvatar(item.user_id)}
                        >
                            <Image style={{ width: 42, height: 42, borderRadius: 21 }}
                                source={{ uri: item.avatar }}

                            ></Image>
                            {is_agent == "1" ?
                                <Image
                                    source={Images.logo_flag_header}
                                    style={styles.icon_float}
                                /> : null
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.handleAvatar(item.user_id)}
                        >
                            <View style={styles.textProfile} >

                                <Text style={{ fontSize: 16, fontWeight: '500', color: '#1C1C1C' }}>{item.username}</Text>
                                <Text style={{ color: '#666666', fontSize: 13 }}>{item.create_date}</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                    {/* <View style={{ marginRight: 5, marginTop: 10 }}>
                        <TouchableOpacity style={{}} >
                            <Image
                                resizeMode='contain'
                                source={Images.post_more_options}>
                            </Image>
                        </TouchableOpacity>
                    </View> */}
                </View>
                <View style={{ marginTop: 10 }}>
                </View>
                <View style={{ marginTop: 10 }}>
                    <View style={styles.container}>
                        <Image style={{ width: 16, height: 16 }}
                            resizeMode="contain"
                            source={Images.tour_calendar}
                        ></Image>
                        <Text selectable style={styles.alignLeftText2}>{item.date_tour}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 10 }}>
                    <View style={styles.container}>
                        <Image style={{ width: 17, height: 17 }}
                            resizeMode="contain"
                            source={Images.tour_location}
                        ></Image>
                        <Text selectable style={styles.alignLeftText2}>{item.location}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 10 }}>
                    <View style={styles.container}>
                        <Image resizeMode="contain" style={{ width: 16, height: 16 }}
                            source={Images.tour_language}
                        ></Image>
                        <Text selectable style={styles.alignLeftText2}>{item.language}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 10 }}>
                    <View style={styles.container}>
                        <Image resizeMode="contain" style={{ width: 16, height: 16 }}
                            source={Images.tour_experience}
                        ></Image>
                        <Text selectable style={styles.alignLeftText2}>{item.experience}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 5 }}>
                    <Text selectable >
                        {item.content}
                    </Text>
                    <View style={{ marginBottom: 8, marginLeft: -10 }}>
                        <PostImageView
                            onPressImage={this.testImg(item.photo)}
                            photos={photos}
                        />
                    </View>
                    <View style={{ flexDirection: "row", width: '100%', marginHorizontal: 10, justifyContent: 'space-between', }}>
                        {(total_likes >= 1) ?
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity style={styles.container}>
                                    <Image resizeMode="contain" style={{ width: 20, height: 20, marginBottom: 4 }}
                                        source={Images.like_count}
                                    ></Image><Text>{item.total_likes}</Text>
                                </TouchableOpacity>

                            </View>
                            :
                            <View></View>
                        }
                        {
                            (item.total_comments >= 1) ?
                                <View style={{}}>
                                    <Text>

                                        {item.total_comments} {i18next.t('Comments')}
                                    </Text>
                                </View>
                                : <View></View>
                        }
                    </View>
                </View>

                <View style={{
                    borderTopWidth: 0.5, paddingTop: 15, marginTop: 5, marginBottom: 10,
                    borderColor: '#DDDDDD', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5
                }}>
                    {likeStatus == "active"
                        ?
                        <TouchableOpacity style={styles.container}
                            onPress={() => this.likePostdata(item.comment_id)}
                        >
                            <Image source={Images.post_like}>
                            </Image>
                            <Text style={styles.textCmt2}>{i18next.t('Unlike')}</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.container}
                            onPress={() => this.likePostdata(item.comment_id)}
                        >
                            <Image source={Images.post_like}>
                            </Image>
                            <Text style={styles.textCmt}>{i18next.t('Like')}</Text>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity style={styles.container}
                        onPress={() => {
                            this.onPressComment(item);
                        }}
                    >
                        <Image source={Images.post_comment} style={{ marginTop: 2 }}>
                        </Image>
                        <Text style={styles.textCmt}>{i18next.t('Comment')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.container}
                        onPress={() => this.handleAgentApply(item)}
                    >
                        <Image style={{ marginTop: 2 }}
                            source={Images.post_apply}>
                        </Image>
                        <Text style={styles.textCmt}>{apply_type}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.container}
                        onPress={
                            () => {
                                this.onPressShareButton(item)
                            }}
                    >
                        <Image source={Images.post_share}>
                        </Image>
                        <Text style={styles.textCmt}>{i18next.t('Share')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )

    }
    testImg = (photo) => (index) => {
        // console.log("index va photo click", index, photo);
        viewPhoto({ index, photo })
    }
    handleSwipeDown = () => {
        this.setState({
            showImg: false
        })
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

    renderBottom = () => {
        const { isLoadMore } = this.state;
        return (<View style={{ height: 40, justifyContent: 'center' }}>
            {isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
        </View>)
    }
    render() {
        const { item } = this.props
        // console.log("bai viet guide ten Guide", item);
        const { refreshing, isLoadMore } = this.state;
        return (

            <View style={{ backgroundColor: '#F0F6F5', flex: 1, }}>


                <HeaderVer2 />
                <View style={{ backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#CDD0D0' }}>
                    <View style={styles.centeredView}>
                        <View >
                            <TextInput
                                onChangeText={this.onChangeTextDelayed}
                                autoCapitalize="none"
                                placeholder={i18next.t('SearchGuider')}
                            >
                            </TextInput>
                        </View>


                        <View>
                            <TouchableOpacity
                                onPress={this.setShow}
                                style={{
                                    // position: 'relative',
                                    flexDirection: 'row',
                                    // borderWidth: 0.5,
                                    // borderRadius: 18,
                                    justifyContent: 'center',
                                    alignItems: "center",
                                    padding: 8,
                                    // marginRight: 5

                                }} >
                                {/* <Text style={styles.openButton}>{i18next.t('Advanced')}</Text> */}
                                {this.state.showSearch ?
                                    <Image style={{
                                        marginLeft: 5,
                                        width: 30,
                                        height: 30

                                    }}
                                        resizeMode='contain'
                                        source={Images.icon_up_button_blue_end}
                                    // source={Images.ic_dropdown2}
                                    >
                                    </Image>
                                    :
                                    <Image style={{
                                        marginLeft: 5,
                                        width: 30,
                                        height: 30


                                    }}
                                        resizeMode='contain'
                                        source={Images.icon_down_button_blue_end}
                                    //source={Images.ic_dropdown}
                                    >
                                    </Image>
                                }
                            </TouchableOpacity>
                        </View>

                    </View>

                    {this.state.showSearch ?
                        <View >
                            <View style={{
                                borderBottomWidth: 0.7,
                                borderBottomColor: '#C0C0C0',
                                marginLeft: 10,
                                marginRight: 10, justifyContent: 'center'
                            }}>
                                <View style={styles.container_item}>
                                    <View>
                                        <Image style={styles.alignLeft}
                                            source={Images.tour_calendar}
                                            resizeMode='contain'
                                        >
                                        </Image>
                                    </View>

                                    <View style={{ marginBottom: 3, marginLeft: 9 }}>
                                        <DatePicker
                                            showIcon={false}
                                            style={{ width: 150, height: 35 }}
                                            date={this.state.startDate}
                                            mode="date"
                                            placeholder={i18next.t('StartDate')}

                                            format="DD-MM-YYYY"
                                            minDate="01-01-2005"
                                            maxDate="01-01-2040"
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            customStyles={{

                                                dateInput: {
                                                    borderColor: '#fff',

                                                    marginLeft: -28,

                                                    alignSelf: 'center',

                                                },
                                                dateText: {
                                                    fontSize: 16,
                                                    color: '#C0C0C0',
                                                    alignItems: 'center'
                                                },
                                                placeholderText: {
                                                    fontSize: 13,
                                                    color: '#C0C0C0',
                                                    alignItems: 'center'
                                                }

                                            }}
                                            onDateChange={(date) => { this.setState({ startDate: date }) }}
                                        />
                                    </View>

                                    <View style={{ marginBottom: 3 }}>
                                        <DatePicker
                                            showIcon={false}
                                            style={{ width: 150, height: 35 }}
                                            date={this.state.endDate}
                                            mode="date"
                                            placeholder={i18next.t('EndDate')}
                                            format="DD-MM-YYYY"
                                            minDate="01-01-2005"
                                            maxDate="01-01-2040"
                                            confirmBtnText="Confirm"
                                            cancelBtnText="Cancel"
                                            customStyles={{

                                                dateInput: {
                                                    borderColor: '#fff',
                                                    //padding: 0,
                                                    marginLeft: -20,
                                                    // marginTop: -16
                                                    alignSelf: 'center',

                                                },
                                                dateText: {
                                                    fontSize: 16,
                                                    color: '#C0C0C0',
                                                    alignItems: 'center'
                                                },
                                                placeholderText: {
                                                    fontSize: 13,
                                                    color: '#C0C0C0',
                                                    alignItems: 'center'
                                                }

                                            }}
                                            onDateChange={(date) => { this.setState({ endDate: date }) }}
                                        />
                                    </View>

                                </View>
                            </View>
                            <View style={styles.borderBottom}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image style={styles.alignLeft}
                                        source={Images.tour_location}
                                        resizeMode='contain'
                                    ></Image>
                                    <TextInput placeholder={i18next.t('Place')}
                                        // customStyles={{
                                        //     placeholderStyle={ fontSize: 14 }
                                        // }}


                                        style={styles.alignLeftText}
                                        onChangeText={(text) => { this.setState({ place: text }) }}
                                    ></TextInput>
                                </View>
                            </View>
                            <View style={styles.borderBottom_}>
                                <TouchableOpacity onPress={this.changeLanguage} >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image style={styles.alignLeft}
                                            source={Images.tour_language}
                                            resizeMode='contain'
                                        ></Image>
                                        <TextInput value={this.state.language}
                                            editable={false}
                                            placeholder={i18next.t('Language')} style={styles.alignLeftText}>

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
                                    <Image style={{
                                        width: 15, height: 15, marginRight: 5
                                        //  marginTop: 5
                                    }}
                                        source={Images.search}
                                        resizeMode='contain'
                                    >

                                    </Image>
                                    <Text style={{
                                        color: '#fff',
                                        //  marginLeft: 5 
                                    }}>{i18next.t('Search')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        :
                        null
                    }
                </View>
                {/* <View style={{
                    flex: 1,

                    }}>
                    <FlatList
                        removeClippedSubviews={false}
                        data={item}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtractor}
                        ListFooterComponent={this.renderBottom}
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
                                                style={{ alignSelf: 'center', width: 100, height: 100, tintColor: '#EEECEC' }}
                                            ></Image>
                                            <Text style={{
                                                textAlign: 'center',
                                                marginTop: 10,
                                                fontSize: 16,

                                            }}>{i18next.t('No_result')}</Text>
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
                        onEndReached={this.loadMore}
                    // contentContainerStyle={{ paddingBottom: 10 }}
                    />
                </View> */}
            </View>
        );
    }
}
export default GuideComponent;
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',

        alignItems: 'center',
        //alignSelf: 'center'
        //height: 50
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
    textCmt: {
        fontSize: 13,
        color: '#000',
        marginLeft: 5
    },
    textCmt2: {
        fontSize: 13,
        color: '#1877f2',
        marginLeft: 5
    },

    alignLeft: {
        width: 16,
        height: 16,
        // alignItems: 'center'
        justifyContent: 'center',
        alignSelf: 'center'
    },
    textProfile: {
        marginTop: -2,
        marginLeft: 10,
    },
    alignLeftText: {
        // marginTop: -12,
        marginLeft: 12,
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
        height: 50,
        borderBottomWidth: 0.7,
        borderBottomColor: '#C0C0C0',
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'center'
    },
    borderBottom_: {
        height: 50,
        borderBottomWidth: 0.7,
        borderBottomColor: '#C0C0C0',
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'center'
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
    centeredView2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    icon_float: {
        position: "absolute",
        right: 0,
        bottom: -3,
        width: 14, height: 14
    }
})


