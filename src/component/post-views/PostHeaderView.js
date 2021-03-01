
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import Device from '../../modules/Device'
import CommonStyles from '../../constants/styles'
import { i18next } from '../../utils'
import DateHelper from '../../utils/DateHelper'
import _ from 'lodash'

export default class PostHeaderView extends Component {

  static propTypes = {
    searchText: PropTypes.string,
    onPressMoreOptionsButton: PropTypes.func,
    onPressAvatarButton: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.onPressMoreOptionsButton = this.onPressMoreOptionsButton.bind(this)
    this.onPressAvatarButton = this.onPressAvatarButton.bind(this)
    this.onPressSharePostButton = this.onPressSharePostButton.bind(this)

  }

  shouldComponentUpdate(nextProps, nextState) {
    const nextData = _.get(nextProps, 'data')
    const data = _.get(this.props, 'data')

    const shouldUpdate = (
      nextData.avatar !== data.avatar ||
      nextData.updated_date !== data.updated_date ||
      nextData.display_name !== data.display_name ||
      nextData.place_name !== data.place_name ||
      nextData.place_id !== data.place_id ||
      nextData.typecomment !== data.typecomment
    )
    return shouldUpdate
  }

  onPressMoreOptionsButton = () => {
    if (this.props.onPressMoreOptionsButton) {
      this.props.onPressMoreOptionsButton()
    }
  }

  onPressAvatarButton = () => {
    const { isShare, data } = this.props
    if (isShare) {
      this.props.onPressAvatar(data)
    }
    else if (this.props.onPressAvatarButton) {
      this.props.onPressAvatarButton()
    } else {
      this.props.onPressAva(data)
    }

  }

  onPressNameButton = () => {
    if (this.props.onPressNameButton) {
      this.props.onPressNameButton()
    }
  }

  onPressTitleGroupButton = () => {
    if (this.props.onPressTitleGroupButton) {
      const group_id = this.props.data.group_id
      this.props.onPressTitleGroupButton(group_id)
    }
  }


  onPressSharePostButton = () => {
    const detailCommentShare = _.get(this.props, 'data.detailCommentShare')
    if (this.props.onPressSharePostButton &&
      detailCommentShare) {
      this.props.onPressSharePostButton(detailCommentShare)
    }
  }

  onPressLocation = () => {
    const place_id = _.get(this.props, 'data.place_id')
    if (this.props.onPressLocationButton &&
      place_id) {
      this.props.onPressLocation(place_id)
    }
  }

  render() {
    // date
    const is_agent = _.get(this.props, 'data.is_agent') || ""
    const avatar = _.get(this.props, 'data.avatar') || null
    const updated_date_tmp = _.get(this.props, 'data.created_time') || _.get(this.props, 'data.created_date')
    const updated_date = DateHelper.timeSince(updated_date_tmp)
    const { isShare, data } = this.props
    // let is_agent,is_agent_share =""
    // if(data&&data.is_agent){
    //   is_agent=data.is_agent
    // }
    // if(data&&data.detailCommentShare&&)
    return (
      <View style={styles.container} >
        {/* View Profile  */}
        <TouchableOpacity style={{
          alignItems: 'flex-start',
          width: 40, height: 40,

        }} onPress={this.onPressAvatarButton} >
          <Image
            style={isShare ? styles.avatarShare : styles.avatarPost}
            source={{ uri: avatar }}>
          </Image>
          {this.props.isAgent == "1" ?
            <Image
              source={Images.logo_flag_header}
              style={isShare ? styles.icon_float_share : styles.icon_float}
            />
            :
            null}

        </TouchableOpacity>
        <View style={styles.txtHeader}>
          {this.renderTitle()}
          <Text style={{
            //flex: 1,
            fontSize: 14,
            color: Colors.light_gray,
          }} >{updated_date}</Text>
        </View>
        {
          !isShare ?
            <TouchableOpacity
              style={{ height: 40, width: 40, }}
              onPress={this.onPressMoreOptionsButton} >
              <Image style={{ height: 40, width: 40, alignSelf: 'center', tintColor: Colors.light_gray }}
                source={Images.post_more_options}
                resizeMode='center'
              />
            </TouchableOpacity>
            : null
        }

      </View>
    )
  }

