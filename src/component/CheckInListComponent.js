import React, { Component } from 'react';
import { Platform, StatusBar, AppRegistry, FlatList, StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity, Dimensions, Modal, Alert, ScrollView, TouchableHighlight, TextInput, ActivityIndicator } from 'react-native'
import Images from '../assets/images'
import Device from '../modules/Device'
import { showModalPostCheckIn, showModalComment, showModalCommentPostCheckIn, pushToUserProfile } from '../navigation'
import { i18next, Loading } from '../utils'
import Colors from '../constants/colors'

class CheckInListComponent extends Component {
    constructor(props) {
        super(props);
        this.page = 1
        this.state = {
            screenWidth: Dimensions.get('window').width,
            screenHeight: Dimensions.get('window').height,
            screenWidthShare: Dimensions.get('window').width / 3.45,
            // screenHeight: Dimensions.get('window').height/2.5,
            // screenWidth: Device.screenSize().width,
            // screenHeight: Device.screenSize().height,
            modalVisible: false,
            itemCheckin: {},
            show_more: false,
            loadMore: true,
            isLoadMore: false,
            refreshing: false,
            screenShowAll: true,
            text: '', testWidth: '99%'
        }

    }
    close_show = () => {

        this.setState({
            modalVisible: false,
            show_more: false
        })
    }
    on_click_more = () => {

        this.setState({
            show_more: !this.state.show_more
        })
    }

