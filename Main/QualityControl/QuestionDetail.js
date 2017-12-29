import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Navigator,
    BackAndroid,
    ListView,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Platform,
    Alert,
    DeviceEventEmitter,
    KeyboardAvoidingView,
} from 'react-native';

import Dimensions from 'Dimensions';
import NavBar from '../../common/NavBar'
import DisplayItemView from '../../common/DisplayItemView'
import ImageShowsUtil from '../../common/ImageShowUtil'
import CommitButton from '../../common/CommitButton'
import ImagePicker from 'react-native-image-picker'
import Global from '../../common/globals'
import DateTimePickerView from '../../common/DateTimePickerView'
import dateformat from 'dateformat'
import HttpRequest from '../../HttpRequest/HttpRequest'
import Spinner from 'react-native-loading-spinner-overlay'
import MemberSelectView from '../../common/MemberSelectView'
import CloseProblem from '../QualityControl/CloseProblem'

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

var teams = [];
var problemFiles = [];
var solveFiles = [];
var solveAgainFiles = [];
var assinList = [];


var width = Dimensions.get('window').width;
var historyData = new FormData()


export default class QuestionDetail extends Component {


  constructor(props) {
    super(props)

     this.state = {
       data : this.props.data,
       loadingVisible:false,
       qcdetail:"选择QC",
       choose_date:null,
       assignList:null,
       qcdetailId:null,
       question:'',
        newFileArr:[{}],//新的图片
     }

  }

  back() {
      this.props.navigator.pop()
  }

  render(){

    return (
        <View style={styles.container}>
            <NavBar
            title={this.props.data.id}
            leftIcon={require('../../images/back.png')}
            leftPress={this.back.bind(this)}/>
            <ScrollView>
                   {this.renderItem()}
            </ScrollView>
                {this.renderCommitBtn()}
            <Spinner
                visible={this.state.loadingVisible}
              />
        </View>
    )

  }



renderCommitBtn(){

  if ( Global.isQCManager(Global.UserInfo) && this.state.data.status == 'PreQCLeaderAssign') {
        return   this.renderWaitCommit();
  }else if ( Global.isQC1(Global.UserInfo) && this.state.data.status == 'PreQCAssign') {
       return this.renderQcAssign();
  }else if (Global.isMonitor(Global.UserInfo) && this.state.data.status == 'PreRenovete') {
    return this.Commit()
  }else if (this.state.data.status == 'PreQCverify' && Global.isQC1(Global.UserInfo)) {
      return this.QcCheckResult();
  }

}

//qc核实整改结果
QcCheckResult(){

  return(
    <View style={{height:50,width:width,flexDirection:'row'}}>

  <View style={{height:50,flex:1}}>
    <CommitButton
      title={'不合格'}
      onPress={this.QcCheckResultFail.bind(this)}
    containerStyle={{backgroundColor:'#ffffff'}}
      titleStyle={{color: '#f77935'}}
>
    </CommitButton>
    </View>
    <View style={{height:50,flex:1}}>
      <CommitButton
        title={'合格'}
        onPress={this.QcCheckResultPass.bind(this)}
        >
      </CommitButton>
    </View>

    </View>)

}

QcCheckResultPass(){

  Alert.alert('', '确认审核通过?',
            [
              {text:'取消',},
              {text:'确认',onPress:()=> {this.QcCheck()}}
])

}

QcCheckResultFail(){

  this.props.navigator.push({
      component: CloseProblem,
       props: {
           data:this.state.data,
           title:"整改不合格",
          }
  })

}

QcCheck(){

  var paramBody = {
           'note':'',
           'qcProblrmId' : this.state.data.id,
           'checkResult' : 'Qualified',

      }

  HttpRequest.post('/qualityControl/qcVerify', paramBody, this.onDeliverySuccess.bind(this),
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
                Global.showToast(errorInfo.message);
            }else {
              Global.showToast(e)
            }

            } else {
                Global.showToast(e)
            }

        console.log('Login error:' + e)
      })

}

//提交施工班组的整改结果
Commit(){

  return(
    <View style={{height:50,width:width,flexDirection:'row'}}>
    <CommitButton title={'提交'}
    onPress={this.CommitDealResult.bind(this)}
      >
    </CommitButton>
    </View>
  )

}

//提交整改结果
CommitDealResult(){

  if (!this.state.question.length) {
    Global.alert("请输入整改描述");
    return;
  }

  if(this.state.newFileArr.length<=1){
     Global.alert('请选择至少一张问题图片');
      return;
  }


  Alert.alert('','确认提交?',
            [
              {text:'取消',},
              {text:'确认',onPress:()=> {this.ConfirmCommitDealResult()}}
])


}


