import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    ScrollView,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Platform
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { backScreen } from '../navigation';
import _ from 'lodash'
import DismissKeyboard from 'dismissKeyboard';
import Device from '../modules/Device'
import Images from '../assets/images'
import Colors from '../constants/colors'
import ChatConfig from '../constants/chat-config'
import HeaderView from './views/HeaderView'
import { i18next } from '../utils'
import ImageUtils from '../utils/ImageUtils'
import InputMessageView from './views/InputMessageView'
import SocketManager from '../modules/SocketManager'
import { gotoCameraRollScreen } from '../navigation'
import POST_TYPE from '../constants/post-types'
import MessageView from '../component/chat/MessageView'

export default class ChatComponent extends Component {



    constructor(props) {
        super(props);

        this.state = {

            isLoadMore: true,
            refreshing: false
        }


    }










    render() {



        return (
            <View style={}>






            </View>
        );
    }





}