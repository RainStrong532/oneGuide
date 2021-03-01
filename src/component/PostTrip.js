import React, { Component } from 'react'
import { View, Text, ScrollView, SafeAreaView, Image, StyleSheet, TextInput, Platform, TouchableOpacity } from 'react-native'
import HeaderView from './views/HeaderView'
import Images from '../assets/images'
import Colors from '../constants/colors'
import CreateTourView from './create-post/CreateTourView'
// import PostCreateComponent from './PostCreateComponent'
import { Navigation } from 'react-native-navigation';
import _ from 'lodash'
import POST_TYPE from '../constants/post-types'
import { i18next, Loading } from '../utils'
import DismissKeyboard from 'dismissKeyboard';
import {
    dimissModal,
    gotoSelectOptionsScreen,
    gotoCheckInScreen,
    pushTourTimeScreen,
    showDate,
    backScreen,
    gotoCameraRollScreen,
    showModalPostCreate
} from '../navigation';
import DateHelper from '../utils/DateHelper'
import Helper from '../utils/Helper';
import PostTourView from './post-views/PostTourView'

const ADD_IMAGE_OBJECT = 'AddImageObject'
const number_photo_in_row = 4

export default class PostTrip extends Component {

    createPhotosFrom = (photos) => {
        let tempPhotos = _.cloneDeep(photos);
        tempPhotos.splice(0, 0, ADD_IMAGE_OBJECT);
        tempPhotos = _.chunk(tempPhotos, number_photo_in_row);
        return tempPhotos
    }

    // chưa thấy dùng ở đâu
    renderTextInput() {

        return (
            <View>
                <TextInput
                    multiline
                    ref={(textInput) => { this.textInput = textInput }}
                    style={[styles.text_input]}
                    autoFocus={this.autoFocus}
                    placeholder={i18next.t('DescribeYourSelf')}
                    selectionColor={Colors.black}
                    value={this.state.content}
                    onChangeText={(text) => this.setState({
                        content: text
                    })}
                    underlineColorAndroid='transparent'
                />

                {/* {this.state.showTour ? null :
              <TouchableOpacity onPress={this.handleCheckIn}>
                <View style={styles.wrrapCheckin}>
                  <Image
                    source={Images.check_in}
                    resizeMode='contain'
                    style={{ width: 20, height: 20 }}
                  />
                  <Text >Check In</Text>
                </View>
              </TouchableOpacity>
            } */}
            </View>

        );
    }



    constructor(props) {
        super(props);

        // bind
        Navigation.events().bindComponent(this);
        // this.onPressDismiss = this.onPressDismiss.bind(this)
        // this.onPressShare = this.onPressShare.bind(this)
        // this.doCreatePost = this.doCreatePost.bind(this)
        // this.doGetPostDetail = this.doGetPostDetail.bind(this)
        // this.renderHeader = this.renderHeader.bind(this)
        // this.onPressAddPhotos = this.onPressAddPhotos.bind(this)

        // init variables
        this.all_photos = []
        const photos = this.createPhotosFrom(this.all_photos)
        this.post_type = props.type
        this.autoFocus = this.post_type === POST_TYPE.TEXT
        const showCameraRoll = this.post_type === POST_TYPE.IMAGE
        const showTour = this.post_type === POST_TYPE.TOUR
        const showCheckin = this.post_type === POST_TYPE.CHECK_IN
        this.editing = this.props.comment_id ? true : false

        this.state = {
            photos,
            showCameraRoll,
            showTour,
            showCheckin,
            enableShare: true,
            content: '',
            tour: { deadlineTime: '09:00' },
            loading: true,
            uri: ''
        }
    }

    componentDidAppear() {

        if (!this.didAppearFirst) {
            this.didAppearFirst = true
            this.doGetPostDetail(this.props.comment_id)
        }

    }

    // hàm lấy thời gian chuyến đi
    onPressTourTime = () => {
        DismissKeyboard()
        const callback = (data) => {
            this.date_selected_range = data

            // tour
            let tour = this.state.tour
            if (data.length === 0) {
                tour.dateTour = ''
            } else {
                let dateSelectedStart = _.get(data, '[0]') || { year: '', month: '', day: '' }
                let dateSelectedEnd = _.get(data, '[1]') || { year: '', month: '', day: '' }

                this.maximumDateDeadline = DateHelper.previousDate(dateSelectedStart)

                const newStart = `${dateSelectedStart.day}/${dateSelectedStart.month + 1}/${dateSelectedStart.year}`
                const newEnd = `${dateSelectedEnd.day}/${dateSelectedEnd.month + 1}/${dateSelectedEnd.year}`
                tour.dateTour = `${newStart}-${newEnd}`
                tour.deadlineDate = ''
                tour.deadline = ''
              

            }

            this.setState({ tour })
        }

        setTimeout(() => {
            const data = { date_selected_range: this.date_selected_range }
            pushTourTimeScreen(this.props.componentId, data, { mitilchoise: true }, callback)
        }, 0);
    }

