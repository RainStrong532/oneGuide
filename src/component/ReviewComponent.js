import React, { Component } from 'react';
import {
    StyleSheet,
    View, Text,
    ScrollView,
    Image,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
} from 'react-native';
import Images from '../assets/images'
import Colors from '../constants/colors'
import { i18next, Loading } from '../utils'
import Helper from '../utils/Helper';
import _ from 'lodash'
import {
    dimissModal,
    pushToUserProfile
} from '../navigation';
import HeaderView from './views/HeaderView';


class ReviewComponent extends Component {
    state = {
        rating: this.props.item && this.props.item.reviews ? this.props.item.reviews.rating : '',
        content: this.props.item && this.props.item.reviews ? this.props.item.reviews.content : ''
        // rating: '',
        // content: ''
    }
    onPressStar = (index) => {
        this.setState({ rating: index })
    }


    handleReview = () => {

        let data = {
            rating: this.state.rating,
            content: this.state.content,
            comment_id: this.props.item.comment_id,
            user_id: this.props.item.user_id
        }
        if (!this.state.rating || !this.state.content) {
            Helper.showAlert('', i18next.t('Vui lòng viết đánh giá'))
        } else {
            Loading.showHud();
            this.props.passPropsScreen()
            this.props.handleReviewUser(data)
                .then((data) => {
                    dimissModal(this.props.componentId)
                    // if (data && data.status == 'RESULT_OK')
                    //  {
                    //     Helper.showAlert('', i18next.t('Viết đánh giá thành công'),
                    //         [
                    //             {
                    //                 text: i18next.t('Ok'), onPress: () => {

                    //                 }
                    //             },

                    //         ]
                    //     )
                    // } else {
                    //     Helper.showAlert('', i18next.t('Viết đánh giá thất bại'))
                    // }
                })
        }
    }
    onPressBack = () => {
        dimissModal(this.props.componentId)
    }

    handleCancel = () => {
        dimissModal(this.props.componentId)
    }

    handleAvatar = (user_id) => {
        const data = { user_id }
        pushToUserProfile(this.props.componentId, data)
    }


    renderContent() {
        const rating = parseInt(this.state.rating || 0) || 0
        const star = [1, 2, 3, 4, 5];
        const { user_id, avatar, display_name, created_format, is_agent } = this.props.item || ''
        return (
            <ScrollView>
                <View style={{ margin: 10, borderRadius: 5, backgroundColor: '#fff', paddingTop: 5, paddingBottom: 15 }}>
                    <View style={{
                        flexDirection: 'row',
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        marginTop: 5
                    }}>
                        <View style={{ width: '15%' }}>
                            <TouchableOpacity
                                onPress={() => this.handleAvatar(user_id)}
                            >
                                <View style={{ width: 51, height: 51 }}>
                                    <Image
                                        source={{ uri: avatar }}
                                        style={{ width: 50, height: 50, borderRadius: 25 }}
                                    />
                                    {is_agent == "1" ?
                                        <Image
                                            style={{ width: 18, height: 18, borderRadius: 9, position: 'absolute', bottom: 0, right: 0 }}
                                            source={Images.logo_flag_header}>
                                        </Image> : null
                                    }
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '85%', alignSelf: 'center' }}>
                            <TouchableOpacity
                                onPress={() => this.handleAvatar(user_id)}
                            >
                                <Text style={{ color: Colors.black, fontWeight: '500', fontSize: 16 }}>{display_name}</Text>
                                <Text style={{ color: Colors.gray_3, fontSize: 12 }}>{created_format}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: 10, paddingHorizontal: 10 }}>

                        {star.map((item, i) => {
                            const image = i < rating ? Images.ic_star_yellow : Images.ic_star_gray
                            return <TouchableOpacity
                                key={i}
                                onPress={() => this.onPressStar(i + 1)}
                            // style={styles.button_star}
                            >
                                <Image
                                    style={styles.image_star}
                                    source={image}
                                    resizeMode='contain' />
                            </TouchableOpacity>
                        })}
                    </View>

                    {this.renderTextInput()}
                </View>
            </ScrollView>
        );
    }


    renderTextInput() {

        return (
            <KeyboardAvoidingView
                // style={{ flex: 1, flexDirection: 'column', }}
                behavior='padding'
                keyboardVerticalOffset={60} >
                <View style={{ margin: 5, padding: 10, borderColor: Colors.gray_3, borderWidth: 0.8, borderRadius: 5, }}>
                    <TextInput
                        multiline
                        style={{ textAlignVertical: 'top', }}
                        autoFocus={this.autoFocus}
                        placeholder={i18next.t('Viết nhận xét ...')}
                        selectionColor={Colors.black}
                        value={this.state.content}
                        onChangeText={(text) => this.setState({
                            content: text
                        })}
                        underlineColorAndroid='transparent'
                        numberOfLines={6}
                    /></View>
            </KeyboardAvoidingView>
        );
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <HeaderView
                    titleRight={i18next.t('SubmitEmail')}
                    onPressRightBarButton={this.handleReview}
                    title={i18next.t('WriteReview')}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                    back={true}
                    onPressLeftBarButton={this.onPressBack}
                />
                {this.renderContent()}
            </View>
        );
    }
}

export default ReviewComponent;

const styles = StyleSheet.create({
    container: {

        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.white,
        margin: 6,
        borderRadius: 5

    },
    title: {
        alignSelf: 'center',
        color: Colors.green_1,
        // fontWeight: 'bold',
        fontSize: 16
    },
    button_bar: {
        justifyContent: 'center',
        alignItems: 'center',
        top: 2,
        width: 80,
        height: 40,
        position: 'absolute',
    },
    photo: {
        margin: 5
    },

    button_star: {
        height: 40,
        width: 60,
        justifyContent: 'center'
    },
    image_star: {
        height: 30,
        width: 30,
        marginRight: 3,
        justifyContent: 'center'
    },
})