ConfirmCommitDealResult(){

  this.setState({
      loadingVisible: true
  });

   var param = new FormData();

  param.append('qcProblrmId', this.state.data.id);
  param.append('renovateDescription', this.state.question);

   this.state.newFileArr.map((item, i) => {
       if (item['fileSource']) {
          let file = {uri: item['fileSource'], type: 'multipart/form-data', name: item['fileName']};   //这里的key(uri和type和name)不能改变,
          param.append("file",file);   //这里的files就是后台需要的key
       }
   });

  HttpRequest.uploadImage('/qualityControl/teamRenovete', param, this.onDeliverySuccess.bind(this),
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
                Global.showToast(errorInfo.message);
            }else {
                Global.showToast(e)
            }

            } else {
                Global.showToast(e)
            }

        console.log('Login error:' + e)
      })



}

renderQcAssign(){

  return(
    <View style={{height:50,width:width,flexDirection:'row'}}>

  <View style={{height:50,flex:1}}>
    <CommitButton
      title={'关闭'}
      onPress={this.reject.bind(this)}
    containerStyle={{backgroundColor:'#ffffff'}}
      titleStyle={{color: '#f77935'}}
>
    </CommitButton>
    </View>
    <View style={{height:50,flex:1}}>
      <CommitButton
        title={'整改'}
        onPress={this.verify.bind(this)}
        >
      </CommitButton>
    </View>

    </View>)

}

//按钮点击的处理
reject(){

  this.props.navigator.push({
      component: CloseProblem,
       props: {
           data:this.state.data,
          }
  })

}


verify(){

if (!this.state.choose_date) {
  Global.alert("请选择截止日期");
  return;
}

  Alert.alert('','确认整改?',
            [
              {text:'取消',},
              {text:'确认',onPress:()=> {this.confirmVeify()}}
])
}

startQuality(){

  Alert.alert('','开启质量问题单?',
            [
              {text:'取消',},
              {text:'确认'}
])

}

confirmReject(){

  this.setState({
           loadingVisible: true
       });

       var paramBody = {
               'qualityFlag':true,
                'qcProblrmId' : this.state.data.id,

           }

  HttpRequest.post('/qualityControl/qcAssignClose', paramBody, this.onDeliverySuccess.bind(this),
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
                Global.showToast(errorInfo.message);
            }else {
              Global.showToast(e)
            }

            } else {
                Global.showToast(e)
            }

        console.log('Login error:' + e)
      })

}
confirmVeify(){


  this.setState({
           loadingVisible: true
       });

       var paramBody = {
                'problemId' : this.state.data.id,
                'timeLimit' : this.state.choose_date,
           }



  HttpRequest.post('/qualityControl/qcAssign', paramBody, this.onDeliverySuccess.bind(this),
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
                Global.showToast(errorInfo.message);
            }else {
              Global.showToast(e)
            }

            } else {
                Global.showToast(e)
            }

        console.log('Login error:' + e)
      })

}

//责任单位主任执行分派
renderWaitCommit(){

return(
  <View style={{height:50,width:width,flexDirection:'row'}}>
  <CommitButton title={'分派'}
  onPress={this.commit.bind(this)}
    >
  </CommitButton>
  </View>
)

}


chooseItemInfo(title,id,content){

       return(

         <View style={styles.statisticsflexContainer}>
           <Text> 整改期限 </Text>
         <View style={[styles.cell,{alignItems:'center',padding:10,backgroundColor:'#f2f2f2'}]}>

         <TouchableOpacity
        onPress={() => this._selectD.onClick()}
         style={{borderWidth:0.5,
               alignItems:'center',
               borderColor : '#f77935',
               backgroundColor : 'white',
               borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:10,paddingRight:10,paddingTop:8,paddingBottom:8}}>

         <DateTimePickerView
           ref={(c) => this._selectD = c}
             type={'date'}
             minTime={new Date()}
             title={this.state.displayDate}
             visible={this.state.time_visible}
             style={{color:'#f77935',fontSize:14,flex:1}}
             onSelected={this.onSelectedDate.bind(this)}
         />
                             <Image
                             style={{width:20,height:20}}
                             source={require('../../images/unfold.png')}/>
         </TouchableOpacity>

       </View>

     </View>)

         }

         onSelectedDate(date){

           this.state.choose_date = date.getTime();
           this.setState({displayDate:Global.formatDate(this.state.choose_date)})
         }

