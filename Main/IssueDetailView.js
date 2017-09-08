import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    TouchableNativeFeedback,
    TouchableHighlight,
    Picker,
    AsyncStorage,
    ScrollView,
    TextInput
} from 'react-native';

import HttpRequest from '../HttpRequest/HttpRequest'
import NavBar from '../common/NavBar'
import EnterItemView from '../common/EnterItemView';
import DisplayItemView from '../common/DisplayItemView';
import DisplayMoreItemView from '../common/DisplayMoreItemView';
import Dimensions from 'Dimensions'
import LoginView from '../Login/LoginView'
var Global = require('../common/globals');
var width = Dimensions.get('window').width;

export default class issueDetailView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data:this.props.data,
        };
    }


    back() {
        this.props.navigator.pop()
    }


        componentDidMount() {
            this.getIssueDetail()

        }

        getIssueDetail(){
            var paramBody = {
                    id:this.state.data.id
                }
            HttpRequest.get('/hdxt/api/problem/detail', paramBody, this.onGetIssueDetailSuccess.bind(this),
                (e) => {
                    try {
                        alert(e)
                    }
                    catch (err) {
                        console.log(err)
                    }
                })
        }

        onGetIssueDetailSuccess(response) {
            console.log('onGetIssueDetailSuccess:' + JSON.stringify(response))
            var item = response.responseResult;

            this.setState({
                data: item
            })
        }


    onItemClick(menu){
     if (menu.id == 'filescan') {
            //go 2 scan image from web.
     }

    }

    renderItem() {
               // 数组
               var itemAry = [];
               // 颜色数组
               var displayAry = [{title:'主题',content:this.state.data.questionname,id:'0'},
                 {title:'问题描述',content:this.state.data.describe,id:'1',type:'displayMore'},
                 {title:'解决方案',content:this.state.data.solvemethod,id:'2',type:'displayMore'},
                 {title:'发起人',content:this.state.data.creator,id:'3'},
                 {title:'当前解决人',content:this.state.data.currentsolver,id:'4'},
                 {title:'状态',content:this.state.data.isOk == 1?'解决':'未解决' ,id:'5'},

           ];


             displayAry.push({title:'查看附件',id:'filescan',content:this.state.data.file,type:'enter'},);




               // 遍历
               for (var i = 0; i<displayAry.length; i++) {
                   if (displayAry[i].type == 'enter') {
                       itemAry.push(
                           <EnterItemView key={displayAry[i].id}
                            title={displayAry[i].title}
                            onPress = {this.onItemClick.bind(this,displayAry[i])}
                           />
                       );
                   } else if (displayAry[i].type == 'devider') {
                       itemAry.push(
                          <View style={styles.divider}/>
                       );
                   } else if (displayAry[i].type == 'displayMore') {
                       itemAry.push(
                           <DisplayMoreItemView key={displayAry[i].id}
                            title={displayAry[i].title}
                            detail={displayAry[i].content}
                           />
                       );
                   }else{
                       itemAry.push(
                           <DisplayItemView key={displayAry[i].id}
                            title={displayAry[i].title}
                            detail={displayAry[i].content}
                           />
                       );
                   }

               }
               return itemAry;
           }

           renderDetailView(){
                   return(<ScrollView
                   keyboardDismissMode='on-drag'
                   keyboardShouldPersistTaps={false}
                   style={styles.mainStyle}>
                              {this.renderItem()}
                          </ScrollView>);
           }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title="问题详情"
                    leftIcon={require('../images/back.png')}
                    leftPress={this.back.bind(this)} />
                    {this.renderDetailView()}
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
    divider: {
    backgroundColor: '#8E8E8E',
    width: width,
    height: 8,
    },
    mainStyle: {
        width: width,
    },
    item: {
    width: width,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    height:50,
    justifyContent: 'center',
    alignItems: 'center',
    },

    centerLayout:{
      justifyContent:'center',
      alignItems:'center',
    },
    itemLayout:{
        backgroundColor:'#ffffff',
        justifyContent:'center',
        width:width,
        height:50,
        alignItems:'center',
    },


    defaultText:{
            color: '#000000',
            fontSize:16,
            justifyContent: "center",
            alignItems: 'center',
    },

       itemLine:{
           width: width,
           height: 1,
           backgroundColor: '#cccccc',
       },
})