    // hàm lấy địa điểm
    onPressTourPlace = () => {
        DismissKeyboard()
        const callback = (data) => {

            const descriptions = data.map((item) => { return item.description })
            const location = _.join(descriptions, '-')
            let tour = this.state.tour
            tour.location = location

            this.setState({ tour })
        }

        const location = _.get(this.state, 'tour.location')
        let locations = null
        if (location) {
            locations = location.split('-').map((item) => { return { description: item } })
        }
        setTimeout(() => {
            gotoCheckInScreen(this.props.componentId, callback, { push: true, locations, place: true })
        }, 0);

    }

    // hàm lấy ngôn ngữ
    onPressTourLanguage = () => {
        DismissKeyboard()
        const callback = (data) => {
            const languages = data.map(item => {
                return item.name
            })


            let tour = this.state.tour
            tour.language = languages.join(', ')
            this.setState({ tour })
        }

        const lang_id = []
        setTimeout(() => {
            gotoSelectOptionsScreen(this.props.componentId, 'LANGUAGE', callback, true, lang_id)
        }, 0);

    }

    // hàm lấy kinh nghiệm
    onPressTourExperience = () => {
        DismissKeyboard()
        const callback = (data) => {
            const experiences = data.map(item => {
                return item.value
            })


            let tour = this.state.tour
            tour.experience = experiences.join(',')
            this.setState({ tour })
        }
        setTimeout(() => {
            gotoSelectOptionsScreen(this.props.componentId, 'EXPERIENCE', callback)
        }, 0);


    }

    handleCheckIn = () => {
        //modal search place
        //call dimissModal ->>showModalPostCreate()
        dimissModal(this.props.componentId)
        // console.log("call  here");
        showModalPostCreate(POST_TYPE.CHECK_IN)
    }

    onPressDeadLine = () => {
        DismissKeyboard()
        let tour = this.state.tour
        if (!tour.dateTour) {
            Helper.showAlert('', i18next.t('PleaseSelectTime'),
                [
                    {
                        text: 'OK', onPress: () => {
                        }
                    }
                ]
            )

            return
        }
        const callback = (data) => {
            
            const seletedDate = data[0]

            const day = seletedDate.day
            const month = seletedDate.month
            const year = seletedDate.year

            const deadlineDate = `${day}/${month + 1}/${year}`


            // tour
            let tour = this.state.tour
            tour.deadlineDate = deadlineDate

            const deadlineTime = tour.deadlineTime || ''
            const deadline = `${deadlineDate} ${deadlineTime}`

            tour.deadline = deadline
            this.setState({ tour })
        }
        setTimeout(() => {
            const data = { date_selected_range: null }
            const maximumDateSelected = this.maximumDateDeadline
            pushTourTimeScreen(this.props.componentId, data, { mitilchoise: false, maximumDateSelected }, callback)
        }, 0);

    }

