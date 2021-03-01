import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Image, Button, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, FlatList, ActivityIndicator } from 'react-native';
import { Navigation } from 'react-native-navigation';
import {
  gotoCameraRollScreen,
  backScreen,
  showRegisterSelectCard
} from '../navigation';
import Images from '../assets/images'
import POST_TYPE from '../constants/post-types'
import Device from '../modules/Device'
import Colors from '../constants/colors'
import { i18next, Loading } from '../utils'
import DatePicker from 'react-native-datepicker';
import { Dropdown } from 'react-native-material-dropdown';
import CameraRollComponent from './CameraRollComponent'
import DismissKeyboard from 'dismissKeyboard';
import CommonStyles from '../constants/styles';
import _ from 'lodash'

import Helper from '../utils/Helper';
import HeaderView from './views/HeaderView';
import DateHelper from '../utils/DateHelper';
import images from '../assets/images';

const ADD_IMAGE_OBJECT = 'AddImageObject'
const number_photo_in_row = 4
const successMessage = 'Đã gửi ảnh xác thực'
const UploadStatus = {
  none: 'none',
  uploading: 'uploading',
  upload_success: 'upload_success',
  upload_fail: 'upload_fail',
}

const TYPE = {
  AGENT: '2',
  GUIDE: '1'
}
export default class AccountVerificationComponent extends Component {

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
    this.all_photos = []
    const photos = this.createPhotosFrom(this.all_photos)
    const showCameraRoll = false
    this.state = {
      type: '',
      photos,
      showCameraRoll,
      enableShare: true,
      isValid: false
    }
  }

  componentDidMount() {

  }

  componentDidAppear() {
    if (!this.didAppearFirst) {
      this.didAppearFirst = true
    }
  }

  componentDidDisappear() {

  }

  onPressCancelPhotos = () => {
    return
  }
  createPhotosFrom = (photos) => {
    let tempPhotos = _.cloneDeep(photos);
    tempPhotos.splice(0, 0, ADD_IMAGE_OBJECT);
    tempPhotos = _.chunk(tempPhotos, number_photo_in_row);
    return tempPhotos
  }

  backScreen = () => {
    backScreen(this.props.componentId)
  }
  onPressBack = () => {
    Helper.showAlert('', i18next.t('AreYouSure'),
      [
        { text: i18next.t('No'), onPress: null },
        { text: i18next.t('Yes'), onPress: this.backScreen }
      ])
  }

  getHeaderView = () => {
    return (
      <HeaderView
        title={i18next.t('AccountVerification')}
        tintColor={Colors.white}
        style={{ backgroundColor: Colors.green_1 }}
        back={true}
        onPressLeftBarButton={this.onPressBack}
      />
    )
  }

  onPressDonePhotos = async (photos) => {

    this.addPhoto = false
    let number_photos = (this.all_photos.length || 0) + (photos.length || 0)

    if (number_photos > 10) {
      const message_alert = i18next.t('PleaseSelectMax10Photo')
      Helper.showAlert('', message_alert,
        [
          {
            text: 'OK', onPress: () => {
              this.setState({
                showCameraRoll: false,
                isValid: false
              })
            }
          }
        ]
      )

      return
    }


    photos.forEach(new_photo => {
      new_photo = { ...new_photo, upload: UploadStatus.none }
      this.all_photos.push(new_photo)

      setTimeout(() => {
        // upload photo
        this.doUploadPhoto(new_photo)
      }, 1000);
    })

    this.all_photos = _.uniqBy(this.all_photos, 'uri')
    photos = this.createPhotosFrom(this.all_photos)

    this.setState({
      showCameraRoll: false,
      photos,
    })
  }

  doUploadPhoto = (photoUploaded) => {
    if (!photoUploaded) {
      return
    }

    const index = _.findIndex(this.all_photos, { uri: photoUploaded.uri });
    photoUploaded = { ...photoUploaded, upload: UploadStatus.uploading }
    this.all_photos.splice(index, 1, photoUploaded);
    const photos = this.createPhotosFrom(this.all_photos)
    this.setState({
      photos,
      enableShare: false,
      isValid: false
    })

    // upload file
    this.props.uploadFile(photoUploaded)
      .then(data => {
        if (data.path) {
          const index = _.findIndex(this.all_photos, { uri: photoUploaded.uri });
          photoUploaded = { ...photoUploaded, upload: UploadStatus.upload_success, pathUploaded: data.path }
          this.all_photos.splice(index, 1, photoUploaded);

          const photos = this.createPhotosFrom(this.all_photos)

          this.setState({
            photos,
            enableShare: true,
            isValid: true
          })
        }
      })
      .catch(error => {
        const index = _.findIndex(this.all_photos, { uri: photoUploaded.uri });
        //  upload fail
        photoUploaded = { ...photoUploaded, upload: UploadStatus.upload_fail }
        this.all_photos.splice(index, 1, photoUploaded);
        const photos = this.createPhotosFrom(this.all_photos)

        this.setState({
          photos,
          enableShare: true,
          isValid: true
        })

      });
  }

  onPressRemovePhoto = (photo) => {
    const index = _.findIndex(this.all_photos, { uri: photo.uri });
    this.all_photos.splice(index, 1);
    const photos = this.createPhotosFrom(this.all_photos)

    this.setState({
      photos,
    })
  }

  renderItem = ({ index, item }) => {

    const imageWidth = (Device.screenSize().width - 20) / number_photo_in_row

    return (
      <View style={{ marginHorizontal: 10, height: imageWidth, backgroundColor: Colors.light_gray_3, flexDirection: 'row' }} >
        {
          item.map((data) => {

            if (data === ADD_IMAGE_OBJECT) {
              return (
                <View
                  key={ADD_IMAGE_OBJECT}
                  style={[
                    {
                      height: imageWidth,
                      width: imageWidth,
                      justifyContent: 'center',
                    }
                  ]}>
                  <TouchableOpacity
                    style={[
                      styles.photo,
                      {
                        flex: 1,
                        justifyContent: 'center',
                        borderWidth: 2,
                        borderColor: Colors.light_gray,
                      }
                    ]}
                    onPress={this.onPressAddPhotos}>
                    <Image
                      source={Images.image}
                      style={{ width: 20, height: 20, alignSelf: 'center' }}
                      resizeMode='contain'
                    />
                  </TouchableOpacity>
                </View>
              )
            }

            return (
              <View
                key={data.uri}
                style={[
                  {
                    height: imageWidth,
                    width: imageWidth,
                    justifyContent: 'center',
                  }
                ]}>
                <Image
                  style={[styles.photo, { flex: 1 }]}
                  source={{ uri: data.uri }}
                  resizeMode='cover'
                />
                {
                  (data.upload === UploadStatus.none ||
                    data.upload === UploadStatus.upload_success) && (
                    <TouchableOpacity
                      style={[styles.button_remove_photo]}
                      onPress={() => { this.onPressRemovePhoto(data) }}
                    >
                      <Image style={{ height: 18, width: 18, alignSelf: 'center', tintColor: Colors.white }}
                        source={Images.close}
                        resizeMode='cover' />
                    </TouchableOpacity>
                  )
                }
                {
                  (data.upload === UploadStatus.uploading) &&
                  <View style={[
                    styles.photo,
                    CommonStyles.position_absolute_full,
                    CommonStyles.center,
                    { backgroundColor: Colors.transparent, }
                  ]}>
                    <View style={[
                      CommonStyles.position_absolute_full,
                      { flex: 1, backgroundColor: Colors.black, opacity: 0.8 }
                    ]}></View>
                    <ActivityIndicator style={{ alignSelf: 'center' }} size='small' color={Colors.white} />
                  </View>
                }
                {
                  (data.upload === UploadStatus.upload_fail) &&
                  <View style={[styles.photo, CommonStyles.position_absolute_full,
                  { backgroundColor: Colors.red, opacity: 0.7 }]}>
                  </View>
                }
              </View>
            )
          })
        }
      </View>
    )
  }

  submitVerify = () => {

    const data = this.getParams();
    let message = this.validateParams(data);
    if (message) {
      Helper.showAlert('', message,
        [
          {
            text: 'OK', onPress: () => { }
          }
        ]
      )
      return
    }
    //convert data
    let convertData = {}
    if (this.props.user.me.is_agent === TYPE.GUIDE) {
      convertData = {
        year: data.year.toString(),
        month: (data.month + 1).toString(),
        day: data.day.toString(),
        id: data.id,
        type: data.type,
        name: data.name
      }
    } else {
      let images = {}
      let index = 0
      this.all_photos.forEach(photo => {
        if (photo.pathUploaded) {
          images = { ...images, [index]: photo.pathUploaded }
          index += 1
        }
      })
      convertData.images = images;
      convertData['user_id'] = this.props.user.me.user_id;
      convertData['type_account'] = "agent";
    }
    Loading.showHud();
    this.props.verify(convertData)
      .then(res => {
        Loading.hideHud()
        let message = res.data.message;
        if (!message) {
          message = res.data.messages
        }
        if (message.toLowerCase() === successMessage.toLowerCase()) {
          Helper.showAlert('', this.props.user.me.is_agent === TYPE.AGENT ? i18next.t('WaitVerify') : i18next.t('VerificationSuccess'),
            [
              {
                text: 'OK', onPress: () => { this.backScreen(); this.props.data.getMyInfo() }
              }
            ]
          )
        } else if (message == 'Xác thực thành công') {
          Helper.showAlert('', i18next.t('VerificationSuccess'),
            [
              {
                text: 'OK', onPress: () => { this.backScreen(); this.props.data.getMyInfo() }
              }
            ]
          )
        }
        else {
          Helper.showAlert('', i18next.t(message),
            [
              {
                text: 'OK', onPress: null
              }
            ]
          )
        }
      })
      .catch(error => {
        Loading.hideHud()
        Helper.showErrorAlert('', error)
      });
  }

  getParams = () => {
    let data = {};
    if (this.props.user.me.is_agent === TYPE.GUIDE) {
      const date = DateHelper.convertStringDateToObject(this.state.endDate);
      data.name = this.state.fullname;
      data.id = this.state.codeGuide;
      data.year = date.year;
      data.month = date.month;
      data.day = date.day;
      data.type = this.state.type;

    } else if (this.props.user.me.is_agent === TYPE.AGENT) {
      data.images = this.state.photos
    }
    return data
  }

  validateParams = (data) => {
    if (!data) {
      data = this.getParams();
      console.log("data guide xac thuc", data);
    }
    let message = null;
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (!data[key] || !data[key] || data[key] === '' || data[key].length === 0) {
          this.setState({ isValid: false });
          return;
        }
      }
      this.setState({ isValid: true });
    }
    return message;
  }
  onPressAddPhotos = () => {
    DismissKeyboard()
    this.addPhoto = true
    if (this.all_photos.length >= 10) {
      return
    }

    this.setState({
      showCameraRoll: true
    })
  }
  renderFieldsAgent = (renderItem, keyExtractor) => {
    const { photos } = this.state;
    return (
      <View>
        <View>
          <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <Image
              source={Images.logo_oneguide}
              style={{ tintColor: Colors.green_1 }}
            />
          </View>
          <Text style={{ padding: 15, textAlign: 'justify', fontSize: 18 }}>
            {i18next.t('NeedToUploadImage')}
          </Text>
        </View>
        <FlatList
          removeClippedSubviews={false}
          data={photos}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{ backgroundColor: 'transparent' }}
        />
      </View>
    )
  }
  onPressCancelPhotos = () => {
    if (this.addPhoto !== true) {
      this.addPhoto = false
      this.onPressDismiss()
      return
    }

    this.setState({
      showCameraRoll: false,
    })
  }

  onSelectTypeCard = () => {
    const callback = (index, item) => {
      this.setState({ type: item },
        this.validateParams
      )
    }
    const data = [i18next.t('Quốc Tế'), i18next.t('Nội Địa')]
    showRegisterSelectCard('', data, callback)
  }

  keyExtractor = (item, index) => index.toString();

  renderFieldsGuide = () => {
    const dateData = [
      {
        value: i18next.t('International'),
        key: 1
      },
      {
        key: 2,
        value: i18next.t('InCountry')
      }
    ]
    return (
      <View style={{ marginBottom: 50 }}>
        <View style={{
          //  marginVertical: 30, 
          //  alignItems: 'center', 
          //  justifyContent: 'center',
          //   paddingLeft: 15,
          color: 'black',
          padding: 10,
          justifyContent: "center",
          alignItems: 'center',
          marginBottom: 70
        }}>
          <Text style={{ fontSize: 16, fontWeight: '400', textAlign: 'center' }}>{i18next.t('PleaseVerifyYourAccountInformation')}</Text>
        </View>
        <View style={styles.view}>


          <TextInput
            style={{ fontSize: 16 }}
            placeholder={i18next.t('FullName')}
            onChangeText={(fullname) => {
              this.setState({ fullname: fullname },
                this.validateParams
              )
            }}
          />
        </View>



        <View style={styles.view}>
          {/* <Image
            source={images.id_card}
            resizeMode='contain'
            style={{
              width: 20, height: 20,
              tintColor: 'rgb(0, 172, 193)'
            }}
          /> */}

          <TextInput

            style={{ flex: 1, fontSize: 15, color: "black", fontWeight: "400", paddingLeft: 8.5, paddingRight: 8 }}
            placeholder={i18next.t('EnterCardId')}
            // placeholderTextColor="#444445"
            placeholderTextColor='#929495'
            onChangeText={(codeGuide) => {
              this.setState({ codeGuide: codeGuide },
                this.validateParams
              )
            }}
          />
        </View>

        <View style={styles.view}>
          {/* <Image
            source={Images.tour_calendar}
            style={{
              transform: [{
                translateY: 5
              }],
              tintColor: 'rgb(0, 172, 193)'
            }}>
          </Image> */}

          <DatePicker
            // customStyles={{

            // }}
            showIcon={false}
            style={{
              // fontSize: 15,
              width: 120, height: 50,

            }}
            placeholderTextColor="#444445"
            mode="date"
            date={this.state.endDate}
            placeholder={i18next.t('ExpiryDate')}
            format="DD-MM-YYYY"
            minDate="01-01-2005"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateInput: {
                padding: 0,
                borderWidth: 0,
                transform: [{
                  translateX: -15
                }]
              },
              placeholderText: {
                color: '#929495',
                fontSize: 15,
                paddingLeft: 10,
                paddingTop: 5

              },
              dateText: {
                fontSize: 15,
                paddingTop: 5,
                fontWeight: "400",
              }

            }}
            onDateChange={(date) => {
              this.setState({ endDate: date },
                this.validateParams)
            }}
          />
        </View>

        <TouchableOpacity
          style={styles.view}
          onPress={this.onSelectTypeCard}
        >
          <Text
            style={{
              paddingHorizontal: 10,
              paddingVertical: 15,
              color: this.state.type ? Colors.black : '#929495',
              fontSize: 15,
              fontWeight: "400",
            }}
          >
            {this.state.type ? this.state.type : 'Chọn Loại thẻ'}
          </Text>
          {/* <Dropdown
            labelTextStyle={{
              color: '#929495',
              fontSize: 15,
              // paddingLeft: 10,

            }}
            inputContainerStyle={{ borderBottomColor: 'transparent', height: 50, marginBottom: 10, top: -10, color: 'black' }}
            // itemTextStyle={{ textAlign: 'center', fontFamily: 'IRANSansMobile', height: 20, backgroundColor: "blue" }}
            label={i18next.t('CardType')}
            value={this.state.type}
            data={dateData}
            containerStyle={{ flex: 1, height: 50, }}
            onChangeText={(text) => {
              this.setState({ type: text },
                this.validateParams)
            }}
            style={{
              paddingLeft: 10,
              fontWeight: "400",
              fontSize: 15,
              color: "blue"
            }}
          /> */}
          {/* <Dropdown
            dropdownOffset={{ top: 5 }}
            containerStyle={{
              borderWidth: 1, borderColor: '#87CAEE', borderRadius: 15, width:
                "100%"
              , paddingLeft:
                10
            }}
            rippleCentered={true}
            inputContainerStyle={{ borderBottomColor: 'transparent' }}
            label={i18next.t('CardType')}
            value={this.state.type}
            data={dateData}
            // valueExtractor={({value})=> value}
            onChangeText={(text) => {
              this.setState({ type: text },
                this.validateParams)
            }}
          /> */}
        </TouchableOpacity>
      </View>
    )
  }
  render() {
    const { showCameraRoll } = this.state;
    const { is_agent } = this.props.user.me
    return (
      <View style={[styles.container]}>
        <View style={{ flex: 1, }}>
          {this.getHeaderView()}
          <ScrollView style={{ flex: 1 }}>

            <View>
              <View style={{ marginTop: 50, marginLeft: 15, marginRight: 15 }}>
                {
                  (is_agent === TYPE.AGENT)
                    ?
                    this.renderFieldsAgent(this.renderItem, this.keyExtractor)
                    :
                    this.renderFieldsGuide()
                }
              </View>
            </View>
            <View style={styles.button}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  disabled={!this.state.isValid}
                  onPress={this.submitVerify}
                  style={this.state.isValid ? styles.verify_button : styles.verify_button_hidle}
                >
                  <Text style={this.state.isValid ? styles.verify_text_hidle : styles.verify_text}>
                    {i18next.t('verify')}
                  </Text>
                </TouchableOpacity>

                {/* <Button

                style={styles.button_ac}
                title={i18next.t('verify')} tintColor='primary'
                disabled={!this.state.isValid}
                onPress={this.submitVerify}
              ></Button> */}

              </View>
            </View>
            {
              showCameraRoll
              && <CameraRollComponent
                style={[CommonStyles.position_absolute_full, { flex: 1 }]}
                onPressCancel={this.onPressCancelPhotos}
                onPressDone={this.onPressDonePhotos} />
            }
          </ScrollView>
        </View>
      </View>
    );
  }

}
const styles = StyleSheet.create({
  verify_text: {
    fontSize: 15,
    fontWeight: "600",
    padding: 10,
    textTransform: 'uppercase',
    color: '#6A6B6C',


  },

  verify_text_hidle: {
    fontSize: 15,
    fontWeight: "600",
    padding: 10,
    textTransform: 'uppercase',
    color: 'white',


  },
  verify_button: {
    paddingLeft: 100,
    paddingRight: 100,
    height: 40,
    backgroundColor: Colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
  },
  verify_button_hidle: {
    paddingLeft: 100,
    paddingRight: 100,
    height: 40,
    backgroundColor: Colors.gray_3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
  },
  button_ac: {
    width: 500,
    height: 100
  },
  txtInput: {
    borderColor: 'red',
    borderWidth: 1
  },
  button_remove_photo: {
    position: 'absolute',
    top: 6,
    right: 5,
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  photo: {
    margin: 5
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    //backgroundColor: Colors.light_gray_3,
    // paddingBottom: 20

  },
  distanceItem: {
    marginTop: 1
  },
  profile: {
    backgroundColor: Colors.white,
    marginTop: 8,
    flexDirection: 'column'
  },
  view: {
    marginTop: 15,
    width: '90%',
    // padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'center',
    // marginHorizontal: 15,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: Colors.green_1,
    borderRadius: 10,


  },
  viewDropdown: {
    marginTop: 5,
    width: '90%',
    // padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // marginHorizontal: 15,
    alignSelf: 'center',
    // borderWidth: 1,
    // borderColor: "#87CAEE",
    // borderRadius: 15,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    // margin: 30,
    // marginTop: 30,

  }
})
