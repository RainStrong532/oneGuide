// import React, { Component } from 'react'
// import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native'
// import i18next from 'i18next'
// import Colors from '../constants/colors';
// import { pushToUserProfile } from '../navigation'
// import Images from '../assets/images'
// export default class FriendRecomendation extends Component {

//     handlePressAnUser = (item) => {
//         // Move to user profile page depends on user id
//         // this.props.navigate('');


//         pushToUserProfile(this.props.parentComponentId, item.item, item.handleShowFriend)
//     }



//     _keyExtractor = (item) => item.user_id

//     _renderItem = ({ item }) => {
//         return (
//             <FriendItem
//                 item={item}
//                 handlePressAnUser={this.handlePressAnUser}
//                 addFriend={this.props.addFriend}
//             />
//         )
//     }

//     render = () => {
//         const { friends } = this.props


//         return (
//             <View style={styles.wrapListFriend}>
//                 <View style={{ flexDirection: 'row', marginLeft: 15, marginBottom: 15, alignItems: 'center' }}>
//                     <Image style={{ width: 30, height: 25, resizeMode: 'cover' }} source={Images.ic_friends}></Image>
//                     <Text style={styles.headerTxt}>{i18next.t('RecommendFriend')}</Text>
//                 </View>
//                 <FlatList
//                     removeClippedSubviews={false}
//                     data={friends}
//                     keyExtractor={this._keyExtractor}
//                     renderItem={this._renderItem}
//                     horizontal
//                     contentContainerStyle={styles.wrapFriendsFlatList}
//                     showsHorizontalScrollIndicator={false}
//                 />
//             </View>
//         )
//     }
// }
// class FriendItem extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             item: []
//         }
//     }
//     state = {
//         addRequest: true
//     }
//     componentDidMount = () => {
//         if (this.props.item.status.text == 'Thêm bạn bè') {
//             this.setState({
//                 addRequest: true
//             })
//         }
//         if (this.props.item.status.text == 'Hủy kết bạn') {
//             this.setState({
//                 addRequest: false
//             })
//         }
//     }
//     handlePressAddFriend = (id) => {
//         // Dispatch action to call API add friend
//         const data = {
//             user_id: id,
//             type: 'friend-add'
//         }
//         this.props.addFriend(data)
//         this.setState(currState => ({ addRequest: !currState.addRequest }))
//     }
//     handlePressCancelFriend = (id) => {
//         // Dispatch action to call API add friend
//         const data = {
//             user_id: id,
//             type: 'friend-cancel'
//         }
//         this.props.addFriend(data)
//         this.setState(currState => ({ addRequest: !currState.addRequest }))
//     }
//     handleShowFriend = () => {
//         this.setState(currState => ({ addRequest: !currState.addRequest }))
//     }
//     render() {
//         const { item, } = this.props || {}
//         let status_add, is_agent = ''
//         if (item.status && item.status.text) {
//             status_add = item.status.text
//         }
//         if (item && item.is_agent)
//             is_agent = item.is_agent

//         return (
//             <View>
//                 {
//                     status_add == "Bạn bè" ? null :
//                         <View style={styles.wrapUserItem}>
//                             <TouchableOpacity
//                                 onPress={() => {
//                                     this.props.handlePressAnUser({ item: item, handleShowFriend: this.handleShowFriend }
//                                     )
//                                 }}
//                             >
//                                 <Image
//                                     style={styles.avatar}
//                                     source={{ uri: item.avatar ? item.avatar : null }}
//                                     resizeMode="cover"
//                                     borderRadius={5}
//                                 />
//                             </TouchableOpacity>

//                             <TouchableOpacity
//                                 contentContainerStyle={styles.nameBtnContainer}
//                                 style={styles.nameBtn}
//                                 onPress={() => {
//                                     this.props.handlePressAnUser({ item: item, handleShowFriend: this.handleShowFriend }
//                                     )
//                                 }}
//                             >
//                                 <Text
//                                     numberOfLines={1}
//                                     style={styles.nameTxt}>{item.display_name}</Text>
//                             </TouchableOpacity>

