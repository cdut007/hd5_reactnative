import React, {Component} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import Dimensions from 'Dimensions';

import NavBar from '../../common/NavBar';
import SeparateComponent from '../../common/SeparateComponent';
import InfoInputView from './InfoInputView';

var width = Dimensions.get('window').width;

/*
 *必须参数: type(详情类型: 1-今日出库详情 2-今日入库详情 3-单个入库详情 4-单个出库详情 5-批量入库详情 6-批量出库详情 7-退库详情 8-库存详情 9-出库记录详情) item(数据源)
 */

export default class ResourceDetailView extends Component{

	constructor(props){
		super(props);
	}

	render(){
		return(
			<View style={{flex:1, flexDirection:'column', backgroundColor:'#f2f2f2'}}>
				<NavBar
					title={'物项详情'}
					leftIcon={require('../../images/back.png')}
					leftPress={() => this.back()}/>
				{this.renderHeader()}
				<ScrollView>
					{this.renderCenter()}
					{this.renderBottom()}
				</ScrollView>
				{this.renderBottomButton()}
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
				displayArr.push({title:'物项名称',content:this.props.item.material.name})
				displayArr.push({title:'出库单位',content:this.props.item.department.name})
				displayArr.push({title:'领料员',content:this.props.item.receiver})
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
				displayArr.push({title:'开票日期',content:new Date(this.props.item.invoiceDate).format('yyyy/MM/dd')})
				displayArr.push({title:'物项名称',content:this.props.item.material.name})
				displayArr.push({title:'出库单位',content:this.props.item.department.name})
				displayArr.push({title:'领料员',content:this.props.item.receiver})
				break;
			case 5:
				displayArr.push({title:'物项名称',content:this.props.item.name})
				displayArr.push({title:'质保编号',content:this.props.item.warrantyNo})
				displayArr.push({title:'数量',content:this.props.item.number})
				break;
			case 6:
				displayArr.push({title:'开票日期',content:new Date(this.props.item.invoiceDate).format('yyyy/MM/dd')})
				displayArr.push({title:'物项名称',content:this.props.item.material.name})
				displayArr.push({title:'出库单位',content:this.props.item.department.name})
				displayArr.push({title:'领料员',content:this.props.item.receiver})
				break;
			case 7:
				displayArr.push({title:'退库日期',content:new Date(this.props.item.invoiceDate).format('yyyy/MM/dd')})
				displayArr.push({title:'物项名称',content:this.props.item.material.name})
				displayArr.push({title:'退库单位',content:this.props.item.department.name})
				displayArr.push({title:'退库员',content:this.props.item.receiver})
				break;
			case 8:
				displayArr.push({title:'物项名称',content:this.props.item.name})
				displayArr.push({title:'数量',content:this.props.item.number})
				displayArr.push({title:'储存仓库',content:this.props.item.warehouse})
				break;
			case 9:
				displayArr.push({title:'物项名称',content:this.props.item.material.name})
				displayArr.push({title:'出库数量',content:this.props.item.extractCount})
				displayArr.push({title:'出库单位',content:this.props.item.department.name})
				displayArr.push({title:'领料员',content:this.props.item.receiver})
				break;
		}
		displayArr.map(
			(item,i) => {
				viewArr.push(
					<View key={i} style={{flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
						<Text style={{fontSize:14, color:'#1c1c1c'}}>{item.title}</Text>
						<Text style={{fontSize:14, color:'#777', marginTop: 4}}>{item.content}</Text>
					</View>
				);
			}
		);
		if(viewArr.length > 0){
			return(
				<View style={{height:60, backgroundColor:'#fff', flexDirection:'row'}}>
					{viewArr}
				</View>
			);
		}
	}

	renderCenter(){
		let displayArr = [];
		let viewArr = [];
		switch(this.props.type){
			case 1:
				displayArr.push({title1:'出库量:',content1:this.props.item.extractCount,title2:'核实量:',content2:this.props.item.confirmCount})
				displayArr.push({title1:'单价(¥):',content1:this.props.item.material.price,title2:'总金额(¥):',content2:this.props.item.totalPrice})
				displayArr.push({title1:'保管员:',content1:this.props.item.keeper,title2:'计划签发:',content2:new Date(this.props.item.signDate).format('yyyy/MM/dd')})
				break;
			case 4:
				displayArr.push({title1:'出库量:',content1:this.props.item.extractCount,title2:'出库单号:',content2:this.props.item.extractNo})
				displayArr.push({title1:'单价(¥):',content1:this.props.item.material.price,title2:'总金额(¥):',content2:this.props.item.totalPrice})
				displayArr.push({title1:'保管员:',content1:this.props.item.keeper,title2:'计划签发:',content2:new Date(this.props.item.signDate).format('yyyy/MM/dd')})
				break;
			case 6:
				displayArr.push({title1:'出库量:',content1:this.props.item.extractCount,title2:'核实量:',content2:this.props.item.confirmCount})
				displayArr.push({title1:'单价(¥):',content1:this.props.item.material.price,title2:'总金额(¥):',content2:this.props.item.totalPrice})
				displayArr.push({title1:'保管员:',content1:this.props.item.keeper,title2:'计划签发:',content2:new Date(this.props.item.signDate).format('yyyy/MM/dd')})
				break;
			case 7:
				displayArr.push({title1:'退库量:',content1:this.props.item.extractCount,title2:'退库单号:',content2:this.props.item.extractNo})
				displayArr.push({title1:'单价(¥):',content1:this.props.item.material.price,title2:'总金额(¥):',content2:this.props.item.totalPrice})
				break;
		}
		displayArr.map(
			(item,i) => {
				viewArr.push(
						<View  key={i}>
							<View style={{height:48,flexDirection:'row'}}>
								<View style={{marginLeft:10,flex:1, flexDirection:'row',alignItems:'center'}}>
									<Text style={{flex:7,fontSize:14, color:'#1c1c1c'}}>{item.title1}</Text>
									<Text style={{flex:11,fontSize:14, color:'#888'}}>{item.content1}</Text>
								</View>
								<View style={{flex:1, flexDirection:'row',alignItems:'center'}}>
									<Text style={{flex:7,fontSize:14, color:'#1c1c1c'}}>{item.title2}</Text>
									<Text style={{flex:11,fontSize:14, color:'#888'}}>{item.content2}</Text>
								</View>
							</View>
							{i<displayArr.length-1?<SeparateComponent lineStyle={{marginLeft:10, marginRight:10}}/>:null}
						</View>
					);
				
			}
		);
		if(viewArr.length > 0){
			return(
				<View style={{backgroundColor:'#fff', flexDirection:'column', marginTop:10}}>
					{viewArr}
				</View>
			);
		}
	}

	renderBottom(){
		let displayArr = [];
		let viewArr = [];
		switch(this.props.type){
			case 1:
				displayArr.push({title:'出库单号:',content:this.props.item.extractNo})
				displayArr.push({title:'需求计划号:',content:this.props.item.planNo})
				displayArr.push({title:'质保编号:',content:this.props.item.warrantyNo})
				displayArr.push({title:'会计科目:',content:this.props.item.accounting})
				displayArr.push({title:'规格型号:',content:this.props.item.material.specificationNo})
				displayArr.push({title:'材质:',content:this.props.item.material.material})
				displayArr.push({title:'标准:',content:this.props.item.material.standard})
				displayArr.push({title:'核安全等级:',content:this.props.item.material.securityLevel})
				displayArr.push({title:'质保等级:',content:this.props.item.material.warrantyLevel})
				displayArr.push({title:'位号/炉批号:',content:this.props.item.material.positionNo})
				displayArr.push({title:'备注:',content:this.props.item.remark})
				break;
			case 2:
				displayArr.push({title:'质保编号:',content:this.props.item.warrantyNo})
				displayArr.push({title:'英文名称:',content:this.props.item.nameEn})
				displayArr.push({title:'规格型号:',content:this.props.item.specificationNo})
				displayArr.push({title:'材质:',content:this.props.item.material})
				displayArr.push({title:'安全等级:',content:this.props.item.securityLevel})
				displayArr.push({title:'标准:',content:this.props.item.standard})
				displayArr.push({title:'位号:',content:this.props.item.positionNo})
				displayArr.push({title:'质保书数:',content:this.props.item.warrantyCount})
				displayArr.push({title:'备注:',content:this.props.item.remark})
				break;
			case 3:
				displayArr.push({title:'材质:',content:this.props.item.material})
				displayArr.push({title:'规格型号:',content:this.props.item.specificationNo})
				displayArr.push({title:'位号/炉批号:',content:this.props.item.positionNo})
				displayArr.push({title:'核安全等级:',content:this.props.item.securityLevel})
				displayArr.push({title:'质保等级:',content:this.props.item.warrantyLevel})
				displayArr.push({title:'船次件号:',content:this.props.item.shipNo})
				break;
			case 4:
				displayArr.push({title:'需求计划号:',content:this.props.item.planNo})
				displayArr.push({title:'质保编号:',content:this.props.item.warrantyNo})
				displayArr.push({title:'会计科目:',content:this.props.item.accounting})
				displayArr.push({title:'规格型号:',content:this.props.item.material.specificationNo})
				displayArr.push({title:'材质:',content:this.props.item.material.material})
				displayArr.push({title:'标准:',content:this.props.item.material.standard})
				displayArr.push({title:'核安全等级:',content:this.props.item.material.securityLevel})
				displayArr.push({title:'质保等级:',content:this.props.item.material.warrantyLevel})
				displayArr.push({title:'位号/炉批号:',content:this.props.item.material.positionNo})
				displayArr.push({title:'备注:',content:this.props.item.remark})
				break;
			case 5:
				displayArr.push({title:'英文名称:',content:this.props.item.nameEn})
				displayArr.push({title:'规格型号:',content:this.props.item.specificationNo})
				displayArr.push({title:'材质:',content:this.props.item.material})
				displayArr.push({title:'安全等级:',content:this.props.item.securityLevel})
				displayArr.push({title:'标准:',content:this.props.item.standard})
				displayArr.push({title:'位号:',content:this.props.item.positionNo})
				displayArr.push({title:'质保书数:',content:this.props.item.warrantyCount})
				displayArr.push({title:'备注:',content:this.props.item.remark})
				break;
			case 6:
				displayArr.push({title:'出库单号:',content:this.props.item.extractNo})
				displayArr.push({title:'需求计划号:',content:this.props.item.planNo})
				displayArr.push({title:'质保编号:',content:this.props.item.warrantyNo})
				displayArr.push({title:'会计科目:',content:this.props.item.accounting})
				displayArr.push({title:'规格型号:',content:this.props.item.material.specificationNo})
				displayArr.push({title:'材质:',content:this.props.item.material.material})
				displayArr.push({title:'标准:',content:this.props.item.material.standard})
				displayArr.push({title:'核安全等级:',content:this.props.item.material.securityLevel})
				displayArr.push({title:'质保等级:',content:this.props.item.material.warrantyLevel})
				displayArr.push({title:'位号/炉批号:',content:this.props.item.material.positionNo})
				displayArr.push({title:'备注:',content:this.props.item.remark})
				break;
			case 7:
				displayArr.push({title:'需求计划号:',content:this.props.item.planNo})
				displayArr.push({title:'质保编号:',content:this.props.item.warrantyNo})
				displayArr.push({title:'会计科目:',content:this.props.item.accounting})
				displayArr.push({title:'规格型号:',content:this.props.item.material.specificationNo})
				displayArr.push({title:'材质:',content:this.props.item.material.material})
				displayArr.push({title:'标准:',content:this.props.item.material.standard})
				displayArr.push({title:'核安全等级:',content:this.props.item.material.securityLevel})
				displayArr.push({title:'质保等级:',content:this.props.item.material.warrantyLevel})
				displayArr.push({title:'位号/炉批号:',content:this.props.item.material.positionNo})
				displayArr.push({title:'备注:',content:this.props.item.remark})
				break;
			case 8:
				displayArr.push({title:'物项类别:',content:this.props.item.standard})
				displayArr.push({title:'物项编码:',content:this.props.item.standard})
				displayArr.push({title:'规格型号:',content:this.props.item.specificationNo})
				displayArr.push({title:'材质:',content:this.props.item.material})
				displayArr.push({title:'核安全等级:',content:this.props.item.securityLevel})
				displayArr.push({title:'质保等级:',content:this.props.item.warrantyLevel})
				displayArr.push({title:'标准:',content:this.props.item.standard})
				displayArr.push({title:'质保编号:',content:this.props.item.warrantyNo})
				break;
			case 9:
				displayArr.push({title:'出库单号:',content:this.props.item.extractNo})
				displayArr.push({title:'需求计划号:',content:this.props.item.planNo})
				displayArr.push({title:'规格型号:',content:this.props.item.material.specificationNo})
				displayArr.push({title:'材质:',content:this.props.item.material.material})
				displayArr.push({title:'标准:',content:this.props.item.material.standard})
				displayArr.push({title:'核安全等级:',content:this.props.item.material.securityLevel})
				displayArr.push({title:'质保等级:',content:this.props.item.material.warrantyLevel})
				displayArr.push({title:'质保编号:',content:this.props.item.warrantyNo})
				displayArr.push({title:'位号/炉批号:',content:this.props.item.material.positionNo})
				break;
		}
		displayArr.map( 
			(item,i) => {
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
				);
			}
		);
		if(viewArr.length > 0){
			return(
				<View style={{backgroundColor:'#fff', flexDirection:'column', marginTop:10, marginBottom:10}}>
					{viewArr}
				</View>
			);
		}
	}

	renderBottomButton(){
		if(this.props.type==3 || this.props.type==4 || this.props.type==7){
			let title = '入库';
			switch(this.props.type){
				case 3:
					title = '入库';
					break;
				case 4:
					title = '出库';
					break;	
				case 7:
					title = '退库';
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
		switch(this.props.type){
			case 3:
				this.props.navigator.push({component:InfoInputView,props:{title:'核实入库',type:1}})
				break;
			case 4:
				this.props.navigator.push({component:InfoInputView,props:{title:'核实出库',type:2,count:this.props.item.extractCount}})
				break;
			case 7:
				this.props.navigator.push({component:InfoInputView,props:{title:'核实退库',type:3,count:this.props.item.extractCount}})
				break;
		}
	}

}