import React, { Component,PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Keyboard,
    TextInput,
    Platform,
    TouchableOpacity,
    DeviceEventEmitter

 } from 'react-native';

import Dimensions from 'Dimensions'
var width = Dimensions.get('window').width;
import Picker from 'react-native-picker';
//import ULTextInput from './ULEditText.js'
var ULTextInput = TextInput;
 export default class EditAddressItemView extends Component
 {
     static propTypes =
     {
        content: PropTypes.string,
        topic: PropTypes.string,
        placeholder:PropTypes.string,
        onChangeText:PropTypes.func,
        onVauleChanged:PropTypes.func,
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
    this.showTimePicker = DeviceEventEmitter.addListener('show_timePicker',this._keyboardDidShow);

  }

  componentDidMount(){

  }

  componentWillUnmount () {
          Picker.hide();
      if (this._input) {
          this._input.blur()
      }
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.showTimePicker.remove();
  }

  _keyboardDidShow () {
    console.log('Keyboard Shown');
  }

  _keyboardDidHide () {
    console.log('Keyboard Hidden');
  }

  onFocus(){
      this.setState({...this.state})
      if (!this._input.isFocused()) {
          this._input.focus()
      }
      console.log('input text has foucesed--'+this._input.isFocused());
  }

  // renderItem(data){
  //     var items = []
  //     for (var i = 0; i < data.length; i++) {
  //         items.push(<Picker.Item label={data[i]} value={data[i]} />)
  //     }
  //     return items
  // }

  onAddressPress(){
      this.setState({picker:true})
      this.onPickClick()
  }


  onPickClick(){
      if (!this.props.chooseData || this.props.chooseData.length  == 0 ) {
          return
      }


      Picker.init({
     pickerData: this.props.chooseData,
     pickerTitleText:this.props.pickerTitle,
     pickerConfirmBtnText:'保存',
     pickerCancelBtnText:'取消',
     onPickerConfirm: data => {
         console.log(data);
         this.props.onVauleChanged(data[0])
     },
     onPickerCancel: data => {
         console.log(data);
     },
     onPickerSelect: data => {
         console.log(data);
     }
 });
 Picker.show();
  }

  renderPicker(){

//       if (this.state.picker && this.props.chooseData) {
//           return(<Picker
//               selectedValue={this.props.selectedValue}
//               onValueChange={value=>this.onChooseItem(value)}>
//               {this.renderItem(this.props.chooseData)}
// </Picker>
// )
//       }
  }

    render()
    {
        if (Platform.OS == 'ios'){

            return(
                <View>
                <View style= {styles.container}>
                <TouchableOpacity onPress={this.onAddressPress.bind(this)}
                    style={styles.btn}>
                    <Text style={styles.title} >
                        {this.props.topic} :
                </Text>
                </TouchableOpacity>
                    <TextInput style= {styles.detail}
                    onChangeText={this.props.onChangeText}
                    underlineColorAndroid={'transparent'}
                     underlineColorAndroid='transparent'
                     placeholder={this.props.placeholder}
                    value={this.props.content}
                    keyboardType={this.state.keyboard}

                    ></TextInput>
                </View>
                <View style={styles.divider}/>
                </View>
            )
        }else {

            return(
                <View>
                <View style= {styles.container}>
                <TouchableOpacity onPress={this.onAddressPress.bind(this)}
                    style={styles.btn}>
                    <Text style={styles.title} >
                        {this.props.topic} :
                </Text>
                </TouchableOpacity>
                    <ULTextInput  ref={(c) => this._input = c}
                     {...this.props}
                     style= {styles.detail}
                    onChangeText={this.props.onChangeText}
                    underlineColorAndroid={'transparent'}
                     underlineColorAndroid='transparent'
                     placeholder={this.props.placeholder}
                    value={this.props.content}
                    keyboardType={this.state.keyboard}
                    editable={this.props.editable}
                    autoFocus={this.props.autoFocus}
                    onFocus={this.onFocus.bind(this)}
                    onSubmitEditing={Keyboard.dismiss}

                    ></ULTextInput>
                </View>
                {this.renderPicker()}
                <View style={styles.divider}/>
                </View>
            )
        }

    }
 }

const styles = StyleSheet.create({
    btn:
    {
        flexDirection:'row',
        width: 90,
        alignSelf: 'center',
        margin: 4,
        height: 30,
        borderColor: '#0755a6',
        borderWidth: 1,
        borderRadius: 3,
        justifyContent:'center',
        backgroundColor:'#0755a6',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        paddingLeft:10,
        paddingRight:10,
        paddingTop:6,
        backgroundColor:'#ffffff',
        paddingBottom:6,
        height: 50,
        alignItems: 'center',
    },
    title: {

        fontSize: 14,
        color: "white"
    },
    title_with_icon: {
        width: width * 0.24,
        fontSize: 14,
        color: "#1c1c1c"
    },
    detail: {
        fontSize: 14,
        color: "#666",
        borderColor: 'lightgray', borderWidth: 0.5, flex: 1, paddingLeft: 5, backgroundColor: 'white'
    },
    divider: {
    backgroundColor: '#8E8E8E',
    width: width,
    height: 0.5,
},
});
