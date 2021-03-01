import React, { Component } from 'react';
import {
    View, Text, ImageBackground, TouchableOpacity, TextInput,
    StyleSheet, Image, ScrollView, FlatList, Modal, ActivityIndicator,
    RefreshControl
} from 'react-native';
import {
    backScreen,
    pushToGroup,
    pushInformationGroup,
    gotoPostDetailHomeGroup,
    showModalSharePost,
    showModalSharePostAsMessage,
    showSharePost,
    showModalPostCreate,
    showMoreOptionsPost,
    pushToUserProfile,
    showModalLikeList,
    viewPhoto
} from '../navigation';
import { Navigation } from 'react-native-navigation';
import Images from '../assets/images';
import { ReachabilityView, i18next, Loading } from '../utils';
//import { backScreen } from '../navigation';
import Colors from '../constants/colors';
import HeaderView from '../component/views/HeaderView';
import PostView from '../component/post-views/PostView'
import _ from 'lodash'
import Helper from '../utils/Helper';

//import { Loading } from '../utils';
//import { GroupComponent } from '../component/GroupComponent';

class HomeGroupComponent extends Component {

    constructor(props) {

        super(props);
        // Navigation.events().bindComponent(this);
        // this.eventSubscription = Navigation.events().registerBottomTabSelectedListener(this.onPressBottomTab)
        this.state = {
            checkButton: false,
            checkItem: {},
            refreshing: false

        }

    }
    componentDidMount = () => {
        this.props.getDatagroup()
    }
    pullRefresh = () => {
        if (this.state.refreshing === true) {
            return
        }
        this.setState({ refreshing: true }, () => {
            this.props.getDatagroup()
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
    pullRefreshLoadding = () => {
        Loading.showHud()
        if (this.state.refreshing === true) {
            return
        }
        this.setState({
        }, () => {
            this.props.getDatagroup()
                .then(res => {
                    Loading.hideHud()
                    this.setState({
                        refreshing: false,
                    })
                })
                .catch(err => {
                    Loading.hideHud()
                    this.setState({
                        refreshing: false,
                    })
                })
        })
    }
    onPressInformationGroup = (data) => {
        pushInformationGroup(this.props.componentId, {
            passProps: data
        })
    }
    onPressYourTeam = (id_group) => {
        this.props.getInfomationGroup(id_group)
            .then(res => {
                const convertData = {
                    ...res,
                    id: id_group,
                    getDatagroupAfter: this.pullRefreshLoadding

                }
                pushToGroup(this.props.componentId,
                    {
                        passProps: convertData,
                    }
                )
            }
            )
    }
    onPressUserId = (user_id) => {
        pushToUserProfile(this.props.componentId, { user_id })
    }
    renderItems = ({ item }) => {
        return (
            <View style={styles.FlatList_View}>
                <ImageBackground source={{ uri: item.avatar }}
                    style={styles.FlatList}
                ><View style={{ flex: 1, height: '70%', borderRadius: 8 }}></View>
                    <View style={{ backgroundColor: 'white', flex: 1, height: '30%', }}>
                        <View style={{ margin: 6 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (item) {
                                        this.onPressInformationGroup(item)
                                    }
                                }
                                }
                            >
                                <Text numberOfLines={1} style={{ fontWeight: "500", fontSize: 14, color: "#000", marginRight: 7 }}>{item.title}</Text>
                                <Text style={{ fontSize: 13 }}>{item.total_member} {i18next.t('Memberv')} </Text>
                            </TouchableOpacity>

                            {
                                item.submitted_request == 'no' ?
                                    <TouchableOpacity

                                        onPress={() => this.joinGroup(item.id)}
                                        style={styles.TouchableOpacity_join}>
                                        <Text style={{ color: '#00a5ba' }}>{i18next.t('Join')}</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        disabled
                                        style={styles.TouchableOpacity_out}>
                                        <Text style={{ color: '#000' }}> {i18next.t('waiting')}</Text>
                                    </TouchableOpacity>
                            }

                        </View>

                    </View>
                </ImageBackground>
            </View>
        )
    }
    renderGroupjoined = ({ item }) => {
        return (
            <View style={styles.item_Yourteam}>
                <TouchableOpacity
                    onPress={() => {
                        this.onPressYourTeam(item.id)
                    }
                    }
                    style={styles.container_flexDirection}>
                    <Image
                        resizeMode='stretch'
                        style={styles.image_icon2}
                        source={{ uri: item.avatar }}>
                    </Image>
                    <View style={{
                        width: "80%",
                        marginLeft: 15,
                        overflow: 'hidden',
                        justifyContent: 'center'
                    }}>
                        <Text style={{ fontSize: 14, color: "#000", fontWeight: '500' }}
                            numberOfLines={1}
                        >
                            {item.title}
                        </Text>
                        {
                            item.total_member == 0 ?
                                <Text style={{ fontSize: 13 }}>1 {i18next.t('Memberv')}</Text>
                                :
                                <Text style={{ fontSize: 13 }}>{item.total_member} {i18next.t('Memberv')}</Text>
                        }

                    </View>
                </TouchableOpacity>

            </View>
        )

    }

    onPressLikeButton = (comment_id) => {
        if (this.props.likePostHomeGroup) {
            this.props.likePostHomeGroup(comment_id)
        }
    }

    onPressCommentButton = (data, isComment) => {
        gotoPostDetailHomeGroup(this.props.componentId,
            { ...data },
            { showKeyboard: isComment })
    }

    onPressShareButton = (comment) => {
        const callback = (type) => {
            if (type === 'WRITE_POST') {
                showModalSharePost(comment)
            } else if (type === 'SEND_AS_MESSAGE') {
                showModalSharePostAsMessage(comment)
            }

        }

        const user_me = _.get(this.props, 'user.user.me')
        showSharePost(comment, user_me, callback)

    }

    onPressMoreOptionsButton = (comment) => {
        const callback = (type) => {

            if (type === 'edit') {
                showModalPostCreate(type, comment.comment_id)
            } else if (type === 'delete') {
                this.showAlertDeletePost(comment)
            }
        }

        const user_me = _.get(this.props, 'user.user.me')
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

    doDeleteComment = (comment_id) => {
        Loading.showHud()

        // request
        this.props.deletePostHomeGroup(comment_id)
            .then(data => {
                Loading.hideHud()
            })
            .catch(error => {
                Loading.hideHud()
            });
    }
    onPressImage = (index, photo) => {

        viewPhoto({ index, photo })
    }

    onPressAvatarButton = (data) => {
        // console.log();
        pushToUserProfile(this.props.componentId, { ...data })
    }

    onPressNameButton = (data) => {
        // console.log();
        pushToUserProfile(this.props.componentId, { ...data })
    }

    onPressLikeListButton = (data, isComment) => {
        showModalLikeList(this.props.componentId, data, { showKeyboard: isComment })
    }

    onPressSharePostButton = (data) => {
        gotoPostDetailHomeGroup(this.props.componentId, { comment: data })
    }

    goToGroup = (data) => {
        // console.log('go to group', data);
        if (data.check_user == 'no') {
            pushInformationGroup(this.props.parentComponentId, {
                passProps: data
            })
        } else
            if (data.check_user == 'yes') {
                pushToGroup(this.props.parentComponentId, {
                    passProps: data
                })
            }
    }

    renderListPost = ({ item, index }) => {
        // console.log('item list post group', item);
        // let photos = item.photo.photos
        const data = { index, comment: item }
        // grade_Level_group_joined
        return (

            <View style={index == 0 ? null : styles.postListCommit

            }>
                <PostView
                    data={data}

                    onPressLikeButton={this.onPressLikeButton}
                    onPressCommentButton={this.onPressCommentButton}
                    onPressShareButton={this.onPressShareButton}
                    onPressMoreOptionsButton={this.onPressMoreOptionsButton}
                    onPressAvatarButton={this.onPressAvatarButton}
                    onPressNameButton={this.onPressNameButton}
                    onPressLikeListButton={this.onPressLikeListButton}
                    onPressTitleGroupButton={this.onPressYourTeam}
                    onPressSharePostButton={this.onPressSharePostButton}
                    getInfomationGroup={this.props.getInfomationGroup}
                    goToGroup={this.goToGroup}
                    onPressImage={this.onPressImage}


                />
            </View>
        )
    }
    joinGroup = (dataGroup) => {
        this.props.joinGroupContainer(dataGroup)
    }
    onPressBack = () => {
        backScreen(this.props.componentId)
    }
    render() {
        const { grade_Level_group_joined, grade_Level_group_orther, grade_Level_list_post, joinGroup } = this.props || []
        const { refreshing } = this.state
        return (
            <View style={{ flex: 1 }}>
                <HeaderView
                    //back={true}
                    onPressLeftBarButton={this.onPressBack}
                    title={i18next.t('Group')}

                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                ></HeaderView>
                {/* kiểm tra */}
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={this.pullRefresh}
                        />
                    }
                    style={{ flex: 1, backgroundColor: '#F0F6F5' }}>
                    <View style={{
                        //paddingLeft: 10,
                        // backgroundColor: "#fff"
                    }}>
                        {grade_Level_group_orther.length > 0 ?
                            <View >
                                <View style={styles.Yourteam}>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: "500",
                                        color: "#000",
                                        paddingTop: 15,
                                        paddingLeft: 15,
                                        paddingBottom: 10
                                    }
                                        //styles.Recommendedgroup
                                    }>{i18next.t('Recommendedgroup')}</Text>
                                </View>
                                <FlatList
                                    removeClippedSubviews={false}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    data={grade_Level_group_orther}
                                    renderItem={this.renderItems}
                                />
                            </View>
                            :
                            <View></View>
                        }



                    </View>


                    {
                        grade_Level_group_joined.length == 0 ?
                            <View style={{ justifyContent: 'center', marginTop: 70, alignContent: 'center', flexDirection: 'row' }}>
                                <Text style={{ fontSize: 16 }}>
                                    {i18next.t('YouAreNotAMemberOfAnyGroup')}
                                </Text>
                            </View>
                            :

                            <View style={{ flex: 1 }}>
                                <View style={styles.Yourteam}>
                                    <Text style={styles.Recommendedgroup}>{i18next.t('Yourteam')}</Text>
                                </View>

                                <View style={{ paddingVertical: 10, flex: 1 }}>
                                    <View style={{ flex: 1 }}>
                                        <FlatList
                                            removeClippedSubviews={false}
                                            data={grade_Level_group_joined}
                                            renderItem={this.renderGroupjoined}
                                        />
                                    </View>
                                </View>
                            </View>

                    }

                    {grade_Level_list_post.length > 0 ?
                        <View style={{}}>
                            <View style={styles.Yourteam}>
                                <Text style={styles.Recommendedgroup}>{i18next.t('post')}</Text>
                            </View>
                            <View style={{ backgroundColor: "#fff" }}>
                                <View >
                                    <FlatList
                                        removeClippedSubviews={false}
                                        data={grade_Level_list_post}
                                        renderItem={this.renderListPost}
                                    />
                                </View>
                            </View>
                        </View>

                        :
                        null
                    }
                </ScrollView>
            </View>
        );
    }
}
export default HomeGroupComponent;
const styles = StyleSheet.create({
    container_flexDirection2: {
        flexDirection: "row",
        // width: '85%'
        flex: 0.9
    },
    container_flexDirection23: {
        flexDirection: "row",
        flexWrap: 'wrap',
        width: 220
    },
    postListCommit: {
        borderTopWidth: 8,
        borderTopColor: '#F1F7F5'
    },
    TouchableOpacity_join: {
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 3,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: '#00a5ba',
        marginRight: 3,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center'
    },
    TouchableOpacity_out: {
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 3,
        backgroundColor: "#D8DADF",
        borderWidth: 1,
        borderColor: '#D8DADF',

        marginRight: 3,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center'
    },
    FlatList_View: {
        width: 230,
        height: 180,
        borderWidth: 1,
        borderColor: "#cccccc",
        borderRadius: 10,
        marginLeft: 10,
        marginBottom: 15,
        marginTop: 15,
        overflow: 'hidden',

    },
    FlatList: {
        flex: 1,
        resizeMode: "contain",
        flexDirection: 'column'
    },
    textCmt: {
        fontSize: 13,
        color: '#000',
        marginLeft: 5
    },
    container_flexDirection: {
        flexDirection: "row",
        marginTop: 10,
        paddingHorizontal: 10
    },
    container_flexDirection_between: {
        padding: 10,
        backgroundColor: "#fff",
        flexDirection: "row",
        // justifyContent: 'space-between',
        flex: 1,

    },
    item_Yourteam: {
        backgroundColor: "#fff",
        padding: 6,
        overflow: 'hidden',
        borderBottomColor: '#BBBBBB',
        borderBottomWidth: 0.5,
        marginBottom: 5,
        borderTopColor: '#BBBBBB',
        borderTopWidth: 0.5,


    },
    image_icon2: {
        width: 44,
        height: 44,
        borderRadius: 22,

    },
    Recommendedgroup: {
        fontSize: 16,
        fontWeight: "500",
        color: "#000",
        paddingHorizontal: 15,
        paddingVertical: 10
        // borderBottomColor: 'gray',
        // borderBottomWidth: 0.4,
        // marginRight: 40,
        // marginLeft: 10
    },
    Yourteam: {
        backgroundColor: "#F0F6F5",
        justifyContent: 'center',
    },

})

