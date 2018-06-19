/**
 * Created by Arlen_JY on 2018/6/13.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Navigator,
    BackAndroid,
    ListView,
    TouchableOpacity,

} from 'react-native';

import Dimensions from 'Dimensions'
import NavBar from '../../common/NavBar';
import QuestionStaicContainer from '../SafeWork/QuestionStaicContainer'
import Global from '../../common/globals'
import   ScrollableTabView  from 'react-native-scrollable-tab-view';
import SearchBar from '../../common/SearchBar';
import QualityCheckList from '../QualityControl/QualityCheckList'
import QuestionList from '../SafeWork/QuestionList';

var width = Dimensions.get('window').width;

var safeModule = [
    {
        'title':"待处理",
        'image': require('../../images/construction_icon.png'),
        'index': 0,
        "type":"DCL",
        "detailType":"1006",
    },
    {
        'title':"已完成",
        'image': require('../../images/construction_icon.png'),
        'index': 1,
        "type":"YWC",
        "detailType":"1007",
    },

]

export  default class ProblemAssignView extends Component {

    constructor(props) {
        super(props)



        this.state = {
            title: "问题分派",
            index : 0,
            QuetionViewStatuArr:[]

        }

    }

    rendTabs(){



        this.state.QuetionViewStatuArr = [];
        if (Global.isQCManager(Global.UserInfo)){
            this.state.QuetionViewStatuArr.push('PreQCLeaderAssign')  //待分派
            this.state.QuetionViewStatuArr.push('PreQCAssign')  //待指派

        } else if (Global.isQC1(Global.UserInfo)){
            this.state.QuetionViewStatuArr.push('PreQCAssign')   //待指派
            this.state.QuetionViewStatuArr.push('PreUpRenovete') //待整改
            this.state.QuetionViewStatuArr.push('Closed')        //已关闭
        }else if (!Global.isQC1(Global.UserInfo)  && !Global.isQCManager(Global.UserInfo)) {
            this.state.QuetionViewStatuArr.push('PreUpRenovete') //待整改
            this.state.QuetionViewStatuArr.push('PreRenovete') //整改中

        }

        Global.log('QuetionViewStatuArr:'+this.state.QuetionViewStatuArr)

        return( <ScrollableTabView locked={true}
                                   tabBarUnderlineStyle={{backgroundColor: '#f77935'}}
                                   tabBarBackgroundColor='#FFFFFF'
                                   tabBarActiveTextColor='#f77935'
                                   tabBarInactiveTextColor='#777777'
                                   onChangeTab={(obj) => {
                                       this.state.index = obj.i ;
                                   }
                                   }
        >


            {this._renderQuetionView(this.state.QuetionViewStatuArr)}


        </ScrollableTabView>)

    }

    _renderQuetionView(QuetionViewStatuArr){
        var QuetionViewArr = [];
        for (var i = 0; i < QuetionViewStatuArr.length; i++){
            let label = '';
            if (i == 0){
                label = '待处理';
            }else if (i == 1){
                label = '已完成';
            }else {
                label = '已关闭';
            }
            let problemSolveStatus = QuetionViewStatuArr[i];
            QuetionViewArr.push( <View  tabLabel={label} style={styles.container}>

                {this.renderContent()}
                {this.renderSlider()}
                {this.renderQuestionList(i,problemSolveStatus)}
            </View>)
        }
        return QuetionViewArr;



    }

    renderSearchBar(){

        return(
            <SearchBar
                isLoading={false}
                searchBarInput={styles.searchBarInput}
                searchBar={styles.SearchBarStyle}
                placeholderTextColor="#F77935"
                onSearchChange={(event) =>
                    this.refs.myQuestionlist.onSearchChange(event)}
            />


        )

    }

    renderContent(){

        return(
            <View>
                <View style={styles.statisticsflexContainer}>

                    <View style={styles.cell}>
                        <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                            发起人
                        </Text>
                    </View>

                    <View style={styles.cell}>
                        <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                            问题分类
                        </Text>
                    </View>


                    <View style={styles.cell}>
                        <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                            机组/子项
                        </Text>
                    </View>

                    <View style={styles.cell}>
                        <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                            区域
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

    renderSlider(){

        return (<View style={{backgroundColor:'#d6d6d6',height:0.5,width:width}}>
        </View>)

    }

    renderQuestionList(index,problemSolveStatus){



        var userId = '';



        if (Global.UserInfo.id) {
            userId = Global.UserInfo.id;
        }
        var typeIndex = '';
        if (index == 0){
            typeIndex = '8001'; //待处理
        }else if (index == 1){
            typeIndex = '8002';  // 已完成
        }else {
            typeIndex = '8003';  //已关闭
        }

        return (<QualityCheckList
            style={{alignSelf:'stretch',flex:1}}
            detailType={typeIndex}
            navigator={this.props.navigator}
            status = {problemSolveStatus}

        />)


    }


    back() {
        this.props.navigator.pop()
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
                    leftPress={this.back.bind(this)}/>
                {this.rendTabs()}
            </View>
        )

    }

    onSearchChanged(text){

// alert(this.state.index);

        if (this.state.index == 0){

            if (this.refs.list_Renovating) {
                this.refs.list_Renovating.onSearchChange(text);
            }
        }else {
            if (this.refs.list_finish) {
                this.refs.list_finish.onSearchChange(text);
            }
        }

// this.refs.current_ref.onSearchChange(text);
//    console.log(this.state.problemStatus);

    }

    onSearchClose(){

        if (this.state.index == 0){

            if (this.refs.list_Renovating) {
                this.refs.list_Renovating.onSearchChange('');
            }
        }else {
            if (this.refs.list_finish) {
                this.refs.list_finish.onSearchChange('');
            }
        }

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    cell: {
        flex: 1,
        height: 57.5,
        width:width/4,
        justifyContent: "center",
        alignItems: 'center',
        flexDirection: 'column',
    },
    statisticsflexContainer: {
        height: 57.5,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        marginTop:10,
    },
    SearchBarStyle : {
        backgroundColor: 'rgba(244, 244, 244, 1)',
        width:width,
        height:56,
    },
    searchBarInput:{
        borderColor:"#F77935",
        borderWidth:1,
        borderRadius:4,
        height:36,
        margin:10,
        textAlign:'center',
        backgroundColor:'white',
    }
})
