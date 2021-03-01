import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Image,
  ActivityIndicator, TouchableOpacity, Alert, Platform, FlatList,
  ScrollView, TextInput, KeyboardAvoidingView,
  RefreshControl
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { ReachabilityView, i18next, Loading } from '../utils'
import {
  backScreen, gotoPostDetail, gotoUserApplyScreen,
  showModalApplyList, pushToUserProfile,
  pushListGuideTour,
  pushListGuideApplyTour,
  pushListGuideInvited,
  pushListGuideApply,
  pushDetailTourInvited
} from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import CommonStyles from '../constants/styles'
import _ from 'lodash'
import Helper from '../utils/Helper';
import TourItemComponent from './tour-view/TourItemComponent'

export default class ApplyTourComponent extends Component {

  constructor(props) {
    super(props);
    this.doGetListApplied = this.doGetListApplied.bind(this)
    // this.doApplyTour = this.doApplyTour.bind(this)
    this.handleDtailTour = _.debounce(this.onPressTourItem, 500, { leading: true, trailing: false })
    // this.handleApply = _.debounce(this.onPressApplyItem, 500, { leading: true, trailing: false })
    // this.page = 1
    this.state = {
      refreshing: false,
      isLoadMore: false,
      // tours: []
      page: 1
    }
  }

  componentDidMount() {

    this.doGetListApplied(this.state.page)

  }

  componentWillUnmount() {

  }

  handleListGuideApply = (id) => {
    pushListGuideApply(this.props.componentId, { id })
  }


  handleName = (user_id) => {
    const data = { user_id }
    pushToUserProfile(this.props.componentId, data)
  }
  doGetListApplied = (page) => {
    this.props.getListApplied(page)
      .then(data => {
        if (data && data.data.length == 0) {
          // console.log("1111111111111111111111111111");
          this.setState({
            refreshing: false,
            isLoadMore: false
          })
        } else {
          // console.log("222222222222222222222222222222");
          this.setState({
            page: this.state.page + 1,
            refreshing: false,
            isLoadMore: false
          })
        }
      })
      .catch(error => {
        this.setState({
          refreshing: false,
          isLoadMore: false
        })
      });
  }

  render() {
    const { refreshing, isLoadMore } = this.state
    const { tours } = this.props
    return (
      <View style={styles.container}>
        <FlatList
          removeClippedSubviews={false}
          data={tours}
          extraData={tours}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          refreshing={refreshing}
          onRefresh={this.pullRefresh}
          // onEndReached={this.doGetListApplied}
          onEndReached={this.loadMore}
          onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 1}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={this.renderBottom}
          ListEmptyComponent={this.renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.pullRefresh}
            />
          }

