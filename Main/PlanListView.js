import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    ListView,
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
import LoadEmptyView from '../common/LoadEmptyView.js'
import LoadingView from '../common/LoadingView.js'
import px2dp from '../common/util'
import SearchBar from '../common/SearchBar';
import dateformat from 'dateformat'
import PlanDetailView from './PlanDetailView';
import PlanWriteLastStepDetailView from './PlanWriteLastStepDetailView';
import Global from '../common/globals.js';
import ConstMapValue from '../common/ConstMapValue.js';
const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var pagesize = 10;
var pageNo = 1;

var resultsCache = {
  dataForQuery: {},
  nextPageNumberForQuery: {},
  totalForQuery: {},
};
var LOADING = {};


var plan_col_map_val;

export default class PlanListView extends Component {
    constructor(props) {
        super(props)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        plan_col_map_val = ConstMapValue.Plan_Col_Map_Value(this.props.type)

       LOADING = {};
        this.state = {
            dataSource: ds,
            isLoading: false,
            filter: '',
            isRefreshing:false,
            items:[],
            totalCount:0,

        }


    }

    _closeLoading() {
		this.setState({
			showLoading: false
		})
	}


        back() {
            this.props.navigator.pop()
        }

    search() {

    }


        _onRefresh() {
            Global.log("_onRefresh() --> ");
            this.setState({isRefreshing:true})

            this.executePlanRequest(1);
        }

        _loadMoreData() {
            Global.log("_loadMoreData() --> ");
             pageNo = parseInt(this.state.items.length / pagesize) + 1;
            this.executePlanRequest(pageNo);
        }

        _toEnd() {
            Global.log("触发加载更多 toEnd() --> ");
            //Global.log("加载更多？ ",userReducer.isLoadingMore, userReducer.products.length, userReducer.totalProductCount,userReducer.isRefreshing);
            //ListView滚动到底部，根据是否正在加载更多 是否正在刷新 是否已加载全部来判断是否执行加载更多
            if (this.state.items.length >= this.state.totalCount || this.state.isRefreshing) {//userReducer.isLoadingMore ||
                return;
            };
            InteractionManager.runAfterInteractions(() => {
                this._loadMoreData();
            });
        }

        _renderFooter(label,index) {
            //const { userReducer } = this.props;
            //通过当前product数量和刷新状态（是否正在下拉刷新）来判断footer的显示
            if (this.state.isRefreshing || this.state.isLoading ) {
                return null
            };

            if (this.state.items.length < 1) {
                return <LoadEmptyView />
            };

            if (this.state.items.length < this.state.totalCount) {
                //还有更多，默认显示‘正在加载更多...’
                return <LoadMoreFooter />
            }else{
                // 加载全部
                return <LoadMoreFooter isLoadAll={true}/>
            }
        }


    componentDidMount() {

        this.executePlanRequest(1);
        mSubscription = DeviceEventEmitter.addListener('plan_update',(param)=>{this._onRefresh();})
        mWorkStepSubscription = DeviceEventEmitter.addListener('workstep_update',(param)=>{this._onRefresh();})
        mIssueSubscription = DeviceEventEmitter.addListener('new_issue',(param)=>{this._onRefresh();})
        mIssueOperateSubscription = DeviceEventEmitter.addListener('operate_issue',(param)=>{this._onRefresh();})


    }

        componentWillUnmount(){
          mSubscription.remove();
          mWorkStepSubscription.remove();
          mIssueSubscription.remove();
          mIssueOperateSubscription.remove();
        }


