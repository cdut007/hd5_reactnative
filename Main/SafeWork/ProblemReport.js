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
    KeyboardAvoidingView,
    InteractionManager,

} from 'react-native';

import Dimensions from 'Dimensions'
import NavBar from '../../common/NavBar';
import MemberSelectView from '../../common/MemberSelectView'
import ImagePicker from 'react-native-image-picker'
import MyReport from '../SafeWork/MyReport'
import Spinner from 'react-native-loading-spinner-overlay'
import HttpRequest from '../../HttpRequest/HttpRequest'
import Global from '../../common/globals'
const SAFEWORK_ISSUE_COMMIT_URL = '/hse/create'

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
var width = Dimensions.get('window').width;
var machineTypes = [];
var PlantTypes = [];
var RoomTypes = [];
var BgTypes = [];
var DepartTypes = [];
var TeamTypes = [];
var selects = [];

var code1 = [];
var code2 = [];
var code3 = [];
var code23 = [];

var TeamStoreTypes = [];

String.prototype.startWith=function(str){
  var reg=new RegExp("^"+str);
  return reg.test(this);
}

export  default class ProblemReport extends Component {

  constructor(props) {
      super(props)

      this.state = {
          title: "报告问题",
          machineType: '选择机组',
          plantType: '选择厂房',
          questionName:'',
          elevation: '选择标高', //标高
          RoomNumber:'选择房间号',//房间号
          ResDepart:'选择责任部门',
          ResDepartId:null,
          ResTeamId:null,
          ResTeam:'选择责任班组',
          DepartTypes:null,
          TeamTypes:null,
          machineTypes:null,
          PlantTypes:null,
          code1:'选择问题',
          code2:'选择二级编码',
          code3:'选择隐患描述',
          code1data:null,
          code2data:null,
          code3data:null,
          RoomTypes:[],
          BgTypes:[],
          question:'',
          fileArr: [{}],//装图片资源的数组
          loadingVisible:false,
          requestTime:1,

      }
  }

  back() {

  this.confirmBack();

  //   Alert.alert('','退出编辑?',
  //             [
  //               {text:'取消',},
  //               {text:'确认',onPress:()=> {this.confirmBack()}}
  // ])

  }

  componentDidMount(){

    InteractionManager.runAfterInteractions(() => {
      this.featchData();
    });



  }

  featchData(){

    this.setState({
        loadingVisible: true
    });
   var param = {safe:'safe'};

    HttpRequest.get('/hse/v2/createUI', param, this.featchDataSuccess.bind(this),
        (e) => {
          this.setState({
              loadingVisible: false
          });

        if (requestTime == 1) {
               Global.alert("获取数据失败");
               this.back.bind(this);

         }

          console.log('error:' + e)

        })

  }

  featchDataSuccess(response){

    requestTime = 2;

    this.setState({
        loadingVisible: false
    });

   if (response.responseResult) {

    this.figureData(response.responseResult)

   }


  }

  figureData(data){

  machineTypes = [];
  PlantTypes = [];
  DepartTypes = [];
  TeamTypes = [];
   code1 = [];
   code23 = [];


    this.state.machineTypes = data.unit;
    this.state.code1data = data.codeLevel1;
    code23 = data.codeLevel23;
    this.state.PlantTypes = data.wrokshop;
    this.state.DepartTypes = data.responsibleDept;
    this.state.TeamTypes = data.responsibleTeam;
    RoomTypes = data.roomLevel;
    TeamStoreTypes = data.responsibleTeam;

    this.state.machineTypes.forEach((item) => {

         machineTypes.push(item)

    })


    if(this.state.code1data){
        this.state.code1data.forEach((item) => {

             code1.push(item['codeDesc'])

        })
    }



    this.state.PlantTypes.forEach((item) => {

         PlantTypes.push(item)

    })

  this.state.DepartTypes.forEach((item) => {

  DepartTypes.push(item['deptName'])

  })


  this.state.TeamTypes.forEach((item) => {

  TeamTypes.push(item['deptName'])

  })





  if (this.state.machineType == '选择机组' && machineTypes.length > 0 ) {
    this.setState({machineType:machineTypes[0]})

  }



  if (this.state.plantType == '选择厂房' && PlantTypes.length > 0 ) {

    this.setState({plantType:PlantTypes[0]})
    this.updateRooms(PlantTypes[0]);

  }

  if (!this.state.ResDepartId && DepartTypes.length > 0) {
     this.state.ResDepartId = data.responsibleDept[0]['deptId'];
     this.setState({ResDepart:DepartTypes[0]})
     this.updateTeams(data.responsibleDept[0]['deptId']);
  }



  }


