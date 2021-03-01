import React, { Component } from 'react';
import {
    StyleSheet, View, Text, Image,
    ActivityIndicator, TouchableOpacity, Alert, Platform, FlatList,
    ScrollView, TextInput, KeyboardAvoidingView,
    RefreshControl,
    Button,
    Dimensions
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { ReachabilityView, i18next, Loading } from '../utils'
import { backScreen, pushToUserProfile, gotoChatScreen } from '../navigation';
import FastImage from 'react-native-fast-image'
import Images from '../assets/images'
import Colors from '../constants/colors'
import Device from '../modules/Device';
import CommonStyles from '../constants/styles'
import DataManager from '../modules/DataManager'
import HeaderView from '../component/views/HeaderView'
import _ from 'lodash'
import Helper from '../utils/Helper';
import TourItemComponent from './tour-view/TourItemComponent'
import ProfileLikeView from './tour-view/ProfileLikeView';

const screenWidth = Device.screenSize().width

export default class ProfileLikeComponent extends Component {
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
        this.onPressUserTourList = this.onPressUserTourList.bind(this)
        this.doGetListTourGuideLike = this.doGetListTourGuideLike.bind(this)
        this.state = {
            show: false,
            showInfoTour: false,
            temp: '0deg',
            refreshing: false,
            isLoadMore: true,
            tourGUideLike: [],
            title: '',
        }
    }


    componentDidMount() {
        setTimeout(() => {
            this.doGetListTourGuideLike()
        }, 300);
    }

    onPressBack = () => {
        backScreen(this.props.componentId)
    }

    onPressUserProfile = (user_id) => {
        // const data = { user_id }
        // pushToUserProfile(this.props.componentId, data)
    }

    onPressChatButon = (item) => {

        const conversation_id = _.get(item, 'conversation_id')
        const room = {
            user_id: item.user_id,
            name_list: item.username,
            conversation_id
        }
        gotoChatScreen(this.props.componentId, room)
    }


    handleAvatar = (user_id) => {
        pushToUserProfile(this.props.componentId, { user_id })
    }
    doGetListTourGuideLike = () => {
        this.props.getListTourGuideLike()
            .then(data => {
                const tourGUideLike = data || []
                this.setState({
                    tourGUideLike,
                    refreshing: false,
                    isLoadMore: false
                })
            })
            .catch(error => {
            });
    }

    render() {
        const { refreshing, tourGUideLike, isLoadMore } = this.state
        let title = this.props.titlel;
        return (
            <View style={styles.container}>
                <HeaderView
                    title={title}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                    back={true}
                    onPressLeftBarButton={this.onPressBack}
                />
                <FlatList
                    removeClippedSubviews={false}
                    data={tourGUideLike}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                    refreshing={refreshing}
                    onRefresh={this.pullRefresh}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 10}
                    showsVerticalScrollIndicator={false}
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
                                            source={Images.icon_heart}
                                            style={{ alignSelf: 'center', width: 100, height: 100, tintColor: '#ADBFD1' }}
                                        ></Image>
                                        <Text style={{
                                            textAlign: 'center',
                                            marginTop: 10,
                                            fontSize: 16,
                                            color: '#ADBFD1'
                                        }}>{i18next.t('Chưa có ai')}</Text>
                                    </View>
                            }
                        </View>
                    }
                //ListEmptyComponent={this.renderEmpty}
                />
            </View>
        )
    }

    renderEmpty = () => {
        let show = this.state.show;
        let temp = this.state.temp;
        let showInfoTour = this.state.showInfoTour;
        const { isLoadMore, refreshing } = this.state
        if (isLoadMore) {
            return null
        }

        return (
            <View>
                <View style={styles.emptyView}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                        onPress={() => { this.onPressUserProfile(user_id) }}>
                        <FastImage
                            source={{ uri: 'https://reactnative.dev/img/tiny_logo.png', }}
                            style={{ width: 50, height: 50, marginLeft: 10, borderRadius: 25 }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        <View style={styles.info}>
                            <Text style={styles.title}></Text>
                        </View>
                    </TouchableOpacity>
                    <View>
                        <TouchableOpacity
                            style={styles.buttonTour}
                            onPress={this.onPressUserTourList}>
                            <Text style={styles.textTour}>
                                tour
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.rightView}>
                        <TouchableOpacity
                            style={styles.rightButton}
                            onPress={() => { this.onPressChatButon(this.props.item) }} >
                            <Image
                                source={Images.tabbar_inbox}
                                resizeMode='contain'
                                style={{ flex: 1, width: 20, height: 20 }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.borderBottom} />
                <View>
                    {show
                        ? <View>
                            <View style={styles.infoTour}>
                                <TouchableOpacity
                                    style={styles.leftInforTour}
                                    onPress={this.onPressShowInfoTour}>
                                    <Image
                                        source={Images.tour}
                                        style={{ width: 20, height: 20 }}
                                        resizeMode='contain' />
                                    <View style={styles.viewTextInforTour}>
                                        <Text style={styles.textInforTour}>Hà Nội - Sầm Sơn</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.rightButtonInfor}
                                    onPress={this.onPressShowInfoTour}>
                                    <Image
                                        source={Images.ic_dropdown}
                                        style={{ width: 15, height: 20, transform: [{ rotate: temp }] }}
                                        resizeMode='contain' />

                                </TouchableOpacity>
                            </View>
                            <View>
                                {showInfoTour
                                    ? <View>
                                        <View style={styles.moreInfortour}>
                                            <View style={styles.imageMoreInforTour}>
                                                <Image
                                                    source={Images.tour_calendar}
                                                    style={{ width: 15, height: 15 }}
                                                    resizeMode='contain' />
                                            </View>
                                            <View>
                                                <Text style={styles.textMoreInforTour}>
                                                    14/07/2020 - 16/07/2020
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.moreInfortour}>
                                            <View style={styles.imageMoreInforTour}>
                                                <Image
                                                    source={Images.tour_location}
                                                    style={{ width: 15, height: 15 }}
                                                    resizeMode='contain' />
                                            </View>
                                            <View>
                                                <Text style={styles.textMoreInforTour}>
                                                    Hà Nội
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.moreInfortour}>
                                            <View style={styles.imageMoreInforTour}>
                                                <Image
                                                    source={Images.tour_language}
                                                    style={{ width: 15, height: 15 }}
                                                    resizeMode='contain' />
                                            </View>
                                            <View>
                                                <Text style={styles.textMoreInforTour}>
                                                    Tiếng Việt
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.moreInfortour}>
                                            <View style={styles.imageMoreInforTour}>
                                                <Image
                                                    source={Images.tour_experience}
                                                    style={{ width: 15, height: 15 }}
                                                    resizeMode='contain' />
                                            </View>
                                            <View>
                                                <Text style={styles.textMoreInforTour}>
                                                    7 năm
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    : null
                                }
                            </View>

                            <View style={styles.borderBottom} />
                            <View style={styles.infoTour1}>
                                <View
                                    style={styles.leftInforTour1}>
                                    <Image
                                        source={Images.tour}
                                        style={{ width: 20, height: 20 }}
                                        resizeMode='contain' />
                                </View>
                                <View>
                                    <Text style={styles.textInforTour1}>Cà Mau - Mũi Né</Text>
                                </View>
                            </View>
                            <View style={styles.borderBottom} />
                            <View style={styles.infoTour1}>
                                <View
                                    style={styles.leftInforTour1}>
                                    <Image
                                        source={Images.tour}
                                        style={{ width: 20, height: 20 }}
                                        resizeMode='contain' />
                                </View>
                                <View>
                                    <Text style={styles.textInforTour1}>Hà Nội tour du lịch</Text>
                                </View>
                            </View>
                            <View style={styles.borderline}></View>
                        </View>
                        : null
                    }
                </View>
            </View>
        )
    }

    loadMore = () => {
        return
    }

    onPressUserTourList = () => {
        // console.log(":::::: ", this.state, "onpress");
        this.setState({ show: !this.state.show },
            () => { this.doGetListTourGuideLike() }
        );
    }

    onPressShowInfoTour = () => {
        // console.log("showInfoeTour...............", this.state)
        this.setState({ showInfoTour: !this.state.showInfoTour },
            () => { this.doGetListTourGuideLike() }
        );
        if (this.state.temp == '0deg') {
            this.setState({ temp: '180deg' })
        } else {
            this.setState({ temp: '0deg' })
        }
    }
    renderBottom = () => {
        const { isLoadMore } = this.state;
        return (<View style={{ height: 40, justifyContent: 'center' }}>
            {isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
        </View>)
    }

    pullRefresh = () => {
        if (this.state.refreshing === true) {
            return
        }

        this.setState({ refreshing: true }, () => {
            this.doGetListTourGuideLike()
        },
            // () => {this.doGetMyInfo()}
        )
    }

    renderItem = ({ item, index }) => {
        // console.log("item yeu thich", item);
        return (
            <View style={{
                flexDirection: 'row', backgroundColor: '#FFFFFF',
                paddingHorizontal: 10,
                //  borderBottomWidth: 0.5,
                alignItems: "center", paddingVertical: 5, marginTop: 10,
                height: 80
            }}>
                <View>
                    <TouchableOpacity
                        onPress={() => this.handleAvatar(item.user_id)}
                    >
                        <Image
                            source={{ uri: item.avatar }}
                            //resizeMode='contain'
                            style={{ width: 40, height: 40, borderRadius: 20, }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ marginLeft: 10, }}>
                    <Text style={{ fontSize: 16 }}>{item.username}</Text>
                </View>
            </View>
        )
    }

    keyExtractor = (item, index) => index.toString();
}

