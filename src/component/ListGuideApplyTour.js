import React, { Component } from 'react';

import { View, Text, Image, ActivityIndicator, RefreshControl } from 'react-native'
import HeaderView from './views/HeaderView';

import { ReachabilityView, i18next, Loading } from '../utils'
import Images from '../assets/images'
import Colors from '../constants/colors'
import _ from 'lodash'
import Helper from '../utils/Helper';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import FastImage from 'react-native-fast-image';
import { FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native';
import {
    pushToUserProfile,
    gotoChatScreen,
    backScreen
} from '../navigation';
import SocketManager from '../modules/SocketManager'

class ListGuideApplyTour extends Component {
    constructor(props) {
        super(props)
        this.page = 1
        this.state = {
            isLoadMore: true,
            refreshing: false,
        }
    }
    componentDidMount() {

        this.dogetGuiderApplyTour()
        this.setState({
            isLoadMore: true
        })
    }
    loadMore = () => {
        const { refreshing } = this.state

        if (this.state.isLoadMore === true) {
            return
        }
        if (refreshing == false) {
            this.setState({ isLoadMore: true }, () => {
                this.dogetGuiderApplyTour(null)
            })
        }
    }
    dogetGuiderApplyTour = () => {
        this.props.getListGuideApplyTour(this.props.comment_id)
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
    handleAgentAgree = (item) => {
        // console.log("agent dong ys", item);
        let data = {
            comment_id: item.comment_id,
            guider_id: item.user_guide_id,
        }
        this.props.applyUser(data)
            .then((data) => {
                SocketManager.sendComment()
                if (data.status == "RESULT_NOT_OK") {
                    Helper.showAlert('', i18next.t(data.messages))
                }
            })
    }
    handleAgentCancel = (item) => {
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
                        this.props.applyUser(data)
                            .then((data) => {
                                SocketManager.sendComment()
                                if (data.status == "RESULT_NOT_OK") {
                                    Helper.showAlert('', i18next.t(data.messages))
                                }
                            })
                    },
                },
                {
                    text: i18next.t('No'), onPress: () => {
                    },
                },
            ]
        )

    }
    agentCancel = () => {
        Helper.showErrorAlert('', i18next.t('YouCanceledThisGuide'))
    }
    handleAvatar = (user_id) => {
        const data = { user_id }
        pushToUserProfile(this.props.componentId, data)
    }
    handleChat = (item) => {
        // console.log("item log moi", item);
        const conversation_id = _.get(item.conversation, 'conversation_id')
        const room = {
            user_id: item.user_guide_id,
            name_list: item.display_name,
            conversation_id
        }
        gotoChatScreen(this.props.componentId, room)
    }

    pullRefresh = () => {
        if (this.state.refreshing === true) {
            return
        }

        this.setState({ refreshing: true }, () => {
            this.dogetGuiderApplyTour()
        })
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
                paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
            }}>

                <View style={{ flexDirection: 'row', width: '65%', borderWidth: 0 }}>
                    <View>
                        <TouchableOpacity
                            onPress={() => this.handleAvatar(item.user_guide_id)}
                        >
                            <Image
                                source={{ uri: item.avatar }}
                                style={{ width: 52, height: 52, borderRadius: 26 }}
                            />
                        </TouchableOpacity>

                    </View>
                    <View style={{ marginLeft: 5, width: '70%' }}
                    >

                        <Text
                            style={{ fontSize: 16, flexWrap: 'wrap', color: '#000000', fontWeight: '500' }}
                            numberOfLines={2}
                        >
                            {item.display_name}
                        </Text>
                        <Text>

                            {created_date}
                        </Text>
                        {
                            status == 'guide-cancel' ?
                                <Text>Guide đã hủy tour</Text>
                                : null
                        }
                    </View>
                </View>

                <View style={{ width: '35%', borderWidth: 0 }}>

                    {
                        status == 'wait' ?
                            <View >
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

                                <View style={{ flex: 1, flexDirection: 'row', marginTop: 7 }}>
                                    <TouchableOpacity
                                        onPress={() => this.handleAgentAgree(item)}
                                    >
                                        <Text style={{
                                            textAlign: 'center', color: '#fff', backgroundColor: Colors.green_1,
                                            fontSize: 16, paddingHorizontal: 10, paddingVertical: 5, marginRight: 3, borderRadius: 5
                                        }}>{i18next.t('Ok')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => this.handleAgentCancel(item)}
                                    >
                                        <Text style={{
                                            textAlign: 'center', color: '#fff', backgroundColor: Colors.green_1,
                                            fontSize: 16, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5
                                        }}>{i18next.t('Cancel')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            : null
                    }

                    {
                        status == 'agree' ?
                            <View>

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
                                <View style={{ marginTop: 7, paddingHorizontal: 25 }}>
                                    <TouchableOpacity
                                        onPress={() => this.handleAgentCancel(item)}
                                    >
                                        <Text style={{
                                            textAlign: 'center', color: '#fff', backgroundColor: Colors.green_1,
                                            fontSize: 16, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5
                                        }}>{i18next.t('Cancel')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            :
                            null
                    }
                    {
                        status == 'agent-cancel' ?
                            <View >
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
                                <View style={{ marginTop: 7 }}>
                                    <TouchableOpacity
                                        onPress={this.agentCancel}
                                    >
                                        <Text style={{
                                            textAlign: 'center', backgroundColor: Colors.green_1, color: '#FFFFFF',
                                            fontSize: 16, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5
                                        }}>{i18next.t('Canceled')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            :
                            null
                    }
                    {
                        status == 'cancelled' ?
                            <View >
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
                                <View style={{ marginTop: 7 }}>
                                    <TouchableOpacity
                                    // onPress={this.agentCancel}
                                    >
                                        <Text style={{
                                            textAlign: 'center', backgroundColor: Colors.green_1, color: '#FFFFFF',
                                            fontSize: 16, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5
                                        }}>{i18next.t('Canceled')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            :
                            null
                    }

                </View>

            </View>
        )
    }
    _keyExtractor = (item, index) => index.toString();
    onPressBack = () => {
        backScreen(this.props.componentId)
    }
    renderBottom = () => {
        const { isLoadMore } = this.state
        return (
            <View style={{ height: 40, justifyContent: 'center' }}>
                {isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
            </View>
        )
    }
    render() {
        const { listGuideApply } = this.props
        const { isLoadMore } = this.state
        return (
            <View>
                <FlatList
                    removeClippedSubviews={false}
                    data={listGuideApply}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.pullRefresh}
                        />
                    }
                    ListFooterComponent={this.renderBottom}
                    onEndReached={this.dogetGuiderApplyTour}
                    onEndReached={this.loadMore}
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
                                        }}>{i18next.t('NoTourGuideRegisteredYet')}
                                            {/* {i18next.t('No_result')} */}
                                        </Text>
                                    </View>
                            }
                        </View>
                    }
                // refreshing={refreshing}
                // onRefresh={this.pullRefresh}
                // onEndReached={this.loadMore}
                //onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 1}
                // showsVerticalScrollIndicator={false}
                // ListFooterComponent={this.renderBottom}
                // ListEmptyComponent={this.props.listGuideApply.length == 0 ? this.renderEmpty}
                />

            </View>
        );
    }
}

export default ListGuideApplyTour;