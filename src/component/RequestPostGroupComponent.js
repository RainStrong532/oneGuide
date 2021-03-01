import React, { Component } from 'react';
import {
    View, Text, ImageBackground, TouchableOpacity, TextInput,
    StyleSheet, Image, ScrollView, FlatList, Modal, ActivityIndicator, Platform, RefreshControl
} from 'react-native';
import {
    backScreen, dimissModal, showModalCancelBackGroup
} from '../navigation';
import Images from '../assets/images';
import { ReachabilityView, i18next } from '../utils';
import Colors from '../constants/colors';
import HeaderView from '../component/views/HeaderView';
import PostImageView from '../component/post-views/PostImageView';

class RequestPostGroupComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoadMore: true,
            refreshing: false,
        }
        this.page = 1
    }
    onPressBack = () => {

        const callback = () => {
            dimissModal(this.props.componentId)
        }
        showModalCancelBackGroup(callback)
    }


    componentDidMount = () => {
        this.doGetListPost(this.props.data, 1);
    }

    pullRefresh = () => {
        const { data } = this.props || ""
        const { refreshing } = this.state;
        if (refreshing) {
            return
        }
        this.page = 1;
        this.setState({ refreshing: true }, () => {

            this.doGetListPost(data, this.page)

        })
    }

    action_Confim = (group_id, comment_id, action) => {
        this.props.action_PostList_Confim_Delete(group_id, comment_id, action)
    }
    action_Delete = (group_id, comment_id, action) => {
        this.props.action_PostList_Confim_Delete(group_id, comment_id, action)
    }

    renderListPost_Group = ({ item }) => {
        // let date = item.created_date;
        let dateitems;
        if (item) {
            dateitems = item.created_date.split(' ');
        }
        let date = dateitems[0]
        let status_ = item.status;
        let photos = item.photo.photos
        return (
            <View style={styles.container_detail}>
                {status_ == 'pending' ?
                    <View>
                        <View
                            style={{ marginTop: 15 }}
                        >
                            <View style={styles.container_btn}>
                                <TouchableOpacity style={styles.button_user}>
                                    <Image style={styles.avatar_user} source={{ uri: item.avatar }}></Image>

                                </TouchableOpacity>
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={styles.name_user}> {item.display_name} </Text>
                                    <Text style={{ marginLeft: 4 }}> {date}</Text>
                                </View>

                            </View>

                        </View>

                        <View style={{ marginTop: 15, flex: 1 }}>
                            <View style={{ padding: 10 }}>
                                <Text numberOfLines={3}>{item.content}
                                </Text>
                            </View>
                            <View style={{}}>
                                <PostImageView
                                    photos={photos}
                                    style={{ marginBottom: 10 }}
                                    showImage
                                />
                            </View>
                        </View>
                        <View style={styles.item_right}>
                            <View style={styles.container_button}>
                                <TouchableOpacity
                                    onPress={() => { this.action_Confim(this.props.data, item.comment_id, 'confirm') }}
                                    style={styles.confirm_left}>
                                    <Text style={styles.style_text}>{i18next.t('Approval')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { this.action_Delete(this.props.data, item.comment_id, 'delete') }}
                                    style={styles.confirm_right}>
                                    <Text style={styles.style_text_right}>{i18next.t('CancelRequest')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    : status_ == 'Đã phê duyệt bài viết' ?
                        null
                        // <View
                        // >

                        // </View>
                        :
                        null
                    // <View

                    // >
                    // </View>
                }


            </View>
        );
    }
    renderBottom = () => {
        // const { isLoadMore } = this.state
        // const isLoadMore = this.state.isLoadMore
        // console.log(this.state.isLoadMore, "dfjgkdfjg");
        return (
            <View style={{ height: 40, justifyContent: 'center' }}>
                {this.state.isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
            </View>
        )
    }

    doGetListPost = (id_group, page) => {
        this.props.getList_Approval(id_group, page)
            .then(data => {

                this.page = page + 1
                this.setState({
                    // data: data,
                    refreshing: false,
                    isLoadMore: false

                })
            })
            .catch(error => {
                this.page = page + 1
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
            this.doGetListPost(this.props.data, this.page);
        })
    }

    render() {
        const { refreshing, isLoadMore } = this.state
        let data_PostList = []
        if (this.props.listPostApproval) {
            data_PostList = this.props.listPostApproval
        }
        return (
            <View style={{ flex: 1 }}>

                <HeaderView
                    back={true}
                    title={i18next.t('ApprovedArticles')}
                    onPressLeftBarButton={this.onPressBack}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                ></HeaderView>
                <FlatList
                    removeClippedSubviews={false}
                    // onEndReached={this.doGetListPost}
                    data={data_PostList}
                    onEndReached={this.doGetListPost}
                    renderItem={this.renderListPost_Group}

                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={this.pullRefresh}
                        />
                    }
                    onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 10}
                    onEndReached={this.loadMore}
                    ListFooterComponent={this.renderBottom}
                    ListEmptyComponent={
                        <View style={{ flex: 1 }}>
                            {
                                isLoadMore
                                    ?
                                    <View>

                                    </View>
                                    :
                                    <View style={{
                                        flex: 1,
                                        paddingTop: 100,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{ textAlign: 'center' }} >{i18next.t('NoPosts')}</Text>
                                    </View>
                            }
                        </View>
                    }
                />
            </View>
        );
    }
}

export default RequestPostGroupComponent;
const styles = StyleSheet.create({
    container_btn: {
        flexDirection: 'row',
        marginLeft: 10,
        marginTop: 7
    },
    approval: {
        width: '35%',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    refuse: {
        width: '35%',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon_see_more: {
        width: '10%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    // information_user: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    // },
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
        borderTopWidth: 5,
        borderTopColor: '#D8E7F5',
        backgroundColor: '#ffffff'
        //borderBottomColor: '#ddd'
        // flexDirection: 'row',
        // padding: 20
    },
    button_user: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',


    },
    avatar_user: {
        width: 46,
        height: 46,
        borderRadius: 23,

    },
    name_user: {
        color: '#000',
        fontWeight: "600",
        fontSize: 17,

    },
    confirm_left: {
        width: '40%',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#00acc2',
        // backgroundColor: '#00acc2'
    },
    confirm_right: {
        width: '40%',
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#999999',
        marginLeft: 25
    },
    container_button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 15,
        flex: 1,
        marginHorizontal: 8,
        borderTopWidth: 1,
        borderTopColor: '#C5C8CB'
    },
    item_right: {
        padding: 10
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