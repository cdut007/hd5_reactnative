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

import Spinner from 'react-native-loading-spinner-overlay'
import NavBar from '../../common/NavBar'
import CommitButton from '../../common/CommitButton'
import HttpRequest from '../../HttpRequest/HttpRequest'
import Global from '../../common/globals'


import Dimensions from 'Dimensions';
var width = Dimensions.get('window').width;

export default class  CloseProblem extends Component {

  constructor(props) {
    super(props)

     this.state = {
       data : this.props.data,
       loadingVisible:false,
       question:'',
       title: this.props.title ? this.props.title : "关闭任务" ,
     }

  }

  render(){

    return (
        <View style={styles.container}>
            <NavBar
            title = {this.state.title}
            leftIcon={require('../../images/back.png')}
            leftPress={this.back.bind(this)}/>
            <ScrollView>
                   {this.renderItem()}
            </ScrollView>
         {this.renderWaitCommit()}
            <Spinner
                visible={this.state.loadingVisible}
              />
        </View>
    )

  }

  _questtionDescribe(){
    return(
      <View style={styles.questionType}>
       <View style = {{ flexDirection: 'row'}}>
        <View>
        <Text style={{color: '#1c1c1c', fontSize: 16}}>
        问题描述:   </Text>
        </View>

        <View>
           <Text style={{color: '#84ADEA', fontSize: 16}}>
           请填写备注内容...
           </Text>
        </View>

       </View>

        <TextInput
            style={{flex: 1, fontSize: 16, color: '#1c1c1c', padding: 5, textAlignVertical: 'top',}}
            underlineColorAndroid ='transparent'
            multiline = {true}
            onChangeText={(text) => this.setState({ question: text })}
            value={this.state.question} />
      </View>
    )
  }

  renderWaitCommit(){

      if (this.state.data.status == 'PreQCAssign') {
    return    this.renderClose();
      }else if (this.state.data.status == 'PreQCverify'){

  return  this.renderQcCheckFail();

      }

  }

//QC检查不合格
renderQcCheckFail(){

  return(
    <View style={{height:50,width:width,flexDirection:'row'}}>
    <CommitButton title={'提交'}
    onPress={this.QcCheckFail.bind(this)}
      >
    </CommitButton>
    </View>
  )

}

QcCheckFail(){

  Alert.alert('','确认提交?',
            [
              {text:'取消',},
               {text:'确认',onPress:()=> {this.QcCheck()}}
])

}

QcCheck(){

  var paramBody = {
           'note':this.state.question,
           'qcProblrmId' : this.state.data.id,
           'checkResult' : 'Unqualified',

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


//关闭任务
renderClose(){

  return(
    <View style={{height:50,width:width,flexDirection:'row'}}>
    <View style={{height:50,flex:1}}>
      <CommitButton
        title={'质量问题单'}
        onPress={this.startQuality.bind(this)}
      containerStyle={{backgroundColor:'#ffffff'}}
        titleStyle={{color: '#f77935'}}
  >
      </CommitButton>
      </View>

    <CommitButton title={'关闭任务'}
    onPress={this.commit.bind(this)}
      >
    </CommitButton>
    </View>
  )

}

  startQuality(){

    Alert.alert('','开启质量问题单?',
              [
                {text:'取消',},
                 {text:'确认',onPress:()=> {this.confirmReject()}}
  ])

  }


  confirmReject(){

    this.setState({
             loadingVisible: true
         });

         var paramBody = {
                 'qualityFlag':true,
                  'qcProblrmId' : this.state.data.id,
                  'note' : this.state.question,
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

  commit(){


    Alert.alert('','确认关闭任务?',
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
            'qualityFlag' : false,
            'qcProblrmId' : this.state.data.id,
            'note' : this.state.question,
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

  onDeliverySuccess(response){

      this.setState({
          loadingVisible: false
      });

      Global.showToast(response.message);

    this.props.navigator.popToTop();

  }

  back(){

      this.props.navigator.pop();

  }

  renderItem(){
    return this._questtionDescribe();
  }

}

const styles = StyleSheet.create({

  container: {
      flex: 1,
      backgroundColor: '#f2f2f2',
  },

  questionType:{
    backgroundColor: 'white',
     height: 200,
      paddingTop: 10,
      paddingLeft: 10,
      marginTop:10,
  },

})
