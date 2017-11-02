import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    AsyncStorage
} from 'react-native';


import {Navigator}
 from 'react-native-deprecated-custom-components'
import HttpRequest from '../HttpRequest/HttpRequest'
import Navigation from '../common/Navigation';
import TabNavigator from 'react-native-tab-navigator';
import TabView from './TabView'
import WelcomeView from '../Login/Welcome'
var Global = require('../common/globals');

import JPushModule from 'jpush-react-native';
const receiveCustomMsgEvent = "receivePushMsg";
const receiveNotificationEvent = "receiveNotification";
const openNotificationEvent = "openNotification";
const getRegistrationIdEvent = "getRegistrationId";

export default class MainView extends Component {

    constructor(props)
    {
        super(props)

        this.state={
            hasGotLogin: false,
            hasLogin: null
        }
        this.getHasLogin()
    }

    componentDidMount(){
        JPushModule.notifyJSDidLoad((resultCode) => {
			if (resultCode === 0) {}
		});
		JPushModule.addReceiveCustomMsgListener((map) => {
			this.setState({
				pushMsg: map.message
			});
			console.log("extras: " + map.extras);
		});
		JPushModule.addReceiveNotificationListener((map) => {
			console.log("alertContent: " + map.alertContent);
			console.log("extras: " + map.extras);
			// var extra = JSON.parse(map.extras);
			// console.log(extra.key + ": " + extra.value);
		});
		JPushModule.addReceiveOpenNotificationListener((map) => {
			console.log("Opening notification!");
			console.log("map.extra: " + map.extras);
			//this.jumpSecondActivity();
			// JPushModule.jumpToPushActivity("SecondActivity");
		});
		JPushModule.addGetRegistrationIdListener((registrationId) => {
			console.log("Device register succeed, registrationId " + registrationId);
		});
    }

    getHasLogin()
    {
        var me = this
        AsyncStorage.getItem('k_login_info',function(errs,result)
        {
            if (!errs && result && result.length)
            {
                me.setState({hasLogin: true})
                var infoJson = JSON.parse(result);
                Global.UserInfo = infoJson.responseResult;
                console.log('UserInfo: ' + result)
            }
            else
            {
                me.setState({hasLogin: false})
            }
        });

        HttpRequest.initDomain();
    }

    render() {
        if(this.state.hasLogin == null)
        {
            return(<View/>)
        }

        if (this.state.hasLogin)
        {
            return (
                <Navigator
                initialRoute={{component: TabView, name: "MainPage", props:{version: this.props.version}}}
                configureScene={() => Navigator.SceneConfigs.FloatFromRight}
                renderScene={(route, navigator) => {
                      return <route.component navigator={navigator} {...route.props}/>
                    }
                }
              />
            )
        }
         else {
            return (
                <Navigator
                initialRoute={{component: WelcomeView, name: "WelcomePage", index: this.props.index,props:{version: this.props.version}}}
                configureScene={() => Navigator.SceneConfigs.FloatFromRight}
                renderScene={(route, navigator) => {
                      return <route.component navigator={navigator} {...route.props}/>
                    }
                }
              />
            )
        }


        // return (
        //     <TabNavigator>
        //         <TabNavigator.Item
        //             selected={this.state.selectedTab === 'tab1'}
        //             title="动态监管系统"
        //             renderIcon={() => <Image source={require('../images/toolbarIconChat.png')} />}
        //             renderSelectedIcon={() => <Image source={require('../images/toolbarIconChatActive.png')} />}
        //             badgeText=""
        //             onPress={() => this.setState({ selectedTab: 'tab1' })}>
        //             {<Navigation component={MainFirstView} title={'动态监管系统'} />}
        //         </TabNavigator.Item>
        //         <TabNavigator.Item
        //             selected={this.state.selectedTab === 'tab2'}
        //             title="Me"
        //             renderIcon={() => <Image source={require('../images/toolBarIconMe.png')} />}
        //             renderSelectedIcon={() => <Image source={require('../images/toolBarIconMe.png')} />}

        //             onPress={() => this.setState({ selectedTab: 'tab2' })}>
        //             {<View style={styles.container}>
        //                 <Text style={styles.welcome}>
        //                     test view2
        //                 </Text>
        //             </View>}
        //         </TabNavigator.Item>
        //     </TabNavigator>

        // )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
