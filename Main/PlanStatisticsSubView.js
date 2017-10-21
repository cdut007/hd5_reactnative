import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    ListView,
    ActivityIndicator,
    TouchableNativeFeedback,
    TouchableHighlight,
    AsyncStorage,
} from 'react-native';
import HttpRequest from '../HttpRequest/HttpRequest'
import Dimensions from 'Dimensions';
import NavBar from '../common/NavBar'
import CircleLabelHeadView from '../common/CircleLabelHeadView';
import px2dp from '../common/util'
import SearchBar from '../common/SearchBar';
import dateformat from 'dateformat'
import PlanListViewContainer from './PlanListViewContainer';

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var pagesize = 10;

import Global from '../common/globals.js'

var resultsCache = {
  dataForQuery: {},
  nextPageNumberForQuery: {},
  totalForQuery: {},
};
var LOADING = {};

export default class PlanStatisticsSubView extends Component {
    constructor(props) {
        super(props)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

       LOADING = {};
        this.state = {
            dataSource: ds,
            isLoading: false,
            isLoadingTail: false,
            filter: '',
            title: this.props.data.user.dept.name + "任务",
        }


    }


        back() {
            this.props.navigator.pop()
        }

    search() {

    }

    componentDidMount() {

        var me = this
        AsyncStorage.getItem('k_plan_team_info_statistics_rollingplan_'+this.props.data.user.id+"_"+this.props.type,function(errs,result)
        {
            if (!errs && result && result.length)
            {
                 console.log('read k_plan_team_info_statistics_rollingplan_@@@@'+result)
                var monitor = JSON.parse(result);
                if (monitor) {
                    Global.UserInfo.monitor = monitor ;
                    me.setState({
                        dataSource: me.state.dataSource.cloneWithRows(monitor),
                        isLoading: false,
                    });
                }

            }
            else
            {

            }
        });

        this.executePlanRequest();

    }

    onGetDataSuccess(response,body){
         console.log('onGetDataSuccess@@@@')
     var query = this.state.filter;
     if (!query) {
         query = '';
     }

        var datas = response.responseResult.datas;


        var monitor = response.responseResult.monitor;

        if (monitor) {
            Global.UserInfo.monitor = monitor;
            AsyncStorage.setItem('k_plan_team_info_statistics_rollingplan_'+body.userId+"_"+body.type, JSON.stringify(monitor), (error, result) => {
                if (error) {
                    console.log('save k_plan_team_info_statistics_rollingplan_ faild.')
                }

                console.log('save k_plan_team_info_statistics_rollingplan_: sucess')

            });

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(monitor),
                isLoading: false,
            });

        }

    }

    onItemPress(itemData){
        this.props.navigator.push({
            component: PlanListViewContainer,
             props: {
                 data:itemData,
                 type:this.props.type,
                }
        })
    }


    hasMore(){


      }

      onEndReached() {
              var query = this.state.filter;
              if (!query) {
                  query = '';
              }
              if (!this.hasMore() || this.state.isLoadingTail) {
                // We're already fetching or have all the elements so noop
                console.log('not has more, or load end')
                this.setState({
                  isLoadingTail: true,
                  isLoading: false,
              });
                return;
              }

              if (LOADING[query]) {
                console.log('query already loading')
                return;
              }

              LOADING[query] = true;
              this.setState({
                isLoadingTail: true,
            });



        }

        onSearchChange(event) {
           var filter = event.nativeEvent.text.toLowerCase();
        //    this.clearTimeout(this.timeoutID);
        //    this.timeoutID = this.setTimeout(() => this.executePlanRequest(pagesize,1,filter), 100);
        }

         renderFooter() {
           if (!this.hasMore() || !this.state.isLoadingTail) {
             return <View style={styles.scrollSpinner} />;
           }

           return <ActivityIndicator style={styles.scrollSpinner} />;
         }


    executePlanRequest(){

      console.log('executePlanRequest:')

                 this.setState({
                   isLoading: true,
                   isLoadingTail: false,
                 });


                 var paramBody = {
                      userId:this.props.data.user.id,
                      type:this.props.type
                     }

            HttpRequest.get('/statistics/rollingplan', paramBody, this.onGetDataSuccess.bind(this),
                (e) => {

                    // 
                    // this.setState({
                    //   dataSource: this.state.dataSource.cloneWithRows([]),
                    //   isLoading: false,
                    // });
                    try {
                        var errorInfo = JSON.parse(e);
                        if (errorInfo != null) {
                         console.log(errorInfo)
                        } else {
                            console.log(e)
                        }
                    }
                    catch(err)
                    {
                        console.log(err)
                    }

                    console.log('Task error:' + e)
                })
    }

    render() {
        return (
            <View style={styles.container}>

               {this.renderListView()}
            </View>
        )
    }

    index(rowID){
     var index = parseInt(rowID) + 1;
        return index;
    }

    renderRow(rowData, sectionID, rowID) {
        itemView = () => {
            if (!rowData.statistics) {
                rowData.statistics=new Object()
            }
                return (
                       <View style={styles.itemContainer}>
                        <TouchableOpacity onPress={this.onItemPress.bind(this, rowData)}>
                        <View style={styles.flexContainer}>

                        <CircleLabelHeadView style={styles.head_cell}
                            contactName = {rowData.user.realname}
                        >

                        </CircleLabelHeadView>

                        <Text style={[styles.content,{marginLeft:10}]}>
                          {rowData.user.realname}
                        </Text>

                        <View style= {[styles.cellLine,{marginLeft:8,marginRight:8,marginTop:20,marginBottom:20}]}/>

                        <Text style={{color:'#888888',fontSize:14,marginLeft:4,}}>
                          {rowData.user.dept.name + rowData.user.roles[0].name+" ("+rowData.statistics.total+")"}
                        </Text>

                        </View>


                        <View style={styles.divider}/>

                        <View style={styles.statisticsflexContainer}>

                        <View style={styles.cell}>

                          <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                            未施工
                          </Text>
                          <Text style={{color:'#1c1c1c',fontSize:14,}}>
                            {rowData.statistics.unProgressing}
                          </Text>
                        </View>


                        <View style={styles.cell}>

                        <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                          施工中
                        </Text>
                        <Text style={{color:'#1c1c1c',fontSize:14,}}>
                         {rowData.statistics.progressing}
                        </Text>
                        </View>

                        <View style={styles.cell}>

                        <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                          已完成
                        </Text>
                        <Text style={{color:'#1c1c1c',fontSize:14,}}>
                           {rowData.statistics.completed}
                        </Text>
                        </View>

                        <View style={styles.cell}>


                        <Text style={{color:'#e82628',fontSize:12,marginBottom:2,}}>
                          停滞中
                        </Text>
                        <Text style={{color:'#e82628',fontSize:14,}}>
                          {rowData.statistics.pause}
                        </Text>
                        </View>

                        </View>

                        </TouchableOpacity>

                        </View>

                )

        }
        return (
            <View style={styles.itemView}>
                {itemView()}
            </View>
        )
    }
    renderListView() {
        return (
            <ListView
                style={{ }}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                renderFooter={this.renderFooter.bind(this)}
                onEndReached={this.onEndReached.bind(this)}
               automaticallyAdjustContentInsets={false}
               keyboardDismissMode="on-drag"
               keyboardShouldPersistTaps={true}
               showsVerticalScrollIndicator={false}
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
    list:
    {
        flex: 1,
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
            marginTop:10,
    },
     statisticsflexContainer: {
              height: 57.5,
              backgroundColor: '#ffffff',
              flexDirection: 'row',
          },

    cell: {
        flex: 1,
        height: 57.5,
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
