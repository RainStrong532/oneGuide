import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    Image,
    TextInput,
    FlatList,
    ActivityIndicator,
    RefreshControl
} from 'react-native'
import HeaderView from './views/HeaderView'
import {
    backScreen,
    gotoSelectOptionsScreen,
    ScreenSelectLanguageInviteGuider,
    dimissModal,
    pushToUserProfile,
    showModalToUserProfile
} from '../navigation'
import Colors from '../constants/colors'
import Images from '../assets/images'
import _ from 'lodash'
import i18next from 'i18next'

export default class AddGuiderComponent extends Component {

    constructor(props) {
        super(props)
        this.page = 1
        this.state = {
            showOptionSearch: false,
            language: [],
            exp: {},
            keysearch: '',
            isLoadMore: true,
            refreshing: false,
        }
    }

    componentDidMount() {
        // console.log('commm_________________________IIIIIIIIIIIIIII___', _.get(this.props, 'data.comment_id'));
        this.setState({
            language: [{ name: _.get(this.props, 'data.language') }],
            exp: { value: _.get(this.props, 'data.experience') },
        })
        const data = {
            keysearch: _.get(this.state, 'keysearch'),
            comment_id: _.get(this.props, 'data.comment_id'),
            language: _.get(this.props, 'data.language'),
            experience: _.get(this.props, 'data.experience'),
            page: 1
        }
        this.doGetGuider(data)
    }

    doGetGuider = (data) => {
        this.props.getGudierMatchTour(data)
            .then(res => {
                this.page = this.page + 1
                this.setState({
                    refreshing: false,
                    isLoadMore: false
                })
            })
            .catch(err => {
                this.page = page + 1
                this.setState({
                    refreshing: false,
                    isLoadMore: false
                })
            })
    }

    onPressBack = () => {
        dimissModal(this.props.componentId)
    }

