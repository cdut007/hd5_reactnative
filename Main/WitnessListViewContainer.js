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
import HttpRequest from '../HttpRequest/HttpRequest'
import Dimensions from 'Dimensions';
import NavBar from '../common/NavBar'
import LoadMoreFooter from '../common/LoadMoreFooter.js'
import CircleLabelHeadView from '../common/CircleLabelHeadView';
import px2dp from '../common/util'
import SearchBar from '../common/SearchBar';
import dateformat from 'dateformat'
import WorkStepWitnessListView from './WorkStepWitnessListView.js';
import ConstMapValue from '../common/ConstMapValue.js';
const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;

import   ScrollableTabView  from 'react-native-scrollable-tab-view';
import Global from '../common/globals.js';


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

export default class WitnessListViewContainer extends Component {
    constructor(props) {
        super(props)


        this.state = {

            title: this.props.data.user.dept.name + "见证",
            keyword:'',
        }


    }


        back() {
            this.props.navigator.pop()
        }




    componentDidMount() {

        mSubscription = DeviceEventEmitter.addListener('witness_update',(param)=>{
            console.log('update-----');
            this.setState({...this.state});})


    }
    componentWillUnmount(){
      mSubscription.remove();
    }


    rendTabs(){
        return( <ScrollableTabView locked={true}
            tabBarUnderlineStyle={{backgroundColor: '#0755a6'}}
               tabBarBackgroundColor='#FFFFFF'
               tabBarActiveTextColor='#0755a6'
               tabBarInactiveTextColor='#777777'
    >
         {this.renderListView('已完成的见证',0)}
         {this.renderListView('未完成的见证',1)}

    </ScrollableTabView>

        )
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                title={this.state.title}
                searchMode={true}
                onSearchChanged={(text) => this.onSearchChanged(text)}
                onSearchClose = {this.onSearchClose.bind(this)}
                leftIcon={require('../images/back.png')}
                leftPress={this.back.bind(this)} />
                {this.rendTabs()}
            </View>
        )
    }

    onSearchChanged(text){
    console.log('text=='+text);
    this.setState({keyword:text})
    if (this._plan_list_ref) {
        setTimeout(() => {
                this._plan_list_ref._onRefresh()
        }, 1000 * 2);
    }

    }

    onSearchClose(){
        if (this.state.keyword == '') {
            return
        }
        this.setState({keyword:''})
        if (this._plan_list_ref) {
            setTimeout(() => {
                    this._plan_list_ref._onRefresh()
            }, 1000 * 2);
        }
    }


    renderListView(label,index) {
            var witness_col_map = ConstMapValue.Witness_Col_Map(this.props.type)
        return (
            <View  tabLabel={label} style={{marginTop:10,}}>

            <View style={{backgroundColor:'#d6d6d6',height:0.5,width:width}}>
            </View>

            <View style={[{alignItems:'center',},styles.statisticsflexContainer]}>

            <View style={styles.cell}>

              <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
                {witness_col_map.col1}
              </Text>

            </View>


            <View style={styles.cell}>

            <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
             {witness_col_map.col2}
            </Text>

            </View>

            <View style={styles.cell}>

            <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
            {witness_col_map.col3}
            </Text>

            </View>

            <View style={styles.cell}>

            <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
             {witness_col_map.col4}
            </Text>

            </View>


            </View>


            <View style={{backgroundColor:'#d6d6d6',height:0.5,width:width}}>
            </View>

             {this.renderListInfo(index)}
            </View>
        )
    }

  renderListInfo(index){
      if (Global.isCaptain(Global.UserInfo)||Global.isMonitor(Global.UserInfo)||Global.isGroup(Global.UserInfo)) {
          return(
              <WorkStepWitnessListView
              style={{alignSelf:'stretch',flex:1}}
               type={this.props.type}
               userId={this.props.data.user.id}
              ref={(c) => this._plan_list_ref = c}
               status={statusDatas[index].status}
              keyword={this.state.keyword}
               navigator={this.props.navigator}
               />
          )
      }else {
          console.log('tttttttttttttttttttttttttttt unkone....');
          return

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
