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
    TextInput,
    ScrollView
} from 'react-native';

import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions'
import LoginView from '../../Login/LoginView'
var Global = require('../../common/globals');
var width = Dimensions.get('window').width;
import CommitButton from '../../common/CommitButton'

import DisplayItemView from '../../common/DisplayItemView';
import EnterItemView from '../../common/EnterItemView';
import DateTimePickerView from '../../common/DateTimePickerView'

import EditItemView from '../../common/EditItemView';
import MemberSelectView from '../../common/MemberSelectView'

import HttpRequest from '../../HttpRequest/HttpRequest'


export default class CreateMeetingView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            meetingTypeArry:[]
        };
    }


    back() {
        this.props.navigator.pop()
    }



    onPublishSuccess(response){

        Global.showToast(response.message)

    }

    publishMeeting(){
        var paramBody = {
                 subject:'test',
                'content': 'test',
                'category': 'test',
                'project':'test',
                'host':'james',
                recorder:'james',
                supplies:'photo',
                remark:'info',
                startTime:'2013-11-12 12:00:00',
                endTime:'2013-11-12 12:00:00',
                alarmTime:'2015-11-11 12:00:00',
                type:'SEND',

            }

        HttpRequest.post('/conference', paramBody, this.onPublishSuccess.bind(this),
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


                Global.log('push meeting error:' + e)
            })
    }

    saveDraftMeeting(){

    }

    onModuleItemClick(itemData) {
        this.props.navigator.push({
            component: MeetingListViewContainer,
             props: {
                 data:itemData,
                 type:this.props.type,
                }
        })
    }

onEditTitleContentClick(){

}
onSelectedMeetingType(){

}

onDepartmentChangeText(text){

}
onChooseMemberClick(){

}

onSelectedDate(date){
 Global.log("date=="+date.getTime());
 this.state.choose_date = date.getTime();
 this.setState({displayDate:Global.formatDate(this.state.choose_date)})
// this.setState({...this.state});
}



        renderItem() {
                  return(
                      <View>
                      <TouchableOpacity style={styles.statisticsflexContainer} onPress={this.onEditTitleContentClick.bind(this)}>

                      <View style={styles.cell}>


                        <Text numberOfLines={2} style={{color:'#777777',fontSize:12,}}>
                          通告名称
                        </Text>
                      </View>


                      <Image style={{alignSelf:'center',marginRight:10}} source={require('../../images/right_enter_blue.png')}></Image>

                      </TouchableOpacity>

                      <View

                       style={[styles.cell,{alignItems:'center',padding:10,backgroundColor:'#f2f2f2'}]}>

                      <TouchableOpacity  key={'selectMeetingType'} onPress={() => this.selectMeetingType.onPickClick()} style={{borderWidth:0.5,
                            alignItems:'center',
                            borderColor : '#f77935',
                            backgroundColor : 'white',
                            borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:10,paddingRight:10,paddingTop:8,paddingBottom:8}}>

                      <MemberSelectView
                          key={'selectMeetingType'}
                      ref={(c) => this.selectMeetingType = c}
                      style={{color:'#f77935',fontSize:14,flex:1}}
                      title={this.state.data.categoary}
                      data={this.state.meetingTypeArry}
                      pickerTitle={'选择会议类型'}
                      onSelected={this.onSelectedMeetingType.bind(this)} />
                                          <Image
                                          style={{width:20,height:20,}}
                                          source={require('../../images/unfold.png')}/>
                      </TouchableOpacity>

                      </View>

                      <EditItemView
                       topic={'通告发出部门'}
                       placeholder={'请输入所属项目名称'}
                       content={this.state.data.department}
                       onChangeText={this.onDepartmentChangeText.bind(this)}
                      />

                      <EnterItemView
                       title={'通告接收人员'}
                       onPress = {this.onChooseMemberClick.bind(this)}
                       flagArrow = {true}
                      />

                      <View style={[styles.cell,{alignItems:'center',padding:10,backgroundColor:'#f2f2f2'}]}>

                      <TouchableOpacity
                       onPress={() => this._selectD.onClick()}
                      style={{borderWidth:0.5,
                            alignItems:'center',
                            borderColor : '#f77935',
                            backgroundColor : 'white',
                            borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:10,paddingRight:10,paddingTop:8,paddingBottom:8}}>

                      <DateTimePickerView
                      ref={(c) => this._selectD = c}
                          type={'date'}
                          minTime={new Date()}
                          title={this.state.data.startDate}
                          style={{color:'#f77935',fontSize:14,flex:1}}
                          onSelected={this.onSelectedDate.bind(this)}
                      />
                                          <Image
                                          style={{width:20,height:20}}
                                          source={require('../../images/unfold.png')}/>
                      </TouchableOpacity>

                      </View>




                      </View>

                  )




                   // 遍历
                   for (var i = 0; i<displayAry.length; i++) {
                       if (displayAry[i].type == 'enter') {
                           itemAry.push(
                               <EnterItemView key={displayAry[i].id}
                                title={displayAry[i].title}
                                onPress = {this.onItemClick.bind(this,displayAry[i])}
                                flagArrow = {this.state.displayMore}
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

  renderFormView(){
      return(<View style={{height:50,width:width,flexDirection:'row'}}>
      <View style={{height:50,flex:1}}><CommitButton title={'确认发布'}
              onPress={this.publishMeeting.bind(this)} containerStyle={{backgroundColor:'#ffffff'}} titleStyle={{color: '#f77935'}}></CommitButton></View>
              <View  style={{height:50,flex:1}}><CommitButton title={'保存草稿'}
              onPress={this.saveDraftMeeting.bind(this)}
                      ></CommitButton></View>
                      </View>)
  }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title="创建会议"
                    leftIcon={require('../../images/back.png')}
                    leftPress={this.back.bind(this)}
                     />
                     <ScrollView
                     keyboardDismissMode='on-drag'
                     keyboardShouldPersistTaps={false}
                     style={styles.mainStyle}>
                     {this.renderItem()}
                        </ScrollView>
                        {this.renderFormView()}
            </View>
        )
    }


}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    itemContainer: {

    },
    flexContainer: {
           height: 64,
           width: width,
           backgroundColor: '#ffffff',
           // 容器需要添加direction才能变成让子元素flex
           flexDirection: 'row',
           alignItems: 'center',
           padding:10,
    },
    space: {
    backgroundColor: '#f2f2f2',
    width: width,
    height: 10,
},
    divider: {
    backgroundColor: '#d6d6d6',
    width: width,
    height: 0.5,
    },

    cell: {
        flex: 1,
        height: 84,
        width:width/3,
        justifyContent: "center",
        alignItems: 'center',
         flexDirection: 'column',
    },
    statisticsflexContainer: {
             height: 96,
             backgroundColor: '#ffffff',
             flexDirection: 'row',
             justifyContent: "center",
             alignItems: 'center',
         },
})
