import React, { Component } from 'react';
import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    ScrollView,
    FlatList,
    Modal,
    ClippingRectangle,
    RefreshControl,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';
import Images from '../assets/images';
import { ReachabilityView, i18next } from '../utils';
import Colors from '../constants/colors';
import HeaderView from '../component/views/HeaderView'
import {

    backScreen
} from '../navigation';
import TourInviteComponent from '../component/TourInviteComponent'
import Helper from '../utils/Helper';

class InvitationtoJoinTourComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checkNumberOfLine: false,
            page: 1,
            keysearch: ''
        }

    }
    componentDidMount = () => {
        let data = {
            page: this.state.page,
            keysearch: this.state.keysearch
        }
        this.props.getListTourAgentInvite(data)
            .then(() => {

            })
    }
    checkText = () => {
        this.setState({
            checkNumberOfLine: !this.state.checkNumberOfLine
        })
    }
    onPressBack = () => {
        backScreen(this.props.componentId)
    }
    handleConfirm = (comment_id) => {
        let data = {
            comment_id
        }
        this.props.applyTourInvite(data)
    }

    handleCancel = (comment_id) => {
        let data = {
            comment_id,
            action: 'guide-cancel'
        }
        Helper.showAlert('', i18next.t('AreYouSureYouRefuseToJoinThisTour'),
            [
                { text: i18next.t('No'), onPress: null },
                {
                    text: i18next.t('Yes'), onPress: () => {
                        this.props.applyTourInvite(data)
                            .then((response) => {
                                if (response.messages == 'Tour đã quá hạn đăng ký') {
                                    Helper.showAlert('', i18next.t('TourHasBeenOverdueForCancellation'))
                                }
                            })
                    }
                }
            ])

    }

    handleGuideCancel = () => {
        Helper.showAlert('', i18next.t('YouCanceledInvitationThisTour'),
            // [
            //     {
            //         text: 'OK', onPress: () => {
            //         }
            //     }
            // ]
        )
    }
    render() {
        return (
            <View style={styles.containerS}>
                <HeaderView
                    title={i18next.t('Invitationtojointour')}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                    back={true}
                    onPressLeftBarButton={this.onPressBack}
                />
                {
                    this.props.listTourInvite
                        ?
                        <TourInviteComponent
                            // checkNumberOfLine={this.state.checkNumberOfLine}
                            // checkText={this.checkText}
                            data={this.props.listTourInvite}
                            handleConfirm={this.handleConfirm}
                            handleCancel={this.handleCancel}
                            handleGuideCancel={this.handleGuideCancel}
                        />
                        :
                        <View
                            style={{
                                alignItems: 'center',
                                marginTop: 100
                            }}
                        >

                            <Image
                                source={Images.no_travlling}
                                style={{
                                    width: 70,
                                    height: 70,
                                    marginBottom: 20,
                                    tintColor: Colors.gray
                                }}
                            />
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: Colors.gray
                                }}
                            >
                                {i18next.t('NoInvitationTour')}
                            </Text>
                        </View>
                }
            </View>
        );
    }
}

export default InvitationtoJoinTourComponent;
const styles = StyleSheet.create({
    containerS: {
        // borderBottomColor: '#F1F7F5',
        // borderBottomWidth: 7,
        flex: 1,
        backgroundColor: '#F1F7F5'

    },


})