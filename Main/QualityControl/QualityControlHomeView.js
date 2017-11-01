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
import ProblemView from '../QualityControl/ProblemView'

import TabNavigator from 'react-native-tab-navigator';

export default class QualityControlHomeView extends Component
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
                            title="待处理"
                            renderIcon={() => <Image style={{width:24,height:24,}} source={require('../../images/task_icon.png')} />}
                            renderSelectedIcon={() => <Image style={{width:24,height:24,}} source={require('../../images/task_icon_click.png')} />}
                            badgeText=""
                            selectedTitleStyle={styles.tabBarTintColor}
                            onPress={() => this.setState({ selectedTab: 'tab1' })}>
                            {<ProblemView {...this.props}/>}
                        </TabNavigator.Item>
                        <TabNavigator.Item
                            selected={this.state.selectedTab === 'tab2'}
                            title="报告问题"
                            renderIcon={() => <Image style={{width:24,height:24,}} source={require('../../images/problem_icon.png')} />}
                            renderSelectedIcon={() => <Image style={{width:24,height:24,}} source={require('../../images/problem_icon_click.png')} />}
                            selectedTitleStyle={styles.tabBarTintColor}
                            onPress={() => this.setState({ selectedTab: 'tab2' })}>
                            {<ProblemView {...this.props}/>}
                        </TabNavigator.Item>



                    </TabNavigator>
                )
        }else{

            return(
                <ProblemView {...this.props}/>
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
