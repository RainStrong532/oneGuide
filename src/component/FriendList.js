import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import HeaderView from './views/HeaderView';
import { backScreen, gotoInvitedEmail } from '../navigation';
import DismissKeyboard from 'dismissKeyboard';
import Colors from '../constants/colors'
import ListFriendTab from './ListFriendTab'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import AcceptTab from './AcceptTab';
import RequestTab from './RequestTab'
import images from '../assets/images';
import DialogInput from 'react-native-dialog-input';
import FastImage from 'react-native-fast-image';
import _ from 'lodash'
import i18next from 'i18next';

const TabKey = {
    Friend: 'Friend',
    Recommend: 'Recommend',
    Request: 'Request',

}

class FriendList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                { key: TabKey.Friend, title: 'Bạn bè', select_icon: images.tabbar_profile, unSelect_icon: images.tabbar_profile },
                // { key: TabKey.Recommend, title: 'Yêu cầu', select_icon: images.ic_add_friend, unSelect_icon: images.ic_add_friend },
                { key: TabKey.Request, title: 'Gửi đi', select_icon: images.tabbar_profile, unSelect_icon: images.tabbar_profile },
            ],
            listFriend: '',
            listFriendRequest: '',
            // isDialogVisible: false,
        };
        this.handleInvitedUser = _.debounce(this.handleInvited, 500, { leading: true, trailing: false })
    }

    componentDidMount() {
        this.props.getUserFriendList()
            .then(data => {
                const listFriend = data || []

                this.setState({
                    listFriend,
                })
            })
            .catch(error => {
            });
        this.props.getUserRequest()
            .then(value => {
                const listFriendRequest = value || []
                this.setState({
                    listFriendRequest,
                })
            })
            .catch(error => {

            });
    }

    onPressBack = () => {
        DismissKeyboard()
        backScreen(this.props.componentId)
    }

    _renderScene = ({ route }) => {
        switch (route.key) {
            case TabKey.Friend:
                return (
                    <View style={{ flex: 1 }}>
                        <ListFriendTab
                            data={this.state.listFriend}
                            componentId={this.props.componentId}
                        />
                    </View>
                );
            case TabKey.Recommend:
                return (
                    <View style={{ flex: 1 }}>
                        <AcceptTab
                            componentId={this.props.componentId}
                        />
                    </View>
                );
            case TabKey.Request:
                return (
                    <View style={{ flex: 1 }}>
                        <RequestTab
                            data={this.state.listFriendRequest}
                            componentId={this.props.componentId}
                        />
                    </View>
                );
        }
    }

    _renderIcon = ({ route, focused, color }) => {
        return (
            <FastImage
                style={{ width: 20, height: 20 }}
                source={focused ? route.select_icon : route.unSelect_icon}
                resizeMode={FastImage.resizeMode.contain}
            />
        )
    }

    _renderLabel = ({ route, focused }) => {
        return (
            <Text
                style={{ color: focused ? Colors.green_1 : Colors.black, fontSize: 14, fontWeight: '400', textAlign: 'center', marginBottom: 10, width: Device.screenSize().width / 4 }}>
                {route.title}
            </Text>
        );
    }

    _handleIndexChange = index => {
        this.setState({
            index,
        });
    }

    _renderTabBar = props => (
        <TabBar
            {...props}
            style={{ height: 65, backgroundColor: Colors.white }}
            indicatorStyle={{ backgroundColor: Colors.green_1 }}
            renderIcon={this._renderIcon}
            renderLabel={this._renderLabel}
        />
    );

    // showDialog = () => {
    //     this.setState({
    //         isDialogVisible: true
    //     })
    // }
    // sendInput = (input) => {
    //     //checkValid email
    //     //call API send
    //     if (input.match(/^[a-zA-Z0-9]+@[a-zA-Z]+\..+$/)) {
    //         this.props.sendEmail(input)
    //         this.setState({ isDialogVisible: false })
    //     }
    // }

    // closeDialog = () => {
    //     this.setState({
    //         isDialogVisible: false
    //     })
    // }

    handleInvited = () => {
        gotoInvitedEmail(this.props.componentId, {})
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderView
                    title={i18next.t('FriendsList')}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                    back={true}
                    onPressLeftBarButton={this.onPressBack}
                    imageRight={images.ic_add}
                    onPressRightBarButton={this.handleInvitedUser}
                />
                <TabView
                    navigationState={this.state}
                    renderScene={this._renderScene}
                    renderTabBar={this._renderTabBar}
                    onIndexChange={this._handleIndexChange}
                    initialLayout={{ height: 200 }}
                />
                {/* <DialogInput
                    isDialogVisible={this.state.isDialogVisible}
                    title="Mời hướng dẫn viên tham gia"
                    //message={"Message for DialogInput #1"}
                    hintInput="abc@gmai.com"
                    submitInput={(inputText) => { this.sendInput(inputText) }}
                    closeDialog={this.closeDialog}>

                </DialogInput> */}
            </View>


        );
    }
}



export default FriendList;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    activityIndicator: {
        marginTop: 100
    },
})
