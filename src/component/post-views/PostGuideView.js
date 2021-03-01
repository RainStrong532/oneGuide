
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Fonts from '../../constants/fonts'
import Colors from '../../constants/colors'
import Images from '../../assets/images'
import Device from '../../modules/Device'
import CommonStyles from '../../constants/styles'
import _ from 'lodash';
import ImageButtonView from '../views/ImageButtonView'
import i18next from 'i18next';
import DateHelper from '../../utils/DateHelper'

export default class PostGuideView extends Component {

    static propTypes = {
        status: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.onPressDebounce = _.debounce(this.onPress, 1000, { leading: true, trailing: false })

        let showMore = false
        if (props.showFull === true) {
            showMore = true
        }
        this.state = { showMore }

    }

    shouldComponentUpdate(nextProps, nextState) {

        const nextData = _.get(nextProps, 'data')
        const data = _.get(this.props, 'data')

        const shouldUpdate = (
            nextData.type !== data.type ||
            nextData.date_tour !== data.date_tour ||
            nextData.language !== data.language ||
            nextData.experience !== data.experience ||
            nextData.location !== data.location ||
            nextData.title !== data.title ||
            nextData.deadline_timer !== data.deadline_timer ||
            nextState.showMore !== this.state.showMore
        )

        return shouldUpdate

    }
    onPress = () => {
        if (this.state.showMore === true) {
            const { data, } = this.props
            if (this.props.onPressTourLocation) {
                this.props.onPressTourLocation(data)
            }

            return
        }

        this.setState({ showMore: true })
    }

    render() {

        //console.log("asdasdasda", this.props);
        const { data, isShare } = this.props
        const { showMore } = this.state

        const type = _.get(data, 'type')
        if (type !== 'guide') {
            return null
        }

        let date_tour = _.get(data, 'date_tour')
        const language = _.get(data, 'language')
        const experience = _.get(data, 'experience')
        const location = _.get(data, 'location')

        let location_text = null
        if (location) {
            const location_string = location.split('-')
            location_text = location_string.length + ' địa điểm'
        }

        // const title = _.get(data, 'title')

        // const deadline_timer = i18next.t('Deadline') + ': ' + _.get(data, 'deadline_timer')
        //isSharePost  ? convert deadline 
        const txtDeadline = i18next.t('Deadline')
        let deadline = _.get(data, 'deadline_timer')
        let endDate = Number(deadline)

        let dateObj = new Date(endDate * 1000);
        let day = dateObj.getDate()
        let month = dateObj.getMonth() + 1
        let years = dateObj.getFullYear()

        // Get hours from the timestamp 
        let hours = dateObj.getHours();

        // Get minutes part from the timestamp 
        let minutes = dateObj.getMinutes();

        // Get seconds part from the timestamp 
        //let seconds = dateObj.getSeconds();

        const formattedTime = hours.toString().padStart(2, '0') + ':' +
            minutes.toString().padStart(2, '0')

        // const deadline_timer = txtDeadline + ": " + day.toString().padStart(2, '0') + "/" +
        // month.toString().padStart(2, '0') + "/" +
        // years.toString().padStart(2, '0') + " " + formattedTime

        const dateTourStart = String(date_tour).split('-')[0];
        const dateTourEnd = String(date_tour).split('-')[1];
        if (dateTourStart &&
            dateTourEnd) {
            const diffDay = DateHelper.date1DiffDayDate2(dateTourStart, dateTourEnd)
            if (diffDay > 1) {
                date_tour = date_tour + ' ' + `(${diffDay} ${i18next.t('days')})`
            } else {
                date_tour = date_tour + ' ' + `(${diffDay} ${i18next.t('day')})`
            }

        }

        return (
            <View style={styles.container}>

                <View>

                    {/* <ImageButtonView image={Images.tour_name} title={title} /> */}
                    <ImageButtonView image={Images.tour_calendar} title={date_tour} />
                    {
                        showMore
                            ?
                            <View>

                                <ImageButtonView image={Images.tour_location} title={location} />
                                <ImageButtonView image={Images.tour_language} title={language} />
                                <ImageButtonView image={Images.tour_experience} title={experience} />
                                {/* <ImageButtonView image={Images.tour_deadline} title={deadline_timer} /> */}
                            </View>

                            : null
                    }
                </View>

            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 10
    },
    // txtShare:{
    //   fontSize:12
    // }
});
