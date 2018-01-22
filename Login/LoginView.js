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
import ImagePicker from 'react-native-image-picker'
var Global = require('../common/globals');

var width = Dimensions.get('window').width;

var height = Dimensions.get('window').height;

var index;

String.prototype.startWith=function(str){
  var reg=new RegExp("^"+str);
  return reg.test(this);
}

var options = {
    title: '选择身份', // specify null or empty string to remove the title
    cancelButtonTitle: '取消',
    customButtons: [],
    takePhotoButtonTitle: '', // specify null or empty string to remove this button
    chooseFromLibraryButtonTitle: '', // specify null or empty string to remove this button
    cameraType: 'back', // 'front' or 'back'
    mediaType: 'photo', // 'photo' or 'video'
    videoQuality: 'medium', // 'low', 'medium', or 'high'
    durationLimit: 10, // video recording max time in seconds
    maxWidth: 1920, // photos only
    maxHeight: 1920, // photos only
    aspectX: 2, // aspectX:aspectY, the cropping image's ratio of width to height
    aspectY: 1, // aspectX:aspectY, the cropping image's ratio of width to height
    quality: 0.5, // photos only
    angle: 0, // photos only
    allowsEditing: false, // Built in functionality to resize/reposition the image
    noData: true, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
    storageOptions: { // if this key is provided, the image will get saved in the documents/pictures directory (rather than a temporary directory)
        skipBackup: true, // image will NOT be backed up to icloud
        path: 'images' // will save image at /Documents/images rather than the root
    }
};


export default class LoginView extends Component {
    constructor(props) {
        super(props)
        index = this.props.index;
    }
    state =
    {
        LoginId: '',
        passWord: '',
        loadingVisible: false,
        isTimeout:false,
    }

    componentDidMount() {
        var me = this
        AsyncStorage.getItem('k_last_login_id',function(errs,result)
        {
            if (!errs && result && result.length)
            {
                me.setState({LoginId: result})
            }
            else
            {

            }
        });
    }

    genId(){
    return  DeviceInfo.getUniqueID().toUpperCase();
  }


