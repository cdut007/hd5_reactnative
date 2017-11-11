import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    TouchableNativeFeedback,
    TouchableHighlight,
    InteractionManager,
    DeviceEventEmitter,
} from 'react-native';
import HttpRequest from '../../HttpRequest/HttpRequest'
import Dimensions from 'Dimensions';
import NavBar from '../../common/NavBar'
import LoadMoreFooter from '../../common/LoadMoreFooter.js'
import CircleLabelHeadView from '../../common/CircleLabelHeadView';
import px2dp from '../../common/util'
import SearchBar from '../../common/SearchBar';
import dateformat from 'dateformat'
import MeetingListView from './MeetingListView';
import NoticeListView from './NoticeListView';
import Global from '../../common/globals.js'
const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;

import   ScrollableTabView  from 'react-native-scrollable-tab-view';


var timer;
var LOADING = {};


    var meetingstatusDatas = [{
                    index:0,
                    status:'RECEIVE',
                    data:[],
                    pageNo:1,
                },
                {
                    index:1,
                    status:'SEND',
                    data:[],
                    pageNo:1,
                },
                {
                    index:2,
                    status:'DRAFT',
                    data1:[],
                    pageNo:1,
                },


];


export default class MeetingListViewContainer extends Component {
    constructor(props) {
        super(props)

        var title=this.props.data.class//队长才能取得到
         if (!title) {
             if(this.props.data.user)
                title = this.props.data.user.dept.name//否则班长
         }
        this.state = {
            keyword: '',
            title: this.props.tag=='meeting'?"会议通知":"事物通告",
        }


    }


        back() {
            this.props.navigator.pop()
        }




    componentDidMount() {

        this.executeStatisticsRequest()
        operationSubscription = DeviceEventEmitter.addListener('operate_meeting',(param)=>{this.executeStatisticsRequest()})
    }

    componentWillUnmount(){

      operationSubscription.remove();
    }
    onGetStatisticsDataSuccess(response,paramBody){
         Global.log('onGetDataSuccess@@@@')


        if (this.props.tag == 'meeting') {
            var conference = response.responseResult.conference;
            if (conference) {
                this.setState({conference:conference})
            }
        }else{

            var notification = response.responseResult.notification;
            if (notification) {
                this.setState({notification:notification})
            }
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



    rendTabs(){

        //if (Global.isGroup(Global.UserInfo)) {
            var receive = '', send = '', draft = ''
            if (this.props.tag == 'meeting') {
                if (this.state.conference) {

                    receive = "("+this.state.conference.receive +")"
                    send = "("+this.state.conference.send +")"
                    draft = "("+this.state.conference.draft +")"
                }
            }else {
                if (this.state.notification) {
                    receive = "("+this.state.notification.receive +")"
                    send = "("+this.state.notification.send +")"
                    draft = "("+this.state.notification.draft +")"
                }
            }

            return( <ScrollableTabView
                tabBarUnderlineStyle={{backgroundColor: '#f77935'}}
                   tabBarBackgroundColor='#FFFFFF'
                   tabBarActiveTextColor='#f77935'
                   tabBarInactiveTextColor='#777777'
                   initialPage={this.props.data.index}
        >
             {this.renderListView('已接收'+receive,0,meetingstatusDatas[0].status)}
             {this.renderListView('已发送'+send,1,meetingstatusDatas[1].status)}
             {this.renderListView('草稿'+draft,2,meetingstatusDatas[2].status)}
        </ScrollableTabView>

            )
        //}

    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                title={this.state.title}
                leftIcon={require('../../images/back.png')}
                searchMode={true}
                onSearchChanged={(text) => this.onSearchChanged(text)}
                onSearchClose = {this.onSearchClose.bind(this)}
                leftPress={this.back.bind(this)} />
                {this.rendTabs()}
            </View>
        )
    }

    onSearchChanged(text){
        Global.log('text=='+text);
        this.setState({keyword:text})
        if (this._meeting_list_ref) {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {

                    this._meeting_list_ref._onRefresh()
            }, 1000);
        }
    }

    onSearchClose(){
        if (timer) {
            clearTimeout(timer);
        }
        if (this.state.keyword == '') {
            return
        }
        this.setState({keyword:''})
        if (this._meeting_list_ref) {
            timer = setTimeout(() => {
                    this._meeting_list_ref._onRefresh()
            }, 1000);
        }
    }


    renderListView(label,index,status) {
        var userId = '';
        if (this.props.data.user) {
            userId = this.props.data.user.id
        }

        if (this.props.tag == 'meeting') {
            return (
                <View  tabLabel={label} style={{marginTop:10,}}>
                <MeetingListView
                 ref = {(c) => this._meeting_list_ref = c}
                 keyword = {this.state.keyword}
                 style={{alignSelf:'stretch',flex:1}}
                 type={status}
                 userId = {userId}
                 navigator={this.props.navigator}
                 />
                </View>
            )
        }else{
            return (
                <View  tabLabel={label} style={{marginTop:10,}}>
                <NoticeListView
                 ref = {(c) => this._meeting_list_ref = c}
                 keyword = {this.state.keyword}
                 style={{alignSelf:'stretch',flex:1}}
                 type={status}
                 userId = {userId}
                 navigator={this.props.navigator}
                 />
                </View>
            )
        }


    }




}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    topView: {
        height: 150,
        width: width,
    },

    divider: {
    backgroundColor: '#d6d6d6',
    width: width,
    height: 0.5,
    },
    label:{
            color: '#ffffff',
            fontSize:16,
    },
    content:{
            color: '#1c1c1c',
            fontSize:16,
    },
    scrollSpinner: {
       marginVertical: 20,
     },
    flexContainer: {
           height: 54,
           width: width,
           backgroundColor: '#ffffff',
           // 容器需要添加direction才能变成让子元素flex
           flexDirection: 'row',
           alignItems: 'center',
           padding:10,
    },
    itemContainer: {
            flex:1,
            marginTop:0.5,
    },
     statisticsflexContainer: {
              height: 57.5,
              backgroundColor: '#ffffff',
              flexDirection: 'row',
          },

    cell: {
        flex: 1,
        height: 57.5,
        width:width/4,
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