    onGetDataSuccess(response,paramBody){
         Global.log('onGetDataSuccess@@@@')
     var query = this.state.filter;
     if (!query) {
         query = '';
     }

         var datas = [];
        if(response.responseResult){
            datas = response.responseResult.data
        }

        if (!datas) {
            datas = []
        }


        if (this.state.filter !== query) {
            this.setState({
                isRefreshing:false,
            });
           // do not update state if the query is stale
           Global.log('executePlanRequest:pagesize this.state.filter !== query'+this.state.filter+";query="+query)
           return;
         }

         var status = paramBody.status

        if (this.state.isRefreshing || pageNo == 1 ) {
            this.state.items = datas;
            pageNo = 1;
        }else{
            for (var i = 0; i < datas.length; i++) {
                this.state.items.push(datas[i])
            }
        }

        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(this.state.items),
            isLoading: false,
            isRefreshing:false,
            totalCount:response.responseResult.totalCounts
        });

    }

    onItemPress(itemData){
        if (Global.isGroup(Global.UserInfo)) {
            this.props.navigator.push({
                component: PlanWriteLastStepDetailView,
                 props: {
                     data:itemData,
                    }
            })
        }else{
            this.props.navigator.push({
                component: PlanDetailView,
                 props: {
                     data:itemData,
                     type:this.props.type,
                    }
            })
        }

    }


    hasMore(){


      }


        onSearchChange(event) {
           var filter = event.nativeEvent.text.toLowerCase();
        //    this.clearTimeout(this.timeoutID);
        //    this.timeoutID = this.setTimeout(() => this.executePlanRequest(pagesize,1,filter), 100);
        }




    executePlanRequest(index){

      Global.log('executePlanRequest pageNo:'+index)
                var loading = false;
                if (this.state.items.length == 0) {
                        loading = true
                }

                 this.setState({
                   isLoading: loading,
                 });

                 var userId= ''
                 if (this.props.userId) {
                     userId = this.props.userId;
                 }

                 var paramBody = {
                      pagesize:pagesize,
                      pagenum:index,
                      type:this.props.type,
                      status:this.props.status,
                      userId:userId,
                     }

                     if (this.props.keyword) {
                         paramBody.keyword = this.props.keyword
                     }

            HttpRequest.get('/rollingplan', paramBody, this.onGetDataSuccess.bind(this),
                (e) => {

                    this.setState({
                      dataSource: this.state.dataSource.cloneWithRows([]),
                      isLoading: false,
                      isRefreshing:false,
                    });
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



    render() {
        return (
            <View style={styles.container}>
            {this.renderListView()}
            <LoadingView showLoading={ this.state.isLoading } closeLoading={ this._closeLoading.bind(this)}></LoadingView>
            </View>
        )
    }

    index(rowID){
     var index = parseInt(rowID) + 1;
        return index;
    }



    renderRow(rowData, sectionID, rowID) {
        itemView = () => {

            var styleItem = [styles.statisticsflexContainer,{backgroundColor:'#ffffff'}]
            if (rowData.backFill) {
                styleItem = [styles.statisticsflexContainer,{backgroundColor:'#fae7dd'}]
            }
            if (rowData.problemFlag) {
                styleItem = [styles.statisticsflexContainer,{backgroundColor:'#fce71b'}]
            }

                return (

                       <View style={styles.itemContainer}>
                        <TouchableOpacity onPress={this.onItemPress.bind(this, rowData)}>


                        <View style={styleItem}>

                        <View style={styles.cell}>

                        <Text numberOfLines={2} style={{color:'#707070',fontSize:9,marginBottom:2,padding:10,textAlign:'center'}}>
                             {rowData[plan_col_map_val.val1]}
                        </Text>


                        </View>


                        <View style={styles.cell}>

                        <Text numberOfLines={2} style={{color:'#707070',fontSize:9,marginBottom:2,textAlign:'center'}}>
                             {rowData[plan_col_map_val.val2]}
                        </Text>

                        </View>

                        <View style={styles.cell}>

                        <Text style={{color:'#707070',fontSize:9,marginBottom:2,}}>
                           {rowData[plan_col_map_val.val3]}
                        </Text>

                        </View>

                        <View style={styles.cell}>

                        <Text numberOfLines={2} style={{color:'#707070',fontSize:9,marginBottom:2,}}>
                           {rowData[plan_col_map_val.val4]}
                        </Text>

                        </View>

                        <View style={styles.cell}>

                        <Text numberOfLines={3}  style={{color:'#707070',fontSize:9,marginBottom:2,textAlign:'center'}}>
                            {Global.formatDate(rowData.planBeginProgressDate)}
                          </Text>

                        </View>




                        </View>


                        </TouchableOpacity>
                        <View style={{backgroundColor: '#d6d6d6',
                        width: width,
                        height: 0.5,}}/>

                        </View>

                )
                //planBeginProgressDate

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
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                renderFooter={this._renderFooter.bind(this)}
            	onEndReached={this._toEnd.bind(this)}
                onEndReachedThreshold={10}
                enableEmptySections={true}
                refreshControl={
    						<RefreshControl
    							refreshing={ this.state.isRefreshing }
    							onRefresh={ this._onRefresh.bind(this) }
    							tintColor="gray"
    							colors={['#0755a6', '#0755a6', '#0755a6']}
    							progressBackgroundColor="#ffffff"/>
    						}/>
        )
    }




}


const styles = StyleSheet.create({
    container: {
        width: width,
        height:height-200,
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
