/**
 * Created by Arlen_JY on 2018/5/31.
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
import ExamRecordListView from './ExamRecordListView';


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

export  default class ExamRecordView extends Component {

    constructor(props) {
        super(props)



        this.state = {
            title: this.props.title,
            detailType:"1003",
            index:0,

        }

    }

    rendTabs(){

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

            {this._renderQuetionView("培训记录","mine")}
            {this._renderQuetionView("考试成绩","all")}

        </ScrollableTabView>)

    }

    _renderQuetionView(label,problemSolveStatus){

        // this.state.problemStatus =  problemSolveStatus;

        return( <View  tabLabel={label} style={styles.container}>

            {this.renderContent()}
            {this.renderSlider()}
            {this.renderQuestionList(problemSolveStatus)}
        </View>)


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
            <View style={styles.statisticsflexContainer}>

                <View style={styles.cell}>

                    <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                        日期
                    </Text>

                </View>

                <View style={styles.cell}>

                    <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                        培训种类
                    </Text>

                </View>

                <View style={styles.cell}>

                    <Text style={{color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                        培训时长
                    </Text>

                </View>



            </View>

        )

    }

    renderSlider(){

        return (<View style={{backgroundColor:'#d6d6d6',height:0.5,width:width}}>
        </View>)

    }

    renderQuestionList(problemSolveStatus){

        var userId = '';

        if (problemSolveStatus == 'mine') {

            ref="list_Renovating";
        }else {

            ref = "list_finish";

        }

        if (Global.UserInfo.id) {
            userId = Global.UserInfo.id;
        }


        return (<ExamRecordListView
            style={{alignSelf:'stretch',flex:1}}
            type={this.props.type}
            detailType={this.state.detailType}
            userId={userId}
            probelmType={problemSolveStatus}
            navigator={this.props.navigator}
            ref={ref}
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