const styles = StyleSheet.create({
    backgroud: {
        backgroundColor: Colors.paleTurquoise1,
    },
    container: {
        flex: 1,
        backgroundColor: '#F1F7F5'
    },
    emptyView: {
        flexDirection: 'row',
        flex: 1,
        height: 80,
        alignItems: 'center',
    },
    info: {
        marginLeft: 10,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.black,
        paddingVertical: 2

    },

    buttonTour: {
        backgroundColor: Colors.white,
        height: 40,
        marginRight: 10,
        borderRadius: 5,
    },
    textTour: {
        height: 40,
        marginTop: 10,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    rightView: {
        height: 40,
        marginRight: 10,
        borderRadius: 5,

    },
    rightButton: {
        height: 50,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoTour: {
        marginTop: 3,
        flexDirection: 'row',
        flex: 1,
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    infoTour1: {
        marginTop: 3,
        flexDirection: 'row',
        flex: 1,
        height: 60,
        alignItems: 'center',
    },
    leftInforTour: {
        marginTop: 20,
        marginLeft: 8,
        display: 'flex',
        flexDirection: 'row'
    },
    leftInforTour1: {
        marginBottom: 10
    },
    viewTextInforTour: {
        marginLeft: 10,
        justifyContent: 'space-between',
    },
    textInforTour: {
        fontSize: 15,
        fontWeight: 'bold',
        paddingVertical: 2

    },
    textInforTour1: {
        marginLeft: 10,
        fontSize: 15,
        fontWeight: 'bold',
        paddingVertical: 2

    },
    rightButtonInfor: {
        marginTop: 20,
        marginRight: 20,
        borderRadius: 5,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        color: Colors.black
    },
    moreInfortour: {
        flex: 1,
        flexDirection: 'row',
        height: 40
    },
    imageMoreInforTour: {
        marginLeft: 8,
        marginTop: 10,
    },
    textMoreInforTour: {
        marginTop: 10,
        marginLeft: 10,
        fontSize: 15,
        fontWeight: 'bold'
    },
    borderline: {
        height: 0.5,
        borderWidth: 0.5,
        borderColor: Colors.light_gray,
        width: screenWidth,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    },
    borderBottom: {
        borderBottomWidth: 0.5,
        borderBottomColor: 'black',
        width: '90%',
        alignSelf: 'center'
    }

});
