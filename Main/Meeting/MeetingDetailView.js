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

  createEnter(icon,label,desc,tag){
      var textColor = '#777777'
      if (tag == 'feedback') {
          textColor = '#e82628'
      }
      return(
          <TouchableOpacity style={styles.statisticsflexContainer} onPress={this.onEnterClick.bind(this)}>

          <View style={{flex:1,paddingLeft:10,flexDirection:'row'}}>

          <Image style={{width:24,height:24,marginRight:5}} source={icon} />

            <Text numberOfLines={1} style={{color:'#444444',fontSize:14,}}>
              {label}
            </Text>
          </View>
          <Text numberOfLines={1} style={{paddingRight:10,color:textColor,fontSize:14,}}>
            {desc}
          </Text>

          <Image style={{alignSelf:'center',marginRight:10}} source={require('../../images/detailsIcon.png')}></Image>

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
                    {this.createEnter(require('../../images/informIcon.png'),'通知反馈','20','feedback')}
                    <View style={styles.space}>
                    </View>

                    {this.createEnter(require('../../images/themeIcon.png'),'会议主题','双日计划会议','subject')}
                    <View style={styles.line}>
                    </View>

                    <DisplayItemView
                     icon={require('../../images/typesIcon.png')}
                     title={'会议类型'}
                     detail={'工程类型'}
                     noLine={false}
                    />
                    <DisplayItemView

                     title={'所属项目'}
                     detail={'移动app管理开发'}
                     icon={require('../../images/projectIcon.png')}

                     noLine={false}
                    />
                    <DisplayItemView

                     title={'主持人'}
                     icon={require('../../images/hostIcon.png')}
                     detail={'james'}
                     noLine={false}
                    />
                    <DisplayItemView

                     title={'记录员'}
                     icon={require('../../images/registrarIcon.png')}
                     detail={'tom'}
                     noLine={false}
                    />

                    {this.createEnter(require('../../images/participantIcon.png'),'参会人员','查看全部','member')}
                    <View style={styles.line}>
                    </View>

                    <DisplayItemView

                     title={'会议地点'}
                     icon={require('../../images/placeIcon.png')}
                     detail={'ssss'}
                     noLine={false}
                    />

                    <View style={styles.space}>
                    </View>

                    <DisplayItemView

                     title={'会议开始时间'}
                     detail={'2017/11/09 10:00'}
                     noLine={false}
                    />
                    <DisplayItemView

                     title={'会议结束时间'}
                     detail={'2017/11/09 10:00'}
                     noLine={false}
                    />
                    <DisplayItemView

                     title={'会前提醒时间'}
                     detail={'提前1小时提醒'}
                     noLine={false}
                    />

                    <View style={styles.space}>
                    </View>

                    <DisplayItemView

                     title={'会议用品'}
                      icon={require('../../images/conferenceAmenitiesIcon.png')}
                     detail={'图纸，文件'}
                     noLine={false}
                    />

                    <DisplayItemView

                     title={'会议备注'}
                      icon={require('../../images/remarkIcon.png')}
                     detail={'请各位领导，同事准时到场'}
                     noLine={false}
                    />


                    {this.createEnter(require('../../images/enclosureIcon.png'),'附件','查看全部','attach')}

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
