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
    DeviceEventEmitter,
} from 'react-native';


import ImageViewer from 'react-native-image-zoom-viewer';
import Dimensions from 'Dimensions';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
import HttpRequest from '../../HttpRequest/HttpRequest'
import NavBar from '../../common/NavBar'
var Global = require('../../common/globals');

import EditSubjectView from './EditSubjectView'
import ScanMemberListView from './ScanMemberListView'
import FeedbackMessageView from './FeedbackMessageView'
import DisplayItemView from '../../common/DisplayItemView';
import DisplayMoreItemView from '../../common/DisplayMoreItemView';
import FileResultView from './FileResultView'
import CommitButton from '../../common/CommitButton'

export default class MeetingDetailView extends Component {
    constructor(props) {
        super(props)
        this.state = {

            modalVisible: false,
            data:this.props.data,
            alertTimeArry:[],
        };
    }


    back() {
        this.props.navigator.pop()
    }

    componentDidMount() {

        var me = this
        AsyncStorage.getItem('k_extra_alert_time',function(errs,result)
        {
            if (!errs && result && result.length)
            {
                me.setState({alertTimeArry: JSON.parse(result)})
            }
            else
            {

            }
        });

      this.getNewestData()

    }

    onGetDataSuccess(response,paramBody){
             Global.log('onGetDataSuccess@@@@')
            if (response.responseResult.feedback) {
                this.props.data.feedback = response.responseResult.feedback
                this.setState({
                    data:this.props.data,
                });
            }

    }

    getNewestData(){
                var paramBody = {}

                HttpRequest.get('/conference/'+this.props.data.id, paramBody, this.onGetDataSuccess.bind(this),
                    (e) => {


                        try {
                            var errorInfo = JSON.parse(e);
                            if (errorInfo != null) {
                             Global.log(errorInfo)
                            } else {
                                Global.log(e)
                            }
                        }
                        catch(err)
                        {
                            Global.log(err)
                        }

                        Global.log('Task error:' + e)
                    })
    }

  onEnterClick(tag){
      if (tag == 'subject') {
              var web = this.state.data.source == 'WEB'?true:false
          this.props.navigator.push({
              component: EditSubjectView,
               props: {
                   data:this.state.data,
                   web:web,
                   scan:true,
                  }
          })
      }else if (tag == 'member') {
          this.props.navigator.push({
              component: ScanMemberListView,
               props: {
                   data:this.state.data,

                  }
          })
      }else if (tag == 'feedback') {
          this.props.data.unread = 0
          this.props.navigator.push({
              component: FeedbackMessageView,
               props: {
                   data:this.state.data,

                  }
          })
      }else if (tag == 'attach') {
          this.props.navigator.push({
              component: FileResultView,
               props: {
                   data:this.state.data,

                  }
          })
      }

  }

  createEnter(icon,label,desc,tag){
      var textColor = '#777777'
      if (tag == 'feedback') {
          textColor = '#e82628'
          if (desc == '0') {
              desc =''
          }
      }
      return(
          <TouchableOpacity style={styles.statisticsflexContainer} onPress={this.onEnterClick.bind(this,tag)}>

          <View style={{flex:1,paddingLeft:10,flexDirection:'row'}}>

          <Image style={{width:24,height:24,marginRight:5}} source={icon} />

            <Text numberOfLines={1} style={{color:'#444444',fontSize:14,}}>
              {label}
            </Text>
          </View>
          <Text numberOfLines={1} style={{flex:1.6,paddingRight:10,color:textColor,fontSize:14,}}>
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

                    style={styles.main_container}>

                    <View style={styles.space}>
                    </View>
                    {this.createEnter(require('../../images/informIcon.png'),'通知反馈',this.state.data.unread,'feedback')}
                    <View style={styles.space}>
                    </View>

                    {this.createEnter(require('../../images/themeIcon.png'),'会议主题',this.state.data.subject,'subject')}
                    <View style={styles.line}>
                    </View>

                    <DisplayItemView
                     icon={require('../../images/typesIcon.png')}
                     title={'会议类型'}
                     detail={this.state.data.category}
                     noLine={false}
                    />
                    <DisplayItemView

                     title={'所属项目'}
                     detail={this.state.data.project}
                     icon={require('../../images/projectIcon.png')}

                     noLine={false}
                    />
                    <DisplayItemView

                     title={'主持人'}
                     icon={require('../../images/hostIcon.png')}
                     detail={this.state.data.host}
                     noLine={false}
                    />
                    <DisplayItemView

                     title={'记录员'}
                     icon={require('../../images/registrarIcon.png')}
                     detail={this.state.data.recorder}
                     noLine={false}
                    />

                    {this.createEnter(require('../../images/participantIcon.png'),'参会人员','查看全部','member')}
                    <View style={styles.line}>
                    </View>

                    <DisplayItemView

                     title={'会议地点'}
                     icon={require('../../images/placeIcon.png')}
                     detail={this.state.data.address}
                     noLine={false}
                    />

                    <View style={styles.space}>
                    </View>

                    <DisplayItemView

                     title={'会议开始时间'}
                     detail={Global.formatFullDateDisplay(this.state.data.startTime)}
                     noLine={false}
                    />
                    <DisplayItemView

                     title={'会议结束时间'}
                     detail={Global.formatFullDateDisplay(this.state.data.endTime)}
                     noLine={false}
                    />
                    <DisplayItemView

                     title={'会前提醒时间'}
                     detail={Global.getAlartTimeByKey(this.state.alertTimeArry,this.state.data.alarmTime)}
                     noLine={false}
                    />

                    <View style={styles.space}>
                    </View>

                    <DisplayItemView

                     title={'会议用品'}
                      icon={require('../../images/conferenceAmenitiesIcon.png')}
                     detail={this.state.data.supplies}
                     noLine={false}
                    />

                    <DisplayItemView

                     title={'会议备注'}
                      icon={require('../../images/remarkIcon.png')}
                     detail={this.state.data.remark}
                     noLine={false}
                    />


                    {this.createEnter(require('../../images/enclosureIcon.png'),'附件','查看全部','attach')}

                </ScrollView>
                {this.renderFormView()}
            </View>
        )
    }

    onCancelDataSuccess(response,paramBody){
         DeviceEventEmitter.emit('operate_meeting','operate_meeting');
            Global.showToast(response.message)
            Global.log('onCancelDataSuccess@@@@')
            this.props.navigator.pop()

    }

cancelItem(){
    var itemData = this.state.data;
    var paramBody={
        ids:itemData.id
    }
    HttpRequest.post('/conference_op/cancel', paramBody,this.onCancelDataSuccess.bind(this),
         (e) => {


             try {
                 var errorInfo = JSON.parse(e);
                 if (errorInfo != null) {
                  Global.log(errorInfo)
                 } else {
                     Global.log(e)
                 }
             }
             catch(err)
             {
                 Global.log(err)
             }

             Global.log('Task error:' + e)
         })
}


    renderFormView(){
            //1  fininshed retun, jsut san

            if (this.state.data.status == 'UNSTARTED') {

                return(<View style={{height:50,width:width}}><CommitButton title={'取消'}
                        onPress={this.cancelItem.bind(this)}></CommitButton></View>)

            }

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
