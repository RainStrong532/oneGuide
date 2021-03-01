import React, { Component } from 'react';
import {
    StyleSheet, View, Text, Image,
    ActivityIndicator, TouchableOpacity, Alert, Platform, FlatList,
    ScrollView, TextInput, KeyboardAvoidingView,
    RefreshControl
} from 'react-native';

import { ReachabilityView, i18next, Loading } from '../utils'
import { backScreen, gotoPostDetail, showModalApplyList } from '../navigation';
import Images from '../assets/images'
import Colors from '../constants/colors'
import _ from 'lodash'
import Helper from '../utils/Helper';


class ListRepostComponent extends Component {
    render() {
        return (
            <View>

            </View>
        );
    }
}

export default ListRepostComponent;