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
} from 'react-native';
import HttpRequest from '../HttpRequest/HttpRequest'
import Dimensions from 'Dimensions';
import NavBar from '../common/NavBar'
import LoadMoreFooter from '../common/LoadMoreFooter.js'
import CircleLabelHeadView from '../common/CircleLabelHeadView';
import px2dp from '../common/util'
import SearchBar from '../common/SearchBar';
import dateformat from 'dateformat'
import IssueListView from './IssueListView';
import Global from '../common/globals.js'
const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;

import   ScrollableTabView  from 'react-native-scrollable-tab-view';


var timer;
var LOADING = {};

//captainList
//duizhang NEED_SOLVED,SOLVED
//banzhang NEED_ASSIGN,NEED_SOLVE,SOLVED
//zuzhang NEED_SOLVE,NEED_CONFIRM,SOLVED
//solve PRE ,DONE
var captionstatusDatas = [{
                index:0,
                status:'NEED_SOLVED',
                data:[],
                pageNo:1,
            },
            {
                index:1,
                status:'SOLVED',
                data:[],
                pageNo:1,
            },


];
    var monitorstatusDatas = [{
                    index:0,
                    status:'NEED_ASSIGN',
                    data:[],
                    pageNo:1,
                },
                {
                    index:1,
                    status:'NEED_SOLVE',
                    data:[],
                    pageNo:1,
                },
                {
                    index:2,
                    status:'SOLVED',
                    data:[],
                    pageNo:1,
                },


];
    var groupstatusDatas = [{
                    index:0,
                    status:'NEED_SOLVE',
                    data:[],
                    pageNo:1,
                },
                {
                    index:1,
                    status:'NEED_CONFIRM',
                    data:[],
                    pageNo:1,
                },
                {
                    index:2,
                    status:'SOLVED',
                    data:[],
                    pageNo:1,
                },


];
    var solvestatusDatas = [{
                    index:0,
                    status:'PRE',
                    data:[],
                    pageNo:1,
                },
                {
                    index:1,
                    status:'DONE',
                    data:[],
                    pageNo:1,
                },



];
var mysolvestatusDatas = [{
                index:0,
                status:'NEED_SOLVE',
                data:[],
                pageNo:1,
            },
            {
                index:1,
                status:'SOLVED',
                data:[],
                pageNo:1,
            },



];
var solverLearderStatus = [{
                    index:0,
                    status:'PRE',
                    data:[],
                    pageNo:1,
                },
                {
                    index:1,
                    status:'DONE',
                    data:[],
                    pageNo:1,
                },
                {
                    index:2,
                    status:'SOLVED',
                    data:[],
                    pageNo:1,
                },

                {
                    index:3,
                    status:'NEED_SOLVE',
                    data:[],
                    pageNo:1,
                },
];
var coordinatorStatus = [{
                    index:0,
                    status:'NEED_ASSIGN',
                    data:[],
                    pageNo:1,
                },
                {
                    index:1,
                    status:'ASSIGNED',
                    data:[],
                    pageNo:1,
                },
];


export default class IssueListViewContainer extends Component {
    constructor(props) {
        super(props)

        var title=this.props.data.class//队长才能取得到
         if (!title) {
             if(this.props.data.user)
                title = this.props.data.user.dept.name//否则班长
         }
        this.state = {
            keyword: '',
            title: title + "问题",
        }


    }


        back() {
            this.props.navigator.pop()
        }




    componentDidMount() {


    }

    //captainList
    //duizhang NEED_SOLVED,SOLVED
    //banzhang NEED_ASSIGN,NEED_SOLVE,SOLVED
    //zuzhang NEED_SOLVE,NEED_CONFIRM,SOLVED
    //solve PRE ,DONE
    //