//                             {

//                                 this.state.addRequest ?
//                                     <TouchableOpacity
//                                         style={styles.btnAdd}
//                                         onPress={() => this.handlePressAddFriend(item.user_id)}>
//                                         <Image style={styles.icon_add_friend} source={Images.ic_add_friend}></Image>
//                                         <Text
//                                             style={styles.btnText}>{i18next.t('MakeFriend')}</Text>
//                                     </TouchableOpacity>
//                                     :
//                                     <TouchableOpacity
//                                         style={styles.btnAdd}
//                                         onPress={() => this.handlePressCancelFriend(item.user_id)}>
//                                         <Image style={styles.icon_add_friend} source={Images.ic_cancelled}></Image>
//                                         <Text style={styles.btnText}>{i18next.t('CancelFriend')}</Text>
//                                     </TouchableOpacity>
//                             }
//                             {is_agent == "1" ?
//                                 <View style={{ position: 'absolute', top: 5, right: 5, width: 22, height: 22, borderRadius: 11, backgroundColor: '#ebebeb', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
//                                     <Image style={{ alignSelf: 'center' }}
//                                         source={Images.logo_flag_header}
//                                         resizeMode='contain'
//                                         style={{ width: 15, height: 15 }}
//                                     >
//                                     </Image>
//                                 </View>
//                                 : null
//                             }
//                         </View>

//                 }
//             </View>
//         )
//     }

// }

// const styles = StyleSheet.create({
//     wrapListFriend: {
//         // height: 260,
//         // backgroundColor: '#D9D9D9',
//         // backgroundColor: '#fff',
//         justifyContent: 'center',
//         paddingVertical: 5,
//         marginTop: 5,
//     },
//     headerTxt: {
//         fontSize: 19,
//         fontWeight: 'bold',
//         marginLeft: 3,
//         color: 'black'
//     },
//     wrapFriendsFlatList: {
//         alignItems: 'center',
//         paddingRight: 10, // Create space for last item
//     },
//     wrapUserItem: {
//         backgroundColor: '#fff',
//         marginLeft: 5,
//         marginRight: 5,
//         borderWidth: 1,
//         borderColor: '#ebebeb',
//         borderRadius: 8,
//         marginBottom: 10,
//         padding: 8.5,


//         // shadowColor: "#000",
//         // shadowOffset: {
//         //     width: 0,
//         //     height: 1,
//         // },
//         // shadowOpacity: 0.22,
//         // shadowRadius: 2.22,

//         // elevation: 3,
//     },
//     wrapInfo: {
//         justifyContent: 'center',
//         marginVertical: 5,
//         flex: 1,
//     },
//     typeIcon: {
//         width: 30,
//         height: 30,
//     },
//     avatar: {
//         marginTop: 10,
//         width: 70,
//         height: 70,
//         alignSelf: 'center'
//     },
//     btnAdd: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',

//         //backgroundColor: Colors.green_1,
//         borderRadius: 4,
//         height: 30,
//         margin: 5,
//         backgroundColor: '#F2F3F4'
//     },
//     icon_add_friend: {
//         width: 16,
//         height: 16,
//         tintColor: '#1B2631',
//         resizeMode: 'cover'
//     },
//     btnCancel: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'grey',
//         borderRadius: 4,
//         height: 30,
//         margin: 5
//     },
//     nameBtnContainer: {
//         flex: 1,
//     },
//     nameBtn: {
//         justifyContent: 'center',
//         marginVertical: 5,
//     },
//     nameTxt: {
//         fontSize: 14,
//         color: 'black',
//         width: 125,
//         textAlign: 'center',
//         fontWeight: '600',
//         marginTop: 3,
//         marginBottom: 3

//     },
//     btnText: {
//         marginLeft: 3,
//         fontSize: 14,
//         color: '#1B2631',

