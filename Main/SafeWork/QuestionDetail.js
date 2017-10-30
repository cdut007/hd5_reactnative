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
    Platform

} from 'react-native';

import Dimensions from 'Dimensions';
import NavBar from '../../common/NavBar'
import DisplayItemView from '../../common/DisplayItemView'
import ImageShowsUtil from '../../common/ImageShowUtil'
import CommitButton from '../../common/CommitButton'
import ImagePicker from 'react-native-image-picker'

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
       newFileArr:[{}]//新的图片
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
        </View>
    )

  }

  renderCommitBtn(){

    if (this.state.data.problemStatus == "Need_Handle") {
   return this.renderNewCommit();
 }else if (this.state.data.type == "1002") {
      return this.renderModeratedCommit();
 }else if (this.state.data.type == "1006") {
    return this.renderWaitCommit();
 }


  }

  renderWaitCommit(){

return(
    <View style={{height:50,width:width,flexDirection:'row'}}>
    <CommitButton title={'提交整改结果'}>
    </CommitButton>
    </View>
)

  }

  renderModeratedCommit(){

    return(
      <View style={{height:50,width:width,flexDirection:'row'}}>
    <View style={{height:50,flex:1}}>
      <CommitButton
        title={'重新整改'}
      containerStyle={{backgroundColor:'#ffffff'}}
        titleStyle={{color: '#f77935'}}>
      </CommitButton>
      </View>
      <View style={{height:50,flex:1}}>
        <CommitButton
          title={'通过'}>
        </CommitButton>
      </View>
      </View>)

  }

  renderNewCommit(){

    return(
      <View style={{height:50,width:width,flexDirection:'row'}}>
    <View style={{height:50,flex:1}}>
      <CommitButton
        title={'退回'}
      containerStyle={{backgroundColor:'#ffffff'}}
        titleStyle={{color: '#f77935'}}>
      </CommitButton>
      </View>
      <View style={{height:50,flex:1}}>
        <CommitButton
          title={'核实'}>
        </CommitButton>
      </View>
      </View>)
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
      this.renderFileView("照片",images)
    );

    itemAry.push(
     this.inPutView("整改时间:",this.state.time,"SJ")
    );

    return itemAry;


  }

//待处理
  Moderated(){

  var itemAry = [];//视图数组

  var displayAry = [
    {title:'标题',content:this.state.data.machineType,id:'0',noLine:true},
    {title:'机组',content:this.state.data.machineType,id:'1',noLine:true},
    {title:'厂房',content:this.state.data.plantType,id:'2',noLine:true},
    {title:'标高',content:this.state.data.elevation,id:'3',noLine:true},
    {title:'房间号',content:this.state.data.RoomNumber,id:'4',noLine:true},
    {title:'责任部门',content:this.state.data.ResDepart,id:'5',noLine:true},
    {title:'责任班组',content:this.state.data.team,id:'6',noLine:true},
    {title:'问题描述',content:this.state.data.describe,id:'7',noLine:true},
    {title:'整改时间',content:this.state.data.describe,id:'8',noLine:true},
    {title:'整改描述',content:this.state.data.describe,id:'9',noLine:true},
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

  itemAry.splice(8,0,  this.renderFileView("照片",images))
  itemAry.push(this.renderFileView("整改照片",imgs))

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
      {title:'问题整改',content:"2017/10/10",id:'13',noLine:true},
      {title:'整改完成',content:"2017/10/10",id:'14',noLine:true},
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

  DoNotDeal(){

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
    {title:'当前状态',content:"",id:'9',noLine:true},
    {title:'问题提交',content:"2017/10/10",id:'10',noLine:true},
    {title:'问题审核',content:"2017/10/10",id:'11',noLine:true},
    {title:'问题审核',content:"不需处理",id:'12',noLine:true},

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

  itemAry.splice(9,0,  this.renderFileView("故障照片",images))

  return itemAry;

  }

  WaitDeal(){

  var itemAry = [];//视图数组

  var displayAry = [
    {title:'标题',content:this.state.data.machineType,id:'0',noLine:true},
    {title:'机组',content:this.state.data.machineType,id:'1',noLine:true},
    {title:'厂房',content:this.state.data.plantType,id:'2',noLine:true},
    {title:'标高',content:this.state.data.elevation,id:'3',noLine:true},
    {title:'房间号',content:this.state.data.RoomNumber,id:'4',noLine:true},
    {title:'责任部门',content:this.state.data.ResDepart,id:'5',noLine:true},
    {title:'责任班组',content:this.state.data.team,id:'6',noLine:true},
    {title:'问题描述',content:this.state.data.describe,id:'7',noLine:true},
    {title:'处理时间',content:"2017/10/10",id:'8',noLine:true},
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

   }else if (this.state.data.type == "1002") {

    return this.Moderated()

  }else if (this.state.data.type == "1003") {

  return this.Rectification()

}else if (this.state.data.type == "1004" || this.state.data.type == "1007" || this.state.data.type) {
  return this.RectificationComplete()
}else if (this.state.data.type == "1005") {
  return this.DoNotDeal()
}else if (this.state.data.type == "1006") {
  return this.WaitDeal()
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
          images:this.state.fileArr,
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
}

})
