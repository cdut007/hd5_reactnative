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

import NavBar from '../../common/NavBar';
import DisplayItemView from '../../common/DisplayItemView'
import Dimensions from 'Dimensions'
import ImageShowsUtil from '../../common/ImageShowUtil'
import Spinner from 'react-native-loading-spinner-overlay'
import HttpRequest from '../../HttpRequest/HttpRequest'
import Global from '../../common/globals'

const SAFEWORK_ISSUE_COMMIT_URL = '/hse/create'
var width = Dimensions.get('window').width;

String.prototype.startWith=function(str){
  var reg=new RegExp("^"+str);
  return reg.test(this);
}

export default  class  MyReport extends Component {

  constructor(props) {
      super(props)
  this.state = {
    title: "我的上报",
    reportData:this.props.data,
    fileArr:[],
    loadingVisible:false,
  }
  }

  back() {

      this.props.navigator.pop()
  }

//新增
  render() {
      return (
          <View style={styles.container}>
              <NavBar
              title={this.state.title}
              leftIcon={require('../../images/back.png')}
              leftPress={this.back.bind(this)}/>
            <ScrollView style={{marginRight:12}}>
                     {this._renderItem()}
                     {this.renderFileView()}
            </ScrollView>
            {this._CommitButton()}
            <Spinner
                visible={this.state.loadingVisible}
            />
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

 _filterDatas(){

  this.state.fileArr = [];

    this.state.reportData.images.forEach((item) => {
    if (item['fileSource']) {

      this.state.fileArr.push(item);

    }
  })



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

  renderImages(){

   {this._filterDatas()}

    var imageViews = [];
    {this.state.fileArr.map( (item,i) => {

       imageViews.push(
         <TouchableOpacity
            key={i}
            style={{width:70,height:70,marginLeft:10,marginBottom:10}}
            onPress={this.imageClick.bind(this,i)}>
            <Image resizeMode={'cover'} style={{width:70,height:70,borderWidth:0.5,borderRadius:4}} source={{uri:item['fileSource']}}/>

         </TouchableOpacity>
       );
    })}
   return imageViews;
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
 )
}

 onCommit() {

   Alert.alert('','提交?',
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

    param.append('unit', this.state.reportData.machineType);
    param.append('wrokshop', this.state.reportData.plantType);
    param.append('eleration', this.state.reportData.elevation);
    param.append('roomno', this.state.reportData.RoomNumber);
    param.append('description', this.state.reportData.questions);
    param.append('responsibleDeptId', this.state.reportData.ResDepart);

    this.state.fileArr.map((item, i) => {
        if (item['fileSource']) {
           let file = {uri: item['fileSource'], type: 'multipart/form-data', name: item['fileName']};   //这里的key(uri和type和name)不能改变,
           param.append("file",file);   //这里的files就是后台需要的key
        }
    });

    HttpRequest.uploadImage(SAFEWORK_ISSUE_COMMIT_URL, param, this.onCommitIssueSuccess.bind(this),
        (e) => {
            try {
                Global.alert(e)
            }
            catch (err) {
                console.log(err)
            }

            this.setState({
                loadingVisible: false
            })
        })

   }

   onCommitIssueSuccess(response) {

     this.setState({
         loadingVisible: false
     })

      // Global.alert(response.message)
      this.props.navigator.popToTop()

   }

   _renderItem(){

    //视图数组
   var itemAry = [];
   //数据

  var displayAry = [
  {title:'机组',content:this.state.reportData.machineType,id:'0',noLine:true},
  {title:'厂房',content:this.state.reportData.plantType,id:'1',noLine:true},
  {title:'标高',content:this.state.reportData.elevation,id:'2',noLine:true},
  {title:'房间号',content:this.state.reportData.RoomNumber,id:'3',noLine:true},
  {title:'责任部门',content:this.state.reportData.ResDepart,id:'4',noLine:true},
  {title:'责任班组',content:this.state.reportData.ResTeam + "(选填)",id:'5',noLine:true},
  {title:'问题描述',content:this.state.reportData.questions,id:'6',noLine:true},
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

  return itemAry;

  }

}

const styles = StyleSheet.create({

  container: {
      flex: 1,
      backgroundColor: '#ffffff'
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
