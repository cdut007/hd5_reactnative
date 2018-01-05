import React, {Component} from 'react';
import {View, Text, Image, TextInput, TouchableOpacity, ScrollView, Keyboard} from 'react-native';
import Dimensions from 'Dimensions';

import NavBar from '../../common/NavBar';
import SeparateComponent from '../../common/SeparateComponent';
import Global from '../../common/globals';
import ConfirmDialog from '../../common/ConfirmDialog';
import DateTimePicker from 'react-native-modal-datetime-picker'
import Picker from 'react-native-picker';
import DepartmentDetailView from './DepartmentDetailView';
import HttpRequest from '../../HttpRequest/HttpRequest';

var width = Dimensions.get('window').width;
const inStoreNeedParams = ['GUARANTEENO','MATE_CODE','STORAGES_CODE','VESSEL_NO','CHECK_QTY','DELIV_LOT'];

/*
 *必须参数: title-页面标题 type-类型(1:入库 2:物项查询) item(数据源)
 */

export default class InfoInputView extends Component{

	constructor(props){
		super(props);
		let item = {};
		if(this.props.item){
			item = this.props.item;
		}
		this.state = {
			isDateTimePickerVisible: false,
			config:{
				title: '',
				isShow: false
			},
			inStoreData: {
				GUARANTEENO: item.warrantyNo,
				MATE_CODE: item.mate_CODE,
				MANUFACTURER: '',
				YIELD_DATE: '',
				WARRANT_START_DATE: '',
				SHELIFE_MONTHS: '',
				MONTHS_WARRANT: '',
				STORAGES_CODE: '',
				STRG_CLASS: '',
				VESSEL_NO: '',
				FILE_NO: '',
				CHECK_QTY: '',
				WAREH_AREA: '',
				GJJSBFL: '',
				DELIV_LOT: ''
			},
			queryData: {
				MATE_CODE: '',
				MATE_DESCR: '',
				SPEC: '',
				TEXTURE: '',
				GUARANTEENO: ''
			}
		};
	}

	componentWillUnmount(){
		Picker.hide();
	}

