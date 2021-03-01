import React, { Component } from 'react';
import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    ScrollView,
    FlatList,
    Modal,
    ClippingRectangle,
    RefreshControl,
    ActivityIndicator,
    SafeAreaView, Platform
} from 'react-native';
import Colors from '../constants/colors';
import Images from '../assets/images';
import { ReachabilityView, i18next } from '../utils';
import {
    pushDetailTourInvited,
    pushToUserProfile
} from '../navigation';
import Helper from '../utils/Helper';


class TourInviteComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkNumberOfLine: false,
            page: 1,
            keysearch: '',
            refreshing: false,
            isLoadMore: false,
        }

    }
    componentDidMount() {

        this.doGetListTourAgentInvite(this.state.page)
    }

    doGetListTourAgentInvite = (page) => {
        let data = {
            page: page,
            keysearch: this.state.keysearch

        }
        this.props.getListTourAgentInvite(data)
            .then(() => {
                this.setState({
                    page: this.state.page + 1,
                    refreshing: false,
                    isLoadMore: false
                })
            })
    }

    renderEmpty = () => {

        const { isLoadMore } = this.state
        if (isLoadMore) {
            return null
        }

        return (<View style={styles.emptyView}>
            <Text style={{ fontSize: 14, color: Colors.black_1, textAlign: 'center' }}>
                {i18next.t('ThereIsNoTour')}
            </Text>
        </View>)
    }

    loadMore = () => {
        // if (this.state.isLoadMore === true) {
        //   return
        // }

        this.setState({ isLoadMore: true }, () => {
            this.doGetListTourAgentInvite(this.state.page)
        })
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

        this.setState({ refreshing: true, }, () => {
            this.doGetListTourAgentInvite(1)
        })
    }
    checkText = () => {
        // console.log("chay hamf");
        this.setState({
            checkNumberOfLine: !this.state.checkNumberOfLine
        })
        // this.props.checkText()
    }
    handleDetaileTour = (item) => {
        //xem chi tiet our
        pushDetailTourInvited(this.props.componentId, { item })
    }
    handleName = (user_id) => {
        const data = { user_id }
        pushToUserProfile(this.props.componentId, data)
    }

    handleConfirm = (item) => {
        //call api dong y tham gia tour
        let data = {
            comment_id: item.comment_id
        }
        this.props.guideConfirmInvited(data)
            .then((message) => {
                if (message) {

                    Helper.showAlert('', i18next.t(message))
                }
            })

    }


    handleCancel = (item) => {
        // console.log("item tren invited", item);
        let data = {
            comment_id: item.comment_id,
            action: 'guide-cancel',
        }
        Helper.showAlert('', i18next.t('AreYouSureYouRefuseToJoinThisTour'),
            [
                { text: i18next.t('No'), onPress: null },
                {
                    text: i18next.t('Yes'), onPress: () => {
                        this.props.guideCancelInvited(data)
                    }
                }
            ])

    }
    _keyExtractor = (item, idx) => idx.toString()
    _renderItem = ({ item }) => {
        let status, created_date;

        if (item && item.invited) {
            status = item.invited.status
            created_date = item.invited.created_date
        }
        return (
            <View style={styles.wrapItem}>
                <View style={{ flexDirection: 'row', marginTop: 10, }}>
                    <View style={{ width: '11%' }}>
                        <TouchableOpacity
                            onPress={() => this.handleName(item.user_id)}
                        >
                            <Image
                                source={{ uri: item.avatar }}
                                style={{ width: 40, height: 40, borderRadius: 20 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '89%', justifyContent: 'center', marginLeft: 5 }}>
                        <TouchableOpacity
                            onPress={() => this.handleName(item.user_id)}
                        >
                            <Text style={{ color: Colors.black, fontSize: 16, fontWeight: '500' }}>
                                {item.display_name}
                            </Text>
                        </TouchableOpacity>
                        <Text>{created_date}</Text>
                    </View>

                </View>
                <TouchableOpacity
                    onPress={() => this.handleDetaileTour(item)}
                >
                    <View style={{ marginTop: 10 }}>
                        <View style={styles.container}>
                            <Image resizeMode="contain" style={{ width: 16, height: 16 }}
                                source={Images.tour_name_2}>
                            </Image>
                            <Text selectable style={[styles.alignLeftText2, { fontSize: 16, fontWeight: '600' }]}>{item.title}</Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 5 }}>
                        <View style={styles.container}>
                            <Image style={{ width: 15, height: 15 }}
                                resizeMode="contain"
                                source={Images.tour_location}
                            ></Image>
                            <Text selectable style={styles.alignLeftText2}>{item.location}</Text>
                        </View>
                    </View>
                    <View style={{ marginVertical: 5 }}>
                        <View style={styles.container}>
                            <Image style={{ width: 15, height: 15 }}
                                resizeMode="contain"
                                source={Images.tour_calendar}
                            ></Image>
                            <Text selectable style={styles.alignLeftText2}>{item.date_tour}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                {/* <View style={{ marginTop: 10 }}>
                    <View style={styles.container}>
                        <Image resizeMode="contain" style={{ width: 16, height: 16, }}
                            source={Images.tour_language}
                        ></Image>
                        <Text selectable style={styles.alignLeftText2}>{item.language}</Text>
                    </View>
                </View> */}

                {
                    status == "agent-cancel" ?
                        <View style={{ marginTop: 10 }}>
                            <Text>Agent đã hủy lời mời</Text>
                        </View>
                        : null
                }

                {
                    status == 'not active' ?
                        <View style={{ flexDirection: 'row', borderTopWidth: 0.5, justifyContent: 'space-evenly', paddingVertical: 10, borderColor: Colors.gray_3 }}>
                            <View style={{
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                borderWidth: 0.5,
                                borderColor: Colors.green_1,
                                borderRadius: 6

                            }}>
                                <TouchableOpacity
                                    onPress={() => this.handleConfirm(item)}
                                >
                                    <Text style={{ fontSize: 16, color: Colors.green_1, textAlign: 'center' }}>Đồng ý
                        </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                paddingHorizontal: 15,
                                paddingVertical: 5,
                                borderColor: Colors.gray_3,
                                borderWidth: 1,
                                borderRadius: 6
                            }}>
                                <TouchableOpacity
                                    onPress={() => this.handleCancel(item)}
                                >
                                    <Text style={{ fontSize: 16, textAlign: 'center' }}>Hủy
                        </Text>
                                </TouchableOpacity>
                            </View>
                        </View> : null
                }
                {
                    status == 'agreed' ?
                        <View>
                            <Text style={{
                                fontSize: 14, marginTop: 10
                            }}>Đã tham gia tour</Text>
                        </View> : null
                }

                {
                    status == 'guide-cancel' ?
                        <View>
                            <Text style={{
                                fontSize: 14, marginTop: 10
                            }}>Đã hủy tham gia tour</Text>
                        </View> : null
                }


            </View>
        )
    }

    render() {
        // console.log("this props", this.props.listTourInvite);
        const { refreshing, isLoadMore } = this.state
        return (
            <View style={{ backgroundColor: '#F1F7F5' }}>
                <FlatList
                    data={this.props.listTourInvite}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}

                    refreshing={refreshing}
                    onRefresh={this.pullRefresh}
                    // onEndReached={this.doGetListApplied}
                    // onEndReached={this.loadMore}
                    onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 1}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={this.renderBottom}
                    ListEmptyComponent={this.renderEmpty}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={this.pullRefresh}
                        />
                    }
                />
            </View>
        );
    }
}

export default TourInviteComponent;

const styles = StyleSheet.create({
    text_Btn: {
        color: '#fff',
        fontSize: 16
    },
    Btn_Agree: {
        width: 120,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: Colors.blue_1,
        borderRadius: 8

    },
    Btn_Cancel: {
        width: 120,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.gray_3,
        borderRadius: 8
    },
    Btn_Confim: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
        // borderTopColor: Colors.gray_1,
        borderTopWidth: 1,
        paddingVertical: 10,
        borderColor: Colors.green_1
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    alignLeftText2: {
        marginTop: 0,
        marginLeft: 10,
        fontSize: 14,
        color: Colors.black,


    },
    wrapItem: {
        //    
        paddingHorizontal: 10,
        // borderBottomColor: '#F1F7F5',
        // borderBottomWidth: 7,
        // borderColor: Colors.gray_1,
        // borderWidth: 1,
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
        paddingVertical: 5
    },
    emptyView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100
    },
})