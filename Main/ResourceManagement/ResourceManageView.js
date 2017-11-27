import React, { Component } from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';

import Dimensions from 'Dimensions';
import NavBar from '../../common/NavBar';
import CardView from 'react-native-cardview'
import ScanQRCodeView from './ScanQRCodeView';
import DailyReportView from './DailyReportView';

var width = Dimensions.get('window').width;

export default class ResourceManageView extends Component{
	render(){
		return(
			<View style={{flex:1,flexDirection: 'column', backgroundColor: '#f2f2f2'}}>
				<NavBar
	                title={'物项管理'}
	                leftIcon={require('../../images/back.png')}
	                leftPress={this.back.bind(this)} />
				<Image 
					style={{width: width, height: width*0.53}}
					source={require('../../images/images.png')} />
				<TouchableOpacity onPress = {() => this.goToDailyReport()}>
					<CardView
						style = {{marginTop: 15, marginLeft: 10, marginRight: 10, backgroundColor: '#ffffff', height: width*0.33, flexDirection: 'row', alignItems: 'center'}}
						cardElevation = {4}
						cornerRadius = {6}>
						<Image
							style = {{width: 80, height: 80, marginLeft: 10}}
							
							source = {require('../../images/daily_icon.png')} />
						<View>
							<Text style={{color: '#444444', fontSize: 18, fontWeight: 'bold'}}>库存日报</Text>
							<Text style={{color: '#777777', fontSize: 14}}>可查看每日入/出库明细</Text>
						</View>
					</CardView>
				</TouchableOpacity>
				<TouchableOpacity onPress = {() => this.goToScanQRCode()}>
					<CardView
						style = {{marginTop: 15, marginLeft: 10, marginRight: 10, backgroundColor: '#ffffff', height: width*0.33, flexDirection: 'row', alignItems: 'center'}}
						cardElevation = {4}
						cornerRadius = {6}>
						<Image
							style = {{width: 80, height: 80, marginLeft: 10}}
							source = {require('../../images/scan_icon.png')} />
						<View>
							<Text style={{color: '#444444', fontSize: 18, fontWeight: 'bold'}}>扫一扫</Text>
							<Text style={{color: '#777777', fontSize: 14, width: width*0.67}}>查看物项信息(单/批量入库、单/批量出库、退库处理、库存/出库记录查询)</Text>
						</View>
					</CardView>
				</TouchableOpacity>
			</View>
		);
	}

	back(){
		this.props.navigator.pop();
	}

	goToScanQRCode(){
		this.props.navigator.push({
			component: ScanQRCodeView
		})
	}

	goToDailyReport(){
		this.props.navigator.push({
			component: DailyReportView
		})
	}
}