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
} from 'react-native';
import HttpRequest from '../../HttpRequest/HttpRequest'
import Dimensions from 'Dimensions';
import NavBar from '../../common/NavBar'
import LoadMoreFooter from '../../common/LoadMoreFooter.js'
import CircleLabelHeadView from '../../common/CircleLabelHeadView';
import px2dp from '../../common/util'
import SearchBar from '../../common/SearchBar';
import dateformat from 'dateformat'
import QC2WitnessStatisticsView from './QC2WitnessStatisticsView.js'

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
import Global from '../../common/globals.js'
import   ScrollableTabView  from 'react-native-scrollable-tab-view';



var LOADING = {};

var qc2Datas = [

    {
        index:0,
        status:'CZEC_QC',
        data:[],
        pageNo:1,
    },
    {
        index:1,
        status:'CZEC_QA',
        data:[],
        pageNo:1,
    },
    {
                index:2,
                status:'PAEC',
                data:[],
                pageNo:1,
            }


];

export default class QC2WitnessContainer extends Component {
    constructor(props) {
        super(props)

        this.state = {

            keyword:'',
        }

    }


        back() {
            this.props.navigator.pop()
        }




    componentDidMount() {


    }



    rendTabs(){
        return( <ScrollableTabView
            tabBarUnderlineStyle={{backgroundColor: '#f77935'}}
               tabBarBackgroundColor='#FFFFFF'
               tabBarActiveTextColor='#f77935'
               tabBarInactiveTextColor='#777777'
    >
         {this.renderListView('CZEC QC',0,qc2Datas[0].status)}
         {this.renderListView('CZEC QA',1,qc2Datas[1].status)}
         {this.renderListView('PAEC',2,qc2Datas[2].status)}

    </ScrollableTabView>
        )

    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                title={'施工见证'}
                leftIcon={require('../../images/back.png')}
                searchMode={true}
                onSearchChanged={(text) => this.onSearchChanged(text)}
                onSearchClose = {this.onSearchClose.bind(this)}
                leftPress={this.back.bind(this)} />
                {this.rendTabs()}
            </View>
        )
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


    renderListView(label,index,status) {
        var userId = '';


        return (
            <View  tabLabel={label} style={{marginTop:10,}}>

            <QC2WitnessStatisticsView
            style={{height:200}}
             type={this.props.type}
             label = {label}
             memberType={status}
             userId={userId}
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
