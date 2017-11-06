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
    ScrollView,
    Modal,
    ImageBackground,
} from 'react-native';


import ImageViewer from 'react-native-image-zoom-viewer';
import Dimensions from 'Dimensions';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
import HttpRequest from '../../HttpRequest/HttpRequest'
import NavBar from '../../common/NavBar'
var Global = require('../../common/globals');

import DisplayItemView from '../../common/DisplayItemView';
import DisplayMoreItemView from '../../common/DisplayMoreItemView';

export default class MeetingDetailView extends Component {
    constructor(props) {
        super(props)
        this.state = {

            modalVisible: false,
        };
    }


    back() {
        this.props.navigator.pop()
    }

  onEnterClick(){

  }

  createEnter(label,desc,tag){
      return(
          <TouchableOpacity style={styles.statisticsflexContainer} onPress={this.onEnterClick.bind(this)}>

          <View style={{flex:1,paddingLeft:10}}>


            <Text numberOfLines={1} style={{color:'#777777',fontSize:12,}}>
              {label}
            </Text>
          </View>
          <Text numberOfLines={1} style={{paddingRight:20,color:'#777777',fontSize:12,}}>
            {desc}
          </Text>

          <Image style={{alignSelf:'center',marginRight:10}} source={require('../../images/right_enter_blue.png')}></Image>

          </TouchableOpacity>
      )
  }




    render() {
        return (
            <View style={styles.container}>

                <NavBar
                    title="会议详情"
                    leftIcon={require('../../images/back.png')}
                    leftPress={this.back.bind(this)} />
                    <ScrollView
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps={false}
                    style={styles.main_container}>

                    <View style={styles.space}>
                    </View>
                    {this.createEnter('通知反馈','20','feedback')}
                    <View style={styles.space}>
                    </View>

                    {this.createEnter('会议主题','双日计划会议','subject')}
                    <View style={styles.line}>
                    </View>

                    <DisplayItemView

                     title={'会议类型'}
                     detail={'工程类型'}
                     noLine={false}
                    />
                    <DisplayItemView

                     title={'所属项目'}
                     detail={'移动app管理开发'}
                     noLine={false}
                    />
                    <DisplayItemView

                     title={'主持人'}
                     detail={'james'}
                     noLine={false}
                    />
                    <DisplayItemView

                     title={'记录员'}
                     detail={'tom'}
                     noLine={false}
                    />

                    {this.createEnter('参会人员','查看全部','member')}
                    <View style={styles.line}>
                    </View>

                     <View  style={styles.info}>
                     <View style={{flexDirection:'row',alignItems:'center'}}>
                     <Text numberOfLines={1}  style={{marginTop:10,color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                       会议开始时间：
                     </Text>

                     <Text numberOfLines={1}  style={{marginTop:10,color:'#888888',fontSize:12,marginBottom:2,}}>
                        2017/11/09 10:00
                     </Text>

                     </View>

                     <View style={{flexDirection:'row',alignItems:'center'}}>
                     <Text numberOfLines={1}  style={{marginTop:10,color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                       会议结束时间：
                     </Text>

                     <Text numberOfLines={1}  style={{marginTop:10,color:'#888888',fontSize:12,marginBottom:2,}}>
                       2017/11/09 12:00
                     </Text>

                     </View>

                     <View style={{flexDirection:'row',alignItems:'center'}}>
                     <Text numberOfLines={1}  style={{marginTop:10,color:'#1c1c1c',fontSize:12,marginBottom:2,}}>
                       会前提醒时间：
                     </Text>

                     <Text numberOfLines={1}  style={{marginTop:10,color:'#888888',fontSize:12,marginBottom:2,}}>
                       提前1小时提醒
                     </Text>

                     </View>

                     </View>

                    <DisplayItemView

                     title={'会议用品'}
                     detail={'图纸，文件'}
                     noLine={false}
                    />

                    <DisplayItemView

                     title={'会议备注'}
                     detail={'请各位领导，同事准时到场'}
                     noLine={false}
                    />


                    {this.createEnter('附件','查看全部','attach')}

                </ScrollView>
            </View>
        )
    }






}


const styles = StyleSheet.create({
    container: {
        flex:1,
        width:width,
        height:height,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    main_container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    line: {
    backgroundColor: '#f2f2f2',
    width: width,
    height: 1,
    },
    info: {
     padding:10
    },
    space: {
    backgroundColor: '#f2f2f2',
    width: width,
    height: 10,
    },
    statisticsflexContainer: {
             height: 50,
             backgroundColor: '#ffffff',
             flexDirection: 'row',
             justifyContent: "center",
             alignItems: 'center',
             paddingRight:10
         },

})
