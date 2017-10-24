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

export default class WorkStepUpdateView extends Component {
    constructor(props) {
        super(props)

        var desc = '见证合格';
        if (this.props.data.operatedesc) {
            desc = this.props.data.operatedesc;
        }

        var name = this.props.data.operater;

        if ((!name) && this.props.data.rollingPlan) {
            name = this.props.data.rollingPlan.consendmanName;
        }


        this.state = {
            data:this.props.data,
            operater:name,
            witnessAdress:this.props.data.witnessadress,
            witnessDate:this.props.data.witnessdate,
            describe:desc,
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
                }

            HttpRequest.get('/hdxt/api/baseservice/workstep/'+this.props.data.id, paramBody, this.onGetWorkStepDetailSuccess.bind(this),
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
            var item = response.responseResult;
            var name = item.operater;

            if ((!name) && item.rollingPlan) {
                name = item.rollingPlan.consendmanName;
            }

            this.setState({
                operater: name
            })
        }


    onItemClick(menu){


    }


    onCommit() {
        if (!this.props.editWitness && !this.state.operater) {
            alert('请填写操作者')
            return
        }

        if (!this.props.editWitness && !this.state.describe) {
            alert('请填写描述')
            return
        }


        if (this.props.editWitness) {
            if (!this.state.witnessAdress) {
                alert('请填写见证地点')
                return
            }
            if (!this.state.witnessDate) {
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


        }




        if (!this.props.editWitness && this.state.lastItem) {
            if (!this.state.qcsign) {
                alert('选择QC检查完成')
                return
            }

            if (!this.state.qcman) {
                alert('填写QC确认人')
                return
            }

        }


        this.setState({
            loadingVisible: true
        })

        var param = new FormData()
        param.append('id', this.state.data.id)
        param.append('witnessaddress', this.state.witnessAdress)
        param.append('operater', this.state.operater)
        var currentDate = new Date();
        var datenow = dateformat(currentDate, 'yyyy-mm-dd HH:MM:ss')
        param.append('operatedate', datenow)
        var date = dateformat(this.state.witnessDate, 'yyyy-mm-dd HH:MM:ss')
        param.append('witnessdate', date)

        if (this.state.R) {
            param.append('witnessR', this.state.R.id)
        }
        if (this.state.W) {
            param.append('witnessW', this.state.W.id)
        }

        if (this.state.H) {
            param.append('witnessH', this.state.H.id)
        }

        if (this.state.qcsign) {
            param.append('qcsign', this.state.qcsign)
            param.append('qcman', this.state.qcman)
        }

        if (this.state.describe) {
            param.append('operatedesc', this.state.describe)
        }


        console.log('~~~data' + JSON.stringify(param))

        HttpRequest.post('/hdxt/api/baseservice/construction/mytask/witness', param, this.onCommitSuccess.bind(this),
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


            if (this.props.editWitness) {
                displayAry = [];
            }else{
                displayAry = [{title:'操作者',content:this.state.operater,id:'operater',type:'edit'},
                  {title:'描述',content:this.state.describe,id:'describe',type:'editMore'},];
            }

           if (this.state.data.witnesserb
               || this.state.data.witnesserc
               || this.state.data.witnesserd
               || this.state.data.noticeaqa
               || this.state.data.noticeaqc1
               || this.state.data.noticeaqc2 ) {

                   displayAry.push({title:'见证地点',id:'witnessAdress',content:this.state.witnessAdress,type:'edit'});

                    if (this.state.data.witnessInfo && this.state.data.witnessInfo.length > 0) {
                            var witnessInfo = this.state.data.witnessInfo[0];

                        var witnessDate = dateformat(witnessInfo.witnessdate, 'yyyy-mm-dd HH:MM:ss')
                        displayAry.push({title:'见证时间',id:'witnessDate',content:witnessDate,type:'chooseDate'});

                        for (var i = 0; i < this.state.data.witnessInfo.length; i++) {
                            var witnesserInfo = this.state.data.witnessInfo[i];
                            if (witnesserInfo.noticeType == 'W') {
                                this.state.has_W = true;
                                if (!this.state.W && witnesserInfo.witnesserName) {
                                    this.state.W = {id:witnesserInfo.witnesser,realname:witnesserInfo.witnesserName};
                                }
                                displayAry.push({title:'通知点(W)',id:'W',content:this.state.W,type:'chooseM',data:witnesserInfo.witnesser});
                            }else if (witnesserInfo.noticeType == 'H') {
                                this.state.has_H = true;
                                if (!this.state.H  && witnesserInfo.witnesserName) {
                                    this.state.H = {id:witnesserInfo.witnesser,realname:witnesserInfo.witnesserName};
                                }
                                displayAry.push({title:'通知点(H)',id:'H',content:this.state.H,type:'chooseM',data:witnesserInfo.witnesser});
                            }else if (witnesserInfo.noticeType == 'R') {
                                    this.state.has_R = true;
                                if (!this.state.R  && witnesserInfo.witnesserName) {
                                    this.state.R = {id:witnesserInfo.witnesser,realname:witnesserInfo.witnesserName};
                                }
                                displayAry.push({title:'通知点(R)',id:'R',content:this.state.R,type:'chooseM',data:witnesserInfo.witnesser});
                            }
                        }
                    }else{
                        displayAry.push({title:'见证时间',id:'witnessDate',content:this.state.witnessDate,type:'chooseDate'});
                        if (this.state.data.noticeType && this.state.data.noticeType.length>0) {
                            for (var i = 0; i < this.state.data.noticeType.length; i++) {
                                var type = this.state.data.noticeType[i];
                                if (type == 'W') {
                                    this.state.has_W = true;
                                    displayAry.push({title:'通知点(W)',id:'W',content:this.state.W,type:'chooseM'});
                                }else if (type == 'H') {
                                    this.state.has_H = true;
                                    displayAry.push({title:'通知点(H)',id:'H',content:this.state.H,type:'chooseM'});
                                }else if (type == 'R') {
                                    this.state.has_R = true;
                                    displayAry.push({title:'通知点(R)',id:'R',content:this.state.R,type:'chooseM'});
                                }
                            }
                        }
                    }



                    if (!this.props.editWitness) {
                        if (this.props.lastItem) {
                                displayAry.push({title:'QC检查完成',id:'qcfinish',content:'选择类别',type:'chooseQCType'},);
                                displayAry.push({title:'QC确认人',id:'qcman',content:this.state.qcman,type:'edit'},);

                        }

                    }



           }



               // 遍历
               for (var i = 0; i<displayAry.length; i++) {
                   if (displayAry[i].type == 'chooseQCType') {
                    //    itemAry.push(
                    //        <EnterItemView key={displayAry[i].id}
                    //         title={displayAry[i].title}
                    //         onPress = {this.onItemClick.bind(this,displayAry[i])}
                    //        />
                    //    );
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
                             <Text style= {styles.timetitle}> 见证时间: </Text>
                             <DateTimePickerView
                                 type={'datetime'}
                                 minTime={new Date()}
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
                   keyboardDismissMode='on-drag'
                   keyboardShouldPersistTaps={false}
                   style={styles.mainStyle}>
                              {this.renderItem()}
                          </ScrollView>);
           }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title={this.state.data.stepname}
                    leftIcon={require('../images/back.png')}
                    leftPress={this.back.bind(this)} />
                    {this.renderDetailView()}
                    <TouchableHighlight onPress={this.onCommit.bind(this)}
                        style={styles.commitButton}>
                        <Text style={{ color: '#ffffff', fontSize: 20, }} >
                            确认提交
                        </Text>
                    </TouchableHighlight>
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
        flexDirection: 'row',
        paddingLeft:10,
        paddingRight:10,
        paddingTop:8,
        backgroundColor:'#ffffff',
        paddingBottom:8,
        height: 50,
        alignItems: 'center',
    },
    timetitle: {
        width: width * 0.33,
        fontSize: 18,
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
