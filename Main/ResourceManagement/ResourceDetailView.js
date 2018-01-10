import React, {Component} from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity, TextInput, Keyboard} from 'react-native';
import Dimensions from 'Dimensions';

import NavBar from '../../common/NavBar';
import Global from '../../common/globals';
import SeparateComponent from '../../common/SeparateComponent';
import InfoInputView from './InfoInputView';
import HttpRequest from '../../HttpRequest/HttpRequest';
import ConfirmDialog from '../../common/ConfirmDialog';
import Spinner from 'react-native-loading-spinner-overlay'

var width = Dimensions.get('window').width;

/*
 *必须参数: type(详情类型: 1-今日出库详情 2-今日入库详情 3-单个入库详情 4-批量出库详情 5-批量退库详情 6-库存详情) item(数据源) callback(成功操作回调)
 */

export default class ResourceDetailView extends Component{

	constructor(props){
		super(props);
		this.state = {
			loadingVisible: false,
			config: {
				title: '',
				isShow: false
			},
			outStoreData: {
				ISSNO: this.props.item.issNo,
				QTY_RELEASED: '',
				WHO_GET: this.props.item.whoGet
			},
			backStoreData: {
				ID: this.props.item.id,
				ISSNO: this.props.item.issNo,
				ISSQTY: this.props.item.number,
				QTY_RELEASED: '',
				WAREH_CODE: '',
				WAREH_PLACE: ''
			}
		};
	}

	render(){
		return(
			<View style={{flex:1, flexDirection:'column', backgroundColor:'#f2f2f2'}}>
				<ConfirmDialog config={this.state.config} onCancel={()=>this.setState({config:{isShow:false}})} onConfirm={()=>this.onConfirm()} />
				<NavBar
					title={'物项详情'}
					leftIcon={require('../../images/back.png')}
					leftPress={() => this.back()}/>
				{this.renderHeader()}
				<ScrollView>
					{this.renderCenter()}
					{this.renderBottom()}
					{this.renderInputField()}
				</ScrollView>
				{this.renderBottomButton()}
				<Spinner visible={this.state.loadingVisible} />
			</View>
		);
	}

	back(){
		this.props.navigator.pop();
	}

	renderHeader(){
		let displayArr = [];
		let viewArr = [];
		switch(this.props.type){
			case 1:
				displayArr.push({title:'物项名称',content:this.props.item.name})
				displayArr.push({title:'出库单位',content:this.props.item.issDept})
				displayArr.push({title:'领料员',content:this.props.item.whoGet})
				break;
			case 2:
				displayArr.push({title:'物项名称',content:this.props.item.name})
				displayArr.push({title:'储存仓库',content:this.props.item.warehouse})
				displayArr.push({title:'货位',content:this.props.item.location})
				displayArr.push({title:'数量',content:this.props.item.number})
				break;
			case 3:
				displayArr.push({title:'物项名称',content:this.props.item.name})
				displayArr.push({title:'质保编号',content:this.props.item.warrantyNo})
				displayArr.push({title:'数量',content:this.props.item.number})
				break;	
			case 4:
				displayArr.push({title:'开票日期',content:new Date(this.props.item.issDate).format('yyyy/MM/dd')})
				displayArr.push({title:'出库单位',content:this.props.item.issDept})
				displayArr.push({title:'领料员',content:this.props.item.whoGet,input:!this.props.item.hasDone,onTextChanged:(text) => {this.state.outStoreData.WHO_GET = text}})
				break;
			case 5:
				displayArr.push({title:'退库日期',content:new Date(this.props.item.issDate).format('yyyy/MM/dd')})
				displayArr.push({title:'退库单位',content:this.props.item.issDept})
				displayArr.push({title:'退库员',content:this.props.item.keeper})
				break;
			case 6:
				displayArr.push({title:'物项名称',content:this.props.item.name})
				displayArr.push({title:'库存数量',content:this.props.item.stk_qty})
				displayArr.push({title:'可用库存',content:this.props.item.number})
				break;
		}
		displayArr.map(
			(item,i) => {
				viewArr.push(
					item.input
					?
					<View key={i} style={{width:width/displayArr.length, flexDirection:'column', alignItems:'center', paddingTop:8}}>
						<View style={{flexDirection:'row', paddingRight:20}}>
							<Text style={{fontSize:14, color:'#1c1c1c'}}>{item.title}</Text>
						</View>
						<View style={{flexDirection:'row', marginTop: 4}}>
							<TextInput 
								style={{fontSize:14, color:'#777', textAlign:'center',padding:0, height:20, minWidth:45}} 
								multiline={false}
								placeholder={'请输入'}
								defaultValue={item.content}
								placeholderTextColor={'#6d9ee1'}
								underlineColorAndroid={'transparent'} 
								onChangeText={(text) => item.onTextChanged(text)} />
							<Image
								style={{width:20,height:20}}
								source={require('../../images/revise_icon.png')} />
						</View>
					</View>
					:
					<View key={i} style={{width:width/displayArr.length, flexDirection:'column', alignItems:'center', paddingTop:8}}>
						<Text style={{fontSize:14, color:'#1c1c1c'}}>{item.title}</Text>
						<Text style={{fontSize:14, color:'#777', marginTop: 4}}>{item.content}</Text>
					</View>
				);
			}
		);
		if(viewArr.length > 0){
			return(
				<View style={{minHeight:60, backgroundColor:'#fff', flexDirection:'row', marginBottom:10}}>
					{viewArr}
				</View>
			);
		}
	}

