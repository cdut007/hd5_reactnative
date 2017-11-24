import React, {Component} from 'react';
import {View, Modal, Text, TouchableOpacity, Button} from 'react-native';
import Dimensions from 'Dimensions';

import SeparateComponent from './SeparateComponent';

var width = Dimensions.get('window').width;

/*
 *必须参数: content-提示内容 onCancel-左按钮点击执行函数 onConfirm-右按钮点击执行函数
 */

export default class ConfirmDialog extends Component{

	constructor(props){
		super(props);
	}

	render(){
		return(
			<Modal
				animationType={'fade'}
				transparent={true}
				visible={this.props.isShow}
				onRequestClose={function(){}}>

				<View style={{backgroundColor:'#0008',flex:1, alignItems:'center',justifyContent:'center'}}>
					<View style={{marginLeft:10, marginRight:10, width:width-20,height:160,backgroundColor:'#fff',borderRadius:6}}>
						<View style={{width:width,height:112,alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
							<Text style={{fontSize:20,color:'#000',textAlign:'center'}}>{this.props.content}</Text>
						</View>
						<SeparateComponent lineStyle={{backgroundColor:'#f2f2f2'}}/>
						<View style={{flexDirection:'row',flex:1,}}>
							<TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'center'}} onPress={() => this.props.onCancel()}><Text style={{fontSize:20,color:'#000'}}>取消</Text></TouchableOpacity>
							<View style={{backgroundColor:'#f2f2f2',width:0.5}} />
							<TouchableOpacity style={{flex:1,alignItems:'center',justifyContent:'center'}} onPress={() => this.props.onConfirm()}><Text style={{fontSize:20,color:'#108ee9'}}>确认</Text></TouchableOpacity>
						</View>
					</View>
				</View>

			</Modal>
		);
	}
}