    rendTabs(){

        if (Global.isGroup(Global.UserInfo)) {

            return( <ScrollableTabView
                tabBarUnderlineStyle={{backgroundColor: '#0755a6'}}
                   tabBarBackgroundColor='#FFFFFF'
                   tabBarActiveTextColor='#0755a6'
                   tabBarInactiveTextColor='#777777'
        >
             {this.renderListView('待解决的问题',0,groupstatusDatas[0].status)}
             {this.renderListView('待确认的问题',1,groupstatusDatas[1].status)}
             {this.renderListView('已解决的问题',2,groupstatusDatas[2].status)}
        </ScrollableTabView>

            )
        }else  if (Global.isCaptain(Global.UserInfo)) {

                return( <ScrollableTabView
                    tabBarUnderlineStyle={{backgroundColor: '#0755a6'}}
                       tabBarBackgroundColor='#FFFFFF'
                       tabBarActiveTextColor='#0755a6'
                       tabBarInactiveTextColor='#777777'
            >
                 {this.renderListView('待解决的问题',0,captionstatusDatas[0].status)}
                 {this.renderListView('已解决的问题',1,captionstatusDatas[1].status)}
            </ScrollableTabView>

                )
            }else  if (Global.isMonitor(Global.UserInfo)) {

                    return( <ScrollableTabView
                        tabBarUnderlineStyle={{backgroundColor: '#0755a6'}}
                           tabBarBackgroundColor='#FFFFFF'
                           tabBarActiveTextColor='#0755a6'
                           tabBarInactiveTextColor='#777777'
                >
                {this.renderListView('待指派的问题',0,monitorstatusDatas[0].status)}
                {this.renderListView('未解决的问题',1,monitorstatusDatas[1].status)}
                {this.renderListView('已解决的问题',2,monitorstatusDatas[2].status)}
                </ScrollableTabView>

                    )
                }else  if (Global.isSolverMember(Global.UserInfo)) {

                            if (this.props.isMyIssue) {
                                return( <ScrollableTabView
                                    tabBarUnderlineStyle={{backgroundColor: '#0755a6'}}
                                       tabBarBackgroundColor='#FFFFFF'
                                       tabBarActiveTextColor='#0755a6'
                                       tabBarInactiveTextColor='#777777'
                            >
                                 {this.renderListView('未解决的问题',0,mysolvestatusDatas[0].status)}
                                 {this.renderListView('已解决的问题',1,mysolvestatusDatas[1].status)}
                            </ScrollableTabView>

                                )
                            }else{
                                return( <ScrollableTabView
                                    tabBarUnderlineStyle={{backgroundColor: '#0755a6'}}
                                       tabBarBackgroundColor='#FFFFFF'
                                       tabBarActiveTextColor='#0755a6'
                                       tabBarInactiveTextColor='#777777'
                            >
                                 {this.renderListView('待处理的问题',0,solvestatusDatas[0].status)}
                                 {this.renderListView('已反馈的问题',1,solvestatusDatas[1].status)}
                            </ScrollableTabView>

                                )
                            }
                }else if(Global.isSolverLeader(Global.UserInfo)){
                    return(
                        <ScrollableTabView
                            tabBarUnderlineStyle={{backgroundColor: '#0755a6'}}
                            tabBarBackgroundColor='#FFFFFF'
                            tabBarActiveTextColor='#0755a6'
                            tabBarInactiveTextColor='#777777'>
                            {this.renderListView('未处理',0,solverLearderStatus[0].status)}
                            {this.renderListView('已回执',1,solverLearderStatus[1].status)}
                            {this.renderListView('已解决',2,solverLearderStatus[2].status)}
                            {this.renderListView('未解决',3,solverLearderStatus[3].status)}
                        </ScrollableTabView>
                    );
                }else if(Global.isCoordinator(Global.UserInfo)){
                    return(
                        <ScrollableTabView
                            tabBarUnderlineStyle={{backgroundColor: '#0755a6'}}
                            tabBarBackgroundColor='#FFFFFF'
                            tabBarActiveTextColor='#0755a6'
                            tabBarInactiveTextColor='#777777'>
                            {this.renderListView('待指派的问题',0,coordinatorStatus[0].status)}
                            {this.renderListView('已指派的问题',1,coordinatorStatus[1].status)}
                        </ScrollableTabView>
                    );
                }


    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                title={this.state.title}
                leftIcon={require('../images/back.png')}
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
        if (this._issue_list_ref) {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {

                    this._issue_list_ref._onRefresh()
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
        if (this._issue_list_ref) {
            timer = setTimeout(() => {
                    this._issue_list_ref._onRefresh()
            }, 1000);
        }
    }


    renderListView(label,index,status) {
        var userId = '';
        if (this.props.data.user) {
            userId = this.props.data.user.id
        }
        return (
            <View  tabLabel={label} style={{marginTop:10,}}>
            <IssueListView
             ref = {(c) => this._issue_list_ref = c}
             keyword = {this.state.keyword}
             style={{alignSelf:'stretch',flex:1}}
             type={this.props.type}
             userId = {userId}
             status={status}
             navigator={this.props.navigator}
             />
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
