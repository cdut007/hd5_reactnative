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
    WebView
} from 'react-native';
import HttpRequest from '../../HttpRequest/HttpRequest'
import Dimensions from 'Dimensions';
import NavBar from '../../common/NavBar'
import LoadMoreFooter from '../../common/LoadMoreFooter.js'
import px2dp from '../../common/util'
import SearchBar from '../../common/SearchBar';
import dateformat from 'dateformat'
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


export default class NoticeExpiredListView extends Component {
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
            data:this.props.data,
            totalCount:0,
            WebViewHeight:200,

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


        var datas = response.responseResult.files;





         var status = paramBody.status

         this.state.items = datas;
         pageNo = 1;

        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(this.state.items),
            isLoading: false,
            isRefreshing:false,
            totalCount:response.responseResult.totalCounts
        });

    }

    onItemPress(itemData){


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
                     }


            HttpRequest.get('/expire_notice/'+this.props.data.id, paramBody, this.onGetDataSuccess.bind(this),
                (e) => {


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
            <NavBar
            title={'文件失效通知详情'}
            leftIcon={require('../../images/back.png')}
            leftPress={this.back.bind(this)} />
            {this.renderTop()}
            {this.renderListView()}
            </View>
        )
    }

    renderTop(){

        return( <View style={{height:this.state.WebViewHeight + 74,marginBottom:10}}>
          <TouchableOpacity style={[styles.itemContainer,]}>

          {/* <Text numberOfLines={4} style={{color:'#282828',fontSize:14}}>

          各位领导，各部门负责人：
            下列文件已失效，不再使用，请在
            <Text style={{color:'#e82628'}}>2017年11月29日</Text>
            前，将失效文件（纸质版）退回文档组，同时请自行删除电子版文件（PDF版），以避免误用。

          </Text> */}
          <WebView  style={{width:width,height:this.state.WebViewHeight}}

                         source={{html: `<!DOCTYPE html><html><body style="height:100%">${this.state.data.content}<script>window.onload=function(){window.location.hash = 1;document.title = document.body.clientHeight;}</script></body></html>`}}
                          javaScriptEnabled={true}
                          domStorageEnabled={true}
                          bounces={false}
                          scrollEnabled={false}
                          automaticallyAdjustContentInsets={true}
                          contentInset={{top:0,left:0}}
                          onNavigationStateChange={(title)=>{
                            //   if(title.title != undefined) {
                            //       this.setState({
                            //           WebViewHeight:(parseInt(title.title)+20)
                            //       })
                            //   }
                          }}
                 >

                 </WebView>


          <Text numberOfLines={1}  style={{marginTop:10,color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
            {this.state.data.department}
          </Text>

          <View style={{backgroundColor: '#d6d6d6',
          width: width,
          height: 1,}}/>


          <View style={{flexDirection:'row',alignItems:'center'}}>
          <View style={{flex:1,flexDirection:'row',}}>
          <Text numberOfLines={1} style={{marginTop:5,color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                编制日期：
          </Text>

          <Text numberOfLines={1} style={{marginTop:5,color:'#777777',fontSize:12}}>
         {Global.formatDate(this.state.data.writeTime)}
          </Text>

          </View>

          <Text numberOfLines={1} style={{marginTop:5,color:'#1c1c1c',fontSize:12}}>
          编号：
          </Text>
          <Text numberOfLines={1} style={{marginTop:5,color:'#777777',fontSize:12}}>
          {this.state.data.no}
          </Text>

          </View>




          <View style={{flexDirection:'row',alignItems:'center'}}>



         <View style={{flex:1,flexDirection:'row',}}>
         <Text numberOfLines={1} style={{marginTop:5,color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
               审批日期：
         </Text>

         <Text numberOfLines={1} style={{marginTop:5,color:'#777777',fontSize:12}}>
        {Global.formatDate(this.state.data.approvelTime)}
         </Text>

         </View>

         <Text numberOfLines={1} style={{marginTop:5,color:'#1c1c1c',fontSize:12}}>
         发布时间：
         </Text>
         <Text numberOfLines={1} style={{marginTop:5,color:'#777777',fontSize:12}}>
        {Global.formatFullDateDisplay(this.state.data.publishTime)}
         </Text>

          </View>


          </TouchableOpacity>
          <View style={{backgroundColor: '#d6d6d6',
          width: width,
          height: 0.5,}}/>

          </View>
)
    }

    index(rowID){
     var index = parseInt(rowID) + 1;
        return index;
    }



    renderRow(rowData, sectionID, rowID) {
        itemView = () => {

            var info = '已失效'
            //状态:pre待解决、undo待确认、unsolved仍未解决、solved已解决
            var color = '#e82628'
            if(rowData.status == 'EXPIRED'){

        }



                return (

                       <View style={{height:96}}>
                        <TouchableOpacity style={styles.itemContainer} onPress={this.onItemPress.bind(this, rowData)}>

                        <Text numberOfLines={1} style={{color:'#282828',fontSize:14}}>
                         {rowData.filename}
                        </Text>



                        <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text numberOfLines={1}  style={{marginTop:10,color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                          文件编号：
                        </Text>

                        <Text numberOfLines={1}  style={{marginTop:10,color:'#777777',fontSize:12,marginBottom:2,}}>
                          {rowData.no}
                        </Text>

                        </View>




                        <View style={{flexDirection:'row',alignItems:'center'}}>



                       <View style={{flex:1,flexDirection:'row',}}>
                       <Text numberOfLines={1} style={{marginTop:5,color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                             领用人:
                       </Text>

                       <Text numberOfLines={1} style={{marginTop:5,color:'#777777',fontSize:12}}>
                        {rowData.receiver}({rowData.number}份)
                       </Text>

                       </View>

                       <Text numberOfLines={1} style={{marginTop:5,color:'#1c1c1c',fontSize:12}}>
                       状态：
                       </Text>
                       <Text numberOfLines={1} style={{marginTop:5,color:'#e82628',fontSize:12}}>
                       {info}
                       </Text>

                        </View>


                        </TouchableOpacity>
                        <View style={{backgroundColor: '#d6d6d6',
                        width: width,
                        height: 1,}}/>

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
        height:height-30,
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
            height:94,
            backgroundColor:'#ffffff',
            padding:10,
            justifyContent: 'center',

    },




    cellLine: {
        width: 2,
        height: 14,
        backgroundColor: '#cccccc',
    },

});
