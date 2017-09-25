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
import WitnessFailResultView from './WitnessFailResultView'

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
        data.rollingPlan = new Object()
        this.state = {
            title: '见证详情',
            data:data,
        };
    }


    componentDidMount() {

        this.executeNetWorkRequest(this.props.data.rollingPlanId);
    }

     onGetDataSuccess(response){
         console.log('onGetDataSuccess@@@@')
         this.state.data.rollingPlan = response.responseResult
         this.setState({
             data:this.state.data,
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

    }

    renderFormView(){
            //1  fininshed retun, jsut san

            if (Global.isGroup(Global.UserInfo)) {

                return(<View style={{height:50,width:width,flexDirection:'row'}}>
                <View style={{height:50,flex:1}}><CommitButton title={'问题创建'}
                        onPress={this.startProblem.bind(this)}></CommitButton></View>
                        <View style={{height:50,flex:1}}><CommitButton title={'发起见证'}
                                onPress={this.startWitness.bind(this)}></CommitButton></View>
                                </View>)

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
            申请时间
          </Text>
          <Text numberOfLines={2} style={{color:'#777777',fontSize:14,}}>
            {Global.formatDate(date)}
          </Text>
        </View>


        <View style={styles.cell}>

        <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:4,}}>
          申请地点
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
          {this.props.data.status}
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
                console.log(err)
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

        witnessItemInfo(witnessInfo){

            //witnessInfo.result = '不合格'

            if (witnessInfo.result == '合格') {
                return(
                    <View style={styles.statisticsflexContainer}>

                    <View style={styles.cell}>

                      <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:4}}>
                        {witnessInfo.witnesser.realname}
                      </Text>
                      <Text numberOfLines={2} style={{color:'#777777',fontSize:12,}}>
                        见证时间：{Global.formatDate(witnessInfo.realWitnessDate)}
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
            }else if (witnessInfo.result == '不合格'){
                return(
                    <TouchableOpacity style={styles.statisticsflexContainer} onPress={this.onWitnessPress.bind(this,witnessInfo)}>

                    <View style={styles.cell}>

                      <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:4}}>
                        {witnessInfo.witnesser.realname}
                      </Text>
                      <Text numberOfLines={2} style={{color:'#777777',fontSize:12,}}>
                        见证时间：{Global.formatDate(witnessInfo.realWitnessDate)}
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
                        {witnessInfo.witnesser.realname}
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

               if (this.state.data.witnessInfo) {
                   for (var i = 0; i < this.state.data.witnessInfo.length; i++) {
                         var witnessInfo = this.state.data.witnessInfo[i]
                         if (!witnessInfo.witnesser) {
                             continue
                         }
                         displayAry.push({data:witnessInfo,id:'m'+i,type:'witness'})
                   }
                   displayAry.push({type:'line'},);
               }

                displayAry.push({title:'ITP编号',content:this.state.data.rollingPlan.itpNo,id:'7'})
                displayAry.push({title:'作业条目编号',content:this.state.data.rollingPlan.workListNo,id:'0'})
                displayAry.push({title:'点数',content:this.state.data.rollingPlan.points,id:'1'})
                displayAry.push({title:'机组号',content:this.state.data.rollingPlan.unitNo,id:'2'})
                displayAry.push({title:'质量计划号',content:this.state.data.qualityplanno,id:'3'})


                displayAry.push({title:'图纸号',content:this.state.data.rollingPlan.drawingNo,id:'5'},);
                displayAry.push({title:'房间号',content:this.state.data.rollingPlan.roomNo,id:'b1'},);
                displayAry.push({title:'工程量编号',content:this.state.data.rollingPlan.projectNo,id:'b2'},);
                displayAry.push({title:'工程量类别',content:this.state.data.rollingPlan.projectType,id:'b3'},);
                displayAry.push({title:'焊口／支架',content:this.state.data.rollingPlan.weldno,id:'b4'},);
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
