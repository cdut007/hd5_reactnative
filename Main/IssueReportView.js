import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    TouchableOpacity,
    Platform,
    Picker,
    TouchableNativeFeedback,
    TouchableHighlight,
    ScrollView,
    DeviceEventEmitter,
} from 'react-native';
import NavBar from '../common/NavBar'
import Dimensions from 'Dimensions'
import HttpRequest from '../HttpRequest/HttpRequest'
import DepartmentSelectView from '../common/DepartmentSelectView'
import ImagePicker from 'react-native-image-picker'
import Spinner from 'react-native-loading-spinner-overlay'
import DisplayItemView from '../common/DisplayItemView'
import MemberSelectView from '../common/MemberSelectView'
import Global from '../common/globals.js'

const MAX_IMAGE_COUNT = 5;
const REQUST_ISSUE_COMMIT_URL = '/question/create'
var width = Dimensions.get('window').width;
var issueTypes = ['技术问题','协调问题','物项问题'];
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

export default class IssueReportView extends Component {

    constructor(props) {
        super(props)

        this.state = {
            topic: '',
            content: '',
            responsePerson: {},
            fileArr: [{}],
            loadingVisible: false,
            plan_data: this.props.data,
            issueType: '选择问题类型',
        }
    }


    componentDidMount() {

    }

    back() {
        this.props.navigator.pop()
    }

    onSelectedMember(member) {
        console.log('onSelectedMember' + JSON.stringify(member))
        this.setState({
            responsePerson: member
        })
    }


    onCommit() {
        if (this.state.issueType=='选择问题类型') {
            Global.alert('请选择问题类型')
            return
        }

        if (!this.state.content.length) {
            Global.alert('请填写问题描述')
            return
        }

        if(this.state.fileArr.length<=1){
            Global.alert('请选择至少一张问题图片');
            return;
        }

        this.setState({
            loadingVisible: true
        })

        var param = new FormData()
        let type = '';
        if(this.state.issueType == issueTypes[0]){
            type = 'technicalMatters';
        }else if(this.state.issueType == issueTypes[1]){
            type = 'coordinationProblem';
        }else{
            type = 'resourceMatters';
        }
        param.append('questionType', type);
        param.append('describe', this.state.content)
        param.append('rollingPlanId', this.props.data['id'])
        this.state.fileArr.map((item, i) => {
            if (item['fileSource']) {
               let file = {uri: item['fileSource'], type: 'multipart/form-data', name: item['fileName']};   //这里的key(uri和type和name)不能改变,
               param.append("file",file);   //这里的files就是后台需要的key
            }
        });

        HttpRequest.uploadImage(REQUST_ISSUE_COMMIT_URL, param, this.onCommitIssueSuccess.bind(this),
            (e) => {
                try {
                    Global.alert(e)
                }
                catch (err) {
                    console.log(err)
                }

                this.setState({
                    loadingVisible: false
                })
            })
    }


    onCommitIssueSuccess(response) {
       DeviceEventEmitter.emit('new_issue','new_issue');
       console.log('onCommitIssueSuccess:' + JSON.stringify(response))
        this.setState({
            loadingVisible: false
        })
        let destinateRoute;
        const routers = this.props.navigator.getCurrentRoutes();
        for(let i = routers.length - 1; i >= 0; i--){
            if(routers[i].name == 'ModuleTabView'){
                destinateRoute = routers[i];
            }
        }
        if(destinateRoute){
          this.props.navigator.popToRoute(destinateRoute);
        }else{
            this.back();
        }
    }

