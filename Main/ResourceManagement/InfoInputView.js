import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import Dimensions from 'Dimensions';

import NavBar from '../../common/NavBar';
import SeparateComponent from '../../common/SeparateComponent';
import Global from '../../common/globals';
import ConfirmDialog from '../../common/ConfirmDialog';

var width = Dimensions.get('window').width;

/*
 *必须参数: title-页面标题 type-内容类型(1:入库, 2:出库 3:退库) count-出库/退库类型所需参数
 */

export default class InfoInputView extends Component{

	constructor(props){
		super(props);
		this.state = {
			warehouse: '',
			location: '',
			confirmCount: -1,
			content: '',
			isShow: false,
		};
	}

	render(){
		return(
			<View style={{backgroundColor:'#efefef', flexDirection:'column', flex:1}}>
				<ConfirmDialog isShow={this.state.isShow} onCancel={()=>this.setState({isShow:false})} onConfirm={()=>this.onConfirmClick()} content={this.state.content} />
				<NavBar
					title={this.props.title}
					leftIcon={require('../../images/back.png')}
					leftPress={() => this.back()} />
				{this.renderContent()}
				<View style={{flex:1}} />
				{this.renderBottomButton()}
			</View>
		);
	}

	back(){
		this.props.navigator.pop();
	}

	renderContent(){
		switch(this.props.type){
			case 1:
				return(
					<View style={{backgroundColor:'#fff', marginTop:10, flexDirection:'column'}}>
						<View style={{flexDirection:'row', marginLeft:10, height:48, alignItems:'center'}}>
							<Text style={{fontSize:14, color:'#1c1c1c'}}>储存仓位:</Text>
							<TextInput 
								style={{padding:0, marginLeft:30, flex:1}}
								underlineColorAndroid={'transparent'} 
								onChangeText={(text) => {this.setState({warehouse:text})}}
								placeholder={'请输入储存仓位'}
								placeholderTextColor={'#6d9ee1'}/>
						</View>
						<SeparateComponent lineStyle={{marginLeft:10, marginRight:10}} />
						<View style={{flexDirection:'row', marginLeft:10, height:48, alignItems:'center'}}>
							<Text style={{fontSize:14, color:'#1c1c1c'}}>储存货位:</Text>
							<TextInput 
								style={{padding:0, marginLeft:30, flex:1}}
								underlineColorAndroid={'transparent'} 
								onChangeText={(text) => {this.setState({location:text})}}
								placeholder={'请输入储存货位'}
								placeholderTextColor={'#6d9ee1'}/>
						</View>
					</View>
				);
			case 2:
				return(
					<View style={{backgroundColor:'#fff', marginTop:10, flexDirection:'column'}}>
						<View style={{flexDirection:'row', marginLeft:10, height:48, alignItems:'center'}}>
							<Text style={{fontSize:14, color:'#1c1c1c'}}>出库量:</Text>
							<Text style={{fontSize:14, color:'#e82628', marginLeft:30}}>{this.props.count}</Text>
						</View>
						<SeparateComponent lineStyle={{marginLeft:10, marginRight:10}} />
						<View style={{flexDirection:'row', marginLeft:10, height:48, alignItems:'center'}}>
							<Text style={{fontSize:14, color:'#1c1c1c'}}>核实量:</Text>
							<TextInput 
								style={{padding:0, marginLeft:30, flex:1}}
								underlineColorAndroid={'transparent'} 
								keyboardType={'numeric'}
								onChangeText={(text) => {this.setState({confirmCount:text})}}
								placeholder={'请输入核实量'}
								placeholderTextColor={'#6d9ee1'}/>
						</View>
					</View>
				);
			case 3:
				return(
					<View style={{backgroundColor:'#fff', marginTop:10, flexDirection:'column'}}>
						<View style={{flexDirection:'row', marginLeft:10, height:48, alignItems:'center'}}>
							<Text style={{fontSize:14, color:'#1c1c1c'}}>退库量:</Text>
							<Text style={{fontSize:14, color:'#e82628', marginLeft:30}}>{this.props.count}</Text>
						</View>
						<SeparateComponent lineStyle={{marginLeft:10, marginRight:10}} />
						<View style={{flexDirection:'row', marginLeft:10, height:48, alignItems:'center'}}>
							<Text style={{fontSize:14, color:'#1c1c1c'}}>核实量:</Text>
							<TextInput 
								style={{padding:0, marginLeft:30, flex:1}}
								underlineColorAndroid={'transparent'} 
								keyboardType={'numeric'}
								onChangeText={(text) => {this.setState({confirmCount:text})}}
								placeholder={'请输入核实量'}
								placeholderTextColor={'#6d9ee1'}/>
						</View>
					</View>
				);
		}
	}

	renderBottomButton(){
		return(
			<TouchableOpacity
			  activeOpacity={0.8} 
			  style={{width:width, height:48, backgroundColor:'#f77935', alignItems:'center', justifyContent:'center'}}
			  onPress={() => this.clickBottomButton()}>
				<Text style={{color:'#fff', fontSize:18, fontWeight:'bold'}}>{'确认'}</Text>
			</TouchableOpacity>
		);		
	}

	clickBottomButton(){
		switch(this.props.type){
			case 1:
				if(this.state.warehouse == '' || this.state.location == ''){
					Global.alert('请填写完整数据')
					return;
				}
				this.setState({
					content: '确认入库',
					isShow: true,
				})
				break;
			case 2:
				if(this.state.confirmCount == -1 || this.state.confirmCount == ''){
					Global.alert('请填写完整数据')
					return;
				}
				this.setState({
					content: '确认出库',
					isShow: true,
				})
				break;
			case 3:
				if(this.state.confirmCount == -1 || this.state.confirmCount == ''){
					Global.alert('请填写完整数据')
					return;
				}
				this.setState({
					content: '确认退库',
					isShow: true,
				})
				break;
		}
	}

	onConfirmClick(){
		switch(this.props.type){
			case 1:
				Global.alert('入库')
				break;
			case 2:
				Global.alert('出库')
				break;
			case 3:
				Global.alert('退库')
				break;
		}
		this.setState({isShow:false})
	}
}