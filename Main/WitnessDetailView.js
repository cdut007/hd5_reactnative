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
    DeviceEventEmitter
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
import WitnessFailResultView from './WitnessFailResultView'
import Spinner from 'react-native-loading-spinner-overlay'
import ConstMapValue from '../common/ConstMapValue.js';
import dateformat from 'dateformat';
import Accordion from 'react-native-collapsible/Accordion';

import Global from '../common/globals.js'
import CommitButton from '../common/CommitButton'

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var account = Object();

export default class WitnessDetailView extends Component {
    constructor(props) {
        super(props);
        var data = this.props.data
        if (!data.rollingPlan) {
            data.rollingPlan = new Object()
        }
        this.state = {
            title: '见证详情',
            data:data,
        };
    }


    componentDidMount() {

        this.executeNetWorkRequest(this.props.data.rollingPlanId);
    }

     onGetDataSuccess(response){
         Global.log('onGetDataSuccess@@@@')
         this.state.data.rollingPlan = response.responseResult
         this.setState({
             data:this.state.data,
         });
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
                }
        })
    }


    onCancelSuccess(response){


        this.setState({
            loadingVisible: false
        });
        Global.showToast(response.message)

        //update
        DeviceEventEmitter.emit('workstep_update','workstep_update');
        this.back();

    }

    startCancelWitness(){

        this.setState({
            loadingVisible: true
        });
        var paramBody = {
                 ids:this.state.data.id
            }

        HttpRequest.post('/workstep_op/witness/cancel', paramBody, this.onCancelSuccess.bind(this),
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


            Global.log(' error:' + e)
        })
}

    renderFormView(){
            //1  fininshed retun, jsut san

            if (Global.isGroup(Global.UserInfo)) {
                if (this.props.data && this.props.data.launchData) {
                    var item = this.props.data;
                    if (item.result != 'UNQUALIFIED' && item.result != 'QUALIFIED') {
                        return(<View style={{height:50,width:width}}><CommitButton title={'取消见证'}
                                onPress={this.startCancelWitness.bind(this)}></CommitButton></View>)
                    }
                }


            }else if (Global.isCaptain(Global.UserInfo)) {


            }else if (Global.isMonitor(Global.UserInfo)) {

            }

    }

    renderTop(){
        var date = this.props.data.createDate;
        if (!date) {
            date = this.props.data.launchData
        }
        return(<View style={styles.statisticsflexContainer}>

        <View style={styles.cell}>

          <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:4}}>
            见证时间
          </Text>
          <Text numberOfLines={2} style={{color:'#777777',fontSize:12,textAlign:'center'}}>
            {Global.formatFullDateDisplay(date)}
          </Text>
        </View>


        <View style={styles.cell}>

        <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:4,}}>
          见证地点
        </Text>
        <Text style={{color:'#777777',fontSize:14,}}>
         {this.props.data.witnessAddress}
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
         Global.log('status ========'+status)
            return Global.getWitnesstatus(status)
    }

    renderDetailView(){
            return(<ScrollView
            keyboardDismissMode='on-drag'

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
        if (menu.id == '9') {
            this.go2WorkStepDetail();
        } else if (menu.id == '9a') {
            this.go2ZhijiaUpdate();
        } else if (menu.id == 'c') {
            this.setState({displayMore:!this.state.displayMore});
        } else if (menu.id == '10') {
            this.issueFeedBack();
        } else if (menu.id == '-1') {
            this.issueDetail();
        } else if (menu.id == 'e9') {
            this.witnessDealBatTask();
        } else {
            try {
                var  index = parseInt(menu.id);
                if (index >=11 && index<= 15) {
                    this.go2ItemDetail(menu);
                }
            }
            catch(err)
            {
                Global.log(err)
            }
        }

    }


onWitnessPress(witnessInfo){
    this.props.navigator.push({
        component: WitnessFailResultView,
         props: {
             data:witnessInfo,
            }
    })
}

getNoticeType(noticePoint){
    if (noticePoint == 'CZEC_QA') {
        return 'CZEC QA'
    }
    if (noticePoint == 'CZEC_QC') {
        return 'CZEC QC'
    }

    return noticePoint

}

        witnessItemInfo(witnessInfo){

            var substitute = witnessInfo.substitute;
            if (!substitute) {
                substitute=''
            }else{
                substitute='--替代见证人'+substitute
            }

            if (witnessInfo.result == 'QUALIFIED') {
                return(
                    <View style={styles.witnessflexContainer}>

                    <View style={styles.cell}>

                      <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:4}}>
                                    {this.getNoticeType(witnessInfo.noticePoint)}-{witnessInfo.witnesser.realname}({witnessInfo.noticeType}) {substitute}
                      </Text>
                      <Text numberOfLines={2} style={{color:'#777777',fontSize:12,textAlign:'center'}}>
                        见证时间：{Global.formatFullDateDisplay(witnessInfo.realWitnessDate)}
                      </Text>
                    </View>


                    <View style={styles.cell}>

                    <Text style={{textAlign:'right',color:'#0755a6',fontSize:14,marginBottom:4,}}>
                      合格
                    </Text>
                    <Text style={{color:'#777777',fontSize:12,}}>
                     见证地点： {witnessInfo.realWitnessAddress}
                    </Text>
                    </View>

                    </View>
                )
            }else if (witnessInfo.result == 'UNQUALIFIED'){
                return(
                    <TouchableOpacity style={styles.witnessflexContainer} onPress={this.onWitnessPress.bind(this,witnessInfo)}>

                    <View style={styles.cell}>

                      <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:4}}>
                                    {this.getNoticeType(witnessInfo.noticePoint)}-{witnessInfo.witnesser.realname}({witnessInfo.noticeType}) {substitute}
                      </Text>
                      <Text numberOfLines={2} style={{color:'#777777',fontSize:12,textAlign:'center'}}>
                        见证时间：{Global.formatFullDateDisplay(witnessInfo.realWitnessDate)}
                      </Text>
                    </View>


                    <View style={styles.cell}>

                    <Text style={{textAlign:'right',color:'#0755a6',fontSize:14,marginBottom:4,}}>
                      不合格
                    </Text>
                    <Text style={{color:'#777777',fontSize:12,}}>
                     见证地点： {witnessInfo.realWitnessAddress}
                    </Text>
                    </View>

                    <Image style={{alignSelf:'center',marginRight:10}} source={require('../images/right_enter_blue.png')}></Image>

                    </TouchableOpacity>
                )
            }else{
                return(
                    <View style={styles.statisticsflexContainer}>

                    <View style={styles.cell}>

                      <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:4}}>
                                    {this.getNoticeType(witnessInfo.noticePoint)}-{witnessInfo.witnesser.realname}({witnessInfo.noticeType})
                      </Text>
                    </View>


                    <View style={styles.cell}>

                    <Text style={{color:'#e82628',fontSize:14,marginBottom:4,}}>
                      待见证
                    </Text>

                    </View>

                    </View>
                )
            }

        }



    renderItem() {
               // 数组
               var itemAry = [];
               // 颜色数组
               var displayAry = [];


               if (this.state.data.witnessInfo && this.state.data.witnessInfo.length > 0) {
                   displayAry.push({title:'发起人',content:this.state.data.witnessInfo[0].launcherName,id:'name'})

                   displayAry.push({type:'devider'},);


                   for (var i = 0; i < this.state.data.witnessInfo.length; i++) {
                         var witnessInfo = this.state.data.witnessInfo[i]
                         if (!witnessInfo.witnesser) {
                             continue
                         }
                         displayAry.push({data:witnessInfo,id:'m'+i,type:'witness'})
                         displayAry.push({type:'line'},);
                   }
               }

               if (Global.isQCTeam(Global.UserInfo)) {
                   //if not ok add info.
                   ConstMapValue.PlanDataCategoryDisplay(displayAry,this.state.data.rollingPlan,this.props.type);

                   displayAry.push({title:'工序编号/名称',content:this.state.data.workStepName,id:'0'})
                   displayAry.push({title:'选点类型',content:this.state.data.noticeType,id:'3'})

               }else{
                   ConstMapValue.PlanDataCategoryDisplay(displayAry,this.state.data.rollingPlan,this.props.type);

               }

                displayAry.push({type:'devider'},);

               // 遍历
               for (var i = 0; i<displayAry.length; i++) {
                   if (displayAry[i].type == 'witness') {
                       itemAry.push(this.witnessItemInfo(displayAry[i].data));
                   } else if (displayAry[i].type == 'devider') {
                       itemAry.push(
                          <View style={styles.divider}/>
                       );
                   } else if (displayAry[i].type == 'line') {
                       itemAry.push(
                          <View style={[styles.divider,{height:1}]}/>
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

            witnessflexContainer: {
                     height: 90,
                     alignItems:'center',
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
