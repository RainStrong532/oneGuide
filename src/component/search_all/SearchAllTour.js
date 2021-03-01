import React, { Component } from 'react'
import { View, Text, SafeAreaView, ScrollView, FlatList, RefreshControl, ActivityIndicator } from 'react-native'
import HeaderView from '../views/HeaderView'
import Colors from '../../constants/colors'
import PostView from '../post-views/PostView'
import { backScreen, gotoPostDetail, showModalApplyList } from '../../navigation'
import _ from 'lodash'
import Helper from '../../utils/Helper';
import { i18next, Loading } from '../../utils'

export default class SearchAllTour extends Component {

    constructor(props) {
        super(props)
        this.page = 1
        this.state = {
            totalTour: [],
            isLoadMore: true,
            refreshing: false
        }
    }

    componentDidMount() {
        // this.props.SearchAllTour(this.props.passProps.textSearch)
        //     .then(res => {
        //         this.setState({
        //             totalTour: res.tour.comments
        //         })
        //         console.log('sờ tết', this.state.totalTour);
        //     })

        this.doGetTour(this.page)
    }

    onPressCommentButton = (data, isComment) => {
        gotoPostDetail(this.props.passProps.parentComponentId,
            { ...data, onPressApplyButton: this.props.passProps.onPressApplyButton, isTotalTour: true },
            { showKeyboard: isComment })
    }

    onPressBack = () => {
        backScreen(this.props.componentId)
    }

    onPressLikeButton = (comment_id) => {
        this.doLikeComment(comment_id)
    }

    doLikeComment = (comment_id) => {
        this.props.likeTotalTour(comment_id)
            .then(data => {
                this.setState({
                    totalTour: data
                })
            })
            .catch(error => {
            });
    }

    onPressApplyButton = (data) => {
        // const is_verify = _.get(this.props, 'user.me.is_verify');
        // if (is_verify.toString() !== "1") {
        //     Helper.showAlert('', i18next.t('NeedToVerify'),
        //         [
        //             { text: i18next.t(i18next.t('Cancelled')), onPress: null },
        //             { text: i18next.t(i18next.t('verify')), onPress: this.pushToAccountVerify }
        //         ])
        //     return;
        // }
        //console.log("data request", data);
        // const user_id = _.get(this.props, 'user.me.user_id')
        // const user_id_create_tuor = _.get(data, 'comment.user_id')
        // const comment_id = _.get(data, 'comment.comment_id')

        // if (user_id !== user_id_create_tuor) {

        //     const apply_type = _.get(data, 'comment.apply.type') || ''


        //     if (apply_type.toString() === '4') {
        //         return
        //     }

        //     const user_apply = _.get(data, 'comment.user_apply')

        //     if (user_apply === 'active') {
        //         Helper.showAlert('', i18next.t('DoYouWantToCancelThisTour'),
        //             [
        //                 {
        //                     text: i18next.t('Ok'),
        //                     onPress: () => {
        //                         this.doApplyPost(comment_id)
        //                     },
        //                     style: 'destructive'
        //                 },
        //                 {
        //                     text: i18next.t('No'), onPress: () => {
        //                     },
        //                 },
        //             ]
        //         )
        //     } else {
        //         this.doApplyPost(comment_id)
        //     }

        // } else {
        //     showModalApplyList(this.props.componentId, { comment_id }, '')
        // }
    }

    doApplyPost = (comment_id) => {

        Loading.showHud()

        // request
        this.props.applyPost(comment_id)
            .then(data => {

                Loading.hideHud()

                if (data.error) {
                    Helper.showAlert('', data.messages,
                        [
                            {
                                text: 'OK', onPress: () => {
                                }
                            }
                        ]
                    )
                }
            })
            .catch(error => {
                Loading.hideHud()

                if (error) {
                    Helper.showAlert('', error,
                        [
                            {
                                text: 'OK', onPress: () => {
                                }
                            }
                        ]
                    )
                }

            });
    }

