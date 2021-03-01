import React, { Component } from 'react';
import { View, Text, RefreshControl, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native'

import HeaderView from './views/HeaderView'
import {
    pushToUserProfile,
    gotoChatScreen,
    backScreen
} from '../navigation';
import { ReachabilityView, i18next, Loading } from '../utils'
import Colors from '../constants/colors'
import Images from '../assets/images'
import Helper from '../utils/Helper';
import _ from 'lodash'
import SocketManager from '../modules/SocketManager'

class ListGuideTour extends Component {
    state = {
        isLoadMore: true,
        refreshing: false,
    }

    componentDidMount() {

        this.setState({
            isLoadMore: true
        })
        this.dogetGuiderTour()
    }

    dogetGuiderTour = () => {
        this.props.getListGuideTour(this.props.comment_id)
            .then(res => {
                this.page = this.page + 1
                this.setState({
                    refreshing: false,
                    isLoadMore: false
                })

            })
            .catch(err => {
                this.page = this.page + 1
                this.setState({
                    refreshing: false,
                    isLoadMore: false
                })

            })

    }

    onPressBack = () => {
        backScreen(this.props.componentId)
    }
    _keyExtractor = (item, index) => index.toString()

    pullRefresh = () => {
        if (this.state.refreshing === true) {
            return
        }

        this.setState({ refreshing: true }, () => {
            this.dogetGuiderTour()
        })
    }


    hanleAgentCancel = (item) => {
        Helper.showAlert('', i18next.t('AreYouSureYouWantToCancelThisGuide'),
            [
                {
                    text: i18next.t('Ok'),
                    onPress: () => {
                        let data = {
                            comment_id: item.comment_id,
                            guider_id: item.user_guide_id,
                            action: 'agent-cancel'
                        }
                        this.props.agentCancelGuide(data)
                        SocketManager.sendComment()
                    },
                },
                {
                    text: i18next.t('No'), onPress: () => {
                    },
                },
            ]
        )
    }
    hanleAgentCanceled = (item) => {
        //sau khi nhận dc request hủy, agent call api hủy
        let data = {
            comment_id: item.comment_id,
            guider_id: item.user_guide_id,
            action: 'agent-cancel'
        }
        this.props.agentCancelGuide(data)
        SocketManager.sendComment()
        // Helper.showAlert('', i18next.t('Bạn đã hủy hướng dẫn viên này'))
    }
    handleAvatar = (user_id) => {

        const data = { user_id }
        pushToUserProfile(this.props.componentId, data)
    }
    handleChat = (item) => {
        const conversation_id = _.get(item.conversation, 'conversation_id')
        const room = {
            user_id: item.user_id,
            name_list: item.display_name,
            conversation_id
        }
        gotoChatScreen(this.props.componentId, room)
    }
    _renderItem = ({ item }) => {
        let status, created_date;
        if (item.agent_apply) {
            status = item.agent_apply.type;
            created_date = item.created_date
        }
        return (
            <View style={{
                backgroundColor: '#FFFFFF', marginTop: 10, paddingHorizontal: 10,
                paddingVertical: 10, flexDirection: 'row',
            }}>

                <View style={{
                    flexDirection: 'row', width: '70%',
                    // borderWidth: 1 
                }}>
                    <View style={{ justifyContent: 'center' }}>
                        <TouchableOpacity
                            onPress={() => this.handleAvatar(item.user_guide_id)}
                        >
                            <Image
                                source={{ uri: item.avatar }}
                                style={{ width: 52, height: 52, borderRadius: 26 }}
                            />
                        </TouchableOpacity>

                    </View>
                    <View style={{ marginLeft: 10, width: '80%', justifyContent: 'center' }}
                    >

                        <Text
                            style={{ fontSize: 16, color: '#000000', fontWeight: '500' }}
                            numberOfLines={4}
                        >
                            {item.display_name}
                        </Text>
                        <Text>
                            {created_date}
                        </Text>
                        {
                            status == 'guide-cancel' ?
                                <Text
                                    numberOfLines={4}
                                    style={{ marginTop: 10 }}> Hướng dẫn viên yêu cầu hủy đi tour
                            </Text>
                                :
                                null
                        }
                        {
                            status == 'agent-cancel' ?
                                <Text
                                    numberOfLines={4}
                                    style={{ marginTop: 10, color: Colors.red_1 }}> Chờ Guide xác nhận hủy
                            </Text>
                                :
                                null
                        }

                    </View>
                </View>

                <View style={{
                    // borderWidth: 1,
                    width: '30%'
                }}>
                    <TouchableOpacity
                        style={{ alignContent: 'center' }}
                        onPress={() => this.handleChat(item)}
                    >
                        <Image
                            source={Images.tabbar_inbox}
                            style={{ width: 25, height: 25, tintColor: Colors.green_1, alignSelf: 'center' }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                    {
                        status == 'agree' ?
                            <View style={{
                                width: '90%', alignSelf: 'center',
                                justifyContent: 'center', marginTop: 7, paddingHorizontal: 15, paddingVertical: 5
                            }}>
                                <TouchableOpacity

                                    onPress={() => this.hanleAgentCancel(item)}
                                >
                                    <Text style={{
                                        color: '#fff', textAlign: 'center',
                                        fontSize: 16,
                                        //paddingHorizontal: 25,
                                        paddingVertical: 5,
                                        backgroundColor: Colors.green_1, borderRadius: 5
                                    }}> Hủy</Text>
                                </TouchableOpacity>

                            </View> : null
                    }
                    {
                        status == 'guide-cancel' ?
                            <View style={{
                                width: '90%', alignSelf: 'center',
                                justifyContent: 'center', marginTop: 7, paddingHorizontal: 15, paddingVertical: 5
                            }}>
                                <TouchableOpacity

                                    onPress={() => this.hanleAgentCanceled(item)}
                                >
                                    <Text style={{
                                        textAlign: 'center',
                                        fontSize: 16,
                                        color: Colors.green_1,
                                        paddingHorizontal: 5,
                                        paddingVertical: 5,
                                        // backgroundColor: Colors.green_1,
                                        borderRadius: 5,
                                        borderWidth: 0.5,
                                        borderColor: Colors.green_1
                                    }}>Đồng ý</Text>
                                </TouchableOpacity>

                            </View> : null
                    }
                    {
                        status == 'cancelled' ?
                            <View style={{
                                width: '90%', alignSelf: 'center',
                                justifyContent: 'center', marginTop: 7, paddingHorizontal: 15, paddingVertical: 5
                            }}>
                                <Text style={{
                                    textAlign: 'center',
                                    fontSize: 16,
                                    //paddingHorizontal: 25,
                                    paddingVertical: 5,
                                    backgroundColor: Colors.gray_3, borderRadius: 5
                                }}>Đã hủy</Text>
                            </View> : null
                    }

                </View>

            </View >
        )
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

        if (this.state.isLoadMore === true) {
            return
        }
        if (refreshing == false) {
            this.setState({ isLoadMore: true }, () => {
                this.dogetGuiderTour(null)
            })
        }
    }
    render() {
        const { listGuideTour } = this.props
        const { isLoadMore } = this.state
        return (
            <View>
                <FlatList
                    removeClippedSubviews={false}
                    data={listGuideTour}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ListFooterComponent={this.renderBottom}
                    onEndReached={this.dogetGuiderTour}
                    onEndReached={this.loadMore}
                    refreshControl={

                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.pullRefresh}
                        />
                    }
                    ListEmptyComponent={
                        <View style={{ flex: 1 }}>
                            {
                                isLoadMore
                                    ?
                                    <View>

                                    </View>
                                    :
                                    <View style={{ flex: 1, marginTop: 100 }}>
                                        {/* <Image
                                                    source={Images.search_not_value}
                                                    style={{ alignSelf: 'center', width: 100, height: 100, tintColor: '#ADBFD1' }}
                                                ></Image> */}
                                        <Text style={{
                                            textAlign: 'center',
                                            marginTop: 10,
                                            fontSize: 16,
                                            color: '#ADBFD1'
                                        }}>{i18next.t('NoTourGuideYet')}
                                            {/* {i18next.t('No_result')} */}
                                        </Text>
                                    </View>
                            }
                        </View>
                    }
                />

            </View>
        );
    }
}

export default ListGuideTour;