import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
    DeviceEventEmitter,
    Keyboard
} from 'react-native';

 import Picker from 'react-native-picker';


export default class MemberSelectView extends Component {
    static propTypes =
    {
        type: PropTypes.string,  //'date', 'time', 'datetime'
        onSelected: PropTypes.func,
        title:PropTypes.string,
    }

    constructor(props) {
        super(props)
        // if (!this.props.type) {
        //     this.props.type = 'date'
        // }

        this.state = {
            isDateTimePickerVisible: false
        }
    }


    onSelectedData(data) {
        console.log('A data has been picked: ', data);
        this.props.onSelected(data)
        this.setState({
            currentData: data,
            isPickerVisible: false
        })
    }


      _keyboardDidShow () {
        Picker.hide();
      }

      _keyboardDidHide () {
        // alert('Keyboard Hidden');
      }

    componentWillUnmount(){

        Picker.hide();
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        this.showTimePicker.remove();

    }

    componentWillMount(){
            //监听键盘弹出事件
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
      this.showTimePicker = DeviceEventEmitter.addListener('show_timePicker',this._keyboardDidShow);
    }


    onPickClick(){
        if (!this.props.data || this.props.data.length  == 0 ) {
            return
        }
        this.setState({ isPickerVisible: true })
        Picker.init({
       pickerData: this.props.data,
       pickerTextEllipsisLen:300,
       pickerTitleText:this.props.pickerTitle,
       pickerConfirmBtnText:'保存',
       pickerCancelBtnText:'取消',
       onPickerConfirm: data => {
           console.log(data);
           this.onSelectedData(data);
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

    render() {
        // if (this.props.visible) {
        //     this.setState({ isDateTimePickerVisible: true })
        //
        // }
        return (
            <View style={[styles.container]}>
                <TouchableOpacity style = {{alignItems: 'center', justifyContent: 'center'}} onPress={this.onPickClick.bind(this)}>
                    <Text style={[this.props.style]}>{this.props.title}</Text>
                </TouchableOpacity>

            </View>
        )
    }

}

//字段显示菜单项过长导致显示...


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf:'stretch',
        flex:1
    },
})
