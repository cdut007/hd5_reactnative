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

import EditSubjectView from './EditSubjectView'
import ScanMemberListView from './ScanMemberListView'
import FeedbackMessageView from './FeedbackMessageView'
import DisplayItemView from '../../common/DisplayItemView';
import DisplayMoreItemView from '../../common/DisplayMoreItemView';

import FileResultView from './FileResultView'

export default class NoticeDetailView extends Component {
    constructor(props) {
        super(props)
        this.state = {

            modalVisible: false,
            data:this.props.data,
        };
    }


    back() {
        this.props.navigator.pop()
    }

    componentDidMount() {

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

                HttpRequest.get('/notification/'+this.props.data.id, paramBody, this.onGetDataSuccess.bind(this),
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
          this.props.navigator.push({
              component: EditSubjectView,
               props: {
                   data:this.state.data,

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
          this.props.navigator.push({
              component: FeedbackMessageView,
               props: {
                   data:this.state.data,
                   notice:true,

                  }
          })
      }else if (tag == 'attach') {
          this.props.navigator.push({
              component: FileResultView,
               props: {
                   data:this.state.data,
                   notice:true,

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
                    title="通告详情"
                    leftIcon={require('../../images/back.png')}
                    leftPress={this.back.bind(this)} />
                    <ScrollView
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps={false}
                    style={styles.main_container}>

                    <View style={styles.space}>
                    </View>
                    {this.createEnter(require('../../images/informIcon.png'),'通知反馈',this.state.data.unread,'feedback')}
                    <View style={styles.space}>
                    </View>

                    {this.createEnter(require('../../images/themeIcon.png'),'通告主题',this.state.data.subject,'subject')}
                    <View style={styles.line}>
                    </View>

                    <DisplayItemView
                     icon={require('../../images/typesIcon.png')}
                     title={'通告类型'}
                     detail={this.state.data.category}
                     noLine={false}
                    />
                    <DisplayItemView

                     title={'通告部门'}
                     detail={this.state.data.department}
                     icon={require('../../images/department_icon.png')}

                     noLine={false}
                    />


                    {this.createEnter(require('../../images/participantIcon.png'),'通告接收人员','查看全部','member')}
                    <View style={styles.line}>
                    </View>


                    <View style={styles.space}>
                    </View>

                    <DisplayItemView

                     title={'通告开始时间'}
                     detail={Global.formatFullDateDisplay(this.state.data.startTime)}
                     noLine={false}
                    />
                    <DisplayItemView

                     title={'通告结束时间'}
                     detail={Global.formatFullDateDisplay(this.state.data.endTime)}
                     noLine={false}
                    />
                    <DisplayItemView

                     title={'通告提醒时间'}
                     detail={'提前1小时提醒'}
                     noLine={false}
                    />

                    <View style={styles.space}>
                    </View>




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
