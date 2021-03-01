
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native';
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import Device from '../../modules/Device'
import CommonStyles from '../../constants/styles'
import { i18next } from '../../utils'
import _ from 'lodash';

class ImageTextInputView extends Component {

  static propTypes = {
  }

  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this)
    this.state = {
      content: this.props.value
    }
  }

  onPress = () => {
    if (this.props.onPress) {
      this.props.onPress()
    }
  }
  // onChangeText = (data) => {
  //   if (this.props.onChangeText) {
  //     this.props.onChangeText(data);
  //   }
  // }
  getData = () => {
    return (

      this.state.content
    )
  }

  render() {
    const { image, title, editable, selected } = this.props
    const content = selected === false ? this.state.content : this.props.value
    const textInputPointerEvents = (editable === false) ? 'none' : null

    return (
      <View style={[
        this.props.style
      ]}>
        <TouchableOpacity
          activeOpacity={1}
          style={[
            { flex: 1 },
            styles.image_text_input
          ]}
          onPress={this.onPress}
        >
          <Image
            source={image}
            resizeMode='center'
            style={{
              height: 20,
              width: 20,
              alignSelf: 'center',
              marginHorizontal: 8
            }}
          />
          <TextInput
            editable={editable}
            pointerEvents={textInputPointerEvents}
            placeholder={title}
            value={content}
            onChangeText={(text) => {
              this.setState({
                content: text
              })
              // this.onChangeText(text)
            }}
            style={[{
              flex: 1,
              color: Colors.black_1,
              fontSize: 16,
              marginRight: 8,
            }]} />
        </TouchableOpacity>
        <View style={[{ position: 'absolute', left: 8, right: 8, bottom: 0, height: 0.5, backgroundColor: Colors.gray }]} />
      </View>
    );
  }
}


// ImageTextInputView = React.forwardRef((props, ref) => {
//   return (
//     <CustomImageTextInputView innerRef={ref} {...props} />
//   )
// })

export default class CreateTourView extends Component {

  static propTypes = {
    status: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.getTourName = this.getTourName.bind(this)
    // this.getLocation = this.getLocation.bind(this)
  }

  onPressTime = () => {

    if (this.props.onPressTime) {
      this.props.onPressTime()
    }
  }

  onPressPlace = () => {
    // console.log("data place tour view:", data);
    if (this.props.onPressPlace) {
      this.props.onPressPlace()
    }
  }

  onPressLanguage = () => {

    if (this.props.onPressLanguage) {
      this.props.onPressLanguage()
    }
  }

  onPressExperience = () => {

    if (this.props.onPressExperience) {
      this.props.onPressExperience()
    }
  }

  onPressDeadLine = () => {

    if (this.props.onPressDeadLine) {
      this.props.onPressDeadLine()
    }
  }

  onPressDeadLineTime = () => {

    if (this.props.onPressDeadLineTime) {
      this.props.onPressDeadLineTime()
    }
  }


  getTourName = () => {
    if (this.refs.tourNameInput) {

      return this.refs.tourNameInput.getData()
    }
    // return;
  }

  // getLocation = () => {
  //   if (this.refs.locationInput) {

  //     return this.refs.locationInput.getData()
  //   }
  //   return;
  // }

  render() {
    // console.log('pờ rốp tour view', this.props);
    const tourName = _.get(this.props, 'data.title')
    const dateTour = _.get(this.props, 'data.dateTour')
    const location = _.get(this.props, 'data.location')

    let location_text = null
    if (location) {
      const location_string = location.split('-')
      location_text = location_string.length + ' địa điểm'
    }

    const language = _.get(this.props, 'data.language')
    const experience = _.get(this.props, 'data.experience')
    // const deadline = _.get(this.props, 'data.deadline')
    // const deadlineTime = _.get(this.props, 'data.deadlineTime')
    // const deadlineDate = _.get(this.props, 'data.deadlineDate')
    const deadline = _.get(this.props, 'data.deadline')
    let user_status
    if (this.props && this.props.user_id && this.props.user_id.me && this.props.user_id.me.is_agent) {
      user_status = this.props.user_id.me.is_agent

    }
    return (
      <View style={styles.container}>
        {
          user_status === '2'
            ?
            <ImageTextInputView
              style={styles.imageText}
              title={i18next.t('TourName')}
              value={tourName}
              image={Images.tour_name}
              ref='tourNameInput'
              selected={false} />
            : null
        }
        <ImageTextInputView
          style={styles.imageText}
          title={i18next.t('Time')}
          value={dateTour}
          onPress={this.onPressTime}
          image={Images.tour_calendar}
          editable={false}
        />
        <ImageTextInputView
          style={styles.imageText}
          title={i18next.t('Place')}
          value={location_text}
          onPress={this.onPressPlace}
          image={Images.tour_location}
          // ref='locationInput'
          editable={false}
        // selected={false}
        />
        <ImageTextInputView
          style={styles.imageText}
          title={i18next.t('Language')}
          value={language}
          onPress={this.onPressLanguage}
          image={Images.tour_language}
          editable={false}
        />
        <ImageTextInputView
          style={styles.imageText}
          title={i18next.t('Experience')}
          value={experience}
          onPress={this.onPressExperience}
          image={Images.tour_experience}
          editable={false}
        />
        {
          user_status === '2'
            ?
            <View style={[styles.imageText, { flexDirection: 'row' }]}>
              <ImageTextInputView
                style={[{ flex: 1 }]}
                title={i18next.t('Deadline')}
                value={deadline}
                onPress={this.onPressDeadLine}
                image={Images.ic_time_schedule_max}
                editable={false}
              />
              {/* <ImageTextInputView
                style={[{ flex: 1 }]}
                title={i18next.t('hh/mm')}
                value={deadlineTime}
                onPress={this.onPressDeadLineTime}
                editable={false}
              /> */}
            </View>
            :
            null
        }
        {/* <View style={{
          margin: 5,
        }}>
          <TextInput
            placeholder='Chia sẻ chuyến đi'
            style={{ fontSize: 20 }}
          />
          <TouchableOpacity>
            <Image
              source={Images.image}
              style={{ width: 100, height: 100 }}
            />
          </TouchableOpacity>
        </View> */}
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // marginHorizontal: 10
  },
  image_text_input: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: Colors.black,
    justifyContent: 'center'
  },
  imageText: {
    margin: 2,
    height: 50
  },
});
