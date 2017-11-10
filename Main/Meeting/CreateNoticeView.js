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
import Spinner from 'react-native-loading-spinner-overlay'
import DisplayItemView from '../../common/DisplayItemView';
import EnterItemView from '../../common/EnterItemView';
import DateTimePickerView from '../../common/DateTimePickerView'

import EditItemView from '../../common/EditItemView';
import MemberSelectView from '../../common/MemberSelectView'
import EditSubjectView from './EditSubjectView'
import ChooseMemberView from './ChooseMemberView'
import HttpRequest from '../../HttpRequest/HttpRequest'

const MAX_IMAGE_COUNT = 5;
const dismissKeyboard = require('dismissKeyboard');
import ImagePicker from 'react-native-image-picker'

var options = {
    title: '', // specify null or empty string to remove the title
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照', // specify null or empty string to remove this button
    chooseFromLibraryButtonTitle: '从相册选取', // specify null or empty string to remove this button
    cameraType: 'back', // 'front' or 'back'
    mediaType: 'photo', // 'photo' or 'video'
    videoQuality: 'medium', // 'low', 'medium', or 'high'
    durationLimit: 10, // video recording max time in seconds
    maxWidth: 1920, // photos only
    maxHeight: 1920, // photos only
    aspectX: 2, // aspectX:aspectY, the cropping image's ratio of width to height
    aspectY: 1, // aspectX:aspectY, the cropping image's ratio of width to height
    quality: 1, // photos only
    angle: 0, // photos only
    allowsEditing: false, // Built in functionality to resize/reposition the image
    noData: true, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
    storageOptions: { // if this key is provided, the image will get saved in the documents/pictures directory (rather than a temporary directory)
        skipBackup: true, // image will NOT be backed up to icloud
        path: 'images' // will save image at /Documents/images rather than the root
    }
};

export default class CreateNoticeView extends Component {
    constructor(props) {
        super(props)
        var meetingTypeArry=['行政','工程','物资','技术','安全','质量','综合']
        var data = this.props.data
        var title = '创建通告'
        if (data) {
            if (data.status == 'DRAFT') {
                title = '编辑通告'
                data.members = data.participants
                data.alarmTime = Global.getAlartTimeByKey(Global.alertTimeArry,data.alarmTime)

            }
        }else{
            data = {}
        }
        this.state = {
            data: data,
            _selectD:{},
            title:title,
            meetingTypeData:meetingTypeArry,
            alertTimeArry:[],
            loadingVisible:false,
            fileArr: [{}],
        };
    }


        onGetExtraAlermDataSuccess(response,paramBody){
                 Global.log('onGetExtraAlermDataSucces@@@@')
                 var result = response.responseResult;
                 if (!result || result.length == 0) {
                     return
                 }
                 Global.alertTimeArry = result
                 this.setState({alertTimeArry:result})

                 AsyncStorage.setItem('k_extra_alert_time', JSON.stringify(result), (error, result) => {
                     if (error) {
                         Global.log('save k_department_node faild.')
                     }
                 });
             }

