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
import NavBar from '../../common/NavBar';
import px2dp from '../../common/util';
import HttpRequest from '../../HttpRequest/HttpRequest'
import DisplayItemView from '../../common/DisplayItemView';
import EnterItemView from '../../common/EnterItemView';
import Spinner from 'react-native-loading-spinner-overlay'
import dateformat from 'dateformat';
import Accordion from 'react-native-collapsible/Accordion';

import Global from '../../common/globals.js'
import CommitButton from '../../common/CommitButton'

import ConstMapValue from '../../common/ConstMapValue.js';

import MemberSelectView from '../../common/MemberSelectView'

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var account = Object();

export default class QCWitnessTeamDetailView extends Component {
    constructor(props) {
        super(props);
        var data = this.props.data
        if (!data.rollingPlan) {
            data.rollingPlan = new Object()
        }
        var displayInfo = '选择QC1'
        if (Global.isQC2Team(Global.UserInfo)) {
            displayInfo = '选择QC2'
        }

        if (this.props.choose_label) {//for qcec ...
            displayInfo = this.props.choose_label
        }

        this.state = {
            title: '见证详情',
            data:data,
            QCTeamMember:this.props.QCTeamMember,
            choose_memberQC1:null,
            displayMemberQC1:displayInfo,
            displayInfo:displayInfo,
        };
    }


    componentDidMount() {

        this.executeNetWorkRequest(this.props.data.rollingPlanId);
        if (!this.props.exist_qc_member) {
            this.getWitnessTeamMember();
        }

    }


    onGetWitnessTeamMemberDataSuccess(response){
      this.state.QCTeamMember = response.responseResult;
      this.setState({QCTeamMember:  this.state.QCTeamMember})

    }
    getWitnessTeamMember(){

        var paramBody = {
            teamType:'WITNESS_MEMBER',
            userId:Global.UserInfo.id,
        }

        HttpRequest.get('/team/witness', paramBody, this.onGetWitnessTeamMemberDataSuccess.bind(this),
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
            leftIcon={require('../../images/back.png')}
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

    onDeliverySuccess(response){
        this.setState({
            loadingVisible: false
        });
        Global.showToast(response.message)
        //update
        DeviceEventEmitter.emit('delivery_qc','delivery_qc');
        this.back();

    }

    startWitness(){

        var ids=this.props.data.id;



        if (!this.state.choose_memberQC1) {
            Global.alert('请选择见证员')
            return
        }

        var qcId = ''

             var data = this.state.QCTeamMember

             for (var i = 0; i < data.length; i++) {
                   if (data[i].realname == this.state.choose_memberQC1) {
                       qcId = data[i].id;
                        break
                   }
             }

        this.setState({
                 loadingVisible: true
             });
        var paramBody = {
                'ids': ids,
                'memberId':qcId,
            }

        HttpRequest.post('/witness_op', paramBody, this.onDeliverySuccess.bind(this),
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


                Global.log('onDelivery error:' + e)
            })
    }

    renderFormView(){
            //1  fininshed retun, jsut san

            if (this.props.delivery) {

                return(<View style={{height:50,width:width,flexDirection:'row'}}>
                <View style={{height:50,flex:1}}><CommitButton title={'确认分派'}
                        onPress={this.startWitness.bind(this)}></CommitButton></View>
                                </View>)

            }

    }

    renderTop(){
        var date = this.props.data.launchData;
        if (!date) {
            date = this.props.data.createDate;
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
        if (status == 'WITNESSED') {
            if (this.props.data.result == 'UNQUALIFIED') {
                return '不合格'
            }else if(this.props.data.result == 'QUALIFIED'){
                return '合格'
            }
        }else if (status == 'UNWITNESS') {
            return '未完成'
        }else if (status == 'ASSIGNED') {
            return '待见证'
        }
        return Global.getWitnesstatus(status)
    }

    renderDetailView(){
            return(<ScrollView
            keyboardDismissMode='on-drag'

            style={styles.mainStyle}>
            {this.renderChooseOptions()}
                {this.renderItem()}
                   </ScrollView>);
    }

    onSelectedMember(member){

        Global.log(JSON.stringify(member)+"member====");
         this.state.choose_memberQC1 = member[0]
         this.setState({displayMemberQC1:member[0]})

    }

    renderChooseOptions(){
        if (!this.props.delivery) {
            return
        }
        var membersQC1 = []
        if (this.state.QCTeamMember) {
            for (var i = 0; i < this.state.QCTeamMember.length; i++) {
                membersQC1.push(this.state.QCTeamMember[i].realname)
            }
        }

            return(
                <View style={[{marginTop:10,alignItems:'center',},styles.statisticsflexContainer]}>

                <View style={[styles.cell,{alignItems:'center',padding:10,backgroundColor:'#f2f2f2'}]}>

                <TouchableOpacity
                onPress={() => this._selectM.onPickClick()}
                style={{borderWidth:0.5,
                      alignItems:'center',
                      borderColor : '#f77935',
                      backgroundColor : 'white',
                      borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:10,paddingRight:10,paddingTop:8,paddingBottom:8}}>

                      <MemberSelectView
                      ref={(c) => this._selectM = c}
                      style={{color:'#f77935',fontSize:14,flex:1,textAlign:'left'}}
                      title={this.state.displayMemberQC1}
                      data={membersQC1}
                      pickerTitle={this.state.displayInfo}
                      onSelected={this.onSelectedMember.bind(this)} />
                                    <Image
                                    style={{width:20,height:20}}
                                    source={require('../../images/unfold.png')}/>
                </TouchableOpacity>

                </View>



                </View>

            )

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



    go2ItemDetail(menu){

    }


    onItemClick(menu){
         Global.log('menu:work id = ' + menu.id);
        if (menu.id == '9') {
            this.go2WorkStepDetail();
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

            if (witnessInfo.result == '合格') {
                return(
                    <View style={styles.witnessflexContainer}>

                    <View style={styles.cell}>

                      <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:4}}>
                                    {this.getNoticeType(witnessInfo.noticePoint)}-{witnessInfo.witnesser.realname}({witnessInfo.noticeType}) {substitute}
                      </Text>
                      <Text numberOfLines={2} style={{color:'#777777',fontSize:12,}}>
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
            }else if (witnessInfo.result == '不合格'){
                return(
                    <TouchableOpacity style={styles.witnessflexContainer} onPress={this.onWitnessPress.bind(this,witnessInfo)}>

                    <View style={styles.cell}>

                      <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:4}}>
                                    {this.getNoticeType(witnessInfo.noticePoint)}-{witnessInfo.witnesser.realname}({witnessInfo.noticeType}) {substitute}
                      </Text>
                      <Text numberOfLines={2} style={{color:'#777777',fontSize:12,}}>
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

                    <Image style={{alignSelf:'center',marginRight:10}} source={require('../../images/right_enter_blue.png')}></Image>

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


                   //if not ok add info.
                   ConstMapValue.PlanDataCategoryDisplay(displayAry,this.state.data.rollingPlan,this.props.type);

                   displayAry.push({title:'工序编号/名称',content:this.state.data.workStepName,id:'0'})

                   displayAry.push({title:'选点类型',content:this.state.data.noticeType,id:'3'})


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