  updateCode2(parentId){
      var fliterCodes = [];
      var tempData = [];

      for (var i = 0; i < code23.length; i++) {
          if(code23[i].parentId == parentId){
              var item = code23[i];
              fliterCodes.push(item);
              tempData.push(item['codeDesc'])
          }

      }

        code2 = tempData;
       this.state.code2data = fliterCodes.sort();
       this.setState({code2data:fliterCodes, code2:'选择二级编码'})

  }

  updateCode3(parentId){
      var fliterCodes = [];
      var tempData = [];

      for (var i = 0; i < code23.length; i++) {
          if(code23[i].parentId == parentId){
              var item = code23[i];
              fliterCodes.push(item);
              tempData.push(item['codeDesc'])
          }

      }

        code3 = tempData;

       this.state.code3data = fliterCodes.sort();
       this.setState({code3data:fliterCodes, code3:'选择隐患描述'})

  }


  updateTeams(departmentId){
      var fliterTeamTypes = [];
      var tempTeam = [];

      for (var i = 0; i < TeamStoreTypes.length; i++) {
          if(TeamStoreTypes[i].parentDeptId == departmentId){
              var item = TeamStoreTypes[i];
              fliterTeamTypes.push(item);
              tempTeam.push(item['deptName'])
          }

      }

        TeamTypes = tempTeam;

       this.state.TeamTypes = fliterTeamTypes.sort();
       this.setState({TeamTypes:fliterTeamTypes, ResTeamId:null,
        ResTeam:'选择责任班组'})

  }

  updateRooms(plantType){
      var Rooms = [];
      for (var i = 0; i < RoomTypes.length; i++) {
          if(RoomTypes[i].room.startWith(plantType)){
              Rooms.push(RoomTypes[i].room);
          }

      }
       this.state.RoomTypes = Rooms.sort();
       this.setState({RoomTypes:Rooms,elevation:'选择标高',RoomNumber:'选择房间号'})

  }

  updateElevation(room){
      var BgTypes = [];
      for (var i = 0; i < RoomTypes.length; i++) {
          if(RoomTypes[i].room == room){
              if(RoomTypes[i].level){
                  if(RoomTypes[i].level.length>0){
                      BgTypes = RoomTypes[i].level;
                  }
              }

              break;
          }

      }
       this.state.BgTypes = BgTypes;
       this.setState({BgTypes:BgTypes,elevation:'选择标高'})

  }

  confirmBack(){

  this.props.navigator.pop()


  }

  render() {
      return (
          <View style={styles.container}>
              <NavBar
              title={this.state.title}
              leftIcon={require('../../images/back.png')}
              leftPress={this.back.bind(this)}/>
               <View style={styles.content}>
                 {this._ContentView()}
                 {this._CommitButton()}
               </View>
               <Spinner
                   visible={this.state.loadingVisible}
               />
          </View>
      )
  }

  _ContentView(){

   return(
       <ScrollView style={styles.container}>
            {this.renderItem()}
       </ScrollView>
   )


  }

