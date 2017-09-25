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
    ScrollView,
    AsyncStorage
} from 'react-native';
import Dimensions from 'Dimensions';
import NavBar from '../common/NavBar';
import px2dp from '../common/util';
import HttpRequest from '../HttpRequest/HttpRequest'
import DisplayItemView from '../common/DisplayItemView';
import EnterItemView from '../common/EnterItemView';
import CommonContentView from './CommonContentView';


import dateformat from 'dateformat';
import Accordion from 'react-native-collapsible/Accordion';

import Global from '../common/globals.js'
import CommitButton from '../common/CommitButton'
import MemberSelectView from '../common/MemberSelectView'
const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var account = Object();

export default class SolverIssueDetailView extends Component {
    constructor(props) {
        super(props);
        var data = this.props.data
        data.rollingPlan = new Object()
        this.state = {
            title: '问题详情',
            data:data,
            rolve_member:null,
            members:[],

        };
    }


    componentDidMount() {

        this.executeNetWorkRequest(this.props.data.id);
    }

     onGetDataSuccess(response){
         console.log('onGetDataSuccess@@@@')
         var membersArray = []
         if (response.responseResult.userList) {
             for (var i = 0; i < response.responseResult.userList.length; i++) {
                 membersArray.push(response.responseResult.userList[i].realname)
             }
         }
         this.setState({
             data:response.responseResult,
             members:membersArray
         });
     }

    executeNetWorkRequest(id){
         console.log('executeNetWorkRequest:work id = ' + id);
         var paramBody = {
             questionId:id
             }

    HttpRequest.get('/question/assignUI', paramBody, this.onGetDataSuccess.bind(this),
        (e) => {

            try {
                var errorInfo = JSON.parse(e);
                if (errorInfo != null) {
                 console.log(errorInfo)
                } else {
                    console.log(e)
                }
            }
            catch(err)
            {
                console.log(err)
            }

            console.log('executeNetWorkRequest error:' + e)
        })
    }


    componentWillMount(){

    }

    back() {
        this.props.navigator.pop()
    }

    render() {

        return (

            <View style={styles.container}>
            <NavBar title={this.state.title}
            leftIcon={require('../images/back.png')}
            leftPress={this.back.bind(this)}
            />
            {this.renderTop()}
            <View style={{backgroundColor:'#f2f2f2',height:10,width:width}}></View>
             {this.renderDetailView()}
             {this.renderFormView()}
            </View>
        )
    }



startProblem(){

}
    renderFormView(){
            //1  fininshed retun, jsut san

            if (Global.isMonitor(Global.UserInfo)) {

                return(<View style={{height:50,width:width,flexDirection:'row'}}>
                        <View style={{height:50,flex:1}}><CommitButton title={'提交'}
                                onPress={this.startProblem.bind(this)}></CommitButton></View>
                                </View>)

            }else if (Global.isCaptain(Global.UserInfo)) {


            }

    }

    renderTop(){
        if(Global.isMonitor(Global.UserInfo) || Global.isSolverMember(Global.UserInfo) ){
            return
        }
        var info = '未指派'
        //状态:pre待解决、undo待确认、unsolved仍未解决、solved已解决
        var color = '#777777'
        if (this.props.data.status!='pre') {
            info = '指派给:'+rowData.designee.realname
            color = '#777777'
        }

        return(<View style={styles.statisticsflexContainer}>

        <View style={styles.cell}>

          <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:4,}}>
            提问时间
          </Text>
          <Text numberOfLines={1} style={{color:'#777777',fontSize:14,}}>
            {this.props.data.questionTime}
          </Text>
        </View>


        <View style={styles.cell}>

