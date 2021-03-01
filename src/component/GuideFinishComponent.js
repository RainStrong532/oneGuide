import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Platform, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native'
import HeaderView from './views/HeaderView';
import _ from 'lodash'
import { i18next, Loading } from '../utils'

import Helper from '../utils/Helper';
import {
    backScreen, showModalReview, dimissModal, pushToUserProfile
} from '../navigation';
import Colors from '../constants/colors'
import { FlatList } from 'react-native';
import Images from '../assets/images'

class GuideFinishComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            isLoadMore: false,
        }
        this.page = 1
    }
    componentDidMount() {
        this.setState({
            isLoadMore: true
        })
        this.doGetListRatingFinish()
    }
    doGetListRatingFinish = () => {
        let data = {
            comment_id: this.props.data.item.comment_id
        }
        this.props.getGuiFinish(data)
            .then(data => {

                Loading.hideHud()
                this.setState({
                    refreshing: false,
                    isLoadMore: false
                })
            })
            .catch(error => {
                Loading.hideHud()
                this.setState({
                    refreshing: false,
                    isLoadMore: false
                })
            });
    }
    loadMore = () => {
        const { refreshing } = this.state
        if (this.state.isLoadMore === true) {
            return
        }
        if (refreshing == false) {
            this.setState({ isLoadMore: true }, () => {
                this.doGetListRatingFinish()
            })
        }
    }
    pullRefresh = () => {
        const { refreshing, isLoadMore } = this.state;
        if (refreshing) {
            return
        }
        this.page = 1;

        if (isLoadMore == false) {
            this.setState({ refreshing: true }, () => {
                this.doGetListRatingFinish()
            })
        }
    }
    onPressBack = () => {
        dimissModal(this.props.componentId)
    }
    _keyExtractor = (item, idx) => idx.toString()


    renderBottom = () => {
        const { isLoadMore } = this.state;
        return (<View style={{ height: 40, justifyContent: 'center' }}>
            { isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
        </View>)
    }

    finishDoblePull = () => {
        this.doGetListRatingFinish()
        this.props.passPropsScreen()
    }
    handleAgentReview = (value) => {
        // console.log("this.props.data", this.props.data);
        let item = {
            ...value,
            comment_id: this.props.data.item.comment_id,
            user_id: value.user_guide_id
        }
        showModalReview(this.props.componentId, { item }, this.finishDoblePull)
    }

    renderEmpty = () => {

        const { isLoadMore } = this.state
        if (isLoadMore) {
            return null
        }

        return (<View style={styles.emptyView}>
            <Text style={{ fontSize: 14, color: Colors.black_1, textAlign: 'center' }}>
                {i18next.t('Chưa có hướng dẫn viên đi tour')}
            </Text>
        </View>)
    }
    nextScreenUsers = (dataUsers) => {
        console.log("111111111111111111122222222222222222233333333333");
        pushToUserProfile(this.props.componentId, { user_id: dataUsers.user_id })
    }
    _renderItem = ({ index, item }) => {
        return (
            <View style={{ backgroundColor: '#fff', marginTop: 10, paddingVertical: 10 }}>
                <TouchableOpacity
                    onPress={() => this.nextScreenUsers(item)}
                    style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                    <View style={{ width: '15%', }}>
                        <View style={{ width: 51, height: 51 }}>
                            <Image
                                source={{ uri: item.avatar }}
                                style={{ width: 50, height: 50, borderRadius: 25 }}
                            />
                            {
                                item.is_agent == 1 ?
                                    <Image
                                        style={{ width: 18, height: 18, borderRadius: 9, position: 'absolute', bottom: 0, right: 0 }}
                                        source={Images.logo_flag_header}>
                                    </Image>
                                    : null
                            }
                        </View>
                    </View>

                    <View style={{ justifyContent: 'center', width: '85%', marginLeft: 5 }}>
                        <Text style={{ color: Colors.black, fontSize: 16, fontWeight: "500" }}>{item.display_name}</Text>
                    </View>

                </TouchableOpacity>

                {

                    this.props.tabKey == 'Departed' ?
                        null
                        :
                        <TouchableOpacity
                            onPress={() => this.handleAgentReview(item)}
                        >
                            <View style={{
                                paddingHorizontal: 10,
                                marginTop: 15,
                                borderColor: Colors.gray_3,
                                borderTopWidth: 1,
                                flexDirection: 'row',
                                paddingVertical: 10,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Image
                                    source={Images.icon_repost}
                                    style={{ width: 16, height: 16 }}
                                    resizeMode='contain'
                                />
                                {
                                    item.reviewed.toString() == '1' ?
                                        <Text style={{ paddingLeft: 5 }}>Chỉnh sửa đánh giá</Text> :
                                        <Text style={{ paddingLeft: 5 }}>Viết đánh giá</Text>
                                }
                            </View>
                        </TouchableOpacity>
                }
            </View>
        )
    }
    render() {
        const { refreshing, isLoadMore } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: '#F1F7F5', marginBottom: 30 }}>
                <HeaderView
                    title={i18next.t(this.props.tabKey == 'Departed' ? 'Hướng dẫn viên' : 'Viết đánh giá')}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                    back={true}
                    onPressLeftBarButton={this.onPressBack}
                />
                <FlatList
                    keyExtractor={this._keyExtractor}
                    onEndReached={this.doGetListRatingFinish}
                    ListFooterComponent={this.renderBottom}
                    onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 1}
                    onEndReached={this.loadMore}
                    removeClippedSubviews={false}
                    data={this.props.listGuideFinish}
                    renderItem={this._renderItem}


                    ListEmptyComponent={this.renderEmpty}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={this.pullRefresh}
                        />
                    }

                    showsVerticalScrollIndicator={false}

                />

            </View>
        );
    }
}

export default GuideFinishComponent;

const styles = StyleSheet.create({

    emptyView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100
    },

});