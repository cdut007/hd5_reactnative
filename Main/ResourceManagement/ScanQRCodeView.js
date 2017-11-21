import React, { Component } from 'react';
import {View, Image, Text} from 'react-native';

import NavBar from '../../common/NavBar';
import Dimensions from 'Dimensions';
import QRCodeView from 'react-native-camera';

var width = Dimensions.get('window').width;

export default class ScanQRCodeView extends Component{
	render(){
		return(
			<View style = {{flex: 1, flexDirection: 'column',}} >
				<NavBar
					style = {{backgroundColor: '#1b1612'}}
					titleStyle = {{color: '#ffffff'}}
					lineStyle = {{backgroundColor: '#1b1612'}}
					title = {'二维码'}
					leftIcon = {require('../../images/white_back_icon.png')}
					leftPress = {this.back.bind(this)} />
				<QRCodeView
					style = {{flex: 1, alignItems: 'center', justifyContent: 'center'}}
					onBarCodeRead = {(e) => this.onBarCodeReceived(e)}>
					<Image
						source = {require('../../images/discern_icon.png')}
						style = {{width: width*0.7, height: width*0.7}} />
					<Text style = {{fontSize: 14, color: '#f77935', marginTop: 20}}>
						自动识别，支持以下物项业务处理
					</Text>
				</QRCodeView>
				<View style = {{width: width, height: 80, backgroundColor: '#1b1612', flexDirection: 'row'}}>
					<View style = {{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
						<Image 
							style = {{width: 36, height: 36}}
							source = {require('../../images/storage_icon.png')} />
						<Text style = {{color: '#9e9d9c', fontSize: 12}}>单/批量入库</Text>
					</View>
					<View style = {{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
						<Image 
							style = {{width: 36, height: 36}}
							source = {require('../../images/output_icon.png')} />
						<Text style = {{color: '#9e9d9c', fontSize: 12}}>单/批量出库</Text>
					</View>
					<View style = {{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
						<Image 
							style = {{width: 36, height: 36}}
							source = {require('../../images/return_icon.png')} />
						<Text style = {{color: '#9e9d9c', fontSize: 12}}>退库处理</Text>
					</View>
					<View style = {{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
						<Image 
							style = {{width: 36, height: 36}}
							source = {require('../../images/stock_icon.png')} />
						<Text style = {{color: '#9e9d9c', fontSize: 12}}>库存查询</Text>
					</View>
					<View style = {{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
						<Image 
							style = {{width: 36, height: 36}}
							source = {require('../../images/delivery_record_icon.png')} />
						<Text style = {{color: '#9e9d9c', fontSize: 12}}>出库记录</Text>
					</View>
				</View>
			</View>
		);
	}

	back(){
		this.props.navigator.pop();
	}

	onBarCodeReceived(e){
		// if(e.data)
		// 	alert(e.data);
	}
}