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
import QC2WitnessListDeliveryView from './QC2WitnessListDeliveryView.js'

const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
import Global from '../../common/globals.js'
import   ScrollableTabView  from 'react-native-scrollable-tab-view';



var LOADING = {};

var qc2Datas = [

    {
        index:0,
        status:'czecqc',
        data:[],
        pageNo:1,
    },
    {
        index:1,
        status:'caecqa',
        data:[],
        pageNo:1,
    },
    {
                index:2,
                status:'paec',
                data:[],
                pageNo:1,
            }


];

export default class QC2WitnessContainer extends Component {
    constructor(props) {
        super(props)



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
                leftPress={this.back.bind(this)} />
                {this.rendTabs()}
            </View>
        )
    }


    onDeliveryPress(label){
        this.props.navigator.push({
            component: QC2WitnessListDeliveryView,
             props: {
                 label:label
                }
        })
    }

    renderListView(label,index,status) {
        var userId = '';


        return (
            <View  tabLabel={label} style={{marginTop:10,}}>

            <TouchableOpacity style={styles.statisticsflexContainer} onPress={this.onDeliveryPress.bind(this,label)}>

            <View style={styles.cell}>


              <Text numberOfLines={2} style={{color:'#777777',fontSize:12,}}>
                待分派的见证（12）
              </Text>
            </View>


            <Image style={{alignSelf:'center',marginRight:10}} source={require('../../images/right_enter_blue.png')}></Image>

            </TouchableOpacity>

            <QC2WitnessStatisticsView
            style={{height:200}}
             type={this.props.type}
             status={status}
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
