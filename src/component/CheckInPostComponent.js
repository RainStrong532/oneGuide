import React, { Component } from 'react';
import {
    StyleSheet,
    View, Text,
    Platform,
    Image,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    TimePickerAndroid
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import {
    dimissModal,
    gotoSelectOptionsScreen,
    gotoCheckInScreen,
    pushTourTimeScreen,
    showDate
} from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import POST_TYPE from '../constants/post-types'
import Device from '../modules/Device'
import { i18next, Loading } from '../utils'
import DismissKeyboard from 'dismissKeyboard';
import CreateTourView from './create-post/CreateTourView'
import CommonStyles from '../constants/styles'
import CameraRollComponent from './CameraRollComponent'
import CheckInComponent from './CheckInComponent'
import StringUtils from '../utils/StringUtils'
import Helper from '../utils/Helper';
import DateHelper from '../utils/DateHelper'

import _ from 'lodash'
import ImageTextInputView from '../component/create-post/CreateTourView'
import { showModalCancelPost, showModalPostCreate } from '../navigation'

const ADD_IMAGE_OBJECT = 'AddImageObject'
const number_photo_in_row = 4

const UploadStatus = {
    none: 'none',
    uploading: 'uploading',
    upload_success: 'upload_success',
    upload_fail: 'upload_fail',
}


export default class CheckInPostComponent extends Component {

    static options(passProps) {
        return {
            statusBar: {
                backgroundColor: 'transparent',
                visible: true,
                style: 'dark'
            },
            topBar: {
                drawBehind: true,
                visible: false,
            },
        };
    }

    constructor(props) {
        super(props);

        // bind
        Navigation.events().bindComponent(this);
        this.onPressDismiss = this.onPressDismiss.bind(this)
        this.onPressShare = this.onPressShare.bind(this)
        this.doCreatePost = this.doCreatePost.bind(this)
        this.doGetPostDetail = this.doGetPostDetail.bind(this)
        this.renderHeader = this.renderHeader.bind(this)
        this.onPressAddPhotos = this.onPressAddPhotos.bind(this)

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
            location: ''
        }
    }

    componentDidMount() {

    }

    componentDidAppear() {

        if (!this.didAppearFirst) {
            this.didAppearFirst = true
            this.doGetPostDetail(this.props.comment_id)
        }

    }

    componentDidDisappear() {

    }

    typeComment = () => {

        switch (this.post_type) {
            case POST_TYPE.TEXT:
            case POST_TYPE.CHECK_IN:
            case POST_TYPE.IMAGE:
                return 'text'
            case POST_TYPE.TOUR:
                return 'tour'
            default:
                return 'text'
        }
    }

    postType = (type) => {

        switch (type) {
            case 'text':
                return POST_TYPE.TEXT
            case 'tour':
                return POST_TYPE.TOUR
            default:
                return POST_TYPE.TEXT
        }
    }

    doCreatePost = (data) => {

        let convertData = {
            ...data,
            // deadline: dt
        }
        // console.log("1234567890", convertData);
        Loading.showHud()
        // request
        this.props.createPostCheckIn(convertData)
            .then(data => {
                Loading.hideHud()
                dimissModal(this.props.componentId)
            })
            .catch(error => {

                Loading.hideHud()
                this.setState({ enableShare: true })
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

    doEditPost = (data) => {

        Loading.showHud()
        // request
        this.props.editPost(data)
            .then(data => {
                //  console.log("data result request", data);
                Loading.hideHud()
                dimissModal(this.props.componentId)
            })
            .catch(error => {
                Loading.hideHud()
                this.setState({ enableShare: true })
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

    doGetPostDetail = (comment_id) => {


        //     // request
        //     this.props.commentDetail(comment_id)
        //         .then(data => {
        //             const comment = _.get(data, 'data.data.comments')
        //             let tour = {}
        //             tour.title = comment.title
        //             tour.dateTour = comment.dateTour
        //             const dateTourStart = String(tour.dateTour).split('-')[0];
        //             const dateTourEnd = String(tour.dateTour).split('-')[1];
        //             if (dateTourStart) {
        //                 const dateStart = DateHelper.convertStringDateToObject(dateTourStart, 'DD/MM/YYYY')
        //                 const dateEnd = DateHelper.convertStringDateToObject(dateTourEnd, 'DD/MM/YYYY')
        //                 this.date_selected_range = [dateStart, dateEnd]
        //                 this.maximumDateDeadline = DateHelper.previousDate(dateStart)
        //             }

        //             tour.deadline = comment.deadline
        //             const date = String(tour.deadline).split(' ');
        //             if (date) {
        //                 tour.deadlineDate = date[0]
        //                 tour.deadlineTime = date[1]
        //             }

        //             tour.experience = comment.experience
        //             tour.language = comment.language
        //             tour.location = comment.location


        //             const content = comment.content
        //             const place_name = comment.place_name
        //             const place_id = comment.place_id
        //             const place_shortname = comment.place_shortname
        //             let location_checkin = null

        //             if (place_name) {
        //                 location_checkin = {
        //                     description: place_name,
        //                     place_id,
        //                     place_shortname
        //                 }
        //             }

        //             this.post_type = this.postType(comment.type)
        //             this.autoFocus = this.post_type === POST_TYPE.TEXT
        //             const showCameraRoll = this.post_type === POST_TYPE.IMAGE
        //             const showTour = this.post_type === POST_TYPE.TOUR
        //             const showCheckin = this.post_type === POST_TYPE.CHECK_IN

        //             const photo = _.get(comment, 'photo')

        //             if (photo && photo.length > 0) {
        //                 photo.forEach((image, i) => {
        //                     const photosPath = _.get(comment, `path.photos[${i}]`)
        //                     let new_photo = { ...photosPath, uri: photosPath.path, pathUploaded: photo[i], upload: UploadStatus.upload_success }
        //                     this.all_photos.push(new_photo)
        //                 })
        //             }

        //             const photos = this.createPhotosFrom(this.all_photos)

        //             this.setState({
        //                 photos,
        //                 showCameraRoll,
        //                 showTour,
        //                 showCheckin,
        //                 enableShare: true,
        //                 content,
        //                 place_name,
        //                 place_id,
        //                 place_shortname,
        //                 tour,
        //                 loading: false,
        //                 location_checkin,
        //                 location
        //             })

        //         })
        //         .catch(error => {
        //         });
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
            enableShare: false
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
                        enableShare: true
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
                    enableShare: true
                })

            });
    }


    createPhotosFrom = (photos) => {

        let tempPhotos = _.cloneDeep(photos);
        tempPhotos.splice(0, 0, ADD_IMAGE_OBJECT);
        tempPhotos = _.chunk(tempPhotos, number_photo_in_row);
        return tempPhotos
    }

    generateParam = () => {

        const comment_id = _.get(this.props, 'comment_id')

        const content = StringUtils.formatNewline(this.state.content) || ''
        const location = StringUtils.formatNewline(this.state.location) || ''
        const content_url = _.get(this.props, 'user.me.url_user')
        const parent_id = '0'
        const comment_share_id = '0'
        const place_name = _.get(this.state, 'location_checkin.place_name')
        const place_id = _.get(this.state, 'location_checkin.place_id')
        const place_shortname = _.get(this.state, 'location_checkin.place_shortname')

        let tour = this.state.tour
        if (this.tourCreate &&
            this.tourCreate.getTourName) {
            tour.title = this.tourCreate.getTourName()
        }

        // validate
        let photos = {}
        let index = 0
        let all = [this.all_photos[this.all_photos.length - 1]];
        if (all) {
            all.forEach(photo => {
                if (photo && photo.pathUploaded) {
                    photos = { ...photos, [index]: photo.pathUploaded }
                    index += 1
                }
            })
        }

        // data
        let dataBody = {
            comment_id,
            content_url,
            parent_id,
            comment_share_id,
            content,
            location,
            ...tour,
            place_name,
            place_shortname,
            place_id,
            typecomment: this.typeComment(),
            photos
        }



        return dataBody
    }

    validateParam = (params) => {

        let messages = null
        const typecomment = params.typecomment
        if (typecomment === 'tour') {
            if (!params.content) {
                return i18next.t('ContentNotValid')
            }

            if (!params.title) {
                return i18next.t('TitleNotValid')
            }

            if (!params.dateTour) {
                return i18next.t('TimeNotValid')
            }

            if (!params.location) {
                return i18next.t('LocationNotValid')
            }

            if (!params.language) {
                return i18next.t('LanguageNotValid')
            }

            if (!params.experience) {
                return i18next.t('ExperienceNotValid')
            }

            if (!params.deadline) {
                return i18next.t('DeadlineNotValid')
            }

        }

        return messages
    }

    onPressShare = () => {
        DismissKeyboard()
        const dataBody = this.generateParam()
        const messages = this.validateParam(dataBody)
        if (messages) {
            Helper.showAlert('', messages,
                [
                    {
                        text: 'OK', onPress: () => {
                        }
                    }
                ]
            )

            return
        }

        this.setState({
            enableShare: false
        })

        // create post

        // else if (dataBody.location != "") {
        //     this.doCreatePost(dataBody)
        // }
        // else if(dataBody.content!=""){

        // }
        // else {
        //     Helper.showAlert(i18next.t('FillPosition')

        //     )
        //     this.setState({
        //         enableShare: true
        //     })
        // }
        /////
        // create post
        if (this.props.comment_id) {
            this.doEditPost(dataBody)
        }
        else if (dataBody.content === "") {
            Helper.showAlert(i18next.t('FillContent'))
            this.setState({
                enableShare: true
            })
        }
        else if (dataBody.location === "") {
            Helper.showAlert(i18next.t('FillPosition'))
            this.setState({
                enableShare: true
            })
        }
        else {
            this.doCreatePost(dataBody)
        }
    }

    onPressDismiss = () => {

        //call ModalCancel
        //showModalCancelPost()

        DismissKeyboard()
        //  dimissModal(this.props.componentId)

        const callback = (type) => {
            if (type === 'Save_temp') {
                // console.log("adadfad");
                // DismissKeyboard()
                dimissModal(this.props.componentId)
            }
            if (type === 'Cancel_save') {
                // DismissKeyboard()
                dimissModal(this.props.componentId)
            }
        }
        showModalCancelPost(callback)
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
            }, 0);
        })

        this.all_photos = _.uniqBy(this.all_photos, 'uri')
        photos = this.createPhotosFrom(this.all_photos)

        this.setState({
            showCameraRoll: false,
            photos
        })

    }
    /// thêm ảnh của checkIn
    onPressAddPhotos = () => {

        DismissKeyboard()
        this.addPhoto = true
        if (this.all_photos.length >= 10) {
            return
        }
        // if(this.state)
        this.setState({
            showCameraRoll: true
        })
    }

    onPressRemovePhoto = (photo) => {

        const index = _.findIndex(this.all_photos, { uri: photo.uri });
        this.all_photos.splice(index, 1);
        const photos = this.createPhotosFrom(this.all_photos)

        this.setState({
            photos,
        })
    }

    onPressCancelCheckin = () => {

        if (this.checkin !== true) {
            this.checkin = false
            this.onPressDismiss()
            return
        }

        this.setState({
            showCheckin: false,
        })
    }

    onPressDoneCheckin = (location) => {

        this.checkin = false

        this.setState({
            showCheckin: false,
            location_checkin: location[0]
        })
    }

    onPressAddCheckin = () => {

        DismissKeyboard()
        this.checkin = true

        this.setState({
            showCheckin: true,

        })
    }

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

    render() {

        const { showCameraRoll, showCheckin, loading } = this.state
        let options = {
            getOneImage: true
        }
        return (
            <View style={[styles.container]} >

                {this.renderTopBar()}
                {
                    (this.editing === true && loading === true) ?
                        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                            <ActivityIndicator animating size="small" color={Colors.black} />
                        </View> : this.renderContent()}
                {
                    showCameraRoll
                    && <CameraRollComponent
                        style={[CommonStyles.position_absolute_full]}
                        onPressCancel={this.onPressCancelPhotos}
                        onPressDone={this.onPressDonePhotos}
                        options={options}

                    />
                }

                {
                    showCheckin
                    && <CheckInComponent
                        style={[CommonStyles.position_absolute_full]}
                        onPressCancel={this.onPressCancelCheckin}
                        onPressDone={this.onPressDoneCheckin}
                        multichoise={false} />
                }

            </View>
        );
    }

    renderTopBar() {

        const statusBarHeight = Device.statusBarSize().height
        const topBarHeight = Device.topBarSize().height
        const { enableShare } = this.state
        const opacityShare = (enableShare === true) ? 1 : 0.2
        const title = this.editing === true ? i18next.t('EditPost') : i18next.t('CreatePost')
        return (
            <View style={[{ backgroundColor: Colors.white, }, { height: statusBarHeight + topBarHeight }]}>

                <View style={[{ height: topBarHeight, marginTop: statusBarHeight }]} >
                    <TouchableOpacity style={[styles.button_bar, { left: 12, }]} onPress={this.onPressDismiss} >
                        <Text style={[CommonStyles.text_nav_bar, { alignSelf: 'flex-start', }]}>{i18next.t('Cancel')}</Text>
                    </TouchableOpacity>

                    <View pointerEvents='none' style={{ flex: 1, position: 'absolute', justifyContent: 'center', left: 48, right: 48, height: topBarHeight, top: 0, paddingBottom: 4 }}>
                        <Text style={[CommonStyles.title_nav_bar, { alignSelf: 'center', }]}>{title}</Text>
                    </View>
                    {/* chia sẻ checkIn  */}
                    <TouchableOpacity
                        disabled={!enableShare}
                        style={[styles.button_bar, { right: 12, opacity: opacityShare }]}
                        onPress={this.onPressShare}>
                        <Text style={[CommonStyles.text_nav_bar, { alignSelf: 'flex-end', }]}>{i18next.t('Share')}</Text>
                    </TouchableOpacity>

                </View>
                <View style={[CommonStyles.position_absolute_bottom, { height: 1, backgroundColor: Colors.light_gray }]} />
            </View>
        );
    }

    renderContent() {
        let { photos } = this.state
        // console.log("renderContentB:: ", photos, this.postType, this.props);
        photos[0].splice(1, photos[0].length - 2);
        // console.log("renderContentA:: ", photos[0]);
        return (

            <KeyboardAvoidingView
                style={{ flex: 1, flexDirection: 'column', }}
                behavior='padding'
                keyboardVerticalOffset={0} >

                <FlatList
                    removeClippedSubviews={false}
                    data={photos}
                    extraData={this.state}
                    keyExtractor={this.keyExtractor}
                    ListHeaderComponent={this.renderHeader}
                    renderItem={this.renderItem}
                    keyboardShouldPersistTaps="always"
                />
            </KeyboardAvoidingView>

        );
    }

    keyExtractor = (item, index) => index.toString();

    renderHeader() {

        const { showTour, location_checkin, tour } = this.state
        return (
            <View>
                {
                    showTour &&
                    <CreateTourView
                        ref={ref => this.tourCreate = ref}
                        data={tour}
                        onPressTime={this.onPressTourTime}
                        onPressLanguage={this.onPressTourLanguage}
                        onPressExperience={this.onPressTourExperience}
                        onPressPlace={this.onPressTourPlace}
                        onPressDeadLine={this.onPressDeadLine}
                        onPressDeadLineTime={this.onPressDeadLineTime}
                    />
                }
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

            </View>
        );
    }

    renderTextInput() {


        return (
            <View>
                <TextInput

                    multiline
                    //ref={(textInput) => { this.textInput = textInput }}
                    style={[styles.text_input]}
                    autoFocus={this.autoFocus}
                    placeholder={i18next.t('DescribeYourSelf')}
                    selectionColor={Colors.black}
                    value={this.state.content}
                    onChangeText={(text) => this.setState({
                        content: text
                    })}

                    autoFocus={true}
                    underlineColorAndroid='transparent'
                    returnKeyType={"next"}
                    onSubmitEditing={() => { this.textInput.focus(); }}
                    blurOnSubmit={false}
                />

                <TextInput
                    ref={(input) => { this.textInput = input; }}
                    multiline
                    // ref={(textInput) => { this.textInput = textInput }}
                    style={[styles.text_input]}
                    // autoFocus={this.autoFocus}
                    placeholder={i18next.t('InCheckIn')}
                    selectionColor={Colors.black}
                    value={this.state.location}
                    onChangeText={(text) => this.setState({
                        location: text
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

    renderItem = ({ index, item }) => {

        const imageWidth = (Device.screenSize().width - 20) / number_photo_in_row

        return (
            <View style={{ marginHorizontal: 10, height: imageWidth, backgroundColor: Colors.white, flexDirection: 'row' }} >
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

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.white,

    },
    title: {
        alignSelf: 'center',
        color: Colors.green_1,
        // fontWeight: 'bold',
        fontSize: 16
    },
    button_bar: {
        justifyContent: 'center',
        alignItems: 'center',
        top: 2,
        width: 80,
        height: 40,
        position: 'absolute',
    },
    photo: {
        margin: 5
    },
    text_input: {
        marginHorizontal: 12,
        marginTop: 20,
        minHeight: 40,
        maxHeight: 300,
        marginBottom: 10,
        textAlignVertical: 'top',

    },

    button_remove_photo: {
        position: 'absolute',
        top: 6,
        right: 5,
        height: 20,
        width: 20,
        borderRadius: 10,
    },
    wrrapCheckin: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
        marginVertical: 10,
        borderTopColor: '#A9A9A9',
        borderBottomColor: '#A9A9A9',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingVertical: 10
    }
})