	renderCenter(){
		let displayArr = [];
		switch(this.props.type){
			case 1:
				displayArr.push({title1:'出库量:',content1:this.props.item.number,title2:'核实量:',content2:this.props.item.confirmCount})
				displayArr.push({title1:'单价(¥):',content1:this.props.item.price,title2:'总金额(¥):',content2:this.props.item.ckJe})
				displayArr.push({title1:'保管员:',content1:this.props.item.keeper,title2:'计划签发:',content2:new Date(this.props.item.issDate).format('yyyy/MM/dd')})
				break;
		}
		let viewArr = this.returnViewArr(displayArr);
		if(viewArr.length > 0){
			return(
				<View style={{backgroundColor:'#fff', flexDirection:'column', marginBottom:10}}>
					{viewArr}
				</View>
			);
		}
	}

	renderBottom(){
		let displayArr = [];
		switch(this.props.type){
			case 1:
				displayArr.push({title:'出库单号:',content:this.props.item.issNo})
				displayArr.push({title:'需求计划号:',content:this.props.item.mrpNo})
				displayArr.push({title:'质保编号:',content:this.props.item.warrantyNo})
				displayArr.push({title:'会计科目:',content:this.props.item.cstCode})
				displayArr.push({title:'规格型号:',content:this.props.item.specificationNo})
				displayArr.push({title:'材质:',content:this.props.item.material})
				displayArr.push({title:'标准:',content:this.props.item.standard})
				displayArr.push({title:'核安全等级:',content:this.props.item.securityLevel})
				displayArr.push({title:'质保等级:',content:this.props.item.warrantyLevel})
				displayArr.push({title:'位号:',content:this.props.item.positionNo})
				displayArr.push({title:'炉批号:',content:this.props.item.furnaceNo})
				displayArr.push({title:'备注:',content:this.props.item.remark})
				break;
			case 2:
				displayArr.push({title:'质保编号:',content:this.props.item.warrantyNo})
				displayArr.push({title:'材质:',content:this.props.item.material})
				displayArr.push({title:'规格型号:',content:this.props.item.specificationNo})
				displayArr.push({title:'炉批号:',content:this.props.item.furnaceNo})
				displayArr.push({title:'位号:',content:this.props.item.positionNo})
				displayArr.push({title:'船次:',content:this.props.item.shipNo})
				displayArr.push({title:'核安全等级:',content:this.props.item.securityLevel})
				displayArr.push({title:'质保等级:',content:this.props.item.warrantyLevel})
				displayArr.push({title:'标准规范:',content:this.props.item.standard})
				displayArr.push({title:'订单号:',content:this.props.item.cpoNo})
				displayArr.push({title:'价格:',content:this.props.item.price})
				break;
			case 3:
				displayArr.push({title:'材质:',content:this.props.item.material})
				displayArr.push({title:'规格型号:',content:this.props.item.specificationNo})
				displayArr.push({title:'炉批号:',content:this.props.item.furnaceNo})
				displayArr.push({title:'位号:',content:this.props.item.positionNo})
				displayArr.push({title:'核安全等级:',content:this.props.item.securityLevel})
				displayArr.push({title:'质保等级:',content:this.props.item.warrantyLevel})
				displayArr.push({title:'标准规范:',content:this.props.item.standard})
				displayArr.push({title:'订单号:',content:this.props.item.cpoNo})
				displayArr.push({title:'价格:',content:this.props.item.price})
				break;
			case 4:
				displayArr.push({title:'出库单号:',content:this.props.item.issNo})
				displayArr.push({title:'需求计划号:',content:this.props.item.mrpNo})
				displayArr.push({title1:'物项名称:',content1:this.props.item.name,title2:'材质:',content2:this.props.item.material})
				displayArr.push({title:'规格型号:',content:this.props.item.specificationNo})
				displayArr.push({title:'质保编号:',content:this.props.item.warrantyNo})
				displayArr.push({title:'炉批号:',content:this.props.item.furnaceNo})
				displayArr.push({title1:'核安全等级:',content1:this.props.item.securityLevel,title2:'质保等级:',content2:this.props.item.warrantyLevel})
				displayArr.push({title1:'标准:',content1:this.props.item.standard,title2:'位号:',content2:this.props.item.positionNo})
				displayArr.push({title1:'货位号:',content1:this.props.item.location,title2:'会计科目:',content2:this.props.item.cstCode})
				displayArr.push({title:'备注:',content:this.props.item.remark})
				break;
			case 5:
				displayArr.push({title:'退库单号:',content:this.props.item.issNo})
				displayArr.push({title:'需求计划号:',content:this.props.item.mrpNo})
				displayArr.push({title1:'物项名称:',content1:this.props.item.name,title2:'材质:',content2:this.props.item.material})
				displayArr.push({title:'规格型号:',content:this.props.item.specificationNo})
				displayArr.push({title:'质保编号:',content:this.props.item.warrantyNo})
				displayArr.push({title:'炉批号:',content:this.props.item.furnaceNo})
				displayArr.push({title1:'核安全等级:',content1:this.props.item.securityLevel,title2:'质保等级:',content2:this.props.item.warrantyLevel})
				displayArr.push({title1:'标准:',content1:this.props.item.standard,title2:'位号:',content2:this.props.item.positionNo})
				displayArr.push({title1:'货位号:',content1:this.props.item.location,title2:'会计科目:',content2:this.props.item.cstCode})
				displayArr.push({title:'备注:',content:this.props.item.remark})
				break;
			case 6:
				displayArr.push({title:'物项类别:',content:this.props.item.type})
				displayArr.push({title:'物项编码:',content:this.props.item.mate_CODE})
				displayArr.push({title:'规格型号:',content:this.props.item.specificationNo})
				displayArr.push({title:'材质:',content:this.props.item.material})
				displayArr.push({title:'质保编号:',content:this.props.item.warrantyNo})
				displayArr.push({title:'炉批号:',content:this.props.item.furnaceNo})
				displayArr.push({title:'储存仓库:',content:this.props.item.warehouse})
				displayArr.push({title1:'货位号:',content1:this.props.item.location,title2:'位号:',content2:this.props.item.positionNo})
				displayArr.push({title1:'核安全等级:',content1:this.props.item.securityLevel,title2:'质保等级:',content2:this.props.item.warrantyLevel})
				displayArr.push({title:'备注:',content:this.props.item.remark})
				displayArr.push({title1:'标准:',content1:this.props.item.standard,title2:'船次:',content2:this.props.item.shipNo})
				break;
		}
		let viewArr = this.returnViewArr(displayArr);
		if(viewArr.length > 0){
			return(
				<View style={{backgroundColor:'#fff', flexDirection:'column', marginBottom:10}}>
					{viewArr}
				</View>
			);
		}
	}

