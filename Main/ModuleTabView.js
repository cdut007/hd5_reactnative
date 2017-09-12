import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    BackAndroid
} from 'react-native';


import IssueListViewContainer from './IssueListViewContainer';

import WitnessListViewContainer from './WitnessListViewContainer';

import WitnessStatisticsView from './WitnessStatisticsView';
import PlanStatisticsView from './PlanStatisticsView';
import IssueStatisticsView from './IssueStatisticsView';

import WitnessSubViewContainer from './WitnessSubViewContainer';
import PlanStatisticsSubViewContainer from './PlanStatisticsSubViewContainer';
import IssueStatisticsSubView from './IssueStatisticsSubView';

import Navigation from '../common/Navigation';
import TabNavigator from 'react-native-tab-navigator';
import Global from '../common/globals.js'
export default class ModuleTabView extends Component
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
        if (Global.isMonitor(Global.UserInfo)){
            return(
                <TabNavigator>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tab1'}
                        title="任务"
                        renderIcon={() => <Image style={{width:24,height:24,}} source={require('../images/task_icon.png')} />}
                        renderSelectedIcon={() => <Image style={{width:24,height:24,}} source={require('../images/task_icon_click.png')} />}
                        badgeText=""
                        selectedTitleStyle={styles.tabBarTintColor}
                        onPress={() => this.setState({ selectedTab: 'tab1' })}>
                        {<PlanStatisticsSubViewContainer {...this.props}/>}
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tab2'}
                        title="问题"
                        renderIcon={() => <Image style={{width:24,height:24,}} source={require('../images/problem_icon.png')} />}
                        renderSelectedIcon={() => <Image style={{width:24,height:24,}} source={require('../images/problem_icon_click.png')} />}
                        selectedTitleStyle={styles.tabBarTintColor}
                        onPress={() => this.setState({ selectedTab: 'tab2' })}>
                        {<IssueStatisticsSubView {...this.props}/>}
                    </TabNavigator.Item>

                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tab3'}
                        title="见证"
                        renderIcon={() => <Image style={{width:24,height:24,}} source={require('../images/witness_icon.png')} />}
                        renderSelectedIcon={() => <Image style={{width:24,height:24,}} source={require('../images/witness_icon_click.png')} />}
                        selectedTitleStyle={styles.tabBarTintColor}
                        onPress={() => this.setState({ selectedTab: 'tab3' })}>
                        {<WitnessSubViewContainer {...this.props}/>}
                    </TabNavigator.Item>

                </TabNavigator>
            )

        } else if (Global.isGroup(Global.UserInfo)){
            return(
                <TabNavigator>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tab1'}
                        title="任务"
                        renderIcon={() => <Image style={{width:24,height:24,}} source={require('../images/task_icon.png')} />}
                        renderSelectedIcon={() => <Image style={{width:24,height:24,}} source={require('../images/task_icon_click.png')} />}
                        badgeText=""
                        selectedTitleStyle={styles.tabBarTintColor}
                        onPress={() => this.setState({ selectedTab: 'tab1' })}>
                        {<PlanStatisticsSubViewContainer {...this.props}/>}
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tab2'}
                        title="问题"
                        renderIcon={() => <Image style={{width:24,height:24,}} source={require('../images/problem_icon.png')} />}
                        renderSelectedIcon={() => <Image style={{width:24,height:24,}} source={require('../images/problem_icon_click.png')} />}
                        selectedTitleStyle={styles.tabBarTintColor}
                        onPress={() => this.setState({ selectedTab: 'tab2' })}>
                        {<IssueListViewContainer {...this.props}/>}
                    </TabNavigator.Item>

                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'tab3'}
                        title="见证"
                        renderIcon={() => <Image style={{width:24,height:24,}} source={require('../images/witness_icon.png')} />}
                        renderSelectedIcon={() => <Image style={{width:24,height:24,}} source={require('../images/witness_icon_click.png')} />}
                        selectedTitleStyle={styles.tabBarTintColor}
                        onPress={() => this.setState({ selectedTab: 'tab3' })}>
                        {<WitnessListViewContainer {...this.props}/>}
                    </TabNavigator.Item>

                </TabNavigator>
            )

        }else{

        return (
            <TabNavigator>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'tab1'}
                    title="任务"
                    renderIcon={() => <Image style={{width:24,height:24,}} source={require('../images/task_icon.png')} />}
                    renderSelectedIcon={() => <Image style={{width:24,height:24,}} source={require('../images/task_icon_click.png')} />}
                    badgeText=""
                    selectedTitleStyle={styles.tabBarTintColor}
                    onPress={() => this.setState({ selectedTab: 'tab1' })}>
                    {<PlanStatisticsView {...this.props}/>}
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'tab2'}
                    title="问题"
                    renderIcon={() => <Image style={{width:24,height:24,}} source={require('../images/problem_icon.png')} />}
                    renderSelectedIcon={() => <Image style={{width:24,height:24,}} source={require('../images/problem_icon_click.png')} />}
                    selectedTitleStyle={styles.tabBarTintColor}
                    onPress={() => this.setState({ selectedTab: 'tab2' })}>
                    {<IssueStatisticsView {...this.props}/>}
                </TabNavigator.Item>

                <TabNavigator.Item
                    selected={this.state.selectedTab === 'tab3'}
                    title="见证"
                    renderIcon={() => <Image style={{width:24,height:24,}} source={require('../images/witness_icon.png')} />}
                    renderSelectedIcon={() => <Image style={{width:24,height:24,}} source={require('../images/witness_icon_click.png')} />}
                    selectedTitleStyle={styles.tabBarTintColor}
                    onPress={() => this.setState({ selectedTab: 'tab3' })}>
                    {<WitnessStatisticsView {...this.props}/>}
                </TabNavigator.Item>

            </TabNavigator>
        )
            }

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

      color: '#f77935'
    },

});