//     },

// });







import React, { Component } from 'react'
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Dimensions, ImageBackground } from 'react-native'
import i18next from 'i18next'
import Colors from '../constants/colors';
import { pushToUserProfile } from '../navigation'
import Images from '../assets/images'
export default class FriendRecomendation extends Component {

    handlePressAnUser = (item) => {
        // Move to user profile page depends on user id
        // this.props.navigate('');


        pushToUserProfile(this.props.parentComponentId, item.item, item.handleShowFriend)
    }



    _keyExtractor = (item) => item.user_id

    _renderItem = ({ item }) => {
        return (
            <FriendItem
                item={item}
                handlePressAnUser={this.handlePressAnUser}
                addFriend={this.props.addFriend}
            />
        )
    }

    render = () => {
        const { friends } = this.props


        return (
            <View style={styles.wrapListFriend}>
                <View style={{ flexDirection: 'row', marginLeft: 15, marginBottom: 15, alignItems: 'center' }}>
                    <Image style={{ width: 24, height: 20, resizeMode: 'contain' }} source={Images.ic_friends}></Image>
                    <Text style={styles.headerTxt}>{i18next.t('RecommendFriend')}</Text>
                </View>
                <FlatList
                    removeClippedSubviews={false}
                    data={friends}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    horizontal
                    contentContainerStyle={styles.wrapFriendsFlatList}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }
}
class FriendItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: [],
            screenWidthShare: Dimensions.get('window').width / 3.45,
            screenHeightShare: Dimensions.get('window').height / 6.7,
        }
    }
    state = {
        addRequest: true
    }
    componentDidMount = () => {
        if (this.props.item.status.text == 'Thêm bạn bè') {
            this.setState({
                addRequest: true
            })
        }
        if (this.props.item.status.text == 'Hủy kết bạn') {
            this.setState({
                addRequest: false
            })
        }
    }
    handlePressAddFriend = (id) => {
        // Dispatch action to call API add friend
        const data = {
            user_id: id,
            type: 'friend-add'
        }
        this.props.addFriend(data)
        this.setState(currState => ({ addRequest: !currState.addRequest }))
    }
    handlePressCancelFriend = (id) => {
        // Dispatch action to call API add friend
        const data = {
            user_id: id,
            type: 'friend-cancel'
        }
        this.props.addFriend(data)
        this.setState(currState => ({ addRequest: !currState.addRequest }))
    }
    handleShowFriend = () => {
        this.setState(currState => ({ addRequest: !currState.addRequest }))
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
            <View>
                {
                    status_add == "Bạn bè" ? null :
                        <View style={{

                            backgroundColor: '#fff',
                            // marginHorizontal: 5,
                            marginLeft: 5,
                            // // marginRight: 5,
                            borderWidth: 1,
                            borderColor: '#ebebeb',
                            borderRadius: 8,
                            marginBottom: 10,
                            // padding: 8.5,
                        }
                            // styles.wrapUserItem
                        }>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.handlePressAnUser({ item: item, handleShowFriend: this.handleShowFriend }
                                    )
                                }}

                                style={{
                                    borderTopLeftRadius: 5,
                                    borderTopRightRadius: 5,
                                    // borderRadius: 5,
                                    width: 110,
                                    // height: 90
                                    height: 100,
                                }}
                            >
                                <Image
                                    style={{
                                        // borderRadius: 5,
                                        borderTopLeftRadius: 5,
                                        borderTopRightRadius: 5,
                                        flex: 1
                                    }
                                        // styles.avatar
                                    }
                                    source={{ uri: item.avatar ? item.avatar : null }}
                                    // resizeMode="cover"
                                    resizeMode="cover"
                                // borderRadius={5}
                                // borderTopRightRadius={5}
                                // borderTopLeftRadius={5}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    width: 110,
                                    paddingHorizontal: 10,
                                    // paddingVertical: 5,
                                    paddingBottom: 4,
                                    paddingTop: 8,
                                    justifyContent: 'center',
                                    // marginVertical: 10,
                                }}
                                contentContainerStyle={styles.nameBtnContainer}
                                // style={styles.nameBtn}
                                onPress={() => {
                                    this.props.handlePressAnUser({ item: item, handleShowFriend: this.handleShowFriend }
                                    )
                                }}
                            >
                                <Text
                                    numberOfLines={1}
                                    style={styles.nameTxt}>{item.display_name}</Text>
                            </TouchableOpacity>

                            {

                                this.state.addRequest ?
                                    <TouchableOpacity
                                        style={
                                            styles.btnAdd
                                        }
                                        onPress={() => this.handlePressAddFriend(item.user_id)}>
                                        <Image style={styles.icon_add_friend} source={Images.ic_add_friend}></Image>
                                        <Text
                                            style={styles.btnText}>{i18next.t('MakeFriend')}</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        style={
                                            styles.btnAdd
                                        }
                                        onPress={() => this.handlePressCancelFriend(item.user_id)}>
                                        <Image style={styles.icon_add_friend} source={Images.ic_cancelled}></Image>
                                        <Text style={styles.btnText}>{i18next.t('Cancel')}</Text>
                                    </TouchableOpacity>
                            }
                            {is_agent == "1" ?
                                <View style={{
                                    position: 'absolute', top: 5, right: 5,
                                    // width: 22, height: 22,
                                    //  borderRadius: 11, 
                                    // backgroundColor: '#ebebeb',
                                    justifyContent: 'center', alignItems: 'center', flexDirection: 'row'
                                }}>
                                    <Image style={{ alignSelf: 'center' }}
                                        source={Images.logo_flag_header}
                                        resizeMode='contain'
                                        style={{ width: 18, height: 18 }}
                                    >
                                    </Image>
                                </View>
                                : null
                            }
                        </View>

                }
            </View>
        )
    }

}

