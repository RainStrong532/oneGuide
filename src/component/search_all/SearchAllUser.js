import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, RefreshControl } from 'react-native'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import { i18next, Loading } from '../../utils'
import _ from 'lodash';
import {
    pushToUserProfile,
    gotoChatScreen,
    showActionSheet,
    backScreen
} from '../../navigation'
import HeaderView from '../views/HeaderView'
import { FlatList } from 'react-native-gesture-handler'

export default class SearchAllUser extends Component {

    constructor(props) {
        super(props)
        // this.renderBottom = this.renderBottom.bind(this)
        this.page = 1
        this.state = {
            data: [],
            isLoadMore: true,
            refreshing: false,
        }
    }

    componentDidMount() {
        this.doGetFriend(this.page)
    }

    componentDidAppear() {
        if (!this.didAppearFirst) {
            this.didAppearFirst = true

            this.doGetFriend(this.page)

            //   if (!this.conversation_id) {
            //     this.doCreateChatroom()
            //   }
        }
    }

    onPressBack = () => {
        backScreen(this.props.componentId)
    }

    onPressFriend = (item) => {
        // console.log('item onpress+++++++++ + + +', item);
        // this.setState({
        //     user: item
        // })
        const friend_type = item.check_friend.type
        if (!friend_type) {
            return
        }

        if (friend_type === 'friend-decline' ||
            friend_type === 'decline') {
            return
        }

        if (friend_type === 'friend') {
            this.showRemove(item)
        } else
            if (friend_type === 'not-friend') {

                const type = 'friend-add'
                const user_id = item.user_id
                const data = {
                    user_id,
                    type
                }

                this.doAddFriend(data, item)
            } else if (friend_type === 'friend-send') {
                this.showCancel(item)
            } else if (friend_type === 'friend-watting') {
                this.showAcceptOrDecline(item)
            }
    }

    showCancel = (item) => {
        const callback = (index) => {
            let type = ''
            // accept
            if (index === 0) {
                type = 'friend-cancel'
            }

            if (type) {
                const user_id = item.user_id
                const data = {
                    user_id,
                    type
                }

                this.doAddFriend(data, item)
            }

        }
        const buttons = [i18next.t('CancelFriend')]
        showActionSheet(buttons, callback)
    }

    showAcceptOrDecline = (item) => {
        const callback = (index) => {
            let type = ''
            // accept
            if (index === 0) {
                type = 'friend-accept'
            } else {
                type = 'friend-decline'
            }

            // call api
            if (type) {
                const user_id = item.user_id
                const data = {
                    user_id,
                    type
                }

                this.doAddFriend(data, item)
            }
        }
        const buttons = [i18next.t('Agree'), i18next.t('Decline')]
        showActionSheet(buttons, callback)
    }

    showRemove = (item) => {
        const callback = (index) => {
            let type = ''
            // accept
            if (index === 0) {
                type = 'friend-remove'
            }

            if (type) {
                const user_id = item.user_id
                const data = {
                    user_id,
                    type
                }

                this.doAddFriend(data, item)
            }

        }
        const buttons = [i18next.t('RemoveFriend')]
        showActionSheet(buttons, callback)
    }

    doAddFriend = (data, user) => {

        // console.log('data kết bạn', data, user);
        const other_user = user
        this.props.addFriend(data)
            .then(response => {
                // console.log('search ra response', response);
                const status = _.get(response, 'status')
                const friend_type = _.get(response, 'type')

                if (status === 'RESULT_OK') {

                    let type = ''
                    // let follow = null
                    if (friend_type === 'friend-add') {
                        type = 'friend-send'
                    } else if (friend_type === 'friend-remove') {
                        type = 'not-friend'
                        // follow = 'Not Follow'
                    } else if (friend_type === 'friend-decline') {
                        type = 'not-friend'
                    } else if (friend_type === 'friend-cancel') {
                        type = 'not-friend'
                    } else if (friend_type === 'friend-accept') {
                        type = 'friend'
                        // follow = 'Follow'
                    }

                    if (type) {
                        const user = other_user
                        user.check_friend.type = type
                        // other_user.follow = follow || other_user.follow
                        this.setState({ user })
                    }

                }


            })
            .catch(error => {
            });
    }

