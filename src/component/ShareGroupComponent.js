import React, { Component } from 'react';
import {
    View, Text, ImageBackground, TouchableOpacity, TextInput,
    StyleSheet, Image, ScrollView, FlatList, Modal, Dimensions
} from 'react-native';
import {
    backScreen, dimissModal, showModalCancelPost, dimissOverlay, showModalCancelBackGroup, pushToUserProfile
} from '../navigation';
import Images from '../assets/images';
import { ReachabilityView, i18next } from '../utils';
import Colors from '../constants/colors';
import HeaderView from './views/HeaderView'

class ShareGroupComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            screenWidth: Dimensions.get('window').width,

        }

    }
    onPressBack = () => {
        backScreen(this.props.componentId)
    }
    onPressSharePost = () => {

        let group_id = this.props.data.data.id
        let content = this.state.content
        // console.log("group_id::::::::::::", group_id);
        // console.log("content:::::::::", content, "id:::::", group_id);
        this.props.postShareGroup({ group_id }, content)
        backScreen(this.props.componentId)
    }
    onChangeText = (text) => {
        this.setState({
            content: text
        })
    }

    render() {
        let data_Group = this.props.data.data
        // console.log(" this.props.data::::::::::", data_Group);
        return (
            <View>
                <HeaderView
                    back={true}
                    onPressLeftBarButton={this.onPressBack}
                    onPressRightBarButton={this.onPressSharePost}
                    title={i18next.t('Sharegroups')}
                    titleRight={i18next.t('Share')}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                ></HeaderView>
                <Image
                    source={{ uri: data_Group.background }}
                    style={styles.imageBackground}>

                </Image>

                <View style={styles.container}>
                    <View styles={{
                        borderBottomWidth: 0.9,
                        borderBottomColor: Colors.gray_3,
                        flexWrap: 'wrap', marginLeft: 8
                    }}>
                        {/* <View style={{ marginTop: 7, marginLeft: 5 }}>
                            <TextInput
                                style={{ flexWrap: 'wrap' }}
                                onChangeText={(text) => this.onChangeText(text)}
                                // defaultValue={this.state.content}
                                placeholder={i18next.t('ShareThisPost')}
                            />
                        </View> */}

                    </View>
                    <View style={styles.align_Item}>
                        <View>
                            <Image resizeMode='center'
                                style={styles.style_Ic_img}
                                source={Images.icon_group_}></Image>
                        </View>
                        <View>
                            <Text style={styles.style_userName}>
                                {i18next.t('GroupName')}: <Text style={styles.style_userName_}>{data_Group.title}
                                </Text></Text>
                        </View>

                    </View>
                    <View style={styles.align_Item}>
                        <Image resizeMode='center' style={styles.style_Ic_img}
                            source={Images.tour_experience}></Image>
                        <Text style={styles.style_userName}>
                            {i18next.t('GroupInformation')}: <Text style={styles.style_userName_}>{data_Group.intro}</Text></Text>
                    </View>
                    <View style={styles.align_Item}>
                        <Image resizeMode='center' style={styles.style_Ic_img}
                            source={Images.ic_friends}></Image>
                        <Text style={styles.style_userName}>{i18next.t('TotalNumberOfGroupmMembers')}: <Text style={styles.style_userName_}>{data_Group.total_member}</Text></Text>
                    </View>
                    <View style={styles.align_Item}>
                        <Image resizeMode='center' style={styles.style_Ic_img}
                            source={Images.tabbar_tour}></Image>
                        <Text style={styles.style_userName}>{i18next.t('DateRaning')}: <Text style={styles.style_userName_}>{data_Group.date_create}</Text></Text>
                    </View>

                </View>

            </View>
        )
    }


}

export default ShareGroupComponent;
const styles = StyleSheet.create({
    align_Item: {
        flexDirection: 'row',
        //alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 0.9,
        borderBottomColor: Colors.gray_3,
        paddingRight: 10,
        width: Dimensions.get('window').width
        //flexWrap: 'wrap'

    },
    style_Ic_img: {
        width: 20,
        height: 20,
        marginLeft: 8,
        tintColor: Colors.blue_1,

    },
    container: {
        //padding: 10
    },
    style_userName: {
        marginLeft: 8,
        fontSize: 16,
        marginRight: 10

    },
    style_userName_: {
        marginLeft: 8,
        fontSize: 15,
        fontWeight: '500',
        flexWrap: 'wrap',
        width: Dimensions.get('window').width,
        marginRight: 10
    },
    imageBackground: {
        height: 200,



    }

})