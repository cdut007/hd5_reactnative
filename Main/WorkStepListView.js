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
import WorkStepWitnessBatchView from './WorkStepWitnessBatchView';
import IssueReportView from './IssueReportView'
import dateformat from 'dateformat';
import Accordion from 'react-native-collapsible/Accordion';

import Global from '../common/globals.js'
import CommitButton from '../common/CommitButton'
import WitnessDetailView from './WitnessDetailView.js'

import CheckBox from 'react-native-checkbox'

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var account = Object();

export default class WorkStepListView extends Component {
    constructor(props) {
        super(props);


        this.state = {
            title: '选择工序',
            plan_data:this.props.data,
            data:[],
        };
    }



    componentDidMount() {
        this.Subscription = DeviceEventEmitter.addListener('workstep_update',(param) => {    this.executeNetWorkRequest(this.state.plan_data.id) })

        this.executeNetWorkRequest(this.state.plan_data.id);
    }
    componentWillUnmount(){
      this.Subscription.remove();
    }

     onGetDataSuccess(response){
         Global.log('onGetDataSuccess@@@@')

         this.setState({
             data:response.responseResult,
         });
     }

    executeNetWorkRequest(id){
         Global.log('executeNetWorkRequest:work id = ' + id);
         var paramBody = {
             }

    HttpRequest.get('/workstep/rollingplan/'+id, paramBody, this.onGetDataSuccess.bind(this),
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

             {this.renderDetailView()}
             {this.renderFormView()}
            </View>
        )
    }

    startCommitWitness(){
        var selectItems = []

        this.state.data.map((item, i) => {
                        if (item.selected) {
                            selectItems.push(item)

                            Global.log('selected==='+item.id)
                        }
                    })
        if (selectItems.length == 0) {
            Global.alert('请选择工序见证')
            return
        }

        this.props.navigator.push({
            component: WorkStepWitnessBatchView,
             props: {
                 data:selectItems,
                }
        })
    }