  renderItem() {
    // 数组
    var itemAry = [];



    var displayAry = [

        {title:'问题',id:'choose_code1',pickerTitle:"选择问题",content:this.state.code1,data:code1,type:'choose',ref:this._selectCode1},
         {title:'二级编码',id:'choose_code2',pickerTitle:"选择二级编码",content:this.state.code2,data:code2,type:'choose',ref:this._selectCode2},
        {title:'隐患描述',id:'choose_code3',pickerTitle:"选择隐患描述",content:this.state.code3,data:code3,type:'choose',ref:this._selectCode3},

      {title:'机组',id:'choose_machiche',pickerTitle:"选择机组",content:this.state.machineType,data:machineTypes,type:'choose',ref:this._selectMachine},
      {title:'厂房',id:'choose_platHouse',pickerTitle:"选择厂房",content:this.state.plantType,data:PlantTypes,type:'choose',ref:this._selectPlant},
      {title:'房间号(选填)',id:'room_no',pickerTitle:"选择房间号",content:this.state.RoomNumber,data:this.state.RoomTypes,type:'choose',ref:this._selectRoom},
       {title:'标高(选填)',id:'elevation',pickerTitle:"选择标高",content:this.state.elevation,data:this.state.BgTypes,type:'choose',ref:this._selectBg},
      {title:'责任部门',id:'choose_des',pickerTitle:"选择责任部门",content:this.state.ResDepart,data:DepartTypes,type:'choose',ref:this._selectDepart},
      {title:'责任班组(选填)',id:'choose_team',pickerTitle:"选择责任班组",content:this.state.ResTeam,data:TeamTypes,type:'choose',ref:this._selectTeam},
      {type:'describe'},
      {type:'file'},

];


// 遍历
for (var i = 0; i<displayAry.length; i++) {

  if (displayAry[i].type == 'choose') {

   itemAry.push(
        this._SelectView(displayAry[i].title,displayAry[i].content,displayAry[i].data,displayAry[i].pickerTitle,displayAry[i].id,displayAry[i].ref)
   )
 }else if (displayAry[i].type == 'input') {
     itemAry.push(
       this._inPutView(displayAry[i].title,displayAry[i].content,displayAry[i].id)
     )
 }else if (displayAry[i].type == 'chooseOption') {
   itemAry.push(
       this._SelectViewOption(displayAry[i].title,displayAry[i].content,displayAry[i].data,displayAry[i].pickerTitle,displayAry[i].id)
   )
 }else if (displayAry[i].type == 'describe') {
    itemAry.push(
      this._questtionDescribe()
    )
 }else if (displayAry[i].type == 'file') {
     itemAry.push(
       this.renderFileView()
     )
 }

}
/*
{this._SelectView("机组",this.state.machineType,machineTypes,"选择机组","XZJZ")}
{this._SelectView("厂房",this.state.plantType,PlantTypes,"选择厂房","XZCF")}
{this._inPutView("标高",this.state.elevation,"BG")}
{this._inPutView("房间号",this.state.RoomNumber,"FJH")}
{this._SelectView("责任部门",this.state.ResDepart,DepartTypes,"选择责任部门","ZRBM")}
{this._SelectViewOption("责任班组",this.state.ResTeam,TeamTypes,"选择责任班组","ZRBZ")}
{this._questtionDescribe()}
{this.renderFileView()}
 */


 return itemAry;

  }

 _CommitButton(){
return(
  <TouchableOpacity
      activeOpacity={0.8}
      onPress={this.onCommit.bind(this)}
      style={styles.commitButton}>
      <Text style={{ color: '#ffffff', fontSize: 20, }} >
          提交
      </Text>
  </TouchableOpacity>
)}


  confirmCommit(){

    this.setState({
        loadingVisible: true
   })

   var param = new FormData()
   //param.append('problemTitle',this.state.questionName);
   var code1Id = null;
   this.state.code1data.forEach((item) => {

     if (item['codeDesc']  == this.state.code1) {
           code1Id = item['id'];
     }
   })

   var code2Id = null;
   this.state.code2data.forEach((item) => {

     if (item['codeDesc']  == this.state.code2) {
           code2Id = item['id'];
     }
   })

   var code3Id = null;
   this.state.code3data.forEach((item) => {

     if (item['codeDesc']  == this.state.code3) {
           code3Id = item['id'];
     }
   })

    param.append('code1Id', code1Id);
    param.append('code2Id', code2Id);
    param.append('code3Id', code3Id);
   param.append('unit', this.state.machineType);
   param.append('wrokshop', this.state.plantType);
   param.append('eleration', this.state.elevation);
   param.append('roomno', this.state.RoomNumber);
   param.append('description', this.state.question);
   param.append('responsibleDeptId', this.state.ResDepartId);

 if (this.state.ResTeamId) {

  param.append('responsibleTeamId',this.state.ResTeamId);

 }


   this.state.fileArr.map((item, i) => {
       if (item['fileSource']) {
          let file = {uri: item['fileSource'], type: 'multipart/form-data', name: item['fileName']};   //这里的key(uri和type和name)不能改变,
          param.append("file",file);   //这里的files就是后台需要的key
       }
   });

   HttpRequest.uploadImage(SAFEWORK_ISSUE_COMMIT_URL, param, this.onCommitIssueSuccess.bind(this),
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

    // var reportData = new Object()
    // reportData.machineType = this.state.machineType;//机组
    // reportData.plantType = this.state.plantType;//厂房
    // reportData.elevation = this.state.elevation;//标高
    // reportData.RoomNumber = this.state.RoomNumber;//房间号
    // reportData.ResDepart = this.state.ResDepart;//责任部门
    // reportData.ResTeam = team;//责任班组
    // reportData.questions = this.state.question;//问题描述
    // reportData.images = this.state.fileArr;//图片
    //
    //  this.props.navigator.push({
    //      component: MyReport,
    //      props: {
    //          data:reportData,
    //         }
    //  })

  }

  onCommitIssueSuccess(response) {

    this.setState({
        loadingVisible: false
    })

     // Global.alert(response.message)
     this.props.navigator.pop()

  }


  onCommit() {

 // if (!this.state.questionName.length) {
 //         Global.alert("请输入问题名称");
 //         return
 // }

 if (this.state.code1 == '选择问题') {
   Global.alert("请选择问题");
   return;
 }
 if (this.state.machineType == '选择二级编码') {
   Global.alert("请选择二级编码");
   return;
 }
 if (this.state.machineType == '选择隐患描述') {
   Global.alert("请选择隐患描述");
   return;
 }

    if (this.state.machineType == '选择机组') {
      Global.alert("请选择机组");
      return;
    }

    if (this.state.plantType == '选择厂房') {
      Global.alert("请选择厂房");
      return;
    }
    if (this.state.RoomNumber == '选择房间号') {
       this.state.RoomNumber = '';
    }

    if (this.state.elevation == '选择标高') {
      this.state.elevation = '';
    }

     if (!this.state.ResDepartId) {
       Global.alert("请选择责任部门");
       return;
     }
     // if (!this.state.question.length) {
     //  Global.alert("请输入问题描述");
     //   return;
     // }
     if(this.state.fileArr.length<=1){
         Global.alert('请选择至少一张问题图片');
         return;
     }


     Alert.alert('','确认提交?',
               [
                 {text:'取消',},
                 {text:'确认',onPress:()=> {this.confirmCommit()}}
   ])



  }

  _inPutView(name,inputs,tag){

    return (
      <View style={styles.topContainer}>
            <Text style={styles.title}> {name} </Text>
           {this.renderInputView(inputs,tag)}
      </View>
    )

  }

  renderInputView(inputs,tag){

return(
  <View style={styles.borderStyle}>
  <TouchableOpacity style={styles.touchStyle}>
    <TextInput
        style={{flex: 1, fontSize: 14, color: '#1c1c1c', padding: 5, textAlignVertical: 'top',}}
        underlineColorAndroid ='transparent'
        multiline = {true}
        onChangeText={(text) => this._ontextChange(text,tag) }
        value={inputs} />
 </TouchableOpacity>
  </View>
)

}

_questtionDescribe(){
  return(
    <View style={styles.questionType}>
      <Text style={{color: '#1c1c1c', fontSize: 14}}>问题描述:</Text>
      <TextInput
          style={{flex: 1, fontSize: 14, color: '#1c1c1c', padding: 5, textAlignVertical: 'top',}}
          underlineColorAndroid ='transparent'
          multiline = {true}
          onChangeText={(text) => this.setState({ question: text })}
          value={this.state.question} />
    </View>
  )
}

  _ontextChange(text,tag){

if (text.length == 1 && text == ' ') {
return
}

  switch (tag) {

      case "questionName":{
        this.setState({questionName:text})
      }

        break;
  }
  }

  _SelectView(name,title,datas,pickerTitle,pickerType,reference){

      return(
        <View style={styles.topContainer}>
              <Text style={styles.title}> {name} </Text>
              {this.renderSelectView(title,datas,pickerTitle,pickerType,reference)}
        </View>
      )

  }

  _SelectViewOption(name,title,datas,pickerTitle,pickerType){

      return(
        <View style={styles.topContainer}>
              <Text style={styles.title}> {name} </Text>
              {this.renderSelectView(title,datas,pickerTitle,pickerType)}
              <Text> (选填) </Text>
        </View>
      )

  }

  renderSelectView(title,datas,pickerTitle,pickerType,reference) {

      return(
        <View style={styles.statisticsflexContainer}>
      <TouchableOpacity onPress={() => reference.onPickClick()}
        style={styles.touchStyle}
        >
        <MemberSelectView
        ref={(c) => reference = c}
         style={{color:'#f77935',fontSize:14,flex:1,textAlign:'left'}}
         title={title}
         data={datas}
         type={pickerType}
         pickerTitle={pickerTitle}
         onSelected={(data) => this.onSelectedType(data,pickerType)}/>
        <Image style={{width:20,height:20,}} source={require('../../images/unfold.png')}/>
     </TouchableOpacity>
      </View>
      )
  }

  renderFileView() {
      return (
          <View style={{flexDirection: 'row', flexWrap: 'wrap', width: width, paddingTop: 10, paddingRight: 10}} horizontal={true} >

                  {this.renderImages()}

          </View>
      )
  }

  renderImages(){
    var imageViews = [];
    {this.state.fileArr.map( (item,i) => {

       imageViews.push(
         <TouchableOpacity
            key={i}
            onPress={() => this.onSelectFile(i)}
            onLongPress={() => this.onDeleteFile(i)}
            style={{width:70,height:70,marginLeft:10,marginBottom:10}}>
                 {item['fileSource']
                 ?(<Image resizeMode={'cover'} style={{width:70,height:70,borderWidth:0.5,borderRadius:4}} source={{uri:item['fileSource']}}/>)
                 :(<Image resizeMode={'cover'} style={{width:70,height:70,borderWidth:0.5,borderRadius:4}} source={require('../../images/add_pic_icon.png')}/>)
                  }
         </TouchableOpacity>
       );

       if(this.state.fileArr[this.state.fileArr.length-1]['fileSource']){
               this.state.fileArr.push({});
           }
    })}
   return imageViews;
  }

//选择图片
  onSelectFile(idx) {

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

     var fileInfo = this.state.fileArr[this.currentFileIdx]
     fileInfo['fileSource'] = source.uri;
     fileInfo['fileName'] = response.fileName;
     fileInfo['url'] = source.uri;

     if(this.state.fileArr.length<MAX_IMAGE_COUNT && this.state.fileArr[this.state.fileArr.length-1]['fileSource']){
         this.state.fileArr.push({});
     }

     this.setState({
         ...this.state
     });

   }

 });

  }

  onDeleteFile(idx){

    if(this.state.fileArr[idx]['fileSource']){
        this.state.fileArr.splice(idx, 1)
        this.setState({
            ...this.state
        })
    }

  }

  onSelectedType(data,pickerType){

   switch (pickerType) {
     case "choose_machiche":
     {
       this.setState({machineType:data[0]})
     }
     break;
     case "choose_platHouse":
     {
      this.setState({plantType:data[0]})
      this.updateRooms(data[0]);
     }
       break;

       case "elevation":
         {
             this.setState({elevation:data[0]})
         }
         break;
         case "room_no":
         {
            this.setState({RoomNumber:data[0]})
            this.updateElevation(data[0]);
         }
           break;


      case "choose_des":
      {
         this.figureDes(data);
          this.updateTeams(this.state.ResDepartId);
      }
        break;
        case "choose_code1":
        {
            this.setState({code1:data[0]})
            this.setState({code2:'选择二级编码'})
            code2=[];
            this.state.code1data.forEach((item) => {

              if (item['codeDesc']  == data[0]) {
                    this.updateCode2(item['id']);
              }

            })
            code3=[];
            this.setState({code3:'选择隐患描述'})


        }
          break;
          case "choose_code2":
          {
              code3=[];
              this.setState({code2:data[0]})
              this.setState({code3:'选择隐患描述'})
              this.state.code2data.forEach((item) => {

                if (item['codeDesc']  == data[0]) {
                      this.updateCode3(item['id']);
                }

              })
          }
            break;
            case "choose_code3":
            {
                this.setState({code3:data[0]})
            }
              break;
        case "choose_team":
        {
        this.figureTeam(data);
        }
          break;
   }

      // this.setState({machineType: data[0]})
  }




  figureDes(data){

  this.setState({ResDepart:data[0]})

  this.state.DepartTypes.forEach((item) => {

    if (item['deptName']  == this.state.ResDepart) {

      this.state.ResDepartId = item['deptId'];

    }

  })
  if(this.state.DepartTypes.length == 0){
     this.featchData();
  }

  this.state.ResTeamId = null;
  this.state.ResTeam = '选择责任班组';


}
  figureTeam(data){

  this.setState({ResTeam:data[0]})

  this.state.TeamTypes.forEach((item) => {

    if (item['deptName']  == this.state.ResTeam) {

      this.state.ResTeamId = item['deptId'];

    }

  })

}

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    topContainer:{
      justifyContent:'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor:'#ffffff',
      marginTop: 30,
      marginLeft:20,
    },
    margin: {
   marginTop: 30,
   marginLeft: 0,
  },
    content: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    textStyle: {
      color: '#f77935',
      fontSize: 14,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    borderStyle: {
      justifyContent:'center',
      alignItems:'center',
      backgroundColor: '#f2f2f2',
      width: width*0.5,
      height: Platform.OS === 'android' ? 44 : 36,
      flexDirection:'row',
    },
    touchStyle: {
      alignItems:'center',
      flex:1,
      flexDirection:'row',
      paddingLeft:10,
      paddingRight:10,
      paddingTop:8,
      paddingBottom:8,
      borderColor : '#f77935',
      backgroundColor : 'white',
      borderRadius : 4,
      borderWidth:0.5,
      flexDirection:'row',
      alignSelf:'stretch',
    },
    title: {
        width: width * 0.25,
        fontSize: 14,
        color: "#1c1c1c"
    },
    questionType:{
      backgroundColor: 'white',
       height: 150,
        paddingTop: 10,
        paddingLeft: 10,
        borderWidth:1,
        borderColor:'darkgray',
        marginTop:30,
        marginLeft:10,
        marginRight:10,
        borderRadius:8,
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
    statisticsflexContainer: {
            width: width*0.5,
             height: Platform.OS === 'android' ? 44 : 36,
             backgroundColor: '#f2f2f2',
             flexDirection: 'row',
         },
  });