        />
      </View>
    )
  }

  renderEmpty = () => {

    const { isLoadMore } = this.state
    if (isLoadMore) {
      return null
    }

    return (<View style={styles.emptyView}>
      <Text style={{ fontSize: 14, color: Colors.black_1, textAlign: 'center' }}>
        {i18next.t('ThereIsNoTour')}
      </Text>
    </View>)
  }

  loadMore = () => {
    // if (this.state.isLoadMore === true) {
    //   return
    // }

    this.setState({ isLoadMore: true }, () => {
      this.doGetListApplied(this.state.page)
    })
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

    this.setState({ refreshing: true, page: 1 }, () => {
      this.doGetListApplied(this.state.page)
    })
  }

  onPressTourItem = (item) => {
    // gotoPostDetail(this.props.componentId, { comment: item })
    pushDetailTourInvited(this.props.componentId, { item })
  }

  keyExtractor = (item, index) => index.toString()

  handleCanceled = () => {
    Helper.showAlert('', i18next.t('Bạn đã hủy tour này'))
  }
  handleGuideCancelTour = (value) => {
    //call api guide huy dang ki hoac huy tour
    Helper.showAlert('', i18next.t('DoYouWantToCancelThisTour'),
      [
        {
          text: i18next.t('Ok'),
          onPress: () => {
            const data = {
              comment_id: value.comment_id,
              action: 'guide-cancel'
            }
            this.props.guideCancelTour(data)
          },
        },
        {
          text: i18next.t('No'), onPress: () => {
          },
        },
      ]
    )
  }
  handleGuideCancelRegister = (value) => {
    Helper.showAlert('', i18next.t('Bạn có chắc hủy đăng ký tour này'),
      [
        {
          text: i18next.t('Ok'),
          onPress: () => {
            const data = {
              comment_id: value.comment_id,
              action: 'guide-cancel'
            }
            this.props.guideCancelTour(data)
          },
        },
        {
          text: i18next.t('No'), onPress: () => {
          },
        },
      ]
    )
  }
  renderItem = ({ item, index }) => {
    const user_id = _.get(this.props, 'user.me.user_id')
    const user_id_create_tour = _.get(item, 'user_id')
    const show_number = (user_id === user_id_create_tour)
    const isAgent = _.get(this.props, 'user.me.is_agent')
    // console.log("thông tin tài kboan đang nhap", isAgent);
    let action;
    if (item.apply) {
      // apply_type = i18next.t('WaitConfirmation')
      action = item.apply.action
    }

    return (
      <View style={{

        //  borderBottomWidth: 0.5,
        paddingVertical: 5, marginTop: 10, backgroundColor: '#ffffff'
      }}>
        {
          isAgent == 1 ?
            <View style={{ flexDirection: 'row', marginHorizontal: 10, }}>
              <View style={{ width: '12%' }}>
                <TouchableOpacity
                  onPress={() => this.handleName(item.user_id)}
                >
                  <Image
                    source={{ uri: item.avatar }}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ width: '88%', justifyContent: 'center', marginLeft: 3 }}>
                <TouchableOpacity
                  onPress={() => this.handleName(item.user_id)}
                >
                  <Text style={{ color: Colors.black, fontSize: 16, fontWeight: '500' }}>
                    {item.display_name}
                  </Text>
                  <Text>{item.created_format}</Text>
                </TouchableOpacity>
              </View>

            </View> :
            null
        }
        <TouchableOpacity
          onPress={() => this.onPressTourItem(item)}
        >

          <View style={{ paddingHorizontal: 10, flexDirection: 'row', marginTop: 10 }}>
            <Image
              source={Images.tour_name}
              resizeMode='contain'
              style={{ width: 16, height: 16, marginTop: 3 }}
            />
            <Text style={{ paddingLeft: 5, fontSize: 16, fontWeight: '700', color: Colors.black }}>{item.title}</Text>
          </View>
          <View style={styles.wrapContent}>
            <Image
              source={Images.tour_location}
              resizeMode='contain'
              style={{ width: 16, height: 16, marginTop: 3 }}
            />
            <Text style={{ paddingLeft: 5, fontSize: 14, color: Colors.black }}>{item.location}</Text>
          </View>
          <View style={styles.wrapContent}>
            <Image
              source={Images.tour_calendar}
              resizeMode='contain'
              style={{ width: 16, height: 16, marginTop: 3 }}
            />
            <Text style={{ paddingLeft: 5, fontSize: 14, color: Colors.black }}>{item.date_tour}</Text>
          </View>
        </TouchableOpacity>
        {
          isAgent == '2' ?
            // <View style={styles.wrapContent}>
            //   <TouchableOpacity
            //     onPress={() => this.handleListGuideApply(item.comment_id)}
            //   >
            //     <Text style={{ fontSize: 18, textDecorationLine: 'underline', color: Colors.green_1, }}>{i18next.t('TourGuideRegistration')}</Text>
            //   </TouchableOpacity>


            // </View>
            <View style={{
              flexDirection: 'row', alignItems: 'center',
              justifyContent: 'space-between', marginTop: 10,
              borderTopWidth: 0.5,
              borderTopColor: Colors.light_gray_1,
              paddingHorizontal: 15,
              paddingVertical: 10
            }}>
              <TouchableOpacity
                onPress={() => this.handleListGuideApply(item.comment_id)}
              >
                <View style={{ flexDirection: 'row', }}>
                  <Image
                    source={Images.tour}
                    style={{ width: 14, height: 14, resizeMode: 'contain', alignSelf: 'center' }}
                  />
                  <Text style={{ fontSize: 14, paddingLeft: 5, color: Colors.black }}>Hướng dẫn viên </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.handleListGuideApply(item.comment_id)}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={Images.post_apply}
                    style={{ width: 14, height: 14, resizeMode: 'contain', alignSelf: 'center' }}
                  />
                  <Text style={{ fontSize: 14, paddingLeft: 5, color: Colors.black }}>Đăng ký</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.handleListGuideApply(item.comment_id)}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={Images.invite_friend_end}
                    style={{ width: 14, height: 14, resizeMode: 'contain', alignSelf: 'center' }}
                  />
                  <Text style={{ fontSize: 14, paddingLeft: 5, color: Colors.black }}>Lời mời</Text>
                </View>
              </TouchableOpacity>
            </View>
            // : null
            :
            <View style={{ marginTop: 10, marginBottom: 5, }}>
              <View style={{ paddingHorizontal: 10, marginVertical: 5, flexDirection: "row" }}>
                <Image
                  source={Images.tour_deadline}
                  style={{ width: 16, height: 16, alignSelf: 'center' }}
                  resizeMode='contain'
                />
                {
                  action == 'guider-apply' ?
                    <Text style={{ paddingLeft: 5 }}>
                      Chờ xác nhận đăng ký
                  </Text> : null
                }
                {
                  action == 'agency-agreed-guider-apply' ?
                    <Text style={{ paddingLeft: 5 }}>
                      Agent đã đồng ý
                  </Text> : null
                }
                {
                  action == '' || action == '' ?
                    <Text style={{ paddingLeft: 5 }}>
                      Agent đã từ chối đăng ký tham gia
                  </Text> : null
                }
                {
                  action == 'agency-request-cancel' ?
                    <Text style={{ paddingLeft: 5 }}>
                      Agent gửi yêu cầu hủy tour
                  </Text> : null
                }
                {
                  action == 'guide-agency-commit-cancel' ?
                    <Text style={{ paddingLeft: 5 }}>
                      Tour đã hủy
                  </Text> : null
                }
                {
                  action == "guide-cancel-before-agreed" ?
                    <Text style={{ paddingLeft: 5 }}>
                      Đã hủy đăng ký tour
                  </Text> : null
                }
                {
                  action == "guide-request-cancel" || action == "guide-cancel" ?
                    <Text style={{ paddingLeft: 5 }}>
                      Chờ Agent xác nhận hủy tour
                  </Text> : null
                }
              </View>
              {
                action == 'guider-apply' ?
                  <View style={{ paddingVertical: 10, flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: Colors.gray_3, paddingHorizontal: 10 }}>

                    <View style={{ borderRadius: 6, borderColor: Colors.green_1, paddingVertical: 5, paddingHorizontal: 10, borderWidth: 1 }}>
                      <TouchableOpacity
                        onPress={() => this.handleGuideCancelRegister(item)}
                      >
                        <Text style={{ color: Colors.green_1, fontSize: 14 }}>Hủy đăng ký</Text>

                      </TouchableOpacity>
                    </View>

                  </View> : null
              }
              {
                action == "agency-agreed-guider-apply" ?
                  <View style={{ paddingVertical: 10, paddingHorizontal: 10, flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: Colors.gray_3 }}>

                    <View style={{ borderRadius: 6, borderColor: Colors.green_1, paddingVertical: 5, paddingHorizontal: 10, borderWidth: 1 }}>
                      <TouchableOpacity
                        onPress={() => this.handleGuideCancelTour(item)}
                      >
                        <Text style={{ color: Colors.green_1, fontSize: 14 }}>Hủy tour</Text>
                      </TouchableOpacity>
                    </View>
                  </View> : null
              }

              {
                action == "agency-request-cancel" ?
                  <View style={{ paddingVertical: 10, paddingHorizontal: 10, flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: Colors.gray_3 }}>

                    <View style={{ borderRadius: 6, borderColor: Colors.green_1, paddingVertical: 5, paddingHorizontal: 10, borderWidth: 1 }}>
                      <TouchableOpacity
                        onPress={() => this.handleGuideCancelTour(item)}
                      >
                        <Text style={{ color: Colors.green_1, fontSize: 14 }}>Đồng ý</Text>
                      </TouchableOpacity>
                    </View>
                  </View> : null
              }


            </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  },
  wrapContent: {
    flexDirection: 'row',
    marginTop: 5,
    // alignItems: 'center',
    paddingHorizontal: 10,
  },
  styleText: {

  }

});