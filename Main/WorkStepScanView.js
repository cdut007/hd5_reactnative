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
    ScrollView,
    TextInput
} from 'react-native';

import HttpRequest from '../HttpRequest/HttpRequest'
import NavBar from '../common/NavBar'
import EnterItemView from '../common/EnterItemView';
import DisplayItemView from '../common/DisplayItemView';
import DisplayMoreItemView from '../common/DisplayMoreItemView';
import Dimensions from 'Dimensions'
import CommonContentView from './CommonContentView';
import LoginView from '../Login/LoginView'
var Global = require('../common/globals');
var width = Dimensions.get('window').width;
import dateformat from 'dateformat'

export default class WorkStepScanView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data:this.props.data,
        };
    }


    back() {
        this.props.navigator.pop()
    }


        componentDidMount() {
            this.onGetWorkStepDetailSuccess()

        }

        onGetWorkStepDetailSuccess(){
            var paramBody = {
                }
            HttpRequest.get('/hdxt/api/baseservice/workstep/'+this.state.data.id, paramBody, this.onGetWorkStepDetailSuccess.bind(this),
                (e) => {
                    try {
                        alert(e)
                    }
                    catch (err) {
                        console.log(err)
                    }
                })
        }

        onGetWorkStepDetailSuccess(response) {
            console.log('onGetWorkStepDetailSuccess:' + JSON.stringify(response))
            // var item = response.responseResult;
            //
            // this.setState({
            //     data: item
            // })
        }


    onItemClick(menu){
        this.props.navigator.push({
            component: CommonContentView,
             props: {
                 title:'见证人描述－－'+menu.data.witnesserName,
                 content:menu.data.noticeresultdesc,
                }
        })

    }


    getQCCheckStatus(sign){
        if (sign == 0) {
         return "未确认";
     }else if (sign == 1) {
         return "确认";
     }else if (sign == 2) {
         return "退回";
     }
        return '';
    }

    renderItem() {
               // 数组
               var itemAry = [];
               // 颜色数组
               var desc = '见证合格';
               if (this.state.data.operatedesc) {
                   desc = this.state.data.operatedesc;
               }

               var displayAry = [{title:'操作者',content:this.state.data.operater,id:'0'},
                 {title:'描述',content:desc,id:'1',type:'displayMore'},

           ];


           if (this.state.data.witnesserb
               || this.state.data.witnesserc
               || this.state.data.witnesserd
               || this.state.data.noticeaqa
               || this.state.data.noticeaqc1
               || this.state.data.noticeaqc2 ) {
               if (this.state.data.stepflag == 'DONE') {


                    if (this.state.data.witnessInfo && this.state.data.witnessInfo.length > 0) {
                            var witnessInfo = this.state.data.witnessInfo[0];
                        displayAry.push({title:'见证地点',id:'2',content:witnessInfo.witnessaddress,});
                        var witnessDate = dateformat(witnessInfo.witnessdate, 'yyyy-mm-dd HH:MM:ss')
                        displayAry.push({title:'见证时间',id:'3',content:witnessDate,});

                        for (var i = 0; i < this.state.data.witnessInfo.length; i++) {
                            var witnesser = this.state.data.witnessInfo[i];
                            if (witnesser.noticeType == 'W') {
                                displayAry.push({title:'通知点(W)',id:'21',content:witnesser.witnesserName,});
                            }else if (witnesser.noticeType == 'H') {
                                displayAry.push({title:'通知点(H)',id:'22',content:witnesser.witnesserName,});
                            }else if (witnesser.noticeType == 'R') {
                                displayAry.push({title:'通知点(R)',id:'23',content:witnesser.witnesserName,});
                            }
                        }
                    }

                    if (this.state.data.witnessesAssign && this.state.data.witnessesAssign.length > 0) {
                        for (var i = 0; i < this.state.data.witnessesAssign.length; i++) {
                            var witnessInfo = this.state.data.witnessesAssign[i];
                             var okType = '合格';
                             if (witnessInfo.isok == '1') {
                                 okType = '不合格';
                             }
                             if (witnessInfo.isok == '0' || !witnessInfo.isok) {
                                 okType =" 未见证";
                             }else{
                                 okType =" 见证"+okType;
                             }
                             displayAry.push({title:witnessInfo.witnesserName+okType,id: 'w'+i,type:'enter',data:witnessInfo});
                        }
                    }

                    if (this.state.data.rollingPlan) {
                        if (this.state.data.rollingPlan.qcman) {
                            if (this.props.lastItem) {
                                    displayAry.push({title:'QC检查完成',id:'a',content:this.getQCCheckStatus(this.state.data.rollingPlan.qcsign),},);
                                    displayAry.push({title:'QC确认人',id:'b',content:this.state.data.rollingPlan.qcman,},);
                                        var qcdate = dateformat(this.state.data.rollingPlan.qcdate, 'yyyy-mm-dd HH:MM:ss')
                                    displayAry.push({title:'QC确认日期',id:'c',content:qcdate,},);
                            }
                        }
                    }


               }
           }



               // 遍历
               for (var i = 0; i<displayAry.length; i++) {
                   if (displayAry[i].type == 'enter') {
                       itemAry.push(
                           <EnterItemView key={displayAry[i].id}
                            title={displayAry[i].title}
                            onPress = {this.onItemClick.bind(this,displayAry[i])}
                           />
                       );
                   } else if (displayAry[i].type == 'devider') {
                       itemAry.push(
                          <View style={styles.divider}/>
                       );
                   } else if (displayAry[i].type == 'displayMore') {
                       itemAry.push(
                           <DisplayMoreItemView key={displayAry[i].id}
                            title={displayAry[i].title}
                            detail={displayAry[i].content}
                           />
                       );
                   }else{
                       itemAry.push(
                           <DisplayItemView key={displayAry[i].id}
                            title={displayAry[i].title}
                            detail={displayAry[i].content}
                           />
                       );
                   }

               }
               return itemAry;
           }

           renderDetailView(){
                   return(<ScrollView
                   keyboardDismissMode='on-drag'
                   keyboardShouldPersistTaps={false}
                   style={styles.mainStyle}>
                              {this.renderItem()}
                          </ScrollView>);
           }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title={this.state.data.stepname}
                    leftIcon={require('../images/back.png')}
                    leftPress={this.back.bind(this)} />
                    {this.renderDetailView()}
            </View>
        )
    }


}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    divider: {
    backgroundColor: '#8E8E8E',
    width: width,
    height: 8,
    },
    mainStyle: {
        width: width,
    },
    item: {
    width: width,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    height:50,
    justifyContent: 'center',
    alignItems: 'center',
    },

    centerLayout:{
      justifyContent:'center',
      alignItems:'center',
    },
    itemLayout:{
        backgroundColor:'#ffffff',
        justifyContent:'center',
        width:width,
        height:50,
        alignItems:'center',
    },


    defaultText:{
            color: '#000000',
            fontSize:16,
            justifyContent: "center",
            alignItems: 'center',
    },

       itemLine:{
           width: width,
           height: 1,
           backgroundColor: '#cccccc',
       },
})