commit(){

  if (!this.state.qcdetailId) {
    Global.alert("请选择QC1");
    return;
  }


  Alert.alert('','确认提交?',
            [
              {text:'取消',},
              {text:'确认',onPress:()=> {this.confirmCommit()}}
])

}

confirmCommit(){

  this.setState({
      loadingVisible: true
 })

 var paramBody = {
          'qcProblrmId' : this.state.data.id,
          'assignedId' :  this.state.qcdetailId,
     }

 HttpRequest.post('/qualityControl/qcLeaderAssign', paramBody, this.onDeliverySuccess.bind(this),
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
               Global.showToast(errorInfo.message);
           }else {
             Global.showToast(e)
           }

           } else {
               Global.showToast(e)
           }

       console.log('Login error:' + e)

     })



}

onDeliverySuccess(response){

    this.setState({
        loadingVisible: false
    });

    Global.showToast(response.message)

 DeviceEventEmitter.emit('Quality_Check','Quality_Check');

    this.back();

}

back() {
    this.props.navigator.pop()
}

  renderItem(){

      var itemAry = [];//视图数组

      var displayAry = [
        {title:'机组',content:this.state.data.unit,id:'8',noLine:true},
        {title:'子项',content:this.state.data.subitem,id:'10',noLine:true},
        {title:'楼层',content:this.state.data.floor,id:'9',noLine:true},
        {title:'房间号',content:this.state.data.roomnum,id:'12',noLine:true},
        {title:'系统',content:this.state.data.system,id:'0',noLine:true},
        {title:'责任部门',content:this.state.data.responsibleDept ? this.state.data.responsibleDept.deptName : this.state.data.responsibleDept,id:'1',noLine:true},
        {title:'责任班组',content:this.state.data.responsibleTeam ? this.state.data.responsibleTeam.deptName : this.state.data.responsibleTeam,id:'2',noLine:true},
        {title:'问题描述',content:this.state.data.problemDescription,id:'11',noLine:true},
        {title:'问题照片',content:problemFiles,id:'11',noLine:true,type:'img'},
      ];


  if (this.state.data.renovateDescription && solveFiles.length) {
    displayAry.push({title:'整改描述',content:this.state.data.renovateDescription,id:'18',noLine:true})
    displayAry.push( {title:'整改照片',content:problemFiles,id:'12',noLine:true,type:'img'})
  }

  if (this.state.data.qcUser) {
      displayAry.push({title:'QC',content:this.state.data.qcUser,id:'13',noLine:true})
  }

  if (this.state.data.renovateTeam) {
    displayAry.push({title:'整改队伍',content:this.state.data.renovateTeam,id:'14',noLine:true})
  }

  if (this.state.data.notes) {
    displayAry.push({title:'备注:',content:this.state.data.notes,id:'15',noLine:true})
  }


 displayAry.push({title:'问题状态',content:this.getStatus(this.state.data.status),id:'16',noLine:true})



      // 遍历
      for (var i = 0; i<displayAry.length; i++) {
       if (displayAry[i].type == 'devider') {
              itemAry.push(
                 <View style={styles.divider}/>
              );
          }else if(displayAry[i].type == 'img'){
              itemAry.push(
               this.renderFileView(displayAry[i].title,displayAry[i].content)
              );
          }else {
            itemAry.push(
                <DisplayItemView
                 key={displayAry[i].id}
                 title={displayAry[i].title}
                 detail={displayAry[i].content}
                 noLine={displayAry[i].noLine}
                />
            );
          }
      }


 if ( Global.isMonitor(Global.UserInfo) && this.state.data.status == 'PreRenovete') {

           itemAry.push(this._questtionDescribe());

             itemAry.push(this.renderNewFileView("整改照片"));

}


      if ( Global.isQCManager(Global.UserInfo) && this.state.data.status == 'PreQCLeaderAssign') {
        itemAry.push(this.renderSelectView(this.state.qcdetail,assinList,"选择QC"))
      }

      if (this.state.data.status == 'PreQCAssign' && Global.isQC1(Global.UserInfo)) {
        itemAry.push(this.chooseItemInfo("整改期限","choose_date",this.state.choose_date))
      }

      return itemAry;

      }

      renderFileView(title,imgs) {


          return (
              <View style={{alignItems:'center',flexDirection: 'row', flexWrap: 'wrap', width: width, paddingTop: 10, paddingRight: 10}} horizontal={true} >
                      <Text style={{marginTop:10,marginBottom:10}}> {title} </Text>
                      {this.renderImages(imgs)}

              </View>
          )
      }

      renderImages(imgs){

        var imageViews = [];
        {imgs.map( (item,i) => {

           imageViews.push(
             <TouchableOpacity
                key={i}
                style={{width:70,height:70,marginLeft:10,marginBottom:10}}
                onPress={this.imageClick.bind(this,i,imgs)}>
                <Image resizeMode={'cover'} style={{width:70,height:70,borderWidth:0.5,borderRadius:4}} source={{uri:item['url']}}/>

             </TouchableOpacity>
           );
        })}
       return imageViews;
      }

      imageClick(index,imgs){

        this.props.navigator.push({
            component: ImageShowsUtil,
            props: {
                images:imgs,
                imageIndex:index,
               }
        })

      }

      //问题执行状态
      getStatus(status){

        if (status == 'PreQCLeaderAssign') {
            return '待分派'
        }else if (status == 'PreQCverify') {
            return '待审核'
        }else if (status == 'PreRenovete') {
            return '待整改'
        }else if (status == 'Finished') {
            return '已完成'
        }else if(status == 'Closed'){
            return '已关闭'
        }else if (status == 'PreQCAssign') {
         return '待指派'
        }else {
          return status
        }
      }

      componentDidMount(){

      if ( Global.isQCManager(Global.UserInfo) && this.state.data.status == 'PreQCLeaderAssign'){
             {this.featchData()}
      }

      }

      featchData(){

        this.setState({
            loadingVisible: true
        });

       var param = new FormData()

       var url =  '/qualityControl/getList/' + this.state.data.id;

        HttpRequest.get(url, param, this.featchDataSuccess.bind(this),
            (e) => {
              this.setState({
                  loadingVisible: false
              });

           Global.alert("获取数据失败");
           this.back();
              console.log('Login error:' + e)
            })

      }

      featchDataSuccess(response){

        this.setState({
            loadingVisible: false
        });

        this.state.assignList = response.responseResult.userList;

        this.state.assignList.forEach((item) => {

        assinList.push(item['realname'])

        })

      }


      componentWillMount(){

      // this.figureDatas();


      this.figureFiles();

      }

      figureFiles(){

      problemFiles = [];
      solveFiles = [];
      solveAgainFiles = [];
      assinList = [];

        this.state.data.files.forEach((item) => {
           item['url'] = HttpRequest.getDomain() + item['path'];
      })

        this.state.data.files.forEach((item) => {

        if (item['fileType'] == "before") {

         problemFiles.push(item);

        }else if (item['fileType'] == "after") {

        solveFiles.push(item);

      }else if (item['fileType'] == "again") {

        solveAgainFiles.push(item);

      }

        })

      }

    onSelectedMember(data){

      this.setState({qcdetail:data[0]})

      this.state.assignList.forEach((item) => {

        if (item['realname']  == this.state.qcdetail) {

          this.state.qcdetailId = item['id'];

        }

      })

 }

      renderSelectView(title,datas,pickerTitle) {
        return(
            <View style={[{marginTop:10,alignItems:'center',},styles.statisticsflexContainer]}>

            <View style={[styles.cell,{alignItems:'center',padding:10,backgroundColor:'#f2f2f2'}]}>

            <TouchableOpacity
            onPress={() => this._selectM.onPickClick()}
            style={{borderWidth:0.5,
                  alignItems:'center',
                  borderColor : '#f77935',
                  backgroundColor : 'white',
                  borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:10,paddingRight:10,paddingTop:8,paddingBottom:8}}>

                  <MemberSelectView
                  ref={(c) => this._selectM = c}
                  style={{color:'#f77935',fontSize:14,flex:1,textAlign:'left'}}
                  title={title}
                  data={datas}
                  pickerTitle={pickerTitle}
                  onSelected={this.onSelectedMember.bind(this)} />
                                <Image
                                style={{width:20,height:20}}
                                source={require('../../images/unfold.png')}/>
            </TouchableOpacity>

            </View>



            </View>

        )
      }


      _questtionDescribe(){
        return(
          <View style={styles.questionType}>
            <Text style={{color: '#1c1c1c', fontSize: 14}}>整改描述:</Text>
            <TextInput
                style={{flex: 1, fontSize: 14, color: '#1c1c1c', padding: 5, textAlignVertical: 'top',}}
                underlineColorAndroid ='transparent'
                multiline = {true}
                onChangeText={(text) => this.setState({ question: text })}
                value={this.state.question} />
          </View>
        )
      }

      renderNewFileView(title) {
          return (
              <View style={{alignItems:'center',flexDirection: 'row', flexWrap: 'wrap', width: width, paddingTop: 10, paddingRight: 10}} horizontal={true} >
                      <Text> {title} </Text>
                      {this.renderNewImages()}

              </View>
          )
      }

      renderNewImages(){
        var imageViews = [];

        {this.state.newFileArr.map( (item,i) => {

           imageViews.push(
             <TouchableOpacity
                key={i}
                onPress={() => this.onSelectNewFile(i)}
                onLongPress={() => this.onDeleteNewFile(i)}
                style={{width:70,height:70,marginLeft:10,marginBottom:10}}>
                     {item['fileSource']
                     ?(<Image resizeMode={'cover'} style={{width:70,height:70,borderWidth:0.5,borderRadius:4}} source={{uri:item['fileSource']}}/>)
                     :(<Image resizeMode={'cover'} style={{width:70,height:70,borderWidth:0.5,borderRadius:4}} source={require('../../images/add_pic_icon.png')}/>)
                      }
             </TouchableOpacity>
           );

           if(this.state.newFileArr[this.state.newFileArr.length-1]['fileSource']){
                   this.state.newFileArr.push({});
               }
        })}

       return imageViews;
      }


      //选择图片
      onSelectNewFile(idx) {

      this.currentFileIdx = idx;

      ImagePicker.showImagePicker(options,(response) => {

       if (response.didCancel) {
         console.log("cancelled");
       }else if (response.error) {
         console.log("error");
       }else if (response.customButton) {
         console.log("customButton");
       }else {
         var source;
         if (Platform.OS === 'android') {
           source = {uri:response.uri,isStatic:true};
         }else {
           source = {
              uri: response.uri.replace('file://', ''),
              isStatic: true
           };

         }

         var fileInfo = this.state.newFileArr[this.currentFileIdx]
         fileInfo['fileSource'] = source.uri;
         fileInfo['fileName'] = response.fileName;
         fileInfo['url'] = source.uri;

         if(this.state.newFileArr.length<MAX_IMAGE_COUNT && this.state.newFileArr[this.state.newFileArr.length-1]['fileSource']){
             this.state.newFileArr.push({});
         }

         this.setState({
             ...this.state
         });

       }

      });

      }

      onDeleteNewFile(idx){

        if(this.state.newFileArr[idx]['fileSource']){
            this.state.newFileArr.splice(idx, 1)
            this.setState({
                ...this.state
            })
        }

      }


}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#f2f2f2',
  },
  commitButton:
  {
      // marginTop: 10,
      height: 50,
      width: width,
      backgroundColor: '#f77935',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
  },
  borderStyle: {
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#f2f2f2',
    width: width*0.5,
    height: 36,
    flexDirection:'row',
    borderColor : '#f77935',
    borderWidth:0.5,
    borderRadius : 4,
    marginBottom:5,
    marginTop:5,
  },
  MutiborderStyle: {
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#f2f2f2',
    width: width*0.5,
    flexDirection:'row',
    borderColor : '#f77935',
    borderWidth:0.5,
    borderRadius : 4,
    marginBottom:5,
    marginTop:5,
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
  topContainer:{
    justifyContent:'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft:10,
    paddingRight:10,
    backgroundColor:'#ffffff',
  },
  title: {
      width: width * 0.25,
      fontSize: 14,
      color: "#1c1c1c"
  },
  divider: {
  backgroundColor: '#d6d6d6',
  width: width,
  height: 0.5,
  marginLeft:10,
},
cell: {
    flex: 1,
    height: 57.5,
    width:width/4,
    justifyContent: "center",
    alignItems: 'center',
     flexDirection: 'column',
        backgroundColor: '#ffffff',
},
statisticsflexContainer: {
         flexDirection: 'row',
         alignItems:'center',
     },

     selectContainer: {
             width: width,
              height: 50,
              backgroundColor: 'white',
              flexDirection: 'row',
              borderColor:'#f77935',
              borderWidth:1,
              marginTop:10,
              marginLeft:10,
              marginRight:10,
          },

   topflexContainer: {
              height: 60,
              backgroundColor: '#ffffff',
              flexDirection: 'row',
              marginBottom:10,
          },
          textStyle: {
            color: '#f77935',
            fontSize: 14,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          },

          questionType:{
            backgroundColor: 'white',
             height: 150,
              paddingTop: 10,
              paddingLeft: 10,
              borderWidth:1,
              borderColor:'darkgray',
              marginTop:10,
              marginLeft:10,
              marginRight:10,
              borderRadius:8,
          },

})
