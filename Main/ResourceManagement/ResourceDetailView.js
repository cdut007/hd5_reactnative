import React, {Component} from 'react';
import {View, Text, ScrollView} from 'react-native';

import NavBar from '../../common/NavBar';
import SeparateComponent from '../../common/SeparateComponent';

/*
 *必须参数: type(详情类型: 1-出库详情) item(数据源)
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
				displayArr.push({title1:'保管员:',content1:this.props.item.keeper,title2:'计划签发:',content2:this.props.item.signDate})
				break;
		}
		displayArr.map(
			(item,i) => {
				viewArr.push(
						<View>
							<View key={i} style={{height:48,flexDirection:'row'}}>
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
		}
		displayArr.map(
			(item,i) => {
				viewArr.push(
					<View>
						<View key={i} style={{height:48, flexDirection:'row', alignItems:'center'}}>
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

}