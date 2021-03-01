import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native'
import Colors from '../constants/colors'
import Images from '../assets/images'
import Device from '../modules/Device'

const statusBarHeight = Device.statusBarSize().height
const topBarHeight = Device.topBarSize().height

class HeaderVer2 extends Component {
    render() {
        return (
            <View style={styles.container} >
                <View style={styles.wrapAvatar}>
                    {/* <Image
                        source={Images.icon_email}
                        style={styles.avatar}
                        resizeMode="contain"
                    /> */}
                </View>
                <View style={styles.wrapLogo}>
                    <Image
                        source={Images.logo_game}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.wrapSearchChat}>
                    <View style={styles.wrapSearch}>
                        {/* <Image
                            source={Images.logo_search_header}
                            style={styles.search}
                            resizeMode="contain"
                        /> */}
                    </View>
                    {/* <View style={styles.wrapChat}>
                        <Image
                            source={Images.logo_chat_header}
                            style={styles.chat}
                            resizeMode="contain"
                        />
                    </View> */}
                </View>
            </View>
        );
    }
}

export default HeaderVer2;

const styles = StyleSheet.create({

    container: {
        //flex: 1,
        backgroundColor: Colors.green_1,
        paddingTop: 20,
        // marginBottom: 20,
        flexDirection: 'row',

        height: 76,
        justifyContent: "center",


    },
    wrapAvatar: {
        flex: 1,
        // borderWidth: 1,
        // borderColor: 'red',
        alignItems: 'center',
        // textAlign: 'center',
        justifyContent: 'center'
    },
    wrapLogo: {
        flex: 4,
        // borderWidth: 1,
        // borderColor: 'blue',
        alignItems: 'center',
        // textAlign: 'center',
        justifyContent: 'center'
    },
    wrapSearchChat: {
        flex: 1,
        // borderWidth: 1,
        // borderColor: 'black',
        alignItems: 'center',
        // textAlign: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginRight: 10
    },

    avatar: {
        width: 30,
        height: 30,
    },
    logo: {
        width: '70%',
        transform: [
            {
                scale: 0.95
            }
        ]
    },
    search: {
        width: '100%',
        height: 25
    },
    chat: {
        width: '100%',
        height: 25
    },
    wrapSearch: {
        flex: 1,
        marginRight: 5
    },
    wrapChat: {
        flex: 1,

    }

})