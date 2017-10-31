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
import PlanListDeliveryView from './PlanListDeliveryView';
import PlanStatisticsSubView from './PlanStatisticsSubView';
import PlanListView from './PlanListView';
import Global from '../common/globals.js';
import ConstMapValue from '../common/ConstMapValue.js';

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;

import   ScrollableTabView  from 'react-native-scrollable-tab-view';

var timer;

var LOADING = {};

    var statusDatas = [

                {
                    index:0,
                    status:'ASSIGNED',//not use
                    data:[],
                },
            {
                    index:1,
                    status:'UNASSIGNED',
                    data:[],
                }


];


var groupStatusDatas = [{
                index:0,
                status:'UNCOMPLETE',
                data:[],
                pageNo:1,
            },

            {
                index:1,
                status:'COMPLETED',
                data:[],
                pageNo:1,
            }

];


export default class PlanStatisticsSubViewContainer extends Component {
    constructor(props) {
        super(props)


        this.state = {

            title: this.props.data.user.dept.name + "任务",
            keyword:'',
        }


    }


        back() {
            this.props.navigator.pop()
        }




    componentDidMount() {


    }



    renderGroupPlanView(label,index) {
            var plan_col_map = ConstMapValue.Plan_Col_Map(this.props.type)
        return (
            <View  tabLabel={label} style={{marginTop:10,}}>

            <View style={{backgroundColor:'#d6d6d6',height:0.5,width:width}}>
            </View>

            <View style={styles.statisticsflexContainer}>

            <View style={styles.cell}>

              <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
                {plan_col_map.col1}
              </Text>

            </View>


            <View style={styles.cell}>

            <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
             {plan_col_map.col2}
            </Text>

            </View>

            <View style={styles.cell}>

            <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
              {plan_col_map.col3}
            </Text>

            </View>

            <View style={styles.cell}>

            <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
             {plan_col_map.col4}
            </Text>

            </View>

            <View style={styles.cell}>

            <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
              {plan_col_map.col5}
            </Text>

            </View>


            </View>


            <View style={{backgroundColor:'#d6d6d6',height:0.5,width:width}}>
            </View>

            <PlanListView
            style={{alignSelf:'stretch',flex:1}}
             type={this.props.type}
             ref={(c) => this._plan_list_ref = c}
              keyword={this.state.keyword}
             status={groupStatusDatas[index].status}
             navigator={this.props.navigator}
             />
            </View>
        )
    }


    rendTabs(){
        if (Global.isGroup(Global.UserInfo)) {//for group
            return( <ScrollableTabView
                tabBarUnderlineStyle={{backgroundColor: '#f77935'}}
                   tabBarBackgroundColor='#FFFFFF'
                   tabBarActiveTextColor='#f77935'
                   tabBarInactiveTextColor='#777777'
        >
             {this.renderGroupPlanView('未完成任务',0)}
             {this.renderGroupPlanView('已完成任务',1)}
        </ScrollableTabView>

            )
        }else{
            return( <ScrollableTabView
                tabBarUnderlineStyle={{backgroundColor: '#f77935'}}
                   tabBarBackgroundColor='#FFFFFF'
                   tabBarActiveTextColor='#f77935'
                   tabBarInactiveTextColor='#777777'
        >
             {this.renderAssignedListView('已分派任务',0)}
             {this.renderUnassignedView('待分配任务',1)}
        </ScrollableTabView>

            )
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
    console.log('text=='+text);
    this.setState({keyword:text})
    if (this._plan_list_ref) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            
                this._plan_list_ref._onRefresh()
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
        if (this._plan_list_ref) {
            timer = setTimeout(() => {
                    this._plan_list_ref._onRefresh()
            }, 1000);
        }
    }


     renderUnassignedView(label,index) {
         var userId = '';
         if (this.props.data.user) {
             userId = this.props.data.user.id
         }
        return (

            <PlanListDeliveryView
             tabLabel={label}
             style={{alignSelf:'stretch',flex:1}}
             type={this.props.type}
             ref={(c) => this._plan_list_ref = c}
             status={statusDatas[index].status}
             userId={userId}
             keyword={this.state.keyword}
             navigator={this.props.navigator}
             />

        )
    }

    renderAssignedListView(label,index) {
        var userId = '';
        if (this.props.data.user) {
            userId = this.props.data.user.id
        }
        return (
            <PlanStatisticsSubView
            tabLabel={label}
             style={{alignSelf:'stretch',flex:1}}
             type={this.props.type}
             data = {this.props.data}
             userId={userId}
             status={statusDatas[index].status}
             navigator={this.props.navigator}
             />

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
