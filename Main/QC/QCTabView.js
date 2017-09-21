import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    BackAndroid
} from 'react-native';


import Global from '../../common/globals.js'
import QCWitnessStatisticsView from './QCWitnessStatisticsView.js'
import QCWitnessListDeliveryView from './QCWitnessListDeliveryView.js'
import QCWitnessListViewContainer from './QCWitnessListViewContainer.js'
import QCMyWitnessContainer from './QCMyWitnessContainer.js'


import TabNavigator from 'react-native-tab-navigator';

export default class QCTabView extends Component
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
        if (Global.isQCTeam(Global.UserInfo)) {
            return(
                    <TabNavigator>
                        <TabNavigator.Item
                            selected={this.state.selectedTab === 'tab1'}
                            title="见证分派"
                            renderIcon={() => <Image style={{width:24,height:24,}} source={require('../../images/task_icon.png')} />}
                            renderSelectedIcon={() => <Image style={{width:24,height:24,}} source={require('../../images/task_icon_click.png')} />}
                            badgeText=""
                            selectedTitleStyle={styles.tabBarTintColor}
                            onPress={() => this.setState({ selectedTab: 'tab1' })}>
                            {<QCWitnessListDeliveryView {...this.props}/>}
                        </TabNavigator.Item>
                        <TabNavigator.Item
                            selected={this.state.selectedTab === 'tab2'}
                            title="我的见证"
                            renderIcon={() => <Image style={{width:24,height:24,}} source={require('../../images/problem_icon.png')} />}
                            renderSelectedIcon={() => <Image style={{width:24,height:24,}} source={require('../../images/problem_icon_click.png')} />}
                            selectedTitleStyle={styles.tabBarTintColor}
                            onPress={() => this.setState({ selectedTab: 'tab2' })}>
                            {<QCWitnessStatisticsView {...this.props}/>}
                        </TabNavigator.Item>



                    </TabNavigator>
                )
        } else{
            //QC1
            return(
                    <TabNavigator>
                        <TabNavigator.Item
                            selected={this.state.selectedTab === 'tab1'}
                            title="待见证"
                            renderIcon={() => <Image style={{width:24,height:24,}} source={require('../../images/task_icon.png')} />}
                            renderSelectedIcon={() => <Image style={{width:24,height:24,}} source={require('../../images/task_icon_click.png')} />}
                            badgeText=""
                            selectedTitleStyle={styles.tabBarTintColor}
                            onPress={() => this.setState({ selectedTab: 'tab1' })}>
                            {<QCWitnessListViewContainer {...this.props}/>}
                        </TabNavigator.Item>
                        <TabNavigator.Item
                            selected={this.state.selectedTab === 'tab2'}
                            title="我的见证"
                            renderIcon={() => <Image style={{width:24,height:24,}} source={require('../../images/problem_icon.png')} />}
                            renderSelectedIcon={() => <Image style={{width:24,height:24,}} source={require('../../images/problem_icon_click.png')} />}
                            selectedTitleStyle={styles.tabBarTintColor}
                            onPress={() => this.setState({ selectedTab: 'tab2' })}>
                            {<QCMyWitnessContainer {...this.props}/>}
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
