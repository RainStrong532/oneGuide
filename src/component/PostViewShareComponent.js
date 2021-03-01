import React, { Component } from 'react';

import {
    View, Text, TouchableOpacity, TextInput, StyleSheet, Image, ScrollView,
    FlatList, Modal, ClippingRectangle
} from 'react-native';
import Images from '../assets/images';
import { ReachabilityView, i18next } from '../utils';
import Colors from '../constants/colors';

class PostViewShareComponent extends Component {
    render() {

        let dataPost = this.props.dataPost
        // console.log("dataPost 111111111111111111111", dataPost);
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', marginTop: 5, padding: 8 }}>
                <Text>
                    Post View Share Component
               </Text>
            </View>
        );
    }
}

export default PostViewShareComponent;