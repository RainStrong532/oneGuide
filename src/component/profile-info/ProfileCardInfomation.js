


import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import Device from '../../modules/Device'
import CommonStyles from '../../constants/styles'
import { i18next } from '../../utils'
import DateHelper from '../../utils/DateHelper'
import _ from 'lodash'
import TextInputForm from '../views/TextInputForm';
import { pushToAccountVerify } from '../../navigation'

export default class ProfileCardInfomation extends Component {

    static propTypes = {
        phone: PropTypes.string,
        email: PropTypes.string,
        address: PropTypes.string,
        onChangePhoneNumber: PropTypes.func,
        onChangeEmail: PropTypes.func,
        onChangeAddress: PropTypes.func
    }

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const shouldUpdate = (
            nextProps.phone !== this.props.phone ||
            nextProps.email !== this.props.email ||
            nextProps.address !== this.props.address
        )
        return shouldUpdate
    }
    handleVeryfiAccount = () => {
        pushToAccountVerify(this.props.componentId)
    }

    render() {
        // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@', this.props.website);
        return (
            <View style={[this.props.style, styles.container]}>
                <View style={styles.contactInfo}>
                    <Image
                        style={{ marginLeft: 10, alignSelf: 'center', width: 15, height: 15 }}
                        source={Images.person_contact}
                        resizeMode='stretch'
                    />
                    <Text style={{ marginLeft: 5, fontSize: 16, fontWeight: '500' }}>
                        {i18next.t('CardInformation')}
                    </Text>
                </View>
                {
                    this.props.is_verify == 1
                        ?
                        <View>
                            <View style={styles.containView}>
                                <Text style={styles.txtTitle}>{i18next.t('CardNumber')}</Text>
                                <View style={styles.buttonRight}>
                                    <TextInput
                                        style={styles.textInputForm}
                                        numberOfLines={1}
                                        value={this.props.card}
                                        editable={false}
                                    />
                                    <View style={styles.lineBottomText}></View>
                                </View>
                            </View>
                            <View style={styles.containView}>
                                <Text style={styles.txtTitle}>{i18next.t('NameOnTheCard')}</Text>
                                <View style={styles.buttonRight}>
                                    <TextInput
                                        style={styles.textInputForm}
                                        value={this.props.card_name}
                                        editable={false}
                                    />
                                    <View style={styles.lineBottomText}></View>
                                </View>
                            </View>

                            <View style={styles.containView}>
                                <Text style={styles.txtTitle}>{i18next.t('CardType')}</Text>
                                <View style={styles.buttonRight}>
                                    <Text
                                        style={styles.textInputFormEmail}
                                    >{this.props.card_type}</Text>
                                    <View style={styles.lineBottomText}></View>
                                </View>

                            </View>

                            <View style={styles.containView}>
                                <Text style={styles.txtTitle}>{i18next.t('ExpiryDate')}</Text>
                                <View style={styles.buttonRight}>
                                    <Text
                                        style={styles.textInputFormEmail}
                                    >{this.props.card_expried}</Text>
                                    <View style={styles.lineBottomText}></View>
                                </View>

                            </View>
                        </View>
                        :
                        <TouchableOpacity
                            onPress={this.handleVeryfiAccount}
                            style={{
                                alignItems: 'center',
                                marginTop: 20,
                            }}
                        >
                            <Text
                                style={{
                                    color: Colors.blue_1,
                                    fontWeight: '400',
                                    fontSize: 16
                                }}
                            >
                                {i18next.t('NeedToVerify')}
                            </Text>
                        </TouchableOpacity>
                }
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 5,
        flexDirection: 'column',
        backgroundColor: Colors.white,
        // height: 250,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        marginLeft: 15,
        marginRight: 15,
        paddingBottom: 30,
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
        justifyContent: 'center'
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
        color: Colors.black
    },
    textInputFormEmail: {
        fontSize: 14,
        // height: 35,
        justifyContent: 'center',
        paddingHorizontal: 0,
        paddingVertical: 0,
        color: Colors.black
    },
    lineBottomText: {
        height: 0.5,
        borderWidth: 0.5,
        borderColor: Colors.gray_1
    },
    txtTitle: {
        // fontWeight: 'bold',
        fontSize: 12,
        marginHorizontal: 15,
    },
    contactInfo: {
        height: 50,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        alignItems: 'center'
    },
    imgEdit: {
        //justifyContent: 'flex-end'
        width: 10,
        height: 10
    },
    wrapEdit: {
        flex: 1,
        justifyContent: 'center'
    }
});