    doGetTour = (page) => {
        const textSearch = this.props.passProps.textSearch
        // console.log('page hiện tại', page);
        this.props.SearchAllTour(textSearch, page)
            .then(data => {
                // console.log('++++++++++++++++++++++++++', data);
                this.page = page + 1
                this.setState({
                    totalTour: data,
                    isLoadMore: false,
                    refreshing: false
                })
            })
            .catch(error => {
                this.setState({
                    isLoadMore: false,
                    refreshing: false
                })
            })
    }

    loadMore = () => {
        // console.log('có chạy vào hàm này');
        if (this.state.isLoadMore === true) {
            return
        }
        this.setState({ isLoadMore: true }, () => {
            this.doGetTour(this.page)
        })
    }

    renderItem = ({ item, index }) => {
        const data = { index, comment: item }
        // console.log('data tour search', data);
        const user = _.get(this.props, 'user')
        return (
            <View style={{
                borderTopWidth: 5,
                borderColor: "#dcdcde"
            }} >
                <PostView
                    data={data}
                    user={user}
                    // textSearch: this.props.textSearch,
                    onPressLikeButton={() => this.onPressLikeButton(item.comment_id)}
                    parentComponentId={this.props.passProps.parentComponentId}
                    onPressImage={this.props.passProps.onPressImage}
                    onPressCommentButton={this.onPressCommentButton}
                    onPressShareButton={this.props.passProps.onPressShareButton}
                    onPressMoreOptionsButton={this.props.passProps.onPressMoreOptionsButton}
                    onPressSharePostButton={this.props.passProps.onPressSharePostButton}
                    onPressApplyButton={() => this.onPressApplyButton({ comment: item })}
                    onPressAvatarButton={this.props.passProps.onPressAvatarButton}
                    onPressLikeListButton={this.props.passProps.handleListlike}
                    onPressTourLocation={this.props.passProps.onPressTourLocation}
                />
            </View>
        )
    }


    render() {
        let is_agent
        if (this.props.user && this.props.user.me && this.props.user.me.is_agent) {
            is_agent = this.props.user.me.is_agent
        }
        let { totalTour } = this.state
        return (
            <View style={{ flex: 1 }}
            >
                <HeaderView
                    title={is_agent == 1 ? i18next.t('TourList') : i18next.t('ListOfCalendarGuide')}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                    back={true}
                    onPressLeftBarButton={this.onPressBack}
                />
                {/* <ScrollView>
                    <View> */}
                <FlatList
                    removeClippedSubviews={false}
                    data={totalTour}
                    renderItem={this.renderItem}
                    onEndReached={this.loadMore}
                    // refreshing={this.state.refreshing}
                    ListFooterComponent={this.renderBottom}
                    // ListEmptyComponent={this.renderEmpty}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.pullRefresh}
                        />
                    }
                    onEndReachedThreshold={0.9}
                // style={{ marginBottom: 50 }}


                />
                {/* </View>
                </ScrollView> */}
            </View>
        )
    }

    renderEmpty = () => {

        const { isLoadMore } = this.state
        if (isLoadMore) {
            return null
        }

        return (<View style={styles.emptyView}>
            <Text style={{ fontSize: 14, color: Colors.black_1, textAlign: 'center', marginTop: 100 }}>
                {i18next.t('ThereIsNoTour')}
            </Text>
        </View>)
    }

    pullRefresh = () => {
        if (this.state.refreshing === true) {
            return
        }

        this.setState({ refreshing: true }, () => {
            this.doGetTour(1)
        })
    }

    renderBottom = () => {
        // const isLoadMore = this.state.isLoadMore
        // console.log(this.state.isLoadMore, "dfjgkdfjg");
        return (
            <View style={{ height: 40, justifyContent: 'center' }}>
                {this.state.isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
            </View>
        )
    }
}