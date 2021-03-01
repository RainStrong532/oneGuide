import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native'
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


class ListGuideInvited extends Component {
    constructor(props) {
        super(props)
        // this.page = 1
        this.state = {
            isLoadMore: true,
            refreshing: false,
            page: 1
        }
    }
    componentDidMount() {
        this.setState({
            isLoadMore: true
        })
        this.doGetGuiderInvited()
    }

    doGetGuiderInvited = () => {

        let data = {
            comment_id: this.props.comment_id,
            keysearch: "",
            page: 1,
            // comment_id: '1544'

        }
        this.props.getListGuideInvited(data)
            .then(() => {
                this.setState({
                    refreshing: false,
                    isLoadMore: false,
                    page: this.state.page + 1
                })

            })
            .catch(err => {
                this.setState({
                    refreshing: false,
                    isLoadMore: false,
                    page: this.state.page + 1
                })
            })

    }

    onPressBack = () => {
        backScreen(this.props.componentId)
    }

    handleAvatar = (user_id) => {

        const data = { user_id }
        pushToUserProfile(this.props.componentId, data)
    }
    handleChat = (item) => {
        const conversation_id = _.get(item, 'conversation_id')
        const room = {
            user_id: item.user_id,
            name_list: item.display_name,
            conversation_id
        }
        gotoChatScreen(this.props.componentId, room)
    }
    hanleAgentCancel = (item) => {
        Helper.showAlert('', i18next.t('AreYouSureYouWantToCancelThisTourGuideInvitation'),
            [
                { text: i18next.t('No'), onPress: null },
                {
                    text: i18next.t('Yes'), onPress: () => {
                        let data = {
                            comment_id: this.props.comment_id,
                            user_guider_id: item.user_id,
                            action: 'agent-cancel'

                        }
                        this.props.handleAgentCancelInvited(data)
                        SocketManager.sendComment()
                    }
                }
            ])

    }
    handleAgentCanceled = () => {
        Helper.showAlert('', i18next.t('YouHaveCanceledThisInvitation'))
    }

    pullRefresh = () => {
        if (this.state.refreshing === true) {
            return
        }

        this.setState({ refreshing: true }, () => {
            this.doGetGuiderInvited()
        })
    }

    _renderItem = ({ item }) => {
        let status, created_date;

        if (item.invited) {
            status = item.invited.status
            created_date = item.invited.created_date

        }
        return (
            <View style={{
                backgroundColor: '#FFFFFF', marginTop: 10, paddingHorizontal: 10,
                paddingVertical: 10, flexDirection: 'row',
                //justifyContent: 'space-between'
            }}>
                <View style={{
                    // borderWidth: 1, 
                    width: '70%', flexDirection: 'row',
                }}>
                    <View style={{ width: '20%', justifyContent: 'center' }}>
                        <TouchableOpacity
                            onPress={() => this.handleAvatar(item.user_id)}
                        >
                            <Image
                                source={{ uri: item.avatar }}
                                style={{ width: 50, height: 50, borderRadius: 25 }}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginLeft: 10, width: '80%', justifyContent: 'center' }}>
                        <Text
                            style={{
                                fontSize: 16, color: '#000000',
                                // flexWrap: 'wrap' 
                            }}
                            numberOfLines={4}
                        >
                            {item.display_name}</Text>

                        <Text>
                            {created_date}
                        </Text>
                        {
                            status == 'pending' ?
                                <View style={{ marginTop: 5 }}>
                                    <Text>
                                        Chờ Guider xác nhận
                                 </Text>
                                </View> : null
                        }
                        {
                            status == "agreed" ?
                                <View style={{ marginTop: 5 }}>
                                    <Text>
                                        Guide đồng ý tham gia
                                 </Text>
                                </View> : null
                        }
                    </View>
                </View>

                <View style={styles.right_container}>
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
                        status == 'pending' ?
                            <View style={{
                                width: '90%',
                                justifyContent: 'center', marginTop: 7, paddingHorizontal: 10
                            }}>
                                <TouchableOpacity

                                    onPress={() => this.hanleAgentCancel(item)}
                                >
                                    <Text style={{
                                        color: Colors.green_1, textAlign: 'center',
                                        fontSize: 16,
                                        //paddingHorizontal: 25,
                                        paddingVertical: 5,
                                        paddingHorizontal: 5,
                                        borderWidth: 0.5,
                                        borderColor: Colors.green_1,
                                        borderRadius: 5
                                    }}>Hủy mời</Text>
                                </TouchableOpacity>

                            </View>
                            : null
                    }
                    {
                        status == 'agent-cancel' ?
                            <View style={{
                                width: '90%',
                                justifyContent: 'center', marginTop: 7, paddingHorizontal: 15, paddingVertical: 5
                            }}>
                                <TouchableOpacity
                                    onPress={this.handleAgentCanceled}
                                >
                                    <Text style={{
                                        textAlign: 'center',
                                        fontSize: 16,
                                        //paddingHorizontal: 25,
                                        paddingVertical: 5,
                                        backgroundColor: Colors.gray_3, borderRadius: 5
                                    }}>Đã hủy</Text>
                                </TouchableOpacity>

                            </View>
                            : null
                    }
                </View>




            </View>
        )
    }
    _keyExtractor = (item, index) => index.toString();
    loadMore = () => {
        const { refreshing } = this.state

        if (this.state.isLoadMore === true) {
            return
        }
        if (refreshing == false) {
            this.setState({ isLoadMore: true }, () => {
                this.doGetGuiderInvited(null)
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
    render() {
        const { isLoadMore } = this.state
        const { listGuideInvite } = this.props

        return (
            <View>
                <FlatList
                    removeClippedSubviews={false}
                    data={listGuideInvite}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ListFooterComponent={this.renderBottom}
                    onEndReached={this.doGetGuiderInvited}
                    onEndReached={this.loadMore}
                    refreshControl={
                        <RefreshControl
                            onRefresh={this.pullRefresh}
                            refreshing={this.state.refreshing}
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
                                        }}>{i18next.t('NoInvitationGuide')}
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

export default ListGuideInvited;
const styles = StyleSheet.create({
    wrapContent: {
        //flexDirection: 'row',
        //width: "70%",


    },
    text_status: {
        color: '#0F0F0F',

    },
    status_detail: {
        color: "#00CCFF"
    },
    btn_Invail_text: {
        color: '#000000',
        textAlign: 'center',
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: Colors.gray_3,
        borderRadius: 5
    },
    right_container: {
        width: '30%',
        alignContent: 'center',
        justifyContent: 'center',
        // borderWidth: 1
    }
});