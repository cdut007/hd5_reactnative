import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    TouchableNativeFeedback,
    TouchableHighlight,
    AsyncStorage,
    NativeModules,
    TextInput
} from 'react-native';
import Dimensions from 'Dimensions';
import NavBar from '../common/NavBar';
import px2dp from '../common/util';
import HttpRequest from '../HttpRequest/HttpRequest'
import JPushModule from 'jpush-react-native';
import LoginView from '../Login/LoginView'

import ChangePassword from './ChangePassword';

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var account = Object();
var Global = require('../common/globals');
var currentTime = 0;
var currentTimeCount = 0;
export default class MeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            env:"",
        };
    }

    componentWillMount(){
        var me = this
        AsyncStorage.getItem('k_login_info',function(errs,result)
        {
            Global.log('me page k_login_info:' + result)
            if (!errs && result && result.length)
            {
                var resultJSon = JSON.parse(result);
                me.setState({name: resultJSon.responseResult.realname})
            }
            else
            {

            }
        });

        AsyncStorage.getItem('k_domain_info',function(errs,result)
        {
            Global.log('me page k_domain_info:' + result)
            if (!errs && result && result.length)
            {
                var resultJSon = JSON.parse(result);
                me.setState({env: resultJSon.env})
            }
            else
            {

            }
        });
    }

    setting() {
        this.props.navigator.push({
            component: SettingView,
        })
    }
    onMineIssuePress(){

    }
    onMinePlanPress(){

    }
    onMineWitnessPress(){


    }

    _changepassword_function(){
        this.props.navigator.push({
            component: ChangePassword,
        })
    }

    _logout_function(){

      if (Platform.OS === 'android') {
              JPushModule.stopPush();
       }


        //logout here
        this._removeStorage();
        //logout success go 2 call page
        // var routes = this.props.navigator.state.routeStack;
        // for (var i = routes.length - 1; i >= 0; i--) {
        //     if(routes[i].name === "MyDestinationRoute"){
        //     var destinationRoute = this.props.navigator.getCurrentRoutes()[i]
        //     this.props.navigator.popToRoute(destinationRoute);
        //
        //     }
        // }
        this.props.navigator.resetTo({
            component: LoginView,
            name: 'LoginView',
            props: this.props
        })
    };
    async _removeStorage() {
        Global.UserInfo = null;
            AsyncStorage.removeItem('k_login_info').then((value) => {

            }
            ).done();

        }

        enableTester(){
            var nowTime = (new Date()).valueOf();
            if (nowTime - currentTime < 500) {
                if (currentTimeCount>=6) {
                    currentTimeCount = 0
                }
                currentTimeCount++
            }else{
                currentTimeCount = 0
            }
            currentTime = nowTime

            if (currentTimeCount == 6) {
                if (!Global.testerDebug) {
                    Global.testerDebug = true
                    Global.showAlert("打开调试模式")
                }else{
                    Global.testerDebug = false
                    Global.showAlert("关闭调试模式")
                }

            }
        }

    render() {
        var name = '';
        var first_name_char = '';
        var  dept='';
        if (Global.UserInfo.realname) {
            name = Global.UserInfo.realname;
            first_name_char = name.substring(0,1)
        }
        if (Global.UserInfo.department) {
            dept = Global.UserInfo.department.name;

        }
        if (Global.UserInfo.roles && Global.UserInfo.roles.length>0) {
            dept = dept +'['+Global.UserInfo.roles[0].name+']'
        }

        return (
            <View style={styles.container}>
            
            <View style={styles.headView}>
                    <TouchableOpacity activeOpacity={1} onPress={this.enableTester.bind(this)}
                    style={[styles.headView, { position: 'absolute', left: 0, right: 0, }]}>
                    <Image style={[styles.headView, { position: 'absolute', left: 0, right: 0, }]}
                           source={require('../images/me_bj.jpg')}
                    />
                    </TouchableOpacity>

                    <View style ={[styles.circle_outter,{marginTop:54,alignSelf: 'center',alignItems:'center',justifyContent:'center'}]}>
                    <View style ={[styles.circle,{marginLeft:2.5,position: 'absolute', left: 0, right: 0,alignSelf: 'center',backgroundColor:'#ffffff'}]}></View>
                        <Text style={{marginLeft:14,
                        position: 'absolute', left: 0, right: 0,
                        color:'#fbac2a',
                        alignSelf: 'center',
                        fontSize:30,}}>
                        {first_name_char}
                        </Text>
                    </View>

                    <Text style={{
                    color:'#ffffff',
                    alignSelf: 'center',
                    marginTop:4,
                    fontSize:18,}}>
                    {name}
                    </Text>

                    <Text style={{
                    color:'#ffffff',
                    alignSelf: 'center',
                    marginTop:4,
                    fontSize:18,}}>
                    {dept}
                    </Text>


                </View>


                <View style={{flex:1,marginTop: 60, alignItems: 'center' }}>
                <TouchableOpacity
                    style={[styles.loginButton,]}
                    onPress={this._changepassword_function.bind(this)}
                    ><Text style={styles.loginText}>修改密码</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.reportButton,]}
                    onPress={this._logout_function.bind(this)}
                    ><Text style={styles.loginText}>退出登录</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.reportButton}
                    onPress = {()=>{NativeModules.LogInterface.sendLogReport()}}>
                    <Text style={styles.loginText}>发送日志反馈</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.reportButton}
                    onPress = {()=>{NativeModules.LogInterface.checkUpgrade()}}>
                    <Text style={styles.loginText}>检查新版本</Text>
                </TouchableOpacity>


                <Text style={{fontSize: 18, color: '#000000aa',marginTop: 5}}>{'版本: ' + this.props.version} {this.state.env}</Text>
                </View>


            </View>
        )
    }



}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    headView: {
    height: 200,
    width: width,
    backgroundColor: '#ffffff',
    },
    circle:{
      borderWidth:1,
      borderColor : 'white',
      backgroundColor : '#00000000',
      padding: 0,
      borderRadius : 100,
      height:58,
      width:58,
      textAlign:'center',
      alignSelf:'center',

    },
    circle_outter:{
      borderWidth:4,
      borderColor : 'white',
      backgroundColor : '#00000000',
      borderRadius : 100,
      padding: 0,
      height:72,
      width:72,
      alignSelf:'center',

    },
    item: {
    width: width,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    height:50,
    justifyContent: 'center',
    alignItems: 'center',
},
    divider: {
    backgroundColor: '#8E8E8E',
    width: width,
    height: 0.5,
},
    centerLayout:{
      justifyContent:'center',
      alignItems:'center',
    },
    itemLayout:{
        backgroundColor:'#ffffff',
        justifyContent:'center',
        width:width,
        height:50,
        alignItems:'center',
    },


    loginText:
    {
        color: '#ffffff',
        fontSize: 24,
    },
    loginButton:
    {
        marginTop: 20,
        height: 50,
        width: width - 20,
        backgroundColor: '#fbac2a',
        borderRadius: 26,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reportButton:
    {
        marginTop: 10,
        height: 50,
        width: width - 20,
        backgroundColor: '#fbac2a',
        borderRadius: 26,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
       itemLine:{
           width: width,
           height: 1,
           backgroundColor: '#cccccc',
       },

});
