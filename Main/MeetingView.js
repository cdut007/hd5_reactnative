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

import NavBar from '../common/NavBar'
import Dimensions from 'Dimensions'
import LoginView from '../Login/LoginView'
var Global = require('../common/globals');
var width = Dimensions.get('window').width;
import CommitButton from '../common/CommitButton'
import MeetingListViewContainer from '../Main/Meeting/MeetingListViewContainer';
var meetingModuleData = [
    {
        'index': 0,
        'title': '接收',
        "type": "JS",
         "tag":'meeting',
        'image': require('../images/jx_icon.png')
    },{
        'index': 1,
        'title': '发送',
        "type": "JS",
        "tag":'meeting',
        'image': require('../images/jx_icon.png')
    },{
        'index': 2,
        'title': '草稿',
        "type": "JS",
        "tag":'meeting',
        'image': require('../images/jx_icon.png')
    },]

    var noticeModuleData = [
        {
            'index': 0,
            'title': '接收',
            "type": "JS",
            "tag":'notice',
            'image': require('../images/jx_icon.png')
        },{
            'index': 1,
            'title': '发送',
            "type": "JS",
            "tag":'notice',
            'image': require('../images/jx_icon.png')
        },{
            'index': 2,
            'title': '草稿',
            "type": "JS",
            "tag":'notice',
            'image': require('../images/jx_icon.png')
        },]


export default class MeetingView extends Component {
    constructor(props) {
        super(props)

    }


    back() {
        this.props.navigator.pop()
    }




    createMeeting(type){

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

  renderItems(moduleData){
      var displayArr = []
      for (var i = 0; i < moduleData.length; i++) {
          var moduleDataItem = moduleData[i]
         displayArr.push(
         <TouchableOpacity style={styles.cell} onPress={() => { this.onModuleItemClick(moduleDataItem) }}>
         <View style={[{width:width/3}, styles.cell]}>

            <Image source={moduleDataItem.image} style={{  width: 48, height: 48,marginBottom:8 }} resizeMode={Image.resizeMode.contain} />

             <Text style={{ fontSize: 12, color: "#707070" }}>{moduleDataItem.title}</Text>
         </View>
         </TouchableOpacity>)
      }

      return displayArr
  }

  renderFormView(){
      return(<View style={{height:50,width:width,flexDirection:'row'}}>
      <View style={{height:50,flex:1}}><CommitButton title={'发布通告'}
              onPress={this.createMeeting.bind(this,'meeting')} containerStyle={{backgroundColor:'#ffffff'}} titleStyle={{color: '#f77935'}}></CommitButton></View>
              <View onPress={this.createMeeting.bind(this,'notice')} style={{height:50,flex:1}}><CommitButton title={'发布会议'}
                      ></CommitButton></View>
                      </View>)
  }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                    title="会议"
                     />
                     <ScrollView
                     keyboardDismissMode='on-drag'
                     keyboardShouldPersistTaps={false}
                     style={styles.mainStyle}>
                     <View style={styles.itemContainer}>

                      <View style={styles.flexContainer}>
                      <Text style={[styles.content,{marginLeft:10}]}>
                      会议通知
                      </Text>
                      </View>

                      <View style={styles.divider}/>

                      <View style={styles.statisticsflexContainer}>
                        {this.renderItems(meetingModuleData)}
                      </View>

                      </View>

                       <View style={styles.space}/>


                       <View style={styles.itemContainer}>

                        <View style={styles.flexContainer}>
                        <Text style={[styles.content,{marginLeft:10}]}>
                         事物通告
                        </Text>
                        </View>

                        <View style={styles.divider}/>

                        <View style={styles.statisticsflexContainer}>
                          {this.renderItems(noticeModuleData)}
                        </View>

                        </View>

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
