import React, {Component} from 'react';
import {
	View,
	TextInput,
	Keyboard,
	Platform,
    TouchableOpacity,
    Image,
    DeviceEventEmitter
} from 'react-native';
import Global from '../common/globals.js'
import Dimensions from 'Dimensions'
import HttpRequest from '../HttpRequest/HttpRequest'
import ImagePicker from 'react-native-image-picker'
import Spinner from 'react-native-loading-spinner-overlay'
import NavBar from '../common/NavBar';
import CommitButton from '../common/CommitButton';
const MAX_IMAGE_COUNT = 5;
var width = Dimensions.get('window').width;
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
    quality: 0.5, // photos only
    angle: 0, // photos only
    allowsEditing: false, // Built in functionality to resize/reposition the image
    noData: true, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
    storageOptions: { // if this key is provided, the image will get saved in the documents/pictures directory (rather than a temporary directory)
        skipBackup: true, // image will NOT be backed up to icloud
        path: 'images' // will save image at /Documents/images rather than the root
    }
};
export default class IssueReject extends Component{

	constructor(props){
		super(props);
		this.state = {
			message: '',
            fileArr: [{}],
            loadingVisible:false
		}
	}

	render(){
	    if (this.props.title =='退回理由'){
            return(
                <View style = {{flex: 1, flexDirection: 'column', backgroundColor:'#f2f2f2'}}>
                    <NavBar
                        title = {this.props.title}
                        leftIcon={require('../images/back.png')}
                        leftPress={this.back.bind(this)} />
                    <View style={{backgroundColor: 'white', width: width, height: 150, paddingTop: 10, paddingLeft: 10,}}>
                        <TextInput
                            style = {{flex: 1, fontSize: 16, color: '#1b1b1b', textAlignVertical: 'top'}}
                            underlineColorAndroid = 'transparent'
                            multiline = {true}
                            onChangeText = {(text) => this.setState({message: text})}
                            placeholder = {this.props.placeholder}
                            placeholderTextColor = '#777777'/>

                    </View>
                    {this.renderFileView()}

                    <View style={{height:50,width:width,alignSelf:'flex-end',position:'absolute',bottom:0}}>
                        <CommitButton
                            containerStyle = {{width:width}}

                            title = {this.props.buttonTitle}
                            onPress = {() => this.confirm()} />
                    </View>
                    <Spinner
                        visible={this.state.loadingVisible}
                    />

                </View>
            );
        }else {
            return(
                <View style = {{flex: 1, flexDirection: 'column', backgroundColor:'#f2f2f2'}}>
                    <NavBar
                        title = {this.props.title}
                        leftIcon={require('../images/back.png')}
                        leftPress={this.back.bind(this)} />
                    <TextInput
                        style = {{flex: 1, fontSize: 16, color: '#1b1b1b', textAlignVertical: 'top'}}
                        underlineColorAndroid = 'transparent'
                        multiline = {true}
                        onChangeText = {(text) => this.setState({message: text})}
                        placeholder = {this.props.placeholder}
                        placeholderTextColor = '#777777'/>
                    <CommitButton
                        containerStyle = {{flex: 0}}
                        title = {this.props.buttonTitle}
                        onPress = {() => this.confirm()} />
                </View>
            );

        }

	}
    renderFileView() {
        return (
			<View style={{flexDirection: 'row', flexWrap: 'wrap', width: width, paddingTop: 10, paddingRight: 10}} horizontal={true} >
                {this.renderImages()}
			</View>
        )
    }


	back(){
		this.props.navigator.pop()
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
	confirm(){
		Keyboard.dismiss();
		if(this.state.message == ''){
			alert(this.props.placeholder);
			return;
		}
        // if (!this.state.fileArr[this.state.fileArr.length-1]['fileSource']){
        //     alert("请添加照片附件");
        //     return;
        // }
		if(this.props.title == '退回理由') {
            this.setState({
                loadingVisible: true
            })
            var param = new FormData()

            param.append('answer','unsolved');
            param.append('reason', this.state.message)
            param.append('questionId', this.props.questionId)
            this.state.fileArr.map((item, i) => {
                if (item['fileSource']) {
                    let file = {uri: item['fileSource'], type: 'multipart/form-data', name: item['fileName']};   //这里的key(uri和type和name)不能改变,
                    param.append("file",file);   //这里的files就是后台需要的key
                }
            });
            //测试代码
            // Global.alert(JSON.stringify(param));
            //
            // DeviceEventEmitter.emit('operate_issue','operate_issue');
            // this.setState({
            //     loadingVisible: false
            // })
            // let destinateRoute;
            // const routers = this.props.navigator.getCurrentRoutes();
            // for(let i = routers.length - 1; i >= 0; i--){
            //     if(routers[i].name == 'ModuleTabView'){
            //         destinateRoute = routers[i];
            //     }
            // }
            // if(destinateRoute){
            //     this.props.navigator.popToRoute(destinateRoute);
            // }else{
            //     this.back();
            // }
            //测试代码
            HttpRequest.uploadImage('/question/answer', param, this.onCommitIssueSuccess.bind(this),
                (e) => {
                    try {
                        Global.alert(e)
                    }
                    catch (err) {
                        Global.log(err)
                    }

                    this.setState({
                        loadingVisible: false
                    })
                })

        }else {
            this.props.callback(this.state.message);

            this.props.navigator.pop();


        }


	}
    onCommitIssueSuccess(response){
         // Global.log('onCommitIssueSuccess88:' + JSON.stringify(response))
        DeviceEventEmitter.emit('operate_issue','operate_issue');
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
}