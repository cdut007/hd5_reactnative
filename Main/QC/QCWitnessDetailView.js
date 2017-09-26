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
import NavBar from '../../common/NavBar';
import px2dp from '../../common/util';
import HttpRequest from '../../HttpRequest/HttpRequest'
import DisplayItemView from '../../common/DisplayItemView';
import EnterItemView from '../../common/EnterItemView';
import EditItemView from '../../common/EditItemView';

import dateformat from 'dateformat';
import Accordion from 'react-native-collapsible/Accordion';

import Global from '../../common/globals.js'
import CommitButton from '../../common/CommitButton'

import DateTimePickerView from '../../common/DateTimePickerView'

import MemberSelectView from '../../common/MemberSelectView'

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var account = Object();



export default class QCWitnessDetailView extends Component {
    constructor(props) {
        super(props);
        var data = this.props.data
        data.rollingPlan = new Object()
        this.state = {
            title: '见证详情',
            isHankouType:1,
            data:data,
            choose_address:null,
            choose_date:null,
            input_witnessdesc:null,
            input_dosage:null,
            choose_result:null,
            remark:null,
            witnessAddresses:data.witnessAddresses,
            witness_resules:['合格','不合格'],
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
            leftIcon={require('../../images/back.png')}
            leftPress={this.back.bind(this)}
            />
            {this.renderTop()}
            <View style={{backgroundColor:'#f2f2f2',height:10,width:width}}></View>
             {this.renderDetailView()}
             {this.renderFormView()}
            </View>
        )
    }

    onDeliverySuccess(response){
        Global.showToast(response.message)

    }

