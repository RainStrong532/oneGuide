import React, { Component } from 'react'
import { View, Image, TouchableOpacity, FlatList, Text, ActivityIndicator, Platform, RefreshControl } from 'react-native'
import HeaderView from './views/HeaderView'
import Colors from '../constants/colors'
import { backScreen, gotoPostDetailTip } from '../navigation'
import Images from '../assets/images'

export default class SeeAllPostTip extends Component {
    constructor(props) {
        super(props);
        this.state = {

            showSearch: false,
            refreshing: false,
            data: [],
            isLoadMore: true,
            showImg: false,
            place: '',
            language: '',
            experiences: '',
            keysearch: '',
            startDate: "",
            endDate: '',
            key_tour: ''
            // page: 1
        }
        this.page = 1
        // bind


    }
    componentDidMount = () => {
        let data = {
            page: 1,

        }
        this.setState({ isLoadMore: true })
        this.doGetListPostTip(null, data)
    }
    onPressBack = () => {
        backScreen(this.props.componentId)
    }
    doGetListPostTip = (data_, page) => {

        this.props.getListPostTip(data_, page)
            .then(data => {
                // console.log('====================================');
                // console.log(data, 'xccdfsfwfrgfgs');
                // console.log('====================================');
                this.page = page.page + 1
                this.setState({
                    // data: data,
                    refreshing: false,
                    isLoadMore: false
                })
            })
            .catch(error => {
                this.setState({
                    refreshing: false,
                    isLoadMore: false
                })
            });
    }
    loadMore = () => {
        const { refreshing } = this.state
        let data = {
            page: this.page,

        }
        if (this.state.isLoadMore === true) {
            return
        }
        if (refreshing == false) {
            this.setState({ isLoadMore: true }, () => {
                this.doGetListPostTip(null, data)
            })
        }
    }
    renderItem = ({ item, index }) => {
        return (
            <HotListPostTip
                componentId={this.props.componentId}
                // nextScreenUser={this.nextScreenUser}
                dataPeople={item}
                index={index}
            />
        )
    }
    _keyExtractor = (item, idx) => idx.toString()
    renderBottom = () => {
        const { isLoadMore } = this.state
        return (
            <View style={{ height: 40, justifyContent: 'center' }}>
                {isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
            </View>
        )
    }
    pullRefresh = () => {
        const { refreshing, isLoadMore } = this.state;
        if (refreshing) {
            return
        }
        this.page = 1;
        let data = {
            page: 1,
        }
        if (isLoadMore == false) {
            this.setState({ refreshing: true }, () => {
                this.doGetListPostTip(null, data)
            })
        }
    }
    render() {
        // console.log('====================================');
        // console.log(this.props, "dddddddddđsađâs");
        // console.log('====================================');
        const { refreshing } = this.state
        // console.log('this. props back screen', this.props);
        const { listPostTips } = this.props || []
        let face = [0, 1, 2]
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white'
                }}
            >
                <HeaderView
                    title={"News"}
                    style={{ backgroundColor: Colors.green_1 }}
                    tintColor={Colors.white}
                    onPressLeftBarButton={this.onPressBack}
                    back={true}
                />

                <View
                    style={{
                        flex: 1
                    }}
                >
                    <FlatList
                        keyExtractor={this._keyExtractor}
                        onEndReached={this.doGetListPostTip}
                        ListFooterComponent={this.renderBottom}
                        onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 10}
                        onEndReached={this.loadMore}
                        removeClippedSubviews={false}
                        data={listPostTips}
                        renderItem={this.renderItem}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={this.pullRefresh}
                            />
                        }
                    />
                </View>
            </View>
        )
    }
}

class HotListPostTip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: [],
        }
    }
    nextScreenDetail = () => {

        const componentId = this.props.componentId
        gotoPostDetailTip(componentId, { comment: this.props.dataPeople })
    }
    render() {
        const { dataPeople } = this.props || {}
        return (
            <TouchableOpacity
                onPress={this.nextScreenDetail}
                style={{
                    flex: 1,
                    flexDirection: "row",
                    margin: 10
                }}
            >
                <View
                >
                    <Image
                        source={{ uri: dataPeople.image }}
                        style={{
                            width: 160,
                            height: 100,
                            marginRight: 15,
                            borderRadius: 6
                        }}
                    />
                </View>
                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <View style={{ flex: 0.1, paddingBottom: 5 }}>
                        <Text numberOfLines={2}
                            style={{
                                color: "#B8BABD"
                            }}
                        >
                            {dataPeople.time_ago}
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 0.8
                        }}
                    >
                        <Text
                            numberOfLines={2}
                            style={{
                                fontSize: 16,
                                fontWeight: "500",
                                color: 'black'

                            }}
                        >
                            {dataPeople.title}
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 0.1
                            // flexDirection: 'row',
                            // // justifyContent: "space-between"
                        }}
                    >
                        <Text
                            style={{
                                color: Colors.green_1,
                            }}
                        >

                            {dataPeople.display_name}
                        </Text>
                        {/* <Text
                            style={{
                                color: Colors.green_1
                            }}
                        >
                            {dataPeople.time_ago}
                        </Text> */}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}










