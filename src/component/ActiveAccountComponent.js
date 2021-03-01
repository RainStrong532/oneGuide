import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Dimensions } from 'react-native'
import Colors from '../constants/colors'
import Images from '../assets/images'
import HeaderView from '../component/views/HeaderView'
import { i18next, Loading } from '../utils'
import { gotoLoginScreen, setRootToHomeScreen } from '../navigation'
import Helper from '../utils/Helper'

class ActiveAccountComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pass_reset_key: '',
            count: 30,
            isResend: false
        }
    }

    onPressBack = () => {
        // backScreen(this.props.componentId)
    }
    handleConfirmAccount = () => {
        if (this.state.pass_reset_key === '') {
            Helper.showErrorAlert('', i18next.t('Chưa nhập mã xác nhận'))
        }
        else {
            let dataConfirm = {
                pass_reset_key: this.state.pass_reset_key,
                // user_id: this.state.user_id
            }
            this.props.confirmAccount(dataConfirm)
                .then(response => {
                    // console.log("response confirrm max xacs nhan", response);
                    if (response.result == "error") {
                        Helper.showErrorAlert('', "Mã kích hoạt sai, vui lòng thử lại")
                        this.setState({ pass_reset_key: '' })
                    }

                    if (response.result == "success") {
                        const callBack = () => {

                            this.doGetMyInfo()
                        }
                        Helper.showErrorAlert('', "Kích hoạt tài khoản thành công", callBack)
                    }

                })
        }

    }



    doGetMyInfo = async () => {
        // request
        this.props.getMyInfo()
            .then(data => {
                // console.log("dataloadApp sau khi nhập ma kich hoat", data);
                // Loading.hideHud()
                setRootToHomeScreen(data)
            })
    }

    cancelActive = () => {
        gotoLoginScreen(this.props.componentId)
    }
    // shouldComponentUpdate = (nextProps, nextState) => {
    //     console.log("next State thay dooir", nextState);
    //     if (nextState.count == 0 && nextState.isResend !== this.state.isResend) {
    //         this.setState({
    //             isResend: false
    //         })
    //     }
    //     return true
    // }
    resendEmail = () => {
        // this.setState({
        //     isResend: true
        // }) 
        Loading.showHud()
        this.props.resendEmail(this.props.data)
            .then((response) => {
                Loading.hideHud()
                if (response.data && response.data.result == 'Succes') {

                    Helper.showErrorAlert('', 'Vui long kiểm tra lại email để lấy lại mã kích hoạt !')
                }
            })
        // setInterval(() => {
        //     this.setState({
        //         count: this.state.count - 1
        //     })
        // }, 1000);
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderView
                    title={i18next.t('Kích hoạt tài khoản').toUpperCase()}
                    style={{ fontSize: 20 }}
                    // back
                    onPressLeftBarButton={this.onPressBack}
                />
                <View style={styles.wrapContainer}>
                    <Image
                        style={{ alignSelf: 'center', width: 200, height: 200, }}
                        source={Images.logo_splash_oneguide}
                        resizeMode='contain'
                    />

                    <View style={styles.wrapText}>
                        <TextInput
                            placeholder='Nhập mã xác nhận từ email'
                            style={{
                                height: 50, borderColor: 'gray',
                                borderWidth: 1, borderRadius: 5, width: '70%',
                                fontSize: 16, textAlign: 'center'
                            }}
                            onChangeText={(pass_reset_key) => this.setState({ pass_reset_key })}
                            value={this.state.pass_reset_key}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 42, alignItems: 'center', justifyContent: "center", }}>
                        <View style={{ marginRight: 5 }}>
                            <TouchableOpacity
                                onPress={this.cancelActive}
                            ><Text
                                style={{
                                    fontSize: 20, borderRadius: 10,
                                    padding: 10,
                                    elevation: 2,
                                    backgroundColor: "#9e9e9e",
                                    color: "white",
                                    fontWeight: "bold",
                                }}>{i18next.t('Cancel')}</Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <TouchableOpacity
                                onPress={this.handleConfirmAccount}
                            >
                                <Text style={{
                                    fontSize: 20, borderRadius: 10,
                                    padding: 10,
                                    elevation: 2,
                                    backgroundColor: Colors.green_1,
                                    color: "white",
                                    fontWeight: "bold",
                                }}>Xác nhận</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={this.resendEmail}
                        // disabled={this.state.isResend}
                        style={{ alignItems: 'center', marginTop: 15 }}>

                        <Text>Lấy lại mã xác nhận? <Text style={{ color: '#03a9f4' }}>Nhấn vào đây</Text></Text>
                    </TouchableOpacity>
                    {
                        // this.state.isResend && this.state.count > 0 ?
                        //     <View style={{ alignItems: 'center', marginTop: 10 }}>
                        //         <Text>Gửi lại mã sau {this.state.count}s .</Text>
                        //     </View>
                        //     : null
                    }
                </View>
            </View>
        );
    }
}
export default ActiveAccountComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    wrapContainer: {

    },
    wrapText: {
        alignItems: "center",
        justifyContent: 'space-between'
    }
});