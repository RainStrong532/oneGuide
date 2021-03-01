import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, Image, FlatList, Text, ActivityIndicator, RefreshControl } from 'react-native'
import HeaderView from './views/HeaderView'
import Colors from '../constants/colors'
import Images from '../assets/images'
import { pushReportTour, backScreen, pushToUserProfile, showModalReview } from '../navigation'
import { ScrollView } from 'react-native'
import { i18next, Loading } from '../utils'

export default class ListReportComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            itemCheckin: {},
            refreshing: false,
        }
    }

    componentDidMount() {
        this.doGetListReport(this.props.data.comment_id)
    }
    doGetListReport = (comment_id) => {
        this.props.getListReport({ comment_id })
            .then(res => {
                this.setState({
                    isLoading: false,
                    refreshing: false,
                })
            })
            .catch(err => {
                this.setState({
                    isLoading: false,
                    refreshing: false,
                })
            })
    }
    pullRefresh = () => {
        const { refreshing, isLoading } = this.state;
        if (refreshing) {
            return
        }

        if (isLoading == false) {
            this.setState({ refreshing: true }, () => {
                this.doGetListReport(this.props.data.comment_id)
            })
        }
    }
    onPressDetailReport = (item) => {
        pushReportTour(this.props.componentId, item)
    }

    backScreen = () => {
        backScreen(this.props.componentId)
    }
    _keyExtractor = (item, idx) => idx.toString()

    handleAgentReview = (value) => {
        let item = {
            ...value,
            comment_id: this.props.data.comment_id
        }
        showModalReview(this.props.componentId, { item })
    }
    nextScreenUsers = (dataUsers) => {
        pushToUserProfile(this.props.componentId, { user_id: dataUsers.user_id })
    }
    renderItem = ({ index, item }) => {
        return (
            <View style={{ backgroundColor: '#fff', margin: 5, borderRadius: 3, borderColor: Colors.gray_3, borderWidth: 0.3 }}>

                <TouchableOpacity
                    onPress={() => { this.nextScreenUsers(item) }}
                    style={{ flexDirection: 'row', paddingHorizontal: 10, marginVertical: 10 }}>
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
                    <View style={{ width: '85%', justifyContent: 'center', marginLeft: 5 }}>
                        <Text style={{ color: Colors.black, fontSize: 16, fontWeight: '500' }}>{item.display_name}</Text>
                        <Text >{item.send_date}</Text>
                    </View>
                </TouchableOpacity>
                <View style={{
                    // height: 150,
                    marginHorizontal: 10,
                    borderTopWidth: 0.5,
                    borderTopColor: Colors.gray_3,
                    paddingVertical: 15
                }}>
                    {/* <ScrollView> */}
                    <Text
                        style={{ color: Colors.black, fontSize: 13 }}>{item.content}</Text>
                    {/* </ScrollView> */}
                </View>
            </View>
        )
    }

    render() {
        const { listReport } = this.props || []
        const { isLoading } = this.state

        return (
            <View
                style={styles.container}
            >
                <HeaderView
                    title={this.props.data.title}
                    style={{ backgroundColor: Colors.green_1 }}
                    tintColor={Colors.white}
                    back={true}
                    onPressLeftBarButton={this.backScreen}
                />
                {
                    isLoading == false
                        ?
                        <FlatList
                            data={listReport}
                            renderItem={this.renderItem}
                            keyExtractor={this._keyExtractor}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.pullRefresh}
                                />
                            }
                            ListEmptyComponent={
                                <View style={{ flex: 1 }}>
                                    {
                                        isLoading
                                            ?
                                            <View>

                                            </View>
                                            :
                                            <View style={{ flex: 1, marginTop: 80 }}>
                                                <Text style={{
                                                    textAlign: 'center',
                                                    marginTop: 10,
                                                    fontSize: 16,
                                                    color: '#ADBFD1'
                                                }}>{i18next.t('NoReport')}
                                                </Text>
                                            </View>
                                    }
                                </View>
                            }
                        />
                        :
                        <View style={{ width: 10, height: 40, justifyContent: 'center', alignSelf: "center" }}>
                            {<ActivityIndicator animating size="small" color={Colors.black} style={{ alignSelf: "center" }} />}
                        </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F1F7F5',
        flex: 1,
        marginBottom: 30
    },
    viewUser: {
        backgroundColor: Colors.white,
        flex: 1
    },
    image_header: {
        width: 30,
        height: 30,
        borderRadius: 25,
        marginRight: 10
    },
    image_header_personalPhoto: {
        height: 35,
        width: 35,
        borderRadius: 17.5,
        overflow: 'hidden',
    },
    logo_image_right: {
        position: 'absolute',
        top: 20,
        left: 25,
    },
})