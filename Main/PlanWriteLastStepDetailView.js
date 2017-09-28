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
import SingleWorkRollDealBatWitnessView from './SingleWorkRollDealBatWitnessView';
import IssueReportView from './IssueReportView'
import WorkStepListView from './WorkStepListView';

import dateformat from 'dateformat';
import Accordion from 'react-native-collapsible/Accordion';

import Global from '../common/globals.js'
import CommitButton from '../common/CommitButton'
import DateTimePickerView from '../common/DateTimePickerView'
import MemberSelectView from '../common/MemberSelectView'

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var account = Object();

export default class PlanWriteLastStepDetailView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '任务详情',
            isHankouType:1,
            data:this.props.data,
            isTaskConfirm:this.props.isTaskConfirm,
            displayMore:false,
            choose_date:null,
            choose_hankouNo:null,
            displayDate:'选择焊接时间',
            displayHankouNo:'选择焊工号',
            members:[],
            membersReponse:null,
        };
    }


    componentDidMount() {

        this.executeNetWorkRequest(this.props.data.id);
        this.getWelderTeamMember();
    }


        onGetWelderTeamMemberDataSuccess(response){
          this.state.membersReponse = response.responseResult;
          var members = []
          for (var i = 0; i < this.state.membersReponse.length; i++) {
               members.push(this.state.membersReponse[i].realname)
          }
          this.setState({members: members})

        }
        getWelderTeamMember(){

            var paramBody = {
                rollingPlanId:this.props.data.id,
            }

            HttpRequest.get('/team/welder', paramBody, this.onGetWelderTeamMemberDataSuccess.bind(this),
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

                    console.log('Task error:' + e)
                })
        }

     onGetDataSuccess(response){
         console.log('onGetDataSuccess@@@@')

         this.setState({
             data:response.responseResult,
         });
     }

    executeNetWorkRequest(id){
         console.log('executeNetWorkRequest:work id = ' + id);
         var paramBody = {
             }

    HttpRequest.get('/rollingplan/'+id, paramBody, this.onGetDataSuccess.bind(this),
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

    startWitness(){
        this.props.navigator.push({
            component: WorkStepListView,
             props: {
                 data:this.state.data,
                }
        })
    }


    startProblem(){
        this.props.navigator.push({
            component: IssueReportView,
             props: {
                 data:this.state.data,
                }
        })
    }

    startHankou(){
        if (!this.state.choose_date) {
            alert('请选择焊接时间')
            return
        }

        if (!this.state.choose_hankouNo) {
            alert('请选择焊工号')
            return
        }
        var choose_hankouNo = null;
        for (var i = 0; i < this.state.membersReponse.length; i++) {
            if (this.state.choose_hankouNo == this.state.membersReponse[i].realname) {
                choose_hankouNo = this.state.membersReponse[i].id;
                break
            }
        }
        var paramBody = {
                'id': this.state.data.id,
                'welderId': choose_hankouNo,
                'weldDate':Global.formatFullDate(this.state.choose_date),
            }

        HttpRequest.post('/rollingplan_op/backfill', paramBody, this.onDeliverySuccess.bind(this),
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
                        alert(errorInfo.message);
                    }else {
                        alert(e)
                    }

                    } else {
                        alert(e)
                    }


                console.log('Login error:' + e)
            })
    }

    onDeliverySuccess(response){
        Global.showToast(response.message)
    }


    renderFormView(){
            //1  fininshed retun, jsut san

            if (this.props.data.status != 'COMPLETED' ) {

                return(<View style={{height:50,width:width,flexDirection:'row'}}>
                <View style={{height:50,flex:1}}><CommitButton title={'问题创建'}
                        onPress={this.startProblem.bind(this)} containerStyle={{backgroundColor:'#ffffff'}} titleStyle={{color: '#f77935'}}></CommitButton></View>
                        <View style={{height:50,flex:1}}><CommitButton title={'发起见证'}
                                onPress={this.startWitness.bind(this)}></CommitButton></View>
                                </View>)

            }else{
                if (this.state.data.backFill) {
                    return(<View style={{height:50,width:width,flexDirection:'row'}}>
                                <View style={{height:50,flex:1}}><CommitButton title={'确定'}
                                    onPress={this.startHankou.bind(this)}></CommitButton></View>
                                    </View>)
                }

            }

    }

    renderTop(){
        return(<View style={styles.statisticsflexContainer}>

        <View style={styles.cell}>

          <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:4,}}>
            施工日期
          </Text>
          <Text numberOfLines={1} style={{color:'#777777',fontSize:14,}}>
            {Global.formatDate(this.props.data.planStartDate)}
          </Text>
        </View>


        <View style={styles.cell}>

        <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:4,}}>
          作业组长
        </Text>
        <Text style={{color:'#777777',fontSize:14,}}>
         {this.props.data.consteam.realname}
        </Text>
        </View>



        <View style={styles.cell}>


        <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:4,}}>
          当前状态
        </Text>
        <Text style={{color:'#e82628',fontSize:14,}}>
          {this.getStatus(this.props.data.status)}
        </Text>
        </View>

        </View>
)
    }
    getStatus(status){
        if (status == 'PROGRESSING') {

            return '施工中'
        }else if (status == 'UNPROGRESSING') {

            return '未施工'
        }else if (status == 'COMPLETED') {
                //
            return '已完成'
        }else if (status == 'PAUSE') {
                //
            return '停滞'
        }
            return Global.getWitnesstatus(status)
    }


    renderDetailView(){
            return(<ScrollView
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps={false}
            style={styles.mainStyle}>
                {this.renderHankouInfo()}
                {this.renderItem()}
                {this.renderMoreItem()}
                   </ScrollView>);
    }


    onSelectedDate(date){
     console.log("date=="+date.getTime());
     this.state.choose_date = date.getTime();
     this.setState({displayDate:Global.formatDate(this.state.choose_date)})
    // this.setState({...this.state});
    }

    onSelectedMember(member){
        this.state.choose_hankouNo = member[0];
        this.setState({displayHankouNo:member[0]});
        console.log(JSON.stringify(member)+"member====");

    }


    renderHankouInfo(){
        if (this.state.data.backFill) {
            return(            <View style={[{marginTop:10,alignItems:'center',},styles.statisticsflexContainer]}>

                        <View style={[styles.cell,{alignItems:'center',padding:10,backgroundColor:'#f2f2f2'}]}>

                        <TouchableOpacity

                        style={{borderWidth:0.5,
                              alignItems:'center',
                              borderColor : '#f77935',
                              backgroundColor : 'white',
                              borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:10,paddingRight:10,paddingTop:8,paddingBottom:8}}>

                        <DateTimePickerView
                            type={'date'}
                            title={this.state.displayDate}
                            visible={this.state.time_visible}
                            style={{color:'#f77935',fontSize:14,flex:1}}
                            onSelected={this.onSelectedDate.bind(this)}
                        />
                                            <Image
                                            style={{width:20,height:20}}
                                            source={require('../images/unfold.png')}/>
                        </TouchableOpacity>

                        </View>


                        <View style={[styles.cell,{alignItems:'center',padding:10,backgroundColor:'#f2f2f2'}]}>

                        <TouchableOpacity style={{borderWidth:0.5,
                              alignItems:'center',
                              borderColor : '#f77935',
                              backgroundColor : 'white',
                              borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:10,paddingRight:10,paddingTop:8,paddingBottom:8}}>

                        <MemberSelectView
                        style={{color:'#f77935',fontSize:14,flex:1}}
                        title={this.state.displayHankouNo}
                        data={this.state.members}
                         pickerTitle={'选择焊口号'}
                        onSelected={this.onSelectedMember.bind(this)} />
                                            <Image
                                            style={{width:20,height:20,}}
                                            source={require('../images/unfold.png')}/>
                        </TouchableOpacity>

                        </View>

                        </View>)
        }
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


    issueFeedBack(){
         this.props.navigator.push({
            component: IssueReportView,
             props: {
                 data:this.state.data,
                }
        })
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

    witnessDealBatTask(){
        this.props.navigator.push({
            component: SingleWorkRollDealBatWitnessView,
             props: {
                 data:this.state.data,
                }
        })
    }

    go2ItemDetail(menu){
        this.props.navigator.push({
            component: CommonContentView,
             props: {
                 title:menu.title,
                 content:menu.content,
                }
        })
    }


    onItemClick(menu){
         console.log('menu:work id = ' + menu.id);
        this.setState({displayMore:!this.state.displayMore});

    }





    renderMoreItem(){
        if (!this.state.displayMore) {
            return;
        }
          var itemAry = [];
        var displayMoreAry=[];
        displayMoreAry.push({title:'子项',content:this.state.data.subItem,id:'c1'},);
        displayMoreAry.push({title:'系统号',content:this.state.data.systemNo,id:'c2'},);
        displayMoreAry.push({title:'工程量',content:this.state.data.projectCost,id:'c3'},);
        displayMoreAry.push({title:'规格',content:this.state.data.speification,id:'c4'},);
        displayMoreAry.push({title:'材质',content:this.state.data.matelial,id:'c5'},);
        displayMoreAry.push({title:'核级',content:this.state.data.croeLevel,id:'c6'},);
        displayMoreAry.push({title:'单位',content:this.state.data.projectUnit,id:'c7'},);
        displayMoreAry.push({title:'点值',content:this.state.data.spot,id:'c8'},);
        // 遍历
        for (var i = 0; i<displayMoreAry.length; i++) {
            itemAry.push(
                <DisplayItemView key={displayMoreAry[i].id}
                 title={displayMoreAry[i].title}
                 detail={displayMoreAry[i].content}
                />
            );

        }
         return itemAry;
    }

    renderItem() {
               // 数组
               var itemAry = [];
               // 颜色数组
               var displayAry = [];




               if (this.state.data.hankouNo) {
                   displayAry.push({title:'焊工号',content:this.state.data.hankouNo,id:'e1'})
                   displayAry.push({title:'焊接时间',content:this.state.data.hankouTime,id:'e2'})
               }
               //qc1 qc2

               displayAry.push({title:'作业条目编号',content:this.state.data.workListNo,id:'0'})
               displayAry.push({title:'点数',content:this.state.data.points,id:'1'})
               displayAry.push({title:'机组号',content:this.state.data.unitNo,id:'2'})
               displayAry.push({title:'质量计划号',content:this.state.data.qualityplanno,id:'3'})



                displayAry.push({title:'图纸号',content:this.state.data.drawingNo,id:'5'},);
                displayAry.push({title:'房间号',content:this.state.data.roomNo,id:'b1'},);
                displayAry.push({title:'工程量编号',content:this.state.data.projectNo,id:'b2'},);
                displayAry.push({title:'工程量类别',content:this.state.data.projectType,id:'b3'},);
                displayAry.push({title:'焊口／支架',content:this.state.data.weldno,id:'b4'},);
                displayAry.push({title:'备注',content:this.state.data.remarks,id:'b5'},);
                displayAry.push({type:'devider'},);

                displayAry.push({title:'查看更多详情',content:this.state.data.worktime,id:'c',type:'displayMore'},);



               // 遍历
               for (var i = 0; i<displayAry.length; i++) {
                   if (displayAry[i].type == 'displayMore') {
                       itemAry.push(
                           <EnterItemView key={displayAry[i].id}
                            title={displayAry[i].title}
                            onPress = {this.onItemClick.bind(this,displayAry[i])}
                            flagArrow = {this.state.displayMore}
                           />
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