	renderInputField(){
		if(!this.props.item.hasDone){
			let displayArr = [];
			let viewArr = [];
			switch(this.props.type){
				case 4:
					displayArr.push({title1:'出库量:',content1:this.props.item.number,color1:'#e82628',title2:'核实量:',content2:this.props.item.warrantyLevel,input2:true,onTextChanged2:(text) => {this.state.outStoreData.QTY_RELEASED = text}})
					displayArr.push({title1:'单价(￥):',content1:this.props.item.price,title2:'总金额(￥):',content2:this.props.item.ckJe})
					displayArr.push({title1:'保管员:',content1:this.props.item.keeper,title2:'核实日期:',content2:this.props.item.whenCnfmed})
					viewArr = this.returnViewArr(displayArr);
					break;
				case 5:
					displayArr.push({title1:'退库量:',content1:this.props.item.number,color1:'#e82628',title2:'核实量:',content2:this.props.item.warrantyLevel,input2:true,onTextChanged2:(text) => {this.state.backStoreData.QTY_RELEASED = text}})
					displayArr.push({title1:'单价(￥):',content1:this.props.item.price,title2:'总金额(￥):',content2:this.props.item.ckJe})
					displayArr.push({title1:'仓库:',content1:this.props.item.warehouse,input1:true,onTextChanged1:(text) => {this.state.backStoreData.WAREH_CODE = text},title2:'货位:',content2:this.props.item.location,input2:true,onTextChanged2:(text) => {this.state.backStoreData.WAREH_PLACE = text}})
					viewArr = this.returnViewArr(displayArr);
					break;
			}
			if(viewArr.length > 0){
				return(
					<View style={{backgroundColor:'#fff', flexDirection:'column', marginBottom:10}}>
						{viewArr}
					</View>
				);
			}
		}
	}

