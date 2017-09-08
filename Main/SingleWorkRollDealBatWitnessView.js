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
    Picker,
    AsyncStorage,
    ScrollView,
    TextInput,
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay'
import HttpRequest from '../HttpRequest/HttpRequest'
import NavBar from '../common/NavBar'
import EnterItemView from '../common/EnterItemView';
import EditItemView from '../common/EditItemView';
import DisplayItemView from '../common/DisplayItemView';
import DisplayMoreItemView from '../common/DisplayMoreItemView';
import Dimensions from 'Dimensions'
import CommonContentView from './CommonContentView';
import MemberSelectView from '../common/MemberSelectView'
import DateTimePickerView from '../common/DateTimePickerView'
import LoginView from '../Login/LoginView'
var Global = require('../common/globals');
var width = Dimensions.get('window').width;
import dateformat from 'dateformat'

var qcsign = [{id:'0',title:'未确认'},{id:'1',title:'确认'},{id:'2',title:'退回'}];

export default class SingleWorkRollDealBatWitnessView extends Component {
    constructor(props) {
        super(props)

        var titleName = this.props.data.weldno;

         if (this.props.data.speciality=='GDHK') {
             titleName = titleName + '焊口批量见证信息';
         }else {
             titleName = titleName + '支架批量见证信息';
         }

        this.state = {
            title:titleName,
            workStepList:[],
            data:this.props.data,
            witnessAdress:null,
            witnessDate:this.props.data.witnessdate,
            qcman:null,
            qcsign:null,
            W:null,
            has_W:false,
            H:null,
            has_H:false,
            R:null,
            has_R:false,

        };
    }


    back() {
        this.props.navigator.pop()
    }


        componentDidMount() {

            this.reqWorkStepDetail();

        }

        reqWorkStepDetail(){
            var paramBody = {
                'pagesize':20,
                'pagenum':1
                }
            HttpRequest.get('/hdxt/api/baseservice/workstep/rollingplan/'+this.props.data.id, paramBody, this.onGetWorkStepDetailSuccess.bind(this),
                (e) => {
                    try {
                        alert(e)
                    }
                    catch (err) {
                        console.log(err)
                    }
                })
        }

        onGetWorkStepDetailSuccess(response) {
            console.log('onGetWorkStepDetailSuccess:' +JSON.stringify(response))
         var workStepListDatas = response.responseResult.datas;
            this.state.workStepList = workStepListDatas;
            this.setState({
                workStepList: workStepListDatas
            })
        }


    onItemClick(menu){


    }


    onCommit() {


        if (!this.state.witnessAdress) {
            alert('请填写见证地点')
            return
        }
        if (!this.state.chooseTime) {
            alert('填写见证时间')
            return
        }
        if (this.state.has_R && !this.state.R) {
            alert('选择见证负责人')
            return
        }

        if (this.state.has_W && !this.state.W) {
            alert('选择见证负责人')
            return
        }

        if (this.state.has_H && !this.state.H) {
            alert('选择见证负责人')
            return
        }


        this.setState({
            loadingVisible: true
        })

        var param = new FormData()
        param.append('rollingplanid', this.state.data.id)
        param.append('witnessaddress', this.state.witnessAdress)


        if (this.state.R) {
            param.append('witnessR', this.state.R.id)
        }
        if (this.state.W) {
            param.append('witnessW', this.state.W.id)
        }

        if (this.state.H) {
            param.append('witnessH', this.state.H.id)
        }



                    for (var i = 0; i < this.state.workStepList.length; i++) {
                             var workStep = this.state.workStepList[i];
                             if (workStep.witnesserb
                                 || workStep.witnesserc
                                 || workStep.witnesserd
                                 || workStep.noticeaqa
                                 || workStep.noticeaqc1
                                 || workStep.noticeaqc2 ) {
                                 if (workStep.stepflag != 'DONE') {
                                     if (workStep.witnessInfo && workStep.witnessInfo.length > 0) {

                                     }else{
                                         if (this.state[workStep.id]) {

                                              var date = dateformat(this.state[workStep.id], 'yyyy-mm-dd HH:MM:ss')
                                              param.append('witnessdate_'+workStep.id, date)
                                         }

                                     }
                                 }
                             }
                        }



        console.log('~~~data' + JSON.stringify(param))

        HttpRequest.post('/hdxt/api/baseservice/construction/mytask/batch_witness', param, this.onCommitSuccess.bind(this),
            (e) => {
                try {
                    alert(e)
                }
                catch (err) {
                    console.log(err)
                }

                this.setState({
                    loadingVisible: false
                })
            })
    }


