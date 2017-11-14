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

import Dimensions from 'Dimensions'
import NavBar from '../../common/NavBar';
import MemberSelectView from '../../common/MemberSelectView'
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
var machineTypes = ['机组1','机组2','机组3','机组4','机组5'];
var PlantTypes = ['子项1','子项2','子项3','子项4','子项5'];
var DepartTypes = [1,2,3,4,5];
var TeamTypes = ['责任班组1','责任班组2','责任班组3','责任班组4','责任班组5'];

export  default class ProblemReport extends Component {

  constructor(props) {
      super(props)

      this.state = {
          machineType: '选择机组',
          plantType: '选择子项',
          elevation: '', //标高
          RoomNumber:'',//房间号
          system_no:'',
          ResDepart:'选择责任部门',
          ResTeam:'选择责任班组',
          question:'',
          fileArr: [{}],//装图片资源的数组
      }
  }

  back() {
      this.props.navigator.pop()
  }

  render() {
      return (
          <View style={styles.container}>

               <View style={styles.content}>
                 {this._ContentView()}
                 {this._CommitButton()}
               </View>

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
      {title:'机组:',id:'choose_machiche',pickerTitle:"选择机组",content:this.state.machineType,data:machineTypes,type:'choose',refence:this.mac_ref},
      {title:'子项:',id:'choose_platHouse',pickerTitle:"选择子项",content:this.state.plantType,data:PlantTypes,type:'choose',refence:this.sub_ref},
      {title:'楼层:',id:'elevation',content:this.state.elevation,type:'input'},
      {title:'房间号:',id:'room_no',content:this.state.RoomNumber,type:'input'},
      {title:'系统(选填):',id:'system_no',content:this.state.system_no,type:'input'},
      {title:'责任部门:',id:'choose_des',pickerTitle:"选择责任部门",content:this.state.ResDepart,data:DepartTypes,type:'choose',refence:this.resP_ref},
      {title:'责任班组(选填):',id:'choose_team',pickerTitle:"选择责任班组",content:this.state.ResTeam,data:TeamTypes,type:'choose',refence:this.team_ref},
      {type:'describe'},
      {type:'file'},

];


// 遍历
for (var i = 0; i<displayAry.length; i++) {

  if (displayAry[i].type == 'choose') {

   itemAry.push(
        this._SelectView(displayAry[i].title,displayAry[i].content,displayAry[i].data,displayAry[i].pickerTitle,displayAry[i].id,displayAry[i].refence)
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

  onCommit() {

    if (this.state.machineType == '选择机组') {
      alert("请选择机组");
      return;
    }

    if (this.state.plantType == '选择厂房') {
      alert("请选择厂房");
      return;
    }
    if (!this.state.elevation.length) {
      alert("请输入标高");
      return;
    }
    if (!this.state.RoomNumber.length) {
      alert("请输入房间号");
      return;
    }
     if (this.state.ResDepart == '选择责任部门') {
       alert("请选择责任部门");
       return;
     }
     if (!this.state.question.length) {
       alert("请输入问题描述");
       return;
     }
     if(this.state.fileArr.length<=1){
         alert('请选择至少一张问题图片');
         return;
     }

     let team;
     if (this.state.ResTeam == '选择责任班组') {
       team = "        ";
     }else {
       team = this.state.ResTeam;
     }



    //  this.props.navigator.push({
    //      component: MyReport,
    //      props: {
    //          data:reportData,
    //         }
    //  })

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

  switch (tag) {
    case "elevation":
      {
          this.setState({elevation:text})
      }
      break;
      case "room_no":
      {
         this.setState({RoomNumber:text})
      }
        break;
      case "system_no":
        this.setState({system_no:text})
        break;
  }
  }

  _SelectView(name,title,datas,pickerTitle,pickerType,refence){

      return(
        <View style={styles.topContainer}>
              <Text style={styles.title}> {name} </Text>
              {this.renderSelectView(title,datas,pickerTitle,pickerType,refence)}
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

  renderSelectView(title,datas,pickerTitle,pickerType,refence) {
      return(
        <View style={styles.borderStyle}>
      <TouchableOpacity onPress={() => refence.onPickClick()} style={styles.touchStyle}>
        <MemberSelectView
        ref={(c) => refence = c}
         style={styles.textStyle}
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
     }
       break;
      case "choose_des":
      {
         this.setState({ResDepart:data[0]})
      }
        break;
        case "choose_team":
        {
          this.setState({ResTeam:data[0]})
        }
          break;
   }

      // this.setState({machineType: data[0]})
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
      paddingLeft:10,
      paddingRight:10,
      backgroundColor:'#ffffff',
      marginTop: 30,
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
      height: 36,
      flexDirection:'row',
      borderColor : '#f77935',
      borderWidth:0.5,
      borderRadius : 4,
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
  });
