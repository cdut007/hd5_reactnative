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

import NavBar from '../common/NavBar'
import Dimensions from 'Dimensions'
import LoginView from '../Login/LoginView'
var Global = require('../common/globals');
var width = Dimensions.get('window').width;
import CommitButton from '../common/CommitButton'
import MeetingListViewContainer from '../Main/Meeting/MeetingListViewContainer';
import NoticeExpiredListView from '../Main/Meeting/NoticeExpiredListView';

import CreateMeetingView from '../Main/Meeting/CreateMeetingView';

var meetingModuleData = [
    {
        'index': 0,
        'title': '已接收',
        "type": "JS",
         "tag":'meeting',
        'image': require('../images/received_icon.png')
    },{
        'index': 1,
        'title': '已发送',
        "type": "JS",
        "tag":'meeting',
        'image': require('../images/send_icon.png')
    },{
        'index': 2,
        'title': '草稿',
        "type": "JS",
        "tag":'meeting',
        'image': require('../images/draft_icon.png')
    },]

    var noticeModuleData = [
        {
            'index': 0,
            'title': '已接收',
            "type": "JS",
            "tag":'notice',
            'image': require('../images/received_icon.png')
        },{
            'index': 1,
            'title': '已发送',
            "type": "JS",
            "tag":'notice',
            'image': require('../images/send_icon.png')
        },{
            'index': 2,
            'title': '草稿',
            "type": "JS",
            "tag":'notice',
            'image': require('../images/draft_icon.png')
        },]


export default class MeetingView extends Component {
    constructor(props) {
        super(props)

    }


    back() {
        this.props.navigator.pop()
    }




    createMeeting(type){

        this.props.navigator.push({
            component: CreateMeetingView,
             props: {
                 type:type,
                }
        })
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


      enterExpiredNotice(){
          this.props.navigator.push({
              component: NoticeExpiredListView,
               props: {
                   type:this.props.type,
                  }
          })
      }

    onExpriedDetailModuleItemClick(itemData) {
        this.props.navigator.push({
            component: NoticeExpiredListView,
             props: {
                 data:itemData,
                 type:this.props.type,
                }
        })
    }

  renderItems(moduleData){
      var displayArr = []
      for (var i = 0; i < moduleData.length; i++) {
          var moduleDataItem = moduleData[i]
         displayArr.push(
         <TouchableOpacity key={i} style={styles.cell} onPress={this.onModuleItemClick.bind(this,moduleDataItem)}>
         <View style={[{width:width/3}, styles.cell]}>

            <Image source={moduleDataItem.image} style={{  width: 48, height: 48,}} resizeMode={Image.resizeMode.contain} />

             <Text style={{ fontSize: 12, color: "#282828" }}>{moduleDataItem.title}</Text>
         </View>
         </TouchableOpacity>)
      }

      return displayArr
  }

  renderExpriedItems(moduleData){
      var displayArr = []
      for (var i = 0; i < moduleData.length; i++) {
          var moduleDataItem = moduleData[i]
         displayArr.push(
         <TouchableOpacity key={i} onPress={this.onExpriedDetailModuleItemClick.bind(this,moduleDataItem)}>
         <View style={[{width:width}]}>

             <Text style={{ fontSize: 14, marginTop:10,color: "#e82628" }}>2017/10/30 10:20am XX项目部的文件失效通知</Text>
         </View>
         </TouchableOpacity>)
      }

      return displayArr
  }




    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title="会议"
                     />
                     <ScrollView
                     keyboardDismissMode='on-drag'
                     keyboardShouldPersistTaps={false}
                     style={styles.mainStyle}>
                     <View style={styles.itemContainer}>
                     <View style={styles.space}/>
                      <View style={styles.flexContainer}>
                      <Image style={{width:24,height:24,}} source={require('../images/meetingNoticeIcon.png')} />
                      <Text style={[styles.content,{fontSize:16,color:'#444444',}]}>
                      会议通知
                      </Text>

                      <TouchableOpacity onPress={this.createMeeting.bind(this,'meeting')} style={{flex:1,flexDirection:'row',justifyContent:'flex-end', alignItems: 'center',}}>
                      <Text style={[styles.content,{fontSize:14,color:'#1c1c1c'}]}>
                      新建会议
                      </Text>
                      <Image style={{width:24,height:24,}} source={require('../images/newIcon.png')} />

                      </TouchableOpacity>


                      </View>

                      <View style={styles.divider}/>

                      <View style={styles.statisticsflexContainer}>
                        {this.renderItems(meetingModuleData)}
                      </View>

                      </View>

                       <View style={styles.space}/>


                       <View style={styles.itemContainer}>

                        <View style={styles.flexContainer}>
                        <Image style={{width:24,height:24,}} source={require('../images/affair_icon.png')} />

                        <Text style={[styles.content,{fontSize:16,color:'#444444',}]}>
                         事物通告
                        </Text>

                        <TouchableOpacity onPress={this.createMeeting.bind(this,'notice')} style={{flex:1,flexDirection:'row',justifyContent:'flex-end', alignItems: 'center',}}>
                        <Text style={[styles.content,{fontSize:14,color:'#1c1c1c'}]}>
                        新建通告
                        </Text>
                        <Image style={{width:24,height:24,}} source={require('../images/newIcon.png')} />

                        </TouchableOpacity>


                        </View>

                        <View style={styles.divider}/>

                        <View style={styles.statisticsflexContainer}>
                          {this.renderItems(noticeModuleData)}
                        </View>

                        </View>

                         <View style={styles.space}/>

                         <View style={styles.itemContainer}>

                          <TouchableOpacity onPress={this.enterExpiredNotice.bind(this)} style={styles.flexContainer}>
                          <Image style={{width:24,height:24,}} source={require('../images/invalidDocumentIcon.png')} />

                          <Text style={[styles.content,{fontSize:16,color:'#444444',}]}>
                           文件失效通知
                          </Text>

                          <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end', alignItems: 'center',}}>
                          <Text style={[styles.content,{fontSize:14,color:'#777777'}]}>
                          查看全部
                          </Text>
                          <Image style={{width:24,height:24,}} source={require('../images/detailsIcon.png')} />

                          </View>


                          </TouchableOpacity>

                          <View style={styles.divider}/>

                          <View style={styles.expired_statisticsflexContainer}>
                          <Text style={[{fontSize:14,color:'#777777'}]}>
                          最新
                          </Text>

                            {this.renderExpriedItems(noticeModuleData)}
                          </View>

                          </View>

                        </ScrollView>

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
         expired_statisticsflexContainer: {
                  backgroundColor: '#ffffff',
                  padding:10
              },
})
