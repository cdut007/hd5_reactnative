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


const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;

import   ScrollableTabView  from 'react-native-scrollable-tab-view';



var LOADING = {};

    var statusDatas = [

                {
                    index:0,
                    status:'BEGIN',
                    data:[],
                },
            {
                    index:1,
                    status:'NOT_BEGIN',
                    data:[],
                }


];

export default class PlanStatisticsSubViewContainer extends Component {
    constructor(props) {
        super(props)


        this.state = {

            title: this.props.data.user.dept.name + "任务",
        }


    }


        back() {
            this.props.navigator.pop()
        }




    componentDidMount() {


    }



    rendTabs(){
        return( <ScrollableTabView
            tabBarUnderlineStyle={{backgroundColor: '#0755a6'}}
               tabBarBackgroundColor='#FFFFFF'
               tabBarActiveTextColor='#0755a6'
               tabBarInactiveTextColor='#777777'
    >
         {this.renderAssignedListView('已分派任务',0)}
         {this.renderUnassignedView('待分配任务',1)}
    </ScrollableTabView>

        )
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                title={this.state.title}
                leftIcon={require('../images/back.png')}
                leftPress={this.back.bind(this)} />
                {this.rendTabs()}
            </View>
        )
    }


     renderUnassignedView(label,index) {
        return (

            <PlanListDeliveryView
            tabLabel={label}
            style={{alignSelf:'stretch',flex:1}}
             type={this.props.type}
             status={statusDatas[index].status}
             navigator={this.props.navigator}
             />

        )
    }

    renderAssignedListView(label,index) {
        return (
            <PlanStatisticsSubView
            tabLabel={label}
             style={{alignSelf:'stretch',flex:1}}
             type={this.props.type}
             data = {this.props.data}
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
