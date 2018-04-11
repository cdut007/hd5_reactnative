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
import dateformat from 'dateformat';
import Accordion from 'react-native-collapsible/Accordion';
import Spinner from 'react-native-loading-spinner-overlay'
import Global from '../common/globals.js'
import CommitButton from '../common/CommitButton'

import EditAddressItemView from '../common/EditAddressItemView';

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
            address_items:[],
            date_items:[],
            witnessaddressdata:[],
        };


    }




    componentDidMount() {

      var me = this
      AsyncStorage.getItem('k_witness_address_record_'+Global.UserInfo.id,function(errs,result)
      {
          if (!errs && result && result.length)
          {
               Global.log('read k_witness_address_record_@@@@'+result)
              var address = JSON.parse(result);
              if (address) {
                  me.setState({
                     witnessaddressdata:address,
                  });

              }

          }
          else
          {

          }
      });

    }

     onGetDataSuccess(response){
         Global.log('onGetDataSuccess@@@@')

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
             <Spinner
                 visible={this.state.loadingVisible}
             />
            </View>
        )
    }

    updateAddress(){
        var witnessAddresses = []

        if (this.state.witnessaddressdata) {
            witnessAddresses = this.state.witnessaddressdata.slice()
        }

        for (var i = 0; i < this.state.data.length; i++) {
            var address = this.state.data[i].choose_address



            var hasAddress = false

            for (var j = 0; j < witnessAddresses.length; j++) {
                if (witnessAddresses[j] == address) {
                     hasAddress = true;
                    Global.log('k_witness_address_record_:'+JSON.stringify(witnessAddresses));
                     break;
                }
            }
            if (!hasAddress) {
                witnessAddresses.push(address)
            }

        }


        AsyncStorage.setItem('k_witness_address_record_'+Global.UserInfo.id, JSON.stringify(witnessAddresses), (error, result) => {
            if (error) {
                Global.log('save k_witness_address_record_ faild.')
            }

            Global.log('save k_witness_address_record_: sucess')

        });

    }

    onDeliverySuccess(response){


        this.updateAddress();

        this.setState({
            loadingVisible: false
        });
        Global.showToast(response.message)

        //update
        DeviceEventEmitter.emit('workstep_update','workstep_update');
        this.back();

    }

    startCommitWitness(){
        for (var i = 0; i < this.state.data.length; i++) {
            if (!this.state.data[i].choose_date) {
                Global.alert('请选择见证日期')
                return
            }

            if (!this.state.data[i].choose_address) {
                Global.alert('请输入见证地点')
                return
            }
        }
        var bodyArray=[]
        for (var i = 0; i < this.state.data.length; i++) {
            var elemnt = new Object()
            var batchIds = this.state.data[i].workStepIds;
            if(batchIds){
                elemnt.ids = batchIds
            }else{
                elemnt.id = this.state.data[i].id
            }


            elemnt.witnessaddress = this.state.data[i].choose_address
            elemnt.witnessdate = Global.formatFullDateWithChina(this.state.data[i].choose_date)
            bodyArray.push(elemnt)
        }
        this.setState({
            loadingVisible: true
        });
        var paramBody = {
                 jsonBody:bodyArray
            }
        Global.log("workstep_opParamBody======"+JSON.stringify(paramBody));
        // Global.showToast('onDeliverySuccess1');
        HttpRequest.post('/workstep_op/witness', paramBody, this.onDeliverySuccess.bind(this),
            (e) => {
                this.setState({
                    loadingVisible: false
                });
                try {
                    var errorInfo = JSON.parse(e);
                    Global.log("workstep_opErrorInfo======"+e)
                }
                catch(err)
                {
                    Global.log("workstep_opError2======"+err)
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
        return(<View style={{height:50,width:width}}><CommitButton title={'提交'}
                onPress={this.startCommitWitness.bind(this)}></CommitButton></View>)


    }


    renderDetailView(){
            return(<ScrollView

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




    onSelectedDate(index,date){
    var data = this.state.data[index];
     Global.log("date=="+date.getTime()+';last time data.choose_date='+JSON.stringify(data));
     data.choose_date = date.getTime();
     data.displayDate = Global.formatFullDateDisplay(data.choose_date);


        let newArray = this.state.data.slice();
                     for (var i = 0; i < this.state.data.length; i++) {
                         if(data.id == this.state.data[i].id){
                             newArray[i] = {
                               ...data,
                             };
                             break
                         }
                     }

     this.setState({data:newArray});
    }

    onSelectedAddress(index,address){


        var data = this.state.data[index];
        Global.log(JSON.stringify(address)+"address===="+JSON.stringify(data));

        Global.log("address=="+';last data.choose_address='+data.choose_address);
        data.choose_address = address;
        data.displayAddress = address;
        let newArray = this.state.data.slice();
                     for (var i = 0; i < this.state.data.length; i++) {
                         if(data.id == this.state.data[i].id){
                             newArray[i] = {
                               ...data,
                             };
                             break
                         }
                     }

     this.setState({data:newArray});

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
                    return(<View style={{ flex:1,}}><Text  numberOfLines={2} style= {[styles.detail,{marginLeft:10,marginRight:10,fontSize:10}]}>{noticePoint}</Text></View>)
                }

           }

           renderWorkStepItem(index,data){

               if (!data.choose_date) {
                   data.displayDate='选择见证时间';
               }

               if (!data.choose_address) {
                   data.displayAddress='';
               }

               return(
                   <View>
                   <View style= {styles.item_container}>
                       <Text numberOfLines={3} style= {styles.title}>{data.stepname}</Text>
                        {this.renderQC(data)}

                   </View>

                   <View style={[styles.statisticsflexContainer,{flexDirection:'column',height:120}]}>
                   <View

                    style={[{width:width,height:1,backgroundColor:'#f2f2f2'}]}>
                     </View>

                   <View       key={'date_container' + index} style={[styles.cell,{alignItems:'center',padding:10,height:40,backgroundColor:'white',flexDirection:'row'}]}>
                    <Text style= {{width: width * 0.27,fontSize: 14,color: "#1c1c1c"}}>见证时间: </Text>
                   <TouchableOpacity
                    key={'date' + index}
                   onPress={() => this.state.date_items[index].onClick()}
                   style={{borderWidth:0.5,
                         alignItems:'center',
                         height:40,
                         marginTop:5,
                         flex:1,
                         borderColor : '#f77935',
                         backgroundColor : 'white',
                         borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:10,paddingRight:10,paddingTop:8,paddingBottom:8}}>

                   <DateTimePickerView
                    key={'date_choose' + index}
                      ref={(c) => this.state.date_items[index] = c}
                       type={'datetime'}
                       minTime={new Date()}
                       title={data.displayDate}
                       visible={this.state.time_visible}
                       style={{color:'#f77935',fontSize:14,flex:1}}
                       onSelected={this.onSelectedDate.bind(this,index)}
                   />
                                       <Image
                                       style={{width:20,height:20}}
                                       source={require('../images/unfold.png')}/>
                   </TouchableOpacity>

                   </View>

                   <View

                    style={[{width:width,height:1,backgroundColor:'#f2f2f2'}]}>
                     </View>

                   <View
                     key={'address_container' + index}

                    style={[styles.cell,{alignItems:'center',backgroundColor:'#f2f2f2'}]}>

                   <View style={{height:50,}}>

                         <EditAddressItemView
                         key={index+'selectM'}
                          chooseMode={true}
                          chooseData={this.state.witnessaddressdata}
                          selectedValue={data.displayAddress}
                          onVauleChanged={this.onSelectedAddress.bind(this,index)}
                          ref={(c) => this.state.address_items[index] = c}
                          topic={'见证地点'}
                          placeholder={'输入见证地点'}
                          content={data.displayAddress}
                          onChangeText={this.onSelectedAddress.bind(this,index)}
                         />


                   </View>


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
    height: 64,
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
