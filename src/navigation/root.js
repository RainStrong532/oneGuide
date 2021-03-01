import { Navigation } from 'react-native-navigation';
import ScreenName from '../config/screens-name'
import Images from '../assets/images';
import Colors from '../constants/colors';
import { i18next } from '../utils'
import { popAnimations } from '../config/options'


// goto screen functions


export const setRootToLaunchScreen = () => Navigation.setRoot({
    root: {
        component: {
            name: ScreenName.launch,
            options: {
                statusBar: {
                    visible: true,
                    style: 'dark'
                }
            }
        }
    },
})

export const setRootToLaunchProfile = () => Navigation.setRoot({
    root: {
        stack: {
            children: [{
                component: {
                    name: ScreenName.launchProfile,
                }
            }],
            options: {
                animations: {
                    pop: popAnimations,
                }
            }
        }
    }
})

export const setRootToSelectLanguageScreen = () => Navigation.setRoot({
    root: {
        stack: {
            children: [{
                component: {
                    name: ScreenName.select_language,
                }
            }],
            options: {
                animations: {
                    pop: popAnimations,
                }
            }
        }
    }
})

export const setRootToLoginScreen = () => Navigation.setRoot({
    root: {
        stack: {
            children: [{
                component: {
                    name: ScreenName.login,
                }
            }],
            options: {
                animations: {
                    pop: popAnimations,
                }
            }
        }
    }
})

export const setRootToHomeScreen = (data) => {

    Navigation.setRoot({

        root: {

            bottomTabs: {
                id: 'bottomTabs',
                children: [{
                    stack: {
                        children: [{
                            component: {
                                name: ScreenName.home,
                                id: 'home',
                                //passProps: { accountLogin: data }
                            }
                        }],
                        options: {
                            bottomTab: {
                                icon: Images.tabbar_home,
                            },
                            animations: {
                                pop: popAnimations,
                            }
                        }
                    }
                },

                // {
                //     stack: {
                //         children: [{
                //             component: {
                //                 name: data.is_agent == 1 ? ScreenName.Agent_Home : ScreenName.Guide_Home,
                //                 id: data.is_agent == 1 ? 'agent' : 'guide',
                //                 passProps: { agent: data.is_agent == 1 ? 'tour' : 'guide' }
                //             }
                //         }],
                //         options: {
                //             bottomTab: {
                //                 icon: data.is_agent == 1 ? Images.agent_icon : Images.guide_icon,

                //             },
                //             animations: {
                //                 pop: popAnimations,
                //             }
                //         }
                //     }
                // },

                {
                    stack: {
                        children: [{
                            component: {
                                name: ScreenName.HomeGroup,
                                id: 'home_group'
                            }
                        }],
                        options: {
                            bottomTab: {
                                icon: Images.icon_group_new,
                                // iconColor: Colors.gray,
                                // selectedIconColor: Colors.green_1,
                            },
                            animations: {
                                pop: popAnimations,
                            }
                        }
                    }
                },

                {
                    stack: {
                        children: [{
                            component: {
                                name: ScreenName.tour,
                                id: 'tour'
                            }
                        }],
                        options: {
                            bottomTab: {
                                icon: Images.tabbar_tour,
                                // iconColor: Colors.red_1,
                                // selectedIconColor: Colors.red_1,
                            },
                            animations: {
                                pop: popAnimations,
                            }
                        }
                    }
                },

                {
                    stack: {
                        id: 'notification_tab',
                        children: [{
                            component: {
                                name: ScreenName.notification,
                                id: 'notification'
                            }
                        }],
                        options: {
                            bottomTab: {
                                icon: Images.notification,
                                selectTabOnPress: false
                                //badge: '2'
                            },
                            animations: {
                                pop: popAnimations,
                            }
                        }
                    }
                },
                {
                    stack: {

                        children: [{
                            component: {
                                name: ScreenName.profile,
                                id: 'more'
                            }
                        }],
                        options: {
                            bottomTab: {
                                icon: Images.more_than_new_end,
                            },
                            animations: {
                                pop: popAnimations,
                            }
                        }
                    }
                },
                ],
                // backgroundColor: 'red'
                options: {
                    bottomTabs: {
                        tabsAttachMode: 'onSwitchToTab'
                    }
                }
            }
        }
    })
};


export const setRootToRegisterGuideScreen = (email, fromGoogle) => Navigation.setRoot({
    root: {
        stack: {
            children: [{
                component: {
                    name: ScreenName.register_guide,
                    passProps: {
                        email,
                        fromGoogle
                    },
                }
            }],
            options: {
                animations: {
                    pop: popAnimations,
                }
            }
        }
    }
})

export const setRootToRegisterAgentScreen = (email, fromGoogle) => Navigation.setRoot({
    root: {
        stack: {
            children: [{
                component: {
                    name: ScreenName.register_agent,
                    passProps: {
                        email,
                        fromGoogle
                    },
                }
            }],
            options: {
                animations: {
                    pop: popAnimations,
                }
            }
        }
    }
})

export async function dimissModal(componentId) {
    try {
        await Navigation.dismissModal(componentId);
        return Promise.resolve()
    } catch (e) {
        return Promise.reject(e);
    }
}

export async function dimissOverlay(componentId) {
    try {
        await Navigation.dismissOverlay(componentId);
        return Promise.resolve()
    } catch (e) {
        return Promise.reject(e);
    }
}

export function backScreen(componentId, toRoot) {
    if (toRoot) {
        Navigation.popToRoot(componentId);
    } else {
        Navigation.pop(componentId);
    }

}