    renderFormView(){
            //1  fininshed retun, jsut san

            if (Global.isGroup(Global.UserInfo)) {

                return(<View style={{height:50,width:width}}><CommitButton title={'确认'}
                        onPress={this.startCommitWitness.bind(this)}></CommitButton></View>)

            }else if (Global.isCaptain(Global.UserInfo)) {


            }else if (Global.isMonitor(Global.UserInfo)) {

            }

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











    renderItem() {
               // 数组
               var itemAry = [];
               // 颜色数组
               var displayAry = [{title:'施工日期',content:this.state.plan_data.weldno,id:'0',noLine:true},
               {title:'工程量编号',content:this.state.plan_data.projectNo,id:'1',noLine:true},
                {title:'焊口/支架',content:this.state.plan_data.weldno,id:'2',noLine:true},
                 {title:'工程量类别',content:this.state.plan_data.projectType,id:'3',noLine:true},
                {title:'作业条目编号',content:this.state.plan_data.workListNo,id:'4',noLine:true},

           ];

           if (this.props.batch) {
               displayAry=[]
           }


               // 遍历
               for (var i = 0; i<displayAry.length; i++) {
                if (displayAry[i].type == 'devider') {
                       itemAry.push(
                          <View style={styles.divider}/>
                       );
                   }else{
                       itemAry.push(
                           <DisplayItemView key={displayAry[i].id}
                            title={displayAry[i].title}
                            detail={displayAry[i].content}
                            noLine={displayAry[i].noLine}
                           />
                       );
                   }

               }
               displayAry.push({type:'devider'},);
               itemAry.push(
                  <View style={styles.divider}/>
               );

               for (var i = 0; i < this.state.data.length; i++) {
                   itemAry.push(this.renderWorkStepItem(i,this.state.data[i]))
               }

               return itemAry;
           }


           onWitnessPress(itemData){
               if (itemData.witessAgain) {
                   this.props.navigator.push({
                       component: WitnessDetailView,
                        props: {
                            data:itemData,
                           }
                   })
                   return
               }

               if (itemData.hasCheckedBtn) {
                   return
               }

               this.props.navigator.push({
                   component: WitnessDetailView,
                    props: {
                        data:itemData,
                       }
               })
           }

           renderWorkStepItem(index,data){
               return(

                   <View>
                   <TouchableOpacity style= {styles.item_container} onPress={this.onWitnessPress.bind(this,data)}>
                       <View style={{flex:4}}>
                       <Text style= {[styles.step_title,{margin:5}]}>{data.stepno}{'、'} {data.stepname}</Text>
                        {this.renderQC(data)}
                       </View>
                       {this.renderCheckBox(data)}
                   </TouchableOpacity>
                   <View style={styles.divider_line}/>
                   </View>


               )
           }

           renderQC(item){
              if (item.noticeQC1 == null && item.noticeQC2 == null){
                   return
               }

               var noticePoint = ''


               if (item.noticeQC1) {
                   noticePoint+='QC1('+item.noticeQC1+')  ';

               }
               if (item.noticeQC2) {
                   noticePoint+='QC2('+item.noticeQC2+')  ';

               }
               if (item.noticeCZECQC) {
                   noticePoint+='CZECQC('+item.noticeCZECQC+')  ';

               }
               if (item.noticeCZECQA) {
                   noticePoint+='CZECQA('+item.noticeCZECQA+')  ';

               }
               if (item.noticePAEC) {
                   noticePoint+='PAEC('+item.noticePAEC+')  ';

               }


               if (noticePoint!='') {
                   return(<Text style= {[styles.detail,{marginLeft:10,fontSize:10}]}>{noticePoint}</Text>)
               }



           }

        renderCheckBox(item) {

           if (Global.isCaptain(Global.UserInfo)) {
                   return
               }

           if (item.stepflag == 'DONE') {
               return (<Text style= {styles.desc}>合格</Text>)
           }else if (item.noticeQC1 == null && item.noticeQC2 == null){
               return
           }

           var witessAgain = false
           if (item.launchData) {
               if (item.result != 'UNQUALIFIED') {
                    return  (<Text style= {styles.desc}>见证中</Text>)
               }else{
                   witessAgain = true
               }

           }

           item.hasCheckedBtn = true
            item.witessAgain = witessAgain

           return (<View style= {styles.desc_check}>
               {this.renderCheckLabel(witessAgain)}
               <CheckBox
                   label=''
                   checkedImage={require('../images/choose_icon_click.png')}
                   uncheckedImage={require('../images/choose_icon.png')}
                   checked={item.selected == null ? false : item.selected}
                   onChange={(checked) => {
                       Global.log(checked+'check item=='+item.id+';selected='+item.selected)
                       item.selected = !checked
                       this.setState({ ...this.state })

                   }
                   }
               />
           </View>)
       }

       renderCheckLabel(witness){
           if (witness) {
               return (<Text style= {[styles.desc]}>再次见证  </Text>)
           }else{
                return (<Text style= {[styles.desc]}></Text>)
           }
       }

}





const styles = StyleSheet.create({
    container: {
        flex:1,
        width:width,
        height:height,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    divider: {
    backgroundColor: '#f2f2f2',
    width: width,
    height: 10,
},item_container: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingLeft:10,
    paddingRight:10,
    paddingTop:8,
    backgroundColor:'#ffffff',
    paddingBottom:8,
    height: 68,
    alignItems: 'center',

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

    divider_line: {
    backgroundColor: '#d6d6d6',
    width: width,
    height: 1,
    marginLeft:10,
},
    defaultText:{
            color: '#000000',
            fontSize:16,
            justifyContent: "center",
            alignItems: 'center',
    },
       statisticsflexContainer: {
                width: width,
                backgroundColor: '#ffffff',
            },
            title: {
                width: width * 0.45,
                fontSize: 14,
                color: "#1c1c1c"
            },
            step_title: {

                fontSize: 14,
                color: "#1c1c1c"
            },
            detail: {
                fontSize: 14,
                color: "#777777"
            },
            desc: {
                fontSize: 14,
                color: "#777777",
                flex:1,
                textAlign:'right',
                alignSelf:'center',

            },desc_check: {
                alignItems:'flex-end',
                flex:1,
                justifyContent:'center',
                flexDirection:'row'
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
