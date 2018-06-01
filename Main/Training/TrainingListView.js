/**
 * Created by Arlen_JY on 2018/5/31.
 */
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
import HttpRequest from '../../HttpRequest/HttpRequest'
import Dimensions from 'Dimensions';
import NavBar from '../../common/NavBar'
import LoadMoreFooter from '../../common/LoadMoreFooter.js'
import CircleLabelHeadView from '../../common/CircleLabelHeadView';
import px2dp from '../../common/util'
import SearchBar from '../../common/SearchBar';
import dateformat from 'dateformat'
import PlanListView from '../PlanListView';
import ConstMapValue from '../../common/ConstMapValue.js';
import ExamHomeView from  './ExamHomeView'
import Global from '../../common/globals'
const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;

import   ScrollableTabView  from 'react-native-scrollable-tab-view';
var timer;


var LOADING = {};

var statusDatas = [{
    index:0,
    status:'UNPROGRESS',
    data:[],
    pageNo:1,
},
    {
        index:1,
        status:'PROGRESSING',
        data:[],
        pageNo:1,
    },
    {
        index:2,
        status:'PAUSE',
        data:[],
        pageNo:1,
    },
    {
        index:3,
        status:'COMPLETED',
        data:[],
        pageNo:1,
    }

];

export default class PlanListViewContainer extends Component {
    constructor(props) {
        super(props)


        this.state = {

            title: "培训",
            keyword:'',
        }


    }


    back() {
        this.props.navigator.pop()
    }




    componentDidMount() {


    }



    rendTabs(){
        return( <ScrollableTabView locked={true}
                                   tabBarUnderlineStyle={{backgroundColor: '#0755a6'}}
                                   tabBarBackgroundColor='#FFFFFF'
                                   tabBarActiveTextColor='#0755a6'
                                   tabBarInactiveTextColor='#777777'
            >


                {this.renderListView('通风',0)}
                {this.renderListView('管道',1)}
                {this.renderListView('机械',2)}
                {this.renderListView('电气',3)}
            </ScrollableTabView>

        )
    }
    renderListViewArr(){
        var listViewArr = [];
        // var listArrs = [{title:通风}]
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title={this.props.title}
                    rightPress={this.exam.bind(this)}
                    rightText={'考试'}
                    leftIcon={require('../../images/back.png')}
                    leftPress={this.back.bind(this)} />
                {this.rendTabs()}
            </View>
        )
    }
    exam(){
        // Global.alert(this.props.title+'考试');
        this.props.navigator.push({
            component:ExamHomeView,
            props:{
                title:this.props.title
            }
        })

    }


    renderListView(label,index) {
        // var userId = '';
        // if (this.props.data.user) {
        //     userId = this.props.data.user.id
        // }
        // var plan_col_map = ConstMapValue.Plan_Col_Map(this.props.type)
        return (
            <View  tabLabel={label} style={{marginTop:10,}}>


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
