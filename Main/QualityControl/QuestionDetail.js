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
  }

}

renderQcAssign(){

  return(
    <View style={{height:50,width:width,flexDirection:'row'}}>

    <View style={{height:50,flex:1}}>
      <CommitButton
        title={'质量问题单'}
        onPress={this.startQuality.bind(this)}
        >
      </CommitButton>
    </View>

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


      if ( Global.isQCManager(Global.UserInfo) && this.state.data.status == 'PreQCLeaderAssign') {
        itemAry.push(this.renderSelectView(this.state.qcdetail,assinList,"选择QC"))
      }

      if (this.state.data.status == 'PreQCAssign') {
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

})
