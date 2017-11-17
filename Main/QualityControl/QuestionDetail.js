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

var width = Dimensions.get('window').width;
var historyData = new FormData()


export default class QuestionDetail extends Component {


  constructor(props) {
    super(props)

     this.state = {
       data : this.props.data,
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
        </View>
    )

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
    displayAry.push({title:'问题描述',content:this.state.data.notes,id:'15',noLine:true})
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

      componentWillMount(){

      // this.figureDatas();

      this.figureFiles();

      }

      figureFiles(){

      problemFiles = [];
      solveFiles = [];
      solveAgainFiles = [];

        this.state.data.files.forEach((item) => {
           item['url'] = item['path'];
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

   topflexContainer: {
              height: 60,
              backgroundColor: '#ffffff',
              flexDirection: 'row',
              marginBottom:10,
          },

})
