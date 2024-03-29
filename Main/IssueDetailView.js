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
    ScrollView,
    AsyncStorage,
    TextInput,
    Modal,
    ImageBackground,
    DeviceEventEmitter,
} from 'react-native';
import Dimensions from 'Dimensions';
import NavBar from '../common/NavBar';
import px2dp from '../common/util';
import HttpRequest from '../HttpRequest/HttpRequest'
import DisplayItemView from '../common/DisplayItemView';
import EnterItemView from '../common/EnterItemView';
import CommonContentView from './CommonContentView';
import ImagePicker from 'react-native-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import Spinner from 'react-native-loading-spinner-overlay'
import dateformat from 'dateformat';
import Accordion from 'react-native-collapsible/Accordion';
import Picker from 'react-native-picker';

import Global from '../common/globals.js'
import CommitButton from '../common/CommitButton'
import MemberSelectView from '../common/MemberSelectView'
import IssueReject from './IssueReject'
const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var account = Object();

var delayDays = ['1天','2天','3天'];
const MAX_IMAGE_COUNT = 5;
var options = {
    title: '', // specify null or empty string to remove the title
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照', // specify null or empty string to remove this button
    chooseFromLibraryButtonTitle: '从相册选取', // specify null or empty string to remove this button
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

export default class IssueDetailView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '问题详情',
            data:this.props.data,
            rolve_member:null,
            members:[],
            memberIds:[],
            content: '',
            fileArr: [{}],
            modalVisible: false,
            bigImages: [],
            currentImageIndex: 0,
        };
    }


    componentDidMount() {
      this.setState({loadingVisible: true})
      this.requestFeedbackUI(this.props.data.id);
    }

    componentWillUnmount(){
      Picker.hide();
    }

     onGetDataSuccess(response){
        Global.log('onGetDataSuccess@@@@'+JSON.stringify(response));
            var membersArray = []
            if (response.responseResult.userList) {
              this.state.memberIds = response.responseResult.userList
              for (var i = 0; i < response.responseResult.userList.length; i++) {
                membersArray.push(response.responseResult.userList[i].realname)
              }
            }
            this.setState({
              loadingVisible: false,
              data:response.responseResult,
              members:membersArray
            });
        }

    delay(){
      Picker.init({
               pickerData: delayDays,
               pickerTitleText: '延时',
               pickerConfirmBtnText:'保存',
               pickerCancelBtnText:'取消',
               onPickerConfirm: data => {
                   this.timeDelay(data);
               },
               onPickerCancel: data => {
                   Global.log(data);
               },
               onPickerSelect: data => {
                   Global.log(data);
               }
        });
        Picker.show();
    }

    timeDelay(data){
        let hours = 24;
        if(data[0] == delayDays[0]){
          hours = 24;
        }else if(data[0] == delayDays[1]){
          hours = 48;
        }else{
          hours = 72;
        }
        this.setState({loadingVisible: true,})
        let paramBody = {
          questionId: this.state.data.id,
          designatedUserId: this.state.data.designee.id,
          delayHour: hours,
        }
        HttpRequest.post('/question/timeDelay', paramBody, this.onDelaySuccess.bind(this),
            (e) => {
                this.setState({loadingVisible: false,});
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
                Global.log('executeNetWorkRequest error:' + e)
            }
        )
    }

    onDelaySuccess(response){
        this.setState({loadingVisible: false,});
        Global.alert('延时成功');
        this.props.navigator.pop();
    }

    reassign(){
      if (this.state.members && this.state.members.length  > 0 ) {
            Picker.init({
               pickerData: this.state.members,
               pickerTitleText: '改派',
               pickerConfirmBtnText:'保存',
               pickerCancelBtnText:'取消',
               onPickerConfirm: data => {
                   this.setState({rolve_member: data[0]});
                   this.startProblem();
               },
               onPickerCancel: data => {
                   Global.log(data);
               },
               onPickerSelect: data => {
                   Global.log(data);
               }
           });
           Picker.show();
        }
    }

    requestFeedbackUI(id){
         Global.log('executeNetWorkRequest:work id = ' + id);
         var paramBody = {
             questionId:id
             }

    HttpRequest.get('/question/feedbackUI', paramBody, this.onGetDataSuccess.bind(this),
        (e) => {
            this.setState({loadingVisible: false})
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

            Global.log('executeNetWorkRequest error:' + e)
        })
    }


    componentWillMount(){

    }

    back() {
        this.props.navigator.pop()
    }

    render() {
        return (
          <View style={styles.container}>
            <Modal visible={this.state.modalVisible} transparent={true} onRequestClose={function(){}} animationType={'fade'}>
              <ImageViewer imageUrls={this.state.bigImages} onClick={()=>{this.setState({modalVisible: false})}} index={this.state.currentImageIndex} />
            </Modal>
            <NavBar title={this.state.title}
              leftIcon={require('../images/back.png')}
              leftPress={this.back.bind(this)}
              rightText={this.getRightText()}
              rightPress={() => this.props.navigator.replace({component:IssueDetailView,props:{data:this.props.data, directlySolve:true}})}/>
            <ScrollView
              keyboardDismissMode='on-drag'
              keyboardShouldPersistTaps='never'>
                {this.renderTop()}
                {this.renderReason()}
                {this.renderTechReason()}
                {this.renderDetailView()}
            </ScrollView>
            {this.renderBottomButton()}
            <Spinner visible={this.state.loadingVisible}/>
          </View>
        );
    }

    getRightText(){


     if(this.props.handle){
         return '直接处理';
     }


      if(this.props.directlySolve || Global.isSolverMember(Global.UserInfo) || Global.isGroup(Global.UserInfo)) return '';
      return (this.state.data.status == 'pre' && !this.state.data.designee.id) || this.state.data.status == 'unsolved'  ? '直接处理' : '';
    }

