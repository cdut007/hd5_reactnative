import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    TouchableNativeFeedback,
    TouchableHighlight,
    Picker,
    AsyncStorage,
    TextInput,
    ScrollView,
    BackAndroid
} from 'react-native';


import CommitButton from '../../common/CommitButton'
import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions'
import LoginView from '../../Login/LoginView'
var Global = require('../../common/globals');
var width = Dimensions.get('window').width;

import DisplayItemView from '../../common/DisplayItemView';

import DisplayMoreItemView from '../../common/DisplayMoreItemView';

import CircleLabelDepartView from '../../common/CircleLabelDepartView';

import ChooseMemberListView from './ChooseMemberListView'

import HttpRequest from '../../HttpRequest/HttpRequest'

export default class ChooseMemberView extends Component {
    constructor(props) {
        super(props)
        var title = "通告接收人员"
        if (this.props.meeting) {
            title = "参会人员"
        }
        this.state = {

            title:title,
            department:[],
        }
    }


    back() {
        this.refresh()
        this.props.navigator.pop()
    }




        componentDidMount() {

            BackAndroid.addEventListener('harwardBackPress', () => {
                        this.refresh()
                      return false;
          });

            var me = this
            AsyncStorage.getItem('k_department_node',function(errs,result)
            {
                if (!errs && result && result.length)
                {
                    me.setState({department: JSON.parse(result)})
                }
                else
                {

                }
            });
            this.executeDepartMentRequest();
            }


            onGetDataSuccess(response,paramBody){
                 Global.log('onGetDataSuccess@@@@')
                 var result = response.responseResult;
                 if (!result || result.length == 0) {
                     return
                 }
                 var department = []
                 var departmentNode = result[0].children
                 if (!departmentNode) {
                      Global.log('departmentNode not exsit@@@@')
                      return
                 }
                 //get first node for department
                 for (var i = 0; i < departmentNode.length; i++) {
                        department.push(departmentNode[i])
                 }
                  Global.log(' node department lengh==@@@@'+department.length)
                 this.setState({department:department})

                 AsyncStorage.setItem('k_department_node', JSON.stringify(department), (error, result) => {
                     if (error) {
                         Global.log('save k_department_node faild.')
                     }
                 });
            }

    executeDepartMentRequest(){

      Global.log('executeDepartMentRequest ')
      var loading = false;



       this.setState({
         isLoading: loading,
       });


                        var paramBody = {

                            }

            HttpRequest.get('/department', paramBody, this.onGetDataSuccess.bind(this),
                (e) => {

                    this.setState({
                      isLoading: false,
                      isRefreshing:false,
                    });
                    try {
                        var errorInfo = JSON.parse(e);
                        if (errorInfo != null) {
                         Global.log(errorInfo)
                        } else {
                            Global.log(e)
                        }
                    }
                    catch(err)
                    {
                        Global.log(err)
                    }

                    Global.log('Task error:' + e)
                })
    }
    componentWillUnmount() {
              BackAndroid.removeEventListener('hardwareBackPress');
          }

  saveTopic(){

      this.back()
  }

  refresh(){
      this.setState({...this.state})
  }

  chooseMember(memberData){
      this.props.navigator.push({
          component: ChooseMemberListView,
           props: {
               data:this.props.data,
               department:memberData,
               refresh:this.refresh.bind(this)
              }
      })
  }

   renderItems(){

       if (true) {
           var displayArr = []
           for (var i = 0; i < this.state.department.length; i++) {
               var item = this.state.department[i]

              displayArr.push(<TouchableOpacity key={i} onPress={this.chooseMember.bind(this,item)}  style={styles.flexContainer}>
                          <CircleLabelDepartView
                              department =  {item.name}
                          />

                      <Text style={[styles.content,{marginLeft:10,fontSize:16,color:'#555555',}]}>
                       {item.name}
                      </Text>

                      <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end', alignItems: 'center',}}>

                      <Image style={{width:24,height:24,}} source={require('../../images/newIcon.png')} />

                      </View>


                      </TouchableOpacity>)
                      displayArr.push(  <View style={styles.line}>
                        </View>)
           }

           return displayArr
       }
   }

    render() {
        var members='0人'
         if (this.props.data.members) {
             members = this.props.data.members.length+'人'
         }
            return (
                <View style={styles.container}>
                    <NavBar
                        title={this.state.title}
                        leftIcon={require('../../images/back.png')}
                        leftPress={this.back.bind(this)} />
                        <ScrollView
                        style={styles.mainStyle}>
                        <DisplayItemView
                         title={'参会总人数'}
                         detail={members}
                        />

                        {this.renderItems()}

                        </ScrollView>

                </View>
            )

        }





}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    flexContainer: {
           height: 48,
           width: width,
           backgroundColor: '#ffffff',
           // 容器需要添加direction才能变成让子元素flex
           flexDirection: 'row',
           alignItems: 'center',
           padding:10,
    },
    line: {
    backgroundColor: '#f2f2f2',
    width: width,
    height: 1,
    },
})
