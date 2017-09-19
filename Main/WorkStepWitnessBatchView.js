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
import dateformat from 'dateformat';
import Accordion from 'react-native-collapsible/Accordion';

import Global from '../common/globals.js'
import CommitButton from '../common/CommitButton'


import CheckBox from 'react-native-checkbox'

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var account = Object();
import DateTimePickerView from '../common/DateTimePickerView'

import MemberSelectView from '../common/MemberSelectView'

export default class WorkStepWitnessBatchView extends Component {
    constructor(props) {
        super(props);


        this.state = {
            title: '发起见证',
            data:this.props.data,
        };
    }



    componentDidMount() {


    }

     onGetDataSuccess(response){
         console.log('onGetDataSuccess@@@@')

         this.setState({
             data:response.responseResult,
         });
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

    onWitnessSuccess(response){
        Global.showToast(response.message)

    }

    onDeliverySuccess(response){
        Global.showToast(response.message)
        
    }

    startCommitWitness(){
        for (var i = 0; i < this.state.data.length; i++) {
            if (!this.state.data[i].choose_date) {
                alert('请选择见证日期')
                return
            }

            if (!this.state.data[i].choose_address) {
                alert('请选择见证地点')
                return
            }
        }

        var paramBody = {
                //  type:this.props.type,
                // 'method': 'ASSIGN',
                // 'ids': ids,
                'id':this.state.data[0].id,
                'witnessaddress':this.state.data[0].choose_address,
                'witnessdate':Global.formatFullDate(this.state.data[0].choose_date),
            }

        HttpRequest.post('/workstep_op/witness', paramBody, this.onDeliverySuccess.bind(this),
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
        return(<View style={{height:50,width:width}}><CommitButton title={'提交'}
                onPress={this.startCommitWitness.bind(this)}></CommitButton></View>)


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




    onSelectedDate(data,date){
     console.log("date=="+date.getTime()+';last time data.choose_date='+data.choose_date);
     data.choose_date = date.getTime();
     data.displayDate = Global.formatDate(data.choose_date);
     this.setState({...this.state});
    }

    onSelectedAddress(data,address){
        // for (var i = 0; i < Global.UserInfo.monitor.length; i++) {
        //     if (Global.UserInfo.monitor[i].user.realname == member) {
        //         this.state.choose_member = Global.UserInfo.monitor[i].user.id;
        //         this.setState({displayMember:member});
        //             console.log(JSON.stringify(member)+"member===="+";id="+this.state.choose_member);
        //         break;
        //     }
        // }

        console.log(JSON.stringify(address)+"address====");

        console.log("address=="+';last data.choose_address='+data.choose_address);
        data.choose_address = address;
        data.displayAddress = address;
        this.setState({...this.state});

    }



    renderItem() {
               // 数组
               var itemAry = [];
               // 颜色数组
               var displayAry = [];
               for (var i = 0; i < this.state.data.length; i++) {
                   itemAry.push(this.renderWorkStepItem(i,this.state.data[i]))
                   itemAry.push(
                      <View style={styles.divider}/>
                   );
               }

               return itemAry;
           }

           renderQC(item){
              if (item.noticeQC1 == null && item.noticeQC2 == null){
                   return
               }

               if (item.noticeQC1 && item.noticeQC2) {
                   return(<Text style= {styles.detail}>QC1({item.noticeQC1}) QC2({item.noticeQC2})</Text>)
               }

               if (item.noticeQC1 && !item.noticeQC2) {
                   return(<Text style= {styles.detail}>QC1({item.noticeQC1})</Text>)
               }

               if (!item.noticeQC1 && item.noticeQC2) {
                   return(<Text style= {styles.detail}>QC2({item.noticeQC2})</Text>)
               }


           }

           renderWorkStepItem(index,data){

               if (!data.choose_date) {
                   data.displayDate='选择见证时间';
               }

               if (!data.choose_address) {
                   data.displayAddress='选择见证地点';
               }

               return(
                   <View>
                   <View style= {styles.item_container}>
                       <Text style= {styles.title}>{data.stepname}</Text>
                        {this.renderQC(data)}

                   </View>

                   <View style={[{alignItems:'center',},styles.statisticsflexContainer]}>

                   <View style={[styles.cell,{alignItems:'center',padding:10,backgroundColor:'#f2f2f2'}]}>

                   <TouchableOpacity

                   style={{borderWidth:0.5,
                         alignItems:'center',
                         borderColor : '#f77935',
                         backgroundColor : 'white',
                         borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:10,paddingRight:10,paddingTop:8,paddingBottom:8}}>

                   <DateTimePickerView
                       type={'date'}
                       title={data.displayDate}
                       visible={this.state.time_visible}
                       style={{color:'#f77935',fontSize:14,flex:1}}
                       onSelected={this.onSelectedDate.bind(this,data)}
                   />
                                       <Image
                                       style={{width:20,height:20}}
                                       source={require('../images/unfold.png')}/>
                   </TouchableOpacity>

                   </View>


                   <View TouchableOpacity style={[styles.cell,{alignItems:'center',padding:10,backgroundColor:'#f2f2f2'}]}>

                   <TouchableOpacity style={{borderWidth:0.5,
                         alignItems:'center',
                         borderColor : '#f77935',
                         backgroundColor : 'white',
                         borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:10,paddingRight:10,paddingTop:8,paddingBottom:8}}>

                   <MemberSelectView
                   style={{color:'#f77935',fontSize:14,flex:1}}
                   title={data.displayAddress}
                   data={data.witnessAddresses}
                   pickerTitle={'选择见证地点'}
                   onSelected={this.onSelectedAddress.bind(this,data)} />
                                       <Image
                                       style={{width:20,height:20,}}
                                       source={require('../images/unfold.png')}/>
                   </TouchableOpacity>

                   </View>

                   </View>

                   </View>

               )
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
},item_container: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingLeft:10,
    paddingRight:10,
    paddingTop:8,
    backgroundColor:'#ffffff',
    paddingBottom:8,
    height: 48,
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
             height: 57.5,
             backgroundColor: '#ffffff',
             flexDirection: 'row',
         },

            title: {
                width: width * 0.45,
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
            },desc_check: {
                alignItems:'flex-end',
                flex:1,
                justifyContent:'center'
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