const styles = StyleSheet.create({
    wrapListFriend: {
        // height: 260,
        // backgroundColor: '#D9D9D9',
        // backgroundColor: '#fff',
        justifyContent: 'center',
        paddingVertical: 5,
        marginTop: 5,
    },
    headerTxt: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
        color: 'black'
    },
    wrapFriendsFlatList: {
        alignItems: 'center',
        paddingRight: 10, // Create space for last item
    },
    wrapUserItem: {
        backgroundColor: '#fff',
        marginLeft: 5,
        marginRight: 5,
        borderWidth: 1,
        borderColor: '#ebebeb',
        borderRadius: 8,
        marginBottom: 10,
        padding: 8.5,


        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 1,
        // },
        // shadowOpacity: 0.22,
        // shadowRadius: 2.22,

        // elevation: 3,
    },
    wrapInfo: {
        justifyContent: 'center',
        marginVertical: 5,
        flex: 1,
    },
    typeIcon: {
        width: 30,
        height: 30,
    },
    avatar: {
        // marginTop: 10,
        width: "100%",
        height: "50%",
        alignSelf: 'center'
    },
    btnAdd: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        //backgroundColor: Colors.green_1,
        borderRadius: 4,
        height: 30,
        margin: 8,
        backgroundColor: '#F2F3F4'
    },
    icon_add_friend: {
        width: 16,
        height: 16,
        tintColor: '#1B2631',
        resizeMode: 'cover'
    },
    btnCancel: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'grey',
        borderRadius: 4,
        height: 30,
        margin: 5
    },
    nameBtnContainer: {
        flex: 1,
    },
    nameBtn: {
        justifyContent: 'center',
        marginVertical: 5,
    },
    nameTxt: {
        // fontSize: 14,
        color: 'black',
        // width: 125,
        textAlign: 'center',
        fontWeight: '500',
        // marginTop: 3,
        // marginBottom: 3,
        // margin: 5

    },
    btnText: {
        marginLeft: 3,
        fontSize: 14,
        color: '#1B2631',

    },

});


