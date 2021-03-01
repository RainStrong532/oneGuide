import React, { Component } from 'react';
import PostTourView from './post-views/PostTourView';
import HeaderView from './views/HeaderView';
import { backScreen, showDate, gotoCheckInScreen, pushToUserProfile, viewPhoto } from '../navigation';
import { View, Text, Image, StyleSheet } from 'react-native'
import Colors from '../constants/colors'
import { i18next, Loading } from '../utils'
import CommonStyles from '../constants/styles';
import _ from 'lodash'

import Helper from '../utils/Helper';
import Images from '../assets/images'
import { TouchableOpacity } from 'react-native';
import PostImageView from '../component/post-views/PostImageView'
import { ScrollView } from 'react-native';

class DetailTourInvited extends Component {

    onPressBack = () => {
        // DismissKeyboard()
        backScreen(this.props.componentId)
    }

    handleAvatar = (item) => {
        if (item.user_id) {
            const data = { user_id: item.user_id }
            pushToUserProfile(this.props.componentId, data)
        }
        if (item.user_created_id) {
            const data = { user_id: item.user_created_id }
            pushToUserProfile(this.props.componentId, data)
        }

    }
    testImg = (photo) => (index) => {
        // console.log("index va photo click", index, photo);
        viewPhoto({ index, photo })
    }
    render() {
        // console.log("detail tour", this.props.data);
        let item, photo;
        if (this.props && this.props.data && this.props.data.item) {
            item = this.props.data.item
            photo = this.props.data.item.photo
        }
        return (

            <View style={{ flex: 1, backgroundColor: '#fff' }}>

                <HeaderView
                    title={i18next.t('Chi tiết tour')}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                    back={true}
                    onPressLeftBarButton={this.onPressBack}
                />
                <ScrollView>

                    <View style={{ backgroundColor: '#fff' }}>
                        <View style={{ flexDirection: 'row', marginTop: 10, paddingHorizontal: 10 }}>
                            <View style={{ width: '12%' }}>
                                <TouchableOpacity
                                    onPress={() => this.handleAvatar(item)}
                                >
                                    <Image
                                        // resizeMode="contain"
                                        style={{ width: 40, height: 40, borderRadius: 20 }}
                                        source={{ uri: item.avatar }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ justifyContent: 'center', width: '88%' }}>
                                <TouchableOpacity
                                    onPress={() => this.handleAvatar(item.user_created_id)}
                                >
                                    <Text style={{ color: Colors.black, fontWeight: '700' }}>{item.display_name}</Text>
                                    <Text>{item.created_format}</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <View style={styles.wrapcontent}>
                            <View style={styles.wrapImage}>
                                <Image resizeMode="contain" style={{ width: 16, height: 16 }}
                                    source={Images.tour_name_2}>
                                </Image>
                            </View>
                            <View style={styles.wrapText}>
                                <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.black }}>{item.title}</Text>
                            </View>

                        </View>
                        <View style={styles.wrapcontent}>
                            <View style={styles.wrapImage}>
                                <Image style={{ width: 16, height: 16 }}
                                    resizeMode="contain"
                                    source={Images.tour_calendar}
                                />
                            </View>
                            <View style={styles.wrapText}>
                                <Text style={{ color: Colors.black }}>{item.date_tour}</Text>
                            </View>

                        </View>
                        <View style={styles.wrapcontent}>
                            <View style={styles.wrapImage}>
                                <Image style={{ width: 15, height: 15 }}
                                    resizeMode="contain"
                                    source={Images.tour_location}
                                ></Image>
                            </View>
                            <View style={styles.wrapText}>
                                <Text style={{ color: Colors.black }}>{item.location}</Text>
                            </View>

                        </View>
                        <View style={styles.wrapcontent}>
                            <View style={styles.wrapImage}>
                                <Image resizeMode="contain" style={{ width: 16, height: 16, }}
                                    source={Images.tour_language}
                                ></Image>
                            </View>
                            <View style={styles.wrapText}>
                                <Text style={{ color: Colors.black }}>{item.language}</Text>
                            </View>

                        </View>

                        <View style={styles.wrapcontent}>
                            <View style={styles.wrapImage}>
                                <Image resizeMode="contain" style={{ width: 16, height: 16 }}
                                    source={Images.ic_time_schedule_max}
                                ></Image>
                            </View>
                            <View style={styles.wrapText}>
                                <Text style={{ color: Colors.black }}>{item.deadline_format || item.deadline_date}</Text>
                            </View>

                        </View>
                        <View style={styles.wrapcontent}>
                            <View style={styles.wrapImage}>
                                <Image resizeMode="contain" style={{ width: 16, height: 16 }}
                                    source={Images.person_experience}
                                ></Image>
                            </View>
                            <View style={styles.wrapText}>
                                <Text style={{ color: Colors.black }}>{item.experience}</Text>
                            </View>

                        </View>

                        <View style={{ marginTop: 10, marginBottom: 8, paddingHorizontal: 10 }}>

                            <View>
                                <Text
                                    style={{ color: Colors.black }}
                                //   numberOfLines={2}
                                >
                                    {item.content}
                                </Text>
                            </View>
                        </View>
                        {
                            photo ?
                                <PostImageView
                                    onPressImage={this.testImg(item.photo)}
                                    photos={photo.photos}
                                />
                                : null
                        }
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default DetailTourInvited;

const styles = StyleSheet.create({
    wrapcontent: {
        flexDirection: 'row',
        marginTop: 10,
        paddingHorizontal: 10
    },
    wrapImage: {
        width: '8%',
        justifyContent: 'center'

    },
    wrapText: {
        width: '90%',
        //   marginLeft: 5,
        // alignItems: 'center'
    }
})