    startWitness(){
        if (!this.state.choose_date) {
            alert('请选择见证日期')
            return
        }

        if (!this.state.choose_address) {
            alert('请选择见证地点')
            return
        }
        var result = '3'
        if (!this.state.choose_result) {
            alert('请选择见证结果')
            return
        }else{

            if (this.state.choose_result == '合格') {
                result = '3'
            }else{
                result = '1'
            }
        }

        if (!this.state.input_dosage) {
            alert('请填写实际用量')
            return
        }

        var bodyArray=[]
        for (var i = 0; i < this.state.data.length; i++) {
            var elemnt = new Object()

            elemnt.id = this.state.data[i].id
            elemnt.witnessaddress = this.state.data[i].choose_address
            elemnt.witnessdate = Global.formatFullDate(this.state.data[i].choose_date)
            bodyArray.push(elemnt)
        }
        var paramBody = {
                 id:this.props.data.id,
                 witnessaddress:this.state.choose_address,
                 witnessdate:this.state.choose_date,
                 witnessdesc:this.state.input_witnessdesc,
                 dosage:this.state.input_dosage,
                 isok:result,
                 remark:this.state.remark,
            }

        HttpRequest.post('/witness_op/result', paramBody, this.onDeliverySuccess.bind(this),
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


                console.log(' error:' + e)
            })

    }


    renderFormView(){
            //1  fininshed retun, jsut san

            if (Global.isQC1Member(Global.UserInfo)) {

                return(<View style={{height:50,width:width,flexDirection:'row'}}>
                        <View style={{height:50,flex:1}}><CommitButton title={'提交'}
                                onPress={this.startWitness.bind(this)}></CommitButton></View>
                                </View>)

            }else if (Global.isCaptain(Global.UserInfo)) {


            }else if (Global.isMonitor(Global.UserInfo)) {

            }

    }

    renderTop(){
        return(<View style={styles.statisticsflexContainer}>

        <View style={styles.cell}>

          <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:4,}}>
            申请见证时间
          </Text>
          <Text numberOfLines={1} style={{color:'#777777',fontSize:14,}}>
            {Global.formatDate(this.props.data.createDate)}
          </Text>
        </View>


        <View style={styles.cell}>

        <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:4,}}>
          见证类型
        </Text>
        <Text style={{color:'#777777',fontSize:14,}}>
         {this.props.data.noticeType}
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
        if (status == 'WITNESSED') {
            if (this.props.data.result == 'UNQUALIFIED') {
                return '不合格'
            }else if(this.props.data.result == 'QUALIFIED'){
                return '合格'
            }
        }else if (status == 'UNWITNESS') {
            return '待见证'
        }
            return Global.getWitnesstatus(status)
    }

    renderDetailView(){
            return(<ScrollView
            keyboardDismissMode='on-drag'
            keyboardShouldPersistTaps="never"
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


    onChangeText(keyValue,text){
        console.log(text+"content===="+keyValue);
        this.state[keyValue] = text;
        //this.setState({...this.state});
    }




    onSelectedDate(id,date){
     console.log(id+"date=="+date.getTime());

     this.state[id] = Global.formatFullDate(date);
     this.setState({...this.state});
    }

    onSelectedMember(id,member){


        console.log(JSON.stringify(member)+"choose====");

         this.state[id] = member[0];
        this.setState({...this.state});

    }

   chooseItemInfo(id,title,content,data,type){
      if (type == 'date') {

          return(<View>
              <View style= {{flex: 1,
              justifyContent: 'flex-start',
              flexDirection: 'row',
              paddingLeft:10,
              paddingRight:10,
              paddingTop:8,
              backgroundColor:'#ffffff',
              paddingBottom:8,
              height: 48,
              alignItems: 'center',}}>
                  <Text style= {{width: width * 0.33,fontSize: 14,color: "#1c1c1c"}}>{title} : </Text>
                  <DateTimePickerView
                                         type={'date'}
                                         title={content}
                                         style={{color:'#6d9ee1',fontSize:14,flex:1}}
                                         onSelected={this.onSelectedDate.bind(this,id)}
                                     />
              </View>
             <View style={{backgroundColor: '#d6d6d6',
                 width: width,
                 height: 1,
                 marginLeft:10,}}/>
              </View>)

      }else{

          return(<View>
              <View style= {{flex: 1,
              justifyContent: 'flex-start',
              flexDirection: 'row',
              paddingLeft:10,
              paddingRight:10,
              paddingTop:8,
              backgroundColor:'#ffffff',
              paddingBottom:8,
              height: 48,
              alignItems: 'center',}}>
                  <Text style= {{width: width * 0.33,fontSize: 14,color: "#1c1c1c"}}>{title} : </Text>

                  <MemberSelectView
                  style={{color:'#6d9ee1',fontSize:14,flex:1}}
                  title={content}
                  data={data}
                  pickerTitle={title}
                  onSelected={this.onSelectedMember.bind(this,id)} />
              </View>
             <View style={{backgroundColor: '#d6d6d6',
                 width: width,
                 height: 1,
                 marginLeft:10,}}/>
              </View>)

      }

   }

    renderItem() {
               // 数组
               var itemAry = [];
               // 颜色数组
               var date = this.state.choose_date
               if (!date) {
                   date = '选择见证时间'
               }

               var address = this.state.choose_address
               if (!address) {
                   address = '选择见证地点'
               }

               var result = this.state.choose_result
               if (!result) {
                   result = '选择见证结果'
               }

               var displayAry = [{title:'见证时间',id:'choose_date',content:date,type:'date'},
                 {title:'见证地点',id:'choose_address',content:address,data:this.state.witnessAddresses,type:'choose'},
                 {title:'见证结果',id:'choose_result',content:result,data:this.state.witness_resules,type:'choose'},

                 {title:'简要描述',id:'input_witnessdesc',content:this.state.input_witnessdesc,type:'input'},
                 {type:'devider'},
                 {title:'实际用量',id:'input_dosage',content:this.state.input_dosage,type:'input'},

           ];


                displayAry.push({title:'计划用量',content:this.state.data.rollingPlan.planAmount,id:'b1'},);
                displayAry.push({title:'物项名称',content:this.state.data.rollingPlan.itemName,id:'b2'},);
                displayAry.push({title:'物项编号',content:this.state.data.rollingPlan.itemNo,id:'b3'},);

                displayAry.push({title:'规格型号',content:this.state.data.rollingPlan.speification,id:'b4'},);
                displayAry.push({title:'单位',content:this.state.data.rollingPlan.projectUnit,id:'b5'},);
                displayAry.push({type:'devider'},);

                displayAry.push({title:'作业条目编号',content:this.state.data.rollingPlan.workListNo,id:'b6'},);
                displayAry.push({title:'ITP编号',content:this.state.data.rollingPlan.itpNo,id:'b7'},);
                displayAry.push({title:'工程量编号',content:this.state.data.rollingPlan.projectNo,id:'b8'},);
                displayAry.push({title:'工程量名称',content:this.state.data.rollingPlan.projectName,id:'b9'},);
                displayAry.push({title:'焊口/支架',content:this.state.data.rollingPlan.weldno,id:'b10'},);
                displayAry.push({title:'工序名／编号',content:this.state.data.workStepName,id:'b11'},);


               // 遍历
               for (var i = 0; i<displayAry.length; i++) {
                   if (displayAry[i].type == 'input') {
                        var keyValue = displayAry[i].id;
                       itemAry.push(
                           <EditItemView key={displayAry[i].id}
                            topic={displayAry[i].title}
                            content={displayAry[i].content}
                            onChangeText={this.onChangeText.bind(this,keyValue)}
                           />
                       );
                   } else if (displayAry[i].type == 'devider') {
                       itemAry.push(
                          <View style={styles.divider}/>
                       );
                   }else if (displayAry[i].type == 'choose') {
                       itemAry.push(
                          this.chooseItemInfo(displayAry[i].id,displayAry[i].title,displayAry[i].content,displayAry[i].data,'member')
                       );
                   }else if (displayAry[i].type == 'date') {
                       itemAry.push(
                          this.chooseItemInfo(displayAry[i].id,displayAry[i].title,displayAry[i].content,displayAry[i].data,'date')
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
