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
import WitnessListDeliveryView from './WitnessListDeliveryView';
import WitnessStatisticsSubView from './WitnessStatisticsSubView';
import PlanListView from './PlanListView';
import Global from '../common/globals.js';

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;

import   ScrollableTabView  from 'react-native-scrollable-tab-view';



var LOADING = {};

//banzhang scan
    var statusDatas = [

                {
                    index:0,
                    status:'PENDING',
                    data:[],
                },
            {
                    index:1,
                    status:'COMPLETED',
                    data:[],
                }


];

//zuzhang scan
var groupStatusDatas = [{
                index:0,
                status:'UNCOMPLETED',
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


export default class WitnessSubViewContainer extends Component {
    constructor(props) {
        super(props)


        this.state = {

            title: this.props.data.user.dept.name + "见证",
        }


    }


        back() {
            this.props.navigator.pop()
        }




    componentDidMount() {


    }



    rendTabs(){
        return( <ScrollableTabView
            tabBarUnderlineStyle={{backgroundColor: '#f77935'}}
               tabBarBackgroundColor='#FFFFFF'
               tabBarActiveTextColor='#f77935'
               tabBarInactiveTextColor='#777777'
    >
         {this.renderUnCommitWitnessListView('待提交的见证',0)}
         {this.renderLunchedWitessListView('已发起的见证',1)}
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


     renderUnCommitWitnessListView(label,index) {
        return (

            <WitnessListDeliveryView
            tabLabel={label}
            style={{alignSelf:'stretch',flex:1}}
             type={this.props.type}
             status={statusDatas[index].status}
             navigator={this.props.navigator}
             />

        )
    }

    renderLunchedWitessListView(label,index) {
        return (
            <WitnessStatisticsSubView
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
