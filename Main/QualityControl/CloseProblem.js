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
     }

  }

  render(){

    return (
        <View style={styles.container}>
            <NavBar
            title={"关闭任务"}
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

  return(
    <View style={{height:50,width:width,flexDirection:'row'}}>
    <CommitButton title={'关闭任务'}
    onPress={this.commit.bind(this)}
      >
    </CommitButton>
    </View>
  )

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
            'qcProblrmId' : this.state.data.id,
            'checkResult' : "Close",
            'note' : this.state.question,
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
