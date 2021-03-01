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
    gotoChatScreen, setRootToHomeScreen, viewPhoto, gotoSelectOptionsScreen,
    getSearch, pushDetailGuideAgent, showModalSharePost, backScreen, showSharePost, pushToAccountVerify,
    pushToUserProfile

} from '../navigation';
import PostImageView from './post-views/PostImageView';
import DatePicker from 'react-native-datepicker';

import Images from '../assets/images'
import DismissKeyboard from 'dismissKeyboard';
import Colors from '../constants/colors'
import { ReachabilityView, i18next, Loading } from '../utils'
import HeaderView from './views/HeaderView';
import HeaderVer2 from './HeaderVer2';
import DateHelper from '../utils/DateHelper';
import Helper from '../utils/Helper';


class AgentComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSearch: false,
            refreshing: false,
            data: [],
            isLoadMore: true,
            showImg: false,
            place: '',
            language: '',
            keysearch: '',
            startDate: "",
            endDate: '',
            page: 1
        }
        this.onChangeTextDelayed = _.debounce(this.onChangeText, 1000);

    }

    pullRefresh = () => {
        if (this.state.refreshing == true) {
            return
        }
        this.setState({ refreshing: true }, () => {
            const data = {
                page: 1,
                type: 'tour'
            }
            this.doGetAgentHomePage(data)
        })
    }
    loadMore = () => {
        if (this.state.isLoadMore == true) {
            return
        }

        this.setState({ isLoadMore: true }, () => {
            const data = {
                page: this.state.page,
                type: 'tour'
            }
            this.doGetAgentHomePage(data)
        })
    }

    onPressBack = () => {
        backScreen(this.props.componentId)
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
    doGetAgentHomePage = (data) => {
        // const dataInput = {
        //     type: this.props.agent,
        //     page: page
        // }

        this.props.getAgentHomePage(data)
            .then(() => {
                // console.log("111111111111111",);
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
    onPressComment = (item) => {
        pushDetailGuideAgent(this.props.componentId, { comment: item }, { showKeyboard: true });
    }

    setShow = () => {
        this.setState({
            showSearch: !this.state.showSearch
        })
    }
    likePostdata = (id) => {

        this.props.likePostAgent(id)

    }
    componentDidMount = () => {
        const data = {
            page: 1,
            type: 'tour'
        }
        this.doGetAgentHomePage(data)
    }
    onChangeText = (text) => {
        this.setState({
            keysearch: text
        })
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

    pushToAccountVerify = () => {
        pushToAccountVerify(this.props.componentId);
    }

    handleGuideApply = (item) => {
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
        // console.log("item bai dang tour", item);
        const apply_type = item.apply ? item.apply.type : ''
        if (apply_type.toString() == '4' || apply_type.toString() == '3' || apply_type.toString() == '6') {
            Helper.showAlert('', i18next.t('Tour đã hủy'))
        }
        // const user_apply = _.get(data, 'comment.user_apply')
        if (apply_type.toString() == '2') {
            Helper.showAlert('', i18next.t('DoYouWantToCancelThisTour'),
                [
                    {
                        text: i18next.t('Ok'),
                        onPress: () => {
                            const data = {
                                comment_id: item.comment_id,
                                action: 'guide-cancel'
                            }
                            this.doApplyPostTour(data)
                        },
                    },
                    {
                        text: i18next.t('No'), onPress: () => {
                        },
                    },
                ]
            )
        }
        if (apply_type.toString() == '0') {
            const data = {
                comment_id: item.comment_id
            }
            this.doApplyPostTour(data)
        }
    }
    doApplyPostTour = (comment_id) => {
        Loading.showHud()
        // request
        this.props.applyPostTour(comment_id)
            .then(data => {
                // console.log("data sau khi apply tour", data);
                Loading.hideHud()
                if (data.status == 'pending') {
                    Helper.showAlert('', "Bạn đã đăng ký tour thành công",
                        [
                            {
                                text: 'OK', onPress: () => {
                                }
                            }
                        ]
                    )
                }
                if (data.error) {
                    Helper.showAlert('', data.messages,
                        [
                            {
                                text: 'OK', onPress: () => {
                                }
                            }
                        ]
                    )
                }
            })
            .catch(error => {
                Loading.hideHud()
                if (error) {
                    Helper.showAlert('', error,
                        [
                            {
                                text: 'OK', onPress: () => {
                                }
                            }
                        ]
                    )
                }
            });
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
        // console.log("item agent :::::::::::", item)
        let likeStatus = item.like_comment
        let apply_type = i18next.t('Register')
        if (item.apply) {
            apply_type = item.apply.type
        }

        let total_likes = item.total_likes
        let started_dates = item.create_date;
        let photos
        if (item.photo) {
            photos = item.photo.photos
        }
        const { is_agent } = item || ''
        // let is_agent=""
        // if(item&&item.is_agent){
        //     is_agentitem.is_agent
        // }
        return (
            <View style={{
                backgroundColor: '#fff',
                //  paddingBottom: 10,
                paddingTop: 18, paddingLeft: 10, paddingRight: 17,
                borderTopColor: '#f0f6f6', borderTopWidth: 8
            }}>
                <View style={styles.centeredView2}>
                    <View style={styles.container}>
                        {/* luu */}
                        <TouchableOpacity
                            onPress={() => this.handleAvatar(item.user_id)}
                        >
                            <Image style={{ width: 40, height: 40, borderRadius: 20, position: "relative" }}
                                source={{ uri: item.avatar }} />
                            {is_agent == "1" ? <Image
                                source={Images.logo_flag_header}
                                style={styles.icon_float}
                            /> : null}

                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.handleAvatar(item.user_id)}
                        >
                            <View style={styles.textProfile} >

                                <Text style={{ fontSize: 16, fontWeight: '500', color: '#1C1C1C' }}>{item.username}</Text>
                                <Text style={{ color: '#666666', fontSize: 13 }}>{started_dates}</Text>
                            </View>
                        </TouchableOpacity>

                    </View>

                </View>
                <View style={{ marginTop: 10 }}>
                    <View style={styles.container}>
                        <Image resizeMode="contain" style={{ width: 16, height: 16 }}
                            source={Images.tour_name_2}>
                        </Image>
                        <Text selectable style={styles.alignLeftTextTitle}>{item.title}</Text>
                    </View>
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
                        <Image style={{ width: 15, height: 15 }}
                            resizeMode="contain"
                            source={Images.tour_location}
                        ></Image>
                        <Text selectable style={styles.alignLeftText2}>{item.location}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 10 }}>
                    <View style={styles.container}>
                        <Image resizeMode="contain" style={{ width: 16, height: 16, }}
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
                <View style={{ marginTop: 10 }}>
                    <View style={styles.container}>
                        <Image resizeMode="contain" style={{ width: 16, height: 16 }}
                            source={Images.ic_time_schedule_max}
                        ></Image>
                        <Text selectable style={styles.alignLeftText2}>{i18next.t('Deadline')} {item.deadline_date}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 10, marginBottom: 8 }}>
                    <Text selectable>
                        {item.content}
                    </Text>
                    <View style={{ marginBottom: 8, marginTop: 7, marginLeft: -8 }}>
                        <PostImageView
                            onPressImage={this.testImg(item.photo)}
                            photos={photos}
                        />
                    </View>
                    <View style={{
                        flexDirection: "row", width: '100%', marginHorizontal: 10, justifyContent: 'space-between',
                        // borderColor: 'red', borderWidth: 1
                    }}>
                        {(total_likes >= 1) ?
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity style={styles.container}>
                                    <Image resizeMode="contain" style={{ width: 20, height: 20 }}
                                        source={Images.like_count}
                                    ></Image><Text style={{ paddingLeft: 5 }}>{item.total_likes}</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View></View>
                        }

                        {
                            (item.total_comments >= 1) ?
                                <View>
                                    <Text>

                                        {item.total_comments} {i18next.t('Comments')}
                                    </Text>
                                </View>
                                : <View></View>
                        }
                    </View>
                </View>
                {/* <Modal visible={this.state.showImg} transparent={true}>
                    <ImageViewer imageUrls={images}
                        onSwipeDown={this.handleSwipeDown}
                        flipThreshold={20}
                        enableSwipeDown={true}
                    />
                </Modal> */}
                <View style={{
                    borderTopWidth: 0.5, paddingTop: 15, marginTop: 10, marginBottom: 10, paddingBottom: 4,
                    borderColor: '#DDDDDD', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
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
                        onPress={() => { this.handleGuideApply(item) }}
                    >
                        <Image style={{ marginTop: 2 }}
                            source={Images.post_apply}>
                        </Image>

                        {
                            apply_type.toString() == '4' || apply_type.toString() == '3' || apply_type.toString() == '6' ?
                                <Text style={{ fontSize: 13, color: '#FF6347', paddingLeft: 5 }}>{i18next.t('Unsubscribe')}</Text> : null
                        }
                        {
                            apply_type.toString() == '0' ?
                                <Text style={{ fontSize: 13, paddingLeft: 5 }}>{i18next.t('Register')}</Text> : null
                        }
                        {
                            apply_type.toString() == '2' ?
                                <Text style={{ fontSize: 13, color: '#FF6347', paddingLeft: 5 }}>{i18next.t('CancelRegistration')}</Text> : null
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.container}
                        onPress={
                            () => {
                                this.onPressShareButton(item)
                            }
                        }>
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
    onPressBack = () => {
        backScreen(this.props.componentId)
    }

    render() {
        const { item } = this.props;
        // console.log("item ngay khi action dang kí", item);
        const { refreshing, isLoadMore } = this.state;
        return (

            <View style={{ backgroundColor: '#f0f6f6', flex: 1, }}>
                <HeaderView
                    title={i18next.t('TourSystem')}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                    back={true}
                    onPressLeftBarButton={this.onPressBack}
                />
                <View style={{ backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#CDD0D0' }}>
                    <View style={styles.centeredView}>
                        <View>
                            <TextInput
                                onChangeText={this.onChangeTextDelayed}
                                autoCapitalize="none"
                                placeholder={i18next.t('SearchforTravelCompanies')}
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
                                {/* <Text style={styles.openButton}>{i18next.t('Advanced')}</Text> */}
                                {this.state.showSearch ?
                                    <Image style={{
                                        //  position: 'absolute', top: 14, right: 8
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
                                        //  position: 'absolute', top: 13, right: 8, width: 8, height: 8 
                                        marginLeft: 5,
                                        width: 30,
                                        height: 30
                                    }}
                                        resizeMode='contain'
                                        source={Images.icon_down_button_blue_end}
                                    // source={Images.ic_dropdown}
                                    >
                                    </Image>
                                }
                            </TouchableOpacity>
                        </View>

                    </View>

                    {this.state.showSearch ?
                        <View >
                            <View style={styles.borderBottom}>
                                <View style={styles.container_item}>
                                    <View>
                                        <Image resizeMode='contain' style={styles.alignLeft}
                                            source={Images.tour_calendar}

                                        >

                                        </Image>
                                    </View>
                                    <View style={{ marginBottom: 2, marginLeft: 8 }}>
                                        <DatePicker
                                            showIcon={false}
                                            style={{ width: 150, height: 35, }}
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
                                                    //padding: 0,
                                                    marginLeft: -30,
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
                                            onDateChange={(date) => { this.setState({ startDate: date }) }}
                                        />
                                    </View>

                                    <View style={{ marginBottom: 2 }}>
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
                                                    marginLeft: -30,
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
                                <View style={styles.container_item}>
                                    <Image resizeMode='contain' style={styles.alignLeft}
                                        source={Images.tour_location}
                                        resizeMode='contain'
                                    ></Image>

                                    <TextInput placeholder={i18next.t('Place')} style={styles.alignLeftText}
                                        onChangeText={(text) => { this.setState({ place: text }) }}
                                    ></TextInput>
                                </View>
                            </View>
                            <View>
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
                                            style={{ alignSelf: 'center', width: 100, height: 100, tintColor: '#ADBFD1' }}
                                        ></Image>
                                        <Text style={{
                                            textAlign: 'center',
                                            marginTop: 10,
                                            fontSize: 16,
                                            color: '#ADBFD1'
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
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
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
    alignLeftTextTitle: {
        marginTop: 0,
        marginLeft: 10,
        fontSize: 14,
        color: 'black',
        fontWeight: '500',
        fontSize: 16

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
export default AgentComponent;

