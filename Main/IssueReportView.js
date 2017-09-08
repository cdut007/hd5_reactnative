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
    ScrollView
} from 'react-native';
import NavBar from '../common/NavBar'
import Dimensions from 'Dimensions'
import ModalDropdown from 'react-native-modal-dropdown'
import HttpRequest from '../HttpRequest/HttpRequest'
import DepartmentSelectView from '../common/DepartmentSelectView'
import ImagePicker from 'react-native-image-picker'
import Spinner from 'react-native-loading-spinner-overlay'



const REQUST_ISSUE_COMMIT_URL = '/hdxt/api/problem/add'
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
            fileArr: [],
            loadingVisible: false
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
        if (!this.state.responsePerson['id']) {
            alert('请选择解决人')
            return
        }

        if (!this.state.topic.length) {
            alert('请填写问题主题')
            return
        }

        if (!this.state.content.length) {
            alert('请填写问题描述')
            return
        }

        this.setState({
            loadingVisible: true
        })

        var param = new FormData()
        param.append('questionname', this.state.topic)
        param.append('describe', this.state.content)
        param.append('solverid', this.state.responsePerson['id'])
        param.append('rollingPlanId', this.props.data['id'])
        this.state.fileArr.map((item, i) => {
            if (item['fileSource']) {
                param.append('file' + i, { uri: item['fileSource'], name: item['fileName'], type: 'image/jpg' })
            }
        })
        console.log('~~~data' + JSON.stringify(param))

        HttpRequest.post(REQUST_ISSUE_COMMIT_URL, param, this.onCommitIssueSuccess.bind(this),
            (e) => {
                try {
                    alert(e)
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
        console.log('onCommitIssueSuccess:' + JSON.stringify(response))
        this.setState({
            loadingVisible: false
        })

        alert('问题提交成功')
        this.back()
    }

    onSellectFile(idx) {
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
                    var source = { uri: response.uri.replace('file://', ''), isStatic: true };

                    var fileInfo = this.state.fileArr[this.currentFileIdx]
                    fileInfo['fileSource'] = source.uri
                    fileInfo['fileName'] = response.fileName

                    this.setState({
                        ...this.state
                    });
                }
            });
        }


        showPicker()

    }

    onDeleteFile(idx) {
        this.state.fileArr.splice(idx, 1)

        this.setState({
            ...this.state
        })
    }

    onAddMore() {
        this.state.fileArr.push({})

        this.setState({
            ...this.state
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <NavBar title="问题反馈"
                    leftIcon={require('../images/back.png')}
                    leftPress={this.back.bind(this)} />
                <ScrollView>
                    {this.renderTopicView()}
                    {this.renderContentView()}
                    {this.renderFileView()}
                </ScrollView>
                <TouchableHighlight onPress={this.onCommit.bind(this)}
                    style={styles.commitButton}>
                    <Text style={{ color: '#ffffff', fontSize: 20, }} >
                        确认提交
                    </Text>
                </TouchableHighlight>
                <Spinner
                    visible={this.state.loadingVisible}
                />
            </View>
        )
    }

    renderTopicView() {
        return (
            <View style={{ flexDirection: "row", padding: 10, alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: 'lightgrey' }}>
                <Text>主题：</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'lightgray', borderWidth: 0.5, flex: 1, paddingLeft: 5, backgroundColor: 'white' }}
                    onChangeText={(text) => this.setState({ topic: text })}
                    value={this.state.topic}
                />

            </View>
        )
    }

    renderContentView() {
        return (
            <View style={{ width: width, padding: 10, borderBottomWidth: 0.5, borderBottomColor: 'lightgrey' }}>
                <Text style={{ marginBottom: 10 }}>问题描述</Text>
                <TextInput
                    style={{ height: 200, borderColor: 'lightgray', borderWidth: 0.5, paddingLeft: 5, backgroundColor: 'white', textAlignVertical: 'top' }}
                    multiline={true}
                    onChangeText={(text) => this.setState({ content: text })}
                    value={this.state.content}
                />
                <View style={{ flexDirection: "row", marginTop: 10, alignItems: 'center' }}>
                    <Text>解决人：</Text>
                    <DepartmentSelectView onSelected={(member) => { this.onSelectedMember(member) }} />
                </View>
            </View>
        )
    }

    renderFileView() {
        let addMore = this.state.fileArr.length >= 5 ? (<View />) :
            (<View style={{ flexDirection: "row", marginBottom: 10, marginTop: 10 }}>
                <TouchableHighlight onPress={this.onAddMore.bind(this)}
                    style={styles.addButton}>
                    <Text style={{ color: '#ffffff', fontSize: 16, }} >
                        继续添加
                    </Text>
                </TouchableHighlight>
            </View>)

        return (
            <View style={{ flexDirection: "row", width: width, padding: 10, borderBottomWidth: 0.5, borderBottomColor: 'lightgrey', alignItems: 'center' }}>
                <Text style={{ marginRight: 10 }}>文件：</Text>
                <View style={{ alignItems: 'flex-start', }}>
                    {this.state.fileArr.map((item, i) => {

                        let thumbnail = item['fileSource'] ? (
                            <View style={{ flexDirection: "row", alignItems: 'center', marginBottom: 10, }}>
                                <Image resizeMode={'cover'} style={{ width: 50, height: 50 }}
                                    source={{ uri: item['fileSource'] }}>
                                </Image>
                                <Text numberOfLines={1} style={{ color: 'lightgrey', fontSize: 12, width: 250, marginLeft: 10 }} >
                                    {item['fileName']}
                                </Text>
                            </View>) : (<View />)
                        return (
                            <View>
                                <View style={{ flexDirection: "row", marginBottom: 10, marginTop: 10 }}>
                                    <TouchableHighlight onPress={() => { this.onSellectFile(i) }}
                                        style={styles.addButton}>
                                        <Text style={{ color: '#ffffff', fontSize: 16, }} >
                                            选择文件
                                        </Text>
                                    </TouchableHighlight>
                                    <TouchableHighlight onPress={() => this.onDeleteFile(i)}
                                        style={styles.deleteButton}>
                                        <Text style={{ color: '#ffffff', fontSize: 16, }} >
                                            删除
                                        </Text>
                                    </TouchableHighlight>
                                </View>
                                {thumbnail}
                            </View>
                        )
                    })}
                    {addMore}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

    dropDown: {
        justifyContent: 'center',
        // flex: 1,
        width: 240,
        height: 36,
        backgroundColor: 'lightgrey',
        // marginRight: 20,
        borderColor: 'lightgray',
        borderWidth: 0.5,
    },
    dropDownList: {
        width: 240,
        borderColor: 'lightgray',
        borderWidth: 0.5,
    },
    commitButton:
    {
        // marginTop: 10,
        height: 50,
        width: width,
        backgroundColor: '#00a629',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButton:
    {
        height: 30,
        width: 80,
        marginRight: 20,
        backgroundColor: '#00a629',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton:
    {
        height: 30,
        width: 80,
        backgroundColor: 'red',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
})
