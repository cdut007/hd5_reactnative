import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    AsyncStorage,
    Platform,
    Button,
    DeviceEventEmitter,
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
import DeviceInfo from 'react-native-device-info'

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


      if (Platform.OS === 'android') {
            JPushModule.notifyJSDidLoad((resultCode) => {
        	if (resultCode === 0) {}
        });

        JPushModule.addReceiveCustomMsgListener((map) => {
          this.setState({
            pushMsg: map.message
          });
    //         CONS_ASSIGN("施工分派"),
    // CONS_REASSIGN("施工改派"),
    // CONS_RELEASE("施工解派"),
    // WITNESS_LAUNCH("发起见证"),
    // WITNESS_ASSIGN("见证分派"),
    // WITNESS_QC2_ASSIGN("QC2见证分派"),
    // API_CALL("api调用"),
	// CONFERENCE("发起会议"),
	// NOTIFICATION("通知"),
	// QUESTION_CREATE("作业问题创建"),
	// QUESTION_ASSIGN("作业问题指派"),
	// QUESTION_FEEDBACK("作业问题回执"),
	// QUESTION_ANSWER("作业问题回答");


      if (map.extras) {
          try {
              var categoryInfo = JSON.parse(map.extras)
              console.log('category====='+categoryInfo.category)
              if (categoryInfo.category == 'CONFERENCE'||categoryInfo.category == 'NOTIFICATION') {
                  DeviceEventEmitter.emit('operate_meeting','operate_meeting');
              }else if (categoryInfo.category == 'CONS_ASSIGN'
              ||categoryInfo.category == 'CONS_RELEASE'
              ||categoryInfo.category == 'CONS_REASSIGN'
          ) {
                  DeviceEventEmitter.emit('plan_update','plan_update');
              }else if (categoryInfo.category == 'WITNESS_LAUNCH'||
                categoryInfo.category == 'WITNESS_ASSIGN'||
                categoryInfo.category == 'WITNESS_QC2_ASSIGN'
          ) {
                  DeviceEventEmitter.emit('witness_update','witness_update');
                  DeviceEventEmitter.emit('workstep_update','workstep_update');
              }else if (categoryInfo.category == 'QUESTION_CREATE'||
              categoryInfo.category == 'QUESTION_ASSIGN'||
              categoryInfo.category == 'QUESTION_FEEDBACK'||
              categoryInfo.category == 'QUESTION_ANSWER') {
                  DeviceEventEmitter.emit('new_issue','new_issue');
                  DeviceEventEmitter.emit('operate_issue','operate_issue');

              }
          } catch (e) {
               console.log('json parse error category====='+e)
          } finally {

          }


      }
          var currentDate = new Date()
          var count = parseInt(currentDate.getTime()/1000)
            JPushModule.sendLocalNotification(
                {
                    id:count,
                    buildId:1,
                    title:'中核移动施工',
                    content:''+map.message,
                    fireTime: currentDate.getTime() + 1000,
                    extra:{},
                }
            )
          Global.log("extras: " + map.extras +'; map.message='+ map.message);
        });
        JPushModule.addReceiveNotificationListener((map) => {
          Global.log("alertContent: " + map.alertContent);
          Global.log("extras: " + map.extras);
          // var extra = JSON.parse(map.extras);
          // Global.log(extra.key + ": " + extra.value);
        });
        JPushModule.addReceiveOpenNotificationListener((map) => {
          Global.log("Opening notification!");
          Global.log("map.extra: " + map.extras);
          //this.jumpSecondActivity();
          // JPushModule.jumpToPushActivity("SecondActivity");
        });
        JPushModule.addGetRegistrationIdListener((registrationId) => {
          Global.log("Device register succeed, registrationId " + registrationId);
        });

       }

       this.getConfigsFromServer()


    }


    onGetExtraAlermDataSuccess(response,paramBody){
             Global.log('onGetExtraAlermDataSucces@@@@')
             var result = response.responseResult;
             if (!result || result.length == 0) {
                 return
             }

             AsyncStorage.setItem('k_extra_alert_time', JSON.stringify(result), (error, result) => {
                 if (error) {
                     Global.log('save k_department_node faild.')
                 }
             });
         }

    getConfigsFromServer(){
        var me = this
        AsyncStorage.getItem('k_extra_alert_time',function(errs,result)
        {
            if (!errs && result && result.length)
            {
                Global.alertTimeArry = JSON.parse(result)
            }
            else
            {

            }
        });

        var paramBody = {
            }
        HttpRequest.get('/extra/conference_alarm', paramBody, this.onGetExtraAlermDataSuccess.bind(this),
            (e) => {


                try {
                    var errorInfo = JSON.parse(e);
                    if (errorInfo != null) {
                     Global.log(errorInfo)
                    } else {
                        Global.log(e)
                    }
                }
                catch(err)
                {
                    Global.log(err)
                }

                Global.log('Task error:' + e)
            })
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
                Global.log('UserInfo: ' + result)
                me.registerPush(Global.UserInfo.id)
            }
            else
            {
                me.setState({hasLogin: false})
            }
        });

        HttpRequest.initDomain();
    }

    registerPush(id){
        var uuid = DeviceInfo.getUniqueID().toUpperCase()
        var alias = uuid + "_" + id

        Global.registerPush(alias)
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
              initialRoute={{component: TabView, name: "MainPage", props:{version: this.props.version,navigation:this.props.navigation}}}

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
                initialRoute={{component: WelcomeView, name: "WelcomePage", index: this.props.index,props:{version: this.props.version,navigation:this.props.navigation}}}

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