	returnViewArr(displayArr){
		let viewArr = [];
		displayArr.map( 
			(item,i) => {
				item.title
				?
				viewArr.push(
					<View key={i}>
						<View style={{height:48, flexDirection:'row', alignItems:'center'}}>
							<View style={{flex:1, flexDirection:'row',alignItems:'center',marginLeft:10}}>
								<Text style={{flex:1,fontSize:14, color:'#1c1c1c'}}>{item.title}</Text>
								<Text style={{flex:3,fontSize:14, color:'#888'}}>{item.content}</Text>
							</View>
						</View>
						{i<displayArr.length-1?<SeparateComponent lineStyle={{marginLeft:10, marginRight:10}}/>:null}
					</View>
				)
				:
				viewArr.push(
					<View  key={i}>
						<View style={{height:48,flexDirection:'row'}}>
							<View style={{marginLeft:10,flex:1, flexDirection:'row',alignItems:'center'}}>
								<Text style={{flex:7,fontSize:14, color:'#1c1c1c'}}>{item.title1}</Text>
								{
									item.input1
									?
									<TextInput
										style={{color:'#888',fontSize:14,flex:11}}
										onChangeText={(text) => item.onTextChanged1(text)}
										placeholder={'请输入'}
										placeholderTextColor={'#6d9ee1'}
										underlineColorAndroid={'transparent'} />
									:
									<Text style={{flex:11,fontSize:14, color:item.color1?item.color1:'#888'}}>{item.content1}</Text>
								}
							</View>
							<View style={{flex:1, flexDirection:'row',alignItems:'center'}}>
								<Text style={{flex:7,fontSize:14, color:'#1c1c1c'}}>{item.title2}</Text>
								{
									item.input2
									?
									<TextInput
										style={{color:'#888',fontSize:14,flex:11}}
										onChangeText={(text) => item.onTextChanged2(text)}
										placeholder={'请输入'}
										placeholderTextColor={'#6d9ee1'}
										underlineColorAndroid={'transparent'} />
									:
									<Text style={{flex:11,fontSize:14, color:'#888'}}>{item.content2}</Text>
								}
							</View>
						</View>
						{i<displayArr.length-1?<SeparateComponent lineStyle={{marginLeft:10, marginRight:10}}/>:null}
					</View>
				)
			}
		);
		return viewArr;
	}

	renderBottomButton(){
		if((this.props.type==3 || this.props.type==4 || this.props.type==5) && !this.props.item.hasDone){
			let title = '入库';
			switch(this.props.type){
				case 3:
					title = '入库核实';
					break;
				case 4:
					title = '出库核实';
					break;	
				case 5:
					title = '退库核实';
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
	}

	clickBottomButton(){
		Keyboard.dismiss();
		switch(this.props.type){
			case 3:
				this.props.navigator.push({component:InfoInputView,props:{title:'核实入库',type:1,item:this.props.item}})
				break;
			case 4:
				for(var child in this.state.outStoreData){
					if(!this.state.outStoreData[child]){
						Global.alert('请填写完整信息');
						return;
					}
				}
				this.showConfirmDialog('确认出库')
				break;
			case 5:
				for(var child in this.state.backStoreData){
					if(!this.state.backStoreData[child]){
						Global.alert('请填写完整信息');
						return;
					}
				}
				this.showConfirmDialog('确认退库')
				break;
		}
	}

	showConfirmDialog(title){
		this.setState({config:{
			title: title,
			isShow: true
		}});
	}

	onConfirm(){
		this.setState({
			config: {
				isShow: false
			}
		});
		switch(this.props.type){
			case 4:
				this.requestOutStore();
				break;
			case 5:
				this.requestBackStore();
				break;
		}
	}

	requestOutStore(){
		this.setState({loadingVisible:true});
		HttpRequest.post(
			'/enpower/material/materialOutCheck', 
			this.state.outStoreData,
			(response) => {
				this.setState({loadingVisible:false});
				if(this.props.callback){
					this.props.callback(this.props.item);
				}
				this.props.navigator.pop();
			},
			(error) => {
				this.setState({loadingVisible:false});
				HttpRequest.printError(error);
			}
		);
	}

	requestBackStore(){
		this.setState({loadingVisible:true});
		HttpRequest.post(
			'/enpower/material/materialCancelCheck',
			this.state.backStoreData,
			(reponse) => {
				this.setState({loadingVisible:false});
				if(this.props.callback){
					this.props.callback(this.props.item);
				}
				this.props.navigator.pop();
			},
			(error) => {
				this.setState({loadingVisible:false});
				HttpRequest.printError(error);
			}
		);
	}
}