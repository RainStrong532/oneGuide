import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Images from '../assets/images'
import { i18next } from '../utils'
import { gotoInvitedEmail, showModalPostCreate } from '../navigation';
import POST_TYPE from '../constants/post-types'
import Colors from '../constants/colors'

class FirstLogin extends Component {

    handleCreatePost = () => {
        //call screen create post
        showModalPostCreate(POST_TYPE.Text)
    }

    handleInvited = () => {
        //call screen Invited

        gotoInvitedEmail(this.props.parentComponentId, {})
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.wrapImage}>
                    <Image
                        source={Images.person_contact}
                        style={styles.imgContent}
                    />
                </View>

                <View style={styles.title}>
                    <Text style={{ fontSize: 22, color: 'black' }}>{i18next.t('ShareYourContent')}</Text>
                </View>
                <View style={styles.subTitle}>
                    <Text style={{ fontSize: 20, color: 'grey' }}>{i18next.t('ExperienceOfImageVideoContent')}</Text>
                </View>
                <View style={styles.wrapFirst}>
                    <TouchableOpacity onPress={this.handleCreatePost}>
                        <Text style={{ fontSize: 20, color: 'blue' }}>{i18next.t('TheFirstPost')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.wrapInvited}>
                    <TouchableOpacity onPress={this.handleInvited}>
                        <Text style={styles.txtInvited}>{i18next.t('InviteYourGuide')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default FirstLogin;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5
    },
    wrapImage: {
        marginVertical: 20,
        alignItems: 'center'
    },
    imgContent: {
        width: 50,
        height: 50
    },
    title: {
        marginVertical: 5,

    },
    subTitle: {

    },
    txtInvited: {
        fontSize: 20,
        color: 'white'
    },
    wrapInvited: {
        borderRadius: 5,
        borderWidth: 0.1,
        backgroundColor: '#007bff',
        marginTop: 10
    },
    wrapFirst: {
        marginVertical: 5
    }
})