    onCommitSuccess(response) {
        console.log('onCommitSuccess:' + JSON.stringify(response))
        this.setState({
            loadingVisible: false
        })

        alert('提交成功')
        this.back()
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


               var displayAry = [];

             var hasDatas = false;
             var editWitness = false;

            if (this.state.workStepList.length > 0 ) {
                hasDatas = true;
            }else{

            }

            for (var i = 0; i < this.state.workStepList.length; i++) {
                     var workStep = this.state.workStepList[i];
                     if (workStep.witnesserb
                         || workStep.witnesserc
                         || workStep.witnesserd
                         || workStep.noticeaqa
                         || workStep.noticeaqc1
                         || workStep.noticeaqc2 ) {
                         if (workStep.stepflag != 'DONE') {
                             if (workStep.witnessInfo && workStep.witnessInfo.length > 0) {
                                 this.state.chooseTime = true;
                             }else{
                                 editWitness = true;
                                 var display = workStep.stepname+'见证时间';
                                  displayAry.push({title:display,id:workStep.id,content:this.state[workStep.id],type:'chooseDate'});
                             }
                         }
                     }
                }

                this.state.editWitness = editWitness;
                var noticeTypes = [];
            if (editWitness) {

                for (var i = 0; i < this.state.workStepList.length; i++) {
                     var workStep = this.state.workStepList[i];
                      if (workStep.witnessInfo && workStep.witnessInfo.length > 0) {
                          if (workStep.witnessInfo[0].witnessaddress) {
                              this.state.witnessAdress = workStep.witnessInfo[0].witnessaddress;
                          }
                      }

                      if (workStep.noticeType && workStep.noticeType.length > 0) {
                          for (var j = 0; j < workStep.noticeType.length; j++) {

                              if (noticeTypes.indexOf(workStep.noticeType[j])<=-1) {
                                   noticeTypes.push(workStep.noticeType[j]);
                              }

                          }
                      }
                 }

                displayAry.push({title:'见证地点',id:'witnessAdress',content:this.state.witnessAdress,type:'edit'});

                for (var i = 0; i < noticeTypes.length; i++) {

                    var noticeType = noticeTypes[i];
                    if (noticeType == 'W') {
                        this.state.has_W = true;

                        displayAry.push({title:'通知点(W)',id:'W',content:this.state.W,type:'chooseM'});
                    }else if (noticeType == 'H') {
                        this.state.has_H = true;

                        displayAry.push({title:'通知点(H)',id:'H',content:this.state.H,type:'chooseM'});
                    }else if (noticeType == 'R') {
                        this.state.has_R = true;

                        displayAry.push({title:'通知点(R)',id:'R',content:this.state.R,type:'chooseM'});
                    }
                }

            }else{
                 if (hasDatas) {
                     displayAry.push({title:'见证结果',id:'all_complete',content:'所有工序已经发起了见证',type:'display'});
                 }
            }

               // 遍历
               for (var i = 0; i<displayAry.length; i++) {
                   if (displayAry[i].type == 'display') {
                       itemAry.push(<DisplayItemView key={displayAry[i].id}
                        title={displayAry[i].title}
                        detail={displayAry[i].content}
                       />);
                     }else if (displayAry[i].type == 'chooseM') {
                      var keyValue = displayAry[i].id;
                       itemAry.push(
                           <MemberSelectView type= {displayAry[i].id}
                           defaultMember={displayAry[i].content}
                           title={displayAry[i].title}
                           onSelected={this.onSelectedMember.bind(this,keyValue)} />
                       );
                   }else if (displayAry[i].type == 'chooseDate') {
                    var keyValue = displayAry[i].id;
                     itemAry.push(
                         <View>
                         <View style= {styles.timecontainer}>
                             <Text style= {styles.timetitle}>{displayAry[i].title}: </Text>
                             <DateTimePickerView
                                 type={'datetime'}
                                 onSelected={this.onSelectedDate.bind(this,keyValue)}
                             />
                         </View>
                         <View style={styles.divider}/>
                         </View>

                     );
                 }  else if (displayAry[i].type == 'devider') {
                       itemAry.push(
                          <View style={styles.divider}/>
                       );
                   } else if (displayAry[i].type == 'editMore') {
                       var keyValue = displayAry[i].id;
                       itemAry.push(
                           <EditItemView key={displayAry[i].id}
                            topic={displayAry[i].title}
                            content={displayAry[i].content}
                            onChangeText={this.onChangeText.bind(this,keyValue)}
                           />
                       );
                   }else{//edit
                          var keyValue = displayAry[i].id;
                       itemAry.push(
                           <EditItemView key={displayAry[i].id}
                            topic={displayAry[i].title}
                            content={displayAry[i].content}
                            onChangeText={this.onChangeText.bind(this,keyValue)}
                           />
                       );
                   }

               }
               return itemAry;
           }

           onSelectedMember(keyValue,member){
               console.log(JSON.stringify(member)+"member===="+keyValue);
               this.state[keyValue] = member;

               this.setState({...this.state});
           }

           onSelectedDate(keyValue,date){
            console.log("date===="+keyValue+";date=="+date.getTime());
            this.state.chooseTime = true;
            this.state[keyValue] = date.getTime();
            this.setState({...this.state});
           }

           onChangeText(keyValue,text){
               console.log(text+"content===="+keyValue);
               this.state[keyValue] = text;
               this.setState({...this.state});
           }

           renderDetailView(){
                   return(<ScrollView
                   style={styles.mainStyle}>
                              {this.renderItem()}
                          </ScrollView>);
           }

           renderCommitBtn(){
               if (this.state.editWitness) {
                   return(<TouchableHighlight onPress={this.onCommit.bind(this)}
                       style={styles.commitButton}>
                       <Text style={{ color: '#ffffff', fontSize: 20, }} >
                           确认提交
                       </Text>
                   </TouchableHighlight>)
               }
           }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title={this.state.title}
                    leftIcon={require('../images/back.png')}
                    leftPress={this.back.bind(this)} />
                    {this.renderDetailView()}
                    {this.renderCommitBtn()}
                    <Spinner
                        visible={this.state.loadingVisible}
                    />
            </View>
        )
    }


}


const styles = StyleSheet.create({
    timecontainer: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        paddingLeft:10,
        paddingRight:10,
        paddingTop:8,
        backgroundColor:'#ffffff',
        paddingBottom:8,
        alignItems: 'center',
        height: 100,
    },
    timetitle: {
        width: width,
        fontSize: 18,
        marginLeft:8,
        color: "#666"
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
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
    commitButton:
    {
        // marginTop: 10,
        height: 44,
        width: width,
        backgroundColor: '#00a629',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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
})
