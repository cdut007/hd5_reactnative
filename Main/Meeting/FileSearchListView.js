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
import NoticeExpiredDetailView from './FileSearchDetailView';
import CardView from 'react-native-cardview'
import CommitButton from '../../common/CommitButton'

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
var pagesize = 10;
var pageNo = 1;

var timer;
var resultsCache = {
  dataForQuery: {},
  nextPageNumberForQuery: {},
  totalForQuery: {},
};
var LOADING = {};
import Global from '../../common/globals.js'


export default class FileSearchListView extends Component {
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
            keyword:'',
            keyword0:'',
            keyword1:'',
            keyword2:''

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

            this.executeFileSearchRequest(1);
        }

        _loadMoreData() {
            Global.log("_loadMoreData() --> ");
             pageNo += 1;
            this.executeFileSearchRequest(pageNo);
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

        this.executeFileSearchRequest(1);
    }

    componentWillUnmount(){
    }

    onGetDataSuccess(response,paramBody){
         Global.log('onGetDataSuccess@@@@')
     var query = this.state.filter;
     if (!query) {
         query = '';
     }

        var datas = response.responseResult.datas;



        if (this.state.filter !== query) {
            this.setState({
                isRefreshing:false,
            });
           // do not update state if the query is stale
           Global.log('executeFileSearchRequest:pagesize this.state.filter !== query'+this.state.filter+";query="+query)
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
        // this.props.navigator.push({
        //     component: NoticeExpiredDetailView,
        //      props: {
        //          data:itemData,
        //         }
        // })

    }


    hasMore(){


      }


        onSearchChange(event) {
           var filter = event.nativeEvent.text.toLowerCase();
        //    this.clearTimeout(this.timeoutID);
        //    this.timeoutID = this.setTimeout(() => this.executeFileSearchRequest(pagesize,1,filter), 100);
        }




    executeFileSearchRequest(index){

      Global.log('executeFileSearchRequest pageNo:'+index)
      var loading = false;

      if (this.state.items.length == 0) {
              loading = true
      }


       this.setState({
         isLoading: loading,
       });

      if(this.state.keyword){
        this.state.keyword0 = this.state.keyword;
      }


                 var paramBody = {
                      pagesize:pagesize,
                      pagenum:index,
                      fileCode:this.state.keyword0,
                      cnTitle:this.state.keyword1,
                      remark:this.state.keyword2
                     }


            HttpRequest.get('/getChange/getChangeList', paramBody, this.onGetDataSuccess.bind(this),
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
            <NavBar
            title={'文档变更查询'}
              searchMode={true}
              onSearchChanged={(text) => this.onSearchChanged(text)}
              onSearchClose = {this.onSearchClose.bind(this)}
            leftIcon={require('../../images/back.png')}
            leftPress={this.back.bind(this)} />
               <View style={ {alignSelf:'stretch',height:40,width:width,flexDirection: 'row',
        justifyContent: 'space-between'}}>
             <SearchBar
                style={ {alignSelf:'stretch',height:40,width:width}}
                isLoading={false}
                placeholder={'搜索文件编码'}
                onSearchChange={(text) => this.onSearchChanged0(text)}
                />
                </View>

                 <View style={[{backgroundColor:"#d6d6d6",height:0.5,alignSelf:'stretch',width:width,flexDirection: 'row',
        justifyContent: 'space-between'}]}>
                </View>

                    <View style={ {alignSelf:'stretch',height:40,width:width,flexDirection: 'row',
        justifyContent: 'space-between'}}>
             <SearchBar
                style={ {alignSelf:'stretch',height:40,width:width}}
                isLoading={false}
                placeholder={'搜索中文标题'}
                onSearchChange={(text) => this.onSearchChanged1(text)}
                />
                </View>
  <View style={[{backgroundColor:"#d6d6d6",height:0.5,alignSelf:'stretch',width:width,flexDirection: 'row',
        justifyContent: 'space-between'}]}>
                </View>
                    <View style={ {alignSelf:'stretch',height:40,width:width,flexDirection: 'row',
        justifyContent: 'space-between'}}>
             <SearchBar
                style={ {alignSelf:'stretch',height:40,width:width}}
                isLoading={false}
                placeholder={'搜索备注'}
                onSearchChange={(text) => this.onSearchChanged2(text)}
                />
                </View>
               
                <View style={{height:48,width:width}}><CommitButton title={'搜索'}
                        onPress={this.startSearch.bind(this)}></CommitButton></View>
            {this.renderListView()}
            </View>
        )
    }



  onSearchChanged0(text){
   this.state.keyword0 = text;

  }


  onSearchChanged1(text){
   this.state.keyword1 = text;

  }


  onSearchChanged2(text){
   this.state.keyword2 = text;

  }

  startSearch(){
 this._onRefresh();
   
 }


  onSearchChanged(text){

// alert(this.state.index);

 if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
          this.state.keyword = text;
        this._onRefresh();
        }, 1000);




  }

  onSearchClose(){

     if (timer) {
            clearTimeout(timer);
        }
       
        
            timer = setTimeout(() => {
              this.state.keyword='';
               this._onRefresh();
            }, 1000);
        

   

  }

    index(rowID){
     var index = parseInt(rowID) + 1;
        return index;
    }



    renderRow(rowData, sectionID, rowID) {
        itemView = () => {
  // "docType": "正式工程图纸",
  //       "fileType": "安装文件",
  //       "version": "A",
  //       "innerFileCode": "07123B54BZS08-889",
  //       "fileCode": "KK3B5416889B40743SD",
  //       "cnTitle": "支吊架组装图",
  //       "projCode": "K2K3",
  //       "compCode": "050812"
//   —核电项目管理——文档管理——文件信息查询——图纸变更——“文件编码”字段。                        
// 查询出“类型”、“版本”、“内部文件编号”、“文件编码”、“中文标题”五个字段   



                return (


                       <View style={styles.itemContainer}>
                        <TouchableOpacity style={{flex:1,flexDirection:'row',alignItems:'center'}} onPress={this.onItemPress.bind(this, rowData)}>


                        <View style={{justifyContent:'center',alignSelf:'center'}}>



                       <View style={{flex:1,flexDirection:'row'}}>
                       <Text numberOfLines={1} style={{color:'#0755a6',fontSize:14,}}>
                             文件类型：{rowData.fileType}
                       </Text>


                       </View>

                        <Text numberOfLines={1} style={{color:'#0755a6',fontSize:14,}}>
                             文档类型：{rowData.docType}
                       </Text>

                     <Text numberOfLines={1} style={{color:'#0755a6',fontSize:14,}}>
                             版本：{rowData.version}
                       </Text>

                       <Text numberOfLines={1} style={{color:'#0755a6',fontSize:14,}}>
                             内部文件编号：{rowData.innerFileCode}
                       </Text>

                       <Text numberOfLines={1} style={{color:'#0755a6',fontSize:14,}}>
                             文件编号：{rowData.fileCode}
                       </Text>

                       <Text numberOfLines={1} style={{flex:1.4,color:'#0755a6',fontSize:14}}>
                        中文标题： {rowData.cnTitle}
                       </Text>

                        <Text numberOfLines={1} style={{flex:1.4,color:'#0755a6',fontSize:14}}>
                        状态： {rowData.status}
                       </Text>

                       <Text numberOfLines={1} style={{flex:1.4,color:'#0755a6',fontSize:14}}>
                        备注： {rowData.remark}
                       </Text>


                        </View>


                        </TouchableOpacity>
                        <View style={{backgroundColor: '#d6d6d6',
                        width: width,
                        paddingBottom:10,
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
            backgroundColor:'#ffffff',
            paddingTop:10,
            justifyContent: 'center',

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
