import React, { Component } from 'react';
import {
    StyleSheet,
    View, Text,
    ScrollView,
    Image,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
} from 'react-native';
import {
    backScreen
} from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import POST_TYPE from '../constants/post-types'
import Device from '../modules/Device'
import { i18next, Loading } from '../utils'
import DismissKeyboard from 'dismissKeyboard';
import CommonStyles from '../constants/styles'
import StringUtils from '../utils/StringUtils'
import Helper from '../utils/Helper';
import HeaderView from '../component/views/HeaderView'

import _ from 'lodash'

export default class TrackingHistoryAgentComponent extends Component {

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


    }
    backScreen = () => {
        backScreen(this.props.componentId)
    }
    render() {

        return (
            <View >
                <HeaderView
                    title={i18next.t('TrackingHistoryAgent')}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                    back={true}
                    onPressLeftBarButton={this.backScreen}
                >

                </HeaderView>
                <Text>history Agent lesss</Text>

            </View>
        );
    }




}

const styles = StyleSheet.create({


})
