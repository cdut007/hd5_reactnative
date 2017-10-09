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
            if (this.state.isRefreshing || this.state.items.length < 1) {
                return null
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

    }

    onGetDataSuccess(response,paramBody){
         console.log('onGetDataSuccess@@@@')
     var query = this.state.filter;
     if (!query) {
         query = '';
     }

         var datas = [];
        if(response.responseResult){
            datas = response.responseResult.data
        }

        if (this.state.filter !== query) {
            this.setState({
                isRefreshing:false,
            });
           // do not update state if the query is stale
           console.log('executePlanRequest:pagesize this.state.filter !== query'+this.state.filter+";query="+query)
           return;
         }

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

     var questionData = new Object();

     questionData.title = "东风破";
     questionData.machineType = "机组20";
     questionData.plantType = "一汽大众";
     questionData.elevation = "165";
     questionData.RoomNumber = "228";
     questionData.ResDepart = "计科";
     questionData.team = "1组";
     questionData.type = "1001";
     questionData.time = "20171009";
     questionData.describe = "问题描述问题描题描述问题描述问题题描题描述问题描述问题描述";


      this.props.navigator.push({
          component: QuestionDetail,
          props:{
            data:questionData,
          }
      })

    }


    hasMore(){



      }


        onSearchChange(event) {

           var text = event.nativeEvent.text.toLowerCase();

          this.fileterArr(text);

          //  this.clearTimeout(this.timeoutID);
          //  this.timeoutID = this.setTimeout(() => this.executePlanRequest(pagesize,1,filter), 100);
        }

        fileterArr(text){

    if (text === '') {

 this.setState({
   dataSource:this.state.dataSource.cloneWithRows(this.state.items),

 })
    return;

    }else {

   var a2 = this.state.items.filter(
      (item) => ((item.projectType.toLowerCase().indexOf(text) !== -1) || (item.projectNo.toLowerCase().indexOf(text) !== -1) || (item.weldno.toLowerCase().indexOf(text) !== -1) || (Global.formatDate(item.planStartDate)).toLowerCase().indexOf(text) !== -1)
);


     this.setState({
         dataSource:this.state.dataSource.cloneWithRows(a2),
     })

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

                return (

                       <View style={styles.itemContainer}>
                        <TouchableOpacity onPress={this.onItemPress.bind(this, rowData)}>

                        <View style={styles.statisticsflexContainer}>

                        <View style={styles.cell}>

                          <Text numberOfLines={3}  style={{color:'#707070',fontSize:12,marginBottom:2,textAlign:'center'}}>
                            {Global.formatDate(rowData.planStartDate)}{'\n'}～{'\n'}{Global.formatDate(rowData.planEndDate)}
                          </Text>

                        </View>


                        <View style={styles.cell}>

                        <Text numberOfLines={1} style={{color:'#707070',fontSize:8,marginBottom:2,}}>
                              {rowData.projectNo}
                        </Text>

                        </View>

                        <View style={styles.cell}>

                        <Text style={{color:'#707070',fontSize:12,marginBottom:2,}}>
                           {rowData.weldno}
                        </Text>

                        </View>

                        <View style={styles.cell}>

                        <Text style={{color:'#707070',fontSize:12,marginBottom:2,}}>
                           {rowData.projectType}
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
