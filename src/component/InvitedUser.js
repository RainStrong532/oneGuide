import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import i18next from 'i18next'
// import FastImage from 'react-native-fast-image';
import image from '../assets/images'
import Colors from '../constants/colors';
class InvitedUser extends Component {

    state = {
        isSuccess: false,
    }

    sendEmail = () => {
        const { sendEmail, txtSearch } = this.props;
        sendEmail(txtSearch).then(
            response => {
                this.setState({
                    isSuccess: response.status === 'RESULT_OK',
                })
            }
        )
    }

    _renderContent = () => {
  
        return (
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    <Image
                        source={image.icon_email}
                        style={styles.image}
                        resizeMode={"contain"}
                    />
                </View>
                <View>
                    <Text style={styles.descTxt}>{i18next.t('ExistEmail')}</Text>
                    <Text style={styles.descTxt}>
                        <Text>{i18next.t('InvitedUser')}</Text>
                    </Text>
                    <Text style={{ ...styles.descTxt, fontWeight: 'bold' }}>{this.props.txtSearch}</Text>
                </View>
                <View>
                    {
                        this.state.isSuccess
                            ? <Text style={styles.statusText}>{i18next.t('statusSendEmail')}</Text>
                            : <TouchableOpacity style={styles.btnSend} onPress={this.sendEmail}>
                                <Text style={styles.btnText}>{i18next.t('SubmitEmail')}</Text>
                            </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }

    shouldComponentUpdate = (nextProps) => {
        if (nextProps.txtSearch !== this.props.txtSearch) {
            this.setState({
                isSuccess: false
            })
        }
        return true
    }

    render() {

        const { isVisible } = this.props



        return (
            <View>
                {isVisible
                    ? this._renderContent()
                    : null
                }
            </View>

        );
    }
}

export default InvitedUser;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'black', borderBottomWidth: 1,
        borderTopColor: 'black', borderTopWidth: 1,
        height: 80,
    },
    imageContainer: {
        // borderRadius: 15,
        // alignContent:'center'
    },
    image: {
        width: 40,
        height: 40,
    },
    descTxt: {
        fontSize: 16,
    },
    btnSend: {
        borderRadius: 4,
        height: 30,
        padding: 15,
        backgroundColor: Colors.blue,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
    },
    statusText: {
        fontSize: 16,
        color: '#385898',
    }
})