        <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:4,}}>
          指派给
        </Text>
        <Text style={{color:color,fontSize:14,}}>
        {info}
        </Text>
        </View>



        <View style={styles.cell}>


        <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:4,}}>
          当前状态
        </Text>
        <Text style={{color:'#e82628',fontSize:14,}}>
          待解决
        </Text>
        </View>

        </View>
)
    }

    renderDetailView(){
            return(<ScrollView
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps={false}
            style={styles.mainStyle}>
                {this.renderItem()}
                   </ScrollView>);
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

    go2WorkStepDetail(){

    }

    go2ZhijiaUpdate(){

    }



    issueDetail(){
        // this.props.navigator.push({
        //     component: PlanIssueListView,
        //      props: {
        //
        //          data:this.state.data,
        //         }
        // })
    }



    onItemClick(menu){
         console.log('menu:work id = ' + menu.id);
        if (menu.id == '9') {

        } if (menu.id == 'c') {
            this.setState({displayMore:!this.state.displayMore});
        } else if (menu.id == '10') {
        } else if (menu.id == '-1') {
        } else if (menu.id == 'e9') {
        } else {
            try {
                var  index = parseInt(menu.id);
                if (index >=11 && index<= 15) {
                    this.go2ItemDetail(menu);
                }
            }
            catch(err)
            {
                console.log(err)
            }
        }

    }


        onSelectedMember(member){
            this.state.rolve_member = member[0]
            this.setState({...this.state});
            console.log(JSON.stringify(member)+"member====");

        }

    renderMemberItem(displayItem){
        var displayMember = displayItem.content
        if (!displayItem.content) {
            displayMember = '选择问题解决人'
        }
        return(<View style={[styles.cell,{alignItems:'center',padding:10,backgroundColor:'#f2f2f2'}]}>

            <TouchableOpacity style={{borderWidth:0.5,
                  alignItems:'center',
                  borderColor : '#f77935',
                  backgroundColor : 'white',
                  borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:10,paddingRight:10,paddingTop:8,paddingBottom:8}}>

            <MemberSelectView
            style={{color:'#f77935',fontSize:14,flex:1}}
            title={displayMember}
            data={this.state.members}
             pickerTitle={'选择人员'}
            onSelected={this.onSelectedMember.bind(this)} />
                                <Image
                                style={{width:20,height:20,}}
                                source={require('../images/unfold.png')}/>
            </TouchableOpacity>

            </View>)
    }

    renderItem() {
               // 数组
               var itemAry = [];
               // 颜色数组
               var problem_type = '技术问题'
               if (this.state.data.questionType == 'tecknicalMatters') {
                   problem_type = '技术问题'
               }else{
                   problem_type = '协调问题'
               }
               var displayAry = [
                       {title:'问题描述',content:this.state.data.describe,id:'a1'},
                        // {title:'附件',content:this.state.data.files,id:'a2',type:'file'},
                      {type:'devider'},

           ];

           if (Global.isMonitor(Global.UserInfo)) {
                   displayAry.push({title:'选择问题解决人',content:this.state.rolve_member,id:'a3',type:'problem_member'})
           }

                displayAry.push({title:'问题类型',content:problem_type,id:'a3'})
                displayAry.push({type:'devider'},);
                displayAry.push( {title:'作业条目编号',content:this.state.data.rollingPlan.workListNo,id:'0'})
                displayAry.push( {title:'点数',content:this.state.data.rollingPlan.points,id:'1'})
                displayAry.push({title:'机组号',content:this.state.data.rollingPlan.unitNo,id:'2'})
                displayAry.push( {title:'质量计划号',content:this.state.data.rollingPlan.qualityplanno,id:'3'})
                displayAry.push({title:'图纸号',content:this.state.data.rollingPlan.drawingNo,id:'5'},);
                displayAry.push({title:'房间号',content:this.state.data.rollingPlan.roomNo,id:'b1'},);
                displayAry.push({title:'工程量编号',content:this.state.data.rollingPlan.projectNo,id:'b2'},);
                displayAry.push({title:'工程量类别',content:this.state.data.rollingPlan.projectType,id:'b3'},);
                displayAry.push({title:'焊口／支架',content:this.state.data.rollingPlan.weldno,id:'b4'},);
                displayAry.push({type:'devider'},);


               // 遍历
               for (var i = 0; i<displayAry.length; i++) {
                   if (displayAry[i].type == 'problem_member') {
                       itemAry.push(
                          this.renderMemberItem(displayAry[i])
                       );
                   } else if (displayAry[i].type == 'devider') {
                       itemAry.push(
                          <View style={styles.divider}/>
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


}


const styles = StyleSheet.create({
    container: {
        flex:1,
        width:width,
        height:height,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    divider: {
    backgroundColor: '#f2f2f2',
    width: width,
    height: 10,
},
    mainStyle: {
        width: width,
        flex:1,
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
       statisticsflexContainer: {
                height: 60,
                backgroundColor: '#ffffff',
                flexDirection: 'row',
            },

      cell: {
          flex: 1,
          height: 60,
          justifyContent: "center",
          alignItems: 'center',
           flexDirection: 'column',
      },

      cellLine: {
          width: 2,
          height: 14,
          backgroundColor: '#cccccc',
      },

});
