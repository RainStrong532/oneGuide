import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, ImageBackground, FlatList, StatusBar } from 'react-native';
import { backScreen, showMoreOptionsPost, } from '../navigation';
import Images from '../assets/images';
import { i18next } from '../utils';
import Helper from '../utils/Helper';
import Colors from '../constants/colors';
import HeaderView from '../component/views/HeaderView';
class InformationGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataAGroup: {},
            setRequest: '',
            data_last: {},
            checkInvitedGroup: '',
            check_success: true
        }
    }

    onPressBack = () => {
        backScreen(this.props.componentId)
    }

    componentDidMount = () => {
        // console.log("this.props.data.passProps.id ::::::::::::::::", this.props.data.passProps);
        this.props.getInfomationGroup(this.props.data.passProps.id)
        this.setState({
            setRequest: this.props.data.passProps.submitted_request,
            checkInvitedGroup: this.props.data.passProps.checkInvitedGroup

        })
    }

    renderItems = ({ item }) => {


        return (
            <View style={{ flexDirection: 'row', padding: 10 }}>
                <Image style={{ width: 22, height: 22, borderRadius: 11 }} source={{ uri: item.avatar }}>
                </Image>
                <Text style={{ fontSize: 17, marginLeft: 3 }}>{item.username}</Text>
            </View>
        )

    }
    joinGroup = (dataGroup) => {
        this.props.joinGroupContainer(this.props.data.passProps.id)
        this.setState({
            setRequest: 'yes',
            checkInvitedGroup: "0"
        })
        if (this.props && this.props.callback && this.props.callback.joinGroup) {
            this.props.callback.joinGroup(this.props.data.passProps.id)
        }
    }
    outGroup = (dataGroup) => {

        this.setState({
            setRequest: 'no',
            checkInvitedGroup: "0"
        })
        this.props.outGroupContainer(
            this.props.data.passProps.id
        )
        if (this.props && this.props.callback && this.props.callback.outGroup) {
            this.props.callback.outGroup(this.props.data.passProps.id)
        }
    }
    outGroupInvite = (dataGroup) => {

        this.setState({
            setRequest: 'no',
            checkInvitedGroup: "0"
        })
        this.props.outGroupInviteContainer(
            this.props.data.passProps.id
        )
        this.props.outGroupContainer(
            this.props.data.passProps.id
        )
        if (this.props && this.props.callback && this.props.callback.outGroup) {
            this.props.callback.outGroup(this.props.data.passProps.id)
        }
    }
    alertOutInviteGroup = (dataGroup) => {
        Helper.showAlert('', i18next.t('AreYouSureRequest'),
            [
                { text: i18next.t('No'), onPress: null },
                { text: i18next.t('CancelRequest'), onPress: this.outGroupInvite }
            ])
    }
    alertOutGroup = (dataGroup) => {
        Helper.showAlert('', i18next.t('AreYouSureRequest'),
            [
                { text: i18next.t('No'), onPress: null },
                { text: i18next.t('CancelRequest'), onPress: this.outGroup }
            ])
    }
    render() {
        const { passProps } = this.props.data || {}
        const { dataAGroup, data_last } = this.state || {}
        const { infoGroup } = this.props || {}
        let screenGroup = ''
        if (infoGroup && infoGroup.background) screenGroup = infoGroup.background
        let dataAmin = infoGroup.admin || []
        return (
            <ScrollView>
                <View>
                    <ImageBackground style={styles.img_backgroud}
                        source={{ uri: screenGroup }}
                    >
                        <TouchableOpacity
                            onPress={this.onPressBack}
                            style={styles.back_img}><Image style={{
                                tintColor: '#fff', width: 20, height: 20


                            }}
                                source={Images.back}>

                            </Image>
                        </TouchableOpacity>

                    </ImageBackground>
                </View>

                <View style={styles.container_name_group}>
                    <Text style={styles.name_group}>
                        {infoGroup.title}
                    </Text>
                    <Text style={styles.member_group}> {infoGroup.total_member} {i18next.t('Memberv')}</Text>
                </View>
                {
                    this.state.checkInvitedGroup == "0" ?

                        <View style={styles.container_join_the_group}>
                            {
                                this.state.setRequest == "no" ?
                                    <TouchableOpacity style={styles.btn_join_the_group}
                                        onPress={() => this.joinGroup(this.props.data.passProps.id)}
                                    >
                                        <Text style={{ color: "#fff" }}>{i18next.t('JoinGroup')}</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={styles.btn_out_the_group}
                                        onPress={() => this.alertOutGroup(this.props.data.passProps.id)}
                                    >
                                        <Text style={{ color: '#000' }}>{i18next.t('CancelRequest')}</Text>
                                    </TouchableOpacity>
                            }
                        </View>
                        :
                        <View style={styles.container_join_the_group_row}>
                            <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 3 }}>{i18next.t('YouHaveAnInvitationToJoinTheGroup')} </Text>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={styles.btn_invite_join}
                                    onPress={() => this.joinGroup(this.props.data.passProps.id)}
                                >
                                    <Text style={{ alignSelf: 'center', color: "#fff" }}>{i18next.t('Confirm')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btn_invite_out}
                                    onPress={() => this.alertOutInviteGroup(this.props.data.passProps.id)}
                                // onPress={() => this.alertOutInviteGroup(passProps.id)}
                                // onPress={() => this.alertOutGroup(this.props.data.passProps)}
                                >
                                    <Text style={{ alignSelf: 'center', color: '#000' }}>{i18next.t('Cancel')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                }
                <View style={styles.Introduction}>
                    <Text style={{ fontSize: 20, fontWeight: '600', color: '#000' }}>{i18next.t('Introduction')}</Text>
                    <View style={styles.history}>
                        <View style={{ marginLeft: 4 }}>
                            <Text style={{ fontSize: 19, color: '#000' }}>{i18next.t('History')} </Text>
                            <Text style={{ fontSize: 16 }}>{i18next.t('DateRaning')}: {infoGroup.date_create}</Text>

                        </View>
                    </View>
                    <View style={{ padding: 13 }}>
                        <Text style={{ fontSize: 19, color: '#000' }}>{i18next.t('GroupInformation')} :</Text>
                        <Text style={{ fontSize: 17 }}> {infoGroup.intro}</Text>

                    </View>
                    <View >
                        {
                            dataAmin && dataAmin.length != 0
                                ?
                                <View style={{ marginTop: 15 }} >
                                    <Text style={{
                                        fontSize: 20, fontWeight: '600',
                                        color: '#000', marginBottom: 4

                                    }}>{i18next.t('Administrators')}</Text>
                                    <FlatList
                                        removeClippedSubviews={false}
                                        data={dataAmin}
                                        renderItem={this.renderItems}
                                    />
                                </View>
                                :
                                null
                        }
                    </View>
                    <View style={{ marginTop: 15 }}>
                        <View>
                            <Text style={{ fontSize: 20, fontWeight: '600', color: '#000' }}>{i18next.t('Groupactivities')}</Text>
                            <View style={{ flex: 1, flexDirection: 'row', marginTop: 10, marginLeft: 10 }}>
                                <Image source={Images.person_info}></Image>
                                <Text style={{ marginLeft: 5 }}> {i18next.t('TotalNumberOfGroupmMembers')}: {infoGroup.total_member}</Text>
                            </View>
                        </View>
                    </View>
                </View>

            </ScrollView>
        );
    }
}