    doGetFriend = (page) => {
        const textSearch = this.props.passProps.textSearch
        // const { passProps } = this.props || {}
        // if (passProps && passProps.textSearch) textSearch = passProps.textSearch
        // const data = {
        //     textSearch
        // }
        // request
        this.props.SearchAllUser(textSearch, page)
            .then(data => {

                this.page = page + 1
                this.setState({
                    data: data,
                    refreshing: false,
                    isLoadMore: false
                })
            })
            .catch(error => {
                this.setState({
                    refreshing: false,
                    isLoadMore: false
                })
            });
    }

    loadMore = () => {

        // console.log('bdbdbdbdbdbdb');
        if (this.state.isLoadMore === true) {
            // console.log('=== = = = -sấdj');
            return
        }

        this.setState({ isLoadMore: true }, () => {
            // console.log(' - - - - - - - -');
            this.doGetFriend(this.page)
        })
    }

    renderItem = (item, index) => {
        // console.log('render item user', item);
        let user = item.item
        let room = {
            user_id: user.user_id,
            name_list: user.username,
            conversation_id: user.conversation_id
        }
        let friend_type = user.check_friend.type
        let friend_icon = Images.ic_friend
        let friend_color = Colors.gray
        // let friend_title = i18next.t('Friend')
        if (friend_type === 'friend') {
            friend_color = Colors.blue
            // friend_title = i18next.t('Friend')

        } else if (friend_type === 'not-friend') {
            // friend_title = i18next.t('AddFriend')
            friend_icon = Images.ic_add_friend

        } else if (friend_type === 'friend-send') {
            friend_color = Colors.blue
            // friend_title = i18next.t('WaitingAccept')
            friend_icon = Images.ic_add_friend

        } else if (friend_type === 'friend-watting') {
            friend_icon = Images.ic_add_friend
            // friend_title = i18next.t('AcceptFriend')

        } else if (friend_type === 'friend-decline') {
            friend_icon = Images.ic_add_friend
            // friend_title = i18next.t('FriendDecline')

        } else if (friend_type === 'decline') {
            friend_icon = Images.ic_add_friend
            // friend_title = i18next.t('DeclineFriend')
        }
        return (
            <View style={styles.tast_list}>
                <TouchableOpacity
                    onPress={() => pushToUserProfile(this.props.componentId, user)}
                    style={styles.body_View}>
                    <View style={{
                        marginBottom: 10
                    }}>
                        <View style={styles.image_header}>
                            <View
                            >
                                <View style={styles.personalPhoto}
                                // onPress={this.test_OnClick}
                                >
                                    <Image style={styles.image_header_personalPhoto}
                                        // source={Images.image_bacc}
                                        source={{ uri: user.avatar }}
                                    // source={{ uri: isMe && avatarWall ? avatarWall : avatar }}
                                    ></Image>
                                </View>
                                {
                                    user.is_agent === "1" ?
                                        <View style={styles.logo_image_right}>
                                            <Image
                                                source={Images.logo_flag_header}
                                                resizeMode='contain'
                                                style={{ width: 15, height: 15 }}
                                            />
                                        </View>
                                        :
                                        null
                                }
                            </View>
                        </View>
                    </View>
                    <View style={styles.body_View2}>
                        <Text style={{ fontWeight: "500", fontSize: 15 }}> {user.username}</Text>
                        <Text style={{ marginLeft: 8 }}>{user.email}</Text>
                    </View>
                </TouchableOpacity>
                <View>
                    {
                        user.check_friend.type === 'friend'
                            ?
                            <TouchableOpacity
                                onPress={() => gotoChatScreen(this.props.componentId, room)}
                            >
                                <Image
                                    source={Images.icon_chat_end}
                                    style={{
                                        width: 30,
                                        height: 30,
                                        tintColor: Colors.gray
                                    }}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={() => this.onPressFriend(user)}
                            >
                                <Image
                                    source={friend_icon}
                                    style={{ width: 30, height: 30, alignSelf: 'center', marginTop: 4, tintColor: friend_color }}
                                />
                            </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }





    render() {
        // let { totalUser } = this.props
        let totalUser = []
        if (this.state.data) {
            totalUser = this.state.data.users
        }
        // console.log('haizz haizz', totalUser);

        return (
            <View style={{ flex: 1 }}>
                <HeaderView
                    title={i18next.t('FriendsList')}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                    back={true}
                    onPressLeftBarButton={this.onPressBack}
                />
                {/* <ScrollView
                // style={{ marginBottom: 100 }}
                > */}
                <FlatList
                    removeClippedSubviews={false}
                    data={totalUser}
                    renderItem={this.renderItem}
                    onEndReached={this.loadMore}
                    // refreshing={this.state.refreshing}
                    // onEndReachedThreshold={0.}
                    ListFooterComponent={this.renderBottom}
                    ListEmptyComponent={this.renderEmpty}
                    // style={{ marginBottom: 70 }}
                    // onRefresh={this.pullRefresh}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.pullRefresh}
                        />
                    }
                />
                {/* </ScrollView> */}
            </View>
        )
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

    pullRefresh = () => {
        if (this.state.refreshing === true) {
            return
        }

        this.setState({ refreshing: true }, () => {
            this.doGetFriend(1)
        })
    }

    renderBottom = () => {
        // const isLoadMore = this.state.isLoadMore
        // console.log(this.state.isLoadMore, "dfjgkdfjg");
        return (
            <View style={{ height: 40, justifyContent: 'center' }}>
                {this.state.isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.white,
        //    marginTop:8,
        marginLeft: 8,
        marginRight: 8,
        marginBottom: 8
    },
    component: {
        flex: 1,
        backgroundColor: "white"
    },
    text_header: {
        fontSize: 18,
        margin: 15,
        fontWeight: '700'
    },
    body_View: {
        flex: 1,
        flexDirection: 'row',
        borderBottomColor: Colors.gray_1,
        borderBottomWidth: 1,
    },
    tast_list: {
        backgroundColor: Colors.white,
        padding: 10,
        flexDirection: "row",
        // marginTop: 10,
        // marginBottom: 10
    },

    image_header: {
        width: 46,
        height: 46,
        borderRadius: 25,
    },
    body_View2: {
        flex: 1,
        marginLeft: 10
    },
    personalPhoto: {
        //     position: 'absolute',
        //     // height: 42,
        //     // width: 42,
        //     // left: 15,
        //     // right: 5,
    },
    image_header_personalPhoto: {
        height: 42,
        width: 42,
        borderRadius: 21,
        overflow: 'hidden',
    },
    logo_image_right: {
        position: 'absolute',
        top: 26,
        left: 30,
    },
    fullFriend: {
        padding: 13,
        backgroundColor: Colors.green_1,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 10
    }
});


// import React, { Component } from 'react'
// import { View, FlatList } from 'react-native'
// // import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
// import Colors from '../../constants/colors'
// import Images from '../../assets/images'
// import { i18next, Loading } from '../../utils'
// import _ from 'lodash';
// import {
//     pushToUserProfile,
//     gotoChatScreen,
//     showActionSheet
// } from '../../navigation'
// import UserSearched from './UerSearched'

// export default class SearchAllUser extends Component {
//     render() {
//         return (
//             <View>
//                 <UserSearched
//                     user={this.props.passProps.totalUser}
//                 />
//             </View>
//         )
//     }
// }