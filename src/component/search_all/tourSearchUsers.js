import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import PostView from '../post-views/PostView'
import Colors from '../../constants/colors';
import {
    gotoPostDetail,
    pushToUserProfile,
    showModalLikeList,
    pushListLocation,
    gotoSearchAllTour
} from '../../navigation'
import _ from 'lodash'
import { i18next, Loading } from '../../utils'

class TourSearchUsers extends Component {

    constructor(props) {
        super(props)
        this.handleApply = _.debounce(this.onPressApplyButton, 500, { leading: true, trailing: false })
        this.handleListlike = _.debounce(this.onPressLikeListButton, 500, { leading: true, trailing: false })
        this.state = {
            tours: []
        }
    }

    componentDidMount() {
        // setTimeout(() => {
        //     this.setState({
        //         tours: this.props.data
        //     })
        // }, 10000)
        // this.getTour()
    }

    // getTour = () => {
    //     if (this.props.data) {
    //         this.setState({
    //             tours: this.props.data
    //         })
    //     }
    // }

    onPressLikeListButton = (data, isComment) => {
        showModalLikeList(this.props.parentComponentId, data, { showKeyboard: isComment })
    }

    onPressAvatarButton = (data) => {
        // console.log();
        pushToUserProfile(this.props.parentComponentId, { ...data, onPressApplyButton: this.props.onPressApplyButton, })
    }

    onPressApplyButton = (data) => {
        if (this.props.onPressApplyButton) {
            this.props.onPressApplyButton(data)
        }
    }

    onPressCommentButton = (data, isComment) => {
        gotoPostDetail(this.props.parentComponentId,
            { ...data, onPressApplyButton: this.props.onPressApplyButton, isTour: true },
            { showKeyboard: isComment })
    }

    // onPressApplyButton = (data) => {
    //     if (this.props.onPressApplyButton) {
    //         this.props.onPressApplyButton(data)
    //     }
    // }

    onPressSharePostButton = (data) => {
        gotoPostDetail(this.props.parentComponentId, { comment: data })
    }

    onPressApplyButton = (data) => {
        if (this.props.onPressApplyButton) {
            this.props.onPressApplyButton(data)
        }
    }

    onPressTourLocation = (data) => {
        if (data.location) {
            const locations = data.location.split('-')
            pushListLocation(this.props.parentComponentId, { locations })
        }

    }

    onPressLikeTourSearch = (comment_id) => {
        this.doLikeTourSearch(comment_id)
    }

    doLikeTourSearch = (comment_id) => {
        // console.log('like tour search pẹt pẹt', comment_id)
        this.props.likeTourSearch(comment_id)
            .then(data => {
                this.setState({
                    tours: data
                })
            })
            .catch(error => {

            })
    }


    renderItem = ({ item, index }) => {
        const data = { index, comment: item }
        const user = _.get(this.props, 'user')

        return (
            <View style={styles.render_post} >

                <PostView
                    data={data}
                    user={user}
                    onPressLikeButton={this.props.onPressLikeButton}
                    parentComponentId={this.props.parentComponentId}
                    onPressImage={this.props.onPressImage}
                    onPressCommentButton={this.onPressCommentButton}
                    onPressShareButton={this.props.onPressShareButton}
                    onPressMoreOptionsButton={this.props.onPressMoreOptionsButton}
                    onPressSharePostButton={this.onPressSharePostButton}
                    onPressApplyButton={this.handleApply}
                    onPressAvatarButton={this.onPressAvatarButton}
                    onPressLikeListButton={this.handleListlike}
                    onPressTourLocation={this.onPressTourLocation}
                />

            </View>
        )
    }

    render() {
        // console.log('props toursearchuser', this.props);
        let tours
        if (this.props.data) {

            tours = this.props.data
        }
        // console.log('tour search đcmm', this.props);
        let data = {
            textSearch: this.props.textSearch,
            onPressLikeButton: this.props.onPressLikeButton,
            parentComponentId: this.props.parentComponentId,
            onPressImage: this.props.onPressImage,
            onPressCommentButton: this.onPressCommentButton,
            onPressShareButton: this.props.onPressShareButton,
            onPressMoreOptionsButton: this.props.onPressMoreOptionsButton,
            onPressSharePostButton: this.onPressSharePostButton,
            onPressApplyButton: this.handleApply,
            onPressAvatarButton: this.onPressAvatarButton,
            onPressLikeListButton: this.handleListlike,
            onPressTourLocation: this.onPressTourLocation,
        }
        return (
            tours.length != 0
                ?
                <View style={styles.container}>
                    <FlatList
                        removeClippedSubviews={false}
                        data={tours}
                        renderItem={this.renderItem}
                    />
                    <View
                        style={{ marginBottom: 10 }}
                    />
                    <TouchableOpacity
                        style={styles.fullFriend}
                        onPress={() => gotoSearchAllTour(this.props.parentComponentId, data)}
                    >
                        <Text
                            style={{

                                textAlign: 'center',
                                color: '#1B2631',
                                fontSize: 16
                            }}
                        >
                            {i18next.t('SeeAll')}
                            {/* {
                                this.props.isAgent === '2'
                                    ?
                                    'xem thêm lịch rảnh của guide'
                                    :
                                    'xem thêm tour'
                            } */}

                        </Text>
                    </TouchableOpacity>
                </View>
                :
                <View></View>
        );
    }
}

export default TourSearchUsers;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.white,
        //    marginTop:8,
        // marginLeft: 8,
        // marginRight: 8,
        // marginBottom: 8

    },
    render_post: {
        backgroundColor: Colors.white,
        // margin:8,
        // marginBottom: 8,
        // marginLeft: 8,
        // marginRight: 8,
        // borderRadius:10
        borderTopWidth: 5,
        borderColor: "#dcdcde"
    },
    fullFriend: {
        padding: 8,
        backgroundColor: '#F2F3F4',
        width: '90%',
        alignSelf: 'center',
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 20
    }
})