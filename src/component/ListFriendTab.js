import React from 'react'
import {
    FlatList, View, Text, StyleSheet,
    Image, TouchableOpacity
} from 'react-native'
import { pushToUserProfile } from '../navigation'
import { i18next, Loading } from '../utils'

export default class ListFriendTab extends React.Component {
    state = {
        loading: false
    }

    handleAvatar = (item) => {
        pushToUserProfile(this.props.componentId, item)
    }

    _renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.wrapItem}
                onPress={() => this.handleAvatar(item)}
            >
                <Image style={styles.avatar} source={{ uri: item.avatar }} />
                <View style={styles.wrapInfo}>
                    <Text style={styles.mainText} numberOfLines={1}>{item.display_name}</Text>
                    <Text style={styles.subText} numberOfLines={1}>
                        {`${item.total_mutual_friends} `}{i18next.t('PeopleFriend')}
                    </Text>
                </View>
                {/* <View>
                    <TouchableOpacity >
                        <Image style={styles.imgBtn} resizeMode="contain" source={{ uri: 'https://protein-cms-prod.s3.amazonaws.com/grafik/637/featured_image/3b08e3bd-b126-42a6-adf6-23a55b929dc5.jpg' }} />
                    </TouchableOpacity>
                </View> */}
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
            <View style={styles.wrapList} >
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
        borderRadius: 20,
    },
    wrapInfo: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 10
    },
    mainText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    subText: {
        color: '#888',
        fontSize: 14,
    },
    imgBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
})