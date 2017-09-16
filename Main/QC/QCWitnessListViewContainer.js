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
import QCWitnessListDeliveryView from './QCWitnessListDeliveryView.js';

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;

import   ScrollableTabView  from 'react-native-scrollable-tab-view';



var LOADING = {};

    var statusDatas = [{
                    index:0,
                    status:'COMPLETED',
                    data:[],
                    pageNo:1,
                },
                {
                    index:1,
                    status:'UNCOMPLETED',
                    data:[],
                    pageNo:1,
                }

];

export default class QCQCWitnessListDeliveryViewContainer extends Component {
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
            tabBarUnderlineStyle={{backgroundColor: '#0755a6'}}
               tabBarBackgroundColor='#FFFFFF'
               tabBarActiveTextColor='#0755a6'
               tabBarInactiveTextColor='#777777'
    >
         {this.renderListView('待提交的见证',0)}
         {this.renderListView('已发起的见证',1)}

    </ScrollableTabView>

        )
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                title={this.state.title}
                leftIcon={require('../../images/back.png')}
                leftPress={this.back.bind(this)} />
                {this.rendTabs()}
            </View>
        )
    }


    renderListView(label,index) {
        return (
            <View  tabLabel={label} style={{marginTop:10,}}>

            <View style={{backgroundColor:'#d6d6d6',height:0.5,width:width}}>
            </View>

            <View style={[{alignItems:'center',},styles.statisticsflexContainer]}>

            <View style={[styles.cell,{alignItems:'center',padding:4,backgroundColor:'#f2f2f2'}]}>

            <TouchableOpacity style={{borderWidth:0.5,
                  alignItems:'center',
                  borderColor : '#f77935',
                  backgroundColor : 'white',
                  borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:4,paddingRight:4,paddingTop:8,paddingBottom:8}}>
            <Text style={{color:'#f77935',fontSize:10,flex:1}}>
                                  发起日期
            </Text>
                                <Image
                                style={{width:20,height:20}}
                                source={require('../../images/unfold.png')}/>
            </TouchableOpacity>

            </View>

            <View style={[styles.cell,{alignItems:'center',padding:4,backgroundColor:'#f2f2f2'}]}>

            <TouchableOpacity style={{borderWidth:0.5,
                  alignItems:'center',
                  borderColor : '#f77935',
                  backgroundColor : 'white',
                  borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:4,paddingRight:4,paddingTop:8,paddingBottom:8}}>
            <Text style={{color:'#f77935',fontSize:10,flex:1}}>
                                  工序编号
            </Text>
                                <Image
                                style={{width:20,height:20}}
                                source={require('../../images/unfold.png')}/>
            </TouchableOpacity>

            </View>

            <View style={[styles.cell,{alignItems:'center',padding:4,backgroundColor:'#f2f2f2'}]}>

            <TouchableOpacity style={{borderWidth:0.5,
                  alignItems:'center',
                  borderColor : '#f77935',
                  backgroundColor : 'white',
                  borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:4,paddingRight:4,paddingTop:8,paddingBottom:8}}>
            <Text style={{color:'#f77935',fontSize:10,flex:1}}>
                                  见证点
            </Text>
                                <Image
                                style={{width:20,height:20}}
                                source={require('../../images/unfold.png')}/>
            </TouchableOpacity>

            </View>

            <View style={[styles.cell,{alignItems:'center',padding:4,backgroundColor:'#f2f2f2'}]}>

            <TouchableOpacity style={{borderWidth:0.5,
                  alignItems:'center',
                  borderColor : '#f77935',
                  backgroundColor : 'white',
                  borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:4,paddingRight:4,paddingTop:8,paddingBottom:8}}>
            <Text style={{color:'#f77935',fontSize:10,flex:1}}>
                                  焊口/支架
            </Text>
                                <Image
                                style={{width:20,height:20}}
                                source={require('../../images/unfold.png')}/>
            </TouchableOpacity>

            </View>


            </View>


            <View style={{backgroundColor:'#d6d6d6',height:0.5,width:width}}>
            </View>

            <QCWitnessListDeliveryView
            style={{alignSelf:'stretch',flex:1}}
             type={this.props.type}
             status={statusDatas[index].status}
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
