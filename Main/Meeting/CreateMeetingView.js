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
        var meetingTypeArry=['行政','工程','物资','技术','安全','质量','综合']
        this.state = {
            data: {},
            _selectD:{},
            meetingTypeData:meetingTypeArry
        };
    }


    back() {
        this.props.navigator.pop()
    }



    onPublishSuccess(response){

        Global.showToast(response.message)

    }

    publishMeeting(){

        if (!this.state.data.subject) {
            Global.alert('请输入会议主题')
            return
        }

        if (!this.state.data.content) {
            Global.alert('请输入会议内容')
            return
        }

        if (!this.state.data.meetingType) {
            Global.alert('请选择会议类型')
            return
        }

        if (!this.state.data.project) {
            Global.alert('请输入所属项目')
            return
        }

        if (!this.state.data.host) {
            Global.alert('请输入主持人')
            return
        }

        if (!this.state.data.recorder) {
            Global.alert('请输入记录员')
            return
        }

        if (!this.state.data.members) {
            Global.alert('请选择参会员')
            return
        }

        if (!this.state.data.address) {
            Global.alert('请输入会议地点')
            return
        }

        if (!this.state.data.startTime) {
            Global.alert('请选择会议开始时间')
            return
        }

        if (!this.state.data.endTime) {
            Global.alert('请选择会议结束时间')
            return
        }

        if (!this.state.data.alertTime) {
            Global.alert('请选择会前提醒时间')
            return
        }




        var paramBody = {
                 subject:this.state.data.subject,
                'content': this.state.data.content,
                'category': this.state.data.category,
                'project':this.state.data.project,
                'host':this.state.data.host,
                recorder:this.state.data.recorder,
                supplies:this.state.data.supplies,
                remark:this.state.data.remark,
                startTime:Global.formatFullDate(this.state.data.startTime),
                endTime:Global.formatFullDate(this.state.data.endTime),
                alarmTime:Global.formatFullDate(this.state.data.alertTime),
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

onChangeText(text,tag){
    this.state.data[tag] = text;
    this.setState({...this.state});
}


onSelectedDate(tag,date){
 Global.log("date=="+date.getTime());
 this.state.data[tag] = date.getTime();
 this.setState({...this.state});
}
onSelectedMeetingType(tag,meetingType){

    Global.log("meetingType=="+meetingType);
    this.state.data[tag] = meetingType[0];
    this.setState({...this.state});

}

createEnter(icon,label,desc,tag){
    var textColor = '#777777'
    if (tag == 'feedback') {
        textColor = '#e82628'
    }
    return(
        <TouchableOpacity style={styles.statisticsflexContainer} onPress={this.onEnterClick.bind(this,tag)}>

        <View style={{flex:1,paddingLeft:10,flexDirection:'row'}}>

        <Image style={{width:24,height:24,marginRight:5}} source={icon} />

          <Text numberOfLines={1} style={{color:'#444444',fontSize:14,}}>
            {label}
          </Text>
        </View>
        <Text numberOfLines={1} style={{paddingRight:10,color:textColor,fontSize:14,}}>
          {desc}
        </Text>

        <Image style={{alignSelf:'center',marginRight:10}} source={require('../../images/detailsIcon.png')}></Image>

        </TouchableOpacity>
    )
}

onEnterClick(tag){
    if (tag == 'subject') {

    }else if (tag == 'member') {

    }
}



createChooseInfo(icon,label,desc,data,tag){
    var textColor = '#777777'

    if (tag == 'meetingType') {
        return(
            <View style={styles.statisticsflexContainer}>

            <View style={{paddingRight:20,paddingLeft:10,flexDirection:'row'}}>

            <Image style={{width:24,height:24,marginRight:5}} source={icon} />

              <Text numberOfLines={1} style={{color:'#444444',fontSize:14,}}>
                {label}
              </Text>
            </View>

            <View
             key={tag}
             style={[styles.cell,{alignSelf:'stretch',padding:4,}]}>
            <TouchableOpacity  key={tag} onPress={() => this.selectMeetingType.onPickClick()} style={{borderWidth:0.5,
                  alignItems:'center',
                  flex: 1,
                  height:48,
                  borderColor : '#f77935',
                  backgroundColor : 'white',
                  borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:10,paddingRight:10,paddingTop:8,paddingBottom:8}}>

            <MemberSelectView
                key={tag}
            ref={(c) => this.selectMeetingType = c}
            style={{color:'#f77935',fontSize:14,alignSelf:'center',flex:1}}
            title={desc}
            data={data}

            pickerTitle={'选择'+label}
            onSelected={this.onSelectedMeetingType.bind(this,tag)} />
                                <Image
                                style={{width:20,height:20,}}
                                source={require('../../images/unfold.png')}/>
            </TouchableOpacity>
            </View>

            </View>
        )
    }else{//date
        return(
            <View style={styles.statisticsflexContainer}>

            <View style={{paddingRight:20,paddingLeft:10,flexDirection:'row'}}>

            <Image style={{width:24,height:24,marginRight:5}} source={icon} />

              <Text numberOfLines={1} style={{color:'#444444',fontSize:14,}}>
                {label}
              </Text>
            </View>

            <View
             key={tag}
             style={[styles.cell,{alignSelf:'stretch',padding:4,}]}>
            <TouchableOpacity
             key={tag}
             onPress={() => this.state._selectD[tag].onClick()}
            style={{borderWidth:0.5,
                  alignItems:'center',
                  borderColor : '#f77935',
                  backgroundColor : 'white',
                  borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:10,paddingRight:10,paddingTop:8,paddingBottom:8}}>

            <DateTimePickerView
            ref={(c) => this.state._selectD[tag] = c}
                type={'datetime'}
                minTime={new Date()}
                title={desc}
                style={{color:'#f77935',fontSize:14,flex:1}}
                onSelected={this.onSelectedDate.bind(this,tag)}
            />
                                <Image
                                style={{width:20,height:20}}
                                source={require('../../images/unfold.png')}/>
            </TouchableOpacity>
            </View>

            </View>
        )
    }
}

        renderItem() {

            var displayMemberInfo ='请选择参会人员'
             if (this.state.data.members) {
                 displayMemberInfo = '参会总人数xx人'
             }
                  return(
                      <View>

                      {this.createEnter(require('../../images/informIcon.png'),'会议主题',this.state.data.subject,'subject')}
                      <View style={styles.line}>
                      </View>

                      {this.createChooseInfo(require('../../images/typesIcon.png'),'会议类型',this.state.data.meetingType?this.state.data.meetingType:'请选择会议类型',this.state.meetingTypeData,'meetingType')}
                      <View style={styles.line}>
                      </View>



                      <EditItemView
                       topic={'所属项目'}
                       icon={require('../../images/projectIcon.png')}
                       placeholder={'请输入所属项目名称'}
                       content={this.state.data.project}
                       onChangeText={this.onChangeText.bind(this,'project')}
                      />

                      <EditItemView
                       topic={'主持人'}
                       icon={require('../../images/hostIcon.png')}
                       placeholder={'请输入主持人名字'}
                       content={this.state.data.host}
                       onChangeText={this.onChangeText.bind(this,'host')}
                      />

                      <EditItemView
                       topic={'记录员'}
                       icon={require('../../images/registrarIcon.png')}
                       placeholder={'请输入记录员名字'}
                       content={this.state.data.recorder}
                       onChangeText={this.onChangeText.bind(this,'recorder')}
                      />
                      {this.createEnter(require('../../images/participantIcon.png'),'参会人员',displayMemberInfo,'member')}
                      <View style={styles.line}>
                      </View>
                      <EditItemView
                       topic={'会议地点'}
                       icon={require('../../images/placeIcon.png')}
                       placeholder={'请输入会议地点'}
                       content={this.state.data.address}
                       onChangeText={this.onChangeText.bind(this,'address')}
                      />

                      <View style={styles.space}>
                      </View>
                      {this.createChooseInfo(null,'会议开始时间',this.state.data.startTime?Global.formatFullDateDisplay(this.state.data.startTime):'请选择会议开始时间',null,'startTime')}
                      <View style={styles.line}>
                      </View>
                      {this.createChooseInfo(null,'会议结束时间',this.state.data.endTime?Global.formatFullDateDisplay(this.state.data.endTime):'请选择会议结束时间',null,'endTime')}
                      <View style={styles.line}>
                      </View>
                      {this.createChooseInfo(null,'会前提醒时间',this.state.data.alertTime?Global.formatFullDateDisplay(this.state.data.alertTime):'请选择会前提醒时间',null,'alertTime')}
                      <View style={styles.line}>
                      </View>

                      <EditItemView
                       topic={'会议用品'}
                       icon={require('../../images/conferenceAmenitiesIcon.png')}
                       placeholder={'请输入会议用品'}
                       content={this.state.data.department}
                       onChangeText={this.onChangeText.bind(this,'supplies')}
                      />

                      <EditItemView
                       topic={'会议备注'}
                       icon={require('../../images/remarkIcon.png')}
                       placeholder={'请输入会议备注'}
                       content={this.state.data.remark}
                       onChangeText={this.onChangeText.bind(this,'remark')}
                      />


                      <TouchableOpacity onPress={this.onAddAttached.bind(this)} style={styles.flexContainer}>
                      <Image style={{width:24,height:24,}} source={require('../../images/enclosureIcon.png')} />


                      <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end', alignItems: 'center',}}>

                      <Image style={{width:24,height:24,}} source={require('../../images/add_pic_icon.png')} />

                      </View>


                      </TouchableOpacity>

                      <View style={styles.space}>
                      </View>
                      <View style={styles.space}>
                      </View>

                      </View>

                  )


               }


               onAddAttached(){

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
           height: 48,
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
line: {
backgroundColor: '#f2f2f2',
width: width,
height: 1,
},
    divider: {
    backgroundColor: '#d6d6d6',
    width: width,
    height: 0.5,
    },

    cell: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
         flexDirection: 'column',
    },
    statisticsflexContainer: {
             height: 48,
             backgroundColor: '#ffffff',
             flexDirection: 'row',
             justifyContent: "center",
             alignItems: 'center',
             paddingRight:10
         },
})
