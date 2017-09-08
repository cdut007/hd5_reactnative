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
import PlanIssueListView from './PlanIssueListView';
import IssueReportView from './IssueReportView'
import WorkStepDetailView from './WorkStepDetailView';
import dateformat from 'dateformat'

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var account = Object();
var Global = require('../common/globals');

export default class SingleWorkRollDetailView extends Component {
    constructor(props) {
        super(props);

        var info = this.isHankou(this.props.data.speciality);
        this.state = {
            title: info.title,
            isHankouType:info.isHankou,
            data:this.props.data,
            isTaskConfirm:this.props.isTaskConfirm,
        };
    }

    isHankou(speciality){
        var name = '焊口明细';
        var isHankou = false;
        if (speciality == 'GDHK') {
            name = '焊口明细';
            isHankou = true;
        }else{
            name = '支架明细';
        }
        return {title:name,isHankou:isHankou}
    }

    componentDidMount() {

        this.executeNetWorkRequest(this.props.data.id);
    }

     onGetDataSuccess(response){
         console.log('onGetDataSuccess@@@@')
         var info = this.isHankou(response.responseResult.speciality);

         this.setState({
             title: info.title,
             isHankouType:info.isHankou,
             data:response.responseResult,
         });
     }

    executeNetWorkRequest(id){
         console.log('executeNetWorkRequest:work id = ' + id);
         var paramBody = {
             }

    HttpRequest.get('/hdxt/api/baseservice/rollingplan/'+id, paramBody, this.onGetDataSuccess.bind(this),
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
             {this.renderDetailView()}
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
        this.props.navigator.push({
            component: WorkStepDetailView,
             props: {
                 data:this.state.data,
                 isTaskConfirm:this.state.isTaskConfirm,
                }
        })
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
        this.props.navigator.push({
            component: PlanIssueListView,
             props: {

                 data:this.state.data,
                }
        })
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


    renderItem() {
               // 数组
               var itemAry = [];
               // 颜色数组
               var displayAry = [{title:this.state.isHankouType?'焊口号':'支架号',content:this.state.data.weldno,id:'0'},
               {title:'机组号',content:this.state.data.unitno,id:'1'},
                {title:'区域号',content:this.state.data.areano,id:'2'},
                 {title:'图纸号',content:this.state.data.drawno,id:'3'},

           ];

           if (this.state.isHankouType) {
                 displayAry.push({title:'焊接控制单号',content:this.state.data.weldlistno,id:'4'},);
           }
                displayAry.push({title:'RCCM',content:this.state.data.rccm,id:'5'},);
                displayAry.push({title:'施工班组',content:this.state.data.consteamName,id:'b1'},);
                displayAry.push({title:'施工组长',content:this.state.data.consendmanName,id:'b2'},);
                displayAry.push({title:'材质类型',content:this.state.data.materialtype,id:'b3'},);
                displayAry.push({title:'点值',content:this.state.data.workpoint,id:'b4'},);
                displayAry.push({title:'工时',content:this.state.data.worktime,id:'b5'},);
                displayAry.push({title:'工程量',content:this.state.data.qualitynum,id:'b6'},);
                displayAry.push({title:'质量计划号',content:this.state.data.qualityplanno,id:'6'},);
                displayAry.push({title:'计划施工日期',content:this.state.data.plandate,id:'7'},);
                displayAry.push({type:'devider'},);

                if (this.state.isHankouType) {
                      displayAry.push({title:'查看工序详情',id:'9',type:'enter'},);
                }else{
                    displayAry.push({title:'支架更新',id:'9a',type:'enter'},);
                }

                  displayAry.push({title:'问题详情',id:'-1',type:'enter'},);

                  if (this.state.isTaskConfirm) {
                    displayAry.push({title:'问题反馈',id:'10',type:'enter'},);
                    displayAry.push({title:'批量见证',id:'e9',type:'enter'},);
                  }

                  if (this.state.data.welder) {
                      displayAry.push({title:'焊工',content:this.state.data.welder,id:'e1'},);
                  }

                  if (this.state.data.welddate!=0) {
                    var welddate = dateformat(this.state.data.welddate, 'yyyy-mm-dd HH:MM:ss')
                      displayAry.push({title:'焊接完成日期',content:welddate,id:'e2'},);
                  }

                  if (this.state.data.qcman) {
                      displayAry.push({title:'QC检查人员',content:this.state.data.qcman,id:'e3'},);
                  }

                  if (this.state.data.qcsign) {

                      displayAry.push({title:'检查状态',content:this.getQCCheckStatus(this.state.data.qcsign),id:'e4'},);
                  }

                  if (this.state.data.qcdate!=0) {
                    var qcdate = dateformat(this.state.data.qcdate, 'yyyy-mm-dd HH:MM:ss')
                      displayAry.push({title:'检查日期',content:qcdate,id:'e5'},);
                  }


                  displayAry.push({title:'技术要求',id:'11',content:this.state.data.technologyAsk,type:'enter'},);
                  displayAry.push({title:'质量风险及控制措施',content:this.state.data.qualityRiskCtl,id:'12',type:'enter'},);
                  displayAry.push({title:'安全风险及控制措施',content:this.state.data.securityRiskCtl,id:'13',type:'enter'},);
                  displayAry.push({title:'经验反馈',id:'14',content:this.state.data.experienceFeedback,type:'enter'},);
                  displayAry.push({title:'施工工具',id:'15',content:this.state.data.workTool,type:'enter'},);



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

});
