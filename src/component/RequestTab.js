import React from 'react'
import {
    FlatList, View, Text, StyleSheet,
    Image, TouchableOpacity
} from 'react-native'
import { pushToUserProfile } from '../navigation'

export default class RequestTab extends React.Component {
    state = {
        loading: false
    }
    viewProfile = (item) => () => {
    
        pushToUserProfile(this.props.componentId, item)
    }

    abortThisFriend = () => {
     
    }

    _renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.wrapItem} onPress={this.viewProfile(item)}
            >
                <Image
                    style={styles.avatar}
                    source={{ uri: item.avatar }}
                />
                <View style={styles.wrapInfo}>
                    <Text style={styles.mainText} numberOfLines={1}>{item.display_name}</Text>
                    <Text style={styles.subText} numberOfLines={1}>{`Đã gửi yêu cầu kết bạn`}</Text>
                </View>
                <View pointerEvents="box-none">
                    <TouchableOpacity
                        style={styles.abortBtn}
                        onPress={this.abortThisFriend}>
                        <Text style={styles.btnText}>{"Huỷ"}</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    _keyExtractor = (item, idx) => idx.toString()

    refreshList = () => {
        this.setState({
            loading: true
        })

        setTimeout(() => {
            this.setState({
                loading: false
            })
        }, 2000);
    }

    getMoreItems = () => {

    }

    render = () => {
        const { data } = this.props
        return (
            <View style={styles.wrapList}>
                <FlatList
                removeClippedSubviews={false}
                    data={data}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                    onEndReached={this.getMoreItems}
                    onRefresh={this.refreshList}
                    refreshing={this.state.loading}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapList: {
        flex: 1,
        backgroundColor: '#F8F8FF',
        paddingHorizontal: 5,
        paddingTop: 5,
    },
    wrapItem: {
        padding: 15,
        backgroundColor: 'white',
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 40,
    },
    wrapInfo: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    mainText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    subText: {
        color: '#888',
        fontSize: 14,
    },
    wrapButton: {
        backgroundColor: '#888',
        width: 100,
        borderRadius: 5,
    },
    abortBtn: {
        width: 50,
        height: 30,
        backgroundColor: 'gray',
        borderRadius: 4,
        alignItems: 'center',
        paddingVertical: 5,
    },
    btnText: {
        color: '#FFF'
    },
})