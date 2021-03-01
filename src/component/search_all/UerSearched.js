import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import { i18next, Loading } from '../../utils'
import _ from 'lodash';
import {
    pushToUserProfile,
    gotoChatScreen,
    showActionSheet
} from '../../navigation'

export default class UserSearched extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user: []
        }
    }

    render() {
        let { user } = this.props
        let listUser
        if (user) {
            listUser = user.map((item, index) => {
                let room = {
                    user_id: item.user_id,
                    name_list: item.username,
                    conversation_id: item.conversation_id
                }
                let friend_type = item.check_friend.type
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
                    <View style={styles.tast_list} key={index}>
                        <TouchableOpacity
                            onPress={() => pushToUserProfile(this.props.componentId, item)}
                            style={styles.body_View}>
                            <View style={styles.body_View1}>
                                <View style={styles.image_header}>
                                    <View
                                    >
                                        <View style={styles.personalPhoto}
                                        // onPress={this.test_OnClick}
                                        >
                                            <Image style={styles.image_header_personalPhoto}
                                                // source={Images.image_bacc}
                                                source={{ uri: item.avatar }}
                                            // source={{ uri: isMe && avatarWall ? avatarWall : avatar }}
                                            ></Image>
                                        </View>
                                        {
                                            item.is_agent === "1" ?
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
                                <Text style={{ fontWeight: "500", fontSize: 15 }}> {item.username}</Text>
                                <Text style={{ marginLeft: 8 }}>{item.email}</Text>
                            </View>
                        </TouchableOpacity>
                        <View>
                            {
                                item.check_friend.type === 'friend'
                                    ?
                                    <TouchableOpacity
                                        //style={{backgroundColor:'grey'}}
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
                                        onPress={() => this.props.onPressFriend(item)}
                                    >
                                        <Image
                                            source={friend_icon}
                                            style={{ width: 30, height: 30, alignSelf: 'center', marginTop: 10, tintColor: friend_color }}
                                        />
                                    </TouchableOpacity>
                            }
                        </View>
                    </View>
                )
            })
        }



        return (
            <View>
                {listUser}
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
        borderBottomColor: '#D8D8D8',
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
        padding: 13,
        backgroundColor: Colors.green_1,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 10
    },
    body_View1: {
        marginBottom: 10
    }
});