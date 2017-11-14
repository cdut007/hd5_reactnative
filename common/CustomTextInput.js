import React, { Component,PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Keyboard,
    TextInput,
    Platform

 } from 'react-native';

import Dimensions from 'Dimensions'
var width = Dimensions.get('window').width;

import ULTextInput from './ULEditText.js'

 export default class CustomTextInput extends Component
 {
     static propTypes =
     {
        content: PropTypes.string,
        topic: PropTypes.string,
        placeholder:PropTypes.string,
        onChangeText:PropTypes.func,
        keyboard : PropTypes.object,
        icon:PropTypes.string,
        editable:PropTypes.bool,
        autoFocus:PropTypes.bool,
    }

    constructor(props) {
        super(props)
    this.state = {
     keyboard : this.props.keyboard ? this.props.keyboard : "default",
     resetFoucs:false,
    }
    }



  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentDidMount(){

  }

  componentWillUnmount () {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
      if (this._input) {
          this._input.blur()
      }
  }

  _keyboardDidShow () {
    console.log('TTTTTinput Keyboard Shown');
  }

  _keyboardDidHide () {
    console.log('TTTTTinput Keyboard Hidden');
  }

  onFocus(){
      this.setState({...this.state})
      if (!this._input.isFocused()) {
          this._input.focus()
      }
      console.log('TTTTTinput text has foucesed--'+this._input.isFocused());
  }

    render()
    {
        if (Platform.OS == 'ios'){
            return(<TextInput
             ref={(c) => this._input = c}
             onFocus={this.onFocus.bind(this)}
             {...this.props}

            ></TextInput>)
        }else {
            return(<ULTextInput
             ref={(c) => this._input = c}
             onFocus={this.onFocus.bind(this)}
             {...this.props}

            ></ULTextInput>)
        }

    }
 }
