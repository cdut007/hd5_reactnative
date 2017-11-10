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

import RNFetchBlob from 'react-native-fetch-blob'
import ImageViewer from 'react-native-image-zoom-viewer';
import Dimensions from 'Dimensions';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
import HttpRequest from '../../HttpRequest/HttpRequest'
import NavBar from '../../common/NavBar'
var Global = require('../../common/globals');
const android = RNFetchBlob.android

import DisplayItemView from '../../common/DisplayItemView';
import DisplayMoreItemView from '../../common/DisplayMoreItemView';

export default class FileResultView extends Component {
    constructor(props) {
        super(props)
        this.state = {

            modalVisible: false,
            bigImages: [],
            currentImageIndex: 0,
        };
    }


    back() {
        this.props.navigator.pop()
    }




    render() {
        return (
            <View style={styles.container}>
            <Modal visible={this.state.modalVisible} transparent={true} onRequestClose={function(){}} animationType={'fade'}>
              <ImageViewer imageUrls={this.state.bigImages} onClick={()=>{this.setState({modalVisible: false})}} index={this.state.currentImageIndex} />
            </Modal>
                <NavBar
                    title="附件详情"
                    leftIcon={require('../../images/back.png')}
                    leftPress={this.back.bind(this)} />
                    <ScrollView
                    keyboardDismissMode='on-drag'

                    style={styles.main_container}>
                    <DisplayItemView
                     title={'附件'}
                     detail={this.props.data.failType}
                    />
                    {this.renderFiles()}
                </ScrollView>
            </View>
        )
    }

    renderFiles(){
        return (
            <ScrollView horizontal={true} style={{marginTop: 10, marginBottom: 10}}>
              {this.renderNetImages(this.props.data.files, true)}
            </ScrollView>
        );
        //this.props.data.witnessFiles[0].url   /hdxt/api/files/witness/_201709271313591506489239761.jpg
        //this.props.data.witnessFiles[0].fileName
    }


        renderNetImages(files,isFeedback){
          var images = [];
          if(files){

            files.map((item, i) => {
                var filePath = item.url
                var fileName = Global.getFileName(filePath)
                var fileExt = Global.getFileExtension(fileName)
                var fileType = 'file'
                if (Global.checkImgType(fileExt)) {
                    fileType = 'image'
                }

                Global.log('filePath: '+ filePath+";fileName="+fileName+";fileExt="+fileExt+";fileType="+fileType);

                Global.log('url====='+(HttpRequest.getDomain()+ item.url))
                if (fileType!='image') {
                    images.push(
                      <TouchableOpacity key={'net' + i} onPress={() => this.viewFile(fileName,HttpRequest.getDomain()+ item.url)}>
                      <View style={{backgroundColor:'#ffffff',width: 70, height: 70, borderRadius: 4, borderWidth: 0.5}}>
                          <Image resizeMode={'cover'} style={{ width: 16, height: 16}} source={require('../../images/enclosureIcon.png')} />
                          <Text style={{ fontSize:10}} >{fileName}</Text>
                          </View>
                      </TouchableOpacity>
                    );

                }else{
                    images.push(
                      <TouchableOpacity key={'net' + i} onPress={() => this.viewBigImages(isFeedback, i)}>
                       <ImageBackground style={{width: 70, height: 70, marginLeft: 10}} source={require('../../images/temporary_img.png')}>
                        <Image source={{uri: HttpRequest.getDomain()+ item.url }} style={{borderRadius: 4, width: 70, height: 70, resizeMode: 'cover', marginLeft: 10,}}/>
                        </ImageBackground>
                      </TouchableOpacity>
                    );
                }

            });
        }else{
            Global.log('can not find filesss')
            images.push(
                <Text style={[styles.content,{marginLeft:5,fontSize:14,color:'#1c1c1c'}]}>
                无附件
                </Text>
            );
        }
          return images;
        }

        viewBigImages(isFeedback, index){
          var imageUrls = [];

          this.props.data.files.map((item) => {imageUrls.push({url: HttpRequest.getDomain()+ item.url})});

          this.setState({modalVisible: true, bigImages: imageUrls, currentImageIndex: index})
        }

        viewFile(fileName,url){
            let path = RNFetchBlob.fs.dirs.DownloadDir + '/'+fileName

            RNFetchBlob.fs.exists(path)
               .then((exist) => {
                  if (exist) {
                       android.actionViewIntent(path, 'application/vnd.android.package-archive')
                  }else{
                      RNFetchBlob.config({
                      addAndroidDownloads : {
                        useDownloadManager : true,
                        title : fileName,
                        path: path,
                        description : '查看文件',
                        mime : 'application/vnd.android.package-archive',
                        mediaScannable : true,
                        notification : true,
                      }
                    })
                    .fetch('GET', url)
                    .then((res) => {
                        android.actionViewIntent(res.path(), 'application/vnd.android.package-archive')
                    })
                  }
               })
               .catch(() => {
                   console.log('error while checking file for exists');
               });

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

})
