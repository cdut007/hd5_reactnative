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
    DeviceEventEmitter,
} from 'react-native';
import HttpRequest from '../../HttpRequest/HttpRequest'
import Dimensions from 'Dimensions';
import NavBar from '../../common/NavBar'
import CircleLabelHeadView from '../../common/CircleLabelHeadView';
import px2dp from '../../common/util'
import SearchBar from '../../common/SearchBar';
import dateformat from 'dateformat'
import Global from '../../common/globals.js'


import QCMyWitnessContainer from './QCMyWitnessContainer.js'

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var pagesize = 10;

var resultsCache = {
  dataForQuery: {},
  nextPageNumberForQuery: {},
  totalForQuery: {},
};
var LOADING = {};

export default class QCWitnessStatisticsView extends Component {
    constructor(props) {
        super(props)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

       LOADING = {};
        this.state = {
            dataSource: ds,
            isLoading: false,
            isLoadingTail: false,
            filter: '',
            keyword:'',
            title: this.props.data.user.dept.name + "见证",
        }


    }


        back() {
            this.props.navigator.pop()
        }

    search() {

    }

    componentDidMount() {
        QcissueDeals = DeviceEventEmitter.addListener('witness_update',(param) => {    this.executeWitnessRequest();})
        delivery_qc = DeviceEventEmitter.addListener('delivery_qc',(param) => {    this.executeWitnessRequest();})

        this.executeWitnessRequest();

    }

    componentWillUnmount(){
        delivery_qc.remove();
       QcissueDeals.remove();
  }

    onGetDataSuccess(response){
         Global.log('onGetDataSuccess@@@@')
     var query = this.state.filter;
     if (!query) {
         query = '';
     }


        var witmess_team = response.responseResult.witness_team;

        if (witmess_team) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(witmess_team),
                isLoading: false,
            });
        }

    }

    onItemPress(itemData){
        this.props.navigator.push({
            component: QCMyWitnessContainer,
             props: {
                 data:itemData,
                 type:this.props.type,
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
        //    this.timeoutID = this.setTimeout(() => this.executeWitnessRequest(pagesize,1,filter), 100);
        }

         renderFooter() {
           if (!this.hasMore() || !this.state.isLoadingTail) {
             return <View style={styles.scrollSpinner} />;
           }

           return <ActivityIndicator style={styles.scrollSpinner} />;
         }


    executeWitnessRequest(){

      Global.log('executeWitnessRequest:')

                 this.setState({
                   isLoading: true,
                   isLoadingTail: false,
                 });


                 var paramBody = {
                      userId:this.props.data.user.id,
                      type:this.props.type
                     }

            HttpRequest.get('/statistics/witness', paramBody, this.onGetDataSuccess.bind(this),
                (e) => {


                    this.setState({
                      dataSource: this.state.dataSource.cloneWithRows([]),
                      isLoading: false,
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
               {this.showNavView()}
               {this.renderListView()}
            </View>
        )
    }

    showNavView(){
        return(<NavBar
        title={this.state.title}
        leftIcon={require('../../images/back.png')}
        searchMode={true}
        onSearchChanged={(text) => this.onSearchChanged(text)}
        onSearchClose = {this.onSearchClose.bind(this)}
        leftPress={this.back.bind(this)} />)
    }

    onSearchChanged(text){
    Global.log('text=='+text);
    this.setState({keyword:text})
    if (this._plan_list_ref) {
        setTimeout(() => {
                this._plan_list_ref._onRefresh()
        }, 1000 * 2);
    }

    }

    onSearchClose(){
        if (this.state.keyword == '') {
            return
        }
        this.setState({keyword:''})
        if (this._plan_list_ref) {
            setTimeout(() => {
                    this._plan_list_ref._onRefresh()
            }, 1000 * 2);
        }
    }

    index(rowID){
     var index = parseInt(rowID) + 1;
        return index;
    }

    renderRow(rowData, sectionID, rowID) {
        itemView = () => {
                if (!rowData.statistics) {
                    rowData.statistics = new Object()
                }
                return (
                       <View style={styles.itemContainer}>
                        <TouchableOpacity onPress={this.onItemPress.bind(this, rowData)}>
                        <View style={styles.flexContainer}>

                        <CircleLabelHeadView style={styles.head_cell}
                            contactName = {rowData.user.realname}
                        >

                        </CircleLabelHeadView>

                        <Text style={[styles.content,{marginLeft:10}]}>
                          {rowData.user.realname}
                        </Text>

                        <View style= {[styles.cellLine,{marginLeft:8,marginRight:8,marginTop:20,marginBottom:20}]}/>

                        <Text style={{color:'#888888',fontSize:14,marginLeft:4,}}>
                          {rowData.user.roles[0].name}
                        </Text>

                        </View>


                        <View style={styles.divider}/>

                        <View style={styles.statisticsflexContainer}>



                        <View style={styles.cell}>

                        <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                          已完成的见证
                        </Text>
                        <Text style={{color:'#1c1c1c',fontSize:14,}}>
                          {rowData.statistics.completed}
                        </Text>
                        </View>

                        <View style={styles.cell}>


                        <Text style={{color:'#e82628',fontSize:12,marginBottom:2,}}>
                          未完成的见证
                        </Text>
                        <Text style={{color:'#e82628',fontSize:14,}}>
                          {rowData.statistics.uncomplete}
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
