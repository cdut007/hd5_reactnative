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
    TextInput,
    ScrollView
} from 'react-native';

import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions'
import LoginView from '../../Login/LoginView'
var Global = require('../../common/globals');
var width = Dimensions.get('window').width;
import CommitButton from '../../common/CommitButton'

import DisplayItemView from '../../common/DisplayItemView';
import EnterItemView from '../../common/EnterItemView';




export default class CreateMeetingView extends Component {
    constructor(props) {
        super(props)

    }


    back() {
        this.props.navigator.pop()
    }




    publishMeeting(){

    }

    saveDraftMeeting(){

    }

    onModuleItemClick(itemData) {
        this.props.navigator.push({
            component: MeetingListViewContainer,
             props: {
                 data:itemData,
                 type:this.props.type,
                }
        })
    }


        renderItem() {
                   // 数组
                   var itemAry = [];
                   // 颜色数组
                   var displayAry = [];



                   // 遍历
                   for (var i = 0; i<displayAry.length; i++) {
                       if (displayAry[i].type == 'displayMore') {
                           itemAry.push(
                               <EnterItemView key={displayAry[i].id}
                                title={displayAry[i].title}
                                onPress = {this.onItemClick.bind(this,displayAry[i])}
                                flagArrow = {this.state.displayMore}
                               />
                           );
                       } else if (displayAry[i].type == 'devider') {
                           itemAry.push(
                              <View style={styles.divider}/>
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

  renderFormView(){
      return(<View style={{height:50,width:width,flexDirection:'row'}}>
      <View style={{height:50,flex:1}}><CommitButton title={'确认发布'}
              onPress={this.publishMeeting.bind(this)} containerStyle={{backgroundColor:'#ffffff'}} titleStyle={{color: '#f77935'}}></CommitButton></View>
              <View  style={{height:50,flex:1}}><CommitButton title={'保存草稿'}
              onPress={this.saveDraftMeeting.bind(this)}
                      ></CommitButton></View>
                      </View>)
  }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title="创建会议"
                    leftIcon={require('../../images/back.png')}
                    leftPress={this.back.bind(this)}
                     />
                     <ScrollView
                     keyboardDismissMode='on-drag'
                     keyboardShouldPersistTaps={false}
                     style={styles.mainStyle}>
                     {this.renderItem()}
                        </ScrollView>
                        {this.renderFormView()}
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
    itemContainer: {

    },
    flexContainer: {
           height: 64,
           width: width,
           backgroundColor: '#ffffff',
           // 容器需要添加direction才能变成让子元素flex
           flexDirection: 'row',
           alignItems: 'center',
           padding:10,
    },
    space: {
    backgroundColor: '#f2f2f2',
    width: width,
    height: 10,
},
    divider: {
    backgroundColor: '#d6d6d6',
    width: width,
    height: 0.5,
    },

    cell: {
        flex: 1,
        height: 84,
        width:width/3,
        justifyContent: "center",
        alignItems: 'center',
         flexDirection: 'column',
    },
    statisticsflexContainer: {
             height: 96,
             backgroundColor: '#ffffff',
             flexDirection: 'row',
             justifyContent: "center",
             alignItems: 'center',
         },
})
