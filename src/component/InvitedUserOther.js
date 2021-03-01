import React, { Component } from 'react';
import HeaderView from './views/HeaderView';
import Images from '../assets/images'
import Colors from '../constants/colors'
import DismissKeyboard from 'dismissKeyboard';
import { TextInput, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { backScreen } from '../navigation'
import { connect } from 'react-redux';
import { i18next } from '../utils'
import { sendEmail } from '../actions';
import _ from 'lodash'

class InvitedUserOther extends Component {

    state = {
        txtInput: '',
        isSuccess: false,
        successPeoples: []
    }

    onPressBack = () => {
        DismissKeyboard()
        backScreen(this.props.componentId)
    }

    onChangeText = (text) => {
        this.setState({ txtInput: text, })
    }

    handlePressSendEmail = (email) => {
        this.props.sendEmail(email)
            .then(response => {
                if (response.status === 'RESULT_OK') {
                    let message = response.message === "Đang là bạn bè"
                        ? "Người dùng đã tồn tại trong hệ thống"
                        : "Đã gửi email mời tham gia"
                    this.setState(prevState => ({
                        successPeoples: prevState.successPeoples.concat([{ email, message }])
                    }))
                }
            })
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return this.state.txtInput !== nextState.txtInput
            || this.state.successPeoples.length !== nextState.successPeoples.length
    }

    renderEmail = () => {
        if (!this.state.txtInput) {

            return null
        }
        if (this.state.txtInput.match(/^[a-zA-Z0-9!#$%&'*+-/=?^_`{|}~\.]+@[a-zA-Z]+\.[^ ]+$/)) {

            return (
                <TouchableOpacity
                    style={{ ...styles.showInput, backgroundColor: Colors.green_1 }}
                    onPress={() => this.handlePressSendEmail(this.state.txtInput)}>
                    <Image
                        resizeMode="contain"
                        source={Images.icon_email_2}
                        style={styles.icon}
                    />
                    <Text
                        style={styles.validEmailTxt}>
                        {this.state.txtInput}
                    </Text>
                </TouchableOpacity>
            )
        }
        // Warning item
        return (
            <View style={styles.showInput}>
                <Image
                    resizeMode="contain"
                    source={Images.warningEnd}
                    style={styles.icon}
                />
                <View style={styles.wrapTxt}>
                    <Text
                        style={styles.invalidEmail}>
                        {this.state.txtInput}
                    </Text>
                    <Text style={styles.subTxt}>
                        {i18next.t('PleaseEnterTheCorrectEmailAddress')}
                    </Text>
                </View>

            </View>
        )
    }



    render() {
        const peoples = _.uniqBy(this.state.successPeoples, "email").map((obj, idx) => {

            const firstCharacterEmail = obj.email.split("")[0]

            return (
                <View key={idx} style={styles.outputEmail}>
                    <View style={styles.wrapAvatar}>
                        <View style={styles.wrapName}>
                            <Text style={styles.nameTxt}>{firstCharacterEmail}</Text>
                        </View>
                    </View>
                    <View style={styles.info}>
                        <Text style={{ fontWeight: "bold", fontSize: 14 }}>{obj.email}</Text>
                        <Text style={{ fontSize: 12 }}>{obj.message}</Text>
                    </View>

                </View>
            )
        })

        return (
            <View styly={styles.container}>
                <HeaderView
                    title={i18next.t('InvitedHeader')}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                    back={true}
                    onPressLeftBarButton={this.onPressBack}
                />
                <View style={styles.wrapInput}>
                    {/* <Text style={styles.txtTitle}>
                        Mời hướng dẫn viên tham gia cùng bạn.
                    </Text>
                    <Text style={styles.txtTitle}>
                        Bạn càng mời được nhiều người, cuộc trò chuyện sẽ càng sôi nổi.
                    </Text>
                    <Text style={styles.txtTitle}>
                        Bạn có thể mời bất cứ ai mà bạn biết.
                    </Text> */}
                    <TextInput
                        style={styles.txtInput}
                        onChangeText={(text) => this.onChangeText(text)}
                        autoCapitalize='none'
                        keyboardType='email-address'
                        placeholder='Nhập email mời tham gia'
                    />
                    {this.renderEmail()}
                    {peoples}
                </View>
            </View>
        );
    }
}


const mapStateToProps = state => {
    //const { user, posts } = state
    return {

    };
};

const InvitedUserContainer = connect(
    mapStateToProps,
    {
        sendEmail,
    }
)(InvitedUserOther);

export default InvitedUserContainer;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    txtTitle: {
        textAlign: 'center',
        marginHorizontal: 10,
    },
    txtInput: {
        borderWidth: 0.5,
        padding: 5,
        height: 40,
        marginTop: 20,
        borderRadius: 5
    },
    showInput: {
        flexDirection: 'row',
        height: 50,
        padding: 5,
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1,
    },
    icon: {
        width: 30,
        height: 30
    },
    wrapInput: {
        flex: 1,
        paddingHorizontal: 10,
    },
    wrapTxt: { marginLeft: 5 },
    subTxt: { color: '#888' },
    invalidEmail: {
        color: 'red',
        fontSize: 14,
    },
    validEmailTxt: {
        color: 'white',
        fontSize: 14,
        marginLeft: 5,
    },
    outputEmail: {
        height: 60,
        borderWidth: 0.5,
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: 'row'
    }, wrapAvatar: {
        backgroundColor: "gray",
        width: 40,
        height: 40,
        borderRadius: 20,
        position: "relative",
        paddingLeft: 10
    },
    wrapName: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        width: 40,
        height: 40,
    },
    nameTxt: {
        color: "white",
        fontSize: 20,
    },
    info: {
        paddingLeft: 10
    }
})