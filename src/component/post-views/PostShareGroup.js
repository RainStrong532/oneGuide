import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { getInfomationGroup } from '../../actions'
import Colors from '../../constants/colors'

export default class PostShareGroup extends Component {

    goToGroup = (group_id) => {
        // if (this.props.goToGroup) {
        //     this.props.goToGroup(group_id)
        // }
        this.props.getInfomationGroup(group_id)
            .then(res => {
                // console.log('res trả về', res);
                const convertData = {
                    ...res,
                    background: res.avatar,
                    id: group_id
                }
                if (this.props.goToGroup) {
                    this.props.goToGroup(convertData)
                }
            })
            .catch(err => {
                // console.log('err trả về', err);
            })
    }

    render() {
        const { title, total_members, cover_image, image, group_id } = this.props.data || []

        return (
            <View>
                { this.props.data &&
                    <View
                        style={styles.container}
                    >
                        <TouchableOpacity
                            onPress={() => this.goToGroup(group_id)}
                        >
                            <View>
                                <Image
                                    style={styles.image_background}
                                    source={{ uri: cover_image }}
                                />
                                <View
                                    style={{
                                        position: "absolute",
                                        top: '70%',
                                        left: '1%',
                                        flexDirection: 'row'
                                    }}
                                >
                                    <Image
                                        style={styles.avatar}
                                        source={{ uri: image }}
                                    />
                                    <View
                                        style={{
                                            flex: 1,
                                            marginTop: 65,
                                            marginLeft: 10,
                                        }}
                                    >
                                        <Text numberOfLines={2}
                                            style={{
                                                // marginTop: 65,
                                                // marginLeft: 10,
                                                flexWrap: 'wrap',
                                                fontSize: 14,
                                                fontWeight: '500',
                                                marginRight: 10

                                            }}
                                        >

                                            {title}
                                        </Text>
                                        <Text
                                            style={{
                                                // marginTop: 65,
                                                // marginLeft: 10,
                                                flexWrap: 'wrap',
                                                fontSize: 13,
                                                marginRight: 10
                                                // fontWeight: '500',

                                            }}
                                        >
                                            {`${total_members} thành viên`}
                                        </Text>
                                    </View>
                                </View>
                                {/* <View
                        style={styles.title}
                    >
                        <Text>
                            hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg
                        </Text>
                    </View> */}
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 80,
        flex: 1,
        backgroundColor: '#EAE6E5'
    },
    image_background: {
        width: '100%',
        height: 200,
        position: "relative",
        paddingBottom: 200
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderColor: Colors.white,
        borderWidth: 2
        // position: "absolute",
        // top: '70%',
        // left: '0.5%'
        //zIndex: -9999
    },
    title: {
        marginLeft: 130
    }
})