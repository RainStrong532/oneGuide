



import React, { Component } from 'react'
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native'
import i18next from 'i18next'
import Colors from '../constants/colors';
import { backScreen, pushToUserProfile } from '../navigation'
import HeaderView from '../component/views/HeaderView'
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import Images from '../assets/images';
import { TextInput } from 'react-native';
import { Loading } from '../utils';
export default class InviteMemberComponnet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: [],
            group_id: ''

        }
        this.onChangeTextDelayed = _.debounce(this.onChangeText, 100);
    }
    componentDidMount = () => {
        this.showModleAdd()

    }
    showModleAdd = () => {
        const { listdata } = this.props.data || {}
        if (listdata && listdata.passProps && listdata.passProps.id) {
            group_id = listdata.passProps.id
        }

        this.setState({
            group_id: listdata.passProps.id
        })

        this.props.getUserFriendListAdd(
            { group_id }

        )


    }

    onChangeText = (text) => {


        const { listdata } = this.props.data || {}
        if (listdata && listdata.passProps && listdata.passProps.id) {
            group_id = listdata.passProps.id
        }
        this.setState({
            keysearch: text
        }, () => {
            Loading.showHud()

            this.props.getUserFriendListAdd({ group_id, keysearch: this.state.keysearch })
                .then(data => {
                    // this.doGetFreedays()
                    Loading.hideHud()
                })
        })


    }

    handlePressAnUser = (item) => {
        pushToUserProfile(this.props.parentComponentId, item.item, item.handleShowFriend)
    }



    _keyExtractor = (item) => item.user_id

    _renderItem = ({ item }) => {

        return (
            <FriendItem
                componentId={this.props.componentId}
                inviteFriendMore={this.props.inviteFriendMore}
                group_id={this.state.group_id}
                item={item}
                handlePressAnUser={this.handlePressAnUser}
                addFriend={this.props.addFriend}
            />
        )
    }

    onPressBack = () => {
        backScreen(this.props.componentId)
    }
    render = () => {
        let listFriends
        if (this.props.list_Other) {
            listFriends = this.props.list_Other
        }

        const { friends } = this.props
        return (
            <View style={{ flex: 1 }}>
                <HeaderView
                    title={i18next.t('AddToMember')}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                    back={true}
                    onPressLeftBarButton={this.onPressBack}>
                </HeaderView>
                <View style={styles.serch_}>
                    <View style={{ width: '70%', }}>
                        <TextInput
                            onChangeText={this.onChangeTextDelayed}
                            autoCapitalize="none"
                            placeholder={i18next.t('Search_All_HeaderView')} style={styles.headerTxt} />

                    </View>
                    <View style={{ width: '10%' }}>
                        <TouchableOpacity >
                            <Image style={{ tintColor: Colors.green_1, width: 20, height: 20 }}
                                source={Images.search}></Image>
                        </TouchableOpacity>
                    </View>


                </View>

                <FlatList
                    removeClippedSubviews={false}
                    data={listFriends}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
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

        }
    }
    state = {
        addRequest: true,
        checkboxList: false
    }

    handleSetStateShowInvite = () => {
        let group_id, user_orther_id = '', action = 'invite'
        group_id = this.props.group_id
        user_orther_id = this.props.item.user_id
        this.props.inviteFriendMore({
            group_id, user_orther_id, action
        })

    }
    handleSetStateShowCancel = () => {

        let group_id, user_orther_id = '', action = 'cancel'
        group_id = this.props.group_id
        user_orther_id = this.props.item.user_id
        this.props.inviteFriendMore({
            group_id, user_orther_id, action
        })
    }
    nextScreenUser = () => {

        pushToUserProfile(this.props.componentId, this.props.item)
    }
    handlePressAddFriend = (id) => {
        const data = {
            user_id: id,
            type: 'friend-add'
        }
        this.props.addFriend(data)
        this.setState(currState => ({ addRequest: !currState.addRequest }))
    }
    handlePressCancelFriend = (id) => {
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
        const { item } = this.props || {}

        let status_add = ''
        if (item.status && item.status.text) {
            status_add = item.status.text
        }
        let check_invite_group = item.check_invite_group
        // console.log("tem thanhf vieen ::::::::::::", check_invite_group);
        return (
            <View style={{
                flex: 1, flexDirection: 'row', borderBottomWidth: 1,
                borderColor: '#ebebeb', paddingRight: 15, flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center'
            }}>

                <View style={{ flex: 0.6 }}>

                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}
                        onPress={this.nextScreenUser}
                    >
                        <FastImage
                            source={{ uri: item.avatar }}
                            style={{ width: 50, height: 50, marginLeft: 10, borderRadius: 25, backgroundColor: 'blue' }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        <View style={styles.info}>
                            <Text
                                style={{ marginLeft: 5, fontSize: 16, fontWeight: "500", color: 'black' }}>
                                {item.display_name}
                            </Text>
                        </View>

                    </TouchableOpacity>

                </View>
                <View style={styles.rightView}>
                    {
                        check_invite_group == 'yes' ?

                            <TouchableOpacity
                                onPress={this.handleSetStateShowCancel}
                                style={styles.rightButtonOut}
                            >
                                <Text style={{ fontSize: 16, color: "#9BC2C2" }}>
                                    {i18next.t('invited')} </Text>

                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={this.handleSetStateShowInvite}
                                style={styles.rightButton}
                            >
                                <Image style={{ width: 18, height: 18, tintColor: '#FFF' }} source={Images.ic_add}></Image>
                                <Text style={{ fontSize: 16, color: "white" }}>
                                    {i18next.t('Invite')} </Text>

                            </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({

    headerTxt: {
        fontSize: 14,

    },




    serch_: {
        borderWidth: 1,
        borderRadius: 24,
        borderColor: Colors.green_1,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 10,
        paddingLeft: 10,
        height: 40


    },
    rightView: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center'


    },
    rightButton: {
        // paddingLeft: 2,
        padding: 8,
        paddingLeft: 15,
        paddingRight: 15,
        // width: 60,
        //height: 35,
        borderRadius: 5,
        backgroundColor: '#00a5ba',
        //marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // alignSelf: 'center',
        // alignSelf: 'flex-end'
    },
    rightButtonOut: {
        padding: 8,
        paddingLeft: 15,
        paddingRight: 15,
        // paddingLeft: 3,
        alignSelf: 'center',
        // width: 100,
        //height: 35,
        borderRadius: 5,
        backgroundColor: '#ebebeb',
        //marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // alignSelf: 'center',
        // alignSelf: 'flex-end'
    },

    info: {
        marginLeft: 8,

    },

});


