import React, { Component } from 'react';
import {
    View, Text, ImageBackground, TouchableOpacity, TextInput,
    StyleSheet, Image, ScrollView, FlatList, Modal, ActivityIndicator, RefreshControl
} from 'react-native';
import {
    backScreen, pushToUserProfile
} from '../navigation';
import Images from '../assets/images';
import { ReachabilityView, i18next } from '../utils';
import Colors from '../constants/colors';
import HeaderView from '../component/views/HeaderView'
import { dimissModal, showModalCancelBackGroup } from '../navigation'
class AskedToJoinTheGroupComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSearch: false,
            refreshing: false,
            data: [],
            isLoadMore: true
        }
        this.page = 1
    }
    componentDidMount = () => {
        this.setState({ isLoadMore: true })
        this.doGetListInviteGroup()

    }
    doGetListInviteGroup = (data_, page) => {

        this.props.getToJoinGroup(this.props.data)
            .then(data => {
                // this.page = page.page + 1
                this.setState({
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
    onPressBack = () => {
        const callback = () => {
            dimissModal(this.props.componentId)
        }
        showModalCancelBackGroup(callback)
    }
    confirm = (id_group, user_id, action) => {

        this.props.confirm_Request(id_group, user_id, action)
    }
    delete = (id_group, user_id, action) => {

        this.props.confirm_Request(id_group, user_id, action)
    }

    showUserId = (user_id) => {
        pushToUserProfile(this.props.componentId, { user_id })
    }

    renderMember_Appoval = ({ item }) => {
        let user_id = item.user_id
        let set_Status = item.status
        return (
            <View>
                <View style={styles.container_detail}>
                    <TouchableOpacity
                        onPress={() => {
                            if (item) {
                                this.showUserId(user_id)
                            }
                        }
                        }
                        style={styles.button_user}>
                        <Image style={styles.avatar_user} source={{ uri: item.avatar }}></Image>

                    </TouchableOpacity>
                    <View style={styles.item_right}>
                        <TouchableOpacity
                            onPress={() => {
                                if (item) {
                                    this.showUserId(user_id)
                                }
                            }
                            }
                        >
                            <Text numberOfLines={1} style={styles.name_user}> {item.username}</Text>
                        </TouchableOpacity>

                        {set_Status == 'pending' ?
                            <View style={styles.container_button}>
                                <TouchableOpacity
                                    //disabled
                                    onPress={() => this.confirm(this.props.data, user_id, 'confirm')}
                                    style={styles.confirm_left}>
                                    <Text style={styles.style_text}>{i18next.t('Confirm')}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => this.delete(this.props.data, user_id, 'delete')}
                                    // disabled
                                    style={styles.confirm_right}>
                                    <Text style={styles.style_text_right}>{i18next.t('CancelRequest')}</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            set_Status == 'Xác nhận thành công' ?
                                <View style={{ marginTop: 10, marginLeft: 7 }}>
                                    <Text>{i18next.t('SuccessfulConfirmation')}</Text>
                                </View>
                                :

                                <View style={{ marginTop: 10, marginLeft: 7 }}>
                                    <Text>{i18next.t('CanceledSuccessfully')}</Text>
                                </View>
                        }


                    </View>

                </View>
            </View>
        )
    }
    _keyExtractor = (item, idx) => idx.toString()
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
                this.doGetListInviteGroup()
            })
        }
    }
    pullRefresh = () => {
        const { refreshing, isLoadMore } = this.state;
        if (refreshing) {
            return
        }
        this.page = 1;
        if (isLoadMore == false) {
            this.setState({ refreshing: true }, () => {
                this.doGetListInviteGroup()
            })
        }
    }
    render() {
        let id_Group
        if (this.props.data) {
            id_Group = this.props.data
        }
        let appoval_member = []
        if (this.props.list_Member) {
            appoval_member = this.props.list_Member
        }
        let status_Request = this.props.status_Request
        const { isLoadMore, refreshing } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>

                <HeaderView
                    back={true}
                    onPressLeftBarButton={this.onPressBack}
                    title={i18next.t('ConfirmGroupRequestToJoin')}

                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                >
                </HeaderView>
                <FlatList
                    removeClippedSubviews={false}
                    data={appoval_member}
                    renderItem={this.renderMember_Appoval}
                    keyExtractor={this._keyExtractor}
                    onEndReached={this.doGetListInviteGroup}
                    ListFooterComponent={this.renderBottom}
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
                                        }}>{i18next.t('Therearenorequests')}
                                        </Text>
                                    </View>
                            }
                        </View>
                    }
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
export default AskedToJoinTheGroupComponent;
const styles = StyleSheet.create({
    title: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_title: {
        fontSize: 20,
        fontWeight: "600",
        color: '#000'

    },
    container_detail: {
        marginTop: 5,
        flexDirection: 'row',
        padding: 5,
        borderBottomColor: '#BFC9CA',
        borderBottomWidth: 0.5
    },
    button_user: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar_user: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
    },
    name_user: {
        fontWeight: "500",
        fontSize: 18,
        marginLeft: 0
    },
    confirm_left: {
        paddingHorizontal: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#00acc2',
    },
    confirm_right: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#999999',
        marginLeft: 10
    },
    container_button: {
        flexDirection: 'row',
        marginTop: 6,
        margin: 5

    },
    item_right: {
        marginTop: 5,
        marginLeft: 15,
        marginRight: 15
    },
    style_text: {
        fontSize: 15,
        fontWeight: "600",
        color: '#00acc2'
    },
    style_text_right: {
        fontSize: 15,
        fontWeight: "600",
        color: '#999999'

    }

})