    onSelectFile(idx) {

        this.currentFileIdx = idx

        let showPicker = () => {
            ImagePicker.showImagePicker(options, (response) => {
                //   console.log('Response = ', response);
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                }
                else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                }
                else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
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

    render() {
        return (
            <View style={styles.container}>
                <NavBar title="创建问题"
                    leftIcon={require('../images/back.png')}
                    leftPress={this.back.bind(this)} />
                <ScrollView>
                    {this.renderItem()}
                    {this.renderSelectView()}
                    <View style={{backgroundColor: 'white', width: width, height: 150, paddingTop: 10, paddingLeft: 10,}}>
                        <Text style={{color: '#1c1c1c', fontSize: 14}}>问题描述:</Text>
                        <TextInput
                            style={{flex: 1, fontSize: 14, color: '#1c1c1c', padding: 5, textAlignVertical: 'top',}}
                            underlineColorAndroid ='transparent'
                            maxLength = {150}
                            multiline = {true}
                            onChangeText={(text) => this.setState({ content: text })}
                            value={this.state.content} />
                    </View>
                    {this.renderFileView()}
                </ScrollView>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.onCommit.bind(this)}
                    style={styles.commitButton}>
                    <Text style={{ color: '#ffffff', fontSize: 20, }} >
                        提交
                    </Text>
                </TouchableOpacity>
                <Spinner
                    visible={this.state.loadingVisible}
                />
            </View>
        )
    }

    renderItem() {
               // 数组
               var itemAry = [];
               // 颜色数组
               var displayAry = [
               {title:'施工日期',content:this.state.plan_data.weldno,id:'0',noLine:true},
               {title:'工程量编号',content:this.state.plan_data.projectNo,id:'1',noLine:true},
               {title:'焊口/支架',content:this.state.plan_data.weldno,id:'2',noLine:true},
               {title:'工程量类别',content:this.state.plan_data.projectType,id:'3',noLine:true},
               {title:'作业条目编号',content:this.state.plan_data.workListNo,id:'4',noLine:true},
            ];

               // 遍历
               for (var i = 0; i<displayAry.length; i++) {
                if (displayAry[i].type == 'devider') {
                       itemAry.push(
                          <View style={styles.divider}/>
                       );
                   }else{
                       itemAry.push(
                           <DisplayItemView key={displayAry[i].id}
                            title={displayAry[i].title}
                            detail={displayAry[i].content}
                            noLine={displayAry[i].noLine}
                           />
                       );
                   }

               }
               return itemAry;
    }

    renderSelectView() {
        return(
            <View style={{alignItems:'center',padding:10,backgroundColor:'#f2f2f2', width: width,  height: 56}}>

                <TouchableOpacity onPress={() => this._selectM.onPickClick()} style={{
                      borderWidth:0.5,
                      alignItems:'center',
                      borderColor : '#f77935',
                      backgroundColor : 'white',
                      borderRadius : 4,
                      flexDirection:'row',
                      flex: 1,
                      paddingLeft:10,
                      paddingRight:10,
                      paddingTop:8,
                      paddingBottom:8}}>

                    <MemberSelectView
                    ref={(c) => this._selectM = c}
                     style={{color:'#f77935',fontSize:14,flex:1}}
                     title={this.state.issueType}
                     data={issueTypes}
                     pickerTitle={'问题类型'}
                     onSelected={(data) => this.onSelectedType(data)}/>

                    <Image style={{width:20,height:20,}} source={require('../images/unfold.png')}/>

                </TouchableOpacity>

            </View>

        )
    }

    onSelectedType(data){
        this.setState({issueType: data[0]})
    }


    renderFileView() {
        return (
            <View style={{flexDirection: 'row', flexWrap: 'wrap', width: width, paddingTop: 10, paddingRight: 10}} horizontal={true} >
                    {this.renderImages()}
            </View>
        )
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
                            (<Image resizeMode={'cover'} style={{ width: 70, height: 70, borderRadius: 4, borderWidth: 0.5}} source={require('../images/add_pic_icon.png')} />)
                        }
                    </TouchableOpacity>
                );
        })}
        if(this.state.fileArr[this.state.fileArr.length-1]['fileSource'] && this.state.fileArr.length < MAX_IMAGE_COUNT){
                this.state.fileArr.push({});
            }
        return imageViews;
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
    },
    commitButton:
    {
        // marginTop: 10,
        height: 50,
        width: width,
        backgroundColor: '#f77935',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
})
