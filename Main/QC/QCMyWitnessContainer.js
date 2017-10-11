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
import QCWitnessListView from './QCWitnessListView.js';

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
import Global from '../../common/globals.js'
import   ScrollableTabView  from 'react-native-scrollable-tab-view';



var LOADING = {};

var qcteamstatusDatas = [{
                index:0,
                status:'UNHANDLED',
                data:[],
                pageNo:1,
            },
            {
                index:1,
                status:'HANDLED',
                data:[],
                pageNo:1,
            }

];
var qc2teamstatusDatas = [

    {
        index:0,
        status:'UNHANDLED',
        data:[],
        pageNo:1,
    },
    {
        index:1,
        status:'QUALIFIED',
        data:[],
        pageNo:1,
    },
    {
                index:2,
                status:'UNQUALIFIED',
                data:[],
                pageNo:1,
            }


];

    var qc1statusDatas = [{
                    index:0,
                    status:'QUALIFIED',
                    data:[],
                    pageNo:1,
                },
                {
                    index:1,
                    status:'UNQUALIFIED',
                    data:[],
                    pageNo:1,
                }

];

export default class QCMyWitnessContainer extends Component {
    constructor(props) {
        super(props)

        var title = this.props.title;
        if (!title) {
            title = "我的见证"
        }
        this.state = {

            title: title,
        }


    }


        back() {
            this.props.navigator.pop()
        }




    componentDidMount() {


    }



    rendTabs(){
            if (Global.isQCTeam(Global.UserInfo)) {
                return( <ScrollableTabView
                    tabBarUnderlineStyle={{backgroundColor: '#f77935'}}
                       tabBarBackgroundColor='#FFFFFF'
                       tabBarActiveTextColor='#f77935'
                       tabBarInactiveTextColor='#777777'
            >
                 {this.renderListView('未完成的见证',0,qcteamstatusDatas[0].status)}
                 {this.renderListView('已完成的见证',1,qcteamstatusDatas[1].status)}

            </ScrollableTabView>
                )
            }else if (Global.isQC2Team(Global.UserInfo)) {
                if (this.props.scanQC2Member) {
                    return( <ScrollableTabView
                        tabBarUnderlineStyle={{backgroundColor: '#f77935'}}
                           tabBarBackgroundColor='#FFFFFF'
                           tabBarActiveTextColor='#f77935'
                           tabBarInactiveTextColor='#777777'
                >
                     {this.renderListView('未完成的见证',0,qcteamstatusDatas[0].status)}
                     {this.renderListView('已完成的见证',1,qcteamstatusDatas[1].status)}

                </ScrollableTabView>
                    )
                }else{
                    return( <ScrollableTabView
                        tabBarUnderlineStyle={{backgroundColor: '#f77935'}}
                           tabBarBackgroundColor='#FFFFFF'
                           tabBarActiveTextColor='#f77935'
                           tabBarInactiveTextColor='#777777'
                >
                     {this.renderListView('待提交的见证',0,qc2teamstatusDatas[0].status)}
                     {this.renderListView('已合格的见证',1,qc2teamstatusDatas[1].status)}
                     {this.renderListView('不合格的见证',2,qc2teamstatusDatas[2].status)}

                </ScrollableTabView>
                    )
                }

                }else{
                return( <ScrollableTabView
                    tabBarUnderlineStyle={{backgroundColor: '#f77935'}}
                       tabBarBackgroundColor='#FFFFFF'
                       tabBarActiveTextColor='#f77935'
                       tabBarInactiveTextColor='#777777'
            >
                 {this.renderListView('已合格的见证',0,qc1statusDatas[0].status)}
                 {this.renderListView('未合格的见证',1,qc1statusDatas[1].status)}

            </ScrollableTabView>
                )
            }

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


    renderListView(label,index,status) {
        var userId = '';
        if (this.props.data && this.props.data.user) {
            userId = this.props.data.user.id
        }

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
                                  见证时间
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
                                  见证地点
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
                                  见证点类型
            </Text>
                                <Image
                                style={{width:20,height:20}}
                                source={require('../../images/unfold.png')}/>
            </TouchableOpacity>

            </View>


            </View>


            <View style={{backgroundColor:'#d6d6d6',height:0.5,width:width}}>
            </View>

            <QCWitnessListView
            style={{alignSelf:'stretch',flex:1}}
             type={this.props.type}
             status={status}
             userId={userId}
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