  renderTitle() {

    const display_name = _.get(this.props, 'data.display_name') || _.get(this.props, 'data.username')
    const location = _.get(this.props, 'data.location')
    const place_name = _.get(this.props, 'data.place_name')
    const title_group = _.get(this.props, 'data.title_group')
    const share = _.get(this.props, 'data.type') === 'share'
    const { isShare } = this.props
    let checkInNewFeeds = ""
    if (location) checkInNewFeeds = location
    else if (place_name) checkInNewFeeds = place_name

    // console.log('display name', this.props);

    return (
      <View style={styles.wrapShare}>
        <View style={styles.containerName}>
          <Text style={isShare ? styles.txtNameShare : styles.txtName}
            onPress={this.onPressNameButton} >{display_name}</Text>
          {
            share && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={isShare ? styles.txtNameShare : styles.txtName_shareda}> {i18next.t('share')} </Text>
                <Text style={{ color: Colors.blue_2, fontSize: 14, }}
                  onPress={this.onPressSharePostButton}> {i18next.t('post')}</Text>
              </View>
            )
          }
          {
            title_group && (
              <View
                style={{
                  flexDirection: "row",
                  marginLeft: 5
                }}
              >

                <Image
                  resizeMode="contain"
                  style={{ width: 10, height: 12, tintColor: Colors.gray, alignSelf: "center" }}
                  source={Images.share_group_}>

                </Image>
                {/* {'\t'} */}
                <TouchableOpacity
                  onPress={this.onPressTitleGroupButton}
                >
                  <Text style={{ paddingHorizontal: 5, fontSize: 14, fontWeight: '500', color: "#1B4F72" }}
                  //sử dụng hàm này có thể đổi tên
                  // onPress={this.saokhongchay}
                  >{title_group}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          }
        </View>
        <View style={styles.place}>
          {checkInNewFeeds != "" ? (
            <Text>
              <Text style={{ fontSize: 13, color: '#272833' }}> {i18next.t('at')} </Text>
              <Text style={{
                fontSize: 13,
                // fontWeight: 'bold',
                color: Colors.blue_2
              }}
                onPress={this.onPressLocation}>{checkInNewFeeds}</Text>
            </Text>
          ) : null
          }
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    // alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    //justifyContent:'center'
    // borderBottomColor: '#DCDCDC',
    // borderBottomWidth:0.3
  },
  image_bar: {
    alignSelf: 'center',
  },
  button_bar: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 2,
    width: 40,
    height: 40,
    // position: 'absolute',
  },
  avatarPost: {
    height: 40,
    width: 40,
    borderRadius: 20,
    position: "relative",
    marginTop: 5
  },
  icon_float_share: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 12,
    height: 12
  },
  icon_float: {
    position: "absolute",
    right: 0,
    bottom: -5,
    width: 14,
    height: 14

  },
  avatarShare: {
    height: 36,
    width: 36,
    borderRadius: 18,
    marginTop: 5
  },
  txtHeader: {
    justifyContent: 'center',
    marginLeft: 10,
    flex: 1,
    marginTop: 5
    //borderWidth: 1
  },
  containerName: {
    lineHeight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    // marginLeft: 5

  },
  // containerName: {
  //   borderWidth:1,
  //   flex:1
  // },
  place: {
    flex: 1
  },
  txtName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0A0A0A',

  },
  txtName_shareda: {
    fontSize: 14,
    color: '#0A0A0A'

  },
  txtNameShare: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0e1217'
  },
  txtCheckin: {

  },
  txtCheinShare: {

  },
  wrapShare: {
    // borderWidth:1,
    overflow: 'hidden',
  }
});
