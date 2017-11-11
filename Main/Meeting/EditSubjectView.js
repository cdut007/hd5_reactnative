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
    ScrollView
} from 'react-native';

import CustomTextInput from '../../common/CustomTextInput'
import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';
import CommitButton from '../../common/CommitButton'
import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions'
import LoginView from '../../Login/LoginView'
var Global = require('../../common/globals');
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
import DisplayItemView from '../../common/DisplayItemView';

import DisplayMoreItemView from '../../common/DisplayMoreItemView';

import EditItemView from '../../common/EditItemView';
const dismissKeyboard = require('dismissKeyboard');


export default class EditSubjectView extends Component {
    constructor(props) {
        super(props)
        var title = "编辑会议内容"
        if (this.props.scan) {
            title = "查看会议内容"
        }
        if (this.props.notice) {
            title = "编辑通告内容"
           if (this.props.scan) {
               title = "查看通告内容"
           }
        }
        this.state = {
            subject: this.props.data.subject,
            content:this.props.data.content,
            title:title,
        }

        this.getHTML = this.getHTML.bind(this);
        this.setFocusHandlers = this.setFocusHandlers.bind(this);
    }


    back() {
        dismissKeyboard();
        this.props.navigator.pop()

    }

  saveTopic(){
      this.props.data.subject = this.state.subject
      this.props.data.content = this.state.content
      this.props.refresh();
      this.back()
  }

  onEditorInitialized() {
   this.setFocusHandlers();
   this.getHTML();
 }

 async getHTML() {
   const titleHtml = await this.richtext.getTitleHtml();
   const contentHtml = await this.richtext.getContentHtml();
   //alert(titleHtml + ' ' + contentHtml)
 }

 setFocusHandlers() {
   this.richtext.setTitleFocusHandler(() => {
     //alert('title focus');
   });
   this.richtext.setContentFocusHandler(() => {
     //alert('content focus');
   });
 }



    render() {
        if (this.props.scan) {
            return (
                <View style={styles.container}>
                    <NavBar
                        title={this.state.title}
                        leftIcon={require('../../images/back.png')}
                        leftPress={this.back.bind(this)} />
                        <ScrollView
                        style={styles.mainStyle}>
                        <DisplayItemView
                         title={'主题'}
                         detail={this.state.subject}
                        />

                        <View style={{backgroundColor: 'white', width: width, height: 150, paddingTop: 10, paddingLeft: 10,}}>
                          <Text style={{color: '#1c1c1c', fontSize: 14}}>正文:</Text>
                          <CustomTextInput
                              style={{flex: 1, fontSize: 14, color: '#1c1c1c', padding: 5, textAlignVertical: 'top',}}
                              underlineColorAndroid ='transparent'
                              editable={false}
                              maxLength = {150}
                              multiline = {true}
                              onChangeText={(text) => this.setState({ content: text })}
                              value={this.state.content} />

                              {/* <RichTextEditor
                                 ref={(r)=>this.richtext = r}
                                 style={styles.richText}
                                 initialTitleHTML={'Title!!'}
                                 initialContentHTML={'Hello <b>World</b> <p>this is a new paragraph</p> <p>this is another new paragraph</p>'}
                                 editorInitializedCallback={() => this.onEditorInitialized()}
                             />
                             <RichTextToolbar
                               getEditor={() => this.richtext}
                             /> */}
                        </View>

                        </ScrollView>
                        {this.renderFormView()}

                </View>
            )
        }else{
            return (
                <View style={styles.container}>
                    <NavBar
                        title={this.state.title}
                        leftIcon={require('../../images/back.png')}
                        leftPress={this.back.bind(this)} />
                        <ScrollView
                        style={styles.mainStyle}>
                        <EditItemView
                         topic={'主题'}

                         icon={require('../../images/informIcon.png')}
                         placeholder={'请输入主题'}
                         maxLength = {20}
                         content={this.state.subject}
                        onChangeText={(text) => this.setState({ subject: text })}
                        />

                        <View style={{backgroundColor: 'white', width: width, height: height-170, paddingTop: 10,}}>
                          <Text style={{marginLeft: 10,color: '#1c1c1c', fontSize: 14}}>正文:</Text>
                          <CustomTextInput
                              style={{flex: 1,marginLeft: 10, fontSize: 14, color: '#1c1c1c', padding: 5, textAlignVertical: 'top',}}
                              underlineColorAndroid ='transparent'
                              maxLength = {150}
                              multiline = {true}
                              onChangeText={(text) => this.setState({ content: text })}
                              value={this.state.content} />

                              {/* <RichTextEditor
                                 ref={(r)=>this.richtext = r}
                                 style={{flex:1,width:width,}}
                                 initialTitleHTML={''}
                                 initialContentHTML={''}
                                 editorInitializedCallback={() => this.onEditorInitialized()}
                             />
                             <RichTextToolbar
                               getEditor={() => this.richtext}
                             /> */}
                        </View>

                        </ScrollView>
                        {this.renderFormView()}

                </View>
            )
        }


    }

    renderFormView(){
        if (this.props.scan) {
            return
        }
        return(<View style={{height:50,width:width,flexDirection:'row'}}>
        <View  style={{height:50,flex:1}}><CommitButton title={'保存'}
        onPress={this.saveTopic.bind(this)}
                ></CommitButton></View>
                        </View>)
    }


}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
    },
    mainStyle: {
   flex: 1,
 },
})
