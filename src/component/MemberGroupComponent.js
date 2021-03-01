import React, { Component } from 'react';
import {
    View, Text, ImageBackground, TouchableOpacity, TextInput,
    StyleSheet, Image, ScrollView, FlatList, Modal, RefreshControl, ActivityIndicator, Platform
} from 'react-native';
import {
    backScreen, dimissModal, showModalCancelPost, dimissOverlay, showModalCancelBackGroup, pushToUserProfile
} from '../navigation';
import Images from '../assets/images';
import { ReachabilityView, i18next } from '../utils';
import Colors from '../constants/colors';
import HeaderView from '../component/views/HeaderView'

class MemberGroupComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoadMore: true,
            refreshing: false,
        }
        this.page = 1
    }

    showUserId = (user_id) => {
        pushToUserProfile(this.props.componentId, { user_id })
    }

    renderListMember_Group = ({ item }) => {
        const { avatar, check_admin, username, user_id } = item || ''
        return (
            <View style={{ flex: 1, borderBottomColor: '#F1F7F5', borderBottomWidth: 2, paddingBottom: 5 }}>
                <View style={styles.container_detail}>
                    <TouchableOpacity
                        onPress={() => {
                            if (item) {
                                this.showUserId(user_id)
                            }
                        }
                        }
                        style={styles.button_user}>
                        <Image style={styles.avatar_user} source={{ uri: avatar }}></Image>

                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            if (item) {
                                this.showUserId(user_id)
                            }
                        }
                        }
                        style={styles.item_right}>
                        <Text numberOfLines={2} style={styles.name_user}>{username}</Text>
                        {
                            check_admin == 'yes' ?
                                <Text style={{ fontSize: 12, marginTop: 3, color: Colors.blue_1 }}>{i18next.t('Administrators')} </Text> :
                                <Text style={{ fontSize: 12, marginTop: 3 }}>{i18next.t('Memberv')} </Text>
                        }

                    </TouchableOpacity>

                </View>
            </View>
        )

    }
    componentDidMount = () => {
        // console.log(' this.doGetMember(this.props.data, 1)', this.props.data);
        //this.setState({ hasScrolled: true })
        this.doGetMember(this.props.data, 1)

    }

    doGetMember = (id_group, page) => {

        this.props.getMemberGroup(id_group, page)
            .then(data => {
                this.page = page + 1
                this.setState({
                    // data: data,
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
        if (this.state.isLoadMore === true) {
            return
        }

        this.setState({ isLoadMore: true }, () => {
            this.doGetMember(this.props.data, this.page)
        })
    }

    onPressBack = () => {
        // return dimissOverlay(this.props.componentId)
        const callback = () => {
            dimissModal(this.props.componentId)
        }
        showModalCancelBackGroup(callback)
        //backScreen(this.props.data.data.Component_id, null)
    }

    renderBottom = () => {
        const { isLoadMore } = this.state
        // const isLoadMore = this.state.isLoadMore
        // console.log(this.state.isLoadMore, "dfjgkdfjg");
        return (
            <View style={{ height: 40, justifyContent: 'center' }}>
                {isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
            </View>
        )
    }
    pullRefresh = () => {
        const { data } = this.props || ""
        const { refreshing } = this.state;
        if (refreshing) {
            return
        }
        this.page = 1;
        this.setState({ refreshing: true }, () => {

            this.doGetMember(data, this.page)

        })
    }
    render() {
        const { refreshing } = this.state
        let id_Group
        if (this.props.data) {
            id_Group = this.props.data
        }
        let list_Members
        if (this.props.listMembers) {
            list_Members = this.props.listMembers
        }
        return (
            <View style={{ flex: 1, marginBottom: 70 }}>
                <View>
                    <HeaderView
                        back={true}
                        onPressLeftBarButton={this.onPressBack}
                        title={i18next.t('Memberv')}

                        tintColor={Colors.white}
                        style={{ backgroundColor: Colors.green_1 }}
                    ></HeaderView>

                    <FlatList
                        removeClippedSubviews={false}
                        onEndReached={this.doGetMember}
                        data={list_Members}
                        renderItem={this.renderListMember_Group}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={this.pullRefresh}
                            />
                        }
                        onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 10}
                        onEndReached={this.loadMore}
                        ListFooterComponent={this.renderBottom}
                    // componentDidMount={this.componentDidMount}
                    />

                </View>
            </View>
        );
    }
}

export default MemberGroupComponent;
const styles = StyleSheet.create({
    title: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#eb660d'
    },
    text_title: {
        fontSize: 20,
        fontWeight: "600",
        color: '#fff'

    },
    container_detail: {
        marginTop: 10,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 20
    },
    button_user: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',


    },
    avatar_user: {
        width: 60,
        height: 60,
        borderRadius: 30,

    },
    name_user: {
        color: '#000',
        fontSize: 16,
        fontWeight: '500',
        flexWrap: 'wrap',

    },
    confirm_left: {
        width: 115,
        height: 43,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#2d88ff',
        backgroundColor: '#2d88ff'
    },
    confirm_right: {
        width: 115,
        height: 43,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e4e6eb',
        backgroundColor: '#e4e6eb',
        marginLeft: 15
    },
    container_button: {

        marginTop: 6
    },
    item_right: {
        marginTop: 4,
        marginLeft: 13,
        width: 220
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

})