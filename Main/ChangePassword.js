import React, { Component } from 'react';
import HttpRequest from '../HttpRequest/HttpRequest'
import {
    TextInput,
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    AsyncStorage,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Dimensions from 'Dimensions';
import Spinner from 'react-native-loading-spinner-overlay';
import NavBar from '../common/NavBar'
import TabView from '../Main/TabView'
import DeviceInfo from 'react-native-device-info'
import MD5 from "react-native-md5"
import ImagePicker from 'react-native-image-picker'
var Global = require('../common/globals');

var width = Dimensions.get('window').width;

var height = Dimensions.get('window').height;

var index;

String.prototype.startWith=function(str){
  var reg=new RegExp("^"+str);
  return reg.test(this);
}


export default class ChangePassword extends Component {
    constructor(props) {
        super(props)
        index = this.props.index;
    }
    state =
    {
        newPassword: '',
        passWord: '',
        loadingVisible: false,
        isTimeout:false,
    }

    componentDidMount() {
        var me = this

    }



    onPress() {

        Global.log('newPassword:' + this.state.newPassword + '  password:' + this.state.passWord)








        if (!this.state.newPassword.length || !this.state.passWord.length) {
            this.setState({
                loadingVisible: false
            });
            Global.alert('请输入密码')
        }
        else {

            if (this.state.newPassword.length < 4 || this.state.passWord.length<3) {

                Global.alert('密码长度不够')
                return
            }

            var myReg= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{4,16}$/
            if (!myReg.test(this.state.newPassword)) {
              Global.alert('密码范围16个字符以内，须满足至少1个大写字母，1个小写字母和1个数字')
                return
            }
            this.setState({
                loadingVisible: true
            });
            var paramBody = {
                    'newPassword': MD5.hex_md5(this.state.newPassword),
                    'password': MD5.hex_md5(this.state.passWord),

                }

            HttpRequest.post('/password2', paramBody, this.onSuccess.bind(this),
                (e) => {
                    this.setState({
                        loadingVisible: false
                    });
                    try {
                        var errorInfo = JSON.parse(e);
                    }
                    catch(err)
                    {
                        Global.log("error======"+err)
                    }
                        if (errorInfo != null) {
                            if (errorInfo.code == -1003) {
							Global.alert("旧密码错误");
						}else {
                            Global.alert(e)
						}

                        } else {
                            Global.alert(e)
                        }


                    Global.log('Login error:' + e)
                })
        }



    }

    onSuccess(response,paramBody) {
        this.setState({
            loadingVisible: false
        });

        Global.log('change success:' + JSON.stringify(response))
        Global.alert("修改成功");

        this.back();
    }


    back() {

        this.props.navigator.pop()
    }

    render() {
        return (


            <View style={styles.rootcontainer}>

            <NavBar
            title={'修改密码'}
            leftIcon={require('../images/back.png')}
            leftPress={this.back.bind(this)} />

                <ScrollView>

                    <View style={styles.LoginId}>
                    <Image
                    style={styles.style_image}
                    source={require('../images/password_icon.png')}/>
                    <TextInput
                       style={{alignSelf: 'stretch',
                       fontSize: 18,flex:1,
                       textAlign: 'left',}}
                       autoFocus={true}
                       showsVerticalScrollIndicator={false}
                        underlineColorAndroid={'transparent'}
                        value={this.state.passWord}
                        underlineColorAndroid='transparent'
                        editable={true}
                        placeholderTextColor='#a4b4c4'
                        placeholder={'请输入旧密码'}
                        onChangeText={(text) => this.setState({ passWord: text })}>
                    </TextInput>
                    </View>

                    <View style={styles.passWord}>

                    <Image
                    style={styles.style_image}
                    source={require('../images/password_icon.png')}/>

                    <TextInput
                        style={{alignSelf: 'stretch',
                        fontSize: 18,flex:1,
                        textAlign: 'left',}}
                         underlineColorAndroid={'transparent'}
                        placeholderTextColor='#a4b4c4'
                         underlineColorAndroid='transparent'
                        value={this.state.newPassword}
                        editable={true}
                        placeholder={'请输入4位以上新密码'}
                        onChangeText={(text) => this.setState({ newPassword: text })}>
                    </TextInput>

                    </View>

                    <TouchableOpacity onPress={this.onPress.bind(this)}
                        style={styles.loginButton}>
                        <Text style={styles.loginText} >
                            确定
                    </Text>
                    </TouchableOpacity>

                    <Spinner
                        visible={this.state.loadingVisible}
                    />

                </ScrollView>


            </View>
        )
    }
}

const styles = StyleSheet.create(
    {
        logo: {
            marginTop: 40,
            alignSelf: 'center',
            height: 186,
            width: 156,
            marginBottom:20,
            resizeMode: Image.resizeMode.contain,
        },
        container:
        {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        rootcontainer:
        {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: '#ebebeb',
        },
        style_image:{
           borderRadius:35,
           height:50,
           width:50,
           alignSelf:'center',
         },
        LoginId:
        {
            flexDirection:'row',
            alignSelf: 'stretch',
            margin: 10,
            height: 50,
            borderColor: '#0755a6',
            borderWidth: 1,
            borderRadius: 26,
            paddingLeft: 10,
            alignItems: 'center',
        },

        passWord:
        {
            flexDirection:'row',
            alignSelf: 'stretch',
            margin: 10,
            height: 50,
            borderColor: '#0755a6',
            borderWidth: 1,
            borderRadius: 26,
            paddingLeft: 10,
            alignItems: 'center',
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
            backgroundColor: '#0755a6',
            borderRadius: 26,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
},
    });
