import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import PostView from '../post-views/PostView'
import Colors from '../../constants/colors';
import { gotoPostDetail, pushToUserProfile, showModalLikeList, pushListLocation, gotoSearchAllPost } from '../../navigation'
import _ from 'lodash'
import i18next from 'i18next';

class PostSearchUsers extends Component {

    constructor(props) {
        super(props)
        this.handleApply = _.debounce(this.onPressApplyButton, 500, { leading: true, trailing: false })
        this.handleListlike = _.debounce(this.onPressLikeListButton, 500, { leading: true, trailing: false })
    }

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
            { ...data, onPressApplyButton: this.props.onPressApplyButton, isPost: true },
            { showKeyboard: isComment })
    }

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
    renderItem = ({ item, index }) => {
        const data = { index, comment: item }

        return (
            <View style={styles.render_a_post} >
                <PostView

                    data={data}
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
                    getInfomationGroup={this.props.getInfomationGroup}
                    goToGroup={this.props.goToGroup}
                />
            </View>
        )
    }

    render() {
        let posts
        if (this.props.data) {
            posts = this.props.data
        }
        // console.log('post post post post:::', posts);
        let data = {
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
            textSearch: this.props.textSearch,
            getInfomationGroup: this.props.getInfomationGroup,
            goToGroup: this.props.goToGroup
        }

        return (
            <View>
                {
                    posts.length != 0
                        ?
                        <View style={styles.container}>
                            <FlatList
                                removeClippedSubviews={false}
                                data={posts}
                                renderItem={this.renderItem}
                            />
                            <TouchableOpacity
                                onPress={() => gotoSearchAllPost(this.props.parentComponentId, data)}
                                style={styles.fullFriend}
                            >
                                <Text
                                    style={{
                                        color: '#1B2631',
                                        textAlign: 'center',
                                        fontSize: 16
                                    }}
                                >
                                    {i18next.t('SeeAll')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        :
                        null
                }
            </View>
        );
    }
}

export default PostSearchUsers;
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
    render_a_post: {
        backgroundColor: Colors.white,
        borderTopWidth: 5,
        borderColor: "#dcdcde"
        // marginBottom: 8,
        // marginRight: 8,
        // marginLeft: 8,
        // borderRadius:10
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