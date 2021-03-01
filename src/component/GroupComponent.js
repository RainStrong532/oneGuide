import React, { Component } from 'react';
import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    ScrollView,
    FlatList,
    Modal,
    ClippingRectangle,
    RefreshControl,
    ActivityIndicator,
    SafeAreaView
} from 'react-native'
import Images from '../assets/images';
import { ReachabilityView, i18next } from '../utils';
import {
    backScreen,
    showModalCommentRequestJoinGroup,
    pushToHomeGroup, InviteMemberMe,
    gotoPostDetailGroup,
    showModalSharePostAsMessage,
    showSharePost,
    showModalSharePost,
    showModalPostCreate,
    pushGalleryGroup,
    pushToAccountVerify,
    pushToUserProfile,
    pushShareGroup,
    showMoreOptionsPost,
    groupPostRequest,
    viewPhoto
} from '../navigation';
import Colors from '../constants/colors';
import PostView from './post-views/PostView'
import _ from 'lodash'
import PostCreateView from './post-views/PostCreateView'
import Helper from '../utils/Helper';
import POST_TYPE from '../constants/post-types'
import { Loading } from '../utils'

import HeaderView from './views/HeaderView'
class GroupComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newfeeds: [],
            members: [],
            isLoadMore: true,
            refreshing: false

        }
        this.page = 1
    }

    componentDidMount = () => {
        this.doGetListPost(this.props.listdata.passProps.id, this.page)
        this.doGetMembers()
    }

    doGetMembers = () => {
        this.props.getMemberGroup(this.props.listdata.passProps.id, 1)
            .then(res => {
                this.setState({
                    members: res.data.data
                })
            })
            .catch(err => {
            })
    }

    doGetListPost = (group_id, page) => {
        this.props.getListItems(group_id, page)
            .then(res => {
                this.page = page + 1
                this.setState({
                    newfeeds,
                    refreshing: false,
                    isLoadMore: false
                })
            })
            .catch(err => {
                this.setState({
                    // newfeeds,
                    refreshing: false,
                    isLoadMore: false
                })
            })
    }

    onPressBack = () => {
        backScreen(this.props.componentId)
    }

    onPressBackOfOutGroup = () => {
        const { passProps } = this.props.listdata || {}
        backScreen(this.props.componentId)
        if (passProps && passProps.getDatagroupAfter)
            this.props.listdata.passProps.getDatagroupAfter()
    }
    shareGroup = (data) => {
        pushShareGroup(this.props.componentId, { data })
    }
    toShowMoreOptionsPost = (data) => {

        showModalCommentRequestJoinGroup(this.props.componentId,
            {
                data: data,
            }
        )

    }
    alertOutGroupYour = () => {
        Helper.showAlert('', i18next.t('AreYouSureOutRequest'),
            [
                { text: i18next.t('No'), onPress: null },
                { text: i18next.t('Outgroup'), onPress: this.outYourGroup }
            ])
    }

    outYourGroup = () => {
        this.props.outGroupContainer_Your(
            this.props.listdata.passProps.id
        )
        this.onPressBackOfOutGroup()
        if (this.props && this.props.callback && this.props.callback.outGroup) {
            this.props.callback.outGroup(this.props.listdata.passProps.id)
        }
    }
    nextScreenInviteMember = () => {
        InviteMemberMe(this.props.componentId, this.props)
    }

    likePost = (comment_id) => {
        this.doLikePost(comment_id)
    }

    doLikePost = (comment_id) => {
        this.props.likenewfeedGroup(comment_id)
            .then(res => {
                let newfeeds = res
                this.setState({
                    newfeeds
                })

            })
            .catch(error => {

            })
    }
    onPressCommentButton = (data, isComment) => {
        gotoPostDetailGroup(this.props.componentId, data, { showKeyboard: isComment })
    }

    onPressShareButton = (comment) => {
        const callback = (type) => {
            if (type === 'WRITE_POST') {
                showModalSharePost(comment)
            } else if (type === 'SEND_AS_MESSAGE') {
                showModalSharePostAsMessage(comment)
            }

        }

        const user_me = _.get(this.props, 'user.me')
        showSharePost(comment, user_me, callback)

    }

    pushToAccountVerify = () => {
        pushToAccountVerify(this.props.componentId);
    }

    onPressCreatePost = (type) => {

        const is_verify = _.get(this.props, 'user.me.is_verify');
        if (is_verify.toString() === "0" && (type === POST_TYPE.GUIDE || type === POST_TYPE.TOUR)) {
            Helper.showAlert('', i18next.t('NeedToVerify'),
                [
                    { text: i18next.t(i18next.t('Cancelled')), onPress: null },
                    { text: i18next.t(i18next.t('verify')), onPress: this.pushToAccountVerify }
                ])
            return;
        }
        if (is_verify.toString() === "2" && (type === POST_TYPE.GUIDE || type === POST_TYPE.TOUR)) {
            Helper.showAlert('', i18next.t('AccountWaitVerify'),
                [
                    { text: i18next.t(i18next.t('OK')), onPress: null },
                ])
            return;
        }
        showModalPostCreate(type, null, null, this.props.listdata.passProps.id)
    }

    onPressAvatarButton = (data) => {
        pushToUserProfile(this.props.componentId, { ...data })
    }

    onPressNameButton = (data) => {
        pushToUserProfile(this.props.componentId, { ...data })
    }


    loadMore = () => {
        if (this.state.isLoadMore === true) {
            return
        }

        this.setState({ isLoadMore: true }, () => {
            this.doGetListPost(this.props.listdata.passProps.id, this.page)
        })
    }

    pullRefresh = () => {
        if (this.state.refreshing === true) {
            return
        }

        this.setState({ refreshing: true }, () => {
            this.doGetListPost(this.props.listdata.passProps.id, 1)
        })
    }

    onPressMoreOptionsButton = (comment) => {
        const callback = (type) => {

            if (type === 'edit') {
                showModalPostCreate(type, comment.comment_id)
            } else if (type === 'delete') {
                this.showAlertDeletePost(comment)
            }
        }

        const user_me = _.get(this.props, 'user.me')
        showMoreOptionsPost(comment, user_me, callback)
    }

    showAlertDeletePost = (comment) => {
        Helper.showAlert('', i18next.t('AreYouSureDeletePost'),
            [
                { text: i18next.t('Cancel'), onPress: null },
                {
                    text: i18next.t('Ok'), onPress: () => {
                        this.setState({ showOptions: false },
                            () => {
                                const comment_id = _.get(comment, 'comment_id')
                                this.doDeleteComment(comment_id)
                            })
                    }
                }
            ]
        )
    }


    onPressImage = (index, photo) => {

        viewPhoto({ index, photo })
    }

    doDeleteComment = (comment_id) => {
        Loading.showHud()

        // request
        this.props.deletePostGroup(comment_id)
            .then(data => {
                Loading.hideHud()
            })
            .catch(error => {
                Loading.hideHud()
            });
    }

    renderMenberGroup = (id) => {
        groupPostRequest(this.props.componentId, id)
    }
    _keyExtractor = (item, idx) => idx.toString()
    renderViewListGroup = ({ index, item }) => {
        const newfeeds = { index, comment: item }
        const user = _.get(this.props, 'user')
        return (
            <View style={{
                borderBottomWidth: 8,
                borderBottomColor: '#F0F6F5'
            }}>
                <PostView
                    data={newfeeds}
                    user={user}
                    onPressLikeButton={this.likePost}
                    onPressCommentButton={this.onPressCommentButton}
                    onPressShareButton={this.onPressShareButton}
                    onPressAvatarButton={this.onPressAvatarButton}
                    onPressNameButton={this.onPressNameButton}
                    onPressMoreOptionsButton={this.onPressMoreOptionsButton}
                    onPressImage={this.onPressImage}
                />
            </View>

        )
    }

    renderBottom = () => {
        return (
            <View style={{ height: 40, justifyContent: 'center' }}>
                {this.state.isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
            </View>
        )
    }

    goToGallery = () => {
        pushGalleryGroup(this.props.componentId, this.props.listdata.passProps.id)
    }

    renderHeader = () => {
        const { me } = this.props.user || {}
        let avatarUser, is_agent = ''
        if (me && me.avatar) avatarUser = me.avatar
        let
            dataface = {
                avatar: avatarUser
            }
        if (me && me.is_agent) is_agent = me.is_agent
        const { listPostGroup } = this.props || []
        const { passProps } = this.props.listdata || []
        let yourTeam = {};
        let listUsers = [];
        let listAva;
        if (passProps) {
            yourTeam = passProps;
            listUsers = passProps.list_users || this.state.members
        }
        const { background, title, total_member } = yourTeam || ''
        //grade_Level_group_joined
        if (listUsers) {
            listAva = listUsers.map((item, idx) => {
                return (
                    <View>
                        {idx > 3 ?
                            <View></View>
                            :

                            <View style={styles.img_invite}>

                                <TouchableOpacity

                                    onPress={() => this.renderMenberGroup(this.props.listdata.passProps.id)}
                                >
                                    <Image style={styles.image_icon5}
                                        source={{ uri: item.avatar }}>
                                    </Image>
                                </TouchableOpacity>

                            </View>
                        }
                    </View>
                )

            }
            )
        }

        return (
            <View
                style={{ flex: 1, backgroundColor: 'white' }}
            >
                <View style={styles.image}>
                    <ImageBackground source={{ uri: background }} style={{ flex: 1, resizeMode: "cover" }}>
                        <View style={styles.container_flex}>
                            <TouchableOpacity style={{
                                width: 40, height: 40, borderRadius: 20, opacity: 0.5,
                                backgroundColor: '#000', flexDirection: 'row',
                                justifyContent: 'center', alignItems: "center"
                            }}
                                onPress={this.onPressBack}
                            >
                                <Image style={styles.image_icon}
                                    source={Images.back}>
                                </Image>
                            </TouchableOpacity>
                            {passProps.check_admin == "yes" ?
                                <View style={styles.container_flexDirection}>

                                    <TouchableOpacity style={{
                                        width: 40, height: 40, borderRadius: 20, opacity: 0.5,
                                        backgroundColor: '#000', flexDirection: 'row',
                                        justifyContent: 'center', alignItems: "center"
                                    }}
                                        onPress={() => this.toShowMoreOptionsPost(passProps)}>

                                        <Image style={styles.image_icon}
                                            source={Images.post_more_options}>
                                        </Image>
                                    </TouchableOpacity>
                                </View> :
                                <View></View>

                            }

                        </View>
                    </ImageBackground>
                </View>
                <View style={{ backgroundColor: '#fff' }}>
                    <View>
                        <Text style={styles.center}>{title}</Text>
                    </View>
                    {
                        total_member == 0 ?
                            <View >
                                <Text style={styles.color_member}>1  {i18next.t('members')}</Text>
                            </View>
                            :
                            <View >
                                <Text style={styles.color_member}>{total_member} {i18next.t('members')}</Text>
                            </View>
                    }


                    <View style={styles.container_flexDirection3}>
                        {listAva}
                        <TouchableOpacity
                            onPress={this.nextScreenInviteMember}
                            style={styles.invite}>
                            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>+{i18next.t('Invite')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, height: 0.5, backgroundColor: '#94aab5', marginHorizontal: 15, marginTop: 15 }}></View>
                    <View style={styles.equalize}>
                        <TouchableOpacity
                            // onPress={this.shareGroup(passProps)}
                            onPress={() => this.shareGroup(passProps)}
                            style={styles.container_flexDirection2}>
                            <Image style={styles.image_icon2}
                                source={Images.share_post}>
                            </Image>
                            <Text style={{ marginLeft: 5, fontSize: 16, fontWeight: '600' }}>{i18next.t('Share')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={this.goToGallery}
                            style={styles.container_flexDirection2}>
                            <Image source={Images.image_post_home}
                                style={{
                                    tintColor: '#000',
                                    resizeMode: "contain",
                                    width: 18,
                                    height: 18,
                                    marginTop: 2,
                                }}
                            ></Image>
                            <Text style={{ marginLeft: 5, fontSize: 16, textDecorationLine: 'underline', fontWeight: "600" }}>{i18next.t('Image')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={this.alertOutGroupYour}
                            // onPress={this.outYourGroup}
                            style={styles.container_flexDirection2}>

                            <Image style={styles.image_icon2}
                                source={Images.share_post}>
                            </Image>
                            <Text style={{ marginLeft: 5, fontSize: 16, fontWeight: '600' }}> {i18next.t('Outgroup')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1, height: 0.5, backgroundColor: '#94aab5', marginHorizontal: 15 }}></View>
                <View style={{ backgroundColor: '#fff', }}>
                    <PostCreateView
                        postGroup={true}
                        data={dataface}
                        onPressCreatePost={this.onPressCreatePost}
                        isAgent={is_agent}
                    />

                </View>
                {listPostGroup.length == 0 ?
                    null
                    :

                    <View style={{ paddingTop: 15, paddingLeft: 10, paddingBottom: 15, borderBottomColor: '#F1F7F5', borderBottomWidth: 5 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1C1C1C' }}>
                            {i18next.t('post')}
                        </Text>
                    </View>

                }
            </View>
        )
    }
    render() {

        const { refreshing } = this.state
        const { listPostGroup } = this.props || []
        let listPost = []
        if (listPostGroup) {
            listPost = listPostGroup
        }
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <FlatList
                    keyExtractor={this._keyExtractor}
                    removeClippedSubviews={false}
                    data={listPost}
                    ListHeaderComponent={this.renderHeader}
                    renderItem={this.renderViewListGroup}
                    onEndReached={this.loadMore}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={this.pullRefresh}
                        />
                    }
                    ListFooterComponent={this.renderBottom}
                    onEndReachedThreshold={0.9}
                />
            </View>
        );
    }
}

