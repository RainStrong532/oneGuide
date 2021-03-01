import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Colors from '../../constants/colors';
import Device from '../../modules/Device';
import _ from 'lodash';
import FastImage from 'react-native-fast-image'
import Images from '../../assets/images';
import { i18next } from '../../utils'

const screenWidth = Device.screenSize().width

export default class TourItemComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const nextData = _.get(nextProps, 'item')
    const data = _.get(this.props, 'item')
    // const shouldUpdate = (
    //   nextData.code !== data.code
    // )
    return true
  }

  onPressTourItem = (item) => {
    if (this.props.onPressTourItem) {
      this.props.onPressTourItem(item)
    }
  }

  onPressApplyItem = (item) => {

    if (this.props.onPressApplyItem) {
      this.props.onPressApplyItem(item)
    }
  }

  render() {
    const item = _.get(this.props, 'item')
    const avatar = _.get(this.props, 'item.avatar')
    const title = _.get(this.props, 'item.title')
    const photo = _.get(this.props, 'item.photo.photos[0].path')
    const dateTour = _.get(this.props, 'item.date_tour')
    const displayName = _.get(this.props, 'item.display_name')
    const totalApply = _.get(this.props, 'item.total_applys') || 0
    const show_number = _.get(this.props, 'show_number')
    const apply_type = _.get(this.props, 'item.apply.type') || ''
    const {activeTab} = this.props
    
    // apply title
    let applyTitle = i18next.t('Apply')
    let apply_style = { color: Colors.black, textDecorationLine: 'underline' }

    if(activeTab !== 'Applied')
      applyTitle = i18next.t('GuideTitle')


    if (apply_type.toString() === '0') {
      applyTitle = i18next.t('Không tham gia')
      apply_style = { color: Colors.orange_1 }
    } else if (apply_type.toString() === '1') {
      applyTitle = i18next.t('Cancel')
      apply_style = { color: Colors.red }
    } else if (apply_type.toString() === '2') {
      applyTitle = i18next.t('Waiting')
      apply_style = { color: Colors.orange_1 }

    } else if (apply_type.toString() === '3') {
      applyTitle = i18next.t('WaitingToCancel')
      apply_style = { color: Colors.orange_1 }
    } else if (apply_type.toString() === '4') {
      applyTitle = i18next.t('Canceled')
      apply_style = { color: Colors.red }
    } else if (apply_type.toString() === '5') {
      const rating = _.get(this.props, 'item.review.rating') || ''
      const number_star = parseInt(rating) || 0
      let string_star = ''
      for (let index = 0; index < number_star; index++) {
        string_star += '⭐'
      }
      applyTitle = i18next.t('Review') + ': ' + string_star
      apply_style = { color: Colors.orange_1 }
    } else if (apply_type.toString() === '6') {
      applyTitle = i18next.t('Start')
      apply_style = { color: Colors.orange_1 }

    } else if (apply_type.toString() === '7') {
      applyTitle = i18next.t('WaitingToReview')
      apply_style = { color: Colors.orange_1 }
    } else if (apply_type.toString() === '8') {
      applyTitle = i18next.t('Sắp bắt đầu')
      apply_style = { color: Colors.orange_1 }

    } else {

      // const total_applys = _.get(this.props, 'item.total_applys')
      // const user_apply = _.get(this.props, 'item.user_apply')

      // if (user_apply === 'active') {
      //   applyTitle = i18next.t('Cancel')
      //   destructed_tour = true
      // } else {
      //   if (total_applys) {
      //     if (parseInt(total_applys) === 0) {
      //       applyTitle = i18next.t('Apply')
      //     } else {
      //       applyTitle = total_applys + '  ' + i18next.t('Apply')
      //     }
      //   }
      // }

    }


    return (
      <View style={styles.container}>
        <TouchableOpacity
          // style={styles.tittle}
          onPress={() => { this.onPressTourItem(item) }}>
          {/* {
            !photo ||
            <FastImage
              source={{ uri: photo }}
              style={{ width: 80, height: 80, marginLeft: 10 }}
              resizeMode={FastImage.resizeMode.cover}
            />
          } */}
        </TouchableOpacity>
        <View style={styles.subContain}>
          <TouchableOpacity
            onPress={() => { this.onPressTourItem(item) }}>
            <Text
              style={styles.title}
              numberOfLines={2}>
              {title}
            </Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <FastImage
              source={Images.ic_time_schedule}
              style={{ width: 15, height: 15 }}
              resizeMode={FastImage.resizeMode.contain}
            />
            <Text style={styles.time_text}>{dateTour}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            {
              (this.props.isAgent === '1') ?
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { this.onPressTourItem(item) }}>
                  <FastImage
                    source={{ uri: avatar }}
                    style={{ width: 16, height: 16, borderRadius: 8 }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  <Text style={styles.time_text}>{displayName}</Text>
                  <Text style={styles.time_text}>{'|'}</Text>
                </TouchableOpacity>
                : null
            }


            <TouchableOpacity style={{ flexDirection: 'row' }}
              onPress={() => { this.onPressApplyItem(item) }}>
              {/* {
                (totalApply < 0) || show_number === false ||
                <Text style={[styles.time_text, apply_style]}>{totalApply}</Text>
              } */}
              <Text style={[styles.time_text, apply_style]}>
                {
                  (totalApply >= 0 && show_number)
                    ? totalApply + ' ' + applyTitle
                    : applyTitle
                }
              </Text>
            </TouchableOpacity>
          </View>

        </View>
        <View style={styles.borderline}></View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: screenWidth,
    height: 120,
    alignItems: 'center',
    paddingLeft:10
  },
  subContain: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  time_text: {
    marginLeft: 5,
    fontSize: 13,
    fontWeight: '300'
  },
  detail_text: {
    fontSize: 15,
    fontWeight: '500'
  },
  borderline: {
    height: 0.5,
    borderWidth: 0.5,
    borderColor: Colors.light_gray,
    width: screenWidth,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  }
})