	render(){
		return(
			<View style={{backgroundColor:'#efefef', flexDirection:'column', flex:1}}>
				<ConfirmDialog config={this.state.config} onCancel={()=>this.setState({config:{isShow:false}})} onConfirm={()=>this.onConfirmClick()} />
				<NavBar
					title={this.props.title}
					leftIcon={require('../../images/back.png')}
					leftPress={() => this.back()} />
				{this.renderContent()}
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
					<ScrollView
					  style={{flex:1, backgroundColor:'#fff', flexDirection:'column'}}
					  onScroll={()=>{Picker.hide()}}>
						<SeparateComponent lineStyle={{height:10, backgroundColor:'#f2f2f2'}} />
						{this.renderInputItem('核实数量:','请输入核实数量',(text)=>this.state.inStoreData.CHECK_QTY=text,true)}
						<SeparateComponent lineStyle={{marginLeft:10, marginRight:10}} />
						{this.renderInputItem('制造商:','请输入制造商',(text)=>this.state.inStoreData.MANUFACTURER=text)}
						<SeparateComponent lineStyle={{marginLeft:10, marginRight:10}} />
						{this.renderTimeSelectItem('生产日期:')}
						<SeparateComponent lineStyle={{marginLeft:10, marginRight:10}} />
						{this.renderInputItem('有效期/月:','请输入有效期',(text)=>this.state.inStoreData.WARRANT_START_DATE=text)}
						<SeparateComponent lineStyle={{marginLeft:10, marginRight:10}} />
						{this.renderInputItem('保质期/月:','请输入保质期',(text)=>this.state.inStoreData.SHELIFE_MONTHS=text)}
						<SeparateComponent lineStyle={{marginLeft:10, marginRight:10}} />
						{this.renderInputItem('保修期/月:','请输入保修期',(text)=>this.state.inStoreData.MONTHS_WARRANT=text)}
						<SeparateComponent lineStyle={{marginLeft:10, marginRight:10}} />
						{this.renderInputItem('船次:','请输入船次号',(text)=>this.state.inStoreData.DELIV_LOT=text,true)}
						<SeparateComponent lineStyle={{marginLeft:10, marginRight:10}} />
						{this.renderInputItem('储存仓位:','请输入储存仓位',(text)=>this.state.inStoreData.STORAGES_CODE=text,true)}
						<SeparateComponent lineStyle={{marginLeft:10, marginRight:10}} />
						{this.renderInputItem('储存货位:','请输入储存货位',(text)=>this.state.inStoreData.VESSEL_NO=text,true)}
						<SeparateComponent lineStyle={{marginLeft:10, marginRight:10}} />
						{this.renderInputItem('储存级别:','请输入储存级别',(text)=>this.state.inStoreData.STRG_CLASS=text)}
						<SeparateComponent lineStyle={{marginLeft:10, marginRight:10}} />
						{this.renderInputItem('文件编号:','请输入文件编号',(text)=>this.state.inStoreData.FILE_NO=text)}
						<SeparateComponent lineStyle={{marginLeft:10, marginRight:10}} />
						{this.renderSelectItem('是否设备工机具:')}
						<SeparateComponent lineStyle={{height:10, backgroundColor:'#f2f2f2'}} />
						{this.renderInputItem('存储区域:','请输入存储区域',(text)=>this.state.inStoreData.WAREH_AREA=text)}
					</ScrollView>
				);
			case 2:
				return(
					<View style={{backgroundColor:'#f2f2f2', flex:1, flexDirection:'column'}}>
						<View style={{backgroundColor:'#fff', flexDirection:'column'}}>
							<SeparateComponent lineStyle={{height:10, backgroundColor:'#f2f2f2'}} />
							{this.renderInputItem('物项编码:','请输入物项编码',(text)=> this.state.queryData.MATE_CODE = text)}
							<SeparateComponent lineStyle={{marginLeft:10, marginRight:10}} />
							{this.renderInputItem('物项名称:','请输入物项名称',(text)=> this.state.queryData.MATE_DESCR = text)}
							<SeparateComponent lineStyle={{marginLeft:10, marginRight:10}} />
							{this.renderInputItem('规格型号:','请输入规格型号',(text)=> this.state.queryData.SPEC = text)}
							<SeparateComponent lineStyle={{marginLeft:10, marginRight:10}} />
							{this.renderInputItem('材质:','请输入材质',(text)=> this.state.queryData.TEXTURE = text)}
							<SeparateComponent lineStyle={{marginLeft:10, marginRight:10}} />
							{this.renderInputItem('质保编号:','请输入质保编号',(text)=> this.state.queryData.GUARANTEENO = text)}
						</View>
					</View>
				);
		}
	}

	renderInputItem(title,placeholder,onTextChanged,isRequired){
		return(
			<View style={{flexDirection:'row', marginLeft:10, height:48, alignItems:'center'}}>
					{
						isRequired
						?
						<Text style={{fontSize:14, color:'#1c1c1c', minWidth:80}}>
							<Text style={{color:'red'}}>*</Text>{title}
						</Text>
						:
						<Text style={{fontSize:14, color:'#1c1c1c', minWidth:80}}>
							{title}
						</Text>
					}
				<TextInput 
					style={{padding:0, marginLeft:30, flex:1}}
					underlineColorAndroid={'transparent'} 
					onChangeText={(text) => {onTextChanged(text)}}
					onFocus={() => Picker.hide()}
					placeholder={placeholder}
					placeholderTextColor={'#6d9ee1'}/>
			</View>
		);
	}

	renderTimeSelectItem(title){
		return(
			<View style={{flexDirection:'row', marginLeft:10, height:48, alignItems:'center'}}>
				<Text style={{fontSize:14, color:'#1c1c1c', minWidth:80}}>{title}</Text>
				<TouchableOpacity style={{marginLeft:30, flex:1, flexDirection:'row',alignItems:'center'}} onPress={() => {Picker.hide();this.setState({isDateTimePickerVisible:true})}}>
					<TextInput 
						style={{color:'#1c1c1c',flex:1}}
						editable={false}
						value={this.state.inStoreData.YIELD_DATE}
						underlineColorAndroid={'transparent'} 
						placeholder={'请选择生产日期'}
						placeholderTextColor={'#6d9ee1'}/>
					<Image
						source={require('../../images/unfold_icon.png')}
						style={{width:20,height:20, marginRight:20}}/>
				</TouchableOpacity>
				<DateTimePicker
                    cancelTextIOS={'取消'}
                    confirmTextIOS={'确定'}
                    titleIOS={''}
                    datePickerModeAndroid={'spinner'}
                    mode = {'date'}
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={(date) => this.onSelectedDate(date)}
                    onCancel={() => this.setState({ isDateTimePickerVisible: false })}
                />
			</View>
		);
	}

	renderSelectItem(title){
		return(
			<View style={{flexDirection:'row', marginLeft:10, height:48, alignItems:'center'}}>
				<Text style={{fontSize:14, color:'#1c1c1c', minWidth:80}}>{title}</Text>
				<TouchableOpacity style={{marginLeft:30, flex:1, flexDirection:'row',alignItems:'center'}} onPress={() => this.onPickerClick()}>
					<TextInput 
						style={{color:'#1c1c1c',flex:1}}
						editable={false}
						value={this.state.inStoreData.GJJSBFL}
						underlineColorAndroid={'transparent'} 
						placeholder={'请选择'}
						placeholderTextColor={'#6d9ee1'}/>
					<Image
						source={require('../../images/unfold_icon.png')}
						style={{width:20,height:20, marginRight:20}}/>
				</TouchableOpacity>
			</View>
		);
	}

	onPickerClick(){
		Picker.init({
        	pickerData: ['空','设备','工机具'],
        	pickerConfirmBtnText:'保存',
        	pickerCancelBtnText:'取消',
        	pickerTitleText:'',
	        onPickerConfirm: data => {
	        	this.state.inStoreData.GJJSBFL = data[0];
	        	this.setState({inStoreData:this.state.inStoreData});
	        }	    
  		});
    	Picker.show();
	}

	onSelectedDate(date){
		this.state.inStoreData.YIELD_DATE = new Date(date).format('yyyy/MM/dd');
		this.setState({isDateTimePickerVisible:false})
	}

	renderBottomButton(){
		let title = '确认';
		switch(this.props.type){
			case 2:
				title = '查询';
				break;
		}
		return(
			<TouchableOpacity
			  activeOpacity={0.8} 
			  style={{width:width, height:48, backgroundColor:'#f77935', alignItems:'center', justifyContent:'center'}}
			  onPress={() => this.clickBottomButton()}>
				<Text style={{color:'#fff', fontSize:18, fontWeight:'bold'}}>{title}</Text>
			</TouchableOpacity>
		);		
	}

	clickBottomButton(){
		Keyboard.dismiss();
		switch(this.props.type){
			case 1:
				for(child in inStoreNeedParams){
					if(!this.state.inStoreData[inStoreNeedParams[child]]){
						Global.alert('红色星号标识为必填项');
						return;
					}
				}
				this.setState({
					config: {
						title: '确认入库',
						isShow: true,
					}
				})
				break;		
			case 2:
				let i = 0;
				let j = 0;
				for(var child in this.state.queryData){
					if(!this.state.queryData[child]){
						i++;
					}
					j++;
				}
				if(i>=j){
					Global.alert('请至少输入一个搜索条件')
				}else{
					this.props.navigator.replace({
						component: DepartmentDetailView,
						props: {
							title: '查询列表',
							type: 4,
							conditions: this.state.queryData
						}
					});
				}
				break;
		}
	}

	onConfirmClick(){
		switch(this.props.type){
			case 1:
				this.requestInStore();
				break;			
		}
		this.setState({config:{isShow:false}})
	}

	requestInStore(){
		HttpRequest.post(
			'/enpower/material/materialStoreCheck',
			this.state.inStoreData,
			(response) => {
				this.props.navigator.pop();
			},
			(error) => {
				HttpRequest.printError(error);
			}
		);
	}
}