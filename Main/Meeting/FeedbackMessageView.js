import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    ListView,
    ActivityIndicator,
    TouchableNativeFeedback,
    TouchableHighlight,
    AsyncStorage,
    BackAndroid,
    TextInput,
    DeviceEventEmitter,
} from 'react-native';
import HttpRequest from '../../HttpRequest/HttpRequest'
import Dimensions from 'Dimensions';
import NavBar from '../../common/NavBar'
import CircleLabelHeadView from '../../common/CircleLabelHeadView';
import px2dp from '../../common/util'
import SearchBar from '../../common/SearchBar';

import CommitButton from '../../common/CommitButton'
import CheckBox from 'react-native-checkbox'

var Global = require('../../common/globals');
const isIOS = Platform.OS == "ios"
var width = Dimensions.get('window').width;

import Spinner from 'react-native-loading-spinner-overlay'

export default class FeedbackMessageView extends Component {
    constructor(props) {
        super(props)
        var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

       LOADING = {};
        this.state = {
            dataSource: ds,
            isLoading: false,
            isLoadingTail: false,
            filter: '',
            title: '通知反馈',
            messages:[],
            message:'',
            loadingVisible:false,
        }


    }


        back() {
            this.props.navigator.pop()
        }

    search() {

    }


    componentDidMount() {
        var data = []

            this.props.data.unread = 0
         if (this.props.data.feedback) {

             this.setState({
                 messages:this.props.data.feedback,
                 dataSource:this.state.dataSource.cloneWithRows(this.props.data.feedback),
                 isLoading: false,
                 isRefreshing:false,
             });
         }else{
             this.getNewestFeedback()
         }



        BackAndroid.addEventListener('harwardBackPress', () => {

                  return false;
      });

      this.markUnreadRequest()

    }

    onMarkUnreadDataSuccess(response,paramBody){
         DeviceEventEmitter.emit('operate_meeting','operate_meeting');
             Global.log('onMarkUnreadDataSuccess@@@@')
    }

