
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Linking } from 'react-native';
import Colors from '../../constants/colors'
import _ from 'lodash';

export default class PostScraperView extends Component {

    constructor(props) {
        super(props);

    }
    render() {
        const scraper = this.props.scraper.scraper || []
        // console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^', this.props);
        return (
            <TouchableOpacity
                onPress={() => { Linking.openURL(scraper.source_url) }}
            >
                <View style={styles.container}>
                    <Text
                        style={{
                            fontSize: 18,
                            padding: 10,
                            color: 'white',
                            backgroundColor: Colors.green_1,
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10
                        }}>
                        {scraper.source_title}
                    </Text>
                    {
                        !scraper.source_thumbnail
                            ?
                            null
                            :
                            <Image
                                source={{ uri: scraper.source_thumbnail }}
                                style={{
                                    width: '100%',
                                    height: 200,
                                }}
                            // resizeMode={""}
                            />
                    }
                    <Text
                        style={styles.link}
                    >
                        {scraper.source_url}
                    </Text>
                    <Text
                        style={styles.text}>
                        {scraper.source_text}
                    </Text>
                </View >
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#F2F0F5',
    },
    text: {
        fontSize: 18,
        color: 'black',
        margin: 10,
    },
    link: {
        color: Colors.green_1,
        margin: 10,
        fontSize: 16
    }
});
