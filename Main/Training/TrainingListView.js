/**
 * Created by Arlen_JY on 2018/5/31.
 */
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
import Panel from '../../common/Panel';
import LoadMoreFooter from '../../common/LoadMoreFooter.js'
import TrainingDocumentTempleView from './TrainingDocumentTempleView'
import TrainingVideoTempleView from './TrainingVideoTempleView'
import ExamHomeView from  './ExamHomeView'
import Global from '../../common/globals'
const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;

import   ScrollableTabView  from 'react-native-scrollable-tab-view';
var timer;


var LOADING = {};

var statusDatas = [{
    index:0,
    status:'UNPROGRESS',
    data:[],
    pageNo:1,
},
    {
        index:1,
        status:'PROGRESSING',
        data:[],
        pageNo:1,
    },
    {
        index:2,
        status:'PAUSE',
        data:[],
        pageNo:1,
    },
    {
        index:3,
        status:'COMPLETED',
        data:[],
        pageNo:1,
    }

];

export default class PlanListViewContainer extends Component {
    constructor(props) {
        super(props)


        this.state = {

            title: "培训",
            keyword:'',
            responseData:{},
            modules:null,
            folds:[]
        }


    }


    back() {
        this.props.navigator.pop()
    }


    componentWillMount(){
        this.fetchBanner();

    }


    fetchBanner(){
        var paramBody ={type:this.props.type }
        HttpRequest.testGet('/learning/section/'+this.props.type, paramBody, this.onFetchTrainDataSuccess.bind(this),
            (e) => {

                try {
                    var errorInfo = JSON.parse(e);
                    Global.log(errorInfo.description)
                    if (errorInfo != null && errorInfo.description) {
                        Global.log(errorInfo.description)
                    } else {
                        Global.log(e)
                    }
                }
                catch(err)
                {
                    Global.log(err)
                }

                Global.alert(' error:' + e)
            })
    }

    componentDidMount() {


    }


    onFetchTrainDataSuccess(response){
        Global.alert('onFetchTrainDataSuccess:'+JSON.stringify(response));
        this.state.responseData = response.responseResult;
        this.state.modules = response.responseResult.modules;
        this.state.folds = response.responseResult.folds;
        this.setState({...this.state});

    }
    rendTabs(){
        if (this.state.modules == null){
            return(
                    <ScrollView style={{flex:1, backgroundColor:'#fff', flexDirection:'column',marginTop:10}}>


                        {this.renderScrollListView(this.state.folds)}

                    </ScrollView>



            )
        }else {
            return( <ScrollableTabView locked={true}
                                       tabBarUnderlineStyle={{backgroundColor: '#0755a6'}}
                                       tabBarBackgroundColor='#FFFFFF'
                                       tabBarActiveTextColor='#0755a6'
                                       tabBarInactiveTextColor='#777777'
                >


                    {this.renderListView('通风',0)}
                    {this.renderListView('管道',1)}
                    {this.renderListView('机械',2)}
                    {this.renderListView('电气',3)}
                </ScrollableTabView>

            )
        }

    }
    renderListViewArr(){
        var listViewArr = [];
        // var listArrs = [{title:通风}]
    }
    renderScrollListView(foldsArr){
        var foldsNum = foldsArr.length;
        var renderPanelViewArr = [];
        for (var i = 0;i < foldsNum; i++){
            var foldItem = foldsArr[i];
            renderPanelViewArr.push(
                <View style={{}}>
                {this.renderPanelView(foldItem)}

            </View>)
        }
        return renderPanelViewArr;
    }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title={this.props.title}
                    rightPress={this.exam.bind(this)}
                    rightText={'考试'}
                    leftIcon={require('../../images/back.png')}
                    leftPress={this.back.bind(this)} />
                {this.rendTabs()}
            </View>
        )
    }
    exam(){
        // Global.alert(this.props.title+'考试');
        this.props.navigator.push({
            component:ExamHomeView,
            name:'ExamHomeView',
            props:{
                title:this.props.title
            }
        })

    }
    onPressToTrainDetail(learningItem){

        if (learningItem.type == 'IMAGE_TEXT'){
            this.props.navigator.push({
                component:TrainingDocumentTempleView,

                props:{
                    session_id:learningItem.id
                }
            })
        }else if(learningItem.type == 'VIDEO'){
            this.props.navigator.push({
                component:TrainingVideoTempleView,
                props:{
                    session_id:learningItem.id
                }
            })
        }else {

        }


    }
    renderPanelDetailView(learningClass){
        var learningViewArr = [];
        var learningNum = learningClass.length;
        learningClass.map((item,i) => {
            var learningClassItem = learningClass[i];
            learningViewArr.push(
                <TouchableOpacity style={{width:width,}} onPress={() => this.onPressToTrainDetail(learningClassItem)}>
                    <View style={{justifyContent: "flex-start",
                        alignItems: 'center',
                        flexDirection: 'row',}}>
                        <Image style={{marginLeft:15,width:36,height:36,marginTop:10,marginBottom:10,}}
                               source={require('../../images/default_head.png')}>

                        </Image>
                        <Text style={{marginLeft:15,color:'black'}}>{learningClassItem.title}</Text>
                    </View>
                    <View style={{height:0.5,backgroundColor:"rgb(213,213,213)",width:width}}></View>
                </TouchableOpacity>
            )
        });

        return learningViewArr;

    }
    renderPanelView(item){
        var displayPanelAry = [];
        var learnings = item.learnings;

        displayPanelAry.push(
            <View style={{}}>
                <Panel title={item.name}  >
                    {this.renderPanelDetailView(item.learnings)}

                </Panel>
                <View style={{height:0.5,backgroundColor:"rgb(213,213,213)",width:width}}></View>
            </View>
        );
        return displayPanelAry;


    }
    renderListView(label,index) {
        // var userId = '';
        // if (this.props.data.user) {
        //     userId = this.props.data.user.id
        // }
        // var plan_col_map = ConstMapValue.Plan_Col_Map(this.props.type)
        return (
            <View  tabLabel={label} style={{}}>
                {this.renderPanelView()}

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
