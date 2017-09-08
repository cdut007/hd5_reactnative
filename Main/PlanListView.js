import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    ListView,
    ScrollView,
    ActivityIndicator,
    TouchableNativeFeedback,
    TouchableHighlight,
} from 'react-native';
import HttpRequest from '../HttpRequest/HttpRequest'
import Dimensions from 'Dimensions';
import NavBar from '../common/NavBar'
import CircleLabelHeadView from '../common/CircleLabelHeadView';
import px2dp from '../common/util'
import SearchBar from '../common/SearchBar';
import dateformat from 'dateformat'
import SingleWorkRollDetailView from './SingleWorkRollDetailView';

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var pagesize = 10;

import   ScrollableTabView  from 'react-native-scrollable-tab-view';


var resultsCache = {
  dataForQuery: {},
  nextPageNumberForQuery: {},
  totalForQuery: {},
};
var LOADING = {};



export default class PlanListView extends Component {
    constructor(props) {
        super(props)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

       LOADING = {};
        this.state = {
            dataSource: ds,
            isLoading: false,
            isLoadingTail: false,
            filter: '',
            title: this.props.data.class + "任务",
        }


    }


        back() {
            this.props.navigator.pop()
        }

    search() {

    }

    callback(key) {
          console.log('onChange', key);
        }

    handleTabClick(key) {
          console.log('onTabClick', key);
        }

    componentDidMount() {

        //this.executePlanRequest();
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(
                [{date:'2017/8/13',task_no:'2CAM0038-2121.4','classify':'A1','task_tyle':'预制','task_item_no':'TM01-2017-08-002'},
                {date:'2017/8/13',task_no:'2CAM0038-2121.4','classify':'A1','task_tyle':'预制','task_item_no':'TM01-2017-08-002'},
                {date:'2017/8/13',task_no:'2CAM0038-2121.4','classify':'A1','task_tyle':'预制','task_item_no':'TM01-2017-08-002'},
                {date:'2017/8/13',task_no:'2CAM0038-2121.4','classify':'A1','task_tyle':'预制','task_item_no':'TM01-2017-08-002'},
                {date:'2017/8/13',task_no:'2CAM0038-2121.4','classify':'A1','task_tyle':'预制','task_item_no':'TM01-2017-08-002'},
                {date:'2017/8/13',task_no:'2CAM0038-2121.4','classify':'A1','task_tyle':'预制','task_item_no':'TM01-2017-08-002'},
                {date:'2017/8/13',task_no:'2CAM0038-2121.4','classify':'A1','task_tyle':'预制','task_item_no':'TM01-2017-08-002'},
                {date:'2017/8/13',task_no:'2CAM0038-2121.4','classify':'A1','task_tyle':'预制','task_item_no':'TM01-2017-08-002'},
                {date:'2017/8/13',task_no:'2CAM0038-2121.4','classify':'A1','task_tyle':'预制','task_item_no':'TM01-2017-08-002'},
                {date:'2017/8/13',task_no:'2CAM0038-2121.4','classify':'A1','task_tyle':'预制','task_item_no':'TM01-2017-08-002'},
                {date:'2017/8/13',task_no:'2CAM0038-2121.4','classify':'A1','task_tyle':'预制','task_item_no':'TM01-2017-08-002'},
            ]),
            isLoading: false,
        });
    }

    onGetDataSuccess(response){
         console.log('onGetDataSuccess@@@@')
     var query = this.state.filter;
     if (!query) {
         query = '';
     }

        var datas = response.responseResult.datas;



        if (this.state.filter !== query) {
           // do not update state if the query is stale
           console.log('executePlanRequest:pagesize this.state.filter !== query'+this.state.filter+";query="+query)
           return;
         }

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(datas),
            isLoading: false,
        });

    }

    onItemPress(itemData){
        this.props.navigator.push({
            component: SingleWorkRollDetailView,
             props: {
                 data:itemData,
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
                     }

            HttpRequest.get('/rollingplan', paramBody, this.onGetDataSuccess.bind(this),
                (e) => {


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

    rendTabs(){
        return( <ScrollableTabView
            tabBarUnderlineStyle={{backgroundColor: '#0755a6'}}
               tabBarBackgroundColor='#FFFFFF'
               tabBarActiveTextColor='#0755a6'
               tabBarInactiveTextColor='#777777'
               locked={true}
    >
         {this.renderListView('未施工')}
         {this.renderListView('施工中')}
         {this.renderListView('停滞中')}
         {this.renderListView('已完成')}
    </ScrollableTabView>

        )
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                title={this.state.title}
                leftIcon={require('../images/back.png')}
                leftPress={this.back.bind(this)} />
                {this.rendTabs()}
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

                          <Text style={{color:'#707070',fontSize:12,marginBottom:2,}}>
                            {rowData.date}
                          </Text>

                        </View>


                        <View style={styles.cell}>

                        <Text numberOfLines={1} style={{color:'#707070',fontSize:8,marginBottom:2,}}>
                              {rowData.task_no}
                        </Text>

                        </View>

                        <View style={styles.cell}>

                        <Text style={{color:'#707070',fontSize:12,marginBottom:2,}}>
                           {rowData.classify}
                        </Text>

                        </View>

                        <View style={styles.cell}>

                        <Text style={{color:'#707070',fontSize:12,marginBottom:2,}}>
                           {rowData.task_tyle}
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
    renderListView(label) {
        return (
            <View  tabLabel={label} style={{marginTop:10,}}>

            <View style={{backgroundColor:'#d6d6d6',height:0.5,width:width}}>
            </View>
            
            <ScrollView   horizontal={true}
                            showsHorizontalScrollIndicator={false}  // 隐藏水平指示器
                              showsVerticalScrollIndicator={false}    // 隐藏垂直指示器
            >

            <View style={styles.statisticsflexContainer}>

            <View style={styles.cell}>

              <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                施工日期
              </Text>

            </View>


            <View style={styles.cell}>

            <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
              工程量编号
            </Text>

            </View>

            <View style={styles.cell}>

            <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
              支架/焊口
            </Text>

            </View>

            <View style={styles.cell}>

            <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
              工程量类别
            </Text>

            </View>

            <View style={styles.cell}>

            <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
              作业条目编号
            </Text>

            </View>


            </View>

            </ScrollView>
            <View style={{backgroundColor:'#d6d6d6',height:0.5,width:width}}>
            </View>

            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                renderFooter={this.renderFooter.bind(this)}
                onEndReached={this.onEndReached.bind(this)}

            />
            </View>
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