startFeedbackProblem(){
  if(!this.state.content){
    Global.alert('请输入问题反馈内容')
    return
  }
  // if(this.state.fileArr.length<=1){
  //   Global.alert('请选择至少一张反馈图片')
  //   return
  // }
  this.setState({loadingVisible: true,})
  var params = new FormData();
  params.append('questionId',this.props.data.id);
  params.append('describe',this.state.content);
  this.state.fileArr.map((item,i) =>{
    if(item['fileSource']){
      let file = {uri: item['fileSource'], type: 'multipart/form-data', name: item['fileName']};
      params.append('file',file);
    }
  });
  HttpRequest.uploadImage('/question/feedback', params, this.onCommitIssueSuccess.bind(this),
            (e) => {
                try {
                    Global.alert(e)
                }
                catch (err) {
                    Global.log(err)
                }

                this.setState({
                    loadingVisible: false
                })
            })
}

rejectSolution(reason){
  this.setState({loadingVisible: true,})
  let param = {
    questionId: this.state.data.id,
    answer: 'unsolved',
    reason: reason,
  }
  HttpRequest.post('/question/answer',param,this.onAnswerSuccess.bind(this),
                    (e) => {
                       try {
                          Global.alert(e)
                        }catch (err) {
                          Global.log(err)
                        }
                        this.setState({
                          loadingVisible: false
                        })
                    })
}

answerSolution(result){
    this.setState({
        loadingVisible: true
    })
  var parma = {
    questionId: this.state.data.id,
    answer: result,
  }
        // Global.alert('questionId:'+this.state.data.id);
  HttpRequest.post('/question/answer',parma,this.onAnswerSuccess.bind(this),
                    (e) => {
                       try {
                          Global.alert(e)
                        }catch (err) {
                          Global.log(err)
                        }
                        this.setState({
                          loadingVisible: false
                                })
                    })
}

onAnswerSuccess(response){
      DeviceEventEmitter.emit('operate_issue','operate_issue');
      Global.log('onCommitIssueSuccess:' + JSON.stringify(response))
      this.setState({
          loadingVisible: false
      })
      this.back();
}

onCommitIssueSuccess(response) {
      DeviceEventEmitter.emit('operate_issue','operate_issue');
      Global.log('onCommitIssueSuccess:' + JSON.stringify(response))
      this.setState({
          loadingVisible: false
      })
      Global.alert('问题反馈成功')
      this.back();
    }

