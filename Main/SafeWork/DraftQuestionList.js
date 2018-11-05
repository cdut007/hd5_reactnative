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
     AsyncStorage,
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
import ProblemReport from '../SafeWork/ProblemReport'
import LoadEmptyView from '../../common/LoadEmptyView'


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



export default class DraftQuestionList extends Component {
    constructor(props) {
        super(props)

        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

       LOADING = {};

        this.state = {
            dataSource: ds,
            isLoading: false,
            filter: '',
            title:'问题草稿列表',
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

            this.executeDraftRequest(1);
        }

        _loadMoreData() {



            console.log("_loadMoreData() --> ");
             pageNo = parseInt(this.state.items.length / pagesize) + 1;
            this.executeDraftRequest(pageNo);
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
      this.executeDraftRequest(1);
    });


    }

    componentWillUnmount(){
       this.SafeWorkDeal.remove();
  }

    

    onItemPress(itemData){


      this.props.navigator.push({
          component: ProblemReport,
          props:{
            draft:itemData,
          }
      })

    }


    hasMore(){



      }


        onSearchChange(text) {

           var text = text.toLowerCase();

          this.fileterArr(text);

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


 createTime(x,y){
        return y.createDate-x.createDate
    }


    executeDraftRequest(index){

      var me = this;
      console.log('executeDraftRequest pageNo:'+index)
      AsyncStorage.getItem('k_safework_draft_'+this.props.data.id+"_"+this.props.type,function(errs,result)
        {
            if (!errs && result && result.length)
            {
                 Global.log('read k_safework_draft_@@@@'+result)
                var data = JSON.parse(result);
                me.state.items = data;
                if (data) {
                  data.sort(me.createTime);
                    me.setState({
                        dataSource: me.state.dataSource.cloneWithRows(data),
                        isLoading: false,
                        showLoading: false,
                        isRefreshing:false,
                        totalCount:data.length
                    });
                }else{
                     me.setState({
                        dataSource: me.state.dataSource.cloneWithRows(data),
                        isLoading: false,
                        showLoading: false,
                        isRefreshing:false,
                        totalCount:0
                    });
                }

            }
            else
            {

            }
        });




    }



    render() {
        return (
            <View style={styles.container}>
             <NavBar
              title={this.state.title}
              leftIcon={require('../../images/back.png')}
              leftPress={this.back.bind(this)}/>
               {this.renderContent()}
            {this.renderListView()}
            <LoadingView showLoading={ this.state.isLoading } closeLoading={ this._closeLoading.bind(this)}></LoadingView>
            </View>
        )
    }


    renderContent(){

     return(
       <View>
       <View style={styles.statisticsTitleflexContainer}>

       <View style={styles.cell}>
        <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
           提出时间
         </Text>
       </View>

       <View style={styles.cell}>
       <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
         问题名称
       </Text>
       </View>

       <View style={styles.cell}>
       <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
           提出人
       </Text>
       </View>

       <View style={styles.cell}>
       <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
         状态
       </Text>
       </View>

       </View>

       <View style={{backgroundColor:'d6d6d6',height:0.5,width:width}}>
       </View>

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
                            {Global.formatFullDateWithChina(rowData.createDate)}
                          </Text>

                        </View>


                        <View style={styles.cell}>

                        <Text numberOfLines={1} style={{color:textColor,fontSize:8,marginBottom:2,}}>
                              {rowData.problemTitle}
                        </Text>

                        </View>

                        <View style={styles.cell}>

                        <Text style={{color:textColor,fontSize:12,marginBottom:2,}}>
                           {Global.UserInfo.realname}
                        </Text>

                        </View>

                        <View style={styles.cell}>

                        <Text style={{color:'#ff0000',fontSize:12,marginBottom:2,}}>
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

         return '草稿'
       
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
     statisticsTitleflexContainer: {
              height: 48,
              backgroundColor: '#f0f0f0',
              flexDirection: 'row',
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
