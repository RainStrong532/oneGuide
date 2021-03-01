import React, { Component } from 'react'
import { View, Text, SafeAreaView, ScrollView, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import PostSearchUsers from './postSearchUsers'
import { gotoPostDetail, backScreen } from '../../navigation'
import HeaderView from '../views/HeaderView'
import Colors from '../../constants/colors'
import PostView from '../post-views/PostView'
import i18next from 'i18next'

export default class SearchAllPost extends Component {

    constructor(props) {
        super(props)
        this.page = 1
        this.state = {
            totalPost: [],
            isLoadMore: true,
            refreshing: false,
        }
    }

    componentDidMount() {
        // this.props.SearchAllPost(this.props.passProps.textSearch)
        //     .then(data => {

        //         this.setState({
        //             totalPost: data.post.comments
        //         })
        //     })

        this.doGetPost(this.page)
    }

    onPressCommentButton = (data, isComment) => {
        // console.log('data search all', data);
        gotoPostDetail(this.props.passProps.parentComponentId,
            { ...data, onPressApplyButton: this.props.passProps.onPressApplyButton, isTotalPost: true },
            { showKeyboard: isComment })
    }

    onPressback = () => {
        backScreen(this.props.componentId)
    }

    onPressLikeButton = (comment_id) => {
        this.doLikeComment(comment_id)
    }

    doLikeComment = (comment_id) => {
        this.props.likeTotalPost(comment_id)
            .then(data => {
                // console.log('xong xong', data);
                this.setState({
                    totalPost: [...data]
                })
            })
            .catch(error => {
            });
    }

    doGetPost = (page) => {
        const textSearch = this.props.passProps.textSearch
        // const data = {
        //     textSearch
        // }
        // request
        this.props.SearchAllPost(textSearch, page)
            .then(data => {
                // let totalPost = data.post.comments
                // if (page != 1) {
                //     const currentPost = this.state.totalPost
                //     totalPost = _.concat(currentPost, totalPost)
                //     console.log(page, '------------------------------,', currentPost);
                // }

                this.page = page + 1
                this.setState({
                    totalPost: data,
                    refreshing: false,
                    isLoadMore: false
                })
            })
            .catch(error => {
                this.setState({
                    refreshing: false,
                    isLoadMore: false
                })
            });
    }

    loadMore = () => {

        // console.log('bdbdbdbdbdbdb');
        if (this.state.isLoadMore === true) {
            // console.log('=== = = = -sấdj');
            return
        }

        this.setState({ isLoadMore: true }, () => {
            // console.log(' - - - - - - - -');
            this.doGetPost(this.page)
        })
    }

    renderItem = ({ item, index }) => {
        const data = { index, comment: item }
        return (
            <View style={styles.render_a_post} >
                <PostView
                    data={data}
                    //    data={this.props.totalPost}
                    onPressApplyButton={this.props.passProps.onPressApplyButton}
                    onPressAvatarButton={this.props.passProps.onPressAvatarButton}
                    onPressCommentButton={this.onPressCommentButton}
                    onPressImage={this.props.passProps.onPressImage}
                    onPressLikeButton={() => this.onPressLikeButton(item.comment_id)}
                    onPressLikeListButton={this.props.passProps.onPressLikeListButton}
                    onPressMoreOptionsButton={this.props.passProps.onPressMoreOptionsButton}
                    onPressShareButton={this.props.passProps.onPressShareButton}
                    onPressSharePostButton={this.props.passProps.onPressSharePostButton}
                    onPressTourLocation={this.props.passProps.onPressLikeButton}
                    getInfomationGroup={this.props.passProps.getInfomationGroup}
                    goToGroup={this.props.passProps.goToGroup}
                />
            </View>
        )
    }

    keyExtractor = (item, index) => index.toString();

    render() {

        let totalPost
        if (this.state.totalPost) {
            totalPost = this.state.totalPost
        }
        // console.log('tất cả bài viết', this.props);
        // console.log('tô tồ bết', totalPost);
        return (
            // <SafeAreaView
            //     style={{
            //         marginBottom: 70
            //     }}
            // >
            <View style={{ flex: 1 }}>
                <HeaderView
                    title={i18next.t('ListPosts')}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                    back={true}
                    onPressLeftBarButton={this.onPressback}
                />
                {/* <ScrollView> */}

                <FlatList
                    removeClippedSubviews={false}
                    data={totalPost}
                    renderItem={this.renderItem}
                    onEndReached={this.loadMore}
                    // ListEmptyComponent={this.renderEmpty}
                    ListFooterComponent={this.renderBottom}
                    onEndReachedThreshold={0.9}
                    refreshControl={
                        <RefreshControl
                            onRefresh={this.pullRefresh}
                            refreshing={this.state.refreshing}
                        />
                    }
                    keyExtractor={this.keyExtractor}
                />
                {/* </ScrollView> */}
                {/* </SafeAreaView> */}
            </View>
        )
    }

    // renderEmpty = () => {

    //     const { isLoadMore } = this.state
    //     if (isLoadMore) {
    //         return null
    //     }

    //     return (<View style={styles.emptyView}>
    //         <Text style={{ fontSize: 14, color: Colors.black_1, textAlign: 'center' }}>
    //             {i18next.t('ThereIsNoTour')}
    //         </Text>
    //     </View>)
    // }

    pullRefresh = () => {
        if (this.state.refreshing === true) {
            return
        }

        this.setState({ refreshing: true }, () => {
            this.doGetPost(1)
        })
    }

    renderBottom = () => {
        return (
            <View style={{ height: 40, justifyContent: 'center' }}>
                {this.state.isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // margin:10,
        // borderRadius:10
    },
    render_a_post: {
        backgroundColor: Colors.white,
        // marginBottom: 8,
        borderTopWidth: 5,
        borderColor: "#dcdcde"
        // marginRight: 8,
        // marginLeft: 8,
        // borderRadius:10
    }
})