    markUnreadRequest(){
        var paramBody = {
             conferenceId:this.props.data.id,
            }
            var uri = '/conference_op/mark'
            if (this.props.notice) {
                paramBody = {
                     notificationId:this.props.data.id,

                    }
                    uri = '/notification_op/mark'

            }




  HttpRequest.post(uri, paramBody,this.onMarkUnreadDataSuccess.bind(this),
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


    onFeedbackDataSuccess(response,paramBody){
             Global.log('onFeedbackDataSuccess@@@@')
             this.setState({loadingVisible:false,message:''})
             this.getNewestFeedback()
    }

    onGetDataSuccess(response,paramBody){
             Global.log('onGetDataSuccess@@@@')
            this.props.data.feedback = response.responseResult.feedback
            if (this.props.data.feedback) {

                this.setState({
                    messages:this.props.data.feedback,
                    dataSource:this.state.dataSource.cloneWithRows(this.props.data.feedback),
                    isLoading: false,
                    isRefreshing:false,
                });
            }else{

            }

    }

    getNewestFeedback(){

                var paramBody = {}

                var uri = '/conference/'
                if (this.props.notice) {
                    uri = '/notification/'
                }

                HttpRequest.get(uri+this.props.data.id, paramBody, this.onGetDataSuccess.bind(this),
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


    sendMessage(){

        if (this.state.message == '') {
            Global.alert('请输入回复内容')
            return
        }

        this.setState({loadingVisible:true})
        var paramBody = {
             conferenceId:this.props.data.id,
             message:this.state.message,
            }

        var uri = '/conference_op/feedback'
        if (this.props.notice) {
            paramBody = {
                 notificationId:this.props.data.id,
                 message:this.state.message,
                }
                uri = '/notification_op/feedback'

        }

        HttpRequest.post(uri, paramBody, this.onFeedbackDataSuccess.bind(this),
            (e) => {

                this.setState({loadingVisible:false})
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

    componentWillUnmount() {
              BackAndroid.removeEventListener('hardwareBackPress');
          }







        componentWillUnmount(){

        }



    onItemPress(rowData,rowID){
         //checked

    }


    hasMore(){


      }

      onEndReached() {




        }

        onSearchChange(event) {
           var filter = event.nativeEvent.text.toLowerCase();
        //    this.clearTimeout(this.timeoutID);
        //    this.timeoutID = this.setTimeout(() => this.executePlanRequest(pagesize,1,filter), 100);
        }

         renderFooter() {
           if (!this.hasMore() || !this.state.isLoadingTail) {
             return <View style={styles.scrollSpinner} />;
           }

           return <ActivityIndicator style={styles.scrollSpinner} />;
         }

         renderSendView(){
             return(<View style={{alignItems:'center',flexDirection:'row',backgroundColor:'#ffffff',height:50,width:width}}>
             <TextInput
                style={{alignSelf: 'stretch',
                fontSize: 12,flex:1,
                height:36,
                borderColor: '#f77935',
                borderWidth: 1,
                marginLeft:10,
                marginRight:10,
                marginTop:6,
                borderRadius: 4,
                textAlign: 'left',}}
                autoFocus={true}
                showsVerticalScrollIndicator={false}
                 underlineColorAndroid={'transparent'}
                 value={this.state.message}

                 editable={true}
                 placeholderTextColor='#888888'
                 placeholder={'请输入回复内容...'}
                 onChangeText={(text) => this.setState({ message: text })}>
             </TextInput>
             <TouchableOpacity onPress={this.sendMessage.bind(this)}>
             <Text style={{fontSize: 14,color:'#555555',marginRight:10}}>
             回复全体
             </Text>

             </TouchableOpacity>

                 </View>)
         }

    render() {
        return (
            <View style={styles.container}>
                <NavBar
                title={this.state.title}
                leftIcon={require('../../images/back.png')}
                leftPress={this.back.bind(this)} />
               {this.renderListView()}
               {this.renderSendView()}
               <Spinner
                   visible={this.state.loadingVisible}
               />
            </View>
        )
    }



    index(rowID){
     var index = parseInt(rowID) + 1;
        return index;
    }

    renderRow(rowData, sectionID, rowID) {
        itemView = () => {
            var role = '';
            if (rowData.user.roles && rowData.user.roles.length>0) {
                role = '('+ rowData.user.roles[0].name+')';
            }
                return (
                       <View style={styles.itemContainer}>
                        <TouchableOpacity style={[{padding:10,alignItems:'center',flexDirection:'row',alignSelf:'stretch',backgroundColor:'#ffffff'}]} onPress={this.onItemPress.bind(this, rowData,rowID)}>

                                                <CircleLabelHeadView style={{height:48,width:48}}
                                                    contactName = {rowData.user.realname}
                                                >

                                                </CircleLabelHeadView>

                        <View style={styles.flexContainer}>

                        <View style={styles.statisticsflexContainer}>

                        <Text style={[styles.content,]}>
                          {rowData.user.realname}
                        </Text>


                        <Text style={{flex:1,color:'#1c1c1c',fontSize:14,marginLeft:4,}}>
                          {role}
                        </Text>

                        <Text style={{color:'#888888',fontSize:12,width:160}}>
                          {Global.formatFullDateDisplay(rowData.feedbackTime)}
                        </Text>
                        </View>

                        <Text style={{flex:1,textAlign:'left',color:'#777777',fontSize:14,marginLeft:4,}}>
                          {rowData.message}
                        </Text>


                        </View>




                        </TouchableOpacity>
                            <View style={styles.divider}/>

                        </View>

                )

        }
        return (
            <View style={styles.itemView}>
                {itemView()}
            </View>
        )
    }
    renderListView() {
        return (
            <ListView
                style={{ }}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                renderFooter={this.renderFooter.bind(this)}
                onEndReached={this.onEndReached.bind(this)}
               automaticallyAdjustContentInsets={false}
               keyboardDismissMode="on-drag"
               keyboardShouldPersistTaps={true}
               showsVerticalScrollIndicator={false}
            />
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
    list:
    {
        flex: 1,
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
           width: width,
           backgroundColor: '#ffffff',
           // 容器需要添加direction才能变成让子元素flex
           padding:10,
    },
    itemContainer: {
            flex:1,

    },
     statisticsflexContainer: {
              backgroundColor: '#ffffff',
              flexDirection: 'row',
          },

    cell: {
        flex: 1,
        height: 57.5,
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