export default GroupComponent;

const styles = StyleSheet.create({
    container_flexDirection: {
        flexDirection: "row"
    },
    container_flexDirection_between: {
        marginTop: 10,
        paddingTop: 9,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: 'space-between'
    },
    textCmt: {
        fontSize: 13,
        color: '#000',
        marginLeft: 5
    },
    container_posts: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: "#CED0D4",
        padding: 10,

    },
    textinput_posts: {
        paddingLeft: 13,
        fontSize: 16,
    },
    img_checkIn: {
        borderColor: Colors.light_gray_1,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        padding: 6

    },
    CheckIn_icon_text2: {
        flex: 1,
        height: '50%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: Colors.light_gray_1,
        paddingBottom: 10,
        paddingTop: 10
    },
    CheckIn_icon_text3: {
        flex: 1,
        height: '50%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
        paddingTop: 10


    },
    img_Posts: {
        width: 44,
        height: 44,
        borderRadius: 22,

    },
    img_ic_Posts: {
        resizeMode: "contain",
        width: 20,
        height: 20,
        marginTop: 3,

    },

    img_invite: {
        flexDirection: "row",
        marginTop: 2,

    },
    container_flexDirection3: {
        flexDirection: "row",
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon_especially: {
        marginTop: 13,
        marginLeft: 6,
        tintColor: '#fff',
        position: "absolute",
        zIndex: 6,
        resizeMode: "contain",
        borderRadius: 10
    },
    invite: {
        marginLeft: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 35,
        backgroundColor: '#00ACC1',
        borderRadius: 18,
    },
    container_flexDirection2: {
        flexDirection: "row",
        borderRadius: 20,
        backgroundColor: '#E4E4E4',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15

    },
    alignLeftText2: {
        marginTop: 0,
        marginLeft: 10,
        fontSize: 16,
        color: '#1C1C1C',

    },
    image_icon2: {
        marginTop: 4
    },
    equalize: {
        flexDirection: "row",
        justifyContent: 'space-between',
        padding: 20,

    },
    container_flex: {
        marginTop: 20,
        justifyContent: 'space-between',
        flexDirection: "row",
        padding: 10

    },
    center: {
        textAlign: 'center',
        marginTop: 12,
        fontSize: 20,
        fontWeight: "600",
        color: '#333333'
    },

    image: {
        height: 200,
    },
    image_icon: {
        resizeMode: "contain",
        width: 20,
        height: 20,
        tintColor: '#fff',
        zIndex: 9999,


    },
    image_icon5: {
        resizeMode: "cover",
        width: 30,
        height: 30,
        marginLeft: -5,
        borderRadius: 15,
    },


    color_member: {
        color: '#666666',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 9
    },

})