import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Colors from '../../constants/colors';
import Device from '../../modules/Device';
import _ from 'lodash';
import FastImage from 'react-native-fast-image'
import Images from '../../assets/images';
import DismissKeyboard from 'dismissKeyboard';

const screenWidth = Device.screenSize().width

export default class ProfileLikeView extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        const nextData = _.get(nextProps, 'item')
        const data = _.get(this.props, 'item')
        return true
    }

    onPressUserProfile = () => {
        DismissKeyboard()
        if (this.props.onPressUserProfile) {
            this.props.onPressUserProfile(this.props.item.user_id)
        }
    }


    onPressChatButon = (item) => {
        DismissKeyboard()
        if (this.props.onPressChatButon) {
            this.props.onPressChatButon(item)
        }
    }

    render() {
        const { avatar, username, user_id } = this.props.item

        return (
            <View style={styles.container}>

                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                    //  containerStyle={{}}
                    onPress={() => { this.onPressUserProfile(user_id) }}>
                    <FastImage
                        source={{ uri: avatar }}
                        style={{ width: 50, height: 50, marginLeft: 10, borderRadius: 25 }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    <View style={styles.info}>
                        <Text style={styles.title}>{username}</Text>
                    </View>

                </TouchableOpacity>
                <View style={styles.rightView}>
                    <TouchableOpacity
                        style={styles.rightButton}
                        onPress={() => { this.onPressChatButon(this.props.item) }} >
                        <Image
                            source={Images.tabbar_inbox}
                            resizeMode='contain'
                            style={{ flex: 1, width: 20, height: 20 }} />
                    </TouchableOpacity>
                </View>

                <View style={styles.borderline}></View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1,
        height: 80,
        alignItems: 'center',
    },
    subContain: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 10,
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        paddingVertical: 2

    },
    time_text: {
        marginLeft: 5,
        fontSize: 15,
        fontWeight: '300'
    },
    detail_text: {
        fontSize: 15,
        fontWeight: '500'
    },
    borderline: {
        height: 0.5,
        borderWidth: 0.5,
        borderColor: Colors.light_gray,
        width: screenWidth,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    },
    rightView: {
        height: 40,
        marginRight: 10,
        borderRadius: 5,

    },
    rightButton: {
        height: 40,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    agentContainer: {
        flexDirection: 'row'
    },
    guideContainer: {
        flexDirection: 'row'
    },
    info: {
        marginLeft: 10,
        justifyContent: 'space-between',
    }

})
