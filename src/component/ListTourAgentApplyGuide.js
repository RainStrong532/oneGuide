import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import HeaderView from './views/HeaderView';
import { i18next, Loading } from '../utils'

import Device from '../modules/Device'
import Colors from '../constants/colors'
import { backScreen } from '../navigation';
import { FlatList } from 'react-native-gesture-handler';
import PostTourView from './post-views/PostTourView';
import Images from '../assets/images'
import Helper from '../utils/Helper'

class ListTourAgentApplyGuide extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listTour: []
        }
    }

    componentDidMount() {
        const data = {
            comment_id: this.props.data.data
        }
        this.props.getListTourApplyGuider(data)
            .then((data) => {
                // console.log("data sau khi api et veef", data);
                this.setState({
                    listTour: data
                })
            })
    }

    onPressBack = () => {
        backScreen(this.props.componentId)
    }

    handleAgentChoseTour = (item) => {
        // const user_id = this.props.data.user_id
        // this.props.
        let data = {
            comment_id: item.comment_id,
            comment_guide_id: this.props.data.data
        }
        this.props.agentApplyTour(data)
            .then(res => {
                // console.log("response sau khi agent mowif treen component", res);
                if (res.data.result == 'success') {

                    let listTour = this.state.listTour
                    let idx = listTour.findIndex(item => item.comment_id == res.comment_id)
                    listTour[idx].user_apply = 'active'
                    this.setState({
                        ...this.state,
                        listTour
                    })
                    // Helper.showErrorAlert('', res.data.messages)
                }
                else {
                    Helper.showErrorAlert('', res.data.messages)
                }
            })
    }
    handleAgentCancelGuider = (item) => {
        let data = {
            comment_id: item.comment_id,
            comment_guide_id: this.props.data.data,
            action: 'agent-cancel'
        }
        this.props.agentApplyTour(data)
            .then(res => {
                // console.log("response sau khi agent mowif treen component", res);
                if (res.data.result == 'success') {

                    let listTour = this.state.listTour
                    let idx = listTour.findIndex(item => item.comment_id == res.comment_id)
                    listTour[idx].user_apply = 'Not active'
                    this.setState({
                        ...this.state,
                        listTour
                    })
                    // Helper.showErrorAlert('', "Bạn đã hủy mời Guider")
                }
                else {
                    Helper.showErrorAlert('', res.data.messages)
                }
            })
    }

    _renderItem = ({ item, index }) => {
        //console.log("item dăng kyssssssssssssssssssssss", item);


        return (
            <View style={{ flex: 1, borderBottomWidth: 7, borderBottomColor: '#f0f6f6', marginBottom: 10 }}>
                <View style={styles.containerTour}>
                    <View style={styles.viewPost}>
                        <View style={styles.title}>
                            <Image style={{ width: 17, height: 17 }}
                                resizeMode="contain"
                                source={Images.tour_name}
                            ></Image>
                            <Text style={styles.text_item}>{item.title}</Text>
                        </View>
                        <View style={styles.title}>
                            <Image style={{ width: 17, height: 17 }}
                                resizeMode="contain"
                                source={Images.tour_calendar}
                            ></Image>
                            <Text style={styles.text_item}>{item.date_tour}</Text>
                        </View>
                        <View style={styles.title}>
                            <Image resizeMode="contain" style={{ width: 17, height: 17 }}
                                source={Images.tour_location}
                            ></Image>
                            <Text style={styles.text_item}>{item.location}</Text>
                        </View>
                        <View style={styles.title}>
                            <Image resizeMode="contain" style={{ width: 17, height: 17 }}
                                source={Images.tour_language}
                            ></Image>
                            <Text style={styles.text_item}>{item.language}</Text>
                        </View>
                        <View style={styles.title}>
                            <Image resizeMode="contain" style={{ width: 17, height: 17, }}
                                source={Images.tour_experience}
                            ></Image>

                            <Text style={styles.text_item}>{item.experience}</Text>
                        </View>

                        <View style={styles.content}>
                            <Text style={styles.content_item}>{item.content}</Text>
                        </View>
                    </View>
                    <View style={styles.action}>
                        {
                            item.user_apply == "Not active" ?
                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#0098ac',
                                    borderRadius: 4,
                                    padding: 5
                                }}>
                                    <TouchableOpacity
                                        // style={styles.btn_slect}
                                        onPress={() => this.handleAgentChoseTour(item)}
                                    >
                                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff', padding: 8 }}>{i18next.t('Mời Guider')}</Text>
                                    </TouchableOpacity>

                                </View> : null

                        }

                        {
                            item.user_apply == "active" ?
                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#0098ac',
                                    borderRadius: 4,
                                    padding: 5,



                                }}>
                                    <TouchableOpacity
                                        // style={styles.btn_slect}
                                        onPress={() => this.handleAgentCancelGuider(item)}
                                    >
                                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff', padding: 8 }}>{i18next.t('Đã mời')}</Text>
                                    </TouchableOpacity>

                                </View> : null

                        }


                    </View>
                </View>
            </View>
        )
    }

    _keyExtractor = (item, index) => index.toString();
    render() {
        const { listTour } = this.state || []
        let checkdata = []
        if (listTour) {
            checkdata = listTour
        }


        return (
            <View style={{ flex: 1 }}>

                <HeaderView
                    title={i18next.t('TourListInvites')}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                    back={true}
                    onPressLeftBarButton={this.onPressBack}
                />
                <View style={
                    // { flex: 1 }
                    checkdata.length == 0 ? styles.view_ok : styles.view_no

                }>
                    {checkdata.length == 0 ?
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
                            <Image style={{ width: 150, height: 150, tintColor: '#A5A8A8', alignSelf: 'center' }} source={Images.travel_end}></Image>
                            <Text style={{ paddingTop: 20, textAlign: "center" }}> {i18next.t('TourIsNotAvailableRightNow')}</Text>
                        </View>
                        :
                        <FlatList
                            removeClippedSubviews={false}
                            data={this.state.listTour}
                            renderItem={this._renderItem}
                            keyExtractor={this._keyExtractor}
                        />
                    }
                </View>

            </View >
        );
    }
}

export default ListTourAgentApplyGuide;

const styles = StyleSheet.create({
    view_ok: {
        flex: 1
    },
    view_no: {
        paddingBottom: 120
    },
    containerTour: {
        margin: 10
    },
    btn_slect: {
        justifyContent: 'center',
        alignItems: 'center',
        // width: 120,
        // height: 35,
        backgroundColor: '#0098ac',
        borderRadius: 4,

    },
    btn_cancel: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 120,
        height: 35,
        backgroundColor: '#999999',
        borderRadius: 4,
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 7

    },
    text_item: {
        marginLeft: 10,
        fontSize: 13,

    },
    action: {
        flex: 1,
        // flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        //
        // backgroundColor: 'red',
        borderTopColor: '#CDD0D0',
        borderTopWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        paddingTop: 10
    },
    content_item: {
        fontSize: 13,
        marginTop: 10
    }
})