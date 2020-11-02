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
import MemberSelectView from '../common/MemberSelectView'
import NavBar from '../common/NavBar'
import TabView from '../Main/TabView'
import CheckBox from 'react-native-checkbox'
import DeviceInfo from 'react-native-device-info'
import ImagePicker from 'react-native-image-picker'
import MD5 from "react-native-md5"
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

var ReportPbTypes =  {'K2/K3核电项目部':"1",'福清核电项目部':"2",'海阳核电项目部':"3","霞浦核电项目部":"4","三门核电项目部":"5","核电漳州项目部":'6'}

    var innerIpArr = {'K2/K3核电项目部':"http://10.7.1.6:9201",'福清核电项目部':"http://10.1.1.137:8008",'海阳核电项目部':"http://10.1.1.137:8048",'霞浦核电项目部':"http://10.1.1.137:8028",'三门核电项目部':"http://172.23.0.211:9201","核电漳州项目部":"http://10.1.1.137:8038"}
var outerIpArr = {'K2/K3核电项目部':"http://209.150.148.49:9201",'福清核电项目部':"http://hdapp.cnec5.com",'海阳核电项目部':"http://58.57.7.130:9201",'霞浦核电项目部':"http://xphdapp.cnec5.com",'三门核电项目部':"http://60.191.184.234:9201","核电漳州项目部":"http://fzhdapp.cnec5.com"}
// var innerIpArr = {'K2/K3核电项目部':"http://10.1.1.104:9201",'福清核电项目部':"http://10.2.1.54:9201",'海阳核电项目部':"http://192.168.201.20:9201"}
// var outerIpArr = {'K2/K3核电项目部':"http://116.236.114.61:9201",'福清核电项目部':"http://125.77.122.66:9201",'海阳核电项目部':"http://58.57.7.130:9201"}

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
        ProductData:{},
        currentProduct:'',
        currentProductTitle:'当前项目部',
        isInnerIP:false,
        isOuterNet:true,
        curPageUrl:''

    }

    getIpNum(ipAddress) {

        /*获取IP数*/
        var ip = ipAddress.split(".");
        var a = parseInt(ip[0]);
        var b = parseInt(ip[1]);
        var c = parseInt(ip[2]);
        var d = parseInt(ip[3]);
        var ipNum = a * 256 * 256 * 256 + b * 256 * 256 + c * 256 + d;
        return ipNum;
    }

    isInner(userIp,begin,end){
        return (userIp>=begin) && (userIp<=end);
    }
    /*判断是否是内网IP*/
     isInnerIPFn(){
       // 获取当前页面url
        var curPageUrl = '';
         DeviceInfo.getIPAddress().then(ip => {
             // "92.168.32.44"
             console.log('getIPAddress-0  '+  ip);
             this.state.curPageUrl = ip.toString();

             console.log('getIPAddress-1  '+ this.state.curPageUrl);
             this.state.curPageUrl = this.state.curPageUrl.split('.');//通过一点来划分数组
             console.log('getIPAddress-2  '+  JSON.stringify(this.state.curPageUrl));
             console.log(this.state.curPageUrl);


             var ipAddress = this.state.curPageUrl[0]+'.'+this.state.curPageUrl[1]+'.'+this.state.curPageUrl[2]+'.'+this.state.curPageUrl[3];

             this.state.isInnerIP = false;//默认给定IP不是内网IP
             var ipNum = this.getIpNum(ipAddress);
             /**
              * 私有IP：A类  10.0.0.0    -10.255.255.255
              *       B类  172.16.0.0  -172.31.255.255
              *       C类  192.168.0.0 -192.168.255.255
              *       D类   127.0.0.0   -127.255.255.255(环回地址)
              **/
             var aBegin = this.getIpNum("10.0.0.0");
             var aEnd = this.getIpNum("10.255.255.255");
             var bBegin = this.getIpNum("172.16.0.0");
             var bEnd = this.getIpNum("172.31.255.255");
             var cBegin = this.getIpNum("192.168.0.0");
             var cEnd = this.getIpNum("192.168.255.255");
             var dBegin = this.getIpNum("127.0.0.0");
             var dEnd = this.getIpNum("127.255.255.255");
             console.log('ipAddress:'+ipAddress);
             console.log('ipNum:'+ipNum);
             this.state.isInnerIP = this.isInner(ipNum,aBegin,aEnd) || this.isInner(ipNum,bBegin,bEnd) || this.isInner(ipNum,cBegin,cEnd) || this.isInner(ipNum,dBegin,dEnd);
             this.state.isOuterNet = !this.state.isInnerIP;
             console.log('是否是内网:'+this.state.isInnerIP);
             console.log('是否是外网:'+this.state.isOuterNet);
             this.getProductArr();



             
         });
        // console.log('curPageUrl-0  '+  JSON.stringify(curPageUrl));

        // var reg1 = /(http|ftp|https|www):\/\//g;//去掉前缀
        // curPageUrl =curPageUrl.replace(reg1,'');
        // // console.log('curPageUrl-1  '+curPageUrl);
        //
        // var reg2 = /\:+/g;//替换冒号为一点
        // curPageUrl =curPageUrl.replace(reg2,'.');
        // console.log('curPageUrl-2  '+curPageUrl);

        // return this.state.isInnerIP;
    }
    getProductArr(){
         this.state.ProductData = ReportPbTypes;

        var me = this;
        AsyncStorage.getItem('k_last_selectProduct',function(errs,result)
        {
            if (!errs && result && result.length)
            {
                // console.log('获取k_last_selectProduct:'+result);
                me.setState({
                    currentProduct: result,
                    currentProductTitle:result
                })
                if (me.state.isInnerIP){
                    me.setInnerIp();

                }else {
                    me.setOuterIp();
                }
            }
            else
            {
                // console.log('获取k_last_selectProduct:'+'当前项目部');
                me.setState({
                    currentProduct: '',
                    currentProductTitle:'当前项目部'
                })
                if (me.state.isInnerIP){
                    me.setInnerIp();

                }else {
                    me.setOuterIp();
                }
            }
        });
    }
    componentWillMount(){
            if (HttpRequest.isTestDel()){
                console.log('isTestDel1:'+HttpRequest.isTestDel());
            }else {
                this.isInnerIPFn();  //判断是否为内网
                console.log('isTestDel2:'+HttpRequest.isTestDel());
            }


    }
    componentDidMount() {


        var me = this;
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
    setInnerIp(){
        console.log('setInnerIp:'+this.state.isInnerIP);
        if (!this.state.currentProduct.length){
            console.log('setInnerIp1:'+this.state.isInnerIP);
        }else {
            console.log('setInnerIp2:'+this.state.isInnerIP);
            HttpRequest.setDomain(innerIpArr[this.state.currentProduct],'内网环境')
            // HttpRequest.setDomain('http://10.0.3.104:9201','内网环境')
            console.log('当前是内网:'+this.state.isInnerIP);
        }

    }
    setOuterIp(){
        console.log('setOuterIp:'+this.state.isOuterNet);
        if (!this.state.currentProduct.length){

        }else {
            HttpRequest.setDomain(outerIpArr[this.state.currentProduct],'外网环境')
            // HttpRequest.setDomain('http://39.108.165.171:8080','外网环境')

            console.log('当前是外网:'+this.state.isOuterNet);
        }

    }
    onGetProductData(){
        // this.setState({
        //     ProductData: ReportPbTypes
        // });

        var paramBody = {
            username:this.state.LoginId,
        }

        HttpRequest.post('/mineProject', paramBody, this.onGetProductDataSuccess.bind(this),
            (e) => {
                Global.log('onGetProductDataSuccess:2' + JSON.stringify(e))
                this.setState({
                    ProductData: {},
                    currentProductTitle:'该用户不存在',
                    currentProduct:''
                });
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

                Global.log('mineProject error:' + e)
            })
    }
    genId(){

        return  DeviceInfo.getUniqueID().toUpperCase();
  }


    onGetProductDataSuccess(response){

        var  responseData = response.responseResult;
        var  projectName =  responseData.projectName;
        var  appWwUrl = responseData.appWwUrl;
        var  productDic = {

        }
        if (!projectName.length){

        }else {
            productDic[projectName] = appWwUrl

            Global.log('onGetProductDataSuccess:1' + JSON.stringify(productDic))
            this.setState({
                ProductData: productDic,
                currentProductTitle:projectName,
                currentProduct:projectName
            });
        }



    }
    onLoginPress() {

        Global.log('LoginId:' + this.state.LoginId + '  password:' + this.state.passWord)
//         Global.alert('data:'+this.state.ProductData[this.state.currentProduct]);

    if (this.state.LoginId && this.state.LoginId.startWith('http:')) {
                        HttpRequest.setDomain(this.state.LoginId,'本地环境');
                        Global.isTestDel = true;
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


        // this.setState({
        //     loadingVisible: true
        // });

       var id = this.genId()
        var paramBody = {
                'username': this.state.LoginId,
                'password': MD5.hex_md5(this.state.passWord),
                'uuid': id
            }
        if (!this.state.LoginId.length || !this.state.passWord.length) {
            this.setState({
                loadingVisible: false
            });
            Global.alert('请输入用户名或密码')
        }
        else if(!this.state.currentProduct.length){

            if (HttpRequest.isTestDel()){
                HttpRequest.post('/authenticate2', paramBody, this.onLoginSuccess.bind(this),
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
            }else {
                this.setState({
                    loadingVisible: false
                });
                Global.alert('请选择所在项目部');
            }

        }
        else {
                // Global.alert('setDomainProductData:'+JSON.stringify(this.state.ProductData[this.state.currentProduct]))

                 var  httpStr = HttpRequest.getDomain();
                  // Global.alert('httpStr:'+httpStr)

                // HttpRequest.setDomain(httpStr,this.state.currentProduct);

                AsyncStorage.setItem('k_last_selectProduct',this.state.currentProduct, (error, result) => {
                    if (error) {
                        console.log('save k_last_selectProduct faild.')
                    }
                    console.log('k_last_selectProduct: ' + result)

                });

                HttpRequest.post('/authenticate2', paramBody, this.onLoginSuccess.bind(this),
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

        if(user.isUpdatePwd){
             Global.showAlert(''+user.updatePwdDesc)
        }

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

    _SelectProductView(name,title,datas,pickerTitle,refence){

        return(
            <View style={styles.topContainer}>
                <Text style={styles.title}> {name} </Text>
                {this.renderSelectProductView(title,datas,pickerTitle,refence)}
            </View>
        )

    }
    renderSelectProductView(title,datas,pickerTitle,refence){
        return(
            <View style={styles.statisticsflexContainer}>
                <TouchableOpacity onPress={() => refence.onPickClick()} style={styles.touchStyle}>
                    <MemberSelectView
                        ref={(c) => refence = c}
                        style={styles.textStyle}
                        title={title}
                        data={datas}
                        pickerTitle={pickerTitle}
                        onSelected={(data) => this.onSelectedProduct(data)}/>
                </TouchableOpacity>
            </View>
        )

    }
    onSelectedProduct(data){
        var  selectedProductStr = data[0];
        if (this.state.isInnerIP){
//             Global.alert(innerIpArr[data]);
            HttpRequest.setDomain(innerIpArr[selectedProductStr],selectedProductStr);

        }else {
//             Global.alert(outerIpArr[data]);
            HttpRequest.setDomain(outerIpArr[selectedProductStr],selectedProductStr);
        }
                this.setState({
                    currentProduct:selectedProductStr,
                    currentProductTitle:selectedProductStr
                })
        console.log('k_last_selectProduct:1 ' + selectedProductStr);



        // this.setState({machineType: data[0]})
    }

    renderCheckBox() {
        return (<View style={{flexDirection:'row',marginLeft: 30,marginRight: 30,marginTop:5,justifyContent: 'space-between'}}>
                <CheckBox
                    containerStyle={{}}
                    label='外网环境'
                    checkedImage={require('../images/choose_icon_click.png')}
                    uncheckedImage={require('../images/choose_icon.png')}
                    checked={this.state.isOuterNet == null ?  false:this.state.isOuterNet }
                    onChange={(checked) => {
                        Global.log(checked+'this.state.isOuterNet=='+this.state.isOuterNet)
                        var selected1 = !checked
                        if (selected1){
                            this.setOuterIp();
                        }else {
                            this.setInnerIp();
                        }
                                this.setState({
                                    isOuterNet:selected1,
                                    isInnerIP:checked

                                })




                    }
                    }
                />
            <CheckBox
                containerStyle={{}}
                label='内网环境'
                checkedImage={require('../images/choose_icon_click.png')}
                uncheckedImage={require('../images/choose_icon.png')}
                checked={this.state.isInnerIP == null ?  true:this.state.isInnerIP }
                onChange={(checked) => {
                    Global.log(checked+'this.state.isInnerIP2=='+this.state.isInnerIP)
                    var selected2 = !checked

                    if (selected2){

                        this.setInnerIp();
                    }else {
                        this.setOuterIp();
                    }
                        this.setState({
                            isOuterNet:checked,
                            isInnerIP:selected2,

                        })



                }
                }
            />
        </View>

        )
    }
    _onPassWordChange(text){
        // if (!text.length ){
        //
        // }else {
        // }

        this.setState({ passWord: text })
    }
    _onEndEditingLoginId(event){
        // Global.alert('_onEndEditingLoginId:'+event.nativeEvent.text)
        // this.onGetProductData()
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
                        value={this.state.LoginId}

                       underlineColorAndroid='transparent'
                        editable={true}
                        placeholderTextColor='#a4b4c4'
                        placeholder={'请输入用户名'}
                        onEndEditing={(event) => this._onEndEditingLoginId(event)}
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
                        placeholderTextColor='#a4b4c4'
                        underlineColorAndroid='transparent'

                        value={this.state.passWord}
                        editable={true}
                        secureTextEntry={true}
                        placeholder={'请输入密码'}

                        onChangeText={(text) => this._onPassWordChange(text)}>
                    </TextInput>

                    </View>
                    <View style={styles.LoginId}>
                    {this._SelectProductView('所在项目部：',this.state.currentProductTitle,Object.keys(this.state.ProductData),'请选择当前项目部',this.selectProduct)}
                    </View>
                    <View>
                        {this.renderCheckBox()}
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
        topContainer:{
            justifyContent:'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
            paddingRight:10,
            borderRadius: 26,
            backgroundColor:'#ffffff',

        },
        touchStyle: {
        alignItems:'center',
        flex:1,
        flexDirection:'row',
        paddingLeft:10,
        paddingRight:10,
        paddingTop:8,
        paddingBottom:8,
    },
        title: {
            width: width * 0.3,
            fontSize: 14,
            paddingLeft:10,

            color: "#0755a6"
        },
        textStyle: {
            color: '#0755a6',
            fontSize: 15,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
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
        statisticsflexContainer: {
            width: width*0.5,
            height: Platform.OS === 'android' ? 44 : 36,
            backgroundColor: '#f2f2f2',
            // backgroundColor: '#0755a6',
            flexDirection: 'row',
        },
        welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
},
    });
