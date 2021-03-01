


import React, { Component } from 'react';
import { ScrollView, Dimensions, View } from 'react-native';
import HTML from 'react-native-render-html';
import HeaderView from './views/HeaderView';
import { backScreen } from '../navigation';
import { ReachabilityView, i18next, Loading } from '../utils'
import Colors from '../constants/colors'



// const htmlContent = `
//     <h1>This HTML snippet is now rendered with native components !</h1>
//     <h2>Enjoy a webview-free and blazing fast application</h2>
//     <img src="https://i.imgur.com/dHLmxfO.jpg?2" />
//     <em style="textAlign: center;">Look at how happy this native cat is</em>
// `;
export default class TermPolicyComponent extends Component {

    state = {
        htmlContent: ''
    }

    componentDidMount() {
        this.props.getTermAndPolicy()
            .then(res => {
                // console.log("ressponse term and policy", res);
                this.setState({
                    htmlContent: res.content
                })
            })
    }
    onPressBack = () => {
        backScreen(this.props.componentId)
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF', }}>
                <HeaderView
                    title={i18next.t('TermAndPolicy')}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1, }}
                    back={true}
                    onPressLeftBarButton={this.onPressBack}
                />

                <ScrollView style={{ flex: 1 }}>
                    <View style={{ paddingHorizontal: 15, marginBottom: 50, marginTop: 20 }}>
                        <HTML html={this.state.htmlContent}
                            imagesMaxWidth={Dimensions.get('window').width}
                            baseFontStyle={{ fontSize: 16 }}
                        // tagsStyles={textStyles}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}