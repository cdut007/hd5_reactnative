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
    DeviceEventEmitter,
} from 'react-native';
import HttpRequest from '../../HttpRequest/HttpRequest'
import Dimensions from 'Dimensions';
import NavBar from '../../common/NavBar'
import CircleLabelHeadView from '../../common/CircleLabelHeadView';
import px2dp from '../../common/util'
import SearchBar from '../../common/SearchBar';
import dateformat from 'dateformat'

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var pagesize = 10;

import Global from '../../common/globals.js'

var resultsCache = {
  dataForQuery: {},
  nextPageNumberForQuery: {},
  totalForQuery: {},
};
var LOADING = {};

export default class SafeWorkStatistics extends Component {
    constructor(props) {
        super(props)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

       LOADING = {};
        this.state = {
            dataSource: ds,
            isLoading: false,
            isLoadingTail: false,
            filter: '',
            title: "责任部门隐患数量统计",
        }


    }


        back() {
            this.props.navigator.pop()
        }

    search() {

    }

    componentDidMount() {

        var me = this
        AsyncStorage.getItem('k_safework_statistics_'+this.props.data.id+"_"+this.props.type,function(errs,result)
        {
            if (!errs && result && result.length)
            {
                 Global.log('read k_safework_statistics_@@@@'+result)
                var data = JSON.parse(result);
                if (data) {
                    me.setState({
                        dataSource: me.state.dataSource.cloneWithRows(data),
                        isLoading: false,
                    });
                }

            }
            else
            {

            }
        });

        this.executeSafeWorkRequest();
       
    }

        componentWillUnmount(){
        
        }

    onGetDataSuccess(response,body){
         Global.log('onGetDataSuccess@@@@')
     var query = this.state.filter;
     if (!query) {
         query = '';
     }

        var datas = response.responseResult;

            AsyncStorage.setItem('k_safework_statistics_'+body.userId+"_"+body.type, JSON.stringify(datas), (error, result) => {
                if (error) {
                    Global.log('save k_safework_statistics_ faild.')
                }

                Global.log('save k_safework_statistics_: sucess')

            });

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(datas),
                isLoading: false,
            });

        

    }

    onItemPress(itemData){
      
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
                Global.log('not has more, or load end')
                this.setState({
                  isLoadingTail: true,
                  isLoading: false,
              });
                return;
              }

              if (LOADING[query]) {
                Global.log('query already loading')
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


    executeSafeWorkRequest(){

      Global.log('executeSafeWorkRequest:')

                 this.setState({
                   isLoading: true,
                   isLoadingTail: false,
                 });


                 var paramBody = {
                      userId:this.props.data.id,
                      type:this.props.type
                     }

            HttpRequest.get('/hse/hseStatistics3MonthCaptain', paramBody, this.onGetDataSuccess.bind(this),
                (e) => {

                    //
                    // this.setState({
                    //   dataSource: this.state.dataSource.cloneWithRows([]),
                    //   isLoading: false,
                    // });
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
              title={this.state.title}
              leftIcon={require('../../images/back.png')}
              leftPress={this.back.bind(this)}/>
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

                var count = rowData.total;
            if(!count){
               count = 0;
             }

               var count1 = rowData.waitingModify;
            if(!count1){
               count1 = 0;
             }

               var count2 = rowData.delay;
            if(!count2){
               count2 = 0;
             }

                return (
                       <View style={styles.itemContainer}>
                        <TouchableOpacity onPress={this.onItemPress.bind(this, rowData)}>
                        <View style={styles.flexContainer}>

                        <CircleLabelHeadView style={styles.head_cell}
                            contactName = {rowData.deptName}
                        >

                        </CircleLabelHeadView>

                        <Text style={[styles.content,{marginLeft:10}]}>
                          {rowData.deptName}
                        </Text>


                        </View>


                        <View style={styles.divider}/>

                        <View style={styles.statisticsflexContainer}>

                        <View style={styles.cell}>

                          <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                            隐患总数
                          </Text>
                          <Text style={{color:'#1c1c1c',fontSize:14,}}>
                            {count}
                          </Text>
                        </View>


                        <View style={styles.cell}>

                        <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                          待整改数
                        </Text>
                        <Text style={{color:'#1c1c1c',fontSize:14,}}>
                         {count1}
                        </Text>
                        </View>

                        <View style={styles.cell}>

                        <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                          延期未整改数
                        </Text>
                        <Text style={{color:'#1c1c1c',fontSize:14,}}>
                           {count2}
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