export default InformationGroup;
const styles = StyleSheet.create({
    img_backgroud: {
        height: 200
    },
    Introduction: {
        padding: 10,
        marginTop: 20,
        borderTopColor: '#90949c',
        borderTopWidth: 1,
    },
    history: {
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 10

    },
    back_img: {
        top: 25,
        left: 10,
        width: 40, height: 40, borderRadius: 20, opacity: 0.5,
        backgroundColor: '#000', flexDirection: 'row',
        justifyContent: 'center', alignItems: "center"
    },
    btn_join_the_group: {
        marginTop: 15,
        backgroundColor: '#00a5ba',
        borderRadius: 5,
        width: 300,
        height: 30,
        justifyContent: 'center',
        alignItems: "center"
    },
    btn_out_the_group: {
        marginTop: 15,
        backgroundColor: "#D8DADF",
        borderRadius: 5,
        width: 300,
        height: 30,
        justifyContent: 'center',
        alignItems: "center",

    },
    btn_invite_join: {
        marginTop: 7,
        backgroundColor: '#00a5ba',
        borderRadius: 5,

        padding: 10,
        width: 100
    },
    btn_invite_out: {
        marginLeft: 10,
        marginTop: 7,
        backgroundColor: "#D8DADF",
        borderRadius: 5,

        padding: 10,
        width: 70

    },
    invite_group_commit: {
        marginTop: 15,
        backgroundColor: '#00a5ba',
        borderRadius: 5,
        width: 50,
        height: 35,
        justifyContent: 'center',
        alignItems: "center"
    },
    invite_group_close: {
        marginTop: 15,
        backgroundColor: "#D8DADF",
        borderRadius: 5,
        width: 50,
        height: 35,
        justifyContent: 'center',
        alignItems: "center",

    },
    container_name_group: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        paddingLeft: 70,
        paddingRight: 70
    },
    name_group: {
        fontSize: 24,
        fontWeight: "700",
        textAlign: 'center',
        color: 'black'
    },
    container_join_the_group: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    container_join_the_group_row: {
        justifyContent: 'center',
        alignItems: 'center',


    },
    container_join_the_group_invite: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'

    },
    member_group: {
        marginTop: 5,

    },
})