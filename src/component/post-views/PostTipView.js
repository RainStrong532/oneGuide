import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ImageBackground, Dimensions, ActivityIndicator } from 'react-native'
import {
    gotoPostDetailTip
} from '../../navigation';
import { ReachabilityView, i18next } from '../../utils';
import Colors from '../../constants/colors'
import images from '../../assets/images';
import HTML from 'react-native-render-html'

export default class PostTipView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoadMore: false
        }
    }

    onPressDetaiPost = (data) => {
        const componentId = this.props.componentId
        gotoPostDetailTip(componentId, { comment: data })
    }
    renderBottom = () => {
        const { isLoadMore } = this.state
        return (
            <View style={{ width: 10, height: 40, justifyContent: 'center' }}>
                {isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
            </View>
        )
    }

    render() {
        // console.log(this.state, 'tìm gờ rúp', this.props);
        let data = this.props.data.list_tips || []
        return (
            <View
                style={styles.container}
            >
                <FlatList
                    removeClippedSubviews={false}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={data}
                    renderItem={this.renderItems}
                    ListFooterComponent={this.renderBottom}
                />
            </View>
        )
    }

    renderItems = ({ item }) => {
        return (
            <TouchableOpacity style={styles.FlatList_View}
                onPress={() => this.onPressDetaiPost(item)}
            >
                <ImageBackground source={{ uri: item.image }} style={styles.FlatList}
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            flexDirection: 'column',
                            justifyContent: "flex-end",
                        }}
                    >
                        <View
                            style={{
                                margin: 5
                            }}
                        >
                            <Text
                                numberOfLines={3}
                                style={{
                                    fontSize: 16,
                                    fontWeight: '700',
                                    color: Colors.white
                                }}
                            >{item.title}</Text>
                            <Text
                                numberOfLines={1}
                                style={{
                                    fontSize: 14,
                                    color: Colors.gray_1
                                }}
                            >{item.display_name}</Text>

                        </View>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        )

    }
}

const styles = StyleSheet.create({
    container: {
        // marginLeft: 10
    },
    container_flexDirection2: {
        flexDirection: "row"
    },
    TouchableOpacity_join: {
        width: 90,
        height: 30,
        borderRadius: 3,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: '#00a5ba',

        marginRight: 3,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
    },
    TouchableOpacity_out: {
        width: 90,
        height: 30,
        borderRadius: 3,
        backgroundColor: Colors.gray_1,
        borderWidth: 1,
        borderColor: Colors.gray_1,

        marginRight: 3,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
    },
    FlatList_View: {
        width: 270,
        height: 180,
        // borderWidth: 1,
        // borderColor: "#cccccc",
        borderRadius: 10,
        marginLeft: 10,
        marginBottom: 20,
        // marginTop: 20,
        overflow: 'hidden',

    },
    FlatList: {
        flex: 1,

        resizeMode: "contain",
        // borderRadius: 10,
        flexDirection: 'column'
    },
    textCmt: {
        fontSize: 13,
        color: '#000',
        marginLeft: 5
    },
    container_flexDirection: {
        flexDirection: "row",
        marginTop: 10,
        // flex: 1
    },
    container_flexDirection_between: {
        paddingTop: 9,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: 'space-between'
    },
    item_Yourteam: {
        backgroundColor: "#fff",
        padding: 10,
        overflow: 'hidden',
    },
    image_icon2: {
        width: 44,
        height: 44,
        borderRadius: 22
    },
    Recommendedgroup: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: "600",
        color: "#000"
    },
    Yourteam: {
        marginTop: 10,
        marginBottom: 15,
        backgroundColor: "#F0F6F5",
        paddingLeft: 10
    },

})