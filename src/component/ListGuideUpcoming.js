import React, { Component } from 'react';
import { View, Text, RefreshControl, FlatList, TouchableOpacity, Image } from 'react-native'

import HeaderView from './views/HeaderView'
import {
    pushToUserProfile,
    gotoChatScreen,
    backScreen
} from '../navigation';
import { ReachabilityView, i18next, Loading } from '../utils'
import Colors from '../constants/colors'
import Images from '../assets/images'
import Helper from '../utils/Helper';
import _ from 'lodash'
class ListGuideUpcoming extends Component {

    componentDidMount() {

    }
    onPressBack = () => {
        backScreen(this.props.componentId)
    }
    _renderItem = ({ item }) => {
        let status = '2', created_date;
        if (item.agent_apply) {
            // status = item.agent_apply.type;
            //created_date = item.created_date
        }
        return (
            <View style={{
                backgroundColor: '#FFFFFF', marginTop: 10, paddingHorizontal: 10,
                paddingVertical: 10, flexDirection: 'row',
            }}>

                <View style={{
                    flexDirection: 'row', width: '70%',
                    // borderWidth: 1 
                }}>
                    <View style={{ justifyContent: 'center' }}>
                        <TouchableOpacity
                            onPress={() => this.handleAvatar(item.user_guide_id)}
                        >
                            <Image
                                source={{ uri: item.avatar }}
                                style={{ width: 52, height: 52, borderRadius: 26 }}
                            />
                        </TouchableOpacity>

                    </View>
                    <View style={{ marginLeft: 10, width: '80%', justifyContent: 'center' }}
                    >

                        <Text
                            style={{ fontSize: 16, color: '#000000', fontWeight: '500' }}
                            numberOfLines={4}
                        >
                            {item.display_name}
                        </Text>
                        <Text>
                            {created_date}
                        </Text>
                        {
                            true ?
                                <Text
                                    numberOfLines={4}
                                    style={{ marginTop: 10 }}> Hướng dẫn viên hủy đi tour
                            </Text>
                                :
                                null
                        }
                    </View>
                </View>

                <View style={{
                    // borderWidth: 1,
                    width: '30%'
                }}>
                    <TouchableOpacity
                        style={{ alignContent: 'center' }}
                        onPress={() => this.handleChat(item)}
                    >
                        <Image
                            source={Images.tabbar_inbox}
                            style={{ width: 25, height: 25, tintColor: Colors.green_1, alignSelf: 'center' }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                    {
                        status == '0' ?
                            <View style={{
                                width: '90%', alignSelf: 'center',
                                justifyContent: 'center', marginTop: 7, paddingHorizontal: 15, paddingVertical: 5
                            }}>
                                <TouchableOpacity

                                    onPress={() => this.hanleAgentCancel(item)}
                                >
                                    <Text style={{
                                        color: '#fff', textAlign: 'center',
                                        fontSize: 16,
                                        //paddingHorizontal: 25,
                                        paddingVertical: 5,
                                        backgroundColor: Colors.green_1, borderRadius: 5
                                    }}> Hủy</Text>
                                </TouchableOpacity>

                            </View> : null
                    }
                    {
                        status == '1' ?
                            <View style={{
                                width: '90%', alignSelf: 'center',
                                justifyContent: 'center', marginTop: 7, paddingHorizontal: 15, paddingVertical: 5
                            }}>
                                <TouchableOpacity

                                    onPress={() => this.hanleAgentCanceled(item)}
                                >
                                    <Text style={{
                                        textAlign: 'center',
                                        fontSize: 16,
                                        color: Colors.green_1,
                                        paddingHorizontal: 5,
                                        paddingVertical: 5,
                                        // backgroundColor: Colors.green_1,
                                        borderRadius: 5,
                                        borderWidth: 0.5,
                                        borderColor: Colors.green_1
                                    }}>Đồng ý</Text>
                                </TouchableOpacity>

                            </View> : null
                    }
                    {
                        status == '2' ?
                            <View style={{
                                width: '90%', alignSelf: 'center',
                                justifyContent: 'center', marginTop: 7, paddingHorizontal: 15, paddingVertical: 5
                            }}>
                                <Text style={{
                                    textAlign: 'center',
                                    fontSize: 16,
                                    //paddingHorizontal: 25,
                                    paddingVertical: 5,
                                    backgroundColor: Colors.gray_3, borderRadius: 5
                                }}>Đã hủy</Text>
                            </View> : null
                    }

                </View>

            </View>
        )
    }
    render() {
        const { listGuideUpcoming } = this.props
        return (
            <View style={{ flex: 1, backgroundColor: '#F1F7F5' }}>
                <HeaderView
                    title={i18next.t('Danh sách đi tour')}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                    back={true}
                    onPressLeftBarButton={this.onPressBack}
                />
                <View>

                    {
                        !listGuideUpcoming
                            ?
                            <View
                                style={{ alignItems: "center", marginTop: 100 }}
                            >
                                <Text
                                    style={{
                                        textAlign: "center",
                                        fontSize: 18,
                                        // fontWeight: '500'
                                    }}
                                >{i18next.t('Chưa có hướng dẫn viên tham gia')}</Text>
                            </View>

                            :
                            <FlatList
                                removeClippedSubviews={false}
                                data={listGuideTour}
                                keyExtractor={this._keyExtractor}
                                renderItem={this._renderItem}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.pullRefresh}
                                    />
                                }
                            // refreshing={refreshing}
                            // onRefresh={this.pullRefresh}
                            // onEndReached={this.loadMore}
                            //onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 1}
                            // showsVerticalScrollIndicator={false}
                            // ListFooterComponent={this.renderBottom}
                            // ListEmptyComponent={this.props.listGuideApply.length == 0 ? this.renderEmpty}
                            />
                    }
                </View>
            </View>
        );
    }
}

export default ListGuideUpcoming;