        componentDidMount(){

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

            var paramBody = {
                }
            HttpRequest.get('/extra/conference_alarm', paramBody, this.onGetExtraAlermDataSuccess.bind(this),
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



    back() {
        dismissKeyboard();
        this.props.navigator.pop()
    }



    onPublishSuccess(response){
        this.setState({loadingVisible:false})
        Global.showToast(response.message)
        this.back()

    }

    publishMeeting(){

        if (!this.state.data.subject) {
            Global.alert('请输入通告主题')
            return
        }

        if (!this.state.data.content) {
            Global.alert('请输入通告内容')
            return
        }

        if (!this.state.data.category) {
            Global.alert('请选择通告类型')
            return
        }

        if (!this.state.data.department) {
            Global.alert('请输入通告发出部门')
            return
        }



        if (!this.state.data.members || this.state.data.members.length <= 0) {
            Global.alert('请选择通告接收人员')
            return
        }


        if (!this.state.data.startTime) {
            Global.alert('请选择通告开始时间')
            return
        }

        if (!this.state.data.endTime) {
            Global.alert('请选择通告结束时间')
            return
        }

        if (this.state.data.endTime <= this.state.data.startTime) {
            Global.alert('通告结束时间不能小于通告开始时间')
            return
        }

        if (!this.state.data.alarmTime) {
            Global.alert('请选择通告提醒时间')
            return
        }





        var ids= ''
        for (var i = 0; i < this.state.data.members.length; i++) {
                ids+=this.state.data.members[i].id+',';
        }

        ids = ids.substr(0,ids.length-1)
    var conferenceId = ''
    if (this.state.data.id) {
        conferenceId = this.state.data.id
    }
    this.setState({loadingVisible:true})
        var param = new FormData()
                param.append('id', conferenceId)
                param.append('subject', this.state.data.subject)
                param.append('content', this.state.data.content)
                param.append('category', this.state.data.category)
                param.append('department', this.state.data.department)
                param.append('startTime',Global.formatFullDate(this.state.data.startTime))
                param.append('endTime', Global.formatFullDate(this.state.data.endTime))
                param.append('alarmTime', Global.getAlartTime(this.state.alertTimeArry,this.state.data.alarmTime))
                param.append('participants',ids)
                param.append('type','SEND')
                if (this.state.fileArr.length>0) {
                    this.state.fileArr.map((item, i) => {
                        if (item['fileSource']) {
                           let file = {uri: item['fileSource'], type: 'multipart/form-data', name: item['fileName']};   //这里的key(uri和type和name)不能改变,
                           param.append("file"+i,file);   //这里的files就是后台需要的key
                        }
                    });
                }


            HttpRequest.uploadImage('/notification', param, this.onPublishSuccess.bind(this),
            (e) => {
                this.setState({
                    loadingVisible: false
                });
                try {
                    var errorInfo = JSON.parse(e);
                }
                catch(err)
                {
                    Global.log("error======"+err)
                }
                    if (errorInfo != null) {
                        if (errorInfo.code == -1002||
                         errorInfo.code == -1001) {
                        Global.alert(errorInfo.message);
                    }else {
                        Global.alert(e)
                    }

                    } else {
                        Global.alert(e)
                    }


                Global.log('push meeting error:' + e)
            })
    }

    saveDraftMeeting(){

        if (!this.state.data.subject) {
            Global.alert('请输入通告主题')
            return
        }

        if (!this.state.data.content) {
            Global.alert('请输入通告内容')
            return
        }

        if (!this.state.data.category) {
            Global.alert('请选择通告类型')
            return
        }

        if (!this.state.data.department) {
            Global.alert('请输入通告发出部门')
            return
        }



        if (!this.state.data.members || this.state.data.members.length <= 0) {
            Global.alert('请选择通告接收人员')
            return
        }


        if (!this.state.data.startTime) {
            Global.alert('请选择通告开始时间')
            return
        }

        if (!this.state.data.endTime) {
            Global.alert('请选择通告结束时间')
            return
        }

        if (this.state.data.endTime <= this.state.data.startTime) {
            Global.alert('通告结束时间不能小于通告开始时间')
            return
        }

        if (!this.state.data.alarmTime) {
            Global.alert('请选择通告提醒时间')
            return
        }



        var ids= ''
        for (var i = 0; i < this.state.data.members.length; i++) {
                ids+=this.state.data.members[i].id+',';
        }

        ids = ids.substr(0,ids.length-1)
        var conferenceId = ''
        if (this.state.data.id) {
            conferenceId = this.state.data.id
        }
    this.setState({loadingVisible:true})


            var param = new FormData()
            param.append('id', conferenceId)
            param.append('subject', this.state.data.subject)
            param.append('content', this.state.data.content)
            param.append('category', this.state.data.category)
            param.append('department', this.state.data.department)
            param.append('startTime',Global.formatFullDate(this.state.data.startTime))
            param.append('endTime', Global.formatFullDate(this.state.data.endTime))
            param.append('alarmTime', Global.getAlartTime(this.state.alertTimeArry,this.state.data.alarmTime))
            param.append('participants',ids)
            param.append('type','DRAFT')
            if (this.state.fileArr.length>0) {
                this.state.fileArr.map((item, i) => {
                    if (item['fileSource']) {
                       let file = {uri: item['fileSource'], type: 'multipart/form-data', name: item['fileName']};   //这里的key(uri和type和name)不能改变,
                       param.append("file"+i,file);   //这里的files就是后台需要的key
                    }
                });
            }


        HttpRequest.uploadImage('/notification', param, this.onPublishSuccess.bind(this),
            (e) => {
                this.setState({
                    loadingVisible: false
                });
                try {
                    var errorInfo = JSON.parse(e);
                }
                catch(err)
                {
                    Global.log("error======"+err)
                }
                    if (errorInfo != null) {
                        if (errorInfo.code == -1002||
                         errorInfo.code == -1001) {
                        Global.alert(errorInfo.message);
                    }else {
                        Global.alert(e)
                    }

                    } else {
                        Global.alert(e)
                    }


                Global.log('push meeting error:' + e)
            })

    }renderFileView() {
        return (
            <View style={{flexDirection: 'row', flexWrap: 'wrap', width: width, paddingTop: 10, paddingRight: 10}} horizontal={true} >
                    {this.renderImages()}
            </View>
        )
    }


    onSelectFile(idx) {
        this.currentFileIdx = idx

        let showPicker = () => {
            ImagePicker.showImagePicker(options, (response) => {
                //   Global.log('Response = ', response);
                if (response.didCancel) {
                    Global.log('User cancelled image picker');
                }
                else if (response.error) {
                    Global.log('ImagePicker Error: ', response.error);
                }
                else if (response.customButton) {
                    Global.log('User tapped custom button: ', response.customButton);
                }
                else {
                    // You can display the image using either data:
                    // const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
                    var source;
                    if (Platform.OS === 'android') {
                         source = {uri: response.uri, isStatic: true};
                     } else {
                        source = {
                           uri: response.uri.replace('file://', ''),
                           isStatic: true
                        };
                    }

                   var fileInfo = this.state.fileArr[this.currentFileIdx]
                   fileInfo['fileSource'] = source.uri
                    fileInfo['fileName'] = response.fileName

                    if(this.state.fileArr.length<MAX_IMAGE_COUNT && this.state.fileArr[this.state.fileArr.length-1]['fileSource']){
                        this.state.fileArr.push({});
                    }
                    this.setState({
                        ...this.state
                    });
                }
            });
        }


        showPicker()

    }

    onDeleteFile(idx) {

        if(this.state.fileArr[idx]['fileSource']){
            this.state.fileArr.splice(idx, 1)
            this.setState({
                ...this.state
            })
        }


    }

    renderImages(){
        var imageViews = [];
        {this.state.fileArr.map((item,i) => {
                imageViews.push(
                    <TouchableOpacity
                     key={i}
                     onPress = {() => this.onSelectFile(i) }
                     onLongPress = { () => this.onDeleteFile(i) }
                     style={{width: 70, height: 70, marginLeft: 10, marginBottom: 10,}}>
                        {
                            item['fileSource']
                             ?
                            (<Image resizeMode={'cover'} style={{ width: 70, height: 70, borderRadius: 4, borderWidth: 0.5}} source={{uri: item['fileSource']}} />)
                             :
                            (<Image resizeMode={'cover'} style={{ width: 70, height: 70, borderRadius: 4, borderWidth: 0.5}} source={require('../../images/add_pic_icon.png')} />)
                        }
                    </TouchableOpacity>
                );
        })}
        if(this.state.fileArr[this.state.fileArr.length-1]['fileSource']){
                this.state.fileArr.push({});
            }
        return imageViews;
    }


    renderFileView() {
        return (
            <View style={{flexDirection: 'row', flexWrap: 'wrap', width: width, paddingTop: 10, paddingRight: 10}} horizontal={true} >
                    {this.renderImages()}
            </View>
        )
    }


    onSelectFile(idx) {
        this.currentFileIdx = idx

        let showPicker = () => {
            ImagePicker.showImagePicker(options, (response) => {
                //   Global.log('Response = ', response);
                if (response.didCancel) {
                    Global.log('User cancelled image picker');
                }
                else if (response.error) {
                    Global.log('ImagePicker Error: ', response.error);
                }
                else if (response.customButton) {
                    Global.log('User tapped custom button: ', response.customButton);
                }
                else {
                    // You can display the image using either data:
                    // const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
                    var source;
                    if (Platform.OS === 'android') {
                         source = {uri: response.uri, isStatic: true};
                     } else {
                        source = {
                           uri: response.uri.replace('file://', ''),
                           isStatic: true
                        };
                    }

                   var fileInfo = this.state.fileArr[this.currentFileIdx]
                   fileInfo['fileSource'] = source.uri
                    fileInfo['fileName'] = response.fileName

                    if(this.state.fileArr.length<MAX_IMAGE_COUNT && this.state.fileArr[this.state.fileArr.length-1]['fileSource']){
                        this.state.fileArr.push({});
                    }
                    this.setState({
                        ...this.state
                    });
                }
            });
        }


        showPicker()

    }

    onDeleteFile(idx) {

        if(this.state.fileArr[idx]['fileSource']){
            this.state.fileArr.splice(idx, 1)
            this.setState({
                ...this.state
            })
        }


    }

    renderImages(){
        var imageViews = [];
        if(this.state.fileArr.length<MAX_IMAGE_COUNT && this.state.fileArr[this.state.fileArr.length-1]['fileSource']){
                this.state.fileArr.push({});
            }
        {this.state.fileArr.map((item,i) => {
                imageViews.push(
                    <TouchableOpacity
                     key={i}
                     onPress = {() => this.onSelectFile(i) }
                     onLongPress = { () => this.onDeleteFile(i) }
                     style={{width: 70, height: 70, marginLeft: 10, marginBottom: 10,}}>
                        {
                            item['fileSource']
                             ?
                            (<Image resizeMode={'cover'} style={{ width: 70, height: 70, borderRadius: 4, borderWidth: 0.5}} source={{uri: item['fileSource']}} />)
                             :
                            (<Image resizeMode={'cover'} style={{ width: 70, height: 70, borderRadius: 4, borderWidth: 0.5}} source={require('../../images/add_pic_icon.png')} />)
                        }
                    </TouchableOpacity>
                );
        })}
        if(this.state.fileArr[this.state.fileArr.length-1]['fileSource']){
                this.state.fileArr.push({});
            }
        return imageViews;
    }




onEditTitleContentClick(){

}

onChangeText(tag,text){
    this.state.data[tag] = text;
    Global.log(tag+"text=="+text);
    this.setState({...this.state});
}


onSelectedDate(tag,date){
 Global.log("date=="+date.getTime());
 this.state.data[tag] = date.getTime();
 this.setState({...this.state});
}
onSelectedMeetingType(tag,meetingType){

    Global.log("meetingType=="+meetingType);
    this.state.data[tag] = meetingType[0];
    this.setState({...this.state});

}

onSelectedAlertType(tag,alertType){

    Global.log("alertType=="+alertType);
    this.state.data[tag] = alertType[0];
    this.setState({...this.state});

}



createEnter(icon,label,desc,tag){
    var textColor = '#777777'
    if (tag == 'feedback') {
        textColor = '#e82628'
    }
    return(
        <TouchableOpacity style={[styles.statisticsflexContainer,]} onPress={this.onEnterClick.bind(this,tag)}>

        <View style={{flex:1,paddingLeft:10,flexDirection:'row'}}>

        <Image style={{width:24,height:24,marginRight:5}} source={icon} />

          <Text numberOfLines={1} style={{color:'#444444',fontSize:14,}}>
            {label}
          </Text>
        </View>

        <View style={{justifyContent:'center',alignSelf:'stretch',flex:1.6,}}>
        <Text numberOfLines={1} style={{marginTop:12,alignSelf:'stretch',flex:1,textAlign:'right',color:textColor,fontSize:14,}}>
          {desc}
        </Text>
        </View>

        <Image style={{alignSelf:'center'}} source={require('../../images/detailsIcon.png')}></Image>

        </TouchableOpacity>
    )
}

onEnterClick(tag){
    if (tag == 'subject') {
        this.props.navigator.push({
            component: EditSubjectView,
             props: {
                 data:this.state.data,
                 refresh:this.refresh.bind(this),
                 notice:true,
                }
        })
    }else if (tag == 'member') {
        this.props.navigator.push({
            component: ChooseMemberView,
             props: {
                 data:this.state.data,
                 refresh:this.refresh.bind(this),
                 meeting:true,
                }
        })
    }
}

refresh(){
    this.setState({...this.state});
}



createChooseInfo(icon,label,desc,data,tag){
    var textColor = '#777777'

    if (tag == 'category'|| tag =='alarmTime') {
        if (tag == 'category') {
            return(
                <View style={styles.statisticsflexContainer}>

                <View style={{paddingRight:20,paddingLeft:10,flexDirection:'row'}}>

                <Image style={{width:24,height:24,marginRight:5}} source={icon} />

                  <Text numberOfLines={1} style={{color:'#444444',fontSize:14,}}>
                    {label}
                  </Text>
                </View>

                <View
                 key={tag}
                 style={[styles.cell,{alignSelf:'stretch',padding:4,}]}>
                <TouchableOpacity  key={tag} onPress={() => this.selectMeetingType.onPickClick()} style={{borderWidth:0.5,
                      alignItems:'center',
                      flex: 1,
                      height:48,
                      borderColor : '#f77935',
                      backgroundColor : 'white',
                      borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:10,paddingRight:10,paddingTop:8,paddingBottom:8}}>

                <MemberSelectView
                    key={tag}
                ref={(c) => this.selectMeetingType = c}
                style={{color:'#f77935',fontSize:14,alignSelf:'center',flex:1}}
                title={desc}
                data={data}

                pickerTitle={'选择'+label}
                onSelected={this.onSelectedMeetingType.bind(this,tag)} />
                                    <Image
                                    style={{width:20,height:20,}}
                                    source={require('../../images/unfold.png')}/>
                </TouchableOpacity>
                </View>

                </View>
            )
        }else{
            var timeArry = []
            for (var i = 0; i < data.length; i++) {
                timeArry.push(data[i].value)
            }
            return(
                <View style={styles.statisticsflexContainer}>

                <View style={{paddingRight:20,paddingLeft:10,flexDirection:'row'}}>

                <Image style={{width:24,height:24,marginRight:5}} source={icon} />

                  <Text numberOfLines={1} style={{color:'#444444',fontSize:14,}}>
                    {label}
                  </Text>
                </View>

                <View
                 key={tag}
                 style={[styles.cell,{alignSelf:'stretch',padding:4,}]}>
                <TouchableOpacity  key={tag} onPress={() => this.selectAlermType.onPickClick()} style={{borderWidth:0.5,
                      alignItems:'center',
                      flex: 1,
                      height:48,
                      borderColor : '#f77935',
                      backgroundColor : 'white',
                      borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:10,paddingRight:10,paddingTop:8,paddingBottom:8}}>

                <MemberSelectView
                    key={tag}
                ref={(c) => this.selectAlermType = c}
                style={{color:'#f77935',fontSize:14,alignSelf:'center',flex:1}}
                title={desc}
                data={timeArry}

                pickerTitle={'选择'+label}
                onSelected={this.onSelectedAlertType.bind(this,tag)} />
                                    <Image
                                    style={{width:20,height:20,}}
                                    source={require('../../images/unfold.png')}/>
                </TouchableOpacity>
                </View>

                </View>
            )
        }
    }else{//date
        return(
            <View style={styles.statisticsflexContainer}>

            <View style={{paddingRight:20,paddingLeft:10,flexDirection:'row'}}>

            <Image style={{width:24,height:24,marginRight:5}} source={icon} />

              <Text numberOfLines={1} style={{color:'#444444',fontSize:14,}}>
                {label}
              </Text>
            </View>

            <View
             key={tag}
             style={[styles.cell,{alignSelf:'stretch',padding:4,}]}>
            <TouchableOpacity
             key={tag}
             onPress={() => this.state._selectD[tag].onClick()}
            style={{borderWidth:0.5,
                  alignItems:'center',
                  borderColor : '#f77935',
                  backgroundColor : 'white',
                  borderRadius : 4,flexDirection:'row',alignSelf:'stretch',paddingLeft:10,paddingRight:10,paddingTop:8,paddingBottom:8}}>

            <DateTimePickerView
            ref={(c) => this.state._selectD[tag] = c}
                type={'datetime'}
                minTime={new Date()}
                title={desc}
                style={{color:'#f77935',fontSize:14,flex:1}}
                onSelected={this.onSelectedDate.bind(this,tag)}
            />
                                <Image
                                style={{width:20,height:20}}
                                source={require('../../images/unfold.png')}/>
            </TouchableOpacity>
            </View>

            </View>
        )
    }
}

        renderItem() {

            var displayMemberInfo ='请选择通告接收人员'
             if (this.state.data.members) {
                 displayMemberInfo = '通告总人数'+this.state.data.members.length+'人'
             }
                  return(
                      <View>

                      {this.createEnter(require('../../images/informIcon.png'),'通告主题',this.state.data.subject,'subject')}
                      <View style={styles.line}>
                      </View>

                      {this.createChooseInfo(require('../../images/typesIcon.png'),'通告类型',this.state.data.category?this.state.data.category:'请选择通告类型',this.state.meetingTypeData,'category')}
                      <View style={styles.line}>
                      </View>



                      <EditItemView
                       topic={'通告部门'}
                       icon={require('../../images/department_icon.png')}
                       placeholder={'请输入通告发出部门'}
                       content={this.state.data.department}
                       onChangeText={this.onChangeText.bind(this,'department')}
                      />



                      {this.createEnter(require('../../images/participantIcon.png'),'通告接收人员',displayMemberInfo,'member')}
                      <View style={styles.line}>
                      </View>


                      <View style={styles.space}>
                      </View>
                      {this.createChooseInfo(null,'通告开始时间',this.state.data.startTime?Global.formatFullDateDisplay(this.state.data.startTime):'请选择通告开始时间',null,'startTime')}
                      <View style={styles.line}>
                      </View>
                      {this.createChooseInfo(null,'通告结束时间',this.state.data.endTime?Global.formatFullDateDisplay(this.state.data.endTime):'请选择通告结束时间',null,'endTime')}
                      <View style={styles.line}>
                      </View>
                      {this.createChooseInfo(null,'通告提醒时间',this.state.data.alarmTime?this.state.data.alarmTime:'请选择会前提醒时间',this.state.alertTimeArry,'alarmTime')}
                      <View style={styles.line}>
                      </View>



                      <TouchableOpacity onPress={this.onAddAttached.bind(this)} style={styles.flexContainer}>
                      <Image style={{width:24,height:24,}} source={require('../../images/enclosureIcon.png')} />

                      <Text style={[styles.content,{marginLeft:5,fontSize:14,color:'#1c1c1c'}]}>
                      附件
                      </Text>

                      <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end', alignItems: 'center',}}>

                      <Image style={{width:24,height:24,}} source={require('../../images/add_icon.png')} />

                      </View>


                      </TouchableOpacity>

                       {this.renderFileView()}

                      <View style={styles.space}>
                      </View>
                      <View style={styles.space}>
                      </View>

                      </View>

                  )


               }


               onAddAttached(){
                    this.onSelectFile(this.state.fileArr.length-1)
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
                    title={this.state.title}
                    leftIcon={require('../../images/back.png')}
                    leftPress={this.back.bind(this)}
                     />
                     <ScrollView
                     style={styles.mainStyle}>
                     {this.renderItem()}
                        </ScrollView>
                        {this.renderFormView()}
                        <Spinner
                            visible={this.state.loadingVisible}
                        />
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
           height: 48,
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
line: {
backgroundColor: '#f2f2f2',
width: width,
height: 1,
},
    divider: {
    backgroundColor: '#d6d6d6',
    width: width,
    height: 0.5,
    },

    cell: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
         flexDirection: 'column',
    },
    statisticsflexContainer: {
             height: 48,
             backgroundColor: '#ffffff',
             flexDirection: 'row',
             justifyContent: "center",
             alignItems: 'center',
             paddingRight:10
         },
})