    passProps = () => {
        this.setState({
            modalVisible: true,
        })
    }
    show_modal_View = () => {
        let users_me = []

        if (this.props.highlights_user) {
            users_me = this.props.highlights_user
        }
        showModalCommentPostCheckIn(null, { passProps: this.passProps, users_me })
    }
    renderCheckIn = (item, index) => {
        const { photo, avatar, location } = item.item || ''
        let uri_user_me, location_check = []
        if (photo && photo.path) {
            uri_user_me = photo.path
        }
        else if (photo) {
            uri_user_me = photo
        }
        else {
            uri_user_me = avatar
        }
        if (location) {
            location_check = location
        }
        return (
            <View>
                <TouchableOpacity style={
                    {

                        // width: 130,
                        borderRadius: 12,
                        // width: this.state.screenWidthShare,
                        width: 105,
                        height: 185,
                        marginVertical: 5,
                        marginLeft: 6.5,
                        position: 'relative',

                    }
                    // styles.buttom_Image_View
                }
                    onPress={() => {
                        if (item.index === 0) {
                            this.show_modal_View()
                        }
                        else {
                            this.setState({
                                modalVisible: true,
                            })
                        }
                        this.setState({

                            itemCheckin: item
                        })
                    }} >
                    <ImageBackground
                        source={{ uri: uri_user_me ? uri_user_me : null }}

                        style={styles.background_Image}>
                        <View style={{
                            flexDirection: 'row', flex: 0.3

                        }}>
                            <View style={{ flex: 1, }}>
                                <View style={{
                                    width: 34, height: 34,
                                    //  margin: 6, 
                                    marginVertical: 5,
                                    marginLeft: 5,
                                    position: 'relative'
                                }}>
                                    <View style={styles.personalPhoto}>
                                        <Image style={styles.image_in_personalPhoto}
                                            source={{ uri: item.item.avatar ? item.item.avatar : null }}
                                        ></Image>
                                    </View>

                                    {
                                        item.item.type_user === "guide" ?
                                            <View style={styles.logo_image_right}>
                                                <Image style={{ width: 12, height: 12 }}
                                                    source={Images.logo_flag_header}
                                                    resizeMode="contain"
                                                />
                                            </View>
                                            :
                                            null
                                    }
                                </View>
                            </View>
                            <View style={{
                                flex: 1,
                                paddingRight: 5,
                                paddingLeft: 3
                            }}>
                                {
                                    item.index === 0 ?
                                        // null
                                        <Text
                                            numberOfLines={2}
                                            style={styles.personal_name}>{i18next.t('Me')} </Text>
                                        :
                                        <Text
                                            numberOfLines={2}
                                            style={styles.personal_name}>{item.item.username} </Text>
                                }

                            </View>
                        </View>
                        <View style={{
                            flex: 0.35,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {/* <View style={{ width: '85%' }}>
                                <Text numberOfLines={1} style={{ textTransform: 'lowercase', fontSize: 13, fontWeight: "bold", color: 'white', textAlign: 'center' }}>
                                    {item.item.content}

                                </Text>
                            </View> */}
                        </View>
                        {
                            location_check != "" ?

                                <View style={{
                                    flex: 0.35, alignItems: 'center',
                                    //  marginBottom: 6

                                }}>
                                    <View style={styles.view_Text_Check_in}>

                                        <View style={{ flex: 1, alignItems: "center", justifyContent: 'center', paddingHorizontal: 13, flexDirection: 'row' }}>
                                            <Image
                                                style={{
                                                    marginTop: 3,
                                                    tintColor: '#00ACC1',
                                                    transform: [{ scale: 0.8 }, { translateY: -2 }, { translateX: 1 }]
                                                }}
                                                resizeMode="contain"
                                                source={Images.check_in} />
                                            <Text numberOfLines={1} style={{ marginLeft: 5, fontSize: 13, fontWeight: "bold", textTransform: 'lowercase' }}>
                                                {item.item.location}</Text>

                                        </View>
                                    </View>
                                </View>
                                :
                                null
                        }
                    </ImageBackground>
                    {
                        item.index === 0 ?
                            <View style={styles.button_post}>

                                <Image style={{ tintColor: '#1877F2', width: 30, height: 30, alignSelf: 'center' }} source={Images.ic_add}></Image>
                            </View>
                            :
                            null
                    }
                </TouchableOpacity>
            </View>
        )
    }
    postCheckIn = () => { showModalPostCheckIn() }
    on_click_Show_he = () => {
        this.setState({
            screenShowAll: !this.state.screenShowAll
        })
    }
    nextScreenUsers = () => {
        pushToUserProfile(this.props.componentId, this.state.itemCheckin.item)
        this.setState({
            modalVisible: !this.state.modalVisible
        })
    }
    renderBottom = () => {
        const { isLoadMore } = this.state
        return (
            <View style={{ width: 10, height: 40, justifyContent: 'center' }}>
                {isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
            </View>
        )
    }
    render() {
        // const { listData } = this.state
        const screenHeight = this.state.screenHeight * 0.9;
        const { highlights_user, Allhighlights } = this.props
        const { itemCheckin } = this.state || []
        let photo_image, content_type, location_type, avatar_test = ""
        let nameUsersScreen = "Bạn"
        if (itemCheckin && itemCheckin.item && itemCheckin.item.username) {
            nameUsersScreen = itemCheckin.item.username
        }
        if (itemCheckin && itemCheckin.item && itemCheckin.item.avatar) {
            avatar_test = itemCheckin.item.avatar
        }

        if (itemCheckin && itemCheckin.item && itemCheckin.item.photo && itemCheckin.item.photo.path && itemCheckin.item.photo.path != "") {
            photo_image = itemCheckin.item.photo.path
        }
        else if (itemCheckin && itemCheckin.item && itemCheckin.item.photo && itemCheckin.item.photo != "") {
            photo_image = itemCheckin.item.photo
        }
        else {
            photo_image = avatar_test
        }
        if (itemCheckin && itemCheckin.item && itemCheckin.item.content) {
            content_type = itemCheckin.item.content
        }
        if (itemCheckin && itemCheckin.item && itemCheckin.item.location) {
            location_type = itemCheckin.item.location
        }
        return (
            <View style={styles.container}>
                {/* <TextInput
                    style={{ width: this.state.textboxWidth }}
                    placeholder="Please type"
                    onChangeText={(text) => this.setState({ text })}
                    value={this.state.text}
                /> */}
                {
                    this.state.modalVisible === false ?
                        <StatusBar hidden={false} backgroundColor={Colors.green_1} />

                        :

                        Platform.OS === 'ios' ?
                            <StatusBar hidden={true} backgroundColor={Colors.green_1} />
                            :
                            <StatusBar hidden={false} backgroundColor="black" />


                }
                <View style={styles.component_post_checkIn}>
                    <Image style={{ width: 24, height: 20, resizeMode: 'cover' }} source={Images.icon_mapmap}></Image>
                    <Text style={styles.text_Check_in_header}> {i18next.t('FeaturedPhoto')}</Text>
                </View>
                <View style={styles.component_body}>
                    {/* {listCheckin.length === 1 ? null :  */}
                    <FlatList
                        removeClippedSubviews={false}
                        // onEndReachedThreshold={0.9}
                        // onEndReached={this.loadMoreCheck}
                        showsHorizontalScrollIndicator={false}
                        refreshing={true}
                        horizontal
                        data={Allhighlights}
                        renderItem={this.renderCheckIn}
                        ListFooterComponent={this.renderBottom}
                    // onRefresh={this.reLoad}
                    // refreshing={this.state.loadMore}
                    >
                    </FlatList>
                    {/* } */}

                </View>
                <Modal
                    // onRequestClose={this.close_show}
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.modalVisible}
                    // animationType={"slide"}
                    style={{
                        width: this.state.screenWidth,
                        height: this.state.screenHeight,
                        backgroundColor: 'black'
                    }}
                >
                    <TouchableHighlight
                        activeOpacity={1}
                        onPress={this.on_click_Show_he}
                        style={{
                            width: this.state.screenWidth,
                            height: this.state.screenHeight,
                            position: 'relative',
                            backgroundColor: 'black',
                            top: 0,



                        }}>
                        <Image
                            source={{ uri: photo_image ? photo_image : null }}
                            style={{ flex: 1, resizeMode: 'contain', position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }} ></Image>
                    </TouchableHighlight>
                    {
                        this.state.screenShowAll ?

                            <TouchableOpacity
                                onPress={this.nextScreenUsers}
                                style={{
                                    flexDirection: 'row',
                                    position: 'absolute',
                                    padding: 10,
                                    top: 5,
                                    left: 8,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Image style={{ width: 40, height: 40, borderRadius: 20 }}
                                    // source={{ uri:itemCheckin.item.username ? nameUsersScreen : null }}
                                    source={{ uri: avatar_test }}
                                ></Image>
                                <Text style={{ fontSize: 15, color: "white", paddingLeft: 10, fontWeight: "500" }}>
                                    {nameUsersScreen}
                                    {/* {itemCheckin.item.username ? nameUsersScreen : i18next.t('You')} */}
                                </Text>
                            </TouchableOpacity>
                            : null
                    }
                    {
                        this.state.screenShowAll ?
                            <TouchableOpacity onPress={this.close_show} style={styles.close_modle}>
                                <Image
                                    style={{ width: 25, height: 25, tintColor: 'black' }}
                                    source={Images.close}
                                />
                            </TouchableOpacity> : null
                    }
                    {
                        this.state.screenShowAll ?
                            <View
                                style={{
                                    flex: 0.3,
                                    position: 'absolute',
                                    bottom: 0,
                                    maxHeight: screenHeight,
                                }}>
                                <ScrollView
                                    style={{ flex: 1, backgroundColor: "#000", opacity: 0.85 }}>
                                    {
                                        !this.state.show_more ?
                                            <View
                                                style={{
                                                    flex: 1,
                                                    flexDirection: 'column', padding: 10
                                                }}>
                                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                                    <View style={{ width: "100%" }}>
                                                        <Text
                                                            onPress={this.on_click_more}
                                                            numberOfLines={1}
                                                            style={styles.after_content
                                                            }>
                                                            {content_type}
                                                        </Text>

                                                    </View>
                                                </View>
                                                <View style={styles.view_location}>
                                                    <Image style={{ tintColor: Colors.green_1 }}
                                                        source={Images.check_in}
                                                    />
                                                    <Text
                                                        onPress={this.on_click_more}
                                                        style={styles.after_location}>
                                                        {location_type}
                                                    </Text>
                                                </View>
                                            </View>
                                            :
                                            <View style={{ width: this.state.screenWidth, padding: 10, marginTop: 15 }}>
                                                <Text
                                                    onPress={this.on_click_more}
                                                    style={styles.after_content}>
                                                    {content_type}
                                                </Text>

                                                <View style={styles.view_location}>
                                                    <Image
                                                        style={{ tintColor: Colors.green_1 }}
                                                        source={Images.check_in}
                                                    />
                                                    <Text
                                                        onPress={this.on_click_more}
                                                        style={styles.after_location}>

                                                        {location_type}
                                                    </Text>
                                                </View>
                                            </View>
                                    }
                                </ScrollView>
                            </View> :
                            null
                    }
                </Modal>
            </View>
        );
    }
}
export default CheckInListComponent;
const styles = StyleSheet.create({
    component_post_checkIn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        marginLeft: 14,
    },
    text_Check_in_header: {
        fontSize: 16,
        marginLeft: 5,
        fontWeight: "bold",
        color: 'black'
    },
    button_post: {
        position: "absolute",
        flexDirection: 'row',
        top: 5,
        right: 5,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#fff',
        justifyContent: "center",
        alignContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 5,
        backgroundColor: 'white',
    },

    component_body: {
        flex: 1,
        marginTop: 14,
        marginBottom: 13,
    },
    buttom_Image_View: {
        width: 130,
        height: 195,
        margin: 5,
        position: 'relative',

    },
    background_Image: {
        borderColor: '#ebebeb',
        borderWidth: 0.3,
        borderRadius: 13,
        flex: 1,
        backgroundColor: "#b3b9ba",
        overflow: 'hidden',
        flexDirection: 'column',
    },
    personalPhoto: {
        height: 34,
        width: 34,

    },
    personal_name: {
        color: 'white',
        fontSize: 13,
        marginTop: 5,
        fontWeight: "500",
    },
    image_in_personalPhoto: {
        height: 34,
        width: 34,
        overflow: 'hidden',
        borderRadius: 17,
        backgroundColor: 'white'
    },
    logo_image_right: {
        position: 'absolute',
        bottom: 0,
        right: 0
    },

    view_Text_Check_in: {
        width: '87%',
        height: 30,
        backgroundColor: 'white',
        borderRadius: 15,
        marginTop: 25,
        flexDirection: 'row'
    },
    add_content: {
        width: 85,
        height: 35,
        borderRadius: 11.5,
        backgroundColor: Colors.green_1,
        justifyContent: 'center',
        marginTop: 4,
        marginLeft: 155,
        borderWidth: 2,
        borderColor: Colors.green_1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
    },
    close_modle: {
        position: 'absolute',
        width: 28,
        height: 28,
        borderRadius: 14,
        top: 15,
        right: 15,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },

    after_content: {
        padding: 10,
        textAlign: 'left',
        paddingBottom: 15,
        color: 'white',
        fontSize: 14,
        shadowColor: "#000",

    },
    after_location: {
        fontSize: 15,
        fontWeight: "600",
        color: 'blue',
        marginLeft: 5,
        borderRadius: 20,
    },
    view_location: {
        backgroundColor: 'white',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        paddingHorizontal: 15,
        paddingVertical: 10
    }
})