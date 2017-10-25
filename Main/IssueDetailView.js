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

import Global from '../common/globals.js'
import CommitButton from '../common/CommitButton'
import MemberSelectView from '../common/MemberSelectView'
const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var account = Object();

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
    quality: 1, // photos only
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
        var data = this.props.data
        data.rollingPlan = new Object()
        this.state = {
            title: '问题详情',
            data:data,
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
      if(this.props.data.status == 'pre' && Global.isMonitor(Global.UserInfo)){
        this.requestAssignUI(this.props.data.id);
      }else{
        this.requestFeedbackUI(this.props.data.id);
      }
    }

     onGetDataSuccess(response){
         console.log('onGetDataSuccess@@@@')
         if(this.isMonitorDelivery()){
            var membersArray = []
            if (response.responseResult.userList) {
              this.state.memberIds = response.responseResult.userList
              for (var i = 0; i < response.responseResult.userList.length; i++) {
                membersArray.push(response.responseResult.userList[i].realname)
              }
            }
            this.setState({
              data:response.responseResult,
              members:membersArray
            });
         }else{
            this.setState({
                data: response.responseResult,
              })
         }
     }

    requestAssignUI(id){
        console.log('executeNetWorkRequest:work id = ' + id);
        var paramBody = {
             questionId:id
             }

    HttpRequest.get('/question/assignUI', paramBody, this.onGetDataSuccess.bind(this),
        (e) => {

            try {
                var errorInfo = JSON.parse(e);
                if (errorInfo != null) {
                 console.log(errorInfo)
                } else {
                    console.log(e)
                }
            }
            catch(err)
            {
                console.log(err)
            }

            console.log('executeNetWorkRequest error:' + e)
        })
    }

    requestFeedbackUI(id){
         console.log('executeNetWorkRequest:work id = ' + id);
         var paramBody = {
             questionId:id
             }

    HttpRequest.get('/question/feedbackUI', paramBody, this.onGetDataSuccess.bind(this),
        (e) => {

            try {
                var errorInfo = JSON.parse(e);
                if (errorInfo != null) {
                 console.log(errorInfo)
                } else {
                    console.log(e)
                }
            }
            catch(err)
            {
                console.log(err)
            }

            console.log('executeNetWorkRequest error:' + e)
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
              leftPress={this.back.bind(this)}/>
            <ScrollView
              keyboardDismissMode='on-drag'
              keyboardShouldPersistTaps='never'>
                {this.renderTop()}
                {this.renderDetailView()}
            </ScrollView>
            {this.renderBottomButton()}
            <Spinner
                visible={this.state.loadingVisible}
            />
          </View>
        );
    }


startFeedbackProblem(){
  if(!this.state.content){
    alert('请输入问题反馈内容')
    return
  }
  if(this.state.fileArr.length<=1){
    alert('请选择至少一张反馈图片')
    return
  }
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
                    alert(e)
                }
                catch (err) {
                    console.log(err)
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

  HttpRequest.post('/question/answer',parma,this.onAnswerSuccess.bind(this),
                    (e) => {
                       try {
                          alert(e)
                        }catch (err) {
                          console.log(err)
                        }
                        this.setState({
                          loadingVisible: false
                                })
                    })
}

onAnswerSuccess(response){
      DeviceEventEmitter.emit('operate_issue','operate_issue');
      console.log('onCommitIssueSuccess:' + JSON.stringify(response))
      this.setState({
          loadingVisible: false
      })
      this.back();
}

onCommitIssueSuccess(response) {
      DeviceEventEmitter.emit('operate_issue','operate_issue');
      console.log('onCommitIssueSuccess:' + JSON.stringify(response))
      this.setState({
          loadingVisible: false
      })
      alert('问题反馈成功')
      this.back();
    }

startProblem(){
    if (!this.state.rolve_member) {
        alert('请选择问题解决人')
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
                console.log("error======"+err)
            }
                if (errorInfo != null) {
                    if (errorInfo.code == -1002||
                     errorInfo.code == -1001) {
                    alert(errorInfo.message);
                }else {
                    alert(e)
                }

                } else {
                    alert(e)
                }


            console.log('Login error:' + e)
        })

}

      onDeliverySuccess(response){
          this.setState({
              loadingVisible: false
          })
        DeviceEventEmitter.emit('operate_issue','operate_issue');
        this.back();
      }

      isMonitorDelivery(){
              if (Global.isMonitor(Global.UserInfo)) {
                if (this.state.data.status == 'pre') {
                  return true
                }
              }
              return false;
          }

      isSolverSubmit(){
            if(Global.isSolverMember(Global.UserInfo)){
              if(this.state.data.status == 'unsolved'){
                return true;
              }
            }
            return false;
          }

      isGroupUndo(){
            if(Global.isGroup(Global.UserInfo)){
              if(this.state.data.status == 'undo'){
                return true;
              }
            }
            return false;
          }

    renderBottomButton(){
            if (this.isMonitorDelivery()) {
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
                return(
                  <View style={{height:50,width:width,flexDirection:'row'}}>
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
                        onPress={() => this.answerSolution('unsolved')}
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
            }
    }

    renderTop(){
        if(this.isSolverSubmit()){
          return this.renderFeedbackUI();
        }else if(this.isMonitorDelivery()||Global.isSolverMember(Global.UserInfo)){
          return;
        }
        return this.renderHeader();
    }

    renderHeader(){
        var info = '未指派'
        //状态:pre待解决、undo待确认、unsolved仍未解决、solved已解决
        var color = '#777777'
        if (this.props.data.status!='pre' || (this.props.data.designee && this.props.data.designee.realname)) {
            info = this.props.data.designee.realname
            color = '#777777'
        }else{

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
          return '待指派';
        case 'undo':
          return '待确认';
        case 'unsolved':
          return '未解决';
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
                //   console.log('Response = ', response);
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                }
                else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                }
                else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
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
        if(this.state.data.status != 'pre' && this.state.data.status != 'unsolved' && this.state.data.feedback){
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
                  source = {{uri: item.path}} />
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
        this.state.data.feedback[0].files.map((item) => {imageUrls.push({url: item.path})});
      }else{
        this.state.data.files.map((item) => {imageUrls.push({url: item.path})});
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
         console.log('menu:work id = ' + menu.id);
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
                console.log(err)
            }
        }

    }

    onSelectedMember(member){
            this.state.rolve_member = member[0]
            this.setState({...this.state});
            console.log(JSON.stringify(member)+"member====");

        }

    renderMemberItem(displayItem){
        var displayMember = displayItem.content
        if (!displayItem.content) {
            displayMember = '选择问题解决人'
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
             pickerTitle={'选择人员'}
            onSelected={this.onSelectedMember.bind(this)} />
                                <Image
                                style={{width:20,height:20,}}
                                source={require('../images/unfold.png')}/>
            </TouchableOpacity>

            </View>)
    }

    renderItem() {
               // 数组
               var itemAry = [];
               // 颜色数组
               var problem_type = '技术问题'
               if (this.state.data.questionType == 'technicalMatters') {
                   problem_type = '技术问题'
               }else{
                   problem_type = '协调问题'
               }

          var displayAry = []
           if (this.isMonitorDelivery()) {
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
