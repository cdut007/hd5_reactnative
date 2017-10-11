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

import Navigation from '../common/Navigation';
import TabNavigator from 'react-native-tab-navigator';
import TabView from './TabView'
import WelcomeView from '../Login/Welcome'
var Global = require('../common/globals');

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
    }

    render() {
        if(this.state.hasLogin == null)
        {
            return(<View/>)
        }
   Global.version = this.props.version
        if (this.state.hasLogin)
        {
            return (
                <Navigator
                initialRoute={{component: TabView, name: "MainPage"}}
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
                initialRoute={{component: WelcomeView, name: "WelcomePage", index: this.props.index}}
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