    onLoginPress() {

        Global.log('LoginId:' + this.state.LoginId + '  password:' + this.state.passWord)


    if (this.state.LoginId && this.state.LoginId.startWith('http:')) {
                        HttpRequest.setDomain(this.state.LoginId,'本地环境')
                        Global.showToast('本地环境设置成功=='+this.state.LoginId)
                        return
        }

        if (this.state.LoginId && this.state.LoginId == 'test') {
                            HttpRequest.setDomain('http://39.108.165.171:8080','测试环境')
                            Global.showToast('测试环境设置成功')
                            return
            }

            if (this.state.LoginId && this.state.LoginId == 'product') {
                                HttpRequest.setDomain('http://116.236.114.61:9201','产品环境')
                                Global.showToast('产品环境设置成功')
                                return
                }


        this.setState({
            loadingVisible: true
        });

       var id = this.genId()
        var paramBody = {
                'username': this.state.LoginId,
                'password': this.state.passWord,
                'uuid': id
            }
        if (!this.state.LoginId.length || !this.state.passWord.length) {
            this.setState({
                loadingVisible: false
            });
            Global.alert('请输入用户名或密码')
        }
        else {


            HttpRequest.post('/authenticate', paramBody, this.onLoginSuccess.bind(this),
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
                            if (errorInfo.code == -1002||
							 errorInfo.code == -1001) {
							Global.alert("账号或密码错误");
						}else {
                            Global.alert(e)
						}

                        } else {
                            Global.alert(e)
                        }


                    Global.log('Login error:' + e)
                })
        }

        setTimeout(() => {//logout timeout  15s
            if (this.state.loadingVisible == true) {
                this.setState({
                    loadingVisible: false
                });
                Global.alert('登录超时，请稍候再试');
            }
        }, 1000 * 15);

    }

    onLoginSuccess(response,paramBody) {
        this.setState({
            loadingVisible: false
        });

        Global.log('Login success:' + JSON.stringify(response))
        // if (response.access_token.length) {
        //     AsyncStorage.setItem('k_http_token', response.access_token, (error, result) => {
        //         if (error) {
        //             Global.log('save http token faild.')
        //         }
        //
        //     });
        // }

        var user = response.responseResult;
        if (user.roles && user.roles.length>1) {
            //must choose one of role type.
            var rolesButtons = [];

            for (var i = 0; i < user.roles.length; i++) {
                var  roleBtn = {};
                  roleBtn.name = user.roles[i].name;
                  if (!roleBtn.name || roleBtn.name == '') {
                      roleBtn.name = 'unkonwn';
                  }
                  roleBtn.title = user.roles[i].name;
                rolesButtons.push(roleBtn);
            }

            options.customButtons = rolesButtons;
            ImagePicker.showImagePicker(options, (response) => {
                //   Global.log('Response = ', response);
                if (response.didCancel) {
                    Global.log('User cancelled  picker');
                }
                else if (response.error) {
                    Global.log('Picker Error: ', response.error);
                }
                else if (response.customButton) {
                    for (var i = 0; i < user.roles.length; i++) {
                          if (user.roles[i].name == response.customButton) {
                              var roles = [];
                              roles.push(user.roles[i]);
                              user.department = user.roles[i].department;
                              user.roles=roles;

                              break;
                          }
                    }
                    response.responseResult = user;
                    this.goMain(response,paramBody);
                    Global.log('User tapped custom button: '+ response.customButton);

                }
            });
            return;
        }

        this.goMain(response,paramBody);
    }
    goMain(response,paramBody){
        var me = this
        AsyncStorage.setItem('k_login_info', JSON.stringify(response), (error, result) => {
            if (error) {
                Global.log('save login info faild.')
            }
            me.setState({hasLogin: true})
            var infoJson = response;
            Global.UserInfo = infoJson.responseResult;
            Global.log('UserInfo: ' + result)

        });
        AsyncStorage.setItem('k_last_login_id', this.state.LoginId, (error, result) => {
            if (error) {
                Global.log('save login info faild.')
            }
        });


        var alias = paramBody.uuid + "_" + response.responseResult.id

        Global.registerPush(alias)

        //show main view
        this.props.navigator.resetTo({
            component: TabView,
            name: 'MainPage',
            props: {...this.props}
        })
    }


    render() {
        return (


            <View style={styles.rootcontainer}>

            <Image style={{position:'absolute',left:0,top:0,resizeMode:'stretch', alignItems:'center',
                            width:width,height:height,
                  justifyContent:'center',
                  flex:1}} source={require('../images/login_bj.jpg')}/>

                <ScrollView>
                    <Image source={require('../images/cni_logo.png')} style={styles.logo} />
                    <View style={styles.LoginId}>
                    <Image
                    style={styles.style_image}
                    source={require('../images/user_icon.png')}/>
                    <TextInput
                       style={{alignSelf: 'stretch',
                       fontSize: 18,flex:1,
                       textAlign: 'left',}}
                       autoFocus={true}
                       showsVerticalScrollIndicator={false}
                        underlineColorAndroid={'transparent'}
                        value={this.state.LoginId}
                        underlineColorAndroid='transparent'
                        editable={true}
                        placeholderTextColor='#a4b4c4'
                        placeholder={'请输入用户名'}
                        onChangeText={(text) => this.setState({ LoginId: text })}>
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
                        value={this.state.passWord}
                        editable={true}
                        secureTextEntry={true}
                        placeholder={'请输入密码'}
                        onChangeText={(text) => this.setState({ passWord: text })}>
                    </TextInput>

                    </View>

                    <TouchableOpacity onPress={this.onLoginPress.bind(this)}
                        style={styles.loginButton}>
                        <Text style={styles.loginText} >
                            登录
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
