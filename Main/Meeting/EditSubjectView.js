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


import CommitButton from '../../common/CommitButton'
import NavBar from '../../common/NavBar'
import Dimensions from 'Dimensions'
import LoginView from '../../Login/LoginView'
var Global = require('../../common/globals');
var width = Dimensions.get('window').width;

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
                          <TextInput
                              style={{flex: 1, fontSize: 14, color: '#1c1c1c', padding: 5, textAlignVertical: 'top',}}
                              underlineColorAndroid ='transparent'
                              editable={false}
                              maxLength = {150}
                              multiline = {true}
                              onChangeText={(text) => this.setState({ content: text })}
                              value={this.state.content} />
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
                         topic={'所属项目'}
                         
                         icon={require('../../images/projectIcon.png')}
                         placeholder={'请输入所属项目名称'}
                         content={this.state.subject}
                        onChangeText={(text) => this.setState({ subject: text })}
                        />

                        <View style={{backgroundColor: 'white', width: width, height: 150, paddingTop: 10, paddingLeft: 10,}}>
                          <Text style={{color: '#1c1c1c', fontSize: 14}}>正文:</Text>
                          <TextInput
                              style={{flex: 1, fontSize: 14, color: '#1c1c1c', padding: 5, textAlignVertical: 'top',}}
                              underlineColorAndroid ='transparent'
                              maxLength = {150}
                              multiline = {true}
                              onChangeText={(text) => this.setState({ content: text })}
                              value={this.state.content} />
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
})