    onPressDeadLineTime = () => {
        DismissKeyboard()

        setTimeout(() => {

            if (Platform.OS === 'ios') {
                const callback = (data) => {

                    const seletedDate = data.seletedDate
                    const minutes = Helper.formatNumberString(seletedDate.getMinutes())
                    const hours = Helper.formatNumberString(seletedDate.getHours())

                    const deadlineTime = `${hours}:${minutes}`

                    let tour = this.state.tour
                    tour.deadlineTime = deadlineTime

                    const deadlineDate = tour.deadlineDate || ''
                    const deadline = `${deadlineDate} ${deadlineTime}`

                    tour.deadline = deadline
                    this.setState({ tour })
                }

                showDate({ mode: 'time' }, callback)
            } else {
                this.showTimeAndroid()
            }
        }, 0);
    }
    showTimeAndroid = async () => {
        try {
            const { action, hour, minute } = await TimePickerAndroid.open({
                // hour: 9,
                // minute: 0,
                is24Hour: false, // Will display '2 PM'
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                const minutes = Helper.formatNumberString(minute)
                const hours = Helper.formatNumberString(hour)

                const deadlineTime = `${hours}:${minutes}`

                let tour = this.state.tour
                tour.deadlineTime = deadlineTime
                const deadlineDate = tour.deadlineDate || ''
                const deadline = `${deadlineDate} ${deadlineTime}`
                tour.deadline = deadline
                this.setState({ tour })
            }

        } catch ({ code, message }) {
        }
    }

    doGetPostDetail = (comment_id) => {

        // request
        this.props.commentDetail(comment_id)
            .then(data => {
                const comment = _.get(data, 'data.data.comments')
                let tour = {}
                tour.title = comment.title
                tour.dateTour = comment.dateTour
                const dateTourStart = String(tour.dateTour).split('-')[0];
                const dateTourEnd = String(tour.dateTour).split('-')[1];
                if (dateTourStart) {
                    const dateStart = DateHelper.convertStringDateToObject(dateTourStart, 'DD/MM/YYYY')
                    const dateEnd = DateHelper.convertStringDateToObject(dateTourEnd, 'DD/MM/YYYY')
                    this.date_selected_range = [dateStart, dateEnd]
                    this.maximumDateDeadline = DateHelper.previousDate(dateStart)
                }

                tour.deadline = comment.deadline
                const date = String(tour.deadline).split(' ');
                if (date) {
                    tour.deadlineDate = date[0]
                    tour.deadlineTime = date[1]
                }

                tour.experience = comment.experience
                tour.language = comment.language
                tour.location = comment.location


                const content = comment.content
                const place_name = comment.place_name
                const place_id = comment.place_id
                const place_shortname = comment.place_shortname
                let location_checkin = null

                if (place_name) {
                    location_checkin = {
                        description: place_name,
                        place_id,
                        place_shortname
                    }
                }

                this.post_type = this.postType(comment.type)
                this.autoFocus = this.post_type === POST_TYPE.TEXT
                const showCameraRoll = this.post_type === POST_TYPE.IMAGE
                const showTour = this.post_type === POST_TYPE.TOUR
                const showCheckin = this.post_type === POST_TYPE.CHECK_IN

                const photo = _.get(comment, 'photo')

                if (photo && photo.length > 0) {
                    photo.forEach((image, i) => {
                        const photosPath = _.get(comment, `path.photos[${i}]`)
                        let new_photo = { ...photosPath, uri: photosPath.path, pathUploaded: photo[i], upload: UploadStatus.upload_success }
                        this.all_photos.push(new_photo)
                    })
                }

                const photos = this.createPhotosFrom(this.all_photos)

                this.setState({
                    photos,
                    showCameraRoll,
                    showTour,
                    showCheckin,
                    enableShare: true,
                    content,
                    place_name,
                    place_id,
                    place_shortname,
                    tour,
                    loading: false,
                    location_checkin
                })

            })
            .catch(error => {
            });
    }

    onPressBack = () => {
        DismissKeyboard()
        backScreen(this.props.componentId)
    }

    onPressAddCheckin = () => {
        DismissKeyboard()
        this.checkin = true

        this.setState({
            showCheckin: true,
        })
    }

    onPressCancelPhotos = () => {
        return
    }

    onPressDonePhotos = (photos) => {
        if (photos.length === 0) {
            return
        }
        this.all_photos = _.cloneDeep(photos);

        let photoUploading = this.all_photos[0]

       

        this.doUploadFile(photoUploading)
    }

    doUploadFile = (photoUploaded) => {
        // upload file
        Loading.showHud()
        this.props.uploadFile(photoUploaded)
            .then(data => {
                Loading.hideHud()
                if (data.path) {
                  
                    this.doUpdateProfile(data.path)
                }
            })
            .catch(error => {
                Loading.hideHud()
                Helper.showErrorAlert('', error)
            });
    }

    doUpdateProfile = (path) => {
        //Call api edit
        // const imageWillUpdate = path
        
    }

    onPressCamera = () => {
        gotoCameraRollScreen(this.onPressCancelPhotos, this.onPressDonePhotos, { getOneImage: true })
    }

    render() {
        // let { time, checkIn, language, exp, deadline } = this.state
        const { showTour, location_checkin, tour } = this.state
        const imageWidth = (Device.screenSize().width - 20) / number_photo_in_row
      
        return (
            <SafeAreaView
                style={{ flex: 1, backgroundColor: Colors.green_1, paddingTop: 50 }}
            >
                <ScrollView
                    style={{ flex: 1, backgroundColor: '#ffffff' }}
                >
                    <View>
                        <HeaderView
                            title='Tạo bài viết'
                            back={true}
                            tintColor={Colors.green_1}
                            // onPressRightBarButton={this.onPressDone}
                            onPressLeftBarButton={this.onPressBack}
                        />

                        <View>
                            {/* {
                                showTour && */}
                            <CreateTourView
                                ref={ref => this.tourCreate = ref}
                                data={tour}
                                isAgent={this.props.user.me.is_agent}
                                onPressTime={this.onPressTourTime}
                                onPressLanguage={this.onPressTourLanguage}
                                onPressExperience={this.onPressTourExperience}
                                onPressPlace={this.onPressTourPlace}
                                onPressDeadLine={this.onPressDeadLine}
                                onPressDeadLineTime={this.onPressDeadLineTime}
                                renderItem={this.renderItem}
                            />
                            {this.renderTextInput()}
                            {
                                (location_checkin) &&
                                (
                                    <TouchableOpacity
                                        style={[{
                                            height: 30,
                                            marginVertical: 5,
                                            marginHorizontal: 10,
                                            // backgroundColor: Colors.gray,
                                            justifyContent: 'center',
                                        }]}
                                        onPress={this.onPressAddCheckin}
                                    >
                                        <Text
                                            style={{
                                                color: Colors.green_1
                                            }}
                                        >{i18next.t('at')} {location_checkin.place_name}</Text>
                                    </TouchableOpacity>
                                )
                            }
                            <TouchableOpacity
                                onPress={this.onPressCamera}
                            >
                                <Image
                                    source={Images.image}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    view_row: {
        flexDirection: "row",
        margin: 10,
        borderBottomColor: Colors.gray_1,
        borderBottomWidth: 2
    },
    title: {
        color: Colors.gray_1,
        fontSize: 20,
        // margin: 10,
    },
    image_icon: {
        alignSelf: 'center'
    }
})