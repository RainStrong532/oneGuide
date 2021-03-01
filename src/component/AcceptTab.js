import React from 'react'
import {
    FlatList, View, Text, StyleSheet,
    Image, TouchableOpacity
} from 'react-native'

export default class AcceptTab extends React.Component {
    state = {
        loading: false
    }
    viewProfile = () => {
      
    }

    abortThisFriend = () => {
     
    }

    _renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.wrapItem} onPress={this.viewProfile}>
                <Image
                    style={styles.avatar}
                />
                <View style={styles.wrapInfo}>
                    <Text style={styles.mainText}>{item.name}</Text>
                    <Text style={styles.subText}>{`Đã gửi yêu cầu kết bạn`}</Text>
                    <View
                        style={styles.wrapListButton}
                        pointerEvents="box-none">
                        <TouchableOpacity
                            style={styles.acceptBtn}
                            onPress={this.acceptThisFriend}>
                            <Text style={styles.btnText}>{"Chấp nhận"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.abortBtn}
                            onPress={this.abortThisFriend}>
                            <Text style={styles.btnText}>{"Huỷ"}</Text>
                        </TouchableOpacity>
                    </View>
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
        return (
            <View style={styles.wrapList}>
                <FlatList
                removeClippedSubviews={false}
                    data={[{ key: 'a' }, { key: 'b' }]}
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
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    wrapInfo: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 10,
    },
    mainText: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    subText: {
        color: '#888',
        fontSize: 14,
        marginBottom: 5,
    },

    wrapListButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 30,
    },

    abortBtn: {
        backgroundColor: 'gray',
        borderRadius: 4,
        flex: 0.47,
        alignItems: 'center',
        paddingVertical: 5,
    },
    acceptBtn: {
        backgroundColor: 'blue',
        borderRadius: 4,
        flex: 0.47,
        alignItems: 'center',
        paddingVertical: 5,
    },
    btnText: {
        color: '#FFF',
    },
});  