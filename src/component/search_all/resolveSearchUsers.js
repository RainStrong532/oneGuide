import React, { Component } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import {
    pushToUserProfile,
    gotoChatScreen,
    showActionSheet, gotoSearchAllUser
} from '../../navigation'
import { i18next, Loading } from '../../utils'
import _ from 'lodash';
import UserSearched from './UerSearched'

class resolveSearchUsers extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user: null,
        }
    }

    componentDidMount() {

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
        const other_user = user
        this.props.addFriend(data)
            .then(response => {
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


    render() {
        let users
        if (this.props.data) {
            users = this.props.data
        }
        let totalUser
        if (this.props.totalUser) {
            totalUser = this.props.totalUser
        }
        return (
            <View>
                {
                    users.length != 0
                        // ||usersArray!=[]
                        ?
                        <View style={styles.container}>
                            <Text style={styles.text_header}>
                                {i18next.t('People')}
                            </Text>
                            {/* <FlatList
                                data={users}
                                renderItem={this.renderItem}
                            /> */}
                            <UserSearched
                                componentId={this.props.componentId}
                                user={users}
                                onPressFriend={this.onPressFriend}
                            />
                            <TouchableOpacity
                                onPress={() => gotoSearchAllUser(this.props.componentId, { textSearch: this.props.textSearch, onPressFriend: this.onPressFriend })}
                                style={styles.fullFriend}>
                                <Text
                                    style={{ textAlign: 'center', fontSize: 16, color: '#1B2631' }}
                                >{i18next.t('SeeMoreFriends')}</Text>
                            </TouchableOpacity>
                            <View
                                style={{ marginTop: 10, marginBottom: 10 }}
                            />
                        </View>
                        :
                        null
                }
            </View>
        );
    }
}


export default resolveSearchUsers;
const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.white,
        // //    marginTop:8,
        // marginLeft: 8,
        // marginRight: 8,
        // marginBottom: 8
        margin: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#C3C4C4'
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
        borderBottomColor: Colors.gray_4,
        borderBottomWidth: 1,
    },
    tast_list: {
        backgroundColor: Colors.white,
        padding: 10,
        flexDirection: "row"
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
        padding: 8,
        backgroundColor: '#F2F3F4',
        width: '90%',
        alignSelf: 'center',
        borderRadius: 5,
        marginTop: 10
    }
});