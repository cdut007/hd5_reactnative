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
    AsyncStorage,
    DeviceEventEmitter,
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
import CommitButton from '../common/CommitButton'
import Spinner from 'react-native-loading-spinner-overlay'
import dateformat from 'dateformat';
import Accordion from 'react-native-collapsible/Accordion';
import ConstMapValue from '../common/ConstMapValue.js';

import EditAddressItemView from '../common/EditAddressItemView';
import Global from '../common/globals.js'
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
            displayDate:'选择焊接时间',
            displayHankouNo:null,
            members:[],
            membersReponse:null,
            localHankouNoMembers:[],
        };
    }


    componentDidMount() {

        this.executeNetWorkRequest(this.props.data.id);
        this.getWelderTeamMember();
        workstep_update = DeviceEventEmitter.addListener('workstep_update',(param) => {
             Global.log('plan detail DeviceEventEmitter@@@@')
            this.executeNetWorkRequest(this.props.data.id);

        })


        var me = this
        AsyncStorage.getItem('k_hankou_member_'+Global.UserInfo.id,function(errs,result)
        {
            if (!errs && result && result.length)
            {
                 Global.log('read k_hankou_member_@@@@'+result)
                var localHankouNoMembers = JSON.parse(result);
                if (localHankouNoMembers) {
                    me.setState({
                       localHankouNoMembers:localHankouNoMembers,
                    });

                }

            }
            else
            {

            }
        });


    }

    updateMembers(){
        var localHankouNoMembers = []
        if (this.state.localHankouNoMembers) {
            localHankouNoMembers = this.state.localHankouNoMembers.slice()
        }

        var displayHankouNo = this.state.displayHankouNo

        if (!displayHankouNo) {
            return
        }

        var hasHankouMember = false
        for (var i = 0; i < localHankouNoMembers.length; i++) {
            if (localHankouNoMembers[i] == displayHankouNo) {
                 hasHankouMember =true
                 break
            }
        }
        if (!hasHankouMember) {
            localHankouNoMembers.push(displayHankouNo)
        }


        AsyncStorage.setItem('k_hankou_member_'+Global.UserInfo.id, JSON.stringify(localHankouNoMembers), (error, result) => {
            if (error) {
                Global.log('save k_hankou_member_record_ faild.')
            }

            Global.log('save k_hankou_member_record_: sucess')

        });
    }

    componentWillUnmount(){
       workstep_update.remove();
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

     onGetDataSuccess(response){
         Global.log('onGetDataSuccess@@@@')
         if (response.responseResult) {
             this.setState({
                 data:response.responseResult,
             });
         }

     }

    executeNetWorkRequest(id){
         Global.log('executeNetWorkRequest:work id = ' + id);
         var paramBody = {
             }

    HttpRequest.get('/rollingplan/'+id, paramBody, this.onGetDataSuccess.bind(this),
        (e) => {

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

            Global.log('executeNetWorkRequest error:' + e)
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
             <Spinner
                 visible={this.state.loadingVisible}
             />
            </View>
        )
    }

    startWitness(){
        this.props.navigator.push({
            component: WorkStepListView,
             props: {
                 data:this.state.data,
                 type:this.props.type
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
            Global.alert('请选择焊接时间')

            return
        }

        if (!this.state.displayHankouNo) {
            Global.alert('请输入焊工号')

            return
        }


        this.setState({
            loadingVisible: true
        });

        var paramBody = {
                'id': this.state.data.id,
                'welder': this.state.displayHankouNo,
                'weldDate':Global.formatFullDateWithChina(this.state.choose_date),
            }

        HttpRequest.post('/v2/rollingplan_op/backfill', paramBody, this.onDeliverySuccess.bind(this),
            (e) => {
                this.setState({
                    loadingVisible: false
                });
                try {
                    var errorInfo = JSON.parse(e);
                }
                catch(err)
                {
                    Global.log("error======"+err)
                }
                    if (errorInfo != null) {
                        if (errorInfo.code == -1002||
                         errorInfo.code == -1001) {
                        Global.alert(errorInfo.message);
                    }else {
                        Global.alert(e)
                    }

                    } else {
                        Global.alert(e)
                    }


                Global.log('Login error:' + e)
            })
    }

    onDeliverySuccess(response){
        this.updateMembers()
        this.setState({
            loadingVisible: false
        });
        Global.showToast(response.message)
        //update
        DeviceEventEmitter.emit('plan_update','plan_update');
        this.back();
    }


    renderFormView(){

            //1  fininshed retun, jsut san
            console.log('this.state.data.status ======'+this.state.data.status )
            if (this.state.data.status != 'COMPLETED' ) {

                if (this.state.data.problemFlag){
                    return(<View style={{height:50,width:width,flexDirection:'row'}}>
                    <View style={{height:50,flex:1}}><CommitButton title={'问题创建'}
                            onPress={this.startProblem.bind(this)} containerStyle={{backgroundColor:'#ffffff'}} titleStyle={{color: '#f77935'}}></CommitButton></View>
                            <View style={{height:50,flex:1}}><CommitButton title={'发起见证'} titleStyle={{color:'#ffffff'}} containerStyle={{backgroundColor:'#f0f0f0',}}
                                    ></CommitButton></View>
                                    </View>)

               }

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

        var time = this.props.data.planBeginProgressDate
        if (!time) {
            time = this.props.data.planStartDate
        }

        return(<View style={styles.statisticsflexContainer}>

        <View style={styles.cell}>

          <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:4,}}>
            施工日期
          </Text>
          <Text numberOfLines={1} style={{color:'#777777',fontSize:14,}}>
            {Global.formatDate(time)}
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
          {this.getStatus(this.state.data.status)}
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

            style={styles.mainStyle}>
                {this.renderHankouInfo()}
                {this.renderItem()}
                {this.renderMoreItem()}
                   </ScrollView>);
    }


    onSelectedDate(date){
     Global.log("date=="+date.getTime());
     this.state.choose_date = date.getTime();
     this.setState({displayDate:Global.formatDate(this.state.choose_date)})
    // this.setState({...this.state});
    }

    onSelectedMember(member){
        this.state.displayHankouNo = member;
        this.setState({displayHankouNo:member});
        Global.log(JSON.stringify(member)+"member====");

    }


    renderHankouInfo(){
        if (this.state.data.backFill) {
            return( <View style={[styles.statisticsflexContainer,{height:120,justifyContent:'center',alignItems:'center',flexDirection:'column'}]}>

                        <View      style={[styles.cell,{alignItems:'center',padding:10,height:40,backgroundColor:'white',flexDirection:'row'}]}>
                         <Text style= {{width: width * 0.27,fontSize: 14,color: "#1c1c1c"}}>焊接时间: </Text>
                        <TouchableOpacity
                         onPress={() => this._selectD.onClick()}
                        style={{borderWidth:0.5,
                              alignItems:'center',
                              height:40,
                              marginTop:5,
                              flex:1,
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
                        source={require('../images/unfold.png')}/>
                        </TouchableOpacity>

                        </View>

                        <View style={{height:50,}}>

                              <EditAddressItemView

                               chooseMode={true}
                               chooseData={this.state.localHankouNoMembers}
                               onVauleChanged={this.onSelectedMember.bind(this)}
                               topic={'焊口号'}
                               placeholder={'输入焊口号'}
                               content={this.state.displayHankouNo}
                               onChangeText={this.onSelectedMember.bind(this)}
                              />


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
         Global.log('menu:work id = ' + menu.id);
        this.setState({displayMore:!this.state.displayMore});

    }



    createMaterialListItems(displayAry){
        var materialList = this.state.data.materialList
        for (var i = 0; i < materialList.length; i++) {
            var item = materialList[i]
            displayAry.push({type:'devider'},);
            displayAry.push({title:'规格型号',content:ConstMapValue.regExpSepcification(item.specificationModel),id:'b4-'+i},);
            displayAry.push({title:'材质',content:item.materialQuality,id:'b5-'+i},);

        }
        return displayAry
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

        displayMoreAry.push({title:'核级',content:this.state.data.croeLevel,id:'c6'},);
        displayMoreAry.push({title:'单位',content:this.state.data.projectUnit,id:'c7'},);

        if (this.state.data.materialList) {
            this.createMaterialListItems(displayMoreAry)
        }
        //displayMoreAry.push({title:'点值',content:this.state.data.spot,id:'c8'},);
        // 遍历
        for (var i = 0; i<displayMoreAry.length; i++) {
            if (displayMoreAry[i].type == 'devider') {
               itemAry.push(
                  <View style={styles.divider}/>
               );
           }else{
               itemAry.push(
                   <DisplayItemView key={displayMoreAry[i].id}
                    title={displayMoreAry[i].title}
                    detail={displayMoreAry[i].content}
                   />
               );
           }

        }
         return itemAry;
    }

    renderItem() {
               // 数组
               var itemAry = [];
               // 颜色数组
               var displayAry = [];




               if (this.state.data.welder) {
                   displayAry.push({title:'焊工号',content:this.state.data.welder.realname,id:'e1'})
                   displayAry.push({title:'焊接时间',content:Global.formatFullDateDisplay(this.state.data.welddate),id:'e2'})
               }
               //qc1 qc2
               if (this.state.data.qc1WitnessDate) {
                   displayAry.push({title:'QC1见证人',content:this.state.data.qc1Witnesser.realname,id:'e3'})
                   displayAry.push({title:'QC1见证时间',content:Global.formatFullDateDisplay(this.state.data.qc1WitnessDate),id:'e4'})
               }

                ConstMapValue.PlanDataCategoryDisplay(displayAry,this.state.data,this.props.type);

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
