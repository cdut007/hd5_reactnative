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

import HttpRequest from '../../HttpRequest/HttpRequest'
import Dimensions from 'Dimensions';
import NavBar from '../../common/NavBar'
import LoadMoreFooter from '../../common/LoadMoreFooter.js'
import LoadingView from '../../common/LoadingView.js'
import SearchBar from '../../common/SearchBar';
import dateformat from 'dateformat'
import Global from '../../common/globals.js';
import QuestionDetail from '../SafeWork/QuestionDetail'
import LoadEmptyView from '../../common/LoadEmptyView'

import SearchItemFilter from '../../common/SearchItemFilter';

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



export default class QuestionList extends Component {
    constructor(props) {
        super(props)

        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

       LOADING = {};

        this.state = {
            dataSource: ds,
            isLoading: false,
            filter: '',
            isRefreshing:false,
            items:[],
            totalCount:0,
            insearch:false,
            searchKey:'',
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
            console.log("_onRefresh() --> ");
            this.setState({isRefreshing:true})

            this.executePlanRequest(1);
        }

        _loadMoreData() {



            console.log("_loadMoreData() --> ");
             pageNo = parseInt(this.state.items.length / pagesize) + 1;
            this.executePlanRequest(pageNo);
        }

        _toEnd() {

          if (this.state.insearch) {
            this.state.insearch = false;
            return;
          }

            console.log("触发加载更多 toEnd() --> ");
            //console.log("加载更多？ ",userReducer.isLoadingMore, userReducer.products.length, userReducer.totalProductCount,userReducer.isRefreshing);
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

    this.SafeWorkDeal = DeviceEventEmitter.addListener('Safe_Work',(param) => {this._onRefresh()})
    InteractionManager.runAfterInteractions(() => {
      this.executePlanRequest(1);
    });


    }

    componentWillUnmount(){
       this.SafeWorkDeal.remove();
  }

    onGetDataSuccess(response,paramBody){
         console.log('onGetDataSuccess@@@@')
    //  var query = this.state.filter;
    //  if (!query) {
    //      query = '';
    //  }


         var datas = [];
        if(response.responseResult){
            datas = response.responseResult.data
        }

        // if (this.state.filter !== query) {
        //     this.setState({
        //         isRefreshing:false,
        //     });
        //    // do not update state if the query is stale
        //    console.log('executePlanRequest:pagesize this.state.filter !== query'+this.state.filter+";query="+query)
        //    return;
        //  }

         var status = paramBody.status

        if (this.state.isRefreshing) {
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

    //  var questionData = new Object();
    //  questionData.title = "东风破";
    //  questionData.machineType = "机组20";
    //  questionData.plantType = "一汽大众";
    //  questionData.elevation = "165";
    //  questionData.RoomNumber = "228";
    //  questionData.ResDepart = "计科";
    //  questionData.team = "1组";
    //  questionData.type = this.props.detailType;
    //  questionData.time = "20171009";
    //  questionData.describe = "问题描述问题描题描述问题描述问题题描题描述问题描述问题描述";
    //  questionData.rectific = "2017/10/11";
    //  questionData.compelete = "2017/10/15";
    //  questionData.recPass = "2017/10/17";
    //  questionData.save = "2017/10/18";

      this.props.navigator.push({
          component: QuestionDetail,
          props:{
            data:itemData,
            safe:true,
            detailType:this.props.detailType,
          }
      })

    }


    hasMore(){



      }


        onSearchChange(text) {

           var text = text.toLowerCase();

          this.fileterArr(text);

          //  this.clearTimeout(this.timeoutID);
          //  this.timeoutID = this.setTimeout(() => this.executePlanRequest(pagesize,1,filter), 100);
        }

        fileterArr(text){

this.state.searchKey=text;
this.state.insearch = true;

    if (text === '') {
  this._onRefresh();
 // this.setState({
 //   dataSource:this.state.dataSource.cloneWithRows(this.state.items),

 // })

    }else {
this._onRefresh();
//    var a2 = this.state.items.filter(
//       (item) => ((Global.formatDate(item.createDate).toLowerCase().indexOf(text) !== -1) || (item.createUser.toLowerCase().indexOf(text) !== -1) ||  (item.problemTitle.toLowerCase().indexOf(text) !== -1) || (this.getStatus(item.problemStatus).indexOf(text) !== -1))
// );


//      this.setState({
//          dataSource:this.state.dataSource.cloneWithRows(a2),
//      })

    }
  }





    executePlanRequest(index){

      console.log('executePlanRequest pageNo:'+index)
                var loading = false;
                if (this.state.items.length == 0) {
                        loading = true
                }

                 this.setState({
                   isLoading: loading,
                 });




                 var paramBody = {
                      pagesize:pagesize,
                      pagenum:index,
                      keyword:this.state.searchKey
                     }

                 if (this.props.problemStatus) {

                  paramBody.problemStatus = this.props.problemStatus

                  }

                if (this.props.probelmType) {

                paramBody.probelmType = this.props.probelmType

                }

                if (this.props.problemSolveStatus) {
                      paramBody.problemSolveStatus = this.props.problemSolveStatus
              }
                if (this.state.problemStatus) {
                      paramBody.problemStatus = this.state.problemStatus
              }

                if (this.state.createTime) {
                      paramBody.createTime = this.state.createTime
              }
                if (this.state.targetTime) {
                      paramBody.targetTime = this.state.targetTime
              }

              var url = '/hse/problemList';
              if(this.props.type == 'dept_scan'){
                paramBody.oneOf3Type = this.props.oneOf3Type;
                  paramBody.responsibleDept = this.props.deptId;
                  url = '/hse/problemList3m';
              }
              


            HttpRequest.get(url, paramBody, this.onGetDataSuccess.bind(this),
                (e) => {


                    this.setState({
                      dataSource: this.state.dataSource.cloneWithRows([]),
                      isLoading: false,
                      isRefreshing:false,
                    });

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


 renderSearchItemFilter(){
   return(
               <SearchItemFilter
                
               onSearchFilterChange={(createTime,targetTime,problemStatus) =>
               (
               this.renderFilter(createTime,targetTime,problemStatus)
              )}
               />


     )
}

  renderFilter(createTime,targetTime,problemStatus){
    if(createTime){
                this.state.createTime = createTime+'0';
               }
                if(targetTime){
                this.state.targetTime = targetTime+'0';
               }
                if(problemStatus){
                 this.state.problemStatus = problemStatus;
               }
                this._onRefresh()
  }

    render() {
        return (

            <View style={styles.container}>
             <View style={styles.searchFliterflexContainer}>
            {this.renderSearchItemFilter()}
            </View>
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

            var textColor ='#707070';
            if(rowData.delay){
                 textColor ='#ff0000';
            }

                return (

                       <View style={styles.itemContainer}>
                        <TouchableOpacity onPress={this.onItemPress.bind(this, rowData)}>

                        <View style={styles.statisticsflexContainer}>

                        <View style={styles.cell}>

                          <Text numberOfLines={2}  style={{color:textColor,fontSize:12,marginBottom:2,textAlign:'center'}}>
                            {Global.formatDate(rowData.createDate)}
                          </Text>

                        </View>


                        <View style={styles.cell}>

                        <Text numberOfLines={1} style={{color:textColor,fontSize:8,marginBottom:2,}}>
                              {rowData.problemTitle}
                        </Text>

                        </View>

                        <View style={styles.cell}>

                        <Text style={{color:textColor,fontSize:12,marginBottom:2,}}>
                           {rowData.createUser}
                        </Text>

                        </View>

                        <View style={styles.cell}>

                        <Text style={{color:textColor,fontSize:12,marginBottom:2,}}>
                           {this.getStatus(rowData.problemStatus)}
                        </Text>

                        </View>




                        </View>


                        </TouchableOpacity>
                        <View style={{backgroundColor: '#d6d6d6',
                        width: width,
                        height: 0.5,}}/>

                        </View>

                )

        }

        return (
            <View style={styles.itemView}>
                {itemView()}
            </View>
        )
    }

   //问题执行状态
   getStatus(status){

     if (status == 'Need_Handle') {
         return '新问题'
     }else if (status == 'Renovating') {
         return '整改中'
     }else if (status == 'PreRenovete') {
         return '待整改'
     }else if (status == 'PreUpRenovete') {
         return '待整改'
     }else if (status == 'Need_Check') {
         return '待审核'
     }else if (status == 'Finish') {
         return '已完成'
     }else if(status == 'None'){
         return '不需处理'
     }else if(status == 'Need_A_Check'){
         return '待编制审查'
     }else {
       return status
     }
   }

   filStatus(status){

     if (status == 'Need_Handle') {
         return 'xinwenti'
     }else if (status == 'Renovating') {
         return 'zhenggaizhong'
     }else if (status == 'Need_Check') {
         return 'daishenhe'
     }else if (status == 'Finish') {
         return 'yiwancheng'
     }else if(status == 'None'){
         return 'buxuchuli'
     }else {
       return status
     }
   }

   //搜索框
   renderSearchBar(){

    return(
      <View style={styles.SearchBarStyle}>
                <SearchBar
                isLoading={false}
                onSearchChange={(event) => this.onSearchChange(event)}
                />
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
        flex:1,
         width: width
    },
    topView: {
        height: 150,
        width: width,
    },
     searchFliterflexContainer: {
              height: 64,
              backgroundColor: '#ffffff',
              flexDirection: 'row',
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
           height: 48,
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
              height: 48,
              backgroundColor: '#ffffff',
              flexDirection: 'row',
          },

    cell: {
        flex: 1,
        height: 48,
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
    SearchBarStyle : {
         borderRadius: 6,
         borderColor: '#cccccc',
         borderWidth : 1,
         marginTop: 10,
         marginRight: 10,
         marginLeft: 10,
         marginBottom: 10,
    }
});
