
import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Image,
  ActivityIndicator, TouchableOpacity, Alert, Platform, FlatList,
  ScrollView, TextInput, KeyboardAvoidingView,
  RefreshControl
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { ReachabilityView, i18next, Loading } from '../utils'
import { showModalTourReview, gotoChatScreen, pushToUserProfile, backScreen } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import CommonStyles from '../constants/styles'
import DataManager from '../modules/DataManager'
import HeaderView from './views/HeaderView'
import _ from 'lodash'
import Helper from '../utils/Helper';
import TourItemComponent from './tour-view/TourItemComponent'
import UserApplyItemView from './tour-view/UserApplyItemView';

export default class PostApplyListComponent extends Component {

  static options(passProps) {
    return {
      statusBar: {
        backgroundColor: 'transparent',
        visible: true,
        style: 'light'
      },
    };
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.doGetApplyListPost = this.doGetApplyListPost.bind(this)
    this.state = {
      refreshing: false,
      isLoadMore: true,
      applyList: []
    }
  }
  componentDidMount() {
  }

  componentDidAppear() {

    const commentId = _.get(this.props, 'data.comment_id')
    this.doGetApplyListPost(commentId)
    if (!this.didAppearFirst) {
      this.didAppearFirst = true
    }
  }

  onPressBack = () => {
    backScreen(this.props.componentId)
  }

  onPressUserProfile = (user_id) => {
    const data = { user_id }
    // showModalUserProfile(user_id, '')
    pushToUserProfile(this.props.componentId, data)
  }

  onPressCancel = (item) => {
    // console.log("cahy case cancel", item);
    const data = {
      comment_id: item.comment_id,
      guider_id: item.user_guide_id,
      action: 'agent-cancel'
    }
    if (item.agent_apply.type == 'agent-cancel') {
      Helper.showAlert(i18next.t('YouHaveCanceledThisGuide'))
    } else {
      Helper.showAlert('', i18next.t('Bạn có chắc hủy Guider này ?'),
        [
          {
            text: i18next.t('Ok'),
            onPress: () => {
              this.doApplyPost(data)
            },

          },
          {
            text: i18next.t('No'), onPress: () => {
            },
          },
        ]
      )

    }
  }

  onPressAgree = (item) => {
    // console.log("chay case dong ys", item);
    // const agent_apply_type = _.get(item, 'agent_apply.type').toString() || ''

    // if (agent_apply_type === 'review' ||
    //   agent_apply_type === 'finish') {
    //   const data = {
    //     user_id: item.user_id,
    //     comment_id: item.comment_id,
    //     link_tour: item.link,
    //     title_tour: item.title,
    //   }

    //   const review = item.review

    //   showModalTourReview(data, review)
    //   return
    // }


    // const comment_id = _.get(item, 'comment_id')
    // const user_id = _.get(item, 'user_id')
    // const data = { comment_id, user_id }
    const data = {
      comment_id: item.comment_id,
      guider_id: item.user_guide_id
    }
    // console.log("datata", data);
    this.doApplyPost(data)
  }


  doGetApplyListPost = (commentId) => {
    this.props.getApplyListPost(commentId)
      .then(data => {
        let applyList = data

        this.setState({
          applyList,
          refreshing: false,
          isLoadMore: false
        })
      })
      .catch(error => {
      });
  }

  doApplyPost = (comment_data) => {
    Loading.showHud()

    // request
    this.props.applyUser(comment_data)
      .then(data => {
        // console.log("data sau khi agent click dong y", data);
        let applyList = _.cloneDeep(this.state.applyList)
        // const index = _.findIndex(applyList, { user_id: comment_data.user_id });
        // console.log("object đâjfajdflajd", applyList);
        const index = applyList.findIndex(item => item.user_guide_id == comment_data.guider_id)
        // console.log("index dang kiem tra", index);
        if (index >= 0) {
          let comment = applyList[index]
          comment.agent_apply = data.apply
          applyList[index] = comment;
          this.setState({
            applyList
          })

        }

        Loading.hideHud()
        // if (data.error) {
        //   Helper.showAlert('', data.messages,
        //     [
        //       {
        //         text: 'OK', onPress: () => {
        //         }
        //       }
        //     ]
        //   )
        // }
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


  render() {
    const { refreshing, applyList } = this.state

    return (
      <View style={styles.container}>
        <HeaderView
          title={i18next.t('ListUserApply')}
          tintColor={Colors.white}
          style={{ backgroundColor: Colors.green_1 }}
          back={true}
          onPressLeftBarButton={this.onPressBack}
        />
        <FlatList
          removeClippedSubviews={false}
          data={applyList}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          refreshing={refreshing}
          onRefresh={this.pullRefresh}
          onEndReached={this.loadMore}
          onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 10}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={this.renderBottom}
          ListEmptyComponent={this.renderEmpty}
        />
      </View>
    )
  }

  loadMore = () => {
    return
  }

  renderEmpty = () => {

    const { isLoadMore } = this.state
    if (isLoadMore) {
      return null
    }

    return (<View style={styles.emptyView}>
      <Text style={{ fontSize: 14, color: Colors.black_1, textAlign: 'center' }}>
        {i18next.t('ThereIsNoApply')}
      </Text>
    </View>)
  }

  renderBottom = () => {
    const { isLoadMore } = this.state;
    return (<View style={{ height: 40, justifyContent: 'center' }}>
      {isLoadMore ? <ActivityIndicator animating size="small" color={Colors.black} /> : null}
    </View>)
  }

  pullRefresh = () => {
    if (this.state.refreshing === true) {
      return
    }

    this.setState({ refreshing: true }, () => {
      const commentId = _.get(this.props, 'data.comment_id')
      this.doGetApplyListPost(commentId)
    })
  }


  renderItem = ({ item, index }) => {
    return (
      <UserApplyItemView
        item={item}
        index={index}
        onPressUserProfile={this.onPressUserProfile}
        onPressAgree={this.onPressAgree}
        onPressCancel={this.onPressCancel}
      />
    )
  }

  keyExtractor = (item, index) => index.toString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  }
});