import React, { Component } from 'react';
import { View, Text } from 'react-native'
import HeaderView from './views/HeaderView';
import { backScreen } from '../navigation';
import { ReachabilityView, i18next, Loading } from '../utils'
import Images from '../assets/images'
import Colors from '../constants/colors'
import _ from 'lodash'
import Helper from '../utils/Helper';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import FastImage from 'react-native-fast-image';
import PostApplyListComponent from './PostApplyListComponent';
import ListGuideInvited from './ListGuideInvited'
import ListGuideApplyTour from './ListGuideApplyTour'
import ListGuideTour from './ListGuideTour'

const TabKey = {
    Invite: i18next.t('Invited'),
    Register: i18next.t('Register'),
    Guider: i18next.t('ToGuide'),
}
const initialLayout = {
    height: Device.screenSize().height,
    width: Device.screenSize().width,
};


class ListGuideApply extends Component {


    state = {
        index: 0,
        routes: [
            { key: TabKey.Invite, title: i18next.t('Invited'), select_icon: Images.invite_friend_end, unSelect_icon: Images.invite_friend_end },
            { key: TabKey.Register, title: i18next.t('Register'), select_icon: Images.post_apply, unSelect_icon: Images.post_apply },
            { key: TabKey.Guider, title: i18next.t('ToGuide'), select_icon: Images.tour, unSelect_icon: Images.tour },

        ],
    };

    onPressBack = () => {
        backScreen(this.props.componentId)
    }
    _handleIndexChange = index => {
        this.setState({
            index,
        });
    }

    _renderTabBar = props => (
        <TabBar
            {...props}
            style={{ height: 65, backgroundColor: '#F1F7F5' }}
            indicatorStyle={{ backgroundColor: Colors.green_1 }}
            renderIcon={this._renderIcon}
            renderLabel={this._renderLabel}
        />
    );

    _renderScene = ({ route }) => {

        switch (route.key) {
            case TabKey.Guider:
                return (
                    <ListGuideTour
                        {...this.props}
                        comment_id={this.props.data ? this.props.data.id : ''}
                        componentId={this.props.componentId}
                    />
                )
            case TabKey.Register:
                return (
                    <ListGuideApplyTour
                        {...this.props}
                        comment_id={this.props.data ? this.props.data.id : ''}
                        componentId={this.props.componentId}
                    />
                );
            case TabKey.Invite:
                return (

                    <ListGuideInvited
                        {...this.props}
                        comment_id={this.props.data ? this.props.data.id : ''}
                        componentId={this.props.componentId}
                    />
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
                style={{ color: focused ? Colors.green_1 : Colors.black, fontSize: 14, fontWeight: '400', textAlign: 'center', marginBottom: 10, }}>
                {route.title}
            </Text>
        );
    }
    render() {
        // console.log("this.prop.dataparam", this.props);
        return (
            <View style={{ flex: 1, backgroundColor: '#F1F7F5' }}>
                <HeaderView
                    title={i18next.t('ListOfRegisteredGuide')}
                    tintColor={Colors.white}
                    style={{ backgroundColor: Colors.green_1 }}
                    back={true}
                    onPressLeftBarButton={this.onPressBack}
                />
                <TabView
                    lazy
                    style={{ backgroundColor: '#F1F7F5' }}
                    navigationState={this.state}
                    renderScene={this._renderScene}
                    renderTabBar={this._renderTabBar}
                    onIndexChange={this._handleIndexChange}
                    initialLayout={initialLayout}
                />
            </View>
        );
    }
}

export default ListGuideApply;