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
} from 'react-native';
import HttpRequest from '../HttpRequest/HttpRequest'
import Dimensions from 'Dimensions';
import NavBar from '../common/NavBar'
import px2dp from '../common/util'
import SearchBar from '../common/SearchBar';
import dateformat from 'dateformat'
import SingleWorkRollDetailView from './SingleWorkRollDetailView';
import IssueDetailView from './IssueDetailView';

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var pagesize = 10;

var resultsCache = {
  dataForQuery: {},
  nextPageNumberForQuery: {},
  totalForQuery: {},
};
var LOADING = {};

export default class PlanIssueListView extends Component {
    constructor(props) {
        super(props)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        resultsCache = {
         dataForQuery: {},
         nextPageNumberForQuery: {},
         totalForQuery: {},
       };
       LOADING = {};
        this.state = {
            dataSource: ds,
            isLoading: false,
            isLoadingTail: false,
            filter: '',
            title: this.props.data.title,
        }
    }


        back() {
            this.props.navigator.pop()
        }

    search() {

    }

    componentDidMount() {
        resultsCache.nextPageNumberForQuery['']=1;
        this.executeNextPageNetWorkRequest(pagesize,1,'');
    }

    onGetDataSuccess(response){
         console.log('onGetDataSuccess@@@@')
     var query = this.state.filter;
     if (!query) {
         query = '';
     }
      if (!resultsCache.dataForQuery[query]) {
          resultsCache.dataForQuery[query] = [];
      }
     var datasForQuery = resultsCache.dataForQuery[query].slice();
        LOADING[query] = false;
        var datas = response.responseResult.datas;
        if (!datas) {
            resultsCache.totalForQuery[query] = datasForQuery.length;
         } else {

           for (var i in datas) {
             datasForQuery.push(datas[i]);
           }
           resultsCache.dataForQuery[query] = datasForQuery;
           resultsCache.nextPageNumberForQuery[query] += 1;
         }


        if (this.state.filter !== query) {
           // do not update state if the query is stale
           console.log('executeNextPageNetWorkRequest:pagesize this.state.filter !== query'+this.state.filter+";query="+query)
           return;
         }

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(resultsCache.dataForQuery[query]),
            isLoading: false,
        });

    }


    onIssueItemPress(itemData){
        var item = itemData;
        this.props.navigator.push({
            component: IssueDetailView,
             props: {
                 data:item,
                }
        })
    }


    onItemPress(itemData){
        var item = itemData;
         item.id = itemData.rollingPlanId;
        this.props.navigator.push({
            component: SingleWorkRollDetailView,
             props: {
                 data:item,
                }
        })
    }


    hasMore(){
          var query = this.state.filter;
          if (!resultsCache.dataForQuery[query]) {
            return true;
          }
          return (
            resultsCache.totalForQuery[query] !==
            resultsCache.dataForQuery[query].length
          );
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

         var page = resultsCache.nextPageNumberForQuery[query];

         this.executeNextPageNetWorkRequest(pagesize,page,query);

        }

        onSearchChange(event) {
           var filter = event.nativeEvent.text.toLowerCase();
        //    this.clearTimeout(this.timeoutID);
        //    this.timeoutID = this.setTimeout(() => this.executeNextPageNetWorkRequest(pagesize,1,filter), 100);
        }

         renderFooter() {
           if (!this.hasMore() || !this.state.isLoadingTail) {
             return <View style={styles.scrollSpinner} />;
           }

           return <ActivityIndicator style={styles.scrollSpinner} />;
         }


    executeNextPageNetWorkRequest(pagesize,pagenum,query){

      console.log('executeNextPageNetWorkRequest:pagesize = ' + pagesize+";pagenum="+pagenum+";query="+query)
            this.setState({filter: query});


            var cachedResultsForQuery = resultsCache.dataForQuery[query];
                 if (cachedResultsForQuery) {
                   if (!LOADING[query]) {
                     this.setState({
                       dataSource: this.state.dataSource.cloneWithRows(cachedResultsForQuery),
                       isLoading: false
                     });
                   } else {
                     this.setState({isLoading: true});
                   }
                   return;
                 }

                 LOADING[query] = true;
                 resultsCache.dataForQuery[query] = null;
                 this.setState({
                   isLoading: true,
                   isLoadingTail: false,
                 });


                 var paramBody = {
                         'rollingPlanId':this.props.data.id,
                         'pagesize':pagesize,
                         'pagenum':pagenum
                     }

            HttpRequest.get('/hdxt/api/problem/rollingplan', paramBody, this.onGetDataSuccess.bind(this),
                (e) => {
                    LOADING[query] = false;
                    resultsCache.dataForQuery[query] = undefined;

                    this.setState({
                      dataSource: this.state.dataSource.cloneWithRows([]),
                      isLoading: false,
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
                <NavBar
                title= '问题详情列表'
                leftIcon={require('../images/back.png')}
                leftPress={this.back.bind(this)} />
                {this.renderTopView()}
               {this.renderListView()}
            </View>
        )
    }

    index(rowID){
     var index = parseInt(rowID) + 1;
        return index;
    }

    renderIssueStatus(itemData){
        if (itemData.isOk == 0) {
            return(<TouchableOpacity onPress={this.onIssueItemPress.bind(this, itemData)}>
            <Text style={styles.content_red}>
               未解决
             </Text>
             </TouchableOpacity>
         );
        }else{
            return(
                <TouchableOpacity onPress={this.onIssueItemPress.bind(this, itemData)}>
                <Text style={styles.content_green}>
                  解决
                </Text>
                 </TouchableOpacity>
             );
        }
    }

    renderRow(rowData, sectionID, rowID) {
        menuView = () => {

                return (
                       <View style={styles.itemContainer}>
                        <TouchableOpacity onPress={this.onItemPress.bind(this, rowData)}>
                        <View>
                        <View style={styles.flexContainer}>
                        <View style={styles.cell}>

                          <Text style={styles.content}>
                            {this.index(rowID)}
                          </Text>
                        </View>

                        <View style={styles.cellLine}/>
                        <View style={styles.cell2}>
                          <Text style={styles.content}>
                            {rowData.weldno}
                          </Text>
                        </View>

                        <View style={styles.cellLine}/>
                        <View style={styles.cell3}>
                         {this.renderIssueStatus(rowData)}
                        </View>

                        <View style={styles.cellLine}/>
                        <View style={styles.cell4}>
                          <Text style={styles.content}>
                            {rowData.currentsolver}
                          </Text>
                        </View>

                        </View>

                        <View style={styles.divider}/>
                         <View style={styles.topicContainer}>
                         <Text style={styles.topic}>
                         主题:{rowData.questionname}
                         </Text>
                         </View>
                        </View>

                        </TouchableOpacity>
                            <View style={styles.divider}/>
                        </View>

                )

        }
        return (
            <View style={styles.itemView}>
                {menuView()}
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

    renderTopView() {
        return (
                <View style={styles.titleflexContainer}>
            <View style={styles.cell}>

              <Text style={styles.label}>
                序号
              </Text>
            </View>
            <View style={styles.cell2}>

              <Text style={styles.label}>
                焊口/支架
              </Text>
            </View>

            <View style={styles.cell3}>

              <Text style={styles.label}>
                状态
              </Text>
            </View>

            <View style={styles.cell4}>

              <Text style={styles.label}>
                指派给
              </Text>
            </View>

            </View>
        )
    }


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
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
    backgroundColor: '#8E8E8E',
    width: width,
    height: 0.5,
    },
    label:{
            color: '#ffffff',
            fontSize:16,
    },
    content_red:{
            color: '#ff0000',
            fontSize:16,
    },
    content_green:{
            color: '#00ff00',
            fontSize:16,
    },
    content:{
            color: '#000000',
            fontSize:16,
    },
    topicContainer:{
            flex: 1,
            fontSize:16,
            height:50,
            justifyContent: "center",

            padding:8,
            backgroundColor:'#ffffff'
    },

    topic:{
            color: '#000000',
            fontSize:16,
    },
    scrollSpinner: {
       marginVertical: 20,
     },
    flexContainer: {
           height: 50,
           width: width,
           backgroundColor: '#ffffff',
           // 容器需要添加direction才能变成让子元素flex
           flexDirection: 'row',
    },
    itemContainer: {
            flex:1,
            flexDirection:'column'
    },
     titleflexContainer: {
              height: 50,
               backgroundColor: '#00a629',
              flexDirection: 'row',
          },

    cell: {
        flex: 1,
        height: 50,
        justifyContent: "center",
        alignItems: 'center',
    },
    cell2: {
        flex: 2,
        height: 50,
        justifyContent: "center",
        alignItems: 'center',
    },
    cell3: {
        flex: 2,
        height: 50,
        justifyContent: "center",
        alignItems: 'center',
    },
    cell4: {
        flex: 3,
        height: 50,
        justifyContent: "center",
        alignItems: 'center',
    },
    cellLine: {
        width: 1,
        height: 50,
        backgroundColor: '#cccccc',
    },

});
