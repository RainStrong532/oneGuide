import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity, TextInput, StyleSheet, Image, ScrollView,
    FlatList, Modal, ClippingRectangle
} from 'react-native';
import Images from '../assets/images';
import { ReachabilityView, i18next } from '../utils';
import Colors from '../constants/colors'

class PostViewAbumComponent extends Component {
    render() {
        const { dataPost } = this.props
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', marginTop: 5, padding: 8 }}>
                <Text>
                    1212221
                </Text>
            </View>
        );
    }
}

export default PostViewAbumComponent;