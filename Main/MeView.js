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
} from 'react-native';
import Dimensions from 'Dimensions';
import NavBar from '../common/NavBar';
import px2dp from '../common/util';
import HttpRequest from '../HttpRequest/HttpRequest'

import LoginView from '../Login/LoginView'

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var account = Object();
var Global = require('../common/globals');

export default class MeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
        };
    }

    componentWillMount(){
        var me = this
        AsyncStorage.getItem('k_login_info',function(errs,result)
        {
            console.log('me page k_login_info:' + result)
            if (!errs && result && result.length)
            {
                var resultJSon = JSON.parse(result);
                me.setState({name: resultJSon.responseResult.realname})
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

    _logout_function(){

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
            name: 'LoginView'
        })
    };
    async _removeStorage() {
        Global.UserInfo = null;
            AsyncStorage.removeItem('k_login_info').then((value) => {

            }
            ).done();

        }

    render() {
        var name = '';
        var first_name_char = '';
        if (Global.UserInfo.realname) {
            name = Global.UserInfo.realname;
            first_name_char = name.substring(0,1)
        }
        return (
            <View style={styles.container}>
            <View style={styles.headView}>
                    <Image style={[styles.headView, { position: 'absolute', left: 0, right: 0, }]}
                           source={require('../images/me_bj.jpg')}
                    />

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

                </View>

                <View style={styles.centerLayout}>
                        <Text style={styles.defaultText}>{Global.UserInfo.realnamename}</Text>
                </View>

                <View style={{flex:1,marginTop: 100, alignItems: 'center' }}>
                <TouchableOpacity
                    style={[styles.loginButton,]}
                    onPress={this._logout_function.bind(this)}
                    ><Text style={styles.loginText}>退出登录</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.reportButton}
                    onPress = {()=>{NativeModules.LogInterface.sendLogReport()}}>
                    <Text style={styles.loginText}>发送日志反馈</Text>
                </TouchableOpacity>
                <Text style={{fontSize: 18, color: '#000000aa',marginTop: 5}}>{'version: ' + this.props.version}</Text>
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
        marginTop: 50,
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
