import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, TextInput, Dimensions, ActivityIndicator, ScrollView, } from 'react-native'
import HeaderView from './views/HeaderView'
import { i18next, Loading } from '../utils'
import Colors from '../constants/colors'
import Images from '../assets/images'
import { showModalCommentReport, backScreen, showRegisterSelectCard, gotoChatScreen, pushReviewComponent, pushToUserProfile, dimissModal } from '../navigation'
import _ from 'lodash'
import { connect } from 'socket.io-client'
import { Alert } from 'react-native'
import Helper from '../utils/Helper';

export default class ReportComponent extends Component {


    state = {
        content: this.props.data.item && this.props.data.item.reports_info ? this.props.data.item.reports_info.draft : '',
        draft: '',
        editable: false,
        isLoading: false,
        autofocus: false,
        disable: true,
        showEdit: false
    }


    componentDidMount() {
        // console.log("this1111111111111111", this.props.data);
        // const comment_id = _.get(this.props, 'data.comment_id')
        // this.doGetListReport(comment_id)
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (!nextState.content) {
    //         this.setState({
    //             editable: nextState.content ? false : true,
    //             autofocus: nextState.content ? false : true
    //         })
    //     }

    //     return true
    // }

    doGetListReport = (comment_id) => {
        const is_agent = _.get(this.props, 'user.me.is_agent') || ''
        const user_id = _.get(this.props, 'user.me.user_id') || ''
        this.props.getListReport({ comment_id })
            .then(res => {

                if (is_agent == 1) {
                    const userReport = res.find(user => user.user_id == user_id)
                    // console.log(res, 'find thanh cong', userReport);
                    this.setState({
                        content: userReport.content,
                        // editable: this.state.content ? false : true,
                        // autofocus: this.state.content ? false : true
                    }, () => {
                        this.setState(
                            {
                                editable: this.state.content ? false : true,
                                autofocus: this.state.content ? false : true
                            }
                        )
                    })
                }

                this.setState({
                    isLoading: true
                })

            })
            .catch(err => {
                this.setState({
                    isLoading: true
                })
                // console.log('bi loi o phan lay ra danh sach nguowi danh gia', err);
            })
    }

    onPressBackScreen = () => {
        showModalCommentReport(this.onPressSendFace, this.backScreenSea, this.props.passPropsScreen)
        // Helper.showAlert('', i18next.t('Bạn có muốn lưu nháp'),
        //     [
        //         {
        //             text: i18next.t('Ok'), onPress: () => {
        //                 // dimissModal(this.props.componentId)
        //                 this.onPressSendReport('1')
        //                 dimissModal(this.props.componentId)
        //             }
        //         },
        //         {
        //             text: i18next.t('Cancel'), onPress: () => {
        //                 dimissModal(this.props.componentId)
        //             }
        //         },

        //     ]
        // )
    }
    onPressSendFace = () => {
        this.onPressSendReport('1')
    }
    onPressSaveSend = () => {
        Loading.showHud();
        this.props.passPropsScreen()
        this.onPressSendReport('0')
    }
    backScreenSea = () => {
        dimissModal(this.props.componentId)
    }

    onPressSendReport = (type, back) => {
        // console.log('type type type type type', type);


        const comment_id = _.get(this.props, 'data.item.comment_id')
        const content = _.get(this.state, 'content')

        const data = {
            is_draft: type,
            comment_id,
            content
        }

        this.props.sendReport(data)
            .then(res => {

                dimissModal(this.props.componentId)
            })

            .catch(err => {
                // console.log('send that bai', err);
            })


    }

    onPressChatButon = () => {

        const conversation_id = _.get(this.props.data, 'conversation_id');
        const display_name = _.get(this.props.data, 'display_name');
        const user_id = this.props.data.user_id;
        const room = {
            user_id: user_id,
            name_list: display_name,
            conversation_id
        }
        gotoChatScreen(this.props.componentId, room)
    }

    onPressAgree = () => {
        pushReviewComponent(this.props.componentId, this.props.data, true)
    }

    onPressUser = () => {
        pushToUserProfile(this.props.componentId, { user_id: this.props.data.user_id })
    }
    handleCance = () => {
        dimissModal(this.props.componentId)
    }

    render() {
        let { content, isLoading } = this.state
        const { display_name, avatar, send_date } = this.props.data
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#F1F7F5',
                }}
            >
                <HeaderView
                    titleRight={i18next.t('SubmitEmail')}
                    title={i18next.t('Report')}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                    back={true}
                    onPressLeftBarButton={this.onPressBackScreen}
                    onPressRightBarButton={this.onPressSaveSend}
                />
                < ScrollView>
                    <View style={{ margin: 10, padding: 10, borderColor: Colors.gray_3, borderWidth: 0.8, borderRadius: 5, backgroundColor: Colors.white }}>
                        <TextInput
                            multiline
                            style={{
                                textAlignVertical: 'top',
                            }}
                            autoFocus={this.autoFocus}
                            placeholder={i18next.t('ImportContent')}
                            selectionColor={Colors.black}
                            value={this.state.content}
                            onChangeText={(text) => this.setState({
                                content: text
                            })}
                            underlineColorAndroid='transparent'
                            numberOfLines={6}
                        />
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({

})