startProblem(){
    if (!this.state.rolve_member) {
        if(Global.isMonitor(Global.UserInfo)){
          Global.alert('请选择队部协调工程师')
        }else if(Global.isCoordinator(Global.UserInfo)){
          Global.alert('请选择问题解决人')
        }
        return
    }
    var id = ''
    for (var i = 0; i < this.state.memberIds.length; i++) {
        if (this.state.memberIds[i].realname == this.state.rolve_member) {
            id = this.state.memberIds[i].id;
            break
        }
    }


    this.setState({
        loadingVisible: true
    })

    var paramBody = {
            'questionId':this.props.data.id,
            'designatedUserId': id,

        }

    HttpRequest.post('/question/assign', paramBody, this.onDeliverySuccess.bind(this),
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
                    Global.alert(errorInfo.message);
                }else {
                    Global.alert(e)
                }

                } else {
                    Global.alert(e)
                }


            Global.log('Login error:' + e)
        })

}

      onDeliverySuccess(response){
          this.setState({
              loadingVisible: false
          })
        DeviceEventEmitter.emit('operate_issue','operate_issue');
        this.back();
      }

      isLeaderPre(){
        if(this.props.directlySolve) return false;
        if(Global.isSolverLeader(Global.UserInfo)){
          if(this.state.data.status == 'pre'){
            return true;
          }
        }
      return false;
    }

    isLeaderUnsolved(){
      if(this.props.directlySolve) return false;
      if(Global.isSolverLeader(Global.UserInfo)){
        if(this.state.data.status == 'unsolved'){
          return true;
        }
      }
      return false;
    }

      isMonitorDelivery(){
        if(this.props.directlySolve) return false;
              if (Global.isMonitor(Global.UserInfo)) {
                if (this.state.data.status == 'pre' && !this.state.data.coordinate.id) {
                  return true
                }
              }
              return false;
          }

      isCoordinatorDelivery(){
        if(this.props.directlySolve) return false;
        if(Global.isCoordinator(Global.UserInfo)){
          if(this.state.data.status == 'pre' && !this.state.data.designee.id){
            return true;
          }
        }
        return false;
      }

      isSolverSubmit(){
        if(this.props.directlySolve) return true;
            if(Global.isSolverMember(Global.UserInfo)){
              if(this.state.data.status == 'pre'){
                return true;
              }
            }
            if(this.props.directlySolve){
              return true;
            }
            return false;
          }

      isGroupUndo(){
        if(this.props.directlySolve) return false;
            if(Global.isGroup(Global.UserInfo)){
              if(this.state.data.status == 'undo'){
                return true;
              }
            }
            return false;
          }

    renderBottomButton(){
            if (this.isMonitorDelivery() || this.isCoordinatorDelivery()) {
                return(
                  <View style={{height:50,width:width,flexDirection:'row'}}>
                    <View style={{height:50,flex:1}}>
                      <CommitButton
                        title={'提交'}
                        onPress={this.startProblem.bind(this)} />
                    </View>
                  </View>
                );
            }else if (this.isSolverSubmit()) {
                if(this.props.directlySolve){
                  return(
                    <View style={{height:50,width:width,flexDirection:'row'}}>
                      <View style={{height:50,flex:1}}>
                        <CommitButton
                          title={'提交'}
                          onPress={this.startFeedbackProblem.bind(this)} />
                      </View>
                    </View>
                  );
                }
                return(
                  <View style={{height:50,width:width,flexDirection:'row'}}>
                    <View style={{height:50,flex:1}}>
                      <CommitButton
                        title={'不能解决'}
                        onPress={() => this.props.navigator.push({component:IssueReject, props:{title:'不能解决',placeholder:'请输入不能解决原因',buttonTitle:'提交至上级',callback:(message) => this.canNotDo(message)}})}
                        containerStyle={{backgroundColor:'#ffffff'}}
                        titleStyle={{color: '#f77935'}} />
                    </View>
                    <View style={{height:50,flex:1}}>
                      <CommitButton
                        title={'提交'}
                        onPress={this.startFeedbackProblem.bind(this)} />
                    </View>
                  </View>
                );
            }else if(this.isGroupUndo()){
               return(
                  <View style={{height:50,width:width,flexDirection:'row'}}>
                    <View style={{height:50,flex:1}}>
                      <CommitButton
                        title={'不接受反馈'}
                        //onPress={() => this.props.navigator.push({component:IssueReject, props:{title:'退回理由',placeholder:'请输入退回理由',buttonTitle:'确认退回',callback:(message) => this.rejectSolution(message)}})}
                          onPress={() => this.props.navigator.push({component:IssueReject, props:{title:'退回理由',placeholder:'请输入退回理由',buttonTitle:'确认退回',questionId:this.state.data.id}})}
                        containerStyle={{backgroundColor:'#ffffff'}}
                        titleStyle={{color: '#f77935'}} />
                    </View>
                    <View style={{height:50,flex:1}}>
                      <CommitButton
                        title={'接受反馈'}
                        onPress={() => this.answerSolution('solved')} />
                    </View>
                  </View>
                );
            }else if(this.isLeaderPre()){
              return(
                  <View style={{height:50,width:width,flexDirection:'row'}}>
                    <View style={{height:50,flex:1}}>
                      <CommitButton
                        title={'延时'}
                        onPress={() => this.delay()}
                        containerStyle={{backgroundColor:'#ffffff'}}
                        titleStyle={{color: '#f77935'}} />
                    </View>
                    <View style={{height:50,flex:1}}>
                      <CommitButton
                        title={'改派'}
                        onPress={() => this.reassign()} />
                    </View>
                  </View>
                );
            }else if (this.isLeaderUnsolved()) {
                return(
                  <View style={{height:50,width:width,flexDirection:'row'}}>
                  <View style={{height:50,flex:1}}>
                    <CommitButton
                      title={'不能解决'}
                      onPress={() => this.props.navigator.push({component:IssueReject, props:{title:'不能解决',placeholder:'请输入不能解决原因',buttonTitle:'提交至上级',callback:(message) => this.canNotDo(message)}})}
                      containerStyle={{backgroundColor:'#ffffff'}}
                      titleStyle={{color: '#f77935'}} />
                  </View>
                    <View style={{height:50,flex:1}}>
                      <CommitButton
                        title={'改派'}
                        onPress={() => this.reassign()} />
                    </View>
                  </View>
                );
            }
    }

    canNotDo(message){
      const params = {
        questionId: this.state.data.id,
        reason: message
      }
      HttpRequest.post(
        '/question/unable',
        params,
        (reponse) => {
          DeviceEventEmitter.emit('operate_issue','operate_issue');
          this.back();
        },
        (error) => {
          HttpRequest.printError(error);
        }
      );
    }

    renderTop(){
        if(this.isSolverSubmit()){
          return this.renderFeedbackUI();
        }else if(this.isMonitorDelivery() || Global.isSolverMember(Global.UserInfo) || this.isCoordinatorDelivery()){
          return;
        }
        return this.renderHeader();
    }

            renderReason(){
                    var teamAnswerFiles = []
              if(this.state.data.reason && this.state.data.status == 'unsolved'){
                  if (this.state.data.teamAnswer){
                      teamAnswerFile = this.state.data.teamAnswer[0].files;
                      Global.log(JSON.stringify('renderReason1:'+this.state.data.teamAnswer))
                      return(
                          <View style={{backgroundColor: 'white', paddingTop: 10, paddingRight: 6,}}>
                              <Text style={{color: '#e82628', fontSize: 14, lineHeight: 22, marginLeft: 10, marginBottom: 10}}>
                                  <Text style={{fontWeight: 'bold'}}>退回理由: </Text>
                                  <Text>{this.state.data.reason}</Text>
                              </Text>
                              <ScrollView horizontal={true} style={{marginTop: 10, marginBottom: 10,}}>
                                  {this.renderNetImages(teamAnswerFile, true)}
                              </ScrollView>
                              <View style={styles.divider} />
                          </View>
                      );
                  }else {
                      Global.log(JSON.stringify('renderReason2:'+this.state.data.teamAnswer))
                      return(
                          <View style={{backgroundColor: 'white', paddingTop: 10, paddingRight: 6,}}>
                              <Text style={{color: '#e82628', fontSize: 14, lineHeight: 22, marginLeft: 10, marginBottom: 10}}>
                                  <Text style={{fontWeight: 'bold'}}>退回理由: </Text>
                                  <Text>{this.state.data.reason}</Text>
                              </Text>
                              <View style={styles.divider} />
                          </View>
                      );
                  }

              }
            }

    renderTechReason(){
      if(this.state.data.unableReason && this.state.data.status == 'unsolved'){
        return(
          <View style={{backgroundColor: 'white', paddingTop: 10, paddingRight: 6,}}>
              <Text style={{color: '#e82628', fontSize: 14, lineHeight: 22, marginLeft: 10, marginBottom: 10}}>
                <Text style={{fontWeight: 'bold'}}>不能解决理由: </Text>
                 <Text>{this.state.data.unableReason}</Text>
              </Text>
              <View style={styles.divider} />
          </View>
        );
      }
    }

    renderHeader(){
        var info = '未指派'
        //状态:pre待解决、undo待确认、unsolved仍未解决、solved已解决
        var color = '#777777'
        if ((this.props.data.coordinate && this.props.data.coordinate.realname)) {
            info = this.props.data.coordinate.realname
            color = '#777777'
        }
        if (this.props.data.status!='pre' || (this.props.data.designee && this.props.data.designee.realname)) {
            info = this.props.data.designee.realname
            color = '#777777'
        }
        return(
            <View style={{flexDirection: 'column', backgroundColor: 'white'}}>
              <View style={styles.statisticsflexContainer}>
                <View style={styles.cell}>
                  <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:4,}}>
                    提问时间
                  </Text>
                  <Text numberOfLines={1} style={{color:'#777777',fontSize:14,}}>
                    {this.props.data.questionTime}
                  </Text>
                </View>
                <View style={styles.cell}>
                  <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:4,}}>
                    指派给
                  </Text>
                  <Text style={{color:color,fontSize:14,}}>
                    {info}
                  </Text>
                </View>
                <View style={styles.cell}>
                  <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:4,}}>
                    当前状态
                  </Text>
                  <Text style={{color:'#e82628',fontSize:14,}}>
                    {this.getStatusText()}
                  </Text>
                </View>
              </View>
              <View style={styles.divider} />
            </View>
        );
    }

    getStatusText(){
       let status = this.state.data.status;
       switch(status){
        case 'pre':
          return this.state.data.coordinate.id ? '待解决' : '待指派';
        case 'undo':
          return '待确认';
        case 'unsolved':
          return this.state.data.timeout ? '超时未解决' : '未解决';
        case 'solved':
          return '已解决';
        default:
          return '未解决';
       }
    }

    renderFeedbackUI(){
      return(
          <View style={{width: width, backgroundColor: 'white', flexDirection: 'column', paddingTop: 10,}}>
            <View style={{width: width, height: 85, marginLeft: 10}}>
              <Text style={{color: '#e82628', fontSize: 14}}>问题反馈: </Text>
              <TextInput
                style={{flex: 1, fontSize: 14, color: '#1c1c1c', textAlignVertical: 'top', height: 60}}
                underlineColorAndroid ='transparent'
                maxLength = {150}
                multiline = {true}
                onChangeText={(text) => this.setState({ content: text })}
                value={this.state.content} />
            </View>
            {this.renderFileView()}
            <View style={styles.divider} />
          </View>
        );
    }

    renderFileView() {
        return (
            <View style={{flexDirection: 'row', flexWrap: 'wrap', width: width, paddingTop: 10, paddingRight: 10}} horizontal={true} >
                    {this.renderImages()}
            </View>
        );
    }

    renderImages(){
        var imageViews = [];
        {this.state.fileArr.map((item,i) => {
                imageViews.push(
                    <TouchableOpacity
                     key={'local' + i}
                     onPress = {() => this.onSelectFile(i) }
                     onLongPress = { () => this.onDeleteFile(i) }
                     style={{width: 70, height: 70, marginLeft: 10, marginBottom: 10,}}>
                        {
                            item['fileSource']
                             ?
                            (<Image resizeMode={'cover'} style={{ width: 70, height: 70, borderRadius: 4, borderWidth: 0.5}} source={{uri: item['fileSource']}} />)
                             :
                            (<Image resizeMode={'cover'} style={{ width: 70, height: 70, borderRadius: 4, borderWidth: 0.5}} source={require('../images/add_pic_icon.png')} />)
                        }
                    </TouchableOpacity>
                );
        })}
        if(this.state.fileArr[this.state.fileArr.length-1]['fileSource'] && this.state.fileArr.length < MAX_IMAGE_COUNT){
                this.state.fileArr.push({});
            }
        return imageViews;
    }

    onSelectFile(idx) {
        this.currentFileIdx = idx

        let showPicker = () => {
            ImagePicker.showImagePicker(options, (response) => {
                //   Global.log('Response = ', response);
                if (response.didCancel) {
                    Global.log('User cancelled image picker');
                }
                else if (response.error) {
                    Global.log('ImagePicker Error: ', response.error);
                }
                else if (response.customButton) {
                    Global.log('User tapped custom button: ', response.customButton);
                }
                else {
                    // You can display the image using either data:
                    // const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
                    var source;
                    if (Platform.OS === 'android') {
                         source = {uri: response.uri, isStatic: true};
                     } else {
                        source = {
                           uri: response.uri.replace('file://', ''),
                           isStatic: true
                        };
                    }

                   var fileInfo = this.state.fileArr[this.currentFileIdx]
                   fileInfo['fileSource'] = source.uri
                    fileInfo['fileName'] = response.fileName

                    if(this.state.fileArr.length<MAX_IMAGE_COUNT && this.state.fileArr[this.state.fileArr.length-1]['fileSource']){
                        this.state.fileArr.push({});
                    }
                    this.setState({
                        ...this.state
                    });
                }
            });
        }


        showPicker()
    }

    onDeleteFile(idx) {
        if(this.state.fileArr[idx]['fileSource']){
            this.state.fileArr.splice(idx, 1)
            this.setState({
                ...this.state
            })
        }
    }

    renderDetailView(){
        return(
          <View style={styles.mainStyle}>
              {this.renderFeedbackDetail()}
              {this.renderIssueDetail()}
              {this.renderItem()}
          </View>
        );
    }

    renderFeedbackDetail(){
        if(this.state.data.status != 'pre' && this.state.data.feedback){
          return(
            <View style={{backgroundColor: 'white', paddingTop: 10, paddingRight: 6,}}>
              <Text style={{color: '#e82628', fontSize: 14, lineHeight: 22, marginLeft: 10,}}>
                <Text style={{fontWeight: 'bold'}}>问题反馈: </Text>
                 <Text>{this.state.data.feedback[0].describe}</Text>
              </Text>
              <ScrollView horizontal={true} style={{marginTop: 10, marginBottom: 10,}}>
                {this.renderNetImages(this.state.data.feedback[0].files, true)}
              </ScrollView>
              <View style={styles.divider} />
            </View>
         );
        }
    }

    renderIssueDetail(){
      return(
            <View style={{backgroundColor: 'white', paddingTop: 10, paddingRight: 6,}}>
              <Text style={{color: '#0755a6', fontSize: 14, lineHeight: 22, marginLeft: 10,}}>
                <Text style={{fontWeight: 'bold'}}>问题描述: </Text>
                <Text>{this.state.data.describe}</Text>
              </Text>
              <ScrollView horizontal={true} style={{marginTop: 10, marginBottom: 10,}}>
                {this.renderNetImages(this.state.data.files, false)}
              </ScrollView>
            </View>
          );
    }

    renderNetImages(files,isFeedback){
      var images = [];
      if(files){
        files.map((item, i) => {
          images.push(
            <TouchableOpacity key={'net' + i} onPress={() => this.viewBigImages(isFeedback, i)}>
              <ImageBackground style={{width: 70, height: 70, marginLeft: 10}} source={require('../images/temporary_img.png')}>
                <Image
                  style = {{width: 70, height: 70, borderRadius: 4, resizeMode: 'cover'}}
                  source = {{uri: HttpRequest.getDomain() + item.path}} />
              </ImageBackground>
            </TouchableOpacity>

          );
        });
      }
      return images;
    }

    viewBigImages(isFeedback, index){
      var imageUrls = [];
      if(isFeedback){
        this.state.data.feedback[0].files.map((item) => {imageUrls.push({url:  HttpRequest.getDomain() + item.path})});
      }else{
        this.state.data.files.map((item) => {imageUrls.push({url:  HttpRequest.getDomain() + item.path})});
      }
      this.setState({modalVisible: true, bigImages: imageUrls, currentImageIndex: index})
    }

    getQCCheckStatus(sign){
        if (sign == 0) {
			return "未确认";
		}else if (sign == 1) {
			return "确认";
		}else if (sign == 2) {
			return "退回";
		}
        return '';
    }

    go2WorkStepDetail(){

    }

    go2ZhijiaUpdate(){

    }



    issueDetail(){
        // this.props.navigator.push({
        //     component: PlanIssueListView,
        //      props: {
        //
        //          data:this.state.data,
        //         }
        // })
    }



    onItemClick(menu){
         Global.log('menu:work id = ' + menu.id);
        if (menu.id == '9') {

        } if (menu.id == 'c') {
            this.setState({displayMore:!this.state.displayMore});
        } else if (menu.id == '10') {
        } else if (menu.id == '-1') {
        } else if (menu.id == 'e9') {
        } else {
            try {
                var  index = parseInt(menu.id);
                if (index >=11 && index<= 15) {
                    this.go2ItemDetail(menu);
                }
            }
            catch(err)
            {
                Global.log(err)
            }
        }

    }

    onSelectedMember(member){
            this.state.rolve_member = member[0]
            this.setState({...this.state});
            Global.log(JSON.stringify(member)+"member====");

        }

    renderMemberItem(displayItem){
        var displayMember = displayItem.content
        if (!displayItem.content) {
            if (Global.isCoordinator(Global.UserInfo)){
              displayMember = '选择问题解决人'
            }else {
              displayMember = '选择队部协调工程师'
            }
        }
        return(<View style={[styles.cell,{alignItems:'center',padding:10,backgroundColor:'#f2f2f2'}]}>

            <TouchableOpacity onPress={() => this._selectM.onPickClick()} style={{borderWidth:0.5,
                  alignItems:'center',
                  borderColor : '#f77935',
                  backgroundColor : 'white',
                  borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:10,paddingRight:10,paddingTop:8,paddingBottom:8}}>

            <MemberSelectView
            ref={(c) => this._selectM = c}
            style={{color:'#f77935',fontSize:14,flex:1}}
            title={displayMember}
            data={this.state.members}
             pickerTitle={displayMember}
            onSelected={this.onSelectedMember.bind(this)} />
                                <Image
                                style={{width:20,height:20,}}
                                source={require('../images/unfold.png')}/>
            </TouchableOpacity>

            </View>)
    }


    onEnterClick(tag){
        this.props.navigator.push({
            component: CommonContentView,
             props: {
                 content:tag.reason,
                 title:tag.realname,
                }
        })

    }


      createEnter(label,desc,tag){
          var textColor = '#777777'

          return(
              <TouchableOpacity style={styles.statisticsflexContainer} onPress={this.onEnterClick.bind(this,tag)}>

              <View style={{alignSelf:'center',flex:1,paddingLeft:10,flexDirection:'row'}}>


                <Text numberOfLines={1} style={{color:'#444444',fontSize:14,}}>
                  {label}
                </Text>
              </View>
              <Text numberOfLines={1} style={{alignSelf:'center',flex:1.6,paddingRight:10,color:textColor,fontSize:12,}}>
                {Global.formatFullDateDisplay(tag.createTime) +'   '+desc}
              </Text>

              <Image style={{alignSelf:'center',marginRight:10}} source={require('../images/detailsIcon.png')}></Image>

              </TouchableOpacity>
          )
      }


    renderItem() {
               // 数组
               var itemAry = [];
               // 颜色数组
               var problem_type = '技术问题'
               if (this.state.data.questionType == 'technicalMatters') {
                   problem_type = '技术问题'
               }else if(this.state.data.questionType == 'coordinationProblem'){
                   problem_type = '协调问题'
               }else {
                   problem_type = '物项问题'
               }

          var displayAry = []
           if (this.isMonitorDelivery() || this.isCoordinatorDelivery()) {
              displayAry.push({title:'选择问题解决人',content:this.state.rolve_member,id:'c7',type:'problem_member'})
              displayAry.push({title:'提问时间',content:this.state.data.questionTime,id:'c9'})
           }else{
              displayAry.push({type: 'devider'});
           }

           if (Global.isSolverMember(Global.UserInfo)) {
               displayAry.push({title:'提问时间',content:this.state.data.questionTime,id:'c9'})
           }


                displayAry.push({title:'问题类型',content:problem_type,id:'a3', noLine: true})
                displayAry.push({type:'devider'},);
                displayAry.push( {title:'作业条目编号',content:this.state.data.rollingPlan.workListNo,id:'0'})
                displayAry.push( {title:'点数',content:this.state.data.rollingPlan.points,id:'1'})
                displayAry.push({title:'机组号',content:this.state.data.rollingPlan.unitNo,id:'2'})
                displayAry.push( {title:'质量计划号',content:this.state.data.rollingPlan.qualityplanno,id:'3'})
                displayAry.push({title:'图纸号',content:this.state.data.rollingPlan.drawingNo,id:'5'},);
                displayAry.push({title:'房间号',content:this.state.data.rollingPlan.roomNo,id:'b1'},);
                displayAry.push({title:'工程量编号',content:this.state.data.rollingPlan.projectNo,id:'b2'},);
                displayAry.push({title:'工程量类别',content:this.state.data.rollingPlan.projectType,id:'b3'},);
                displayAry.push({title:'焊口／支架',content:this.state.data.rollingPlan.weldno,id:'b4', noLine: true},);
                displayAry.push({type:'devider'},);
                if(this.state.data.createUser){
                        displayAry.push({title:'提问者',content:this.state.data.createUser.realname,id:'x1'})
                }

                displayAry.push({type:'devider'},);


               // 遍历
               for (var i = 0; i<displayAry.length; i++) {
                   if (displayAry[i].type == 'problem_member') {
                       itemAry.push(
                          this.renderMemberItem(displayAry[i])
                       );
                   } else if (displayAry[i].type == 'devider') {
                       itemAry.push(
                          <View key={i} style={styles.divider} />
                       );
                   } else{
                       itemAry.push(
                           <DisplayItemView
                            key={i}
                            title={displayAry[i].title}
                            detail={displayAry[i].content?displayAry[i].content+'':''}
                            noLine={displayAry[i].noLine}
                           />
                       );
                   }
               }




               if(this.state.data.opList){
                   for (var i = 0; i < this.state.data.opList.length; i++) {
                       var tag = this.state.data.opList[i];
                       itemAry.push(this.createEnter(tag.realname,tag.statusName,tag));
                       itemAry.push(
                          <View style={styles.divider} />
                       );
                   }
               }
               return itemAry;
           }


}


const styles = StyleSheet.create({
    container: {
        flex:1,
        width:width,
        height:height,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    divider: {
    backgroundColor: '#f2f2f2',
    width: width,
    height: 10,
},
    mainStyle: {
        width: width,
        flex:1,
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


    defaultText:{
            color: '#000000',
            fontSize:16,
            justifyContent: "center",
            alignItems: 'center',
    },
       statisticsflexContainer: {
                height: 60,
                backgroundColor: '#ffffff',
                flexDirection: 'row',
            },

      cell: {
          flex: 1,
          height: 60,
          justifyContent: "center",
          alignItems: 'center',
           flexDirection: 'column',
      },

      cellLine: {
          width: 2,
          height: 14,
          backgroundColor: '#cccccc',
      },

});