    renderLanguageSearch = () => {
        let language = _.get(this.state, 'language')
        let languageSelected
        if (language) {
            languageSelected = language.map((lang) => {
                return `${lang.name}, `
            })
        }
        // console.log('lang lang lang lang lang lang lang lang lang', _.get(this.state, 'language'));
        // console.log('lang lang lang lang lang lang lang lang lang', languageSelected);
        return (
            <TouchableOpacity
                style={{
                    borderBottomColor: Colors.gray_1,
                    borderBottomWidth: 1,
                    paddingBottom: 10
                }}
                onPress={this.onSelectLanguagePress}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        // borderBottomColor: Colors.gray_1,
                        // borderBottomWidth: 0.5,
                        // paddingBottom: 10
                    }}
                >
                    <View style={{ flexDirection: "row" }}>
                        <Image
                            source={Images.ic_language}
                            style={{
                                width: 20,
                                height: 20,
                                marginRight: 5
                            }}
                        />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '500'
                            }}
                        >{i18next.t('Language')}</Text>
                    </View>
                    <Image
                        source={Images.ic_dropdown}
                        style={{ width: 10, height: 10, tintColor: Colors.gray }}
                    />
                </View>
                <View>

                    <Text
                        style={{
                            fontSize: 16,
                            color: Colors.black
                        }}
                    >{language ? languageSelected : ''}</Text>

                </View>
            </TouchableOpacity>
        )
    }

    renderExperienceSearch = () => {
        let exp = _.get(this.state, 'exp')
        return (
            <TouchableOpacity
                style={{
                    borderBottomColor: Colors.gray_1,
                    borderBottomWidth: 1,
                    paddingBottom: 10,
                    marginTop: 10
                }}
                onPress={this.onSelectExpPress}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        // borderBottomColor: Colors.gray_1,
                        // borderBottomWidth: 1,
                        // paddingBottom: 10,
                        // marginTop: 10
                    }}
                >
                    <View style={{ flexDirection: "row" }}>
                        <Image
                            source={Images.experience}
                            style={{
                                width: 20,
                                height: 20,
                                marginRight: 5
                            }}
                        />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '500'
                            }}
                        >{i18next.t('Experience')}</Text>
                    </View>
                    <Image
                        source={Images.ic_dropdown}
                        style={{ width: 10, height: 10, tintColor: Colors.gray }}
                    />
                </View>
                <View>

                    <Text
                        style={{
                            fontSize: 16,
                            color: Colors.black
                        }}
                    >{exp ? exp.value : ''}</Text>

                </View>
            </TouchableOpacity>
        )
    }

    generate = () => {
        const language = this.state.language || ''
        const exp = this.state.exp.value || ''
        const comment_id = _.get(this.props, 'data.comment_id')
        const keysearch = _.get(this.state, 'keysearch')
        let page = this.page
        // console.log('comment______________id', language);
        let languageSearch
        if (language) {
            languageSearch = language.map(lang => {
                return lang.name

            })
        }
        return {
            language: languageSearch,
            experience: exp,
            comment_id,
            page,
            keysearch
        }
    }

    searchGuider = () => {
        const keySearch = {
            ...this.generate(),
            page: 1
        }
        this.doGetGuider(keySearch)
        this.setState({
            showOptionSearch: false
        })

    }

    showSearch = () => {
        this.setState({
            showOptionSearch: !this.state.showOptionSearch
        })
    }

    handleInvite = (user) => {
        const comment_id = _.get(this.props, 'data.comment_id')
        let action
        if (user.invited.status == 'empty') {
            // action mời guider
            action = 'invite'
        } else {
            // action hủy guider
            action = 'agent-cancel'
        }

        const data = {
            comment_id,
            action,
            user_guider_id: user.user_id
        }
        if (this.props.invitedTour) {
            this.props.invitedTour(data)
                .then(res => {
                    // console.log('resssssssssssssssssssssssss', res);
                })
                .catch(err => {
                    // console.log('errrrrrrrrrrrrrrrrrrrrrrrrrrrr', err);
                })
        }
    }

    onSelectLanguagePress = () => {
        const callback = (data) => {

            // const language = {
            //     id: data.lang_id,
            //     name: data.name,
            // }

            this.setState({ language: data })
        }


        const language = this.state.language
        // const lang_id = language.id

        ScreenSelectLanguageInviteGuider(this.props.componentId, callback, 'LANGUAGE')
    }

    onSelectExpPress = () => {
        const callback = (data) => {

            // const language = {
            //     id: data.lang_id,
            //     name: data.name,
            // }

            this.setState({ exp: data })
        }
        // console.log('this.state', this.state);


        // const language = this.props.user.language
        // const lang_id = language.id

        ScreenSelectLanguageInviteGuider(this.props.componentId, callback, 'EXPERIENCE')
    }

    pushToUserProfile = (user_id) => {
        // dimissModal(this.props.componentId)
        showModalToUserProfile(this.props.comment_id, { user_id })

    }

    renderItem = ({ index, item }) => {
        // console.log('_-------------------------------', item);
        let user = item
        let invited = _.get(item, 'invited.status')
        const user_id = user.user_id

        return (
            <View style={styles.tast_list}>
                <TouchableOpacity
                    onPress={() => this.pushToUserProfile(user_id)}
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
                                    <Image
                                        style={styles.image_header_personalPhoto}
                                        // source={Images.image_bacc}
                                        source={{ uri: user.avatar }}
                                    // source={{ uri: isMe && avatarWall ? avatarWall : avatar }}
                                    ></Image>
                                </View>
                                <View style={styles.logo_image_right}>
                                    <Image
                                        source={Images.logo_flag_header}
                                        resizeMode='contain'
                                        style={{ width: 15, height: 15 }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.body_View2}>
                        <Text style={{ fontWeight: "500", fontSize: 15 }}> {user.display_name}</Text>
                        <Text style={{ marginLeft: 8 }}>{`${user.language}, ${user.f_language}`}</Text>
                        <Text style={{ marginLeft: 8 }}>{user.experience == 0 ? i18next.t('NoExperience') : `${user.experience} năm`}</Text>
                    </View>
                </TouchableOpacity>
                <View
                    style={{
                        alignItems: "center", justifyContent: 'center'
                    }}
                >
                    {
                        invited == 'empty'
                            ?
                            <TouchableOpacity
                                onPress={() => this.handleInvite(item)}
                                style={{
                                    backgroundColor: Colors.green_1,
                                    borderRadius: 7
                                }}
                            // style={{
                            //     alignItems: "center", justifyContent: 'center'
                            // }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: '500',
                                        color: Colors.white,
                                        paddingLeft: 10,
                                        paddingRight: 10,
                                        paddingTop: 7,
                                        paddingBottom: 7

                                    }}
                                >
                                    {i18next.t('Invite')}
                                </Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={() => this.handleInvite(item)}
                                style={{
                                    backgroundColor: Colors.gray_1,
                                    borderRadius: 7
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: '500',
                                        color: Colors.black_1,
                                        paddingLeft: 10,
                                        paddingRight: 10,
                                        paddingTop: 7,
                                        paddingBottom: 7

                                    }}
                                >
                                    {i18next.t('Cancel')}
                                </Text>
                            </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }

    loadMore = () => {

        // console.log('bdbdbdbdbdbdb');

        const keySearch = this.generate()
        if (this.state.isLoadMore === true) {
            // console.log('=== = = = -sấdj');
            return
        }

        this.setState({ isLoadMore: true }, () => {
            this.doGetGuider(keySearch)
            // console.log(' - - - - - - - -k e e e e e ê e engngngngng', keySearch);
        })
    }

    renderBottom = () => {
        return (
            <View style={{ height: 40, justifyContent: 'center' }}>
                {this.state.isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
            </View>
        )
    }

    pullRefresh = () => {
        if (this.state.refreshing === true) {
            return
        }

        this.setState({ refreshing: true }, () => {
            let generate = this.generate()
            const data = {
                ...generate,
                page: 1
            }
            this.doGetGuider(data)
        })
    }

    onChangeText = (text) => {
        this.setState({
            keysearch: text
        })
    }

    _keyExtractor = (item, idx) => idx.toString()


    render() {
        let listGuider = _.get(this.props, 'listGuider') || []

        let showOptionSearch = _.get(this.state, 'showOptionSearch')
        // console.log('add guider', this.state);

        return (
            <View
                style={styles.container}
            >
                <HeaderView
                    title={i18next.t('AddGuide')}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                    back={true}
                    onPressLeftBarButton={this.onPressBack}
                />
                <View
                    style={styles.search_view}
                >
                    <View
                        style={{ marginLeft: 10, marginRight: 10, }}
                    >
                        <View
                            style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}

                        >
                            <TextInput
                                placeholder={i18next.t('Searching')}
                                style={styles.text_input}
                                onChangeText={(text) => this.onChangeText(text)}
                            />
                            <Image
                                source={Images.search}
                                style={styles.icon_search}
                            />
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        backgroundColor: Colors.white,
                        flex: 1,
                    }}
                >
                    {/* {
                        showOptionSearch && */}
                    <View
                        style={{ margin: 10 }}
                    >
                        {this.renderLanguageSearch()}
                        {this.renderExperienceSearch()}
                        <TouchableOpacity
                            style={{
                                backgroundColor: Colors.green_1,
                                justifyContent: 'center',
                                alignItems: "center",
                                borderRadius: 7,
                                marginTop: 10
                            }}
                            onPress={this.searchGuider}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    paddingTop: 7,
                                    paddingBottom: 7,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    color: Colors.white
                                }}
                            >
                                {i18next.t('Search')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* } */}
                    <View>
                        <FlatList
                            data={listGuider}
                            renderItem={this.renderItem}
                            onEndReached={this.loadMore}
                            ListFooterComponent={this.renderBottom}
                            onEndReachedThreshold={0.9}
                            refreshControl={
                                <RefreshControl
                                    onRefresh={this.pullRefresh}
                                    refreshing={this.state.refreshing}
                                />
                            }
                            keyExtractor={this._keyExtractor}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: Colors.gray_1,
        flex: 1,
        marginBottom: 60
    },
    icon_search: {
        width: 20,
        height: 20,
        tintColor: Colors.green_1
    },
    search_view: {
        backgroundColor: Colors.white,
        borderBottomColor: Colors.green_1,
        borderBottomWidth: 1,
        // paddingBottom: 10
        // height: 50
    },
    text_input: {
        // padding: 20
        // borderBottomColor: Colors.green_1,
        // borderBottomWidth: 1,
    },
    containView: {
        marginTop: 10,
        // flexDirection: 'row',
        //height: 36,
        // alignItems: 'center',
        flex: 1,
    },
    buttonRight: {
        marginHorizontal: 15,
    },
    imagedrop: {
        right: 10,
        width: 15,
        height: 15,
        position: 'absolute'
    },
    buttonPopup: {
        height: 30,
        justifyContent: 'center'
    },
    textInputForm: {
        fontSize: 14,
        // height: 35,
        justifyContent: 'center',
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    lineBottomText: {
        height: 0.5,
        // borderWidth: 0.5,
        // borderColor: Colors.gray_1,

    },
    txtTitle: {
        // fontWeight: 'bold',
        fontSize: 12,
        marginHorizontal: 15,
    },
    // languageInfo: {
    //     height: 50,
    //     flexDirection: 'row',
    //     borderBottomWidth: 1,
    //     borderBottomColor: 'grey',
    //     alignItems: 'center'
    // },
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
        height: 50,
        width: 50,
        borderRadius: 25,
        overflow: 'hidden',
    },
    logo_image_right: {
        position: 'absolute',
        top: 35,
        left: 32,
    },
    fullFriend: {
        padding: 13,
        backgroundColor: Colors.green_1,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 10
    }
})