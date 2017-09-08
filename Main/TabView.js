import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    BackAndroid
} from 'react-native';


import HomeView from './HomeView';
import MeView from './MeView';
import MeetingView from './MeetingView';
import Navigation from '../common/Navigation';
import TabNavigator from 'react-native-tab-navigator';

export default class TabView extends Component
{
    state =
    {
        selectedTab: 'tab1'
    }

    componentWillMount(){
        var me = this;
        BackAndroid.addEventListener('harwardBackPress', () => {
            const routers = me.props.navigator.getCurrentRoutes();
            if (routers.length > 1) {
                me.props.navigator.pop();
                return true;
            } else {
                    if (routers[0].name == 'MainPage'||routers[0].name == 'LoginView') {
                      BackAndroid.exitApp();
                      return true;
                    } else {
                      me.props.navigator.pop();
                      return true;
                    }

                  }
                  return false;
      });
    }


      componentWillUnmount() {
                BackAndroid.removeEventListener('hardwareBackPress');
            }

    render()
    {
        return (
            <TabNavigator>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'tab1'}
                    title="首页"
                    renderIcon={() => <Image style={{width:24,height:24,}} source={require('../images/home_icon.png')} />}
                    renderSelectedIcon={() => <Image style={{width:24,height:24,}} source={require('../images/home_icon_click.png')} />}
                    badgeText=""
                    selectedTitleStyle={styles.tabBarTintColor}
                    onPress={() => this.setState({ selectedTab: 'tab1' })}>
                    {<HomeView {...this.props}/>}
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'tab2'}
                    title="会议"
                    renderIcon={() => <Image style={{width:24,height:24,}} source={require('../images/meeting_icon.png')} />}
                    renderSelectedIcon={() => <Image style={{width:24,height:24,}} source={require('../images/meeting_icon_click.png')} />}
                    selectedTitleStyle={styles.tabBarTintColor}
                    onPress={() => this.setState({ selectedTab: 'tab2' })}>
                    {<MeetingView {...this.props}/>}
                </TabNavigator.Item>

                <TabNavigator.Item
                    selected={this.state.selectedTab === 'tab3'}
                    title="我的"
                    renderIcon={() => <Image style={{width:24,height:24,}} source={require('../images/me_icon.png')} />}
                    renderSelectedIcon={() => <Image style={{width:24,height:24,}} source={require('../images/me_icon_click.png')} />}
                    selectedTitleStyle={styles.tabBarTintColor}
                    onPress={() => this.setState({ selectedTab: 'tab3' })}>
                    {<MeView {...this.props}/>}
                </TabNavigator.Item>

            </TabNavigator>

        )
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
    tabBarTintColor: {

      color: '#0755a6'
    },

});
