import React, { Component } from 'react';
import {
    StyleSheet, View, Text, Image,
    ActivityIndicator, TouchableOpacity, Alert, Platform, FlatList,
    ScrollView, TextInput, KeyboardAvoidingView,
    RefreshControl

} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { ReachabilityView, i18next, Loading } from '../utils'
import { backScreen, pushToUserProfile, gotoChatScreen } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import CommonStyles from '../constants/styles'
import DataManager from '../modules/DataManager'
import HeaderView from '../component/views/HeaderView'
import _ from 'lodash'
import Helper from '../utils/Helper';
import TourItemComponent from './tour-view/TourItemComponent'
import UserItemView from './tour-view/UserItemView';
import SearchBarView from './views/SearchBarView';
import ScreenName from '../config/screens-name'
import FastImage from 'react-native-fast-image'

export default class RequestAddFriendListComponent extends Component {

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
        this.doGetListUserFriend = this.doGetListUserFriend.bind(this)
        this.page = 1;
        this.state = {
            refreshing: false,
            isLoadMore: false,
            keysearch: "",
        }
    }

    componentDidMount() {
        this.setState({
            isLoadMore: true
        })
        this.doGetListUserFriend()
    }


    onPressBack = () => {
        backScreen(this.props.componentId)
    }



    onPressUserProfile = (data) => {

        pushToUserProfile(this.props.componentId, data)
    }

    onPressChatButon = (item) => {

        const conversation_id = _.get(item, 'conversation_id')
        const user_id = _.get(this.props, 'user.me.user_id');
        const room = {
            user_id: user_id,
            name_list: item.display_name,
            conversation_id
        }
        gotoChatScreen(this.props.componentId, room)
    }

    doGetListUserFriend = () => {
        this.props.getRequestAddMeFriend()
            .then(data => {
                this.setState({
                    refreshing: false,
                    isLoadMore: false,
                    searching: false
                })
            })
            .catch(error => {
                this.setState({
                    refreshing: false,
                    isLoadMore: false,
                    searching: false
                })
            });
    }
    renderBottom = () => {
        const { isLoadMore } = this.state
        return (
            <View style={{ height: 40, justifyContent: 'center' }}>
                {isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
            </View>
        )
    }
    pullRefresh = () => {

        if (this.state.refreshing === true) {
            return
        }
        this.setState({ refreshing: true }, () => {
            this.props.getRequestAddMeFriend()
                .then(res => {
                    this.setState({
                        refreshing: false,
                    })
                })
                .catch(err => {
                    this.setState({
                        refreshing: false,
                    })
                })

        })
    }
    render() {
        const { refreshing, isLoadMore } = this.state
        const { data } = this.props.allDataFriend || {}
        let listAddFriend = []
        if (data && data.listFriends) {
            listAddFriend = data.listFriends
        }

        return (
            <View style={styles.container}>

                <HeaderView
                    title={i18next.t('inviteListFriend')}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                    back={true}
                    onPressLeftBarButton={this.onPressBack}>
                </HeaderView>
                {/* {listAddFriend.length == 0 ?
                    <View style={{ flex: 1, marginTop: 90 }}>
                        <Image
                            source={Images.invite_friend_end}
                            style={{ alignSelf: 'center', width: 100, height: 100, tintColor: '#ABABAB' }}
                        ></Image>
                        <Text style={{ marginTop: 10, fontSize: 16, color: '#ABABAB', textAlign: 'center' }}>{i18next.t('ThereIsNoInvitation')}</Text>
                    </View>
                    : */}
                <FlatList
                    ListFooterComponent={this.renderBottom}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={this.pullRefresh}
                        />
                    }
                    data={listAddFriend}
                    renderItem={this.renderItem}
                    addFriend={this.props.addFriend}
                    ListEmptyComponent={
                        <View style={{ flex: 1 }}>
                            {
                                isLoadMore
                                    ?
                                    <View>

                                    </View>
                                    :
                                    <View style={{ flex: 1, marginTop: 90 }}>
                                        <Image
                                            source={Images.invite_friend_end}
                                            style={{ alignSelf: 'center', width: 100, height: 100, tintColor: '#ADBFD1' }}
                                        ></Image>
                                        <Text style={{ marginTop: 10, fontSize: 16, color: '#ADBFD1', textAlign: 'center' }}>{i18next.t('ThereIsNoInvitation')}</Text>
                                    </View>
                            }
                        </View>
                    }
                    removeClippedSubviews={false}
                >

                </FlatList>

                {/* } */}
            </View>
        )
    }
    renderItem = ({ item, index }) => {
        return (
            <FriendItemAdd
                onPressUserProfile={this.onPressUserProfile}
                addFriend={this.props.addFriend}
                item={item}>
            </FriendItemAdd>
        )
    }
    keyExtractor = (item, index) => index.toString();
}
class FriendItemAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: [],
            status: true,
            content: ''
        }
    }
    state = {
        addRequest: true,


    }


    friendConfirmation = () => {
        let data = {
            user_id: this.props.item.user_id,
            type: "friend-accept"
        }
        this.setState({
            status: !this.state.status,
            content: i18next.t('YouHaveBecomeFriends')
        })
        this.props.addFriend(data)
    }
    CancelInvitation = () => {
        let data = {
            user_id: this.props.item.user_id,
            type: "friend-decline"
        }
        this.setState({
            status: !this.state.status,
            content: i18next.t('YouHaveCanceledRequest')
        })
        this.props.addFriend(data)
    }
    nextScreenFriend = () => {
        this.props.onPressUserProfile(this.props.item)
    }
    render() {
        const { item, } = this.props || {}
        let status_add, is_agent = ''
        if (item.status && item.status.text) {
            status_add = item.status.text
        }
        if (item && item.is_agent)
            is_agent = item.is_agent
        return (
            <View style={{ flex: 1, borderBottomWidth: 1, borderColor: '#ebebeb', paddingTop: 5, paddingBottom: 5 }}>
                <View style={styles.container_detail}>
                    <TouchableOpacity style={styles.button_user}
                        onPress={this.nextScreenFriend}>
                        <Image style={styles.avatar_user} source={{ uri: item.avatar }}></Image>

                    </TouchableOpacity>
                    <View style={styles.item_right}>

                        <Text style={styles.name_user}> {item.display_name}</Text>
                        {this.state.status ?
                            <View style={styles.container_button}>
                                <TouchableOpacity
                                    //disabled
                                    onPress={this.friendConfirmation}
                                    style={styles.confirm_left}>
                                    <Text style={styles.style_text}>{i18next.t('Confirm')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.CancelInvitation}
                                    // disabled
                                    style={styles.confirm_right}>
                                    <Text style={styles.style_text_right}>{i18next.t('CancelRequest')}</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={{ marginTop: 10, marginLeft: 7 }}>
                                <Text>{this.state.content}</Text>
                            </View>
                        }
                    </View>
                </View>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white


    },
    container_detail: {
        marginTop: 2,
        flexDirection: 'row',
        padding: 10
    },
    button_user: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar_user: {
        width: 70,
        height: 70,
        borderRadius: 35,

    },
    name_user: {
        color: '#000',
        fontWeight: "500",
        fontSize: 17,
        marginLeft: 0
    },
    confirm_left: {
        padding: 6,
        paddingLeft: 15, paddingRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#2d88ff'
    },
    confirm_right: {


        padding: 6,
        paddingLeft: 15, paddingRight: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderColor: '#e4e6eb',
        backgroundColor: '#e4e6eb',
        marginLeft: 15
    },
    container_button: {
        flexDirection: 'row',
        marginTop: 8
    },
    item_right: {
        marginTop: 5,
        marginLeft: 15,
    },
    style_text: {
        fontSize: 15,
        fontWeight: "600",
        color: '#fff'
    },
    style_text_right: {
        fontSize: 15,
        fontWeight: "600",

    }
});