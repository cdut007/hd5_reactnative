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

var width = Dimensions.get('window').width;

const images = [{
  url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
},
{
  url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
}]

export default class QuestionDetail extends Component {
  constructor(props) {
    super(props)

     this.state = {
       data : this.props.data,
       title: "问题详情",
       team : this.props.data.responsibleTeam,
       fileArr : images,
       time: this.props.data.time,
       recDes:"",
       newFileArr:[{}],//新的图片
       choose_date:null,
       displayDate:"截止日期",
     }

  }

  render(){

    return (
        <View style={styles.container}>
            <NavBar
            title={this.state.title}
            leftIcon={require('../../images/back.png')}
            leftPress={this.back.bind(this)}/>
          <ScrollView >
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

    if (this.state.data.problemStatus == "Need_Handle") {
   return this.renderNewCommit();
 }else if (this.state.data.problemStatus == "Need_Check") {
      return this.renderModeratedCommit();
 }else if (this.state.data.problemStatus == "Renovating") {
    return this.renderWaitCommit();
 }


  }

  renderWaitCommit(){

return(
    <View style={{height:50,width:width,flexDirection:'row'}}>
    <CommitButton title={'提交整改结果'}
    onPress={this.commit.bind(this)}
      >
    </CommitButton>
    </View>
)

  }

  commit(){

    if (!this.state.recDes) {
        Global.alert('请输入整改描述')
        return
    }


    if (!this.state.newFileArr) {
        Global.alert('请提交整改照片')
        return
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

   var param = new FormData()

   param.append('description', this.state.recDes);
   param.append('problemId', this.state.data.id);

   this.state.newFileArr.map((item, i) => {
       if (item['fileSource']) {
          let file = {uri: item['fileSource'], type: 'multipart/form-data', name: item['fileName']};   //这里的key(uri和type和name)不能改变,
          param.append("file",file);   //这里的files就是后台需要的key
       }
   });

   HttpRequest.uploadImage('/hse/submitRenovateResult', param, this.onDeliverySuccess.bind(this),
       (e) => {
           try {
               Global.showToast(e)
           }
           catch (err) {
               console.log(err)
           }

           this.setState({
               loadingVisible: false
           })
       })


  }

  renderModeratedCommit(){

    return(
      <View style={{height:50,width:width,flexDirection:'row'}}>
    <View style={{height:50,flex:1}}>
      <CommitButton
        title={'重新整改'}
      containerStyle={{backgroundColor:'#ffffff'}}
        titleStyle={{color: '#f77935'}}
        onPress={this.checkResult.bind(this,2)}>
      </CommitButton>
      </View>
      <View style={{height:50,flex:1}}>
        <CommitButton
          title={'通过'}
          onPress={this.checkResult.bind(this,1)}>
        </CommitButton>
      </View>
      </View>)

  }

 checkResult(status){

if (status == 1) {
  Alert.alert('','确认通过?',
            [
              {text:'取消',},
              {text:'确认',onPress:()=> {this.confirmCheckResult(status)}}
])
}else if (status == 2) {
  Alert.alert('','确认重新整改?',
            [
              {text:'取消',},
              {text:'确认',onPress:()=> {this.confirmCheckResult(status)}}
])
}

 }

 confirmCheckResult(status){

   var paramBody = {
            'problemId' : this.props.data.id,
            'checkResult' :  status,
       }

   HttpRequest.post('/hse/checkRenovateResult', paramBody, this.onDeliverySuccess.bind(this),
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

  renderNewCommit(){

    return(
      <View style={{height:50,width:width,flexDirection:'row'}}>
    <View style={{height:50,flex:1}}>
      <CommitButton
        title={'退回'}
      containerStyle={{backgroundColor:'#ffffff'}}
        titleStyle={{color: '#f77935'}}
        onPress={this.reject.bind(this)}>

      </CommitButton>
      </View>
      <View style={{height:50,flex:1}}>
        <CommitButton
          title={'核实'}
         onPress={this.verify.bind(this)}
          >
        </CommitButton>
      </View>
      </View>)
  }
  //按钮点击的处理
  reject(){
    Alert.alert('','确认退回?',
              [
                {text:'取消',},
                {text:'确认',onPress:()=> {this.confirmReject()}}
  ])
  }
  verify(){

    if (!this.state.team) {
        Global.showToast('请选择施工班组')
        return
    }


    if (!this.state.choose_date) {
        Global.showToast('请选择施工日期')
        return
    }

    Alert.alert('','确认核实?',
              [
                {text:'取消',},
                {text:'确认',onPress:()=> {this.confirmVeify()}}
  ])
  }

  confirmReject(){

    this.setState({
             loadingVisible: true
         });

         var paramBody = {
                  'problemId' : this.props.data.id,
             }

    HttpRequest.post('/hse/unAssign', paramBody, this.onDeliverySuccess.bind(this),
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
                  'problemId' : this.props.data.id,
                  'designatedUserId' :  this.state.team,
                  'startDate' : this.state.choose_date,
             }

    HttpRequest.post('/hse/assign', paramBody, this.onDeliverySuccess.bind(this),
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

      this.back();

  }

  back() {
      this.props.navigator.pop()
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

componentDidMount(){

  this.state.data.files.forEach((item) => {
     item['url'] = item['path'];
})

}

  //新问题
  renderNewQuestion(){

    var itemAry = [];//视图数组

    var displayAry = [
      {title:'问题名称',content:this.state.data.id,id:'0',noLine:true},
      {title:'机组',content:this.state.data.unit,id:'1',noLine:true},
      {title:'厂房',content:this.state.data.wrokshop,id:'2',noLine:true},
      {title:'标高',content:this.state.data.eleration,id:'3',noLine:true},
      {title:'房间号',content:this.state.data.roomno,id:'4',noLine:true},
      {title:'责任部门',content:this.state.data.responsibleDept,id:'5',noLine:true},
    ];


    // 遍历
    for (var i = 0; i<displayAry.length; i++) {
     if (displayAry[i].type == 'devider') {
            itemAry.push(
               <View style={styles.divider}/>
            );
        }else{
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

    itemAry.push(
      this.OPinPutView("责任班组:",this.state.team,"BZ")
    );

    itemAry.push(
       <View style={styles.divider}/>
    );

    itemAry.push(
        <DisplayItemView
         key={6}
         title={"问题描述"}
         detail={this.state.data.description}
         noLine={true}
        />
    );

    itemAry.push(
      this.renderFileView("问题照片",this.state.data.files)
    );

    itemAry.push(
     this.chooseItemInfo("整改期限","choose_date",this.state.choose_date)
    );

    return itemAry;


  }

//待处理
  Moderated(){

  var itemAry = [];//视图数组
   Global
  var time =  Global.formatDate(this.state.data.createTime) + '-' + Global.formatDate(this.state.data.startDate);

  var displayAry = [
    {title:'标题',content:this.state.data.id,id:'0',noLine:true},
    {title:'机组',content:this.state.data.unit,id:'1',noLine:true},
    {title:'厂房',content:this.state.data.wrokshop,id:'2',noLine:true},
    {title:'标高',content:this.state.data.eleration,id:'3',noLine:true},
    {title:'房间号',content:this.state.data.roomno,id:'4',noLine:true},
    {title:'责任部门',content:this.state.data.responsibleDept,id:'5',noLine:true},
    {title:'责任班组',content:this.state.data.responsibleTeam,id:'6',noLine:true},
    {title:'整改时间',content:time,id:'7',noLine:true},
    {title:'问题描述',content:this.state.data.description,id:'8',noLine:true},
    {title:'整改描述',content:this.state.data.description,id:'9',noLine:true},
  ];


  // 遍历
  for (var i = 0; i<displayAry.length; i++) {
   if (displayAry[i].type == 'devider') {
          itemAry.push(
             <View style={styles.divider}/>
          );
      }else{
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

  const imgs = [{
    url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
  }]

  itemAry.splice(9,0,this.renderFileView("问题照片",this.state.data.files))
  itemAry.push(this.renderFileView("整改照片",this.state.data.files))

  return itemAry;

  }

  //整改中
  Rectification(){

    var itemAry = [];//视图数组

    var displayAry = [
      {title:'标题',content:this.state.data.machineType,id:'0',noLine:true},
      {title:'机组',content:this.state.data.machineType,id:'1',noLine:true},
      {title:'厂房',content:this.state.data.plantType,id:'2',noLine:true},
      {title:'标高',content:this.state.data.elevation,id:'3',noLine:true},
      {title:'房间号',content:this.state.data.RoomNumber,id:'4',noLine:true},
      {title:'责任部门',content:this.state.data.ResDepart,id:'5',noLine:true},
      {title:'问题描述',content:this.state.data.describe,id:'6',noLine:true},
      {title:'整改描述',content:this.state.data.describe,id:'7',noLine:true},
      {title:'责任班组',content:this.state.data.team,id:'8',noLine:true},
      {title:'截止日期',content:"2017/10/10",id:'9',noLine:true},
      {title:'当前状态',content:"",id:'10',noLine:true},
      {title:'问题提交',content:"2017/10/10",id:'11',noLine:true},
      {title:'问题审核',content:"2017/10/10",id:'12',noLine:true},
      {title:'接受整改',content:"2017/10/10",id:'13',noLine:true},
      {title:'待整改',content:"",id:'14',noLine:true},
    ];

    // 遍历
    for (var i = 0; i<displayAry.length; i++) {
     if (displayAry[i].type == 'devider') {
            itemAry.push(
               <View style={styles.divider}/>
            );
        }else{
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

    const imgs = [{
      url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
    }]

    itemAry.splice(9,0,  this.renderFileView("故障照片",images))
    itemAry.splice(10,0,  this.renderFileView("整改照片",imgs))

  return itemAry;

  }

//整改完成
  RectificationComplete(){

  var time =  Global.formatDate(this.state.data.createTime) + '-' + Global.formatDate(this.state.data.startDate);

    var itemAry = [];//视图数组

    var displayAry = [
      {title:'标题',content:this.state.data.id,id:'0',noLine:true},
      {title:'机组',content:this.state.data.unit,id:'1',noLine:true},
      {title:'厂房',content:this.state.data.wrokshop,id:'2',noLine:true},
      {title:'标高',content:this.state.data.eleration,id:'3',noLine:true},
      {title:'房间号',content:this.state.data.roomno,id:'4',noLine:true},
      {title:'责任部门',content:this.state.data.responsibleDept,id:'5',noLine:true},
      {title:'责任班组',content:this.state.data.responsibleTeam,id:'6',noLine:true},
      {title:'整改日期',content:time,id:'7',noLine:true},
      {title:'问题描述',content:this.state.data.description,id:'8',noLine:true},
      {title:'整改描述',content:this.state.data.description,id:'9',noLine:true},
      {title:'当前状态',content:"",id:'10',noLine:true},
      {title:'问题提交',content:Global.formatDate(this.state.data.createTime),id:'11',noLine:true},
      {title:'问题审核',content:Global.formatDate(this.state.data.startDate),id:'12',noLine:true},
      {title:'问题整改',content:Global.formatDate(this.state.data.startDate),id:'13',noLine:true},
      {title:'整改完成',content:Global.formatDate(this.state.data.endDate),id:'14',noLine:true},
    ];

    // 遍历
    for (var i = 0; i<displayAry.length; i++) {
     if (displayAry[i].type == 'devider') {
            itemAry.push(
               <View style={styles.divider}/>
            );
        }else{
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

    const imgs = [{
      url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
    }]

    itemAry.splice(9,0,  this.renderFileView("故障照片",images))
    itemAry.splice(11,0,  this.renderFileView("整改照片",imgs))

    return itemAry;

  }

  DoNotDeal(){

  var itemAry = [];//视图数组

  var displayAry = [
    {title:'标题',content:this.state.data.id,id:'0',noLine:true},
    {title:'机组',content:this.state.data.unit,id:'1',noLine:true},
    {title:'厂房',content:this.state.data.wrokshop,id:'2',noLine:true},
    {title:'标高',content:this.state.data.eleration,id:'3',noLine:true},
    {title:'房间号',content:this.state.data.roomno,id:'4',noLine:true},
    {title:'责任部门',content:this.state.data.responsibleDept,id:'5',noLine:true},
    {title:'责任班组',content:this.state.data.responsibleTeam,id:'6',noLine:true},
    {title:'问题描述',content:this.state.data.description,id:'7',noLine:true},
    {title:'当前状态',content:"",id:'8',noLine:true},
    {title:'问题提交',content:Global.formatDate(this.state.data.createTime),id:'9',noLine:true},
    {title:'问题审核',content:Global.formatDate(this.state.data.startDate),id:'10',noLine:true},
    {title:'问题审核',content:"不需处理",id:'11',noLine:true},

  ];

  // 遍历
  for (var i = 0; i<displayAry.length; i++) {
   if (displayAry[i].type == 'devider') {
          itemAry.push(
             <View style={styles.divider}/>
          );
      }else{
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

  itemAry.splice(8,0,  this.renderFileView("故障照片",images))

  return itemAry;

  }

  WaitDeal(){

  var itemAry = [];//视图数组

    var time =  Global.formatDate(this.state.data.createTime) + '-' + Global.formatDate(this.state.data.startDate);

  var displayAry = [
    {title:'标题',content:this.state.data.id,id:'0',noLine:true},
    {title:'机组',content:this.state.data.unit,id:'1',noLine:true},
    {title:'厂房',content:this.state.data.wrokshop,id:'2',noLine:true},
    {title:'标高',content:this.state.data.eleration,id:'3',noLine:true},
    {title:'房间号',content:this.state.data.roomno,id:'4',noLine:true},
    {title:'责任部门',content:this.state.data.responsibleDept,id:'5',noLine:true},
    {title:'责任班组',content:this.state.data.responsibleTeam,id:'6',noLine:true},

    {title:'处理时间',content:time ,id:'7',noLine:true},
    {title:'问题描述',content:this.state.data.description,id:'8',noLine:true},

  ];

  // 遍历
  for (var i = 0; i<displayAry.length; i++) {
   if (displayAry[i].type == 'devider') {
          itemAry.push(
             <View style={styles.divider}/>
          );
      }else{
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

  itemAry.push(
   this.renderFileView("故障照片",this.state.data.files)
  )

  itemAry.push(
    this.MutinPutView("整改描述",this.state.recDes,"ZGMS")
  )

  itemAry.push(
    this.renderNewFileView("整改照片")
  )


  return itemAry;

  }

  myQuestion(){

    var itemAry = [];//视图数组

    var displayAry = [
      {title:'标题',content:this.state.data.machineType,id:'0',noLine:true},
      {title:'机组',content:this.state.data.machineType,id:'1',noLine:true},
      {title:'厂房',content:this.state.data.plantType,id:'2',noLine:true},
      {title:'标高',content:this.state.data.elevation,id:'3',noLine:true},
      {title:'房间号',content:this.state.data.RoomNumber,id:'4',noLine:true},
      {title:'责任部门',content:this.state.data.ResDepart,id:'5',noLine:true},
      {title:'问题描述',content:this.state.data.describe,id:'6',noLine:true},
      {title:'整改描述',content:this.state.data.describe,id:'7',noLine:true},
      {title:'责任班组',content:this.state.data.team,id:'8',noLine:true},
      {title:'截止日期',content:"2017/10/10",id:'9',noLine:true},
      {title:'当前状态',content:"",id:'10',noLine:true},
      {title:'问题提交',content:"2017/10/10",id:'11',noLine:true},
      {title:'问题审核',content:"2017/10/10",id:'12',noLine:true},
    ];

    if (this.state.data.rectific) {
      displayAry.push({title:'问题整改',content:this.state.data.rectific,id:'13',noLine:true})
    }

    if (this.state.data.compelete) {
        displayAry.push({title:'整改完成',content:this.state.data.compelete,id:'14',noLine:true})
    }

    if (this.state.data.recPass) {
        displayAry.push({title:'整改审核',content:this.state.data.recPass,id:'15',noLine:true})
    }

    if (this.state.data.save) {
        displayAry.push({title:'存档',content:this.state.data.save,id:'16',noLine:true})
    }


    // 遍历
    for (var i = 0; i<displayAry.length; i++) {
     if (displayAry[i].type == 'devider') {
            itemAry.push(
               <View style={styles.divider}/>
            );
        }else{
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

    const imgs = [{
      url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460'
    }]

    itemAry.splice(9,0,  this.renderFileView("故障照片",images))
    itemAry.splice(10,0,  this.renderFileView("整改照片",imgs))

    return itemAry;


  }


   onCommit() {

   }

  renderItem(){

   if (this.state.data.problemStatus == "Need_Handle") {

      return  this.renderNewQuestion()

   }else if (this.state.data.problemStatus == "Need_Check") {

    return this.Moderated()

  }else if (this.state.data.problemStatus == "Finish" || this.state.data.type == "1007" || this.state.data.type) {
  return this.RectificationComplete()
}else if (this.state.data.problemStatus == "None") {
  return this.DoNotDeal()
}else if (this.state.data.problemStatus == "Renovating") {

if (this.state.detailType == "1003") {
    return this.Rectification()
}else {
    return this.WaitDeal()
}

}else if (this.state.data.type == "1008") {
  return this.myQuestion()
}

  }



  OPinPutView(name,inputs,tag){

    return (
      <View style={styles.topContainer}>
            <Text style={styles.title}> {name} </Text>
           {this.renderInputView(inputs,tag)}
      </View>

    )

  }

  inPutView(name,inputs,tag){

    return (
      <View style={styles.topContainer}>
            <Text style={styles.title}> {name} </Text>
           {this.renderInputView(inputs,tag)}
      </View>
    )

  }

  MutinPutView(name,inputs,tag){

    return (
      <View style={styles.topContainer}>
            <Text style={styles.title}> {name} </Text>
           {this.MutirenderInputView(inputs,tag)}
      </View>
    )

  }

  MutirenderInputView(inputs,tag){

return(
  <View style={styles.MutiborderStyle}>
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
          onPress={this.imageClick.bind(this,i)}>
          <Image resizeMode={'cover'} style={{width:70,height:70,borderWidth:0.5,borderRadius:4}} source={{uri:item['url']}}/>

       </TouchableOpacity>
     );
  })}
 return imageViews;
}

imageClick(index){

  this.props.navigator.push({
      component: ImageShowsUtil,
      props: {
          images:this.state.data.files,
          imageIndex:index,
         }
  })

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

_ontextChange(text,tag){

switch (tag) {
  case "BZ":
    {
        this.setState({team:text})
    }
    break;
  case "SJ":
  {
    this.setState({time:text})
  }
    break;
  case "ZGMS":
  {
    this.setState({recDes:text})
  }

    break;
}
}

  back(){

   this.props.navigator.pop();

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

})
