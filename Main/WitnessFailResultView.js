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
import HttpRequest from '../HttpRequest/HttpRequest'
import NavBar from '../common/NavBar'
var Global = require('../common/globals');

import DisplayItemView from '../common/DisplayItemView';
import DisplayMoreItemView from '../common/DisplayMoreItemView';

export default class WitnessFailResultView extends Component {
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
                    title="不合格详情"
                    leftIcon={require('../images/back.png')}
                    leftPress={this.back.bind(this)} />
                    <ScrollView
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps={false}
                    style={styles.main_container}>
                    <DisplayItemView
                     title={'不合格类别'}
                     detail={this.props.data.failType}
                    />
                    <DisplayMoreItemView
                     title={'不合格原因'}
                     detail={this.props.data.remark}
                    />
                    {this.renderFiles()}
                </ScrollView>
            </View>
        )
    }

    renderFiles(){
        return (
            <ScrollView horizontal={true} style={{marginTop: 10, marginBottom: 10}}>
              {this.renderNetImages(this.props.data.witnessFiles, true)}
            </ScrollView>
        );
        //this.props.data.witnessFiles[0].url   /hdxt/api/files/witness/_201709271313591506489239761.jpg
        //this.props.data.witnessFiles[0].fileName
    }


        renderNetImages(files,isFeedback){
          var images = [];
          if(files){

            files.map((item, i) => {
                console.log('url====='+(HttpRequest.getDomain()+ item.url))
              images.push(
                <TouchableOpacity key={'net' + i} onPress={() => this.viewBigImages(isFeedback, i)}>
                     <ImageBackground style={{width: 70, height: 70, marginLeft: 10}} source={require('../images/temporary_img.png')}>
                  <Image source={{uri: HttpRequest.getDomain()+ item.url }} style={{borderRadius: 4, width: 70, height: 70, resizeMode: 'cover', marginLeft: 10,}}/>
                  </ImageBackground>
                </TouchableOpacity>
              );
            });
        }else{
            console.log('can not find filesss')
        }
          return images;
        }

        viewBigImages(isFeedback, index){
          var imageUrls = [];

          this.props.data.witnessFiles.map((item) => {imageUrls.push({url: HttpRequest.getDomain()+ item.url})});

          this.setState({modalVisible: true, bigImages: imageUrls, currentImageIndex: index})
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
