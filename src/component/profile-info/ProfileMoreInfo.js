import React, { Component } from 'react'
import {
    View,
    Text,
    ScrollView,
    SafeAreaView,
    StyleSheet,
    Image,
    TouchableOpacity,
    Linking,

} from 'react-native'
import Images from '../../assets/images'
import Colors from '../../constants/colors'
import HeaderView from '../views/HeaderView'
import { backScreen } from '../../navigation'
import DismissKeyboard from 'dismissKeyboard';
import { pushToProfileInformation, pushToAccountVerify } from '../../navigation'
import i18next from 'i18next'
import _ from 'lodash'


export default class ProfileMoreInfo extends Component {
    onPressBack = () => {
        DismissKeyboard()
        backScreen(this.props.componentId)
    }

    onPressButtonEditProfile = () => {
        pushToProfileInformation(this.props.componentId)
    }

    handleVeryfiAccount = () => {
        pushToAccountVerify(this.props.componentId)
    }

    render() {
        console.log('profile info', this.props);
        const { otherUser, isMe } = this.props.data || []
        const { user } = this.props || []

        let gender
        if (isMe) {
            if (user.me.gender === '1') {
                gender = 'Nam'
            }
            if (user.me.gender === '2') {
                gender = 'Nữ'
            }
        }
        if (isMe === false) {
            if (otherUser.gender = '1') {
                gender = 'Nam'
            } else if (otherUser.gender = '2') {
                gender = 'Nữ'
            }
        }

        let relationship
        if (isMe) {
            relationship = user.me.relationship
        }
        if (isMe == false) {
            relationship = otherUser.relationship
        }

        let itemLanguage = []
        let f_language = _.get(user.me, 'f_language')
        if (user) {
            itemLanguage = f_language.map((item, key) => {
                return `${item.name},  `
                // (
                //     <View
                //         style={{
                //             flexDirection: 'row-reverse',
                //             // flexWrap: 'wrap'
                //         }}>
                //         <Text
                //             key={key}
                //             style={styles.last_content}
                //         >
                //             {item.name}
                //         </Text>
                //     </View>
                // )
            })
        }

        let emailUser
        if (isMe) {
            emailUser = user.me.email
        }
        if (isMe === false) {
            emailUser = otherUser.email
        }

        let card
        if (isMe) {
            card = user.me.card
        }
        if (isMe === false) {
            card = otherUser.card
        }

        let card_name
        if (isMe) {
            card_name = user.me.more_information.card_name ? user.me.more_information.card_name : ''
        }
        if (isMe === false) {
            card_name = otherUser.more_information.card_name ? otherUser.more_information.card_name : ''
        }

        let card_type
        if (isMe) {
            card_type = user.me.more_information.card_type ? user.me.more_information.card_type : ''
        }
        if (isMe === false) {
            card_type = otherUser.more_information.card_type ? otherUser.more_information.card_type : ''
        }

        let card_expried
        if (isMe) {
            card_expried = user.me.more_information.card_expried ? user.me.more_information.card_expried : ''
        }
        if (isMe === false) {
            card_expried = otherUser.more_information.card_expried ? otherUser.more_information.card_expried : ''
        }

        let is_verify
        if (isMe) {
            is_verify = user.me.is_verify
        }
        if (isMe === false) {
            is_verify = otherUser.is_verify
        }

        console.log('::::::::::::::::::::::::::::::::::::::::::::::::', this.props);

        return (
            <View
            >
                <HeaderView
                    title={i18next.t('InforAndContact')}
                    back={true}
                    tintColor={Colors.white}
                    onPressLeftBarButton={this.onPressBack}
                    style={{ backgroundColor: Colors.green_1 }}
                />
                <ScrollView
                    style={{ backgroundColor: Colors.light_gray_4 }}

                // style={{ flex: 1, backgroundColor: Colors.gray_1, paddingLeft: 10, paddingRight: 10 }}
                >
                    <View>
                        <View style={styles.view}>

                            <View style={{
                                flexDirection: "row",
                                justifyContent: 'space-between'
                            }}>
                                <Text
                                    style={styles.title}
                                >
                                    {i18next.t('InforAndContact')}
                                </Text>
                                {
                                    isMe
                                        ?
                                        <TouchableOpacity
                                            onPress={this.onPressButtonEditProfile}
                                            style={{ marginTop: 18, marginRight: 10 }}
                                        >
                                            <Image
                                                source={Images.ic_edit_profile}
                                                style={{ width: 20, height: 20, alignSelf: 'center' }}
                                            />
                                        </TouchableOpacity>
                                        :
                                        null
                                }
                            </View>
                            <View
                                style={{ backgroundColor: Colors.light_gray_1, height: 1, width: '100%' }}
                            />
                            <View>
                                <View style={styles.content_row}>
                                    <View style={{}}>

                                        <Image style={styles.image_logo}
                                            source={Images.people_icon}
                                        />
                                    </View>
                                    <View style={styles.content}>
                                        <Text style={styles.left_item}>
                                            {
                                                otherUser.is_agent == '1' ? i18next.t('FullName') : i18next.t('CompanyName')
                                            }
                                        </Text>
                                        <Text style={styles.last_content}>
                                            {
                                                isMe ? user.me.username : otherUser.username
                                            }
                                        </Text>
                                    </View>

                                </View>


                                {
                                    otherUser.is_agent == '1'
                                        ?
                                        <View style={styles.content_row}>
                                            <View>

                                                <Image style={styles.image_logo}
                                                    source={Images.gender_icon}
                                                />
                                            </View>

                                            <View style={styles.content}>

                                                <Text style={styles.left_item}>{i18next.t('Gender')}</Text>
                                                <Text style={styles.last_content}>{gender}</Text>

                                            </View>

                                        </View>
                                        :
                                        null
                                }
                                <View style={styles.content_row}>
                                    <View>

                                        <Image style={styles.image_logo}

                                            source={Images.calender_icon}
                                        />
                                    </View>
                                    <View style={styles.content}>
                                        <Text style={styles.left_item}>

                                            {
                                                otherUser.is_agent == '1'
                                                    ?
                                                    i18next.t('DateOfBirth')
                                                    :
                                                    i18next.t('DateRaning')
                                            }
                                        </Text>
                                        <Text style={styles.last_content}>
                                            {
                                                isMe
                                                    ?
                                                    user.me.birthday
                                                    :
                                                    otherUser.birthday
                                            }
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.content_row}>
                                    <View>

                                        <Image style={styles.image_logo}
                                            source={Images.home_icon}
                                        />
                                    </View>
                                    <View style={styles.content}>
                                        <Text style={styles.left_item}>

                                            {
                                                otherUser.is_agent == '1'
                                                    ?
                                                    'Sống Tại'
                                                    :
                                                    'Địa điểm'
                                            }
                                        </Text>
                                        <Text style={styles.last_content}>
                                            {
                                                isMe
                                                    ?
                                                    user.me.address
                                                    :
                                                    otherUser.address
                                            }
                                        </Text>
                                    </View>

                                </View>

                                {
                                    otherUser.is_agent == '1'
                                        ?
                                        <View style={styles.content_row}>
                                            <View>

                                                <Image style={styles.image_logo}
                                                    source={Images.marri_icon}
                                                />
                                            </View>
                                            <View style={styles.content}>

                                                <Text style={styles.left_item}>{i18next.t('Status')}</Text>
                                                <Text
                                                    style={styles.last_content}>
                                                    {
                                                        otherUser.relationship
                                                            ?
                                                            relationship
                                                            :
                                                            i18next.t('Alone')
                                                    }
                                                </Text>
                                            </View>
                                        </View>
                                        :
                                        null
                                }
                            </View>

                        </View>

                        {
                            otherUser.is_agent == 1 && (
                                <View style={styles.view}>

                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: 'space-between'
                                    }}>
                                        <Text
                                            style={styles.title}
                                        >
                                            {i18next.t('CardInformation')}
                                        </Text>
                                    </View>
                                    <View
                                        style={{ backgroundColor: Colors.light_gray_1, height: 1, width: '100%' }}
                                    />
                                    {
                                        is_verify == 1
                                            ?
                                            <View>
                                                <View style={styles.content_row}>
                                                    <View style={{}}>

                                                        <Image style={styles.image_logo}
                                                            source={Images.person_contact}
                                                        />
                                                    </View>
                                                    <View style={styles.content}>
                                                        <Text style={styles.left_item}>
                                                            {
                                                                i18next.t('CardNumber')
                                                            }
                                                        </Text>
                                                        <Text style={styles.last_content}>
                                                            {
                                                                card
                                                            }
                                                        </Text>
                                                    </View>

                                                </View>

                                                <View style={styles.content_row}>
                                                    <View>

                                                        <Image style={styles.image_logo}
                                                            source={Images.people_icon}
                                                        />
                                                    </View>

                                                    <View style={styles.content}>

                                                        <Text style={styles.left_item}>{i18next.t('NameOnTheCard')}</Text>
                                                        <Text style={styles.last_content}>{card_name}</Text>

                                                    </View>

                                                </View>
                                                <View style={styles.content_row}>
                                                    <View>

                                                        <Image style={styles.image_logo}

                                                            source={Images.person_contact}
                                                        />
                                                    </View>
                                                    <View style={styles.content}>
                                                        <Text style={styles.left_item}>

                                                            {
                                                                i18next.t('CardType')
                                                            }
                                                        </Text>
                                                        <Text style={styles.last_content}>
                                                            {
                                                                card_type
                                                            }
                                                        </Text>
                                                    </View>
                                                </View>

                                                <View style={styles.content_row}>
                                                    <View>

                                                        <Image style={styles.image_logo}

                                                            source={Images.calender_icon}
                                                        />
                                                    </View>
                                                    <View style={styles.content}>
                                                        <Text style={styles.left_item}>

                                                            {
                                                                i18next.t('ExpiredDate')
                                                            }
                                                        </Text>
                                                        <Text style={styles.last_content}>
                                                            {
                                                                card_expried
                                                            }
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                            :
                                            <TouchableOpacity
                                                onPress={this.handleVeryfiAccount}
                                                style={{
                                                    alignItems: 'center',
                                                    margin: 10
                                                }}
                                                disabled={isMe ? false : true}
                                            >
                                                <Text
                                                    style={{
                                                        color: Colors.blue_1,
                                                        fontSize: 14
                                                    }}
                                                >
                                                    {i18next.t('NeedToVerify')}
                                                </Text>
                                            </TouchableOpacity>
                                    }
                                </View>
                            )
                        }
                        {otherUser.is_agent == 1 && (
                            <View style={styles.view}>
                                <Text
                                    style={styles.title}
                                >
                                    {i18next.t('Work')}
                                </Text>
                                <View
                                    style={{ backgroundColor: Colors.light_gray, height: 1, width: '100%' }}
                                />
                                <View>
                                    <View style={styles.content_row}>
                                        <View>

                                            <Image style={styles.image_logo}
                                                source={Images.company_icon}
                                            />
                                        </View>
                                        <View style={styles.content}>

                                            <Text style={styles.left_item}>{otherUser.is_agent === '2' ? i18next.t('CompanyName') : i18next.t('WorkAt')}</Text>
                                            <Text style={styles.last_content}>
                                                {isMe ? user.me.organisation : otherUser.company}
                                            </Text>
                                        </View>
                                        {/* <Text style={styles.last_content}>{isMe ? user.me.organisation : otherUser.company}</Text> */}
                                    </View>

                                    <View style={styles.content_row}>
                                        <View>

                                            <Image style={styles.image_logo}
                                                source={Images.exp_icon}
                                            />
                                        </View>
                                        <View style={styles.content}>
                                            <Text style={styles.left_item}>

                                                {
                                                    otherUser.is_agent === '2' ? i18next.t('Established') : i18next.t('Experience')
                                                }
                                            </Text>
                                            <Text style={styles.last_content}>
                                                {isMe ?
                                                    user.me.experience
                                                    :
                                                    otherUser.experience
                                                } {i18next.t('year')}
                                            </Text>
                                        </View>

                                    </View>

                                    <View style={styles.content_row}>
                                        <View>

                                            <Image style={styles.image_logo}
                                                source={Images.link_icon}
                                            />
                                        </View>

                                        <View>
                                            <Text style={{ marginLeft: 10, color: Colors.black }}>
                                                {emailUser}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                        }
                        <View style={[styles.view,]}>
                            <Text
                                style={styles.title}
                            >
                                {i18next.t('Language')}
                            </Text>
                            <View
                                style={{ backgroundColor: Colors.light_gray, height: 1, width: '100%' }}
                            />
                            <View>
                                <View style={styles.content_row}>
                                    <View>

                                        <Image style={styles.image_logo}
                                            source={Images.tour_language}
                                        />
                                    </View>

                                    <View style={styles.content}>

                                        <Text style={styles.left_item}>{i18next.t('MainLanguage')}</Text>
                                        <Text style={styles.last_content}>
                                            {
                                                isMe
                                                    ?
                                                    user.me.language.name

                                                    :
                                                    otherUser.language

                                            }
                                        </Text>
                                    </View>

                                </View>
                                <View style={styles.content_row}>
                                    <View>

                                        <Image style={styles.image_logo}
                                            source={Images.tour_language}
                                        />
                                    </View>

                                    <View style={styles.content}>

                                        <Text style={styles.left_item}>{i18next.t('OtherLanguages')}</Text>

                                        <Text style={styles.last_content}>

                                            {isMe ?
                                                <Text style={styles.last_content}>{itemLanguage}</Text> :
                                                <Text style={styles.last_content}>{otherUser.f_language}</Text>
                                            }
                                        </Text>
                                    </View>

                                </View >
                            </View >
                        </View >
                    </View >
                </ScrollView >
            </View >
        )
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 19,
        fontWeight: "700",
        color: 'black',
        margin: 10

    },
    content: {
        // width: '94%',
        flex: 1,
        justifyContent: "space-between",
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 0,
        margin: 0
    },
    last_content: {
        fontSize: 15,
        color: 'black',
        fontWeight: "500",
        width: '50%',
    },
    left_item: {

        // width: '50%',
        flex: 1,
        paddingLeft: 7,
        color: "#000000",
        fontSize: 15

    },
    content_row: {
        flexDirection: "row",
        alignItems: 'flex-start',
        marginLeft: 10,
        marginTop: 7
    },
    image_logo: {
        marginTop: 2,
        tintColor: Colors.gray_2,
    },
    view: {
        backgroundColor: Colors.white,
        borderRadius: 5,
        marginTop: 5,
        // marginRight: 5,
        marginLeft: 5,
        paddingBottom: 5
    }
})