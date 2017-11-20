import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    ScrollView,
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
import CircleLabelHeadView from '../../common/CircleLabelHeadView';
import px2dp from '../../common/util'
import SearchBar from '../../common/SearchBar';
import dateformat from 'dateformat'
import QCWitnessListView from './QCWitnessListView.js';
import ConstMapValue from '../../common/ConstMapValue.js';

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
import Global from '../../common/globals.js'



var LOADING = {};


export default class QCWitnessListViewContainer extends Component {
    constructor(props) {
        super(props)


        this.state = {

            title: "待见证",
            keyword:'',
            statistics:{},
            update:false,
        }


    }


        back() {
            this.props.navigator.pop()
        }



        componentDidMount() {

            witness_update = DeviceEventEmitter.addListener('witness_update',(param) => {
                this.state.update = true
                this.setState({...this.state})

            })

        }

        componentWillUnmount(){
           witness_update.remove();
      }

    onGetDataSuccess(response,paramBody){
         Global.log('statistics onGetDataSuccess@@@@')
     var query = this.state.filter;
     if (!query) {
         query = '';
     }

        var statistics = response.responseResult.statistics;
        if (!statistics) {
            statistics = {}

        }
        this.state.update = false
        this.state.statistics.total = statistics.total
        this.setState({statistics:statistics})
    }

    executeStatisticsRequest(status){

      Global.log('executeStatisticsRequest')


                 var userId = ''
                 if (this.props.data && this.props.data.user) {
                     userId = this.props.data.user.id
                 }

                 var paramBody = {
                      pagesize:10,
                      pagenum:1,
                      type:this.props.type,
                      status:status,
                      userId:userId,
                     }

            HttpRequest.get('/witness', paramBody, this.onGetDataSuccess.bind(this),
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
                title={this.state.title}
                leftIcon={require('../../images/back.png')}
                searchMode={true}
                onSearchChanged={(text) => this.onSearchChanged(text)}
                onSearchClose = {this.onSearchClose.bind(this)}
                leftPress={this.back.bind(this)} />
                {this.renderWorkStepWitnessStatisticsItem()}
                {this.renderListView()}
            </View>
        )
    }

    renderWorkStepWitnessStatisticsItem(){

        if (typeof(this.state.statistics.total) == "undefined"|| this.state.update) {

            this.executeStatisticsRequest('UNCOMPLETED');
        }
                return(<View>
                    <Text style={{color:'#1c1c1c',fontSize:16,marginBottom:10,marginLeft:10}}>
                      今日见证点总数 ({this.state.statistics.total})
                    </Text>

                    <View style={[{alignItems:'center',},styles.statisticsflexContainer]}>

                    <View style={styles.cell}>

                      <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:2,}}>
                        W点 ({this.state.statistics.pointW})
                      </Text>

                    </View>


                    <View style={styles.cell}>

                    <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:2,}}>
                     R点 ({this.state.statistics.pointR})
                    </Text>

                    </View>

                    <View style={styles.cell}>

                    <Text style={{color:'#1c1c1c',fontSize:14,marginBottom:2,}}>
                    H点 ({this.state.statistics.pointH})
                    </Text>

                    </View>


                    </View>


                    <View style={{backgroundColor:'#d6d6d6',height:1,width:width}}>
                    </View>

                    </View>)

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


    renderListView() {
        var qc_witness_col_map = ConstMapValue.QC_Witness_Col_Map(this.props.type)
        return (
            <View style={{marginTop:10,}}>

            <View style={{backgroundColor:'#d6d6d6',height:0.5,width:width}}>
            </View>

            <View style={[{alignItems:'center',},styles.statisticsflexContainer]}>

            <View style={styles.cell}>

              <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
                {qc_witness_col_map.col1}
              </Text>

            </View>


            <View style={styles.cell}>

            <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
             {qc_witness_col_map.col2}
            </Text>

            </View>

            <View style={styles.cell}>

            <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
            {qc_witness_col_map.col3}
            </Text>

            </View>

            <View style={styles.cell}>

            <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
             {qc_witness_col_map.col4}
            </Text>

            </View>

            <View style={styles.cell}>

            <Text style={{color:'#1c1c1c',fontSize:10,marginBottom:2,}}>
             {qc_witness_col_map.col5}
            </Text>

            </View>



            </View>


            <View style={{backgroundColor:'#d6d6d6',height:0.5,width:width}}>
            </View>

            <QCWitnessListView
            style={{alignSelf:'stretch',flex:1}}
             type={this.props.type}
             status={'UNCOMPLETED'}
             navigator={this.props.navigator}
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
