import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Component } from 'react'
import HeaderView from './views/HeaderView'
import { backScreen } from "../navigation";
import Colors from '../constants/colors'
import { Dropdown } from 'react-native-material-dropdown';
import { i18next, Loading } from '../utils'
import Helper from '../utils/Helper';
// import styles from '../constants/styles';

export default class PublicProfileComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            birthday: '',
            phone: '',
            friend: '',
            email: '',
            location: '',
            isEdit: false,
            refreshing: false
        }
    }
    onPressBack = () => {
        backScreen(this.props.componentId)
    }

    onPressDone = () => {
        const birthday = this.state.birthday
        const phone = this.state.phone
        const friend = this.state.friend
        const email = this.state.email
        const location = this.state.location
        let data = {

            user_privacy_birthdate: birthday,
            user_privacy_email: email,
            user_privacy_friends: friend,
            user_privacy_location: location,
            user_privacy_phone: phone,
        }

        Loading.showHud()
        this.props.updateProfileInfo(data)
            .then(response => {
                Loading.hideHud()
                const message = _.get(response, 'data.message')
                if (message === 'Succes') {
                    this.doGetMyInfo()
                    backScreen(this.props.componentId)
                } else {
                    Helper.showErrorAlert('', message)
                    this.setState({ isEdit: false })
                }
            })
            .catch(error => {
                Loading.hideHud()
            });
    }


    render() {
        let data = [{
            value: i18next.t('me'),
        }, {
            value: i18next.t('public'),
        }, {
            value: i18next.t('friends'),
        }];
        return (
            <View>
                <HeaderView
                    style={{ backgroundColor: Colors.green_1 }}
                    title={'setting Profile'}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                    back={true}
                    titleRight={i18next.t('Done')}
                    onPressLeftBarButton={this.onPressBack}
                    onPressRightBarButton={this.onPressDone}

                />
                <View>
                    <View
                        style={styles.view_privacy}
                    >
                        <Text>
                            ngày sinh
                        </Text>
                        <Dropdown
                            label={i18next.t(this.props.user.me.listPrivacyUser.user_privacy_birthdate)}
                            data={data}
                            containerStyle={{ width: 110, }}
                            onChangeText={(birthday) => this.setState({ birthday: birthday })}
                        />
                    </View><View
                        style={styles.view_privacy}
                    >
                        <Text>
                            phone
                        </Text>
                        <Dropdown
                            label={i18next.t(this.props.user.me.listPrivacyUser.user_privacy_phone)}
                            data={data}
                            containerStyle={{ width: 110, }}
                            onChangeText={(phone) => this.setState({ phone: phone })}
                        />
                    </View><View
                        style={styles.view_privacy}
                    >
                        <Text>
                            bạn bè
                        </Text>
                        <Dropdown
                            label={this.props.user.me.listPrivacyUser.user_privacy_friends}
                            data={data}
                            containerStyle={{ width: 110, }}
                            onChangeText={(friend) => this.setState({ friend: friend })}
                        />
                    </View><View
                        style={styles.view_privacy}
                    >
                        <Text>
                            email
                        </Text>
                        <Dropdown
                            label={this.props.user.me.listPrivacyUser.user_privacy_email}
                            data={data}
                            containerStyle={{ width: 110, }}
                            onChangeText={(email) => this.setState({ email: email })}
                        />
                    </View><View
                        style={styles.view_privacy}
                    >
                        <Text>
                            location
                        </Text>
                        <Dropdown
                            label={this.props.user.me.listPrivacyUser.user_privacy_location}
                            data={data}
                            containerStyle={{ width: 110, }}
                            onChangeText={(location) => this.setState({ location: location })}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    view_privacy: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})