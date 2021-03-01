import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity, TextInput, StyleSheet, Image, ScrollView,
    FlatList, Modal, ClippingRectangle
} from 'react-native';
import Images from '../assets/images';
import { ReachabilityView, i18next } from '../utils';
import Colors from '../constants/colors';
import PostImageView from './post-views/PostImageView';

class PostViewTextComponent extends Component {
    onPressImage = () => {

    }
    render() {
        let dataPost = this.props.dataPost
        let photos = dataPost.photo.photos
        let date = Number(dataPost.created_date);
        let newDate = new Date(date * 1000)
        let day = newDate.getDay()
        let month = newDate.getMonth() + 1
        let year = newDate.getFullYear()
        let day_month_year = day.toString() + "/" + month.toString() + "/" + year.toString()

        return (
            <ScrollView >
                <View style={{ flex: 1, backgroundColor: '#fff', marginTop: 5, padding: 10 }} >
                    <View style={styles.container_justifyContent}>
                        <View >
                            <TouchableOpacity style={styles.container_flexDirection}>
                                <Image style={styles.avarta}
                                    source={{ uri: dataPost.avatar }}>
                                </Image>
                                <View style={{ marginLeft: 7, marginTop: 2 }}>
                                    <Text style={{ fontWeight: '600', fontSize: 16 }}>Text</Text>
                                    <Text>{i18next.t('day')} {day_month_year}</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                        <View style={{ marginTop: 10 }}>
                            <TouchableOpacity>
                                <Image
                                    source={Images.post_more_options}>
                                </Image>
                            </TouchableOpacity>
                        </View>



                    </View>

                    <View >
                        <View style={{ marginTop: 10, marginRight: 5 }}>
                            <Text>{dataPost.content}</Text>
                            <PostImageView
                                photos={photos}
                                style={{ marginBottom: 8 }}
                                onPressImage={this.onPressImage}
                            />
                        </View>
                    </View>

                </View>


                <View>
                    <View style={styles.view_like_share_comment}>
                        <TouchableOpacity style={styles.container_flexDirection_icon}>
                            <Image source={Images.post_like}>
                            </Image>
                            <Text style={styles.textCmt}>{i18next.t('Like')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.container_flexDirection_icon}>
                            <Image style={{ marginTop: 3 }} source={Images.post_comment} >
                            </Image>
                            <Text style={styles.textCmt}>{i18next.t('Comment')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.container_flexDirection_icon}>
                            <Image source={Images.post_share}>
                            </Image>
                            <Text style={styles.textCmt}>{i18next.t('Share')}</Text>
                        </TouchableOpacity>
                    </View>

                </View>


            </ScrollView>

        );
    }
}

export default PostViewTextComponent;
const styles = StyleSheet.create({
    container_justifyContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    container_flexDirection: {
        flexDirection: "row"
    },
    container_flexDirection_icon: {
        flexDirection: "row",
        marginTop: 10,

    },
    flexDirection: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center'
    },
    marginLeft: { marginLeft: 5 },
    view_like_share_comment: {
        borderTopWidth: 0.5,
        backgroundColor: '#fff',
        borderColor: '#CED0D4',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 7
    },
    avarta: {
        width: 44,
        height: 44,
        borderRadius: 22,

    },
    textCmt: {
        marginLeft: 5
    }

})