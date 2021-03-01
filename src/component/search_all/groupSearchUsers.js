import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ImageBackground } from 'react-native'
import {
    backScreen,
    pushToGroup,
    pushInformationGroup
} from '../../navigation';
import { ReachabilityView, i18next } from '../../utils';
import Colors from '../../constants/colors'


export default class GroupSearchUser extends Component {

    constructor(props) {
        super(props)
        this.state = {
            group: []
        }
    }

    shouldComponentUpdate(nextProps) {
        setTimeout(() => {
            this.setState({
                group: nextProps.data
            })
        }, 0)
        return true;
    }
    onPressInformationGroup = (data) => {
        if (data.check_user == 'no') {
            pushInformationGroup(this.props.componentId, {
                passProps: data
            }, { joinGroup: this.joinGroup, outGroup: this.outGroup })
        } else
            if (data.check_user == 'yes') {
                pushToGroup(this.props.componentId, {
                    passProps: data
                }, { outGroup: this.outGroup })
            }
    }

    joinGroup = (dataGroup) => {
        if (this.props.joinGroupSearch) {
            // this.props.joinGroupContainer(dataGroup)
            this.props.joinGroupSearch(dataGroup)
                .then(res => {
                    this.setState({
                        group: res
                    })
                })
                .catch(err => {
                })
        }
    }

    outGroup = (id_group) => {
        if (this.props.outGroupSearch) {
            this.props.outGroupSearch(id_group)
                .then(res => {
                    this.setState({
                        group: res
                    })
                })
                .catch(err => {
                })
        }
    }

    cancelGroup = () => {

    }

    render() {
        let group = this.state.group
        return (
            <View
                style={styles.container}
            >
                <FlatList
                    removeClippedSubviews={false}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={group}
                    renderItem={this.renderItems}
                />
            </View>
        )
    }

    renderItems = ({ item }) => {
        const convertData = {
            ...item,
            background: item.image,
            title: item.name_group,
            id: item.group_id,
            avatar: item.image
        }
        return (
            <View style={styles.FlatList_View}>
                <ImageBackground source={{ uri: item.image }} style={styles.FlatList}
                ><View style={{ flex: 1, height: '70%', borderRadius: 8 }}></View>
                    <View style={{ backgroundColor: 'white', flex: 1, height: '30%', }}>
                        <View style={{ margin: 6 }}>
                            <TouchableOpacity
                                onPress={() => this.onPressInformationGroup(convertData)}
                            >
                                <Text numberOfLines={1} style={{ fontWeight: "600", fontSize: 18, color: "#000", width: 150, }}>{item.name_group}</Text>
                                <Text style={{ fontSize: 13 }}>{item.total_member} {i18next.t('Memberv')} </Text>
                            </TouchableOpacity>
                            {
                                item.check_user == 'yes'
                                    ?
                                    null
                                    :
                                    <View>
                                        {
                                            item.submitted_request == 'yes' ?
                                                <TouchableOpacity
                                                    disabled
                                                    // onPress={() => this.outGroup(item.group_id)}
                                                    style={styles.TouchableOpacity_out}>
                                                    <Text style={{ color: Colors.black }}>{i18next.t('waiting')}</Text>
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity
                                                    onPress={() => this.joinGroup(item.group_id)}
                                                    style={styles.TouchableOpacity_join}>
                                                    <Text style={{ color: '#00a5ba' }}> {i18next.t('Join')}</Text>
                                                </TouchableOpacity>
                                        }
                                    </View>
                            }

                        </View>

                    </View>
                </ImageBackground>
            </View>
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
        width: 230,
        height: 180,
        borderWidth: 1,
        borderColor: "#cccccc",
        borderRadius: 10,
        marginLeft: 10,
        marginBottom: 20,
        marginTop: 20,
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