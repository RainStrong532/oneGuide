import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator,
    Platform,
    RefreshControl
} from 'react-native'
import Images from '../assets/images'
import Colors from '../constants/colors'
import HeaderView from './views/HeaderView';
import DismissKeyboard from 'dismissKeyboard';
import { backScreen, pushToUserProfile } from '../navigation';
import i18next from 'i18next';



export default class HotPostRelatedComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {

            showSearch: false,
            refreshing: false,
            data: [],
            isLoadMore: true,
            showImg: false,

            // page: 1
        }
        this.page = 1
        // bind


    }

    componentDidMount = () => {
        // let data = {
        //     comment_id: this.props.comment_id
        // }
        // this.props.getHotPostRelated(null, data)
    }

    render() {
        // console.log('====================================');
        // console.log(this.props, "::::::::::::::::::::::::::dataa");
        // console.log('====================================');
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.FlatList_View}
                // onPress={() => this.onPressDetaiPost(item)}
                >
                    <ImageBackground source={{
                        // uri: item.image 
                    }} style={styles.FlatList}
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
                                >
                                    {/* {item.title} */}
                                </Text>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        fontSize: 14,
                                        color: Colors.gray_1
                                    }}
                                >
                                    {/* {item.display_name} */}
                                </Text>

                            </View>
                        </View>
                    </ImageBackground>
                </TouchableOpacity>
            </View>
        );
    }
}




const styles = StyleSheet.create({
    container: {
        flex: 1
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
    Yourteam: {
        marginTop: 10,
        marginBottom: 15,
        backgroundColor: "#F0F6F5",
        paddingLeft: 10
    },
});
