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

import HttpRequest from '../HttpRequest/HttpRequest'
import CreateMeetingView from '../Main/Meeting/CreateMeetingView';

import CreateNoticeView from '../Main/Meeting/CreateNoticeView';

var meetingModuleData = [
    {
        'index': 0,
        'title': '已接收',
        "type": "receive",
         "tag":'meeting',
        'image': require('../images/received_icon.png')
    },{
        'index': 1,
        'title': '已发送',
        "type": "send",
        "tag":'meeting',
        'image': require('../images/send_icon.png')
    },{
        'index': 2,
        'title': '草稿',
        "type": "draft",
        "tag":'meeting',
        'image': require('../images/draft_icon.png')
    },]

    var noticeModuleData = [
        {
            'index': 0,
            'title': '已接收',
            "type": "receive",
            "tag":'notice',
            'image': require('../images/received_icon.png')
        },{
            'index': 1,
            'title': '已发送',
            "type": "send",
            "tag":'notice',
            'image': require('../images/send_icon.png')
        },{
            'index': 2,
            'title': '草稿',
            "type": "draft",
            "tag":'notice',
            'image': require('../images/draft_icon.png')
        },]


export default class MeetingView extends Component {
    constructor(props) {
        super(props)
        this.state={
            expired_notice:[]
        }

    }


    back() {
        this.props.navigator.pop()
    }




    createMeeting(tag){
        if (tag == 'meeting') {
            this.props.navigator.push({
                component: CreateMeetingView,
                 props: {
                     type:tag,
                    }
            })
        }else{
            this.props.navigator.push({
                component: CreateNoticeView,
                 props: {
                     type:tag,
                    }
            })

        }

    }

    onGetDataSuccess(response,paramBody){
         Global.log('onGetDataSuccess@@@@')
     var query = this.state.filter;
     if (!query) {
         query = '';
     }

        var datas = response.responseResult.data;
        if (datas) {
            this.setState({expired_notice:datas})
        }

    }

    componentDidMount(){
        var paramBody = {
             pagesize:10,
             pagenum:1,
            }



   HttpRequest.get('/expire_notice', paramBody, this.onGetDataSuccess.bind(this),
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



    onGetStatisticsDataSuccess(response,paramBody){
         Global.log('onGetDataSuccess@@@@')


        var conference = response.responseResult.conference;
        if (conference) {
            this.setState({conference:conference})
        }

        var notification = response.responseResult.notification;
        if (notification) {
            this.setState({notification:notification})
        }

    }


    executeStatisticsRequest(){

      Global.log('executeStatisticsRequest:')

                 this.setState({
                   isLoading: true,
                   isLoadingTail: false,
                 });


                 var paramBody = {
                     }

            HttpRequest.get('/statistics/conference', paramBody, this.onGetStatisticsDataSuccess.bind(this),
                (e) => {

                    //
                    // this.setState({
                    //   dataSource: this.state.dataSource.cloneWithRows([]),
                    //   isLoading: false,
                    // });
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



    onModuleItemClick(itemData) {
        this.props.navigator.push({
            component: MeetingListViewContainer,
             props: {
                 data:itemData,
                 tag:itemData.tag,
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
      var len = moduleData.length > 3 ? 3 : moduleData.length
      for (var i = 0; i < len; i++) {
          var moduleDataItem = moduleData[i]
         displayArr.push(
         <TouchableOpacity key={i} onPress={this.onExpriedDetailModuleItemClick.bind(this,moduleDataItem)}>
         <View style={[{width:width}]}>

             <Text numberOfLines={1} style={{ fontSize: 14, marginTop:10,color: "#e82628" }}> {Global.formatFullDateDisplay(moduleDataItem.publishTime)} {moduleDataItem.title}</Text>
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

                            {this.renderExpriedItems(this.state.expired_notice)}
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
