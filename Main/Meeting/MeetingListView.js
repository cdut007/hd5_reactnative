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
import px2dp from '../../common/util'
import SearchBar from '../../common/SearchBar';
import dateformat from 'dateformat'
import MeetingDetailView from './MeetingDetailView';
import CardView from 'react-native-cardview'

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
import Global from '../../common/globals.js'


export default class MeetingListView extends Component {
    constructor(props) {
        super(props)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

       LOADING = {};
        this.state = {
            dataSource: ds,
            isLoading: false,
            isLoadingTail: false,
            filter: '',
            isRefreshing:false,
            items:[],
            totalCount:0,

        }


    }


        back() {
            this.props.navigator.pop()
        }

    search() {

    }


        _onRefresh() {
            Global.log("_onRefresh() --> ");
            this.setState({isRefreshing:true})

            this.executeMeetingRequest(1);
        }

        _loadMoreData() {
            Global.log("_loadMoreData() --> ");
             pageNo += 1;
            this.executeMeetingRequest(pageNo);
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
            if (this.state.isRefreshing) {//userReducer.products.length < 1 ||
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

        this.executeMeetingRequest(1);
        newMeetingSubscription = DeviceEventEmitter.addListener('new_meeting',(param) => {this._onRefresh()})
        operationSubscription = DeviceEventEmitter.addListener('operate_meeting',(param)=>{this._onRefresh();})
    }

    componentWillUnmount(){
      newMeetingSubscription.remove();
      operationSubscription.remove();
    }

    onGetDataSuccess(response,paramBody){
         Global.log('onGetDataSuccess@@@@')
     var query = this.state.filter;
     if (!query) {
         query = '';
     }

        var datas = response.responseResult.data;



        if (this.state.filter !== query) {
            this.setState({
                isRefreshing:false,
            });
           // do not update state if the query is stale
           Global.log('executeMeetingRequest:pagesize this.state.filter !== query'+this.state.filter+";query="+query)
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
        this.props.navigator.push({
            component: MeetingDetailView,
             props: {
                 data:itemData,
                }
        })
    }


    hasMore(){


      }


        onSearchChange(event) {
           var filter = event.nativeEvent.text.toLowerCase();
        //    this.clearTimeout(this.timeoutID);
        //    this.timeoutID = this.setTimeout(() => this.executeMeetingRequest(pagesize,1,filter), 100);
        }




    executeMeetingRequest(index){

      Global.log('executeMeetingRequest pageNo:'+index)
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
                      type:this.props.type,
                     }


            HttpRequest.get('/conference', paramBody, this.onGetDataSuccess.bind(this),
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
            </View>
        )
    }

    index(rowID){
     var index = parseInt(rowID) + 1;
        return index;
    }

    renderImages(item){
        var itemsArray = [];
        var len = item.fileSize;
        for (var i = 0; i < len; i++) {
            itemsArray.push(<Image style={{width:24,height:24,marginLeft:10}} source={require('../../images/problem_icon_click.png')} />)
        }

        return itemsArray

    }

    renderRow(rowData, sectionID, rowID) {
        itemView = () => {
            var info = '未开始'
            //状态:pre待解决、undo待确认、unsolved仍未解决、solved已解决
            var color = '#e82628'


                return (
                    <CardView
                      cardElevation={2}
                      cardMaxElevation={2}
                      cornerRadius={5}>

                       <View style={styles.itemContainer}>
                        <TouchableOpacity onPress={this.onItemPress.bind(this, rowData)}>

                        <View style={[styles.statisticsflexContainer,]}>
                        <Text numberOfLines={2} style={{color:'#282828',fontSize:14}}>
                        test
                        </Text>

                        <View style={{marginTop:10,paddingBottom:4,flexDirection: 'row',justifyContent:'flex-start',alignItems:'center'}}>

                        <Text numberOfLines={1} style={{flex:1,color:'#888888',fontSize:12}}>
                        创建时间：{rowData.questionTime}
                        </Text>


                        <Text numberOfLines={1} style={{color:color,fontSize:12}}>
                        {info}
                        </Text>


                        </View>


                        </View>

                        <View style={{backgroundColor: '#d6d6d6',
                        width: width,
                        height: 0.5,}}/>

                        <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text numberOfLines={1}  style={{marginTop:10,color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                          会议时间：
                        </Text>

                        <Text numberOfLines={1}  style={{marginTop:10,color:'#888888',fontSize:12,marginBottom:2,}}>
                          2017-09-10 10：00
                        </Text>

                        </View>

                        <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text numberOfLines={1}  style={{marginTop:10,color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                          会议地点：
                        </Text>

                        <Text numberOfLines={1}  style={{marginTop:10,color:'#888888',fontSize:12,marginBottom:2,}}>
                          第六会议室
                        </Text>

                        </View>


                        <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text numberOfLines={1}  style={{marginTop:10,color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                          会议主持：
                        </Text>

                        <Text numberOfLines={1}  style={{marginTop:10,color:'#888888',fontSize:12,marginBottom:2,}}>
                          James
                        </Text>

                        </View>



                        <View style={{flexDirection:'row',alignItems:'center'}}>



                        <Text numberOfLines={1} style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                              附件:
                        </Text>

                        {this.renderImages(rowData)}

                        </View>


                        </TouchableOpacity>
                        <View style={{backgroundColor: '#d6d6d6',
                        width: width,
                        height: 0.5,}}/>

                        </View>
                        </CardView>

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
        height:height-130,
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
            height:220,
            backgroundColor:'#ffffff',
            padding:10,
            paddingRight:20,
    },
     statisticsflexContainer: {
              height: 54,
              backgroundColor: